# Contributing

The corpus is frozen as of the owner decision on November 18, 2026. Corrections and source challenges remain open through issues. Routine new-record discovery and curation are dormant. No new records are accepted; only narrow, evidence-backed corrections are considered. Existing admission rules below continue to govern any separately selected evidence-backed correction; they do not authorize new source requests or verification-date renewal.

## Scope

This repository is maintained as a static research site and dataset with a generated browser bundle.

- `data/data.json` is the canonical dataset.
- `data.js` is generated output.
- URL normalization and dataset validation are enforced by maintainer tooling.
- Code and data use different licenses. Keep new files clearly within one scope or document exceptions in `README.md`.

## Local checks

Run the full maintainer check before opening a pull request:

Literal
```bash
npm run build
npm run check
```

- `build` regenerates `data.js` and `api/v1/of/`.
- `check` runs the full gate; the `check` script in `package.json` defines its steps.
- `check:of*` steps need a sibling checkout of `snapsynapse/obligation-first`.

## Data editing rules

- Edit `data/data.json`, not `data.js`.
- Use `public_record_link` for exactly one primary source URL.
- Use semicolon-delimited URL lists only in `secondary_source_links` and `best_available_sources`.
- Use `https://` bare-domain URLs in final data. The build step may normalize `http://` to `https://` and strip a leading `www.` when the parsed URL remains otherwise unchanged.
- Do not add prose, credentials, protocol-relative URLs, non-HTTP schemes, backslashes, encoded backslashes, control characters, or whitespace inside URL fields.
- Keep record identifiers stable once published.
- A correction needs an admission receipt in `data/admission/receipts.json` with retained source bytes. See [ops/SOURCE-ADMISSION.md](ops/SOURCE-ADMISSION.md).

## Pull requests

- Keep changes scoped.
- Include a short note explaining any dataset additions, removals, or normalization changes.
- Do not hand-edit generated files without regenerating them through the scripts in `scripts/`.
