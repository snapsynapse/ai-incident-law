---
title: "Google Search Console evidence"
property: "sc-domain:aiincidentlaw.org"
observed: 2026-08-18
status: complete
---
# Google Search Console evidence

This file preserves the observation made on 2026-08-18. Later provider state belongs in a new dated record.

## Property identity

- URL resource: `sc-domain:aiincidentlaw.org`
- Visible property selector: `aiincidentlaw.org`
- Identity result: Match.
- Observation timezone: America/Denver.
- Provider report date and data range: Unavailable because the reports were still processing.

## Initial state

- Overview reports: Processing data; check again in a day or so.
- Submitted sitemaps: None.
- Homepage URL inspection: URL is on Google; page is indexed; served over HTTPS.
- Indexing request: None. The homepage was already indexed.
- Page indexing totals, exclusion totals, reason groups, and representative URLs: Unknown because the report had not populated.
- Exports captured: None.

## Production prerequisite

The deployed repair adds an exact canonical, a one-page sitemap, deterministic offline and production validators, and a true-404 assertion.

- Commit: `baa35b0` (`Add search indexing contract`).
- CI: Passed.
- GitHub Pages deployment: Passed.
- Offline validator: 1 sitemap page, 0 defects, 0 infrastructure failures.
- Exact local artifact validator: 1 sitemap page, 0 defects, 0 infrastructure failures.
- Production validator: 1 sitemap page, 0 defects, 0 infrastructure failures.

## Sitemap

- Sitemap: `https://aiincidentlaw.org/sitemap.xml`
- Submitted: August 18, 2026
- Last read: August 18, 2026
- Status: Success
- Discovered pages: 1
- Discovered videos: 0
- Submission acceptance time: The date and America/Denver timezone were captured; the exact clock time was not.
- Exports captured: None.

## Other console surfaces

- Manual actions: No observation was captured; current state unknown.
- Security issues: No observation was captured; current state unknown.
- HTTPS: Homepage URL Inspection reported the inspected URL was served over HTTPS; no property-wide HTTPS report observation was captured.
- Core Web Vitals: No observation was captured; current state unknown.
- Enhancements and video reports: No observation was captured beyond the sitemap's 0 discovered videos; enhancement state unknown.
- Active validation batches: No validation-batch observation was captured; current state unknown.

## Classification

| Surface | Evidence result | Classification |
|---|---|---|
| Repository and production | All three recorded validators passed for the one-page sitemap | No defect observed |
| Homepage | Indexed and served over HTTPS | No defect observed |
| Page indexing report | Initial processing; totals and reason groups unavailable | Unknown, pending provider data |
| Sitemap | Accepted, Success, current last-read date, 1 discovered page | No defect observed; accepted action complete |
| HTTP and `www` origins | Intentional canonical redirects under repository policy | Expected noise |
| Machine endpoints omitted from the sitemap | Intentional non-HTML discovery surfaces under repository policy | Expected noise |

## Console action ledger

| Provider and property | Action and target | Accepted at | Confirmation | Result class | Repeat policy | Next review |
|---|---|---|---|---|---|---|
| Google Search Console, `sc-domain:aiincidentlaw.org` | Submit `https://aiincidentlaw.org/sitemap.xml` | 2026-08-18, exact time not captured, America/Denver | Visible submission confirmation; subsequent refresh reported Success, 1 discovered page, 0 discovered videos, and last read August 18 | Accepted and complete | Never repeat unless the sitemap URL changes or GSC names a sitemap failure | Review after the Page indexing report finishes initial processing |

## Do-not-repeat and next review

- Do not resubmit the accepted sitemap while its URL and healthy state remain applicable.
- Do not request indexing for the homepage based on this observation; it was already indexed.
- Do not start a validation batch for intentional redirects or machine-surface exclusions.
- Recheck only after Page indexing finishes initial processing, GSC names an issue, a material deployment changes search behavior, or a repository or production validator fails.
