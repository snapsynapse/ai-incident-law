import assert from "node:assert/strict";
import { cp, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  datasetSnapshot,
  hash,
  packetDigest,
  validateAdmission
} from "../scripts/lib/source-admission.mjs";
import { runSourceAdmission } from "../scripts/check-source-admission.mjs";

const BASE_COMMIT = "8d8c7913d2015c05ea133f0846c3472807b68005";
const REVIEWED_AT = "2026-09-09T14:00:00Z";
const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const SOURCE_TEXT = [
  "Official Agency",
  "Final Decision 42",
  "This final decision states that an AI system produced fabricated citations in the filing.",
  "The tribunal imposed a sanction after reviewing the complaint."
].join("\n");

function record(overrides = {}) {
  return {
    error_id: "AIEL-TEST-001",
    error_title: "Synthetic source admission matter",
    ai_system_name: "Example AI",
    error_description: "The source states that an AI system produced fabricated citations.",
    public_matter_name: "In re Synthetic Matter",
    public_matter_type: "tribunal decision",
    filing_status: "filed",
    jurisdiction: "Official Agency",
    filing_date: "2026-09-01",
    public_record_link: "https://agency.example/decisions/42",
    notes_on_resolution: "The matter was filed and remains unresolved.",
    source_quality: "primary record",
    research_status: "included",
    last_verified_date: "2026-09-01",
    tags: "synthetic-fixture",
    ...overrides
  };
}

function dataOf(item) {
  return {
    generated_at: "2026-09-09",
    datasets: {
      included: { records: [item] },
      review: { records: [] },
      global: { records: [] }
    }
  };
}

function legacyOf(data) {
  const records = {};
  for (const [key, snapshot] of Object.entries(datasetSnapshot(data))) {
    records[key] = {
      sha256: snapshot.sha256,
      units: Object.fromEntries(Object.entries(snapshot.units).map(([unit, value]) => [unit, value.sha256]))
    };
  }
  return {
    version: 1,
    status: "legacy-unreviewed",
    base_commit: BASE_COMMIT,
    record_count: Object.keys(records).length,
    records
  };
}

async function writeSource(root, text = SOURCE_TEXT) {
  const relative = "data/admission/raw/synthetic/decision-42.txt";
  await mkdir(path.join(root, path.dirname(relative)), { recursive: true });
  await writeFile(path.join(root, relative), text, "utf8");
  return { relative, bytes: Buffer.from(text) };
}

function receiptFor({ before, after, source, evidence = {}, review = {} }) {
  const beforeSnapshot = datasetSnapshot(before)["included/AIEL-TEST-001"];
  const afterSnapshot = datasetSnapshot(after)["included/AIEL-TEST-001"];
  const changed = [...new Set([...Object.keys(beforeSnapshot.units), ...Object.keys(afterSnapshot.units)])]
    .filter(unit => beforeSnapshot.units[unit]?.sha256 !== afterSnapshot.units[unit]?.sha256);
  const sourceEvidence = {
    path: source.relative,
    sha256: hash(source.bytes),
    acquisition: "retained_snapshot",
    official_url: "https://agency.example/decisions/42",
    document_id: "decision-42",
    document_title: "Final Decision 42",
    issuing_body: "Official Agency",
    document_type: "final decision",
    source_role: "primary record",
    version: "issued 2026-09-01",
    identity_excerpts: ["Official Agency", "Final Decision 42"],
    locator: "Findings paragraph 4",
    excerpt: "This final decision states that an AI system produced fabricated citations in the filing.",
    ai_attribution_excerpt: "an AI system produced fabricated citations",
    ...evidence
  };
  const receipt = {
    baseline_sha256: beforeSnapshot.sha256,
    record_sha256: afterSnapshot.sha256,
    evidence: { primary: sourceEvidence },
    units: Object.fromEntries(changed.map(unit => [unit, {
      before_sha256: beforeSnapshot.units[unit]?.sha256 || null,
      after_sha256: afterSnapshot.units[unit]?.sha256 || null,
      candidate_content: afterSnapshot.units[unit]?.content ?? null,
      reason: "Synthetic changed claim is supported by the retained decision.",
      qualifications: {
        scope: "Only the changed synthetic field was reviewed.",
        exceptions: "No broader source or corpus conclusion.",
        time: "The review is limited to the issued decision version."
      },
      evidence: ["primary"]
    }])),
    unresolved: [],
    review: {
      actor: "source-admission-test",
      actor_type: "agent",
      decision: "source-consistency-reviewed-changes",
      scope: "Synthetic regression fixture only.",
      reviewed_at: REVIEWED_AT,
      ...review
    }
  };
  receipt.review.packet_sha256 = packetDigest(receipt);
  return receipt;
}

