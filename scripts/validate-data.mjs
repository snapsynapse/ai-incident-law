import { readFile } from "node:fs/promises";
import { URL_FIELD_POLICIES, normalizeUrlField } from "./url-policy.mjs";

const SOURCE_PATH = new URL("../data/data.json", import.meta.url);
const REQUIRED_DATASETS = ["included", "review", "global"];
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const FRESHNESS_FIELDS = ["last_verified_date", "last_checked_date"];
const RETIRED_IDS = new Set(["AIEL-2026-039"]);
const issues = [];
const warnings = [];

function addIssue(message) {
  issues.push(message);
}

function recordId(record, datasetKey, index) {
  return record.error_id || record.candidate_id || `${datasetKey}[${index}]`;
}

function validateLegalGraph(record, datasetKey, id) {
  const graph = record.legal_graph;
  if (graph === undefined) return;
  if (datasetKey !== "included" || !graph || typeof graph !== "object" || Array.isArray(graph)) {
    addIssue(`${datasetKey}.${id}.legal_graph must be an object on an included record`);
    return;
  }
  for (const field of ["authorities", "proceedings", "determinations", "retired_identifiers"]) {
    if (graph[field] !== undefined && !Array.isArray(graph[field])) addIssue(`${datasetKey}.${id}.legal_graph.${field} must be an array`);
  }
  const authorities = new Set();
  for (const authority of graph.authorities || []) {
    if (!authority?.id || !/^[a-z0-9-]+$/.test(authority.id)) addIssue(`${datasetKey}.${id}.legal_graph authority has an invalid id`);
    if (!authority?.name || String(authority.name).includes(";")) addIssue(`${datasetKey}.${id}.legal_graph authority must name one organization`);
    if (authorities.has(authority.id)) addIssue(`${datasetKey}.${id}.legal_graph duplicates authority ${authority.id}`);
    authorities.add(authority.id);
  }
  const determinationIds = new Set();
  for (const determination of graph.determinations || []) {
    if (!determination?.id || !/^[a-z0-9-]+$/.test(determination.id)) addIssue(`${datasetKey}.${id}.legal_graph determination has an invalid id`);
    if (determinationIds.has(determination.id)) addIssue(`${datasetKey}.${id}.legal_graph duplicates determination ${determination.id}`);
    determinationIds.add(determination.id);
    if (!Array.isArray(determination.issued_by) || determination.issued_by.length === 0) addIssue(`${datasetKey}.${id}.legal_graph determination ${determination.id} must identify issued_by`);
    for (const authorityId of determination.issued_by || []) if (!authorities.has(authorityId)) addIssue(`${datasetKey}.${id}.legal_graph determination ${determination.id} references undeclared authority ${authorityId}`);
    if (!determination.disposition) addIssue(`${datasetKey}.${id}.legal_graph determination ${determination.id} must identify disposition`);
  }
  const proceedingIds = new Set();
  for (const proceeding of graph.proceedings || []) {
    if (!proceeding?.id || !/^[a-z0-9-]+$/.test(proceeding.id)) addIssue(`${datasetKey}.${id}.legal_graph proceeding has an invalid id`);
    if (proceedingIds.has(proceeding.id)) addIssue(`${datasetKey}.${id}.legal_graph duplicates proceeding ${proceeding.id}`);
    proceedingIds.add(proceeding.id);
    if (!Array.isArray(proceeding.heard_by) || proceeding.heard_by.length === 0) addIssue(`${datasetKey}.${id}.legal_graph proceeding ${proceeding.id} must identify heard_by`);
    for (const authorityId of proceeding.heard_by || []) if (!authorities.has(authorityId)) addIssue(`${datasetKey}.${id}.legal_graph proceeding ${proceeding.id} references undeclared authority ${authorityId}`);
    for (const determinationId of proceeding.determination_ids || []) if (!determinationIds.has(determinationId)) addIssue(`${datasetKey}.${id}.legal_graph proceeding ${proceeding.id} references undeclared determination ${determinationId}`);
  }
  for (const retired of graph.retired_identifiers || []) {
    if (!retired?.id || !/^[a-z0-9-]+$/.test(retired.id)) addIssue(`${datasetKey}.${id}.legal_graph retired identifier has an invalid id`);
    if (!retired?.kind || !["authority", "determination", "proceeding"].includes(retired.kind)) addIssue(`${datasetKey}.${id}.legal_graph retired identifier ${retired.id || "(missing)"} has an invalid kind`);
    if (!retired?.former_type || !/^of:[A-Z]/.test(retired.former_type)) addIssue(`${datasetKey}.${id}.legal_graph retired identifier ${retired.id || "(missing)"} must identify former_type`);
    if (!retired?.reason) addIssue(`${datasetKey}.${id}.legal_graph retired identifier ${retired.id || "(missing)"} must explain the retirement`);
  }
}

