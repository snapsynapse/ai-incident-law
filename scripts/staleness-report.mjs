import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

// Diagnostic only: this reports the age of record-level dates. It does not
// retrieve sources, verify a corpus, write data, or make a freshness claim.

const SOURCE_PATH = new URL("../data/data.json", import.meta.url);
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const FRESHNESS_FIELDS = ["last_verified_date", "last_checked_date"];
export const BUCKETS = [
  { label: "overdue (>365d)", min: 366 },
  { label: "stale (181-365d)", min: 181 },
  { label: "aging (91-180d)", min: 91 },
  { label: "recent (31-90d)", min: 31 },
  { label: "fresh (0-30d)", min: 0 },
];

export function isValidIsoDate(value) {
  const match = ISO_DATE.exec(String(value || ""));
  if (!match) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

export function parseArgs(args, now = new Date()) {
  let asJson = false;
  let asOf = null;
  for (const arg of args) {
    if (arg === "--json") {
      if (asJson) throw new Error("--json may be supplied only once");
      asJson = true;
    } else if (isValidIsoDate(arg)) {
      if (asOf) throw new Error("Only one as-of date may be supplied");
      asOf = arg;
    } else {
      throw new Error(`Invalid argument: ${arg}. Usage: node scripts/staleness-report.mjs [--json] [YYYY-MM-DD]`);
    }
  }
  return { asJson, asOf: asOf || now.toISOString().slice(0, 10) };
}

function dateStatus(value, asOf) {
  if (value === undefined || value === null || value === "") return { status: "missing" };
  if (!isValidIsoDate(value)) return { status: "invalid" };
  const days = daysBetween(value, asOf);
  return { status: days < 0 ? "future" : "dated", days };
}

export function recordDate(record, asOf) {
  let invalid = false;
  for (const field of FRESHNESS_FIELDS) {
    const value = record?.[field];
    const inspected = dateStatus(value, asOf);
    if (inspected.status === "missing") continue;
    if (inspected.status === "invalid") {
      invalid = true;
      continue;
    }
    return { date: value, field, ...inspected };
  }
  return invalid ? { date: null, field: null, status: "invalid" } : { date: null, field: null, status: "missing" };
}

export function recordId(record, datasetKey, index) {
  return record.error_id || record.candidate_id || `${datasetKey}[${index}]`;
}

export function daysBetween(fromIso, toIso) {
  const from = Date.parse(`${fromIso}T00:00:00Z`);
  const to = Date.parse(`${toIso}T00:00:00Z`);
  return Math.round((to - from) / 86400000);
}

export function bucketFor(days, status = "dated") {
  // Keep the established JSON bucket for records without a date. date_status
  // gives callers the more precise missing/invalid/future distinction.
  if (status === "missing") return "undated";
  if (status === "invalid") return "invalid date";
  if (status === "future" || days < 0) return "future date";
  for (const bucket of BUCKETS) if (days >= bucket.min) return bucket.label;
  return "fresh (0-30d)";
}

export function createReport(data, { asOf }) {
  if (!isValidIsoDate(asOf)) throw new Error(`Invalid as-of date: ${asOf}`);
  if (!data || typeof data !== "object" || !data.datasets || typeof data.datasets !== "object") {
    throw new Error("Corpus data is missing datasets");
  }
  const records = [];
  for (const [datasetKey, dataset] of Object.entries(data.datasets)) {
    if (!Array.isArray(dataset?.records)) throw new Error(`Corpus dataset ${datasetKey} is missing records`);
    dataset.records.forEach((record, index) => {
      const date = recordDate(record, asOf);
      records.push({
        dataset: datasetKey,
        id: recordId(record, datasetKey, index),
        title: record.error_title || record.candidate_title || record.translated_title || record.original_title || "",
        verification_date: date.date,
        date_field: date.field,
        date_status: date.status,
        days_stale: date.days ?? null,
        bucket: bucketFor(date.days, date.status),
      });
    });
  }
  records.sort((a, b) => (b.days_stale ?? -Infinity) - (a.days_stale ?? -Infinity));
  const buckets = {};
  for (const row of records) buckets[row.bucket] = (buckets[row.bucket] || 0) + 1;
  return { as_of: asOf, generated_at: data.generated_at || null, total: records.length, buckets, records };
}

export function formatText(report) {
  const lines = [
    `Record age report as of ${report.as_of} (dataset generated_at: ${report.generated_at || "unknown"})`,
    "Age uses each record's last_verified_date, or last_checked_date when no verified date is recorded.",
    "This diagnostic does not retrieve or verify sources and does not establish that the corpus is current.",
    `Total records: ${report.total}`,
    "",
  ];
  for (const { label } of BUCKETS) if (report.buckets[label]) lines.push(`  ${label.padEnd(18)} ${report.buckets[label]}`);
  for (const label of ["future date", "invalid date", "undated"]) {
    if (report.buckets[label]) lines.push(`  ${label.padEnd(18)} ${report.buckets[label]}`);
  }
  const older = report.records.filter((row) => row.days_stale !== null && row.days_stale > 180).slice(0, 15);
  if (older.length) {
    lines.push("", "Oldest record dates (>180d), up to 15:");
    for (const row of older) lines.push(`  ${String(row.days_stale).padStart(4)}d  ${row.date_field}=${row.verification_date}  ${row.dataset}.${row.id}`);
  } else {
    lines.push("", "No record date is older than 180 days. This age result is not a verification or currentness finding.");
  }
  return `${lines.join("\n")}\n`;
}

export async function main(args = process.argv.slice(2)) {
  const { asJson, asOf } = parseArgs(args);
  const data = JSON.parse(await readFile(SOURCE_PATH, "utf8"));
  const report = createReport(data, { asOf });
  console.log(asJson ? JSON.stringify(report, null, 2) : formatText(report));
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(`staleness-report failed: ${error.message}`);
    process.exitCode = 1;
  });
}