async function fixture() {
  const root = await mkdtemp(path.join(tmpdir(), "aiel-source-admission-"));
  const source = await writeSource(root);
  const before = dataOf(record());
  return { root, source, before, legacy: legacyOf(before) };
}

test("unchanged baseline remains explicit legacy-unreviewed debt", async () => {
  const f = await fixture();
  try {
    const result = validateAdmission({
      data: f.before,
      legacy: f.legacy,
      admissions: { version: 1, records: {} },
      root: f.root
    });
    assert.equal(result.status, "passed");
    assert.equal(result.protected_native_records, 1);
    assert.equal(result.legacy_unreviewed_records, 1);
    assert.equal(result.records_with_reviewed_changes, 0);
  } finally {
    await rm(f.root, { recursive: true, force: true });
  }
});

test("changed claims require a receipt and exact before/after unit binding", async () => {
  const f = await fixture();
  try {
    const after = dataOf(record({ notes_on_resolution: "The retained final decision imposed a sanction." }));
    const missing = validateAdmission({
      data: after,
      legacy: f.legacy,
      admissions: { version: 1, records: {} },
      root: f.root
    });
    assert.equal(missing.status, "failed");
    assert.match(missing.errors.join("\n"), /requires an admission receipt/);

    const receipt = receiptFor({ before: f.before, after, source: f.source });
    const accepted = validateAdmission({
      data: after,
      legacy: f.legacy,
      admissions: { version: 1, records: { "included/AIEL-TEST-001": receipt } },
      root: f.root
    });
    assert.equal(accepted.status, "passed", accepted.errors.join("\n"));
    assert.equal(accepted.records_with_reviewed_changes, 1);
    assert.equal(accepted.legacy_unreviewed_records, 0);

    receipt.units["field:notes_on_resolution"].after_sha256 = "0".repeat(64);
    receipt.review.packet_sha256 = packetDigest(receipt);
    const stale = validateAdmission({
      data: after,
      legacy: f.legacy,
      admissions: { version: 1, records: { "included/AIEL-TEST-001": receipt } },
      root: f.root
    });
    assert.equal(stale.status, "failed");
    assert.match(stale.errors.join("\n"), /Stale after-unit binding/);
  } finally {
    await rm(f.root, { recursive: true, force: true });
  }
});

test("changed included source quality rejects an unknown role", async () => {
  const f = await fixture();
  try {
    const after = dataOf(record({ source_quality: "mystery source tier" }));
    const receipt = receiptFor({ before: f.before, after, source: f.source });
    const result = validateAdmission({
      data: after,
      legacy: f.legacy,
      admissions: { version: 1, records: { "included/AIEL-TEST-001": receipt } },
      root: f.root
    });
    assert.equal(result.status, "failed");
    assert.match(result.errors.join("\n"), /Unsupported changed source_quality/);
  } finally {
    await rm(f.root, { recursive: true, force: true });
  }
});

test("changed included source quality must match the retained source role and current link", async () => {
  const f = await fixture();
  try {
    const after = dataOf(record({ source_quality: "official statement" }));
    const receipt = receiptFor({
      before: f.before,
      after,
      source: f.source,
      evidence: { source_role: "primary record" }
    });
    const result = validateAdmission({
      data: after,
      legacy: f.legacy,
      admissions: { version: 1, records: { "included/AIEL-TEST-001": receipt } },
      root: f.root
    });
    assert.equal(result.status, "failed");
    assert.match(result.errors.join("\n"), /source_quality must match retained source role/);
  } finally {
    await rm(f.root, { recursive: true, force: true });
  }
});

