import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { cp, mkdtemp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

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
  assert.deepEqual(proceeding.hasDetermination, ["https://aiincidentlaw.org/determination/aiel-2023-002-determination.json"]);
  assert.equal(proceeding.source, matter.public_record_link);
  assert.equal(proceeding.source_locator, matter.public_matter_name);
  assert.equal(proceeding.verified, "2026-09-01");

  assert.equal(allegation.text, matter.error_description);
  assert.equal(allegation.source, matter.public_record_link);
  assert.deepEqual(determination.decides, ["https://aiincidentlaw.org/allegation/aiel-2023-002-allegation.json"]);
  assert.equal(determination.issued_date, "2023-06-22");
  assert.match(determination.notes, /Peter LoDuca, Steven Schwartz, and Levidow, Levidow & Oberman P\.C\./);
  assert.equal(determination.source, matter.public_record_link);
  assert.equal(determination.source_locator, matter.public_matter_name);
  assert.equal(determination.verified, "2026-09-01");
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
