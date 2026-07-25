# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Source policy: records cite original court, tribunal, and agency publications only. Third-party trackers and their storage mirrors are no longer citable, including as secondary sources. Tracker URLs have been stripped from every `secondary_source_links` and `best_available_sources` field, and the three records added earlier in this cycle were repointed to verified original sources (CourtListener RECAP for the bankruptcy opinion, courts.ca.gov for the California opinion, media.ca11.uscourts.gov for the Eleventh Circuit opinion).
- `scripts/url-policy.mjs` gained `WWW_REQUIRED_HOSTS`, a narrow carve-out to bare-domain normalization for hosts whose bare domain provably does not serve. Two entries, both verified 2026-07-24: `damiencharlotin.com` (bare returns HTTP 400 from a Django host check) and `gasupreme.us` (bare fails TLS with a certificate hostname mismatch). Links already written bare against such a host are repaired to the `www` form rather than left dead.

### Added
- Four further included records from the 2026 gap sweep, each verified against an original source: `AIEL-2026-054` (Payne v. State, Ga. — prosecutor's AI-drafted proposed order put fabricated citations into a judge's signed ruling; six-month suspension from the court), `AIEL-2026-055` (Withers v. City of Aberdeen, N.D. Miss. — both sides' counsel used separate AI tools; two pro hac vice revocations, two-year district bars, $8,000 in fines, three bar referrals), `AIEL-2026-056` (Cartagena v. Dixon, S.D.N.Y. — counsel blamed LexisNexis Protégé and the vendor denied he had access), `AIEL-2026-057` (CVTEK, LLC, GAO — Westlaw CoCounsel citations in a bid protest; extends the corpus into federal procurement adjudication).
- `AIEL-GLOB-015` (Mazaheri v Law Society of Ontario) and three review candidates: `AIEL-CAND-019` (SNV Aviation, Delhi HC — judge's own judgment stayed, AI use expressly not determined), `AIEL-CAND-020` (Henry County Schools, Ga. Ct. App.), `AIEL-CAND-021` (ARIH Québec, 2026 QCCS 1360 — arbitral award annulled because the arbitrator's reasoning rested entirely on hallucinated authorities; held in review pending a citable original source).
- Three included records from the July 2026 sweep, each verified against its primary order: `AIEL-2026-051` (In re Rosslyn2016, Bankr. S.D. Tex. — Westlaw Precision named and admitted, generative-AI CLE, $29,877 fee award, civil contempt), `AIEL-2026-052` (Del Biaggio v. Bansen, Cal. Ct. App. 1st Dist. — published, $1,500 appellate sanction, State Bar referral), `AIEL-2026-053` (Akerlund v. Atlas Air, 11th Cir. — published, disciplinary referral, sixteen hallucinated citations across two filings).
- `AIEL-GLOB-014` (Pooja Ramesh Singh v. Jammu and Kashmir Bank, Supreme Court of India, 2026 INSC 668): the corpus's first adjudicator-side matter, where the fabricated citations originated in the tribunal's own judgment rather than in counsel's filings.
- Two review candidates: `AIEL-CAND-017` (Mullins v. Duquesne — Claude disclosed and use held not sanctionable; a limiting precedent the current schema has no clean slot for) and `AIEL-CAND-018` (M J Molawa, South African Labour Court — non-existent citations confirmed, AI attribution expressly left undetermined).
- Public methodology page documenting corpus scope, admission criteria, source policy, freshness handling, and exclusions.
- GuideCheck assistant guide for bounded maintainer and query workflows, with local byte-profile and section validation.

### Changed
- Advertised the methodology page in public docs and agent-facing metadata.
- Advertised the assistant guide in public docs and agent-facing metadata.
- Added homepage and MCP discovery links for the assistant guide and trust-boundary note.
- Added `.nojekyll` so GitHub Pages serves `.well-known/` discovery files.
- Tightened the pull request checklist to include the full `npm run check` pipeline.
- Corrected the submission page issue-template link to use the existing record-correction template.

## [0.2.0] - 2026-06-02

### Added
- `get_staleness_report` MCP tool and `npm run report:staleness` CLI: rank records by verification age to surface matters overdue for re-verification. Advertised in `agents.json` and `.well-known/mcp.json`.
- `llms.txt` at the site root for LLM and agent discovery, linking the dataset, Obligation-First API, agent discovery files, and PAICE legal-graph siblings.
- Freshness gate in `validate-data.mjs`: validation now fails if `generated_at` lags behind the newest record `last_verified_date` / `last_checked_date`.

### Changed
- `generated_at` is now derived automatically at build time from the newest record verification date, so the public freshness stamp tracks the data and can no longer go stale by hand. The fix propagates through the generated Obligation-First binding.

### Fixed
- Corrected the public freshness stamp, which had lagged 41 days behind the corpus.
- Corrected the canonical domain in `INTENT.md` from `aiincidentlaw.com` to `aiincidentlaw.org`.

## [0.1.0] - 2026-05-30

### Added
- Hardened URL-field parsing for source data so validation rejects malformed URL text instead of extracting only URL-looking substrings.
- Shared maintainer URL policy for build and validation, including single-URL enforcement for `public_record_link` and semicolon-list enforcement for secondary source fields.
- URL-policy regression coverage for normalization, bypass attempts, malformed schemes, credentials, encoded and raw control characters, and representative existing corpus URLs.
- No-dependency URL-policy pipeline eval that runs malformed-source fixtures through the real build and validation scripts in temporary directories.

[Unreleased]: https://github.com/snapsynapse/ai-incident-law/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/snapsynapse/ai-incident-law/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/snapsynapse/ai-incident-law/releases/tag/v0.1.0
