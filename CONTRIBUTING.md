# Contributing

## Scope

This repository is maintained as a static research index with a generated browser bundle.

- `data/data.json` is the canonical dataset.
- `data.js` is generated output.
- URL normalization and dataset validation are enforced by maintainer tooling.
- Code and data use different licenses. Keep new files clearly within one scope or document exceptions in `README.md`.

## Local checks

Run the full maintainer check before opening a pull request:

```bash
npm run build
```

This will:

- normalize URLs in `data/data.json`
- regenerate `data.js`
- validate dataset shape and URL policy

## Data editing rules

- Edit `data/data.json`, not `data.js`.
- Use `https://` URLs.
- Use bare domains rather than `www.` where the URL still resolves correctly.
- Keep record identifiers stable once published.

## Pull requests

- Keep changes scoped.
- Include a short note explaining any dataset additions, removals, or normalization changes.
- Do not hand-edit generated files without regenerating them through the scripts in `scripts/`.
