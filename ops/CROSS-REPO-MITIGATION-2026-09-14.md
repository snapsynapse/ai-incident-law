# Cross-repo mitigation queue

Migrated 2026-09-22 from `handoffs/2026-09-14-cross-repo-assessment.md` and
`handoffs/2026-09-14-cross-repo-evals.md`, which were consumed and deleted. This file is the
owner-side record of what AI Incident Law still owes the PAICE legal graph. It carries no
new authority: legal review, source discovery, release and platform migration each need
their own existing grant.

Durable specification and cross-repo assignments live in the private Foundation workspace:

- Responsibilities: `paice-foundation/portfolio/legal-graph/interfaces.md`
- Eval design, inputs, negative controls, acceptance limits (EV02/EV03/EV06):
  `paice-foundation/portfolio/legal-graph/plans/cross-repo-evals.md`
- Coordination, approvals and resumption: `paice-foundation/portfolio/legal-graph/README.md`

Read those before implementing anything below. Do not treat zero open GitHub issues as zero
source debt.

## Baseline observed at assignment

Assessed at `f154c35`, clean tree, Validate and Pages green. Obligation-First schema and
federation pin `7f032fc5482b34359770bc50ca6fa94c6606e6fb`. The projection carried 333
records. All 64 cross-host anchors resolved, and every one pointed at an EveryAILaw
obligation **category**, not a concrete statutory obligation.

## AIL-1: establish the actual limit of case-to-law links

No AIL anchor targets a concrete EveryAILaw statutory Obligation. The Mata fixture joins a
human-oversight category and returns 34 related duties; it explicitly does not establish
applicability. This is a coverage limitation, not a broken-anchor defect, and it should be
stated that way rather than repaired by force.

1. Act only if a real question requires a specific connection. Identify a finite existing
   matter and the exact primary source that may support it. Do not launch broad new-case
   discovery from this queue.
2. Establish the precise provision and the public EveryAILaw identifier, keeping allegation
   and adjudication distinct. If no supported nexus exists, record the limit and stop.
3. Add any supported assertion through source admission and shared candidate validation.
   Preserve stable IDs and retirement behavior.
4. Extend the bounded consumer fixture so a category-only path cannot be represented as
   applying a specific statute, including a negative control where a generic category path
   is improperly strengthened.

Acceptance: the answer states the source-supported relationship and its limits exactly. No
inferred case-to-duty links, no litigation-process similarity standing in for a duty, no
draft promotion, no fabricated determination.

## AIL-2: make source-review scope visible for selected records

Native admission passed with 117 entries: 111 legacy-unreviewed and six with reviewed
changes, and all six review packets retained unresolved questions. The generated export
carried 312 legacy-unreviewed records and 21 with reviewed changes.

For any matter work, read `ops/SOURCE-ADMISSION.md`, `INTENT.md` and the matching native
and receipt files. Preserve admission state and unresolved questions through native data,
the generated graph and consumer results. Partial review must never become whole-record
human verification, and a filed or pending matter must not gain an adjudicative
determination without source support.

## AIL-3: candidate coordination and finite context

This repository's PR gate does not resolve private EveryAILaw targets the way the complete
private federation runner does. When an anchor or source projection changes, supply the
EveryAILaw reviewed candidate lane with the exact AI Incident Law commit and a separate
admission base, and require its retained tuple result before coordinated delivery. Test the
intended candidate combination rather than whichever sibling main happens to be current.
Keep restricted EveryAILaw corpus material out of public source, tests and artifacts.

Root-published GitHub Pages and the absent `llms-full.txt` are recorded exceptions in
`INTENT.md`, not newly introduced failures. Preserve them; a scanner warning about Pages is
not authority for a migration.

## Evals owed

- **EV02, category and proceeding controls.** Obligation-First owns the traversal evaluator;
  this repository owns source-grounded matter fixtures. All 64 assessed anchors pointed at
  categories, so the starting test must preserve that relationship strength rather than
  treat a missing direct statutory edge as an error. Negative controls must reject: a
  category path asserted as statutory application, a pending allegation turned into
  adjudication, partial review turned into whole-record Verified, and dropped unresolved
  source questions. If no relevant matter supports the first Utah question, contribute
  generic semantic controls rather than fabricate an edge or expand the corpus.
- **EV03, candidate contribution.** Supply the private EveryAILaw runner with the exact
  candidate revision and a separate valid admission base whenever an affected anchor or
  projection changes. A shape gate here does not prove private cross-host target acceptance.
- **EV06/EV07, owner metadata and routes.** Provide current metadata and accepted exceptions
  for the Foundation aggregate check. Preserve canonical record routes and bundled
  projection parity for the post-publication collector.

Use the existing `test:build-of`, `test:legal-graph-source`, `test:of-traversal`,
source-admission and publication-state tests where they apply. Run `npm run verify:ci` in
the intended candidate checkout with its Obligation-First pin and base configuration, then
the shared federation tuple. A passing test supplies no legal evidence, source access,
namespace filing or live customer acceptance.

## Verification commands

Read-only baseline from the owning checkout:

Literal
```bash
git status --short --branch
```

Literal
```bash
npm run check:admission
```

Literal
```bash
node scripts/staleness-report.mjs --json
```

Shared federation after coordinated changes, from `/Users/snap/Git/obligation-first`:

Literal
```bash
npm run verify:federation
```

The last measured tuple was 1,061 records and 66 cross-host anchors; confirm it against the
next reviewed inputs rather than quoting it forward.
