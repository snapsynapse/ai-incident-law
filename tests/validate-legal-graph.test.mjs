import assert from "node:assert/strict";
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);

async function expectValidationFailure(mutate, expected) {
  const fixture = await mkdtemp(path.join(tmpdir(), "aiel-legal-graph-"));
  try {
    await cp(path.join(ROOT, "scripts"), path.join(fixture, "scripts"), { recursive: true });
    await cp(path.join(ROOT, "data"), path.join(fixture, "data"), { recursive: true });
    const dataPath = path.join(fixture, "data", "data.json");
    const data = JSON.parse(await readFile(dataPath, "utf8"));
    mutate(data);
    await writeFile(dataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");

    const result = spawnSync(process.execPath, [path.join(fixture, "scripts", "validate-data.mjs")], {
      cwd: fixture,
      encoding: "utf8",
    });
    assert.equal(result.status, 1, result.stderr || result.stdout);
    assert.match(result.stderr, expected);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
}

function projectedRecord(data) {
  const record = data.datasets.included.records.find(item => item.legal_graph?.authorities?.length);
  assert.ok(record, "fixture must contain a curated legal_graph projection");
  return record;
}

test("legal_graph rejects composite Authority names", async () => {
  await expectValidationFailure(data => {
    projectedRecord(data).legal_graph.authorities[0].name += "; Another Authority";
  }, /legal_graph authority must name one organization/);
});

test("legal_graph rejects undeclared Authority references", async () => {
  await expectValidationFailure(data => {
    projectedRecord(data).legal_graph.proceedings[0].heard_by = ["undeclared-authority"];
  }, /references undeclared authority undeclared-authority/);
});

test("legal_graph rejects undeclared Determination references", async () => {
  await expectValidationFailure(data => {
    projectedRecord(data).legal_graph.proceedings[0].determination_ids = ["undeclared-determination"];
  }, /references undeclared determination undeclared-determination/);
});

test("legal_graph rejects malformed identifier retirements", async () => {
  await expectValidationFailure(data => {
    const record = data.datasets.included.records.find(item => item.legal_graph?.retired_identifiers?.length);
    assert.ok(record, "fixture must contain a retired graph identifier");
    delete record.legal_graph.retired_identifiers[0].reason;
  }, /must explain the retirement/);
});

test("legal_graph rejects duplicate projection IDs", async () => {
  await expectValidationFailure(data => {
    const record = projectedRecord(data);
    record.legal_graph.authorities.push({ ...record.legal_graph.authorities[0] });
  }, /legal_graph duplicates authority/);
});

test("legal_graph is limited to admitted included records", async () => {
  await expectValidationFailure(data => {
    const record = data.datasets.review.records[0];
    record.legal_graph = { authorities: [] };
  }, /legal_graph must be an object on an included record/);
});
