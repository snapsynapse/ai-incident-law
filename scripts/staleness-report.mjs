import { readFile } from "node:fs/promises";

// Staleness report: surfaces record verification decay so the curator can see
// which matters are overdue for re-verification. Diagnostic only — prints to
// stdout, writes nothing, commits nothing. Honors INTENT principle #4 ("decay
// is visible"). Mirrors the freshness fields used by build-data.mjs and the
// get_staleness_report MCP tool in scripts/mcp-server.js.
//
// Usage:
//   node scripts/staleness-report.mjs            # report as of today
//   node scripts/staleness-report.mjs 2026-06-02 # report as of a fixed date
//   node scripts/staleness-report.mjs --json      # machine-readable output

const SOURCE_PATH = new URL("../data/data.json", import.meta.url);
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const FRESHNESS_FIELDS = ["last_verified_date", "last_checked_date"];
const BUCKETS = [
  { label: "overdue (>365d)", min: 365 },
  { label: "stale (181-365d)", min: 181 },
  { label: "aging (91-180d)", min: 91 },
  { label: "recent (31-90d)", min: 31 },
  { label: "fresh (0-30d)", min: 0 },
];

const args = process.argv.slice(2);
const asJson = args.includes("--json");
const asOfArg = args.find((value) => ISO_DATE.test(value));
const asOf = asOfArg || new Date().toISOString().slice(0, 10);

function verificationDate(record) {
  for (const field of FRESHNESS_FIELDS) {
    const value = String(record?.[field] || "");
    if (ISO_DATE.test(value)) return value;
  }
  return null;
}

function recordId(record, datasetKey, index) {
  return record.error_id || record.candidate_id || `${datasetKey}[${index}]`;
}

function daysBetween(fromIso, toIso) {
  const from = Date.parse(`${fromIso}T00:00:00Z`);
  const to = Date.parse(`${toIso}T00:00:00Z`);
  return Math.round((to - from) / 86400000);
}

function bucketFor(days) {
  if (days === null) return "undated";
  for (const bucket of BUCKETS) {
    if (days >= bucket.min) return bucket.label;
  }
  return "fresh (0-30d)";
}

const data = JSON.parse(await readFile(SOURCE_PATH, "utf8"));
const rows = [];

for (const [datasetKey, bucket] of Object.entries(data.datasets || {})) {
  (bucket?.records || []).forEach((record, index) => {
    const date = verificationDate(record);
    const days = date ? daysBetween(date, asOf) : null;
    rows.push({
      dataset: datasetKey,
      id: recordId(record, datasetKey, index),
      title:
        record.error_title ||
        record.candidate_title ||
        record.translated_title ||
        record.original_title ||
        "",
      verification_date: date,
      days_stale: days,
      bucket: bucketFor(days),
    });
  });
}

rows.sort((a, b) => (b.days_stale ?? -1) - (a.days_stale ?? -1));

const counts = {};
for (const row of rows) counts[row.bucket] = (counts[row.bucket] || 0) + 1;

if (asJson) {
  console.log(
    JSON.stringify(
      { as_of: asOf, generated_at: data.generated_at || null, total: rows.length, buckets: counts, records: rows },
      null,
      2,
    ),
  );
} else {
  console.log(`Staleness report as of ${asOf} (generated_at: ${data.generated_at || "unknown"})`);
  console.log(`Total records: ${rows.length}\n`);
  for (const { label } of BUCKETS) {
    if (counts[label]) console.log(`  ${label.padEnd(18)} ${counts[label]}`);
  }
  if (counts.undated) console.log(`  ${"undated".padEnd(18)} ${counts.undated}`);
  const overdue = rows.filter((row) => row.days_stale !== null && row.days_stale > 180).slice(0, 15);
  if (overdue.length) {
    console.log(`\nOldest records (>180d), up to 15:`);
    for (const row of overdue) {
      console.log(`  ${String(row.days_stale).padStart(4)}d  ${row.verification_date}  ${row.dataset}.${row.id}`);
    }
  } else {
    console.log(`\nNo records older than 180 days. Corpus is current.`);
  }
}
