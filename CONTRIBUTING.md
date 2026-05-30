# Contributing

## Scope

This repository is maintained as a static research site and dataset with a generated browser bundle.

- `data/data.json` is the canonical dataset.
- `data.js` is generated output.
- URL normalization and dataset validation are enforced by maintainer tooling.
- Code and data use different licenses. Keep new files clearly within one scope or document exceptions in `README.md`.

## Local checks

Run the full maintainer check before opening a pull request:

```bash
npm run build
npm run check
```

These commands will:

- normalize URLs in `data/data.json`
- regenerate `data.js`
- validate dataset shape and URL policy
- run the URL-policy regression suite
- run malformed-source fixtures through the real URL-policy pipeline
- evaluate the generated Obligation-First binding

## Data editing rules

- Edit `data/data.json`, not `data.js`.
- Use `public_record_link` for exactly one primary source URL.
- Use semicolon-delimited URL lists only in `secondary_source_links` and `best_available_sources`.
- Use `https://` bare-domain URLs in final data. The build step may normalize `http://` to `https://` and strip a leading `www.` when the parsed URL remains otherwise unchanged.
- Do not add prose, credentials, protocol-relative URLs, non-HTTP schemes, backslashes, encoded backslashes, control characters, or whitespace inside URL fields.
- Keep record identifiers stable once published.

## Pull requests

- Keep changes scoped.
- Include a short note explaining any dataset additions, removals, or normalization changes.
- Do not hand-edit generated files without regenerating them through the scripts in `scripts/`.
