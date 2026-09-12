import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { cp, mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

import { datasetSnapshot } from "../scripts/lib/source-admission.mjs";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);

function runScript(fixture, script, env = {}) {
  const result = spawnSync(process.execPath, [path.join(fixture, "scripts", script)], {
    cwd: fixture,
    encoding: "utf8",
    env: { ...process.env, ...env },
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
}

async function treeHashes(root, dir = root, output = {}) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await treeHashes(root, full, output);
    else if (entry.isFile()) {
      output[path.relative(root, full)] = createHash("sha256").update(await readFile(full)).digest("hex");
    }
  }
  return Object.fromEntries(Object.entries(output).sort(([a], [b]) => a.localeCompare(b)));
}

async function freezeSyntheticAdmissionBaseline(fixture) {
  const data = JSON.parse(await readFile(path.join(fixture, "data", "data.json"), "utf8"));
  const records = {};
  for (const [key, snapshot] of Object.entries(datasetSnapshot(data))) {
    records[key] = {
      sha256: snapshot.sha256,
      units: Object.fromEntries(Object.entries(snapshot.units).map(([unit, value]) => [unit, value.sha256]))
    };
  }
  const legacy = JSON.stringify({
    version: 1,
    status: "legacy-unreviewed",
    base_commit: "8d8c7913d2015c05ea133f0846c3472807b68005",
    record_count: Object.keys(records).length,
    records
  }, null, 2) + "\n";
  await writeFile(path.join(fixture, "data", "admission", "legacy.json"), legacy);
  await writeFile(path.join(fixture, "data", "admission", "receipts.json"), "{\n  \"version\": 1,\n  \"records\": {}\n}\n");
  const modulePath = path.join(fixture, "scripts", "lib", "source-admission.mjs");
  const moduleText = await readFile(modulePath, "utf8");
  const baselineHash = createHash("sha256").update(legacy).digest("hex");
  await writeFile(modulePath, moduleText.replace(
    /export const LEGACY_SHA256 = "[a-f0-9]{64}";/,
    `export const LEGACY_SHA256 = "${baselineHash}";`
  ));
}

