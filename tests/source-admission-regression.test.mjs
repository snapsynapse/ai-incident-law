import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

import { datasetSnapshot, packetDigest } from "../scripts/lib/source-admission.mjs";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);

test("included records cannot lose every supporting source", async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), "aiel-source-admission-red-"));
  try {
    await cp(path.join(ROOT, "scripts"), path.join(fixture, "scripts"), { recursive: true });
    await cp(path.join(ROOT, "data"), path.join(fixture, "data"), { recursive: true });
    const dataPath = path.join(fixture, "data", "data.json");
    const data = JSON.parse(await readFile(dataPath, "utf8"));
    const record = data.datasets.included.records.find(item => item.error_id === "AIEL-2023-002");
    delete record.public_record_link;
    delete record.secondary_source_links;
    delete record.best_available_sources;
    delete record.notes_on_resolution;
    await writeFile(dataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");

    const result = spawnSync(process.execPath, [path.join(fixture, "scripts", "validate-data.mjs")], {
      cwd: fixture,
      encoding: "utf8",
    });
    assert.equal(result.status, 1, "validate-data accepted an included record with no supporting source");
    assert.match(result.stderr, /supporting source/i);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test("future Verified dates fail native validation", async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), "aiel-source-admission-future-"));
  try {
    await cp(path.join(ROOT, "scripts"), path.join(fixture, "scripts"), { recursive: true });
    await cp(path.join(ROOT, "data"), path.join(fixture, "data"), { recursive: true });
    const dataPath = path.join(fixture, "data", "data.json");
    const data = JSON.parse(await readFile(dataPath, "utf8"));
    data.datasets.included.records[0].last_verified_date = "2999-01-01";
    await writeFile(dataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");

    const result = spawnSync(process.execPath, [path.join(fixture, "scripts", "validate-data.mjs")], {
      cwd: fixture,
      encoding: "utf8",
    });
    assert.equal(result.status, 1, "validate-data accepted a future Verified date");
    assert.match(result.stderr, /cannot be in the future/);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test("build:of rejects a pending receipt before writing projections", async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), "aiel-source-admission-build-"));
  try {
    await cp(path.join(ROOT, "scripts"), path.join(fixture, "scripts"), { recursive: true });
    await cp(path.join(ROOT, "data"), path.join(fixture, "data"), { recursive: true });
    const data = JSON.parse(await readFile(path.join(fixture, "data", "data.json"), "utf8"));
    const targetKey = "included/AIEL-2024-003";
    const snapshot = datasetSnapshot(data)[targetKey];
    const receipt = {
      baseline_sha256: snapshot.sha256,
      record_sha256: snapshot.sha256,
      evidence: {},
      units: {},
      unresolved: [],
      review: {
        actor: "build-regression",
        actor_type: "agent",
        decision: "pending",
        scope: "Synthetic pending receipt.",
        reviewed_at: "2026-09-09T14:00:00Z"
      }
    };
    receipt.review.packet_sha256 = packetDigest(receipt);
    const receiptsPath = path.join(fixture, "data", "admission", "receipts.json");
    const receipts = JSON.parse(await readFile(receiptsPath, "utf8"));
    receipts.records[targetKey] = receipt;
    await writeFile(receiptsPath, JSON.stringify(receipts, null, 2) + "\n");

    const result = spawnSync(process.execPath, [path.join(fixture, "scripts", "build-obligation-first.mjs")], {
      cwd: fixture,
      encoding: "utf8",
    });
    assert.equal(result.status, 1, "build:of emitted projections from a pending admission receipt");
    assert.match(result.stderr, /Pending or rejected review/);
    assert.equal(existsSync(path.join(fixture, "api", "v1", "of")), false);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test("npm pack fails before creating an archive when native data is unadmitted", async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), "aiel-source-admission-pack-"));
  try {
    await cp(path.join(ROOT, "scripts"), path.join(fixture, "scripts"), { recursive: true });
    await cp(path.join(ROOT, "data"), path.join(fixture, "data"), { recursive: true });
    await cp(path.join(ROOT, "package.json"), path.join(fixture, "package.json"));
    const git = args => spawnSync("git", args, { cwd: fixture, encoding: "utf8" });
    assert.equal(git(["init", "--quiet"]).status, 0);
    assert.equal(git(["add", "."]).status, 0);
    assert.equal(git([
      "-c", "user.name=Admission Test",
      "-c", "user.email=admission@example.invalid",
      "-c", "commit.gpgsign=false",
      "commit", "--quiet", "-m", "valid source state"
    ]).status, 0);

    const dataPath = path.join(fixture, "data", "data.json");
    const data = JSON.parse(await readFile(dataPath, "utf8"));
    data.datasets.included.records.find(record => record.error_id === "AIEL-2024-003").notes_on_resolution += " Unreviewed mutation.";
    await writeFile(dataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
    const packDir = path.join(fixture, "pack");
    await mkdir(packDir);
    const result = spawnSync("npm", ["pack", "--pack-destination", packDir], {
      cwd: fixture,
      encoding: "utf8",
      env: { ...process.env, npm_config_cache: path.join(fixture, "npm-cache") }
    });
    assert.equal(result.status, 1, "npm pack created an archive from an unadmitted native change");
    assert.match(result.stdout + result.stderr, /Changed or new native record requires an admission receipt/);
    assert.deepEqual(await readdir(packDir), [], "failed prepack left a package archive behind");
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});