test("wrong document identity fails closed", async () => {
  const f = await fixture();
  try {
    const after = dataOf(record({ notes_on_resolution: "The retained final decision imposed a sanction." }));
    const receipt = receiptFor({
      before: f.before,
      after,
      source: f.source,
      evidence: { identity_excerpts: ["Official Agency", "Unrelated Decision 99"] }
    });
    const result = validateAdmission({
      data: after,
      legacy: f.legacy,
      admissions: { version: 1, records: { "included/AIEL-TEST-001": receipt } },
      root: f.root
    });
    assert.equal(result.status, "failed");
    assert.match(result.errors.join("\n"), /identity excerpt absent/);
  } finally {
    await rm(f.root, { recursive: true, force: true });
  }
});

test("self-generated source evidence fails closed", async () => {
  const f = await fixture();
  try {
    const after = dataOf(record({ notes_on_resolution: "The retained final decision imposed a sanction." }));
    const receipt = receiptFor({
      before: f.before,
      after,
      source: f.source,
      evidence: { official_url: "https://aiincidentlaw.org/data/data.json" }
    });
    const result = validateAdmission({
      data: after,
      legacy: f.legacy,
      admissions: { version: 1, records: { "included/AIEL-TEST-001": receipt } },
      root: f.root
    });
    assert.equal(result.status, "failed");
    assert.match(result.errors.join("\n"), /cannot serve as primary admission evidence/);
  } finally {
    await rm(f.root, { recursive: true, force: true });
  }
});

test("a complaint cannot support adjudicative status promotion", async () => {
  const f = await fixture();
  try {
    const after = dataOf(record({ filing_status: "sanctioned" }));
    const receipt = receiptFor({
      before: f.before,
      after,
      source: f.source,
      evidence: { document_type: "complaint" }
    });
    const result = validateAdmission({
      data: after,
      legacy: f.legacy,
      admissions: { version: 1, records: { "included/AIEL-TEST-001": receipt } },
      root: f.root
    });
    assert.equal(result.status, "failed");
    assert.match(result.errors.join("\n"), /complaint is not an order/);
  } finally {
    await rm(f.root, { recursive: true, force: true });
  }
});

test("a final order can support an adjudicative status change", async () => {
  const f = await fixture();
  try {
    const after = dataOf(record({ filing_status: "sanctioned" }));
    const receipt = receiptFor({
      before: f.before,
      after,
      source: f.source,
      evidence: { document_type: "final order" }
    });
    const result = validateAdmission({
      data: after,
      legacy: f.legacy,
      admissions: { version: 1, records: { "included/AIEL-TEST-001": receipt } },
      root: f.root
    });
    assert.equal(result.status, "passed", result.errors.join("\n"));
  } finally {
    await rm(f.root, { recursive: true, force: true });
  }
});

test("a complaint cannot support changed determination remedy notes", async () => {
  const f = await fixture();
  try {
    const before = dataOf(record({ filing_status: "sanctioned" }));
    const legacy = legacyOf(before);
    const after = dataOf(record({
      filing_status: "sanctioned",
      notes_on_resolution: "The changed notes claim that the tribunal imposed a sanction."
    }));
    const receipt = receiptFor({
      before,
      after,
      source: f.source,
      evidence: { document_type: "complaint" }
    });
    const result = validateAdmission({
      data: after,
      legacy,
      admissions: { version: 1, records: { "included/AIEL-TEST-001": receipt } },
      root: f.root
    });
    assert.equal(result.status, "failed");
    assert.match(result.errors.join("\n"), /complaint is not an order/);
  } finally {
    await rm(f.root, { recursive: true, force: true });
  }
});

test("changed AI attribution must be locatable in retained source bytes", async () => {
  const f = await fixture();
  try {
    const after = dataOf(record({ ai_system_name: "Different AI" }));
    const receipt = receiptFor({ before: f.before, after, source: f.source });
    delete receipt.evidence.primary.ai_attribution_excerpt;
    receipt.review.packet_sha256 = packetDigest(receipt);
    const result = validateAdmission({
      data: after,
      legacy: f.legacy,
      admissions: { version: 1, records: { "included/AIEL-TEST-001": receipt } },
      root: f.root
    });
    assert.equal(result.status, "failed");
    assert.match(result.errors.join("\n"), /AI attribution requires/);
  } finally {
    await rm(f.root, { recursive: true, force: true });
  }
});

