import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const source = JSON.parse(readFileSync(new URL("data/data.json", root), "utf8"));
const graph = JSON.parse(readFileSync(new URL("api/v1/of/allegations.json", root), "utf8"));
const app = readFileSync(new URL("app.js", root), "utf8");
const bundle = readFileSync(new URL("data.js", root), "utf8");

// Exercise the real browser renderer without adding a DOM/runtime dependency.
// Native browser acceptance is separate; this harness checks emitted content
// and the actual filter/reset event handlers.
function browser(data) {
  const elements = new Map();
  function element(id) {
    if (!elements.has(id)) elements.set(id, {
      value: "", innerHTML: "", textContent: "", options: [], handlers: {},
      classList: { toggle() {} },
      appendChild(option) { this.options.push(option); },
      addEventListener(type, handler) { this.handlers[type] = handler; },
      emit(type, value) {
        this.value = value;
        this.handlers[type]({ target: this });
      },
    });
    return elements.get(id);
  }
  const context = vm.createContext({
    window: { AIEL_DATA: data, matchMedia: () => ({ matches: false }) },
    document: { getElementById: element, documentElement: { setAttribute() {} } },
    Option: class { constructor(text, value) { this.text = text; this.value = value; } },
    URL,
  });
  if (!data) vm.runInContext(bundle, context);
  vm.runInContext(app, context);
  return { element, data: context.window.AIEL_DATA };
}

test("offline bundle preserves native records/dates and matches graph review metadata", () => {
  const { data } = browser();
  assert.deepEqual(JSON.parse(JSON.stringify(data.datasets)), source.datasets);
  assert.equal(data.generated_at, source.generated_at);
  for (const allegation of graph.allegations) {
    const review = data.source_review_by_record[allegation.ai_incident_law_record_id];
    assert.equal(review.admission_status, allegation.admission_status);
    assert.deepEqual(JSON.parse(JSON.stringify(review.source_review_unresolved || [])), allegation.source_review_unresolved || []);
  }
});

test("Mata has a working human category route and keeps its machine identifier", () => {
  const { element } = browser();
  element("searchInput").emit("input", "Mata");
  const card = element("cardsView").innerHTML;
  assert.match(element("resultCount").textContent, /^Showing 1 of /);
  assert.match(card, /href="https:\/\/everyailaw.com\/obligation\/human-oversight\/"/);
  assert.match(card, /data-anchor-id="https:\/\/everyailaw.com\/obligation-category\/human-oversight.json"/);
  assert.match(card, />Human Oversight<\/a>/);
  assert.match(card, /Related categories, not specific duties/);
  assert.doesNotMatch(card, /href="https:\/\/everyailaw.com\/obligation-category\/human-oversight"/);
});

test("legacy review is distinct from inclusion, a review flag and historical dates", () => {
  const { element } = browser();
  element("searchInput").emit("input", "Mata");
  const card = element("cardsView").innerHTML;
  assert.match(card, />Included<\/span>/);
  assert.match(card, /Not flagged/);
  assert.match(card, /Legacy record, unreviewed/);
  assert.match(card, /Fields have not been reviewed against retained source bytes/);
  assert.match(card, /verification <time datetime="2026-09-01">2026-09-01<\/time>; check Not recorded/);
  assert.match(element("tableView").innerHTML, /Legacy record, unreviewed/);
  assert.match(element("tableView").innerHTML, /2026-09-01/);
  assert.doesNotMatch(card, /Verified seed/);
  const options = element("reviewFilter").options.map(o => [o.text, o.value]);
  assert.deepEqual(options, [["All review flags", "all"], ["Not flagged", "no"], ["Flagged for review", "yes"]]);
  element("reviewFilter").emit("change", "yes");
  assert.equal(element("resultCount").textContent.split(" ")[1], "0");
  assert.match(element("activeFilters").innerHTML, /Flagged for review/);
});

test("changed-unit review retains unresolved questions rather than claiming whole-record verification", () => {
  const { element } = browser();
  element("searchInput").emit("input", "AIEL-2024-001");
  const card = element("cardsView").innerHTML;
  assert.match(card, /Changed units reviewed/);
  assert.match(card, /not the whole record/);
  assert.match(card, /Open review questions/);
  assert.match(card, /Human decision pending/);
  assert.doesNotMatch(card, /Verified seed/);
});

test("candidates show recorded check dates without being presented as admitted cases", () => {
  const { element } = browser();
  element("searchInput").emit("input", "AIEL-CAND-001");
  const card = element("cardsView").innerHTML;
  assert.match(card, /Candidate, not admitted/);
  assert.match(card, /verification Not recorded; check <time datetime="2026-04-22">2026-04-22<\/time>/);
  assert.doesNotMatch(card, /Verified seed/);
});

test("all known category routes render; unknown anchors keep their machine destination", () => {
  const data = JSON.parse(JSON.stringify(browser().data));
  const record = data.datasets.included.records.find(r => r.error_id === "AIEL-2023-002");
  record.obligation_first_anchors = [
    "https://everyailaw.com/obligation-category/human-oversight.json",
    "https://everyailaw.com/obligation-category/bias-prevention.json",
    "https://everyailaw.com/obligation-category/explainability.json",
    "https://everyailaw.com/obligation-category/future-category.json",
    "javascript:alert(1)",
  ];
  const { element } = browser(data);
  element("searchInput").emit("input", "Mata");
  const card = element("cardsView").innerHTML;
  for (const slug of ["human-oversight", "bias-prevention", "explainability"]) {
    assert.ok(card.includes(`href="https://everyailaw.com/obligation/${slug}/"`));
  }
  assert.match(card, /href="https:\/\/everyailaw.com\/obligation-category\/future-category.json"/);
  assert.doesNotMatch(card, /href="javascript:/);
});

test("missing review metadata never becomes verified and review text is escaped", () => {
  const data = JSON.parse(JSON.stringify(browser().data));
  delete data.source_review_by_record["AIEL-2023-002"];
  const { element } = browser(data);
  element("searchInput").emit("input", "Mata");
  assert.match(element("cardsView").innerHTML, /metadata is unavailable; no verification is implied/);
  data.source_review_by_record["AIEL-2023-002"] = {
    admission_status: "source-consistency-reviewed-changes",
    source_review_unresolved: ['<img src=x onerror="alert(1)">'],
  };
  const next = browser(data);
  next.element("searchInput").emit("input", "Mata");
  assert.match(next.element("cardsView").innerHTML, /&lt;img/);
  assert.doesNotMatch(next.element("cardsView").innerHTML, /<img/);
});

test("empty search and Reset preserve ordinary recovery", () => {
  const { element } = browser();
  element("searchInput").emit("input", "zzqvnoincident7281");
  assert.match(element("resultCount").textContent, /^Showing 0 of /);
  element("resetFilters").emit("click", "");
  assert.equal(element("searchInput").value, "");
  assert.equal(element("resultCount").textContent, "Showing 125 of 125 records");
});
