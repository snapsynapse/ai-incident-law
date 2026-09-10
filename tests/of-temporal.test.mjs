import assert from "node:assert/strict";
import test from "node:test";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { checkTemporal, parseDayDate } from "../scripts/check-of-temporal.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://aiincidentlaw.org";

function proceeding(id, overrides = {}) {
  return {
    "@type": "of:Proceeding",
    "@id": `${SITE}/proceeding/${id}.json`,
    id,
    hasDetermination: [],
    verified: "2026-01-10",
    ...overrides
  };
}

function determination(id, overrides = {}) {
  return {
    "@type": "of:Determination",
    "@id": `${SITE}/determination/${id}.json`,
    id,
    verified: "2026-01-10",
    ...overrides
  };
}

function projection({ proceedings = [], determinations = [], others = {} } = {}) {
  return { proceedings, determinations, ...others };
}

const REFERENCE = "2026-02-01";

test("parseDayDate distinguishes day-precise, partial, and missing values", () => {
  assert.equal(parseDayDate("2024-02-14").kind, "day");
  assert.equal(parseDayDate("2024-02").kind, "partial");
  assert.equal(parseDayDate("2024").kind, "partial");
  assert.equal(parseDayDate("2024-02-30").kind, "partial");
  assert.equal(parseDayDate("Feb 14, 2024").kind, "partial");
  assert.equal(parseDayDate(undefined).kind, "missing");
  assert.equal(parseDayDate("").kind, "missing");
  assert.equal(parseDayDate(null).kind, "missing");
});

test("valid ordering passes with no violations", () => {
  const result = checkTemporal(projection({
    proceedings: [proceeding("p1", { filed_date: "2024-01-05", filing_date_source: "2024-01-05", hasDetermination: [`${SITE}/determination/d1.json`] })],
    determinations: [determination("d1", { issued_date: "2024-03-01" })]
  }), { referenceDate: REFERENCE });
  assert.deepEqual(result.violations, []);
  assert.equal(result.checked, 1);
  assert.equal(result.unknown, 0);
});

test("determination issued on the filing day is not a violation", () => {
  const result = checkTemporal(projection({
    proceedings: [proceeding("p1", { filed_date: "2024-03-08", filing_date_source: "2024-03-08", hasDetermination: [`${SITE}/determination/d1.json`] })],
    determinations: [determination("d1", { issued_date: "2024-03-08" })]
  }), { referenceDate: REFERENCE });
  assert.deepEqual(result.violations, []);
  assert.equal(result.checked, 1);
});

test("determination issued before the proceeding filing date fails", () => {
  const result = checkTemporal(projection({
    proceedings: [proceeding("p1", { filed_date: "2024-03-01", filing_date_source: "2024-03-01", hasDetermination: [`${SITE}/determination/d1.json`] })],
    determinations: [determination("d1", { issued_date: "2024-01-05" })]
  }), { referenceDate: REFERENCE });
  assert.equal(result.violations.length, 1);
  assert.match(result.violations[0], /determination-before-filing/);
  assert.match(result.violations[0], /d1 issued_date=2024-01-05/);
  assert.match(result.violations[0], /p1 filed_date=2024-03-01/);
});

test("partial or missing dates report unknown and never fail", () => {
  const result = checkTemporal(projection({
    proceedings: [
      proceeding("p-year", { filing_date_source: "2015", hasDetermination: [`${SITE}/determination/d-year.json`] }),
      proceeding("p-month", { filing_date_source: "2024-06", hasDetermination: [`${SITE}/determination/d-month.json`] }),
      proceeding("p-missing", { hasDetermination: [`${SITE}/determination/d-missing.json`] }),
      proceeding("p-source-partial", { filed_date: "2024-06-01", filing_date_source: "2024-06", hasDetermination: [`${SITE}/determination/d-source-partial.json`] }),
      proceeding("p-marked", { filed_date: "2024-06-01", filing_date_source: "2024-06-01", filed_date_precision: "month", hasDetermination: [`${SITE}/determination/d-marked.json`] }),
      proceeding("p-det-missing", { filed_date: "2024-06-01", filing_date_source: "2024-06-01", hasDetermination: [`${SITE}/determination/d-no-date.json`] })
    ],
    determinations: [
      determination("d-year", { issued_date: "2014-01-01" }),
      determination("d-month", { issued_date: "2024-05-01" }),
      determination("d-missing", { issued_date: "2000-01-01" }),
      determination("d-source-partial", { issued_date: "2024-05-15" }),
      determination("d-marked", { issued_date: "2024-05-15" }),
      determination("d-no-date", {})
    ]
  }), { referenceDate: REFERENCE });
  assert.deepEqual(result.violations, []);
  assert.equal(result.checked, 0);
  assert.equal(result.unknown, 6);
});

