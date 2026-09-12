import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

// F15 traversal fixtures: Determination (or Allegation) -> Proceeding -> category anchor -> obligation anchor.
// Every hop carries an evidence state (curated, inferred, missing, conflicted) derived from the generated
// projection and the native record. The tests assert that the real api/v1/of output resolves exactly as the
// fixture says, that an inferred hop is never presented as curated, and that a missing anchor stays missing.

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const RECORDS_DIR = path.join(ROOT, "api", "v1", "of", "records");
const FIXTURE_PATH = path.join(ROOT, "tests", "fixtures", "of-traversal-fixtures.json");
const DATA_PATH = path.join(ROOT, "data", "data.json");

const CATEGORY_ANCHOR_RE = /^https:\/\/everyailaw\.com\/obligation-category\/[a-z0-9-]+\.json$/;
const OBLIGATION_ANCHOR_RE = /^https:\/\/everyailaw\.com\/obligation\/[a-z0-9-]+\.json$/;
const STATES = new Set(["curated", "inferred", "missing", "conflicted"]);
const KNOWN_BASES = new Set([
  "curated-legal-graph",
  "legacy-filing-status-inference",
  "legacy-record-inference",
  "legacy-jurisdiction-inference",
  "native-record-projection",
  "curated-retirement",
]);

const fixtureFile = JSON.parse(await readFile(FIXTURE_PATH, "utf8"));
const nativeData = JSON.parse(await readFile(DATA_PATH, "utf8"));
const nativeById = new Map(nativeData.datasets.included.records.map(record => [record.error_id, record]));

async function loadGraph() {
  const byId = new Map();
  const byIri = new Map();
  for (const name of (await readdir(RECORDS_DIR)).filter(name => name.endsWith(".json")).sort()) {
    const record = JSON.parse(await readFile(path.join(RECORDS_DIR, name), "utf8"));
    byId.set(record.id, record);
    byIri.set(record["@id"], record);
  }
  return { byId, byIri };
}

function cloneGraph(graph) {
  const byId = new Map();
  const byIri = new Map();
  for (const record of graph.byId.values()) {
    const copy = structuredClone(record);
    byId.set(copy.id, copy);
    byIri.set(copy["@id"], copy);
  }
  return { byId, byIri };
}

const stable = values => JSON.stringify([...values].sort());
const list = value => (Array.isArray(value) ? value : value == null ? [] : [value]);

function basisToState(basis) {
  const mapped = fixtureFile.basis_to_state[basis];
  assert.ok(mapped, `unknown projection_basis ${basis}`);
  return mapped;
}

function ofType(graph, type) {
  return [...graph.byId.values()].filter(record => record["@type"] === type);
}

function resolveAll(graph, iris, label) {
  return list(iris).map(iri => {
    const record = graph.byIri.get(iri);
    assert.ok(record, `${label}: relation target does not resolve: ${iri}`);
    return record;
  });
}