test("build:of removes stale companion artifacts", async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), "aiel-build-of-"));
  try {
    await cp(path.join(ROOT, "scripts"), path.join(fixture, "scripts"), { recursive: true });
    await cp(path.join(ROOT, "data"), path.join(fixture, "data"), { recursive: true });

    const staleDir = path.join(fixture, "determination");
    const staleFile = path.join(staleDir, "aiel-2026-039-determination.json");
    const staleFlatDir = path.join(fixture, "api", "v1", "of", "records");
    const staleFlatFile = path.join(staleFlatDir, "stale.json");
    await mkdir(staleDir, { recursive: true });
    await mkdir(staleFlatDir, { recursive: true });
    await writeFile(staleFile, "{}\n", "utf8");
    await writeFile(staleFlatFile, "{}\n", "utf8");

    runScript(fixture, "build-obligation-first.mjs");

    await assert.rejects(readFile(staleFile, "utf8"), { code: "ENOENT" });
    await assert.rejects(readFile(staleFlatFile, "utf8"), { code: "ENOENT" });
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test("complete generated export is byte-deterministic across UTC and America/Denver", async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), "aiel-deterministic-build-"));
  try {
    await cp(path.join(ROOT, "scripts"), path.join(fixture, "scripts"), { recursive: true });
    await cp(path.join(ROOT, "data"), path.join(fixture, "data"), { recursive: true });
    runScript(fixture, "build-data.mjs", { TZ: "UTC" });
    runScript(fixture, "build-obligation-first.mjs", { TZ: "UTC" });
    const first = await treeHashes(fixture);

    runScript(fixture, "build-data.mjs", { TZ: "America/Denver" });
    runScript(fixture, "build-obligation-first.mjs", { TZ: "America/Denver" });
    const second = await treeHashes(fixture);
    assert.deepEqual(second, first);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test("filed matters remain unresolved and preserve retired Determination IRIs", async () => {
  const source = JSON.parse(await readFile(path.join(ROOT, "data", "data.json"), "utf8"));
  const determinations = JSON.parse(await readFile(path.join(ROOT, "api", "v1", "of", "determinations.json"), "utf8")).determinations;
  const tombstones = JSON.parse(await readFile(path.join(ROOT, "api", "v1", "of", "tombstones.json"), "utf8")).tombstones;
  const filedIds = source.datasets.included.records.filter(record => record.filing_status === "filed").map(record => record.error_id);
  assert.deepEqual(filedIds.sort(), ["AIEL-2026-019", "AIEL-2026-020"]);
  for (const id of filedIds) {
    assert.equal(determinations.some(record => record.ai_incident_law_record_id === id), false);
    const iri = `https://aiincidentlaw.org/determination/${id.toLowerCase()}-determination.json`;
    assert.ok(tombstones.some(record => record["@id"] === iri && record.former_type === "of:Determination"));
  }
});

test("procedural graph uses distinct Authorities for formerly composite matters", async () => {
  const authorities = JSON.parse(await readFile(path.join(ROOT, "api", "v1", "of", "authorities.json"), "utf8")).authorities;
  const proceedings = JSON.parse(await readFile(path.join(ROOT, "api", "v1", "of", "proceedings.json"), "utf8")).proceedings;
  const determinations = JSON.parse(await readFile(path.join(ROOT, "api", "v1", "of", "determinations.json"), "utf8")).determinations;
  const tombstones = JSON.parse(await readFile(path.join(ROOT, "api", "v1", "of", "tombstones.json"), "utf8")).tombstones;

  assert.equal(authorities.some(record => record.organization.name.includes(";")), false);
  assert.equal(tombstones.filter(record => record.former_type === "of:Authority").length, 6);

  const michiganStages = proceedings.filter(record => record.ai_incident_law_record_id === "AIEL-2022-011");
  assert.deepEqual(michiganStages.map(record => record.procedural_stage).sort(), ["appeal", "trial"]);
  assert.deepEqual(michiganStages.flatMap(record => record.heardBy).sort(), [
    "https://aiincidentlaw.org/authority/michigan-court-of-claims.json",
    "https://aiincidentlaw.org/authority/michigan-supreme-court.json",
  ]);

  const neusom = determinations.find(record => record.id === "aiel-2024-008-determination");
  assert.deepEqual(neusom.issuedBy, ["https://aiincidentlaw.org/authority/u-s-district-court-middle-district-of-florida.json"]);
  assert.equal(neusom.issued_date, "2024-03-08");
});

test("Mata source projection separates federal removal from sanctions issuance", async () => {
  const source = JSON.parse(await readFile(path.join(ROOT, "data", "data.json"), "utf8"));
  const proceedings = JSON.parse(await readFile(path.join(ROOT, "api", "v1", "of", "proceedings.json"), "utf8")).proceedings;
  const allegations = JSON.parse(await readFile(path.join(ROOT, "api", "v1", "of", "allegations.json"), "utf8")).allegations;
  const determinations = JSON.parse(await readFile(path.join(ROOT, "api", "v1", "of", "determinations.json"), "utf8")).determinations;
  const matter = source.datasets.included.records.find(record => record.error_id === "AIEL-2023-002");
  const proceeding = proceedings.find(record => record.id === "aiel-2023-002-proceeding");
  const allegation = allegations.find(record => record.id === "aiel-2023-002-allegation");
  const determination = determinations.find(record => record.id === "aiel-2023-002-determination");

  assert.equal(matter.public_matter_type, "sanctions order");
  assert.equal(matter.filing_date, "2023-06-22");
  assert.match(matter.notes_on_resolution, /^The June 22, 2023 Opinion and Order on Sanctions/);
  assert.match(matter.notes_on_resolution, /indexed filing_date is the sanctions opinion and order filing date/);
  assert.equal(matter.public_record_link, "https://storage.courtlistener.com/recap/gov.uscourts.nysd.575368/gov.uscourts.nysd.575368.54.0_8.pdf");
  assert.equal(matter.public_matter_name, "Mata v. Avianca, Inc., No. 22-cv-1461");
  assert.equal(matter.last_verified_date, "2026-09-01");

  assert.equal(proceeding.filed_date, "2022-02-22");
  assert.equal(proceeding.filing_date_source, "2022-02-22");
  assert.equal(proceeding.procedural_stage, "federal-civil-action-after-removal");
  assert.equal(proceeding.projection_basis, "curated-legal-graph");
  assert.equal(proceeding.admission_status, "legacy-unreviewed");
  assert.equal(proceeding.matter_type, "federal civil action with ancillary sanctions proceeding");
  assert.equal(Object.hasOwn(proceeding, "parties"), false);
  assert.deepEqual(proceeding.hasDetermination, ["https://aiincidentlaw.org/determination/aiel-2023-002-determination.json"]);
  assert.equal(proceeding.source, matter.public_record_link);
  assert.equal(proceeding.source_locator, matter.public_matter_name);
  assert.equal(proceeding.verified, "2026-09-01");

  assert.equal(allegation.text, matter.error_description);
  assert.equal(allegation.projection_basis, "native-record-projection");
  assert.equal(allegation.admission_status, "legacy-unreviewed");
  assert.equal(allegation.source, matter.public_record_link);
  assert.deepEqual(allegation.related_to_party, ["https://aiincidentlaw.org/party/aiel-2023-002-deployer.json"]);
  assert.deepEqual(determination.decides, ["https://aiincidentlaw.org/allegation/aiel-2023-002-allegation.json"]);
  assert.equal(determination.issued_date, "2023-06-22");
  assert.equal(determination.projection_basis, "curated-legal-graph");
  assert.equal(determination.admission_status, "legacy-unreviewed");
  assert.match(determination.notes, /Peter LoDuca, Steven Schwartz, and Levidow, Levidow & Oberman P\.C\./);
  assert.equal(determination.source, matter.public_record_link);
  assert.equal(determination.source_locator, matter.public_matter_name);
  assert.equal(determination.verified, "2026-09-01");
});

test("Moffatt keeps the decision date off the proceeding and exposes reviewed-change limits", async () => {
  const authorities = JSON.parse(await readFile(path.join(ROOT, "api", "v1", "of", "authorities.json"), "utf8")).authorities;
  const proceedings = JSON.parse(await readFile(path.join(ROOT, "api", "v1", "of", "proceedings.json"), "utf8")).proceedings;
  const determinations = JSON.parse(await readFile(path.join(ROOT, "api", "v1", "of", "determinations.json"), "utf8")).determinations;
  const authority = authorities.find(record => record.id === "british-columbia-civil-resolution-tribunal");
  const proceeding = proceedings.find(record => record.id === "aiel-2024-001-proceeding");
  const determination = determinations.find(record => record.id === "aiel-2024-001-determination");

  assert.equal(authority.projection_basis, "legacy-jurisdiction-inference");
  assert.deepEqual(authority.sameAs, ["https://wikidata.org/entity/Q22631709"]);
  assert.equal(proceeding.filed_date, undefined);
  assert.equal(proceeding.filing_date_source, undefined);
  assert.deepEqual(proceeding.describesSameEntityAs, ["https://canlii.org/en/bc/bccrt/doc/2024/2024bccrt149/2024bccrt149.html"]);
  assert.equal(proceeding.projection_basis, "curated-legal-graph");
  assert.equal(proceeding.admission_status, "source-consistency-reviewed-changes");
  assert.equal(determination.issued_date, "2024-02-14");
  assert.equal(determination.anchors, undefined);
  assert.deepEqual(determination.describesSameEntityAs, ["https://canlii.org/en/bc/bccrt/doc/2024/2024bccrt149/2024bccrt149.html"]);
  assert.equal(determination.projection_basis, "curated-legal-graph");
  assert.equal(determination.admission_status, "source-consistency-reviewed-changes");
  assert.ok(determination.source_review_unresolved.some(value => /AI-attribution rule/.test(value)));
  assert.ok(determination.source_review_unresolved.some(value => /filing date/.test(value)));
  assert.equal(determination.source, "https://decisions.civilresolutionbc.ca/crt/crtd/en/525448/1/document.do");
});

test("source follow-up preserves source roles and keeps Mitchell pending human admission", async () => {
  const source = JSON.parse(await readFile(path.join(ROOT, "data", "data.json"), "utf8"));
  const authorities = JSON.parse(await readFile(path.join(ROOT, "api", "v1", "of", "authorities.json"), "utf8")).authorities;
  const proceedings = JSON.parse(await readFile(path.join(ROOT, "api", "v1", "of", "proceedings.json"), "utf8")).proceedings;
  const determinations = JSON.parse(await readFile(path.join(ROOT, "api", "v1", "of", "determinations.json"), "utf8")).determinations;
  const allegations = JSON.parse(await readFile(path.join(ROOT, "api", "v1", "of", "allegations.json"), "utf8")).allegations;
  const included = source.datasets.included.records;
  const parks = included.find(record => record.error_id === "AIEL-2024-015");
  const murphy = included.find(record => record.error_id === "AIEL-2024-017");
  const cnn = included.find(record => record.error_id === "AIEL-2026-020");
  const mitchell = source.datasets.review.records.find(record => record.candidate_id === "AIEL-CAND-031");
  const cnnAllegation = allegations.find(record => record.id === "aiel-2026-020-allegation");

  assert.equal(parks.source_quality, "primary record");
  assert.equal(parks.public_record_link, "https://storage.courtlistener.com/recap/gov.uscourts.njd.462874/gov.uscourts.njd.462874.125.0.pdf");
  assert.equal(parks.filing_status, "settled");
  assert.equal(murphy.source_quality, "primary record");
  assert.equal(murphy.public_record_link, "https://govinfo.gov/content/pkg/USCOURTS-txsd-4_24-cv-00801/pdf/USCOURTS-txsd-4_24-cv-00801-1.pdf");
  assert.equal(murphy.filing_status, "pending");
  assert.equal(cnn.public_record_link, "https://storage.courtlistener.com/recap/gov.uscourts.nysd.664916/gov.uscourts.nysd.664916.1.0_1.pdf");
  assert.equal(cnnAllegation.source, cnn.public_record_link);
  assert.equal(mitchell.last_checked_date, "2026-09-09");
  assert.equal(mitchell.best_available_sources, "https://foiadocuments.uspto.gov/oed/Mitchell-Order-D2026-16-Redacted.pdf");
  assert.match(mitchell.reason_for_review, /explicit per-candidate steward confirmation/);
  assert.equal(authorities.some(record => record.id === "uspto-office-of-enrollment-and-discipline"), false);
  assert.equal(proceedings.some(record => record.id === "aiel-2026-069-proceeding"), false);
  assert.equal(determinations.some(record => record.id === "aiel-2026-069-determination"), false);
});

test("partial filing dates remain source strings without fabricated day precision", async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), "aiel-date-precision-"));
  try {
    await cp(path.join(ROOT, "scripts"), path.join(fixture, "scripts"), { recursive: true });
    await cp(path.join(ROOT, "data"), path.join(fixture, "data"), { recursive: true });
    const file = path.join(fixture, "data/data.json");
    const source = JSON.parse(await readFile(file, "utf8"));
    const target = source.datasets.included.records.find(record => !record.legal_graph);
    for (const date of [undefined, "2025", "2025-04", "2025-04-17"]) {
      target.filing_date = date;
      await writeFile(file, JSON.stringify(source));
      await freezeSyntheticAdmissionBaseline(fixture);
      runScript(fixture, "build-obligation-first.mjs");
      const projected = JSON.parse(await readFile(path.join(fixture, "api/v1/of/proceedings.json"), "utf8")).proceedings.find(record => record.ai_incident_law_record_id === target.error_id);
      assert.equal(projected.filing_date_source, date);
      assert.equal(projected.filed_date, date?.length === 10 ? date : undefined);
      assert.equal(projected["@context"][1].filing_date_source, "ail:filingDateSource");
    }
  } finally { await rm(fixture, { recursive: true, force: true }); }
});

