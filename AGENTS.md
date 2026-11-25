# AI Incident Law — agent instructions

The corpus has been frozen since 2026-11-18; see INTENT.md "Frozen operating state" before changing records.

## Build pipeline

**`index.html` is hand-edited** (the SPA shell). No script writes it. Safe to edit directly.

Generated files in this repo:

- `data.js` — produced by `scripts/build-data.mjs` from `data/data.json`. Do NOT hand-edit.
- `data/data.json` `generated_at` field — derived at build time from newest record `last_verified_date` / `last_checked_date`. Do NOT hand-edit.
- `api/v1/of/` — Obligation-First binding artifacts produced by `scripts/build-obligation-first.mjs`.

Edit `data/data.json` records or `index.html` SPA shell directly. Then:

```bash
npm run build       # build:data + build:of + validate:data
npm run check       # the full gate; read the "check" script in package.json, it grows
```

Then stage the whole generated set. CI asserts generated artifacts are committed
(`git diff --exit-code`), so a data change that lands without its output fails the build:

```bash
git add data/ data.js api/ proceeding/ allegation/ determination/ authority/ party/ tombstone/ tests/fixtures/
```

Stage `tombstone/` (if present); drop it from the command when the directory is absent, because `git add` rejects a missing path. `party/` and `tests/fixtures/of-contract-fingerprint.json` are both easy to miss and both
break CI on their own. Add `index.html` only if the SPA shell was hand-edited. If a record's
`jurisdiction` changed, delete the stale `authority/<old-slug>.json` and
`api/v1/of/records/<old-slug>.json` before committing, or the generated set will not match
the data.

When in doubt, grep `scripts/` for the file path before editing.

## Cross-portfolio context

AI Incident Law is part of the PAICE legal graph. Implements the Obligation-First proceeding strand. Schema canon is at https://obligationfirst.org/. Portfolio canon at https://paice.foundation/ (`~/Git/paice-foundation/INTENT.md`).
