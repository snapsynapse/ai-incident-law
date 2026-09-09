# Source readiness: naming-profile manifest and MCP guidance
Date: 2026-09-08.
Status: tested local candidate; uncommitted and unpublished.
Scope: trust metadata, runtime discovery guidance, regression checks and installed package verification. Corpus records, generated graph meaning, protocol negotiation, schema dependencies and tool inventory are unchanged.

## Baseline and publication provenance
The clean checkout was fast-forwarded from `f89ac78f232cc44de3d28b0b48f7839c9bf4efa5` to `f5254574d3d4dc6e82dc0a69d82746e431887e3e` after live remote verification. The intervening two commits affect only `ops/release-delivery-v0.4.1.json`. No new commit or remote write was made.
The canonical naming profile remains version 2.0.0, OF `>=0.6.0 <0.7.0`, 1,991 bytes, SHA-256 `66ae44d87c017b1af98ba62aadab2e88b916991c59076f7eecc2b3fae6f7cbc4`. Its manifest previously declared version 1.1.0, the older range, 1,477 bytes and an obsolete digest.
The manifest now matches the profile bytes and identity fields. Its `released-at` is `2026-09-07T15:28:05Z`, the verified publication timestamp of [v0.4.1](https://github.com/snapsynapse/ai-incident-law/releases/tag/v0.4.1). That tag contains byte-identical profile content. This identifies a confirmed release carrying these bytes; it does not claim the first publication date of profile 2.0.0 or publication of this repaired manifest.
The deterministic checker validates the manifest's exact field inventory, profile-derived metadata and bytes, canonical identities and UTC calendar-date syntax. Release provenance requires the separate release evidence above; matching local bytes alone cannot establish publication.

## Resulting behavior
Both `initialize` and `server/discover` now return the same concise guidance: bundled snapshots, Checked versus Verified, source IDs versus graph IDs, pending review buckets, source evidence, procedural-status limits, category-anchor limits and explicit error handling. The three graph/authority tool descriptions link the canonical Obligation-First site and JSON-LD context while retaining AI Incident Law's identity.
The naming-profile manifest is now included alongside its profile in the npm package. The existing installed-package evaluator verifies their parity, both discovery paths, the eight-tool inventory, source/projection retrieval and unknown-ID/kind failures. Output envelopes, protocol versions, resources and prompts are unchanged.

## Validation
- Targeted suites passed: 13 naming-profile manifest tests, 11 MCP tests and eight discovery tests. Negative cases independently exercise version, range, digest, byte-size and identity drift, altered bytes, missing/duplicate/unknown fields and invalid dates.
- `npm run build`, complete `npm run check` and `git diff --check` passed in the owning checkout. Generated corpus/export files show no diff.
- The fresh installed candidate passed with 356 packed files and eight MCP tools. Archive SHA-256: `db426dfd8d65ea26a4c89366f962b137bebf52b10f58068398f10346a183483e`. This is a local candidate still labeled 0.4.1, not the already published 0.4.1 archive and not a publication candidate version decision.
- `npm run verify:ci` also passed in a disposable snapshot with its 791 candidate files staged as the index baseline, `CHECK_OF_REQUIRED=1` and the frozen OF checkout `eefe360226b842fac327d88afc7118971ae59fe4`. Its post-gate index/worktree diff was empty. No commit was created. This verifies candidate build reproducibility against that index; it is not a committed-tree or hosted-CI result.
- Local detailed logs and the indexed-snapshot receipt are under `.verification-reports/source-readiness-2026-09-08/`. These are ignored supporting artifacts; this tracked note records the durable acceptance boundary.

## Candidate content identity
Hashes below cover the implementation and tests verified above. This evidence note is outside the published package.

| Path | SHA-256 |
|---|---|
| `.well-known/obligation-first-naming-profile-manifest.txt` | `c927fccc760b0c7a6f924c56ae521f562316dfd9bb2679d7b97682c28dc164cf` |
| `package.json` | `809523b00f6775df76c6511fc20aa933a3cc9d448dbf56ecd2dc05aab365d48e` |
| `scripts/check-naming-profile-manifest.mjs` | `6fe878c6363f75679c6325ab51fdbc34e04da2f86806538406890f22f998b482` |
| `scripts/eval-package-consumer.mjs` | `a761d5a125eaffd87ae2659672903201126aa9b9e68101dd4c8aafb62fdb2d20` |
| `scripts/mcp-server.js` | `bbfbd4452ec0c17223c85f158d363865be9ee2ffc58adbe6e9887cee499f4134` |
| `tests/discovery.test.js` | `9749cd01e8da5fbd64d384027767f9f4634ec70058075626a9141ef22e8b991e` |
| `tests/mcp-server.test.js` | `3b15c0abff81b8a8b996252880c0565900a01e8413bfe73ed4e1c484932353b5` |
| `tests/naming-profile-manifest.test.mjs` | `be512bf7570bd3d07a2c0ad92d0302e09e28a4e0f911cb4748cd3f3c1e2f17d3` |

## Remaining boundary
The bounded primary-source review, inaccessible evidence, admission questions and curated-versus-inferred graph work remain in their owning queues. This metadata repair does not renew any source verification date or establish corpus freshness.
A later delivery candidate needs reviewed versioning, commit/CI and publication evidence. Subsequent directory inspection must verify the released bytes and captured discovery contract; local tests do not demonstrate external listing updates. Investigate any published-artifact/inspection protocol discrepancy before proposing negotiation changes.
