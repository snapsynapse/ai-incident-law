# Handoff: AI Incident Law — join the Legal Graph, diversify the docket

Date: 2026-06-09
Author: Claude (Fable 5) session with Sam, from competitive research run 2026-06-09
Status: Approved direction, ready for implementation
Audience: A Sonnet/Opus-level agent. Phases independently implementable. Read fully before starting. Repo facts below verified against this repo on 2026-06-09.

## Strategic context

Competitive research (2026-06-09, Perplexity sonar-pro): every incumbent AI litigation tracker — GWU Database of AI Litigation (DAIL), Fisher Phillips, Hogan Lovells, McKool Smith, Charlotin's hallucination-cases database — is human-browsable only. No API, no bulk data, no MCP. And no structured dataset anywhere links AI lawsuits to the regulations or legal theories invoked. This repo's obligation_first_anchors (case determinations anchored to EveryAILaw obligation IRIs) is unique at any price.

Honest weaknesses: 50 included cases vs DAIL's much larger docket; 37 of 50 included cases are hallucinated-authority matters, making the dataset look like a hallucination tracker rather than an AI incident law reference; and the repo is not well integrated with the rest of the PAICE Legal Graph in code or presentation (Sam's own assessment, 2026-06-09).

## The Legal Graph and this repo's place in it

Sam's canonical bundle order: **Obligation First** (upper schema) → **EveryAILaw + EveryAILaw Pro** (laws and obligations) → **PubLedge** (verifiable recordkeeping) → **AI Incident Law** (case and enforcement evidence). One serves the regulators and the regulated; this one serves the litigators and the litigated. AI Incident Law is the evidence layer: it shows what courts and agencies actually did when obligations were breached.

Note: this is NOT a pairing of EveryAILaw and AI Incident Law as a two-product unit. The unit is the four-component graph with Obligation First as the schema spine. All integration work below should express the graph, not a bilateral link.

## Phase 1: Thematic unity (presentation integration, 1-2 sessions)

Goal: anyone landing on aiincidentlaw.org understands within seconds that this is the evidence layer of a larger legal graph, and can traverse to the rest.

1. **Legal Graph strip**: a compact, consistent component (header or footer band) naming the four layers in order — Obligation First, EveryAILaw, PubLedge, AI Incident Law — with this site's position highlighted. Design it to be portable: the same strip should be adoptable by the sibling sites later. Keep it lightweight (static HTML/CSS; this site is dependency-free by design — preserve that).
2. **Per-case obligation context**: where a record carries obligation_first_anchors, render the anchored obligation(s) as human-visible links to the EveryAILaw obligation page (e.g. "Anchored obligation: Bias & Discrimination Prevention → everyailaw.com/..."). Today anchors exist in data but are invisible in presentation.
3. **Cross-graph narrative page** ("How this fits"): one page explaining the graph — laws define obligations (EveryAILaw), records prove conduct (PubLedge), cases show consequences (this site), Obligation First makes them one vocabulary. Include the canonical cross-graph query example (see Phase 3).
4. **llms.txt and agents.json**: both already reference sibling projects; upgrade to express the graph structure explicitly (layer name, role, anchor relationship, sibling MCP discovery URLs) so agents traversing one node discover the whole graph.
5. Global copy rules: bare https URLs (no www), no em dashes, Obsidian-compatible markdown. Build via npm run build; validate via npm run check; generated outputs committed with source per repo convention.

## Phase 2: Code-level graph integration (1-2 sessions)

1. **Deepen anchor coverage**: audit which included records lack obligation_first_anchors and backfill where an obligation genuinely applies. Anchoring is editorial — propose, do not bulk-assign; queue uncertain mappings for Sam.
2. **Consume the OF naming profile properly**: validate:of already exists; wire it into CI as a required check (currently optional, requires sibling checkout or OBLIGATION_FIRST_DIR). Pin the expected OF profile version and fail loudly on drift.
3. **Reciprocal linkage**: propose (as a PR or issue to the every-ai-law repo) a reverse index — per obligation, the AI Incident Law determinations anchored to it — generated on the EveryAILaw side from this repo's published OF API. That makes the graph traversable in both directions.
4. **PubLedge linkage** (lightweight, design-only this phase): each included case rests on public records; sketch how record citations could carry PubLedge-style verifiable publication metadata. Write the design note to handoffs/ or an issue; do not build until PubLedge's own direction is set.

## Phase 3: The cross-graph demo (half session, after Phase 1)

Publish a reproducible recipe: one agent session with both MCP servers (this repo's and EveryAILaw's) answering "What obligations does an AI hiring tool trigger in Colorado, and what is the litigation record when those obligations are breached?" Exact MCP config + transcript, published on the narrative page and as a post draft for Sam. This is the single most differentiating artifact the Legal Graph can produce — no other stack can answer it programmatically.

## Phase 4: Diversify and grow the docket (continuous)

1. **Rebalance error types**: prioritize intake of non-hallucination cases — discriminatory output, false match, eligibility/allocation, content-use — from the existing review (16) and global (12) queues first. Target: hallucinated-authority share of included cases visibly below half over time. The hallucination cases are valid; the skew is a positioning liability.
2. **Recruit contributors instead of soloing coverage**: the PR-based intake with admission criteria already exists. Make it visible: a "Submit a case" page with the criteria, the review queue as public evidence that submissions go somewhere, and outreach drafts to the people who already track this space (law school clinics, the authors of the incumbent trackers' write-ups, legal-tech newsletter writers). Drafts only; Sam sends.
3. **Freshness as marketing**: the staleness report and per-record verified dates are trust signals no incumbent shows. Surface a "dataset health" line on the site (records, last verification, oldest unverified) generated at build time.
4. **Distribution**: submit the MCP server to MCP registries and agent directories; cite-this permalinks per record with an explicit agent-citation invitation in llms.txt (same loop as the rest of the portfolio).

## Done criteria

- Phase 1: Legal Graph strip live; anchors visible on case pages; narrative page published; llms.txt/agents.json express the graph.
- Phase 2: anchor audit complete with Sam-reviewed backfill; validate:of required in CI; reverse-index proposal filed on every-ai-law.
- Phase 3: cross-graph recipe published and runnable.
- Phase 4: error-type rebalance plan applied to review queue; submit-a-case page live; MCP listed in 2+ registries; dataset health line live.
