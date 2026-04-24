import { readFile } from "node:fs/promises";

const SOURCE_PATH = new URL("../data/data.json", import.meta.url);
const REQUIRED_DATASETS = ["included", "review", "global"];
const URL_FIELDS = ["public_record_link", "secondary_source_links", "best_available_sources"];
const issues = [];

function addIssue(message) {
  issues.push(message);
}

function extractUrls(value) {
  return String(value || "").match(/https?:\/\/[^\s;]+/g) || [];
}

function validateUrl(url, location) {
  let parsed;

  try {
    parsed = new URL(url);
  } catch {
    addIssue(`${location}: invalid URL "${url}"`);
    return;
  }

  if (parsed.protocol !== "https:") {
    addIssue(`${location}: URL must use https "${url}"`);
  }

  if (parsed.hostname.toLowerCase().startsWith("www.")) {
    addIssue(`${location}: URL must use bare domain "${url}"`);
  }
}

function recordId(record, datasetKey, index) {
  return record.error_id || record.candidate_id || `${datasetKey}[${index}]`;
}

const sourceText = await readFile(SOURCE_PATH, "utf8");
const data = JSON.parse(sourceText);

if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data.generated_at || ""))) {
  addIssue('root.generated_at must be an ISO date string like "2026-04-22"');
}

const seenIds = new Set();

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

    if (!record.error_title && !record.candidate_title && !record.translated_title && !record.original_title) {
      addIssue(`${datasetKey}.${id}: missing title fields`);
    }

    for (const field of URL_FIELDS) {
      for (const url of extractUrls(record[field])) {
        validateUrl(url, `${datasetKey}.${id}.${field}`);
      }
    }
  });
}

if (issues.length) {
  console.error("Data validation failed:\n");
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(`Validated ${seenIds.size} records in data/data.json.`);

