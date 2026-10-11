# External supply comparison: one bounded matter

Date: 2026-10-11. Status: candidate for Foundation; no owner decision taken. Scope: this
component's matter, allegation and adjudicative-evidence curation only.

Migrated from the gitignored handoff `handoffs/2026-09-22-moonshots-portfolio-followup.md`,
which was consumed and deleted. This file carries no new authority. It does not change
corpus records, admission policy, generated projections, services or publication.

## Why this exists

The 2026-09-22 Moonshots review decided that the PAICE Legal Graph is a core undertaking
because legal outcomes are one of the few arenas that can actually be validated, and that
scope already served by others should not be maintained redundantly (portfolio record:
`paice-foundation/INTENT.md` and
`paice-foundation/portfolio/strategy/2026-09-22-moonshots-dispositions.md`). The standing
adopt-first rule requires checking actual fit, rights and integration constraints before
declaring a substitute adequate. Foundation allocated matter and decision curation to this
repository and asked for one comparison row per concrete capability.

A condition carried from that direction: AI Incident Law's distinct matter, proceeding,
allegation and adjudicative-outcome semantics must survive any proposed substitution. A
general incident catalog does not, by existing, supply adjudicated legal outcomes, and a
model or tracker agreeing with a record is not legal adjudication.

## Bounded matter and sources compared

Matter: **AIEL-2023-002, Mata v. Avianca, Inc., No. 22-cv-1461 (S.D.N.Y.)**. Chosen because
it is the most-cited matter in the field, it already carries a curated `legal_graph`
projection and a source review (`ops/mata-event-date-review-2026-09-08.md`), it is the Mata
fixture for the case-to-law link limit in `ops/CROSS-REPO-MITIGATION-2026-09-14.md`, and
every external source named in owner records covers it. One matter is evidence about fit,
not about coverage of the corpus.

External sources compared are only those already named in owner records:

- Incident tracker: Damien Charlotin's AI Hallucination Cases database, named as a
  primary discovery channel by the `find-new-cases` skill and barred as a citable source in
  every dataset field by the 2026-07 source policy (`CHANGELOG.md`).
- Court: CourtListener search API and RECAP storage (`scripts/find-recap-source.mjs`,
  `ops/MATTER-MONITOR-PILOT.md`); GovInfo USCOURTS (`ops/evidence/docket-followup-2026-09-09.md`);
  PACER, named as the paid fallback.
- Regulatory: FTC and DOJ publications named in `ROADMAP.md` "Standing maintenance
  cautions". Mata has no regulatory component, so this column is recorded as not exercised.

Not compared: general AI incident catalogs (for example the AI Incident Database, OECD AIM,
AIAAIC). None is named in an owner record of this repository, so including one would be new
whole-market research that Foundation asked each repo not to duplicate.

### Retrieval log

Public, unauthenticated, read-only. curl with a descriptive User-Agent. Bytes were held in a
session scratch directory and are not retained under `data/admission/raw/`, because no
record field changes.

| UTC | URL | Result | SHA-256 |
|---|---|---|---|
| 2026-10-11T21:55:53Z | https://damiencharlotin.com/hallucinations/?q=Mata | 200 text/html, 67,288 B | `b3a9ffa1ec7a3a68d454c1cd8ef2a639e42040aef40b0a7a53d597cf939db11c` |
| 2026-10-11, approx. 21:57Z | https://damiencharlotin.com/hallucinations/hallucinations/download.csv | 200 text/csv, 2,085,934 B, 2,185 rows | `1504bb05971d1a2d804eae2c3c5e9836a1819d06827bfea7df6dcf9218e7b731` |
| 2026-10-11T21:55:54Z | CourtListener v4 search, `q="Mata v. Avianca"&type=r&court=nysd` | 200 application/json | `8c3cceec9967d4cad6db2ac829f4faf9b454861f578e4d50b66c374c432bb121` |
| 2026-10-11T21:55:54Z | CourtListener v4 dockets, `pacer_case_id=575368&court=nysd` | 401 "Authentication credentials were not provided." | n/a |
| 2026-10-11T21:55:55Z | CourtListener v4 search, `q="Mata v. Avianca"&type=o` | 200, 48 hits, none the Mata opinion in the first page | `71b65d583440b0a88e6f1bbafd7de168c10c89707b8838d9861f1d8de4278e96` |
| 2026-10-11T21:55:55Z | GovInfo package `USCOURTS-nysd-1_22-cv-01461` (details and PDF paths) | 500, and 200 redirect to `/error` | n/a, no package |
| 2026-10-11T21:55:56Z | https://storage.courtlistener.com/recap/gov.uscourts.nysd.575368/gov.uscourts.nysd.575368.54.0_8.pdf | 200 application/pdf, 2,341,028 B | `68c7e61823d8dd1540e1b8ce61ce3da99d601f032e4ea22825eba224a78c4d32`, identical to the 2026-09-08 retained source |
| 2026-10-11T21:55:56Z | https://courtlistener.com/terms/ and `/terms/v/2/` | 403 | not read |
| 2026-10-11, approx. 21:58Z | CourtListener REST API help (redirects to wiki.free.law) | 200 | read for authentication and throttling only |

