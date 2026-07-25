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