const sourceText = await readFile(SOURCE_PATH, "utf8");
const data = JSON.parse(sourceText);

if (!ISO_DATE.test(String(data.generated_at || ""))) {
  addIssue('root.generated_at must be an ISO date string like "2026-04-22"');
}

// Freshness gate: the public generated_at stamp must not lag behind the newest
// record verification/check date. Catches the stale-date class of bug where
// records are added or re-verified but the dataset freshness label is never
// bumped. build-data.mjs derives generated_at automatically; this guards
// against a hand-edited data.json that skips the build.
let newestRecordDate = "";
for (const bucket of Object.values(data.datasets || {})) {
  for (const record of bucket?.records || []) {
    for (const field of FRESHNESS_FIELDS) {
      const value = String(record?.[field] || "");
      if (ISO_DATE.test(value) && value > newestRecordDate) {
        newestRecordDate = value;
      }
    }
  }
}
if (newestRecordDate && String(data.generated_at || "") < newestRecordDate) {
  addIssue(
    `root.generated_at (${data.generated_at}) is behind the newest record date (${newestRecordDate}); run \`npm run build:data\``,
  );
}

const seenIds = new Set();
const primaryLinks = new Map();
const matterDates = new Map();

for (const datasetKey of REQUIRED_DATASETS) {
  if (!data.datasets?.[datasetKey]) {
    addIssue(`root.datasets.${datasetKey} is missing`);
  }
}

for (const [datasetKey, bucket] of Object.entries(data.datasets || {})) {
  if (!Array.isArray(bucket.records)) {
    addIssue(`root.datasets.${datasetKey}.records must be an array`);
    continue;
  }

  bucket.records.forEach((record, index) => {
    const id = recordId(record, datasetKey, index);

    validateLegalGraph(record, datasetKey, id);

    if (seenIds.has(id)) {
      addIssue(`${datasetKey}.${id}: duplicate record identifier`);
    }
    seenIds.add(id);

    if (RETIRED_IDS.has(id)) {
      addIssue(`${datasetKey}.${id}: retired record identifier must not be reused`);
    }

    if (!record.error_title && !record.candidate_title && !record.translated_title && !record.original_title) {
      addIssue(`${datasetKey}.${id}: missing title fields`);
    }

    for (const field of Object.keys(URL_FIELD_POLICIES)) {
      if (!record[field]) {
        continue;
      }

      const normalized = normalizeUrlField(field, record[field], `${datasetKey}.${id}.${field}`);
      for (const issue of normalized.issues) {
        addIssue(issue);
      }

      if (field === "public_record_link" && normalized.issues.length === 0) {
        const priorId = primaryLinks.get(normalized.value);
        if (priorId) {
          addIssue(`${datasetKey}.${id}: public_record_link duplicates ${priorId}`);
        } else {
          primaryLinks.set(normalized.value, id);
        }
      }
    }

    if (record.public_matter_name && record.filing_date) {
      const matterDateKey = `${String(record.public_matter_name).trim().toLowerCase()}\n${record.filing_date}`;
      const priorId = matterDates.get(matterDateKey);
      if (priorId) {
        warnings.push(`${datasetKey}.${id}: matter name and filing date match ${priorId}; review for duplication`);
      } else {
        matterDates.set(matterDateKey, id);
      }
    }
  });
}

for (const warning of warnings) {
  console.warn(`Data validation warning: ${warning}`);
}

if (issues.length) {
  console.error("Data validation failed:\n");
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(`Validated ${seenIds.size} records in data/data.json.`);