// Walk the graph from the fixture start and report what was observed. Pure observation: it never
// invents an anchor, never upgrades a state, and reports disagreement as conflicted.
function traverse(graph, start) {
  const startRecord = graph.byId.get(start.id);
  assert.ok(startRecord, `start record ${start.id} not found`);
  let determination = null;
  let allegations = [];
  if (start.kind === "determination") {
    assert.equal(startRecord["@type"], "of:Determination");
    determination = startRecord;
    allegations = resolveAll(graph, determination.decides, determination.id);
  } else if (start.kind === "allegation") {
    assert.equal(startRecord["@type"], "of:Allegation");
    allegations = [startRecord];
    const deciders = ofType(graph, "of:Determination").filter(record =>
      list(record.decides).includes(startRecord["@id"]));
    assert.equal(deciders.length, 0, `${start.id} is decided by a live Determination; start there instead`);
  } else {
    assert.fail(`unknown start kind ${start.kind}`);
  }
  for (const allegation of allegations) assert.equal(allegation["@type"], "of:Allegation");

  const proceedings = determination
    ? ofType(graph, "of:Proceeding").filter(record =>
      list(record.hasDetermination).includes(determination["@id"]))
    : ofType(graph, "of:Proceeding").filter(record =>
      allegations.some(allegation => list(record.hasAllegation).includes(allegation["@id"])));

  const sourceIds = new Set([...(determination ? [determination] : []), ...allegations, ...proceedings]
    .map(record => record.ai_incident_law_record_id));
  assert.equal(sourceIds.size, 1, `path crosses matters: ${[...sourceIds].join(", ")}`);
  const sourceRecordId = [...sourceIds][0];
  const native = nativeById.get(sourceRecordId);
  assert.ok(native, `native record ${sourceRecordId} not in included dataset`);

  const retired = ofType(graph, "of:Tombstone").filter(record =>
    record.former_type === "of:Determination" && record.id.startsWith(`${sourceRecordId.toLowerCase()}-`));

  const nativeAnchors = list(native.obligation_first_anchors);
  const generatedAnchors = determination ? list(determination.anchors) : [];
  let categoryState;
  if (!determination) {
    categoryState = nativeAnchors.length === 0 ? "missing" : "conflicted";
  } else if (stable(generatedAnchors) !== stable(nativeAnchors)) {
    categoryState = "conflicted";
  } else {
    categoryState = nativeAnchors.length === 0 ? "missing" : "curated";
  }
  const categoryAnchors = categoryState === "curated" ? generatedAnchors.filter(a => CATEGORY_ANCHOR_RE.test(a)) : [];
  const obligationAnchors = categoryState === "curated" ? generatedAnchors.filter(a => OBLIGATION_ANCHOR_RE.test(a)) : [];
  if (categoryState === "curated") {
    assert.equal(categoryAnchors.length + obligationAnchors.length, generatedAnchors.length,
      `${determination.id} carries an anchor that is neither a category nor an obligation IRI`);
  }

  const single = (records, label) => {
    const bases = new Set(records.map(record => record.projection_basis));
    assert.ok(bases.size <= 1, `${label}: mixed projection_basis ${[...bases].join(", ")}`);
    return bases.size === 1 ? [...bases][0] : null;
  };

  const determinationBasis = determination ? determination.projection_basis : null;
  const proceedingBasis = single(proceedings, "proceeding");
  const allegationBasis = single(allegations, "allegation");
  const stages = new Set(proceedings.map(record => record.procedural_stage ?? null));
  return {
    source_record_id: sourceRecordId,
    determination: {
      ids: determination ? [determination.id] : [],
      retired_ids: retired.map(record => record.id),
      retired_projection_basis: single(retired, "tombstone"),
      projection_basis: determinationBasis,
      admission_status: determination ? determination.admission_status : null,
      disposition: determination ? determination.disposition : null,
      state: determination ? basisToState(determinationBasis) : "missing",
    },
    allegation: {
      ids: allegations.map(record => record.id),
      projection_basis: allegationBasis,
      state: allegationBasis ? basisToState(allegationBasis) : "missing",
    },
    proceeding: {
      ids: proceedings.map(record => record.id).sort(),
      projection_basis: proceedingBasis,
      procedural_stage: stages.size === 1 ? [...stages][0] : null,
      state: proceedingBasis ? basisToState(proceedingBasis) : "missing",
    },
    category_anchor: { expected_anchors: categoryAnchors, state: categoryState },
    obligation_anchor: {
      expected_anchors: obligationAnchors,
      state: categoryState === "conflicted" ? "missing" : obligationAnchors.length > 0 ? "curated" : "missing",
    },
  };
}