test("curated dates retain precedence and partial provenance and issuance dates stay absent", async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), "aiel-curated-date-precision-"));
  try {
    await cp(path.join(ROOT, "scripts"), path.join(fixture, "scripts"), { recursive: true });
    await cp(path.join(ROOT, "data"), path.join(fixture, "data"), { recursive: true });
    const file = path.join(fixture, "data/data.json");
    const source = JSON.parse(await readFile(file, "utf8"));
    const target = source.datasets.included.records.find(record =>
      record.legal_graph?.proceedings?.length && record.legal_graph?.determinations?.length);
    assert.ok(target, "fixture needs a curated proceeding and determination");
    const proceedingSource = target.legal_graph.proceedings[0];
    const determinationSource = target.legal_graph.determinations[0];
    target.filing_date = "2024-02-19";
    for (const date of [undefined, "2025", "2025-04", "2025-04-17"]) {
      proceedingSource.filed_date = date;
      determinationSource.issued_date = date;
      target.last_verified_date = date;
      await writeFile(file, JSON.stringify(source));
      await freezeSyntheticAdmissionBaseline(fixture);
      runScript(fixture, "build-obligation-first.mjs");
      const proceedings = JSON.parse(await readFile(path.join(fixture, "api/v1/of/proceedings.json"), "utf8")).proceedings;
      const determinations = JSON.parse(await readFile(path.join(fixture, "api/v1/of/determinations.json"), "utf8")).determinations;
      const proceeding = proceedings.find(record => record.id === proceedingSource.id);
      const determination = determinations.find(record => record.id === determinationSource.id);
      const exactDate = date?.length === 10 ? date : undefined;
      assert.equal(proceeding.filing_date_source, date || target.filing_date);
      assert.equal(proceeding.filed_date, date ? exactDate : target.filing_date);
      assert.equal(determination.issued_date, exactDate);
      assert.equal(proceeding.verified, exactDate);
      assert.equal(determination.verified, exactDate);
      for (const [kind, projected] of [["proceeding", proceeding], ["determination", determination]]) {
        for (const relative of [`${kind}/${projected.id}.json`, `api/v1/of/records/${projected.id}.json`]) {
          assert.deepEqual(JSON.parse(await readFile(path.join(fixture, relative), "utf8")), projected);
        }
      }
    }
  } finally { await rm(fixture, { recursive: true, force: true }); }
});
