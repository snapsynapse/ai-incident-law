#!/usr/bin/env node
// Deterministic temporal-causality checks over the generated Obligation-First projection.
//
// Rules (day-precise dates only; anything missing or partial is reported as unknown, never failed):
// 1. A Determination must not be issued before the filing date of the Proceeding that resolves it.
// 2. A vacating Determination (of:vacates) must not be issued before the Determination it vacates.
// 3. No issued_date, filed_date, or verified date may be later than data/data.json generated_at.
//
// Dates are never widened: a year or month value is never substituted with a first-of-period day.

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DAY_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const KIND_LABELS = {
  authorities: "authority",
  parties: "party",
  proceedings: "proceeding",
  allegations: "allegation",
  determinations: "determination",
  tombstones: "tombstone"
};

export function parseDayDate(value) {
  if (value === undefined || value === null || String(value).trim() === "") return { kind: "missing" };
  const text = String(value).trim();
  const match = DAY_RE.exec(text);
  if (!match) return { kind: "partial", value: text };
  const [, year, month, day] = match.map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day));
  if (utc.getUTCFullYear() !== year || utc.getUTCMonth() !== month - 1 || utc.getUTCDate() !== day) {
    return { kind: "partial", value: text };
  }
  return { kind: "day", value: text };
}

// A day-precise value is only trusted when nothing on the record marks it as coarser.
function dayDate(record, field, { sourceField } = {}) {
  const parsed = parseDayDate(record?.[field]);
  if (parsed.kind !== "day") return parsed;
  const precision = record[`${field}_precision`] ?? record.date_precision;
  if (precision !== undefined && String(precision).toLowerCase() !== "day") return { kind: "partial", value: parsed.value };
  if (sourceField && record[sourceField] !== undefined && parseDayDate(record[sourceField]).kind !== "day") {
    return { kind: "partial", value: parsed.value };
  }
  return parsed;
}

function label(record) {
  const type = String(record?.["@type"] || "").replace(/^of:/, "").toLowerCase();
  return `${type || "record"} ${record?.id || record?.["@id"] || "(unknown)"}`;
}

export function checkTemporal(projection, { referenceDate } = {}) {
  const violations = [];
  let checked = 0;
  let unknown = 0;
  let dates = 0;

  const proceedings = projection.proceedings || [];
  const determinations = projection.determinations || [];
  const determinationsByIri = new Map(determinations.map(record => [record["@id"], record]));

  // Rule 1: Determination versus Proceeding.
  for (const proceeding of proceedings) {
    const filed = dayDate(proceeding, "filed_date", { sourceField: "filing_date_source" });
    for (const iri of proceeding.hasDetermination || []) {
      const determination = determinationsByIri.get(iri);
      const issued = determination ? dayDate(determination, "issued_date") : { kind: "missing" };
      if (filed.kind !== "day" || issued.kind !== "day") {
        unknown += 1;
        continue;
      }
      checked += 1;
      if (issued.value < filed.value) {
        violations.push(`determination-before-filing: ${label(determination)} issued_date=${issued.value} precedes ${label(proceeding)} filed_date=${filed.value}`);
      }
    }
  }

  // Rule 2: vacating versus vacated Determination.
  for (const vacating of determinations) {
    const issued = dayDate(vacating, "issued_date");
    for (const iri of vacating.vacates || []) {
      const vacated = determinationsByIri.get(iri);
      const vacatedIssued = vacated ? dayDate(vacated, "issued_date") : { kind: "missing" };
      if (issued.kind !== "day" || vacatedIssued.kind !== "day") {
        unknown += 1;
        continue;
      }
      checked += 1;
      if (issued.value < vacatedIssued.value) {
        violations.push(`vacating-before-vacated: ${label(vacating)} issued_date=${issued.value} precedes ${label(vacated)} issued_date=${vacatedIssued.value}`);
      }
    }
  }

  // Rule 3: no date later than the build reference date.
  const reference = parseDayDate(referenceDate);
  if (reference.kind !== "day") {
    violations.push(`reference-date: generated_at=${referenceDate ?? "(missing)"} is not a day-precise date`);
  } else {
    for (const [kind, records] of Object.entries(projection)) {
      if (!KIND_LABELS[kind] || !Array.isArray(records)) continue;
      for (const record of records) {
        const fields = kind === "determinations" ? ["issued_date", "verified"] : kind === "proceedings" ? ["filed_date", "verified"] : ["verified"];
        for (const field of fields) {
          const parsed = dayDate(record, field);
          if (parsed.kind !== "day") continue;
          dates += 1;
          if (parsed.value > reference.value) {
            violations.push(`future-date: ${label(record)} ${field}=${parsed.value} is later than generated_at=${reference.value}`);
          }
        }
      }
    }
  }

  violations.sort();
  return { checked, unknown, dates, violations };
}

export function readProjection(root = ROOT) {
  const apiDir = path.join(root, "api", "v1", "of");
  const indexPath = path.join(apiDir, "index.json");
  if (!existsSync(indexPath)) throw new Error("missing api/v1/of/index.json; run npm run build:of first");
  const index = JSON.parse(readFileSync(indexPath, "utf8"));
  const projection = {};
  for (const [kind, fileName] of Object.entries(index.files || {})) {
    const file = path.join(apiDir, fileName);
    if (!existsSync(file)) throw new Error(`missing aggregate ${fileName}`);
    projection[kind] = JSON.parse(readFileSync(file, "utf8"))[kind] || [];
  }
  const source = JSON.parse(readFileSync(path.join(root, "data", "data.json"), "utf8"));
  return { projection, referenceDate: source.generated_at };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let inputs;
  try {
    inputs = readProjection();
  } catch (error) {
    console.error(`check-of-temporal: ${error.message}`);
    process.exit(1);
  }
  const { checked, unknown, dates, violations } = checkTemporal(inputs.projection, { referenceDate: inputs.referenceDate });
  if (violations.length) {
    console.error(`check-of-temporal: FAILED (pairs checked=${checked}, pairs unknown=${unknown}, dates checked=${dates}, violations=${violations.length})`);
    for (const violation of violations) console.error(`- ${violation}`);
    process.exit(1);
  }
  console.log(`check-of-temporal: OK (pairs checked=${checked}, pairs unknown=${unknown}, dates checked=${dates}, violations=0)`);
}