function assertFixtureMatches(observed, fixture) {
  const hops = Object.fromEntries(fixture.hops.map(hop => [hop.hop, hop]));
  assert.equal(observed.source_record_id, fixture.source_record_id, `${fixture.id}: source record`);

  const det = hops.determination;
  assert.deepEqual(observed.determination.ids, det.ids, `${fixture.id}: determination ids`);
  assert.equal(observed.determination.state, det.state, `${fixture.id}: determination state`);
  if (det.ids.length > 0) {
    assert.equal(observed.determination.projection_basis, det.projection_basis, `${fixture.id}: determination basis`);
    assert.equal(observed.determination.admission_status, det.admission_status, `${fixture.id}: admission status`);
    assert.equal(observed.determination.disposition, det.disposition, `${fixture.id}: disposition`);
  }
  assert.deepEqual(observed.determination.retired_ids, det.retired_ids ?? [], `${fixture.id}: retired determinations`);
  if (det.retired_ids?.length) {
    assert.equal(observed.determination.retired_projection_basis, det.retired_projection_basis, `${fixture.id}: tombstone basis`);
  }

  const alg = hops.allegation;
  assert.deepEqual(observed.allegation.ids, alg.ids, `${fixture.id}: allegation ids`);
  assert.equal(observed.allegation.projection_basis, alg.projection_basis, `${fixture.id}: allegation basis`);
  assert.equal(observed.allegation.state, alg.state, `${fixture.id}: allegation state`);

  const pro = hops.proceeding;
  assert.deepEqual(observed.proceeding.ids, [...pro.ids].sort(), `${fixture.id}: proceeding ids`);
  assert.equal(observed.proceeding.projection_basis, pro.projection_basis, `${fixture.id}: proceeding basis`);
  assert.equal(observed.proceeding.state, pro.state, `${fixture.id}: proceeding state`);
  if (Object.hasOwn(pro, "procedural_stage")) {
    assert.equal(observed.proceeding.procedural_stage, pro.procedural_stage, `${fixture.id}: procedural stage`);
  }
  for (const excluded of pro.excluded_ids ?? []) {
    assert.ok(!observed.proceeding.ids.includes(excluded), `${fixture.id}: ${excluded} must not be on the path`);
  }

  const cat = hops.category_anchor;
  assert.equal(observed.category_anchor.state, cat.state, `${fixture.id}: category anchor state`);
  assert.equal(stable(observed.category_anchor.expected_anchors), stable(cat.expected_anchors), `${fixture.id}: category anchors`);

  const obl = hops.obligation_anchor;
  assert.equal(observed.obligation_anchor.state, obl.state, `${fixture.id}: obligation anchor state`);
  assert.equal(stable(observed.obligation_anchor.expected_anchors), stable(obl.expected_anchors), `${fixture.id}: obligation anchors`);

  const proceduralStates = [observed.determination.state, observed.proceeding.state].filter(state => state !== "missing");
  const procedural = proceduralStates.includes("conflicted") ? "conflicted"
    : proceduralStates.includes("inferred") ? "inferred"
      : proceduralStates.length > 0 ? "curated" : "missing";
  assert.deepEqual(
    { procedural, category_anchor: observed.category_anchor.state, obligation_anchor: observed.obligation_anchor.state },
    fixture.summary,
    `${fixture.id}: summary`,
  );
}

function applyMutation(graph, mutation) {
  const record = graph.byId.get(mutation.record);
  assert.ok(record, `mutation target ${mutation.record} not found`);
  record[mutation.field] = structuredClone(mutation.value);
}

function fixtureGraph(baseGraph, fixture) {
  if (!fixture.synthetic) return baseGraph;
  const graph = cloneGraph(baseGraph);
  applyMutation(graph, fixture.synthetic_mutation);
  return graph;
}

const graph = await loadGraph();

test("fixture file is internally consistent", () => {
  assert.ok(fixtureFile.fixtures.length >= 4 && fixtureFile.fixtures.length <= 8, "aim for 4 to 8 fixtures");
  const ids = new Set();
  for (const fixture of fixtureFile.fixtures) {
    assert.ok(!ids.has(fixture.id), `duplicate fixture id ${fixture.id}`);
    ids.add(fixture.id);
    assert.ok(nativeById.has(fixture.source_record_id), `${fixture.id}: ${fixture.source_record_id} is not an included record`);
    assert.equal(typeof fixture.synthetic, "boolean", `${fixture.id}: synthetic flag required`);
    if (fixture.synthetic) assert.ok(fixture.synthetic_mutation && fixture.synthetic_note, `${fixture.id}: synthetic fixtures must declare the mutation`);
    const hopNames = fixture.hops.map(hop => hop.hop);
    assert.deepEqual(hopNames, ["determination", "allegation", "proceeding", "category_anchor", "obligation_anchor"], `${fixture.id}: hop order`);
    for (const hop of fixture.hops) {
      assert.ok(STATES.has(hop.state), `${fixture.id}/${hop.hop}: state ${hop.state}`);
      if (hop.projection_basis != null) {
        assert.ok(KNOWN_BASES.has(hop.projection_basis), `${fixture.id}/${hop.hop}: unknown basis ${hop.projection_basis}`);
        // The fixture may not label an inferred basis as curated, or the reverse.
        assert.equal(hop.state, basisToState(hop.projection_basis), `${fixture.id}/${hop.hop}: state does not follow projection_basis`);
      }
      if (hop.hop === "category_anchor") {
        for (const anchor of hop.expected_anchors) assert.match(anchor, CATEGORY_ANCHOR_RE, `${fixture.id}: category anchor IRI`);
        if (hop.state !== "curated") assert.deepEqual(hop.expected_anchors, [], `${fixture.id}: only a curated category hop may expect anchors`);
      }
      if (hop.hop === "obligation_anchor") {
        for (const anchor of hop.expected_anchors) assert.match(anchor, OBLIGATION_ANCHOR_RE, `${fixture.id}: obligation anchor IRI`);
        if (hop.state !== "curated") assert.deepEqual(hop.expected_anchors, [], `${fixture.id}: only a curated obligation hop may expect anchors`);
      }
    }
  }
  const states = new Set(fixtureFile.fixtures.flatMap(fixture => fixture.hops.map(hop => hop.state)));
  for (const state of STATES) assert.ok(states.has(state), `fixtures must cover the ${state} state`);
  assert.ok(fixtureFile.fixtures.some(f => !f.synthetic && f.summary.procedural === "curated"), "a non-synthetic fully curated procedural path");
  assert.ok(fixtureFile.fixtures.some(f => !f.synthetic && f.summary.procedural === "inferred"), "a non-synthetic legacy-inferred path");
  assert.ok(fixtureFile.fixtures.some(f => !f.synthetic && f.summary.category_anchor === "missing"), "a non-synthetic missing-anchor path");
  assert.ok(fixtureFile.fixtures.filter(f => f.summary.category_anchor === "conflicted").every(f => f.synthetic), "conflicted fixtures must be synthetic");
});

