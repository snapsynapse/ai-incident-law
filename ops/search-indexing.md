<!-- Upstream template: portfolio-search-indexing-audit bundle v5; repository contract v4 -->
---
title: "Search indexing"
purpose: "Property-specific index policy, validation commands, deployment gate, and console follow-up."
status: active
updated: 2026-08-18
owner: "PAICE.work PBC"
open_tasks: []
---
# Search indexing

Canonical origin: `https://aiincidentlaw.org/`

Console property ID: `sc-domain:aiincidentlaw.org`

Property mode: `website`

Generated output: `.`

If deployment assembles a separate staging directory, this path must name that exact deployable artifact, not its source directory.

## Index policy

| Surface | Policy | Reason |
|---|---|---|
| `/` | Index and include in `sitemap.xml` | The single substantive browser destination in the current SPA |
| Error and compatibility pages | `noindex` and omit from sitemap | Not content destinations |
| `/api/*`, `/agents.json`, `/.well-known/*`, and `robots.txt` | Crawlable machine surfaces, omit from sitemap | Agent and data consumption, not canonical HTML search destinations |
| HTTP and `www` origins | Redirect to `https://aiincidentlaw.org/` | Canonical-host consolidation |
| External platform copies | Omit from sitemap | Distribution copies are not site canonical pages |

The root-page visible-word minimum is 70 because the static HTML is an application shell and the incident records are supplied by the generated `data.js`. The page must still retain its current explanatory copy, structured data, canonical, and crawlable rendered application.

## Validation lanes

- Offline: `node scripts/check-search.mjs`
- Production after deployment: `node scripts/check-production-search.mjs`
- Machine-readable output: add `--json`
- Local HTTP test: add `--base=http://127.0.0.1:8765/` after starting the static server on port 8765

Exit code `0` is pass, `1` is a site defect, and `2` is configuration or infrastructure failure.

For a creator-profile or external-platform property, replace the website validation lanes with the reports and controls the property actually exposes. Do not invent repository, production, sitemap, or indexing work.

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

## Current baseline

- Repository and production policy established on 2026-08-18.
- GSC property `sc-domain:aiincidentlaw.org` was verified on 2026-08-18. Reports were processing, no sitemap was submitted, and the homepage was already indexed.
- Dated evidence: `ops/search/GoogleSearchConsole/2026-08-18/audit.md`.

## Console action ledger

Read this table before opening the console. Add only observed actions and confirmations. An accepted request remains pending until a later report proves completion.

| Provider and property | Action and target | Accepted at | Confirmation | Result class | Repeat policy | Next review |
|---|---|---|---|---|---|---|

Keep rejected attempts and unknown outcomes distinct from accepted actions. Do not repeat an accepted action merely because the provider report remains stale.