The `damiencharlotin.com` URLs above are written bare per portfolio convention; the host is
in `WWW_REQUIRED_HOSTS` because its bare domain does not serve, so the fetch used `www`.

## Field coverage

What each source supplies for this one matter. "Native" is the AI Incident Law record;
"graph" is its Obligation-First projection.

| Field or unit | AI Incident Law | Tracker | CourtListener / RECAP | GovInfo |
|---|---|---|---|---|
| Caption and court | Native: caption with docket number; court as a typed Authority with a Wikidata `same_as` | Caption without docket number; court as free text "S.D. New York" | Caption, docket number `1:22-cv-01461`, court id `nysd`, docket id, PACER case id | No package for this docket |
| Proceeding as an entity | Graph: Proceeding filed 2022-02-22 (removal), matter type and procedural stage, from the retained order's findings | None. One row per decision | Docket: filed 2022-02-22, terminated 2023-07-07, cause, nature of suit "310 Airplane", assigned judge | None |
| Parties | Graph: deliberately empty proceeding `parties`, because the retained order does not support the AI deployer as plaintiff or defendant; respondents named in the Determination notes | "Party(ies)": role class only ("Lawyer") | Party and attorney names, untyped in search results | None |
| Allegation | Graph: Allegation from the native error description; `asserted_by` reports that no asserting party is identified in indexed fields | Item-level list: 18 hallucination items typed Fabricated, Misrepresented or False Quotes, plus "Alleged: No" | Docket entry descriptions only | None |
| Determination | Graph: Determination issued 2023-06-22, disposition confirmed, decides the Allegation, remedy notes | "Outcome" and "Monetary Penalty: 5000 USD"; "Professional Sanction: No" | The order itself (Dkt. 54), not a structured outcome | None |
| AI system | "ChatGPT" | "ChatGPT", with a page note that naming a tool does not mean it caused the defect | None | None |
| Admission and review state | `admission_status: legacy-unreviewed` on all three graph records; no receipt in `data/admission/receipts.json` | None | n/a | n/a |
| Considered and declined | Prose terminal dispositions on candidates (see below) | None. Exclusions are not published | n/a | n/a |
| Link to law | EveryAILaw `human-oversight` obligation category anchor, an editorial link that does not assert applicability | Legal field "contract", secondary "bankruptcy" | Cause "28:1331 Fed. Question" | n/a |
| Primary document | RECAP Dkt. 54, retained bytes and locators in the source review | Links the same RECAP Dkt. 54 PDF in its "Source" column | Hosts it | n/a |

Coverage outcome for this matter: the tracker is richer than AI Incident Law on item-level
hallucination detail, and CourtListener is richer on docket metadata and named parties. AI
Incident Law alone supplies the proceeding/allegation/determination separation, the
explicit non-assertion of proceeding parties, a typed authority, admission state, and a
link into the obligation layer.

## Provenance

- Tracker: a single-author curated database. Each row links one source document, usually a
  copy hosted on the tracker's own `/documents/` path or a court host; for Mata it links
  RECAP. It has no per-field locators and no record of who reviewed what, when.
- CourtListener: Free Law Project's mirror of PACER and court sites. RECAP PDFs are
  byte-stable here (the 2026-10-11 hash equals the 2026-09-08 retained hash). Docket
  metadata is crowd-sourced from RECAP uploads and is incomplete where nobody bought the
  entry, which `ops/evidence/docket-followup-2026-09-09.md` already records for other
  matters.
- AI Incident Law: source-located receipts for reviewed changes under
  `ops/SOURCE-ADMISSION.md`. Mata is not yet one of them: the 2026-09-08 review was a
  reviewed correction with locators, but the record still projects as `legacy-unreviewed`.
  That is this repository's own provenance debt and is disclosed rather than hidden.

## Update history

- Tracker: a site-wide "Last updated: 10 October 2026" stamp, 2,185 rows. No per-row
  update date and no public change log in the page or CSV, so a consumer cannot tell when
  a row changed or what changed.
- CourtListener: live; docket metadata changes as RECAP uploads arrive. No per-field
  history is exposed through anonymous search.
- AI Incident Law: per-record `last_verified_date`, Git history, dated receipts and a
  public CHANGELOG. `generated_at` is derived from record dates and displayed.

## Access and reuse terms