test("recount of curated versus inferred procedural meaning matches the fixture", () => {
  const included = nativeData.datasets.included.records;
  const proceedings = ofType(graph, "of:Proceeding");
  const determinations = ofType(graph, "of:Determination");
  const byBasis = (records, basis) => records.filter(record => record.projection_basis === basis);
  const mattersWhere = (records, predicate) => new Set(records.filter(predicate).map(record => record.ai_incident_law_record_id));
  const curatedProceedingMatters = mattersWhere(proceedings, record => record.projection_basis === "curated-legal-graph");
  const observed = {
    included_matters: included.length,
    matters_with_legal_graph_block: included.filter(record => record.legal_graph && typeof record.legal_graph === "object").length,
    matters_with_curated_proceedings: curatedProceedingMatters.size,
    matters_with_curated_determinations: mattersWhere(determinations, record => record.projection_basis === "curated-legal-graph").size,
    matters_with_inferred_proceedings: new Set(proceedings.map(record => record.ai_incident_law_record_id))
      .size - curatedProceedingMatters.size,
    proceedings_curated: byBasis(proceedings, "curated-legal-graph").length,
    proceedings_inferred: proceedings.filter(record => record.projection_basis.startsWith("legacy-")).length,
    determinations_curated: byBasis(determinations, "curated-legal-graph").length,
    determinations_inferred: determinations.filter(record => record.projection_basis.startsWith("legacy-")).length,
    determinations_with_category_anchors: determinations.filter(record => list(record.anchors).some(a => CATEGORY_ANCHOR_RE.test(a))).length,
    determinations_with_obligation_anchors: determinations.filter(record => list(record.anchors).some(a => OBLIGATION_ANCHOR_RE.test(a))).length,
    conflicted_category_hops_in_corpus: determinations.filter(record => {
      const native = nativeById.get(record.ai_incident_law_record_id);
      return !native || stable(list(record.anchors)) !== stable(list(native.obligation_first_anchors));
    }).length,
  };
  assert.deepEqual(observed, fixtureFile.expected_counts);
  for (const record of [...proceedings, ...determinations]) {
    assert.ok(KNOWN_BASES.has(record.projection_basis), `${record.id}: unknown projection_basis ${record.projection_basis}`);
  }
});

for (const fixture of fixtureFile.fixtures) {
  test(`traversal ${fixture.id} resolves as the fixture says${fixture.synthetic ? " (synthetic mutation)" : ""}`, () => {
    const observed = traverse(fixtureGraph(graph, fixture), fixture.start);
    assertFixtureMatches(observed, fixture);
  });
}

test("no inferred hop is presented as curated anywhere in the generated projection", () => {
  for (const record of graph.byId.values()) {
    const state = basisToState(record.projection_basis);
    if (record.projection_basis.startsWith("legacy-")) assert.equal(state, "inferred", record.id);
    if (record["@type"] === "of:Proceeding" || record["@type"] === "of:Determination") {
      const native = nativeById.get(record.ai_incident_law_record_id);
      const key = record["@type"] === "of:Proceeding" ? "proceedings" : "determinations";
      const curatedInSource = Boolean(native?.legal_graph) && Object.hasOwn(native.legal_graph, key);
      assert.equal(state === "curated", curatedInSource,
        `${record.id}: projection_basis ${record.projection_basis} disagrees with legal_graph.${key} presence in ${record.ai_incident_law_record_id}`);
    }
  }
});

