# AI Incident Law matter and discovery pilot
Date: 2026-09-06 local time, 2026-09-07 UTC. Tranche: T09.

## Operating boundary
This local collector observes source documents for the five included records marked `filed` or `pending`, plus the first page of two official press-release indexes. It produces persistent human review findings. It never admits a matter, updates legal status or AI attribution, changes Checked/Verified dates, or rebuilds public corpus data. INTENT.md remains the admission authority. A source snapshot is not verification of the current proceeding.

| Matter | Configured evidence | Qualification |
|---|---|---|
| AIEL-2024-015, Parks v. McCormac | ACLU case page | Party allegations; not the court docket or judgment |
| AIEL-2024-017, Murphy v. EssilorLuxottica | Complaint PDF on a media mirror | Unsupported; identify original court or party publication before qualified observation |
| AIEL-2025-018, Mobley v. Workday | GovInfo court PDF | One original court document; discrimination remains alleged; not the current docket |
| AIEL-2026-019, Swanson v. IBM | CourtListener docket metadata | Unnamed tool and ML-versus-rules distinction remain unverified |
| AIEL-2026-020, CNN v. Perplexity | CourtListener docket metadata | Unresolved allegations; no disposition inferred |

The two discovery streams are FTC press releases and DOJ Office of Public Affairs press releases. At most 40 distinct release titles on the fetched first page are inspected for explicit AI-related terms. More than 40 makes the scope incomplete. A zero requires a recognized agency index and nonempty official release links before title filtering; a blocked or empty response cannot establish a negative search. The collector does not crawl linked complaints or orders. Even a matching title is only a lead requiring primary-document review and INTENT admission checks.

An exact source URL already in any corpus bucket becomes an existing-matter review. Unmatched AI-related titles become candidates needing primary documents. Insufficient AI attribution remains explicit. Case-name similarity is not identity proof; a reviewer must check duplicates when source URLs differ. Pending reviews survive later empty searches. No new publication follows automatically.

## Run and evidence contract
`npm run observe:matters -- --live` explicitly starts one full bounded pilot, not due-only scheduling. It requires exactly five distinct matters and two streams, at most seven top-level fetch attempts, and zero paid provider calls. An unsupported media mirror consumes no fetch. Each fetch permits at most three redirects on the same normalized host; timeout and size bounds are in `scripts/lib/matter-monitor/fetch.js`. PDF extraction requires local `pdftotext` and original PDF bytes; HTML shells at PDF URLs remain unqualified.

A changed active set fails preflight so a new scope must be reviewed. For a deliberate new run:
Literal
```
cd /Users/snap/Git/ai-incident-law
npm run observe:matters -- --live
```
This makes public-source requests and writes local evidence and the maintenance ledger. Exit codes: 0 healthy, 1 review required, 2 degraded or failed. No scheduled workflow invokes the collector. No email or issue delivery is implemented here.

Raw bytes, extraction text, HTTP receipts, report and review proposals are retained under ignored `.verification-reports/`. Existing nonempty evidence directories are rejected. Durable observations and findings are in `data/maintenance/matter-monitor-state.json`; the shared contract uses revision-checked atomic state writes. Reports and state are checkpointed around each source. Storage failure stops collection. Latest-snapshot comparison must handle a source reverting to earlier content; old findings are preserved and identical evidence retains its stable identity.

Covered matter sources are due in 30 days; discovery scopes and source-repair reviews in seven days. These are local pilot metadata, not activated timers. Sam Rogers owns review; portfolio weekly capacity is still unspecified, which remains a degraded queue condition. Configured unsupported mirrors use the portable ledger's `official_secondary` enum as a technical reference category, with manual collection and unqualified observations; that enum does not certify their authority.

## Pilot result
The authorized live batch made six public-source fetch attempts and no paid calls. Coverage was 3/7: the ACLU page, GovInfo PDF and FTC first-page index. The two CourtListener pages returned HTTP 403. DOJ returned an HTTP 200 Bot Manager interstitial, which remains unavailable. The Murphy media mirror was explicitly unsupported and not fetched.

FTC's 20 distinct official release titles yielded zero keyword matches. DOJ has no valid zero-result receipt. There were no discovery leads and five pending local findings: two baseline document reviews and three active-matter source repairs. The denominator is seven configured sources, not six successful requests or the entire 115-record corpus. No corpus fields or generated public artifacts changed.

A saved-byte replay verifies SHA-256 against retained raw receipts and improves the DOJ diagnostic to `Blocked index response.` without another HTTP request. The original receipt remains preserved. Compact evidence: `ops/evidence/matter-monitor-pilot-2026-09-06.json`. Live raw directory: `.verification-reports/t09-pilot-2026-09-06/`; replay report: `.verification-reports/t09-replay-2026-09-06/`.

## Record age diagnostic
The separate `Record age diagnostic` workflow runs Mondays at 13:47 UTC after publication and also supports manual dispatch. It generates text and JSON reports and attempts artifact upload even if report generation fails. It has a five-minute timeout and retains artifacts for 14 days. Report provenance distinguishes Verified, Checked, absent, invalid and future dates. A report with no records over 180 days does not establish that the corpus is current. This workflow does not collect sources, change records or send notifications.

The local age snapshot covers 115 records: 40 aged 91-180 days, 48 recent and 27 fresh. The five-matter pilot does not clear that wider review backlog. `ops/evidence/historical-review-inventory-2026-09-06.json` enumerates 64 distinct records for B-series planning: the union of records over 90 days old and all review/global entries. Source-access repairs, broader discovery, human review capacity and T02b independent email/missed-run acceptance remain open.

## Validation
`npm run build` and `npm run check` pass, including the new `test:maintenance` suite (21 tests). Offline cases cover bounded requests, incorrect identity, media mirrors, blocked pages, PDF shells, retained pending work, persisted source changes/reversions, persistence failure and report/CLI guards. The maintenance suite also tests date boundaries, malformed dates, age provenance and failure-path artifact handling. The shared freshness core is copied byte-for-byte from the T05/T06 AI Tool Watch implementation. Live source receipts supplement fixtures; fixture success does not qualify inaccessible sources.
