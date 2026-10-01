# DC Courts source access, 2026-10-01

Scope: source-link transport for AIEL-2026-071. No record, admission receipt, legal finding or verification date changes.

## Failure and evidence

The [September 28 source-link run](https://github.com/snapsynapse/ai-incident-law/actions/runs/36477072645) failed for AIEL-2026-071 with HTTP 403, the only failed link among 72. The repository already recorded user-agent-dependent DC Courts access in ROADMAP.md.

A bounded October 1 check of the exact `public_record_link` established:

| Request | Response | Payload |
|---|---|---|
| Normal identified source checker | HTTP 403, text/html | 179-byte Azure Application Gateway denial |
| Short Mozilla agent | HTTP 403, text/html | Same denial |
| Full browser compatibility agent | HTTP 200, application/pdf | 289217-byte PDF |
| Compatibility agent retaining checker name and project URL | HTTP 200, application/pdf | Same PDF |

The successful PDF SHA-256 is `e69cfc9a0871eeace25dbcf259a2fd6ca276d1d6f3519a4d7407c720d14fc538`, exactly matching the original bytes retained at `data/admission/raw/aiel-2026-071/dcca-order.pdf` and the September 22 retrieval receipt. The retained text SHA-256 also matches its receipt: `360256272246ddcf56cf508386c8ba30846bca7c05e8b9db2ed65fd9c92e9f47`.

This demonstrates an agent-dependent access failure, not source disappearance. The local result does not guarantee access from a GitHub-hosted runner or certify legal currentness.

## Bounded correction

`check-source-links.mjs` retries only an HTTP 403 from the exact DC Courts hostname, using a compatibility user agent that still names the checker. It validates the retry through the existing nonempty-body and PDF-signature checks. A second denial or HTTP-200 HTML error remains a failure. Other hosts and statuses retain their existing behavior. Successful retries emit a warning so the initial denial remains visible; DC Courts is not added to the bot-filtered success allowlist.

The deterministic regression was run before the repair and failed. After the repair all nine source-link policy tests passed, including repeated denial, soft-error payload and unrelated-host/status cases. The repaired Node fetch path reproduced HTTP 403 followed by HTTP 200 and the matching retained PDF hash.

The full local `npm run check` passed with `OBLIGATION_FIRST_DIR` pointing to the sibling canonical checkout and required OF checks enabled. The full live `npm run check:links` passed for 72 links: four existing bot-filter warnings and one successful DC Courts compatibility retry. The summary label now says source-access warnings so a recovered, validated PDF is not mislabeled an allowed denial. This was a local run; the prior GitHub failure is not retrospectively cleared.

Independent review caught a retry-budget interaction: a transient or thrown compatibility failure could trigger the outer generic retry and exceed the intended request bound. Regression tests at the actual `checkSource` seam reproduced both four-request late recovery and a three-request sequence after an initial transient failure. Normal and compatibility attempts now share a two-request cap, including failures thrown during fetch/body reading. Tests cover fallback HTTP 429/503, thrown network errors, an initial 503 followed by 403, and unchanged ordinary retries for other hosts.