test("the real corpus carries no conflicted category hop and no obligation anchor", () => {
  for (const determination of ofType(graph, "of:Determination")) {
    const observed = traverse(graph, { kind: "determination", id: determination.id });
    assert.notEqual(observed.category_anchor.state, "conflicted", determination.id);
    assert.equal(observed.obligation_anchor.state, "missing", `${determination.id}: no concrete obligation anchor is curated in the corpus`);
    assert.deepEqual(observed.obligation_anchor.expected_anchors, [], determination.id);
  }
});

test("negative: an expected obligation anchor without curated support must fail", () => {
  const fixture = structuredClone(fixtureFile.fixtures.find(f => f.id === "F15-02-curated-through-category"));
  const hop = fixture.hops.find(h => h.hop === "obligation_anchor");
  hop.state = "curated";
  hop.expected_anchors = ["https://everyailaw.com/obligation/human-oversight-of-ai-outputs.json"];
  fixture.summary.obligation_anchor = "curated";
  const observed = traverse(graph, fixture.start);
  assert.throws(() => assertFixtureMatches(observed, fixture), /obligation anchor/);
});

test("negative: a category anchor may not be promoted to an obligation anchor", () => {
  const mutated = cloneGraph(graph);
  const determination = mutated.byId.get("aiel-2023-002-determination");
  // Even if a producer rewrote the category IRI into an obligation IRI, the native record does not
  // support it, so the hop must surface as conflicted rather than as a curated obligation.
  determination.anchors = ["https://everyailaw.com/obligation/human-oversight.json"];
  const observed = traverse(mutated, { kind: "determination", id: "aiel-2023-002-determination" });
  assert.equal(observed.category_anchor.state, "conflicted");
  assert.equal(observed.obligation_anchor.state, "missing");
  assert.deepEqual(observed.obligation_anchor.expected_anchors, []);
});

test("negative: a hop labelled curated whose record has a legacy-* basis must fail", () => {
  const fixture = structuredClone(fixtureFile.fixtures.find(f => f.id === "F15-04-legacy-inferred-with-category"));
  const hop = fixture.hops.find(h => h.hop === "determination");
  hop.state = "curated";
  fixture.summary.procedural = "curated";
  const observed = traverse(graph, fixture.start);
  assert.throws(() => assertFixtureMatches(observed, fixture), /determination state/);
  // The fixture consistency rule catches the same lie without touching the graph.
  assert.throws(() => assert.equal(hop.state, basisToState(hop.projection_basis)));
});

test("negative: a generated record that downgrades to legacy inference breaks a curated fixture", () => {
  const mutated = cloneGraph(graph);
  mutated.byId.get("aiel-2024-001-proceeding").projection_basis = "legacy-record-inference";
  const fixture = fixtureFile.fixtures.find(f => f.id === "F15-01-curated-reviewed-no-anchor");
  const observed = traverse(mutated, fixture.start);
  assert.throws(() => assertFixtureMatches(observed, fixture), /proceeding (basis|state)/);
});

test("negative: a missing anchor stays missing; a defaulted anchor is reported as conflicted", () => {
  const mutated = cloneGraph(graph);
  mutated.byId.get("aiel-2024-001-determination").anchors = ["https://everyailaw.com/obligation-category/human-oversight.json"];
  const fixture = fixtureFile.fixtures.find(f => f.id === "F15-01-curated-reviewed-no-anchor");
  const observed = traverse(mutated, fixture.start);
  assert.equal(observed.category_anchor.state, "conflicted");
  assert.deepEqual(observed.category_anchor.expected_anchors, []);
  assert.throws(() => assertFixtureMatches(observed, fixture), /category anchor state/);
});

test("negative: a dangling determination relation does not resolve silently", () => {
  const mutated = cloneGraph(graph);
  mutated.byId.get("aiel-2023-002-determination").decides = ["https://aiincidentlaw.org/allegation/does-not-exist.json"];
  assert.throws(() => traverse(mutated, { kind: "determination", id: "aiel-2023-002-determination" }), /does not resolve/);
});