| Source | Access observed 2026-10-11 | Reuse terms observed |
|---|---|---|
| Tracker | HTML and a full CSV export, no authentication | Page states CC BY 4.0, "free to reuse, including commercially, with attribution", with a prescribed citation. Compatible with this dataset's CC BY 4.0 |
| CourtListener search | Anonymous search works; the dockets endpoint returns 401 without a token; docket HTML pages have returned 403 to scripted access since 2026-09 | Terms page returned 403 and was not read. API help describes token authentication and rolling-window throttling. Reuse terms remain unknown here |
| RECAP storage | Anonymous, byte-stable | Court documents; per-document copyright not assessed |
| GovInfo | Anonymous; no package for this docket | Not assessed for this matter |
| PACER | Paid per page | Not exercised |

The license is not what bars the tracker from source fields. The 2026-07 source policy bars
it because a tracker is not the issuing body. That policy is about evidence quality and
stays separate from any reuse decision.

## Semantic fit: where a substitution would change meaning

Observed on this matter and on the terminal dispositions the corpus already holds. Each is
a fit gap, not a claim that the tracker is wrong for its own purpose, which is discovery and
practice commentary.

1. **No proceeding layer.** The tracker keys a row to a decision date. It has no docket
   number in the CSV, so joining a row to a proceeding requires caption matching, and two
   decisions in one proceeding become two unrelated rows. Mullins v. Duquesne appears twice
   (2025-12-05 "Reply struck; Order to disclose AI use", and 2026-07-15 "Motion to strike
   denied").
2. **Different admission boundary.** The tracker's own scope note includes "some judicial
   decisions where AI use was alleged but not confirmed", as a judgment call, and its "AI
   Tool: Implied" value marks rows where the source names no tool. The corpus's three
   terminal not-admissible candidates are all present in the tracker:
   - AIEL-CAND-013 Maxwell v. Michael: tracker row 2026-05-26, "Implied", "Monetary
     Sanction". Declined here because the order establishes deliberate human fabrication.
   - AIEL-CAND-015 H. C. v. Contreras: tracker row 2026-05-28, "Implied", sourced to a
     commentary blog post rather than the opinion. Declined here because the opinion never
     mentions AI.
   - AIEL-CAND-017 Mullins v. Duquesne: tracker rows above, "Alleged: Yes" on the 2026-07-15
     row. Declined here because no defect was established.
   Substituting the tracker for the corpus would therefore reintroduce exactly the overclaim
   the undetermined-attribution and outcome-valence rules exist to prevent.
3. **Allegation and determination are flattened.** "Alleged" is one boolean per row, 22 of
   2,185 rows "Yes". The tracker cannot represent a pending allegation with no
   determination, or a determination that decides some allegations and not others.
4. **Classification divergences on Mata.** The tracker's legal field reads "contract" with
   "bankruptcy" secondary, while CourtListener's nature of suit is "310 Airplane" (personal
   injury) and the tracker's own details text says personal injury. Conversely, the tracker
   reads "Professional Sanction: No" where this record carries the tag
   `professional-discipline` for a Rule 11 sanction. Neither is resolved here; see unknowns.
5. **Scope outside the tracker.** 60 of 72 included records are fabricated-authority or
   hallucination matters, and a rough caption-token match finds 57 of those 60 in the CSV
   (heuristic, not verified, so it is an upper bound on the overlap). The other 12 included
   records (discriminatory output, false biometric match, false fraud classification,
   wrongful eligibility and policy misstatement, several of them regulatory enforcement) are
   outside the tracker's scope entirely, and outside CourtListener's for non-federal and
   agency matters.

## Residual value beyond discovery and hosting

What remains this component's contribution if discovery and document hosting are taken from
external supply:

- The proceeding/allegation/determination separation, with explicit non-assertion where a
  source does not support a role (Mata's empty proceeding `parties`).
- Admission under published criteria, including the decisions that a matter is **not** an
  AI incident, with reasons. No named external source publishes its exclusions.
- Admission and review status per graph record (`legacy-unreviewed`, reviewed, unresolved
  items), served through the MCP tools.
- Source-located receipts with retained bytes for reviewed changes.
- Typed authorities and the editorial link into EveryAILaw obligation categories, with the
  stated limit that a category anchor is not applicability.
- Coverage of non-hallucination legal and regulatory matters that no named source covers.

What is plausibly redundant: first-pass discovery of hallucination sanctions orders (already
delegated to the tracker), document hosting for federal filings (already delegated to
RECAP), and item-level enumeration of each fabricated citation (never maintained here, and
the tracker does it better).

## Candidate supply/gap row

In the shape Foundation asked for. A candidate for the shared Legal Graph comparison, not a
decision.

| Column | Entry |
|---|---|
| Capability | Curated matter and adjudicative-outcome evidence for AI legal incidents, projected as Obligation-First Proceeding, Allegation and Determination records |
| Consumer / task | Agents and researchers asking "what has a tribunal actually decided about an AI failure, and on what source"; EveryAILaw case-to-law links; calibration eval cases |
| Current owner and burden | AI Incident Law steward. 72 included, 30 review, 23 global; 63 included records still `legacy-unreviewed`; at most five matters per session; several candidates held on sourcing alone |
| External supply, evidence and date | Charlotin AI Hallucination Cases database, 2,185 rows, CC BY 4.0, CSV, updated 2026-10-10; CourtListener search and RECAP; GovInfo USCOURTS. Checked against Mata on 2026-10-11 (this file) |
| Access and rights | Tracker open and CC BY 4.0. RECAP bytes open. CourtListener docket API needs a token; docket pages 403 to scripts; terms not read. PACER paid |
| Semantic and freshness fit | Tracker: fresher and finer on hallucination items; no proceeding layer, flattened allegation/determination, wider admission boundary that includes all three corpus refusals, no per-row history. CourtListener: authoritative docket metadata for federal matters, no AI semantics |
| Remaining gap | Proceeding/allegation/determination separation; published exclusions; admission state; receipts; typed authority and obligation linkage; non-hallucination and regulatory matters |
| Downstream impact if substituted | Obligation-First stable IDs, contract fingerprint, MCP `admission_status` disclosure and the planned calibration eval would lose their subject; EveryAILaw case links would point at untyped tracker rows; overclaim risk returns |
| Recommendation | **Narrow, do not replace.** Keep adopting the tracker for discovery and RECAP for hosting, as now. Stop treating item-level hallucination enumeration and docket metadata as anything this repo maintains. Retain curation of the legal-outcome layer and the refusals |
| Unresolved decision | Whether to add a non-source crosswalk to tracker rows and CourtListener docket ids (see outline); whether to contribute corrections or exclusion reasons upstream to the tracker; who reads CourtListener terms |

## Dependency-preserving transition outline

Each step is separately gated by the owner and none removes a capability before its
replacement is shown to carry the same semantics. Nothing here is authorized by this file.

1. **Hold the current split (no change).** Tracker for discovery, RECAP for bytes, corpus
   for legal semantics. This is already the operating state; record it as the intended one.
2. **Crosswalk, not source.** If chosen, add optional external identifiers (CourtListener
   docket id, tracker caption and date) in a field distinct from the three source fields, so
   the source policy is untouched. Preconditions: a schema decision, an answer to whether a
   crosswalk edit needs an admission receipt (the same question the terminal-dispositions
   proposal raises), and an accounted Obligation-First fingerprint delta. Stable record and
   graph IDs must not change.
3. **Structured refusals first.** The tracker comparison makes the
   `handoffs/2026-09-22-structured-terminal-dispositions.md` proposal more valuable, not
   less: published exclusions are the clearest difference from external supply. Doing that
   work before any narrowing keeps the overclaim guard machine-visible.
4. **Acceptance test before narrowing.** Use the calibration-eval shape in
   `handoffs/2026-09-22-calibration-eval.md` as the acceptance gate: any narrowed or
   crosswalked payload must still carry `admission_status`, attribution qualifiers and the
   allegation/determination split, with negative controls that fail when they are dropped.
   This file uses those two proposals as evidence only; it does not start them.
5. **Optional contribution upstream.** Corrections or exclusion reasons could be offered to
   the tracker under its terms. That is an external send and needs the owner's explicit
   request.
6. **Review.** Reassess at the Q4 INTENT review (2026-11-30) with any crosswalk or eval
   evidence in hand.

## Unknowns and owner choices

- CourtListener terms of use were not read (HTTP 403 to scripted access). Reuse of its
  metadata at scale is unassessed.
- Whether the underlying Mata action's dismissal has a determination source. The record says
  the lawsuit was dismissed; CourtListener reports termination on 2023-07-07; neither is an
  adjudicative document for the dismissal, and none was retrieved.
- The `professional-discipline` tag on AIEL-2023-002 against a Rule 11 sanction, and the
  tracker's "contract" legal field, are unreconciled classification questions. Changing the
  tag is a record change under `ops/SOURCE-ADMISSION.md` and was not made.
- The tracker's 2025-12-05 Mullins row ("Reply struck; Order to disclose AI use") may be a
  separate ruling from the one AIEL-CAND-017 disposed of. A lead only; the terminal
  disposition is not reopened by this file.
- The caption-token overlap (57 of 60) is unverified and may include false matches.
- General incident catalogs were not compared. Doing so is Foundation's call, once, for the
  whole graph.
- Owner choices: adopt the "narrow, do not replace" recommendation or not; whether to build
  the crosswalk; whether structured terminal dispositions and the calibration eval should be
  sequenced ahead of any narrowing.