test("non-English changed records retain original quotation and English rendering", async () => {
  const f = await fixture();
  try {
    const after = dataOf(record({
      tags: "synthetic-fixture; source-language-dutch",
      notes_on_resolution: "The retained decision imposed a sanction."
    }));
    const receipt = receiptFor({ before: f.before, after, source: f.source });
    const result = validateAdmission({
      data: after,
      legacy: f.legacy,
      admissions: { version: 1, records: { "included/AIEL-TEST-001": receipt } },
      root: f.root
    });
    assert.equal(result.status, "failed");
    assert.match(result.errors.join("\n"), /original-language evidence and an English rendering/);
  } finally {
    await rm(f.root, { recursive: true, force: true });
  }
});

test("agent review cannot renew Verified", async () => {
  const f = await fixture();
  try {
    const after = dataOf(record({ last_verified_date: "2026-09-02" }));
    const receipt = receiptFor({ before: f.before, after, source: f.source });
    const result = validateAdmission({
      data: after,
      legacy: f.legacy,
      admissions: { version: 1, records: { "included/AIEL-TEST-001": receipt } },
      root: f.root
    });
    assert.equal(result.status, "failed");
    assert.match(result.errors.join("\n"), /Agent review cannot renew Verified/);
  } finally {
    await rm(f.root, { recursive: true, force: true });
  }
});

test("prior accepted receipt cannot be dropped to restore legacy status", async () => {
  const f = await fixture();
  try {
    const prior = { version: 1, records: { "included/AIEL-TEST-001": { historical: true } } };
    const result = validateAdmission({
      data: f.before,
      legacy: f.legacy,
      admissions: { version: 1, records: {} },
      priorAdmissions: prior,
      root: f.root
    });
    assert.equal(result.status, "failed");
    assert.match(result.errors.join("\n"), /cannot be dropped/);
  } finally {
    await rm(f.root, { recursive: true, force: true });
  }
});

test("stale source bytes and post-review packet mutation fail", async () => {
  const f = await fixture();
  try {
    const after = dataOf(record({ notes_on_resolution: "The retained final decision imposed a sanction." }));
    const receipt = receiptFor({ before: f.before, after, source: f.source });
    receipt.review.scope = "Mutated after acceptance.";
    let result = validateAdmission({
      data: after,
      legacy: f.legacy,
      admissions: { version: 1, records: { "included/AIEL-TEST-001": receipt } },
      root: f.root
    });
    assert.equal(result.status, "failed");
    assert.match(result.errors.join("\n"), /packet changed after acceptance/);

    const freshReceipt = receiptFor({ before: f.before, after, source: f.source });
    await writeFile(path.join(f.root, f.source.relative), SOURCE_TEXT + "\nMutated source bytes.\n", "utf8");
    result = validateAdmission({
      data: after,
      legacy: f.legacy,
      admissions: { version: 1, records: { "included/AIEL-TEST-001": freshReceipt } },
      root: f.root
    });
    assert.equal(result.status, "failed");
    assert.match(result.errors.join("\n"), /Source hash changed/);
  } finally {
    await rm(f.root, { recursive: true, force: true });
  }
});

test("pending decisions and impossible or future review timestamps fail", async () => {
  const f = await fixture();
  try {
    const after = dataOf(record({ notes_on_resolution: "The retained final decision imposed a sanction." }));
    for (const [mutation, expected] of [
      [receipt => { receipt.review.decision = "pending"; }, /Pending or rejected review/],
      [receipt => { receipt.review.decision = "rejected"; }, /Pending or rejected review/],
      [receipt => { receipt.review.reviewed_at = "2026-02-30T12:00:00Z"; }, /real, non-future UTC timestamp/],
      [receipt => { receipt.review.reviewed_at = "2999-01-01T00:00:00Z"; }, /real, non-future UTC timestamp/]
    ]) {
      const receipt = receiptFor({ before: f.before, after, source: f.source });
      mutation(receipt);
      receipt.review.packet_sha256 = packetDigest(receipt);
      const result = validateAdmission({
        data: after,
        legacy: f.legacy,
        admissions: { version: 1, records: { "included/AIEL-TEST-001": receipt } },
        root: f.root
      });
      assert.equal(result.status, "failed");
      assert.match(result.errors.join("\n"), expected);
    }
  } finally {
    await rm(f.root, { recursive: true, force: true });
  }
});

