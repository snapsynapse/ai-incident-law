import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { bucketFor, createReport, formatText, parseArgs } from "../scripts/staleness-report.mjs";

test("age buckets have inclusive boundaries and do not classify 365 days as overdue", () => {
  assert.equal(bucketFor(90), "recent (31-90d)");
  assert.equal(bucketFor(91), "aging (91-180d)");
  assert.equal(bucketFor(180), "aging (91-180d)");
  assert.equal(bucketFor(181), "stale (181-365d)");
  assert.equal(bucketFor(365), "stale (181-365d)");
  assert.equal(bucketFor(366), "overdue (>365d)");
});

test("report distinguishes verified dates, checked dates, missing dates, invalid dates, and future dates", () => {
  const report = createReport({
    generated_at: "2026-01-01",
    datasets: {
      included: { records: [
        { error_id: "verified", last_verified_date: "2025-07-05", last_checked_date: "2025-01-01" },
        { error_id: "checked", last_checked_date: "2025-10-03" },
        { error_id: "missing" },
        { error_id: "invalid", last_verified_date: "2026-02-30" },
        { error_id: "future", last_verified_date: "2026-01-02" },
      ] },
    },
  }, { asOf: "2026-01-01" });
  const byId = Object.fromEntries(report.records.map((row) => [row.id, row]));
  assert.deepEqual([byId.verified.date_field, byId.verified.days_stale, byId.verified.bucket], ["last_verified_date", 180, "aging (91-180d)"]);
  assert.deepEqual([byId.checked.date_field, byId.checked.days_stale], ["last_checked_date", 90]);
  assert.deepEqual([byId.missing.date_status, byId.missing.bucket], ["missing", "undated"]);
  assert.deepEqual([byId.invalid.date_status, byId.invalid.bucket], ["invalid", "invalid date"]);
  assert.deepEqual([byId.future.date_status, byId.future.days_stale, byId.future.bucket], ["future", -1, "future date"]);
});

test("text report never turns a no-overdue age result into a currentness claim", () => {
  const report = createReport({ datasets: { included: { records: [{ error_id: "recent", last_checked_date: "2026-01-01" }] } } }, { asOf: "2026-01-01" });
  const text = formatText(report);
  assert.match(text, /last_verified_date, or last_checked_date/);
  assert.match(text, /does not retrieve or verify sources/i);
  assert.match(text, /not a verification or currentness finding/i);
  assert.doesNotMatch(text, /No record date is older than 180 days\. Corpus is current\./i);
});

test("arguments reject invalid calendar dates, duplicate dates, duplicate JSON flags, and unknown flags", () => {
  assert.deepEqual(parseArgs(["--json", "2026-01-01"], new Date("2020-01-01T00:00:00Z")), { asJson: true, asOf: "2026-01-01" });
  for (const args of [["2026-02-30"], ["2026-01-01", "2026-01-02"], ["--json", "--json"], ["--unknown"]]) {
    assert.throws(() => parseArgs(args), /Invalid argument|Only one|only once/);
  }
});

test("scheduled workflow retains the diagnostic-only reporting contract", async () => {
  const workflow = await readFile(new URL("../.github/workflows/staleness-report.yml", import.meta.url), "utf8");
  const script = await readFile(new URL("../scripts/staleness-report.mjs", import.meta.url), "utf8");
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /cron: "47 13 \* \* 1"/);
  assert.match(workflow, /group: record-age-diagnostic/);
  assert.match(workflow, /cancel-in-progress: false/);
  assert.match(workflow, /timeout-minutes: 5/);
  assert.match(workflow, /persist-credentials: false/);
  assert.match(workflow, /- name: Upload record age reports\n\s+if: always\(\)\n\s+uses: actions\/upload-artifact@v4/);
  assert.match(workflow, /test -s artifacts\/staleness-report\.txt/);
  assert.match(workflow, /test -s artifacts\/staleness-report\.json/);
  assert.match(workflow, /retention-days: 14/);
  assert.match(workflow, /Record age != source verification/);
  assert.match(workflow, /No notices or email are configured/);
  assert.doesNotMatch(workflow, /issues:\s*write|gh issue|sendmail|smtp|curl|wget|npm |pnpm /i);
  assert.doesNotMatch(workflow, /data\/data\.json|git (?:add|commit|push)/i);
  assert.doesNotMatch(script, /\b(?:writeFile|appendFile|rename|unlink|mkdir)\b/);
});