test("vacating determination issued before the vacated determination fails", () => {
  const vacated = determination("d-original", { issued_date: "2024-05-15" });
  const vacating = determination("d-vacating", { issued_date: "2024-02-01", disposition: "vacated", vacates: [vacated["@id"]] });
  const result = checkTemporal(projection({ determinations: [vacated, vacating] }), { referenceDate: REFERENCE });
  assert.equal(result.violations.length, 1);
  assert.match(result.violations[0], /vacating-before-vacated/);
  assert.match(result.violations[0], /d-vacating issued_date=2024-02-01/);
  assert.match(result.violations[0], /d-original issued_date=2024-05-15/);
});

test("vacating determination issued after the vacated determination passes; partial dates stay unknown", () => {
  const vacated = determination("d-original", { issued_date: "2024-05-15" });
  const vacating = determination("d-vacating", { issued_date: "2024-09-01", vacates: [vacated["@id"]] });
  const ok = checkTemporal(projection({ determinations: [vacated, vacating] }), { referenceDate: REFERENCE });
  assert.deepEqual(ok.violations, []);
  assert.equal(ok.checked, 1);

  const partial = determination("d-partial", { issued_date: "2024-05", vacates: [vacated["@id"]] });
  const unknown = checkTemporal(projection({ determinations: [vacated, partial] }), { referenceDate: REFERENCE });
  assert.deepEqual(unknown.violations, []);
  assert.equal(unknown.unknown, 1);
});

test("dates later than the build reference date fail", () => {
  const result = checkTemporal(projection({
    proceedings: [proceeding("p1", { filed_date: "2026-03-01", filing_date_source: "2026-03-01", hasDetermination: [`${SITE}/determination/d1.json`] })],
    determinations: [determination("d1", { issued_date: "2026-04-01", verified: "2026-02-02" })],
    others: { authorities: [{ "@type": "of:Authority", "@id": `${SITE}/authority/a1.json`, id: "a1", verified: "2026-02-01" }] }
  }), { referenceDate: REFERENCE });
  assert.deepEqual(result.violations, [
    "future-date: determination d1 issued_date=2026-04-01 is later than generated_at=2026-02-01",
    "future-date: determination d1 verified=2026-02-02 is later than generated_at=2026-02-01",
    "future-date: proceeding p1 filed_date=2026-03-01 is later than generated_at=2026-02-01"
  ]);
});

test("a missing or partial reference date is itself a violation", () => {
  const result = checkTemporal(projection(), { referenceDate: "2026-02" });
  assert.equal(result.violations.length, 1);
  assert.match(result.violations[0], /reference-date/);
});

test("diagnostics are sorted and stable", () => {
  const result = checkTemporal(projection({
    proceedings: [
      proceeding("p-b", { filed_date: "2024-03-01", filing_date_source: "2024-03-01", hasDetermination: [`${SITE}/determination/d-b.json`] }),
      proceeding("p-a", { filed_date: "2024-03-01", filing_date_source: "2024-03-01", hasDetermination: [`${SITE}/determination/d-a.json`] })
    ],
    determinations: [
      determination("d-b", { issued_date: "2024-01-05" }),
      determination("d-a", { issued_date: "2024-01-05" })
    ]
  }), { referenceDate: REFERENCE });
  assert.deepEqual(result.violations, [...result.violations].sort());
  assert.match(result.violations[0], /d-a /);
});

test("checker passes against the generated corpus projection", () => {
  const result = spawnSync(process.execPath, [path.join(ROOT, "scripts", "check-of-temporal.mjs")], { cwd: ROOT, encoding: "utf8" });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /^check-of-temporal: OK \(pairs checked=\d+, pairs unknown=\d+, dates checked=\d+, violations=0\)$/m);
});
