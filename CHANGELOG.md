# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Removed
- `AIEL-2026-039` retired. It duplicated `AIEL-2026-026` — the same Rule 11 sanctions opinion, same docket (`1:24-cv-08705-JLR-GWG`), same date, same $2,500 sanction, same attorney, same source document. The two records were merged into `AIEL-2026-026`, which carries the merged tag set and a note recording the merge. The identifier is retired and will not be reused; its generated Obligation-First artifacts were removed.

### Changed
- Every remaining record now cites an original source: the 30 records that still pointed at a third-party tracker (`AIEL-2026-021` through `AIEL-2026-050`) were repointed to court, tribunal, and agency publications, each verified by fetching the document and matching its caption, docket number, and filed date. **No tracker URL remains anywhere in the dataset.** Sources resolved through CourtListener RECAP (18), govinfo (3), and the issuing court's own site (8: Ohio's Reporter of Decisions, the Oklahoma State Courts Network, the Sixth and Tenth Circuits, California's opinion archive and unpublished-opinion path, the Illinois Courts resource store, the New York Official Reports, and the Alabama Appellate Courts public portal).
- Record metadata corrected from the retrieved originals: docket numbers added for `AIEL-2026-034` (2:25-cv-01260-CJB-EJD) and `AIEL-2026-042` (1:24-cv-01918-JRO-MJD); official citations added for `AIEL-2026-027` (No. SC-2025-0106) and `AIEL-2026-044` (2026 NY Slip Op 00040, Docket No. CV-23-0713); docket and unpublished status added for `AIEL-2026-049` (No. B329314).
- `WWW_REQUIRED_HOSTS` gained `oscn.net` and `opn.ca6.uscourts.gov`. The Oklahoma entry matters most: its bare host answers HTTP 200 with a generic ~6 KB landing page rather than the requested document, so a status-code-only link check passes while the content is silently gone.
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
