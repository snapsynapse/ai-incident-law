# AI Error Litigation Index

Standalone, dependency-free single-page application for browsing the AI Error Litigation Index.

## Repo layout

- `index.html` is the application shell.
- `styles.css` is the local stylesheet.
- `app.js` handles local search, filtering, and rendering.
- `data/data.json` is the canonical dataset for maintainers.
- `data.js` is a generated browser bundle consumed by `index.html`.
- `scripts/build-data.mjs` normalizes source data and regenerates `data.js`.
- `scripts/validate-data.mjs` validates record shape, duplicate identifiers, and URL conventions.

## Runtime properties

The shipped app still has no runtime dependencies:

- No framework
- No CDN
- No API calls
- No analytics
- No persistent browser storage

Open `index.html` directly in a browser or host the folder on any static file server. Public-record links are outbound links and load only when selected.

## Maintainer workflow

The repo uses Node.js only for maintainer tooling. There are no install-time dependencies.

```bash
npm run build:data
npm run validate:data
```

Or run the combined check:

```bash
npm run build
```

To preview over a local static server:

```bash
npm run serve
```

Then open the local server in your browser.

## Data conventions

- `data/data.json` is the source of truth.
- `data.js` is generated and should not be edited by hand.
- Source URLs are normalized to `https://` bare domains during the build step.
- Validation fails on duplicate record identifiers, invalid URLs, `http://` links, or `www.` hosts.

## Repository metadata

- [CONTRIBUTING.md](/Users/snap/Git/ai-incident-law/CONTRIBUTING.md) documents the expected edit and review flow.
- [SECURITY.md](/Users/snap/Git/ai-incident-law/SECURITY.md) documents private security reporting expectations.
- [validate.yml](/Users/snap/Git/ai-incident-law/.github/workflows/validate.yml) runs the build and validation pipeline on pushes and pull requests.
- [LICENSE](/Users/snap/Git/ai-incident-law/LICENSE) currently keeps the repository contents all-rights-reserved.
