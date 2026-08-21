# GitHub Pages root-to-docs migration

Status: planned, not applied

Owner boundary: this file is R1 preparation. Changing GitHub Pages settings,
publishing a migration commit, or removing root fallbacks is R2 work.

## Why a direct switch is unsafe

GitHub Pages currently serves the repository root. The public contract includes
`/docs/methodology.html`, `/docs/legal-graph.html`, and
`/docs/submit-a-case.html`. If Pages is switched directly to `/docs`, those
paths would resolve inside `docs/docs/` and fail because that nested tree does
not exist.

The current site also mixes authoritative sources and generated outputs:

| Surface | Current authority |
|---|---|
| `index.html`, CSS, public metadata | Root hand-maintained files |
| `data.js` | `scripts/build-data.mjs` |
| `api/v1/of/` | `scripts/build-obligation-first.mjs` |
| `docs/*.html` | Hand-maintained public pages |
| `.well-known/*`, root discovery files | Hand-maintained and validated files |

## URL-preserving staged sequence

1. Introduce a deterministic Pages artifact builder with a source/output map.
   It must place the homepage at `docs/index.html` and preserve the existing
   `/docs/*.html` URLs under `docs/docs/*.html`.
2. Copy every served root asset required by `index.html`, plus `CNAME`,
   `.nojekyll`, discovery files, sitemap, robots policy, dataset output, and the
   generated API, into the candidate `docs/` artifact. Do not hand-edit
   generated data or API output.
3. Repoint repository and production search checks at the candidate artifact
   while retaining the current root-served copies. Add parity checks for all
   sitemap URLs, discovery files, MIME types, canonical URLs, and internal
   links.
4. On an exact candidate commit, pass `npm run verify:ci`, the accessibility
   gate, package smoke, search checks, and `git diff --check`.
5. Under explicit R2 authority, publish the prepared artifact and change Pages
   from `main /` to `main /docs`. Verify the bare-domain site and every prior
   public URL before any cleanup.
6. In a later reviewed commit, remove obsolete root-served copies only after
   deployed parity is proven. Keep authoritative source files outside generated
   output where the build design requires them.

## R2 decisions still required

- Choose the long-term source directory name and builder implementation.
- Approve the exact tracked-file move/copy set and build-script changes.
- Approve the GitHub Pages source mutation.
- Decide whether the temporary duplicate public tree may remain for one release
  or must be removed immediately after verified cutover.

## Rollback

If any route, MIME type, discovery file, canonical link, or custom-domain check
fails after the source flip, restore Pages to `main /`. Do not delete the root
fallback until the `/docs` deployment is verified independently.
