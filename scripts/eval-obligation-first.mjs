#!/usr/bin/env node

import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const sourceFile = path.join(root, "data", "data.json");
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
const expectedCompanionFiles = new Map();
const byKind = {};

for (const dir of Object.values(companionDirs)) expectedCompanionFiles.set(dir, new Set());

function recordStem(record) {
  return String(record.error_id).toLowerCase();
}

function determinationDisposition(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "pending") return null;
  if (normalized.includes("settled")) return "settled";
  if (normalized.includes("dismissed")) return "dismissed";
  if (normalized.includes("sanctioned") || normalized.includes("ordered") || normalized.includes("resolved")) return "confirmed";
  return "partial";
}

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
    expectedCompanionFiles.get(companionDir)?.add(`${record.id}.json`);
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

for (const [dir, expectedFiles] of expectedCompanionFiles) {
  const companionDir = path.join(root, dir);
  if (!existsSync(companionDir)) continue;
  for (const fileName of await readdir(companionDir)) {
    if (fileName.endsWith(".json") && !expectedFiles.has(fileName)) {
      fail(`stale companion record ${path.relative(root, path.join(companionDir, fileName))}`);
    }
  }
}

const source = await readJson(sourceFile);
const included = source.datasets?.included?.records || [];
const review = source.datasets?.review?.records || [];
const global = source.datasets?.global?.records || [];
const includedIds = new Set(included.map(record => record.error_id));
const expectedDeterminations = included.filter(record => determinationDisposition(record.filing_status)).length;
const expectedAuthorities = new Set(included.map(record => record.jurisdiction)).size;

if ((byKind.proceedings || []).length !== included.length) {
  fail(`proceeding count does not match included records: ${(byKind.proceedings || []).length} != ${included.length}`);
}
if ((byKind.allegations || []).length !== included.length) {
  fail(`allegation count does not match included records: ${(byKind.allegations || []).length} != ${included.length}`);
}
if ((byKind.determinations || []).length !== expectedDeterminations) {
  fail(`determination count does not match non-pending included records: ${(byKind.determinations || []).length} != ${expectedDeterminations}`);
}
if ((byKind.authorities || []).length !== expectedAuthorities) {
  fail(`authority count does not match distinct included jurisdictions: ${(byKind.authorities || []).length} != ${expectedAuthorities}`);
}

const exportedSourceIds = new Set([
  ...(byKind.proceedings || []).map(record => record.ai_incident_law_record_id),
  ...(byKind.allegations || []).map(record => record.ai_incident_law_record_id),
  ...(byKind.determinations || []).map(record => record.ai_incident_law_record_id)
].filter(Boolean));

for (const id of includedIds) {
  if (!exportedSourceIds.has(id)) fail(`included record not exported to OF: ${id}`);
}
for (const record of [...review, ...global]) {
  const id = record.candidate_id || record.error_id;
  if (id && exportedSourceIds.has(id)) fail(`editorial queue record exported to OF: ${id}`);
}

const proceedingsBySourceId = new Map((byKind.proceedings || []).map(record => [record.ai_incident_law_record_id, record]));
const allegationsBySourceId = new Map((byKind.allegations || []).map(record => [record.ai_incident_law_record_id, record]));
const determinationsBySourceId = new Map((byKind.determinations || []).map(record => [record.ai_incident_law_record_id, record]));

for (const record of included) {
  const stem = recordStem(record);
  const proceeding = proceedingsBySourceId.get(record.error_id);
  const allegation = allegationsBySourceId.get(record.error_id);
  const determination = determinationsBySourceId.get(record.error_id);
  const disposition = determinationDisposition(record.filing_status);

  if (!proceeding) fail(`${record.error_id} missing proceeding`);
  if (!allegation) fail(`${record.error_id} missing allegation`);
  if (proceeding && proceeding.id !== `${stem}-proceeding`) fail(`${record.error_id} proceeding id drifted`);
  if (allegation && allegation.id !== `${stem}-allegation`) fail(`${record.error_id} allegation id drifted`);

  if (!disposition && determination) {
    fail(`${record.error_id} has determination despite unresolved status ${record.filing_status}`);
  }
  if (disposition && !determination) {
    fail(`${record.error_id} missing determination for status ${record.filing_status}`);
  }
  if (determination && determination.disposition !== disposition) {
    fail(`${record.error_id} disposition ${determination.disposition} does not match status ${record.filing_status}`);
  }
  if (determination && determination.id !== `${stem}-determination`) {
    fail(`${record.error_id} determination id drifted`);
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
    if (determination && stable(determination.decides || []) !== stable(proceeding.hasAllegation || [])) {
      fail(`${proceeding.id} determination does not decide the proceeding allegation set`);
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
