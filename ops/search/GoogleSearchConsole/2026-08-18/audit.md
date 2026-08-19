---
title: "Google Search Console evidence"
property: "sc-domain:aiincidentlaw.org"
observed: 2026-08-18
status: complete
---
# Google Search Console evidence

## Property identity

- URL resource: `sc-domain:aiincidentlaw.org`
- Visible property selector: `aiincidentlaw.org`
- Identity result: Match.

## Initial state

- Overview reports: Processing data; check again in a day or so.
- Submitted sitemaps: None.
- Homepage URL inspection: URL is on Google; page is indexed; served over HTTPS.
- Indexing request: None. The homepage was already indexed.
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
- Exports captured: None.

## Console action ledger

| Provider and property | Action and target | Accepted at | Confirmation | Result class | Repeat policy | Next review |
|---|---|---|---|---|---|---|
| Google Search Console, `sc-domain:aiincidentlaw.org` | Submit `https://aiincidentlaw.org/sitemap.xml` | 2026-08-18, America/Denver | Sitemap submitted successfully; subsequent refresh reported Success, 1 discovered page, and current last-read date | Completed | Never repeat unless the sitemap URL changes or a named failure appears | Review after the Page indexing report finishes initial processing |
