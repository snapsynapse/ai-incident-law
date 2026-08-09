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