test("primary retrieval requires and verifies transport and original-byte evidence", async () => {
  const f = await fixture();
  try {
    const after = dataOf(record({ notes_on_resolution: "The retained final decision imposed a sanction." }));
    const retrieval = {
      http_status: 200,
      retrieved_at: REVIEWED_AT,
      final_url: "https://agency.example/decisions/42",
      content_type: "text/plain; charset=utf-8",
      original_path: f.source.relative,
      original_sha256: hash(f.source.bytes)
    };
    const acceptedReceipt = receiptFor({
      before: f.before,
      after,
      source: f.source,
      evidence: { acquisition: "primary_retrieval", retrieval }
    });
    let result = validateAdmission({
      data: after,
      legacy: f.legacy,
      admissions: { version: 1, records: { "included/AIEL-TEST-001": acceptedReceipt } },
      root: f.root
    });
    assert.equal(result.status, "passed", result.errors.join("\n"));

    for (const missing of ["final_url", "original_path", "original_sha256"]) {
      const broken = receiptFor({
        before: f.before,
        after,
        source: f.source,
        evidence: { acquisition: "primary_retrieval", retrieval: { ...retrieval } }
      });
      delete broken.evidence.primary.retrieval[missing];
      broken.review.packet_sha256 = packetDigest(broken);
      result = validateAdmission({
        data: after,
        legacy: f.legacy,
        admissions: { version: 1, records: { "included/AIEL-TEST-001": broken } },
        root: f.root
      });
      assert.equal(result.status, "failed");
      assert.match(result.errors.join("\n"), /retrieval URL|original|path must be nonempty/);
    }
  } finally {
    await rm(f.root, { recursive: true, force: true });
  }
});

test("retained snapshots cannot invent transport metadata", async () => {
  const f = await fixture();
  try {
    const after = dataOf(record({ notes_on_resolution: "The retained final decision imposed a sanction." }));
    const receipt = receiptFor({
      before: f.before,
      after,
      source: f.source,
      evidence: { retrieval: { http_status: 200 } }
    });
    const result = validateAdmission({
      data: after,
      legacy: f.legacy,
      admissions: { version: 1, records: { "included/AIEL-TEST-001": receipt } },
      root: f.root
    });
    assert.equal(result.status, "failed");
    assert.match(result.errors.join("\n"), /must not invent retrieval metadata/);
  } finally {
    await rm(f.root, { recursive: true, force: true });
  }
});

test("CLI default HEAD comparison prevents dropping an accepted receipt", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "aiel-source-admission-history-"));
  const savedBase = process.env.SOURCE_ADMISSION_BASE;
  try {
    await mkdir(path.join(root, "data", "admission"), { recursive: true });
    await cp(path.join(ROOT, "data", "data.json"), path.join(root, "data", "data.json"));
    await cp(path.join(ROOT, "data", "admission", "legacy.json"), path.join(root, "data", "admission", "legacy.json"));
    await writeFile(path.join(root, "data", "admission", "receipts.json"), JSON.stringify({
      version: 1,
      records: { "included/AIEL-2024-001": { historical: true } }
    }, null, 2) + "\n");
    execFileSync("git", ["init", "-q"], { cwd: root });
    execFileSync("git", ["config", "user.email", "source-admission@example.invalid"], { cwd: root });
    execFileSync("git", ["config", "user.name", "Source Admission Test"], { cwd: root });
    execFileSync("git", ["config", "commit.gpgsign", "false"], { cwd: root });
    execFileSync("git", ["add", "data"], { cwd: root });
    execFileSync("git", ["commit", "-q", "-m", "fixture: retain accepted receipt"], { cwd: root });
    await writeFile(path.join(root, "data", "admission", "receipts.json"), "{\n  \"version\": 1,\n  \"records\": {}\n}\n");
    delete process.env.SOURCE_ADMISSION_BASE;

    const report = await runSourceAdmission({ root });
    assert.equal(report.comparison_base, "HEAD");
    assert.equal(report.status, "failed");
    assert.match(report.errors.join("\n"), /cannot be dropped/);
  } finally {
    if (savedBase === undefined) delete process.env.SOURCE_ADMISSION_BASE;
    else process.env.SOURCE_ADMISSION_BASE = savedBase;
    await rm(root, { recursive: true, force: true });
  }
});
