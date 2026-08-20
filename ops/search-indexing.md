<!-- Upstream template: portfolio-search-indexing-audit bundle v5; repository contract v4 -->
---
title: "Search indexing"
purpose: "Property-specific index policy, validation commands, deployment gate, and console follow-up."
status: active
updated: 2026-08-20
owner: "PAICE.work PBC"
open_tasks: []
---
# Search indexing

## Property identity and boundaries

| Field | Value |
|---|---|
| Canonical origin | `https://aiincidentlaw.org/` |
| Provider and property ID | Google Search Console, `sc-domain:aiincidentlaw.org` |
| Property type | Website |
| Owning repository | This repository, `snapsynapse/ai-incident-law` |
| Source boundary | Hand-edited SPA shell in `index.html`; canonical records in `data/data.json` |
| Generated boundary | `data.js` and `api/v1/of/`; the search contract validates the deployable repository root, `.` |
| Hosting boundary | Legacy GitHub Pages root publication from this repository; the 2026-08-18 deployment is the latest archived production evidence |

If deployment begins assembling a staging directory, `search-audit.config.json` must point `outputDir` at that exact artifact and both local and release automation must build it identically.

## Index policy

| Surface | Policy | Reason |
|---|---|---|
| `/` | Index and include in `sitemap.xml` | The single substantive browser destination in the current SPA |
| Error and compatibility pages | `noindex` and omit from sitemap | Not content destinations |
| `/api/*`, `/agents.json`, `/.well-known/*`, and `robots.txt` | Crawlable machine surfaces, omit from sitemap | Agent and data consumption, not canonical HTML search destinations |
| HTTP and `www` origins | Redirect to `https://aiincidentlaw.org/` | Canonical-host consolidation |
| External platform copies | Omit from sitemap | Distribution copies are not site canonical pages |

The root-page visible-word minimum is 70 because the static HTML is an application shell and the incident records are supplied by the generated `data.js`. The page must still retain its current explanatory copy, structured data, canonical, and crawlable rendered application.

## Multilingual policy

The website currently has one English canonical HTML route and no locale-specific routes or `hreflang` surfaces. Records may cite non-English public sources, but source language does not create a separate index target. Any localized browser route requires an explicit policy decision, self-canonical URL, reciprocal `hreflang`, sitemap entry, and repository and production coverage before console action.

## Validation lanes

- Offline: `node scripts/check-search.mjs`
- Production after deployment: `node scripts/check-production-search.mjs`
- Machine-readable output: add `--json`
- Local HTTP test: add `--base=http://127.0.0.1:8765/` after starting the static server on port 8765

Exit code `0` is pass, `1` is a site defect, and `2` is configuration or infrastructure failure.

## Evidence governance

- The living state, index policy, action ledger, do-not-repeat rules, and review triggers belong in this file.
- Sanitized observations belong in `ops/search/<provider>/YYYY-MM-DD/audit.md`; later state must not rewrite an earlier observation.
- Raw exports, account identity, private queries, authenticated URLs, screenshots, traces, cookies, browser state, and unreviewed downloads must remain outside Git, in the ignored `.search-evidence-private/` or `.playwright-mcp/` directories when local retention is necessary.
- A click is not proof of acceptance. Record the visible confirmation, original acceptance date and time when captured, repeat policy, and next-review condition.
- Missing, stale, insufficient, unknown, and zero are distinct states. Do not substitute one for another.

## Deployment and console sequence

1. Run the normal build and offline search contract.
2. If deployment copies or transforms output, stage the exact deployable artifact with the same builder used by release automation.
3. Ensure repository-wide checks include newly scaffolded files, including checks based on `git ls-files`.
4. Deploy through the repository's normal release path.
5. Wait for the deployment to complete.
6. Run the production search contract.
7. Confirm the deployed sitemap URL set matches the repository sitemap.
8. Refresh a materially changed stale sitemap at most once, using its full canonical URL for a domain property.
9. Inspect or request indexing for canonical HTML pages.
10. Start issue-group validation only when matching production behavior is live.
11. Record console state under `ops/search/<provider>/YYYY-MM-DD/`.

## Expected noise

- HTTP and `www` origins are expected redirects and must not receive a validation request.
- Machine endpoints blocked for search crawlers are expected exclusions.
- Synthetic unknown routes must return a true HTTP 404.

## Current classified state

These dates describe the latest archived observation in each lane, not continuously current state.

| Lane or surface | Latest evidence | Observed state | Classification |
|---|---|---|---|
| Repository | 2026-08-20 | Full local `npm run check` passed; the offline search contract covered 1 sitemap page with 0 defects and 0 infrastructure failures | No defect observed |
| Production | 2026-08-18 | Exact local artifact and production contracts each passed for 1 sitemap page with 0 defects and 0 infrastructure failures | No defect observed |
| Homepage URL Inspection | 2026-08-18 | `https://aiincidentlaw.org/` was on Google, indexed, and served over HTTPS; no indexing request was made | No defect observed |
| Page indexing report | 2026-08-18 | Initial processing; indexed and excluded totals, reason groups, report date, and representative URLs were unavailable | Unknown, pending provider data |
| Sitemap | 2026-08-18 | Submission accepted; Success; last read August 18; 1 discovered page; 0 discovered videos | No defect observed; accepted action complete |
| HTTP and `www` origins | Repository policy | Intentional canonical redirects | Expected noise |
| `/api/*`, `/agents.json`, and `/.well-known/*` | Repository policy | Crawl exclusions for machine surfaces outside the HTML sitemap | Expected noise |

Dated provider evidence: `ops/search/GoogleSearchConsole/2026-08-18/audit.md`.

## Console action ledger

Read this table before opening the console. Add only observed actions and confirmations. An accepted request remains pending until a later report proves completion.

| Provider and property | Action and target | Accepted at | Confirmation | Result class | Repeat policy | Next review |
|---|---|---|---|---|---|---|
| Google Search Console, `sc-domain:aiincidentlaw.org` | Submit `https://aiincidentlaw.org/sitemap.xml` | 2026-08-18, exact time not captured, America/Denver | Visible submission confirmation, followed by Success, last read August 18, 1 discovered page, and 0 discovered videos | Accepted and complete | Never repeat unless the sitemap URL changes or GSC names a sitemap failure | Review after the Page indexing report finishes initial processing |

Keep rejected attempts and unknown outcomes distinct from accepted actions. Do not repeat an accepted action merely because the provider report remains stale.

## Do-not-repeat list

- Do not resubmit `https://aiincidentlaw.org/sitemap.xml` while the accepted Success state remains applicable.
- Do not request indexing for the homepage merely to repeat the 2026-08-18 inspection; it was already indexed and no request was needed.
- Do not start or repeat issue-group validation without a named GSC group that contradicts the index policy and a current production pass proving the matching behavior is live.
- Do not treat intentional host redirects or excluded machine endpoints as indexing defects.
- Do not repeat the repository, production, or console audit merely to replace fields that were unavailable while GSC reports were processing.

## Next-review conditions

Review this property only when one of these conditions occurs:

- the Page indexing report advances beyond its 2026-08-18 initial-processing state;
- GSC names a sitemap, indexing, manual-action, security, HTTPS, Core Web Vitals, or enhancement issue;
- a material deployment changes the canonical, sitemap, robots policy, public route set, generated boundary, or hosting boundary; or
- the offline or production search contract fails.

At the next review, resume from the dated evidence and ledger above. Recheck repository and production truth before any console mutation, and record new provider evidence in a new dated directory rather than editing the 2026-08-18 observation.
