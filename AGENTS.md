# AI Incident Law — agent instructions

## Build pipeline

**`index.html` is hand-edited** (the SPA shell). No script writes it. Safe to edit directly.

Generated files in this repo:

- `data.js` — produced by `scripts/build-data.mjs` from `data/data.json`. Do NOT hand-edit.
- `data/data.json` `generated_at` field — derived at build time from newest record `last_verified_date` / `last_checked_date`. Do NOT hand-edit.
- `api/v1/of/` — Obligation-First binding artifacts produced by `scripts/build-obligation-first.mjs`.

Edit `data/data.json` records or `index.html` SPA shell directly. Then:

```bash
npm run build       # build-data + build-of + validate
npm run check       # full validation + URL policy + MCP + discovery tests
git add data/ data.js api/ index.html
```

When in doubt, grep `scripts/` for the file path before editing.

## Cross-portfolio context

AI Incident Law is part of the PAICE legal graph. Implements the Obligation-First proceeding strand. Schema canon is at https://obligationfirst.org/. Portfolio canon at https://paice.foundation/ (`~/Git/paice-foundation/INTENT.md`).
