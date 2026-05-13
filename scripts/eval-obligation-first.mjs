#!/usr/bin/env node

import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const apiDir = path.join(root, "api", "v1", "of");
const recordsDir = path.join(apiDir, "records");
const companionDirs = {
  authorities: "authority",
  proceedings: "proceeding",
  allegations: "allegation",
  determinations: "determination"
};
const failures = [];

async function readJson(file) {
  return JSON.parse(await readFile(file, "utf8"));
}

function stable(value) {
  return JSON.stringify(value, null, 2);
}

function fail(message) {
  failures.push(message);
}

const indexPath = path.join(apiDir, "index.json");
if (!existsSync(indexPath)) fail("missing api/v1/of/index.json");

const index = existsSync(indexPath) ? await readJson(indexPath) : { files: {}, counts: {} };
const recordsById = new Map();
const expectedFlatFiles = new Set();
const byKind = {};

for (const [kind, fileName] of Object.entries(index.files || {})) {
  const aggregateFile = path.join(apiDir, fileName);
  if (!existsSync(aggregateFile)) {
    fail(`missing aggregate ${fileName}`);
    continue;
  }

  const aggregate = await readJson(aggregateFile);
  const records = aggregate[kind] || [];
  byKind[kind] = records;
  if (index.counts?.[kind] !== records.length) fail(`${kind} count mismatch`);

  for (const record of records) {
    if (!record.id) {
      fail(`${kind} record missing id: ${record["@id"] || "(missing @id)"}`);
      continue;
    }
    if (recordsById.has(record["@id"])) fail(`duplicate @id ${record["@id"]}`);
    recordsById.set(record["@id"], record);
    expectedFlatFiles.add(`${record.id}.json`);

    const flatFile = path.join(recordsDir, `${record.id}.json`);
    if (!existsSync(flatFile)) {
      fail(`missing flat record ${path.relative(root, flatFile)}`);
    } else if (stable(await readJson(flatFile)) !== stable(record)) {
      fail(`flat record differs from aggregate ${path.relative(root, flatFile)}`);
    }

    const companionDir = companionDirs[kind];
    const companionFile = path.join(root, companionDir, `${record.id}.json`);
    if (!existsSync(companionFile)) {
      fail(`missing companion record ${path.relative(root, companionFile)}`);
    } else if (stable(await readJson(companionFile)) !== stable(record)) {
      fail(`companion record differs from aggregate ${path.relative(root, companionFile)}`);
    }
  }
}

if (existsSync(recordsDir)) {
  for (const fileName of await readdir(recordsDir)) {
    if (fileName.endsWith(".json") && !expectedFlatFiles.has(fileName)) {
      fail(`stale flat record ${path.relative(root, path.join(recordsDir, fileName))}`);
    }
  }
}

for (const proceeding of byKind.proceedings || []) {
  for (const allegationId of proceeding.hasAllegation || []) {
    const allegation = recordsById.get(allegationId);
    if (!allegation) fail(`${proceeding.id} has missing allegation ${allegationId}`);
    if (allegation && allegation.ai_incident_law_record_id !== proceeding.ai_incident_law_record_id) {
      fail(`${proceeding.id} allegation record id mismatch`);
    }
  }
  for (const determinationId of proceeding.hasDetermination || []) {
    const determination = recordsById.get(determinationId);
    if (!determination) fail(`${proceeding.id} has missing determination ${determinationId}`);
    if (determination && determination.ai_incident_law_record_id !== proceeding.ai_incident_law_record_id) {
      fail(`${proceeding.id} determination record id mismatch`);
    }
  }
}

const pendingProceedings = (byKind.proceedings || []).filter(record => record.status === "pending");
for (const proceeding of pendingProceedings) {
  if ((proceeding.hasDetermination || []).length) fail(`${proceeding.id} is pending but has determinations`);
}

if (failures.length) {
  console.error(`eval-obligation-first: FAILED (${failures.length})`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("eval-obligation-first: OK");
