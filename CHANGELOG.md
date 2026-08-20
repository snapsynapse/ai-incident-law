# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Record admission criteria now settle jurisdiction and language. The `global` bucket is review for non-US matters, a staging queue rather than a publication destination; the four criteria are the only test and jurisdiction is not among them; and source language does not block admission, bounded by quoting the operative language in the original with an English rendering and recording the language as a tag.
- Record admission criteria now settle AI attribution: criterion 1 is satisfied when the primary source itself discusses AI in connection with the defect, whether as a finding, an observation of hallmarks, a hedged surmise, or a recounted party explanation. Bounded by requiring the discussion to appear in the source rather than being supplied by third-party inference, and by excluding matters where the source establishes a competing non-AI mechanism. Admitted records carry an explicit attribution qualifier, the `attribution-not-determined` tag, and a confidence cap. Documented in INTENT.md and on the public methodology page.
- Record admission criteria now settle outcome valence: a matter is admitted on the established AI-attributable defect, not on the severity of the consequence the tribunal attached to it. Rulings that decline to sanction or decline to exclude are admissible and record the outcome in `filing_status` and `reliance_or_harm`. Matters where AI use is established but no defect was found are not admissible. Documented in INTENT.md and on the public methodology page. This widens the criteria, so no existing record loses admission and no dataset version bump is required.

### Fixed
- Filed complaints no longer generate false `of:Determination` records. The two previously published Determination IRIs resolve as continuity-preserving Tombstones.
- Six composite Authority identifiers that conflated separate courts, agencies, or procedural stages now resolve as Tombstones. Their source matters project distinct Authorities with explicit `heardBy` and `issuedBy` relations.

### Added
- Source-rigor regression tests: no new record may cite an aggregator as its primary source (the four pre-rule records are held as a shrinking named baseline), and the discovery tracker may not appear as a source in any field of any bucket.
- ROADMAP.md now tracks outstanding source gaps, access blockers, known coverage gaps, and curation cadence, so the backlog survives independently of maintainer tooling.
- AIEL-2026-065 (Raad van Discipline 's-Hertogenbosch, ECLI:NL:TADRSHE:2026:93), promoted from the global bucket as the first record admitted on a non-English primary source.
- AIEL-2026-064 (Fuselier v. Riscassi, S.D. Miss.), the corpus's first record admitted on undetermined AI attribution and its first involving passive exposure to an AI-generated search summary rather than use of an AI legal-research tool.
- Curated `legal_graph` source projections for multi-body and unresolved matters, with validation for distinct Authority identity, proceeding and Determination references, and reviewed identifier retirement.
- Regression coverage for unresolved filed matters, retired identifiers, distinct procedural-stage Authorities, and source-verified issuer/date relations.
- Tombstone discovery and retrieval across the static API manifests, language-model index, and MCP `get_obligation_first_record` tool.
- Negative-path source-contract tests for composite Authorities, undeclared graph references, malformed retirements, duplicate projection IDs, and projections outside the admitted dataset.

## [0.3.0] - 2026-08-04

Obligation-First v0.6 adopter, source-rigor, and drift-prevention release. This is a minor release because the pre-1.0 public projection contract changes materially.

### Fixed
- Migrated all 278 published Obligation-First records to the released v0.6.0 schemas and naming profile, including typed jurisdictions, valid Authority organization classes, and explicit native identifiers.
- Added explicit `of:Party` records for deployers and kept litigants and other proceeding participants distinct from adjudicating Authorities.
- Broad AI Incident Law anchors now resolve to EveryAILaw `of:ObligationCategory` records instead of legacy category-shaped `of:Obligation` paths. Concrete `of:Obligation` anchors remain available when a matter has a defensible nexus to the specific Term that creates the duty.
- Generated Obligation-First records and the naming profile now use the canonical JSON-LD context document at `https://obligationfirst.org/v1/context.jsonld`.

### Removed
- `AIEL-2026-039` retired. It duplicated `AIEL-2026-026` — the same Rule 11 sanctions opinion, same docket (`1:24-cv-08705-JLR-GWG`), same date, same $2,500 sanction, same attorney, same source document. The two records were merged into `AIEL-2026-026`, which carries the merged tag set and a note recording the merge. The identifier is retired and will not be reused; its generated Obligation-First artifacts were removed.

### Changed
- The canonical CI entrypoint now fails closed over build output, the complete validation suite, Obligation-First compatibility and fingerprints, workflow invariants, and patch cleanliness.
- Generated Obligation-First artifacts are byte-deterministic across UTC and America/Denver, and MCP transport tests cover the 65,535, 65,536, and 65,537 byte framing boundary.
- `AIEL-CAND-004` now identifies the verified Oready GAO decision sequence
  (`B-423524.2`, `B-423649`, `B-423650`, `B-423670`, and `B-423670.2`) and cites
  the two primary GAO decisions instead of secondary commentary.
- `AIEL-2025-007` now cites the verified RECAP copy of the Buchanan v. Vuori
  sanctions order after its Berkeley mirror returned HTTP 404.
- CI sets `CHECK_OF_REQUIRED=1` so the Obligation-First compatibility step fails
  instead of silently skipping when its deliberately checked-out shared checker is absent.
- Every remaining record now cites an original source: the 30 records that still pointed at a third-party tracker (`AIEL-2026-021` through `AIEL-2026-050`) were repointed to court, tribunal, and agency publications, each verified by fetching the document and matching its caption, docket number, and filed date. **No tracker URL remains anywhere in the dataset.** Sources resolved through CourtListener RECAP (18), govinfo (3), and the issuing court's own site (8: Ohio's Reporter of Decisions, the Oklahoma State Courts Network, the Sixth and Tenth Circuits, California's opinion archive and unpublished-opinion path, the Illinois Courts resource store, the New York Official Reports, and the Alabama Appellate Courts public portal).
- Record metadata corrected from the retrieved originals: docket numbers added for `AIEL-2026-034` (2:25-cv-01260-CJB-EJD) and `AIEL-2026-042` (1:24-cv-01918-JRO-MJD); official citations added for `AIEL-2026-027` (No. SC-2025-0106) and `AIEL-2026-044` (2026 NY Slip Op 00040, Docket No. CV-23-0713); docket and unpublished status added for `AIEL-2026-049` (No. B329314).
- `WWW_REQUIRED_HOSTS` gained `oscn.net` and `opn.ca6.uscourts.gov`. The Oklahoma entry matters most: its bare host answers HTTP 200 with a generic ~6 KB landing page rather than the requested document, so a status-code-only link check passes while the content is silently gone.
- Source policy: records cite original court, tribunal, and agency publications only. Third-party trackers and their storage mirrors are no longer citable, including as secondary sources. Tracker URLs have been stripped from every `secondary_source_links` and `best_available_sources` field, and the three records added earlier in this cycle were repointed to verified original sources (CourtListener RECAP for the bankruptcy opinion, courts.ca.gov for the California opinion, media.ca11.uscourts.gov for the Eleventh Circuit opinion).
- `scripts/url-policy.mjs` gained `WWW_REQUIRED_HOSTS`, a narrow carve-out to bare-domain normalization for hosts whose bare domain provably does not serve. Two entries, both verified 2026-07-24: `damiencharlotin.com` (bare returns HTTP 400 from a Django host check) and `gasupreme.us` (bare fails TLS with a certificate hostname mismatch). Links already written bare against such a host are repaired to the `www` form rather than left dead.

### Added
- A reviewed Obligation-First structural fingerprint, build-determinism tests, workflow-invariant tests, and a committed npm lockfile required by the `npm ci` CI contract.
- Data validation now rejects duplicate primary-source URLs and reuse of retired
  record identifier `AIEL-2026-039`, with a warning for exact matter-name/date matches.
- `build:of` now prunes stale companion artifacts before regenerating them, with
  regression coverage for retired-record orphans.
- A scheduled, content-aware primary-source link checker distinguishes PDF and OSCN
  opinion payloads from HTTP-200 error pages while documenting verified bot-filtered hosts.
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

## [0.2.1] - 2026-07-25

### Added
- `npm run check:of` now delegates to obligation-first's shared `check-adopter-of-version.mjs` instead of carrying its own copy of the version-comparison rule. This repo had the portfolio's only version pin; EveryAILaw and PubLedge now run the same check against the same implementation.

### Changed
- The naming profile declares `obligation-first >=0.4.0 <0.6.0` (profile 1.1.0) rather than pinning `0.4.x`. obligation-first 0.5.0 added ranged `appliesTo` precisely so an adopter that uses nothing new in a release stops having to move in lockstep with it. This repo publishes no `ObligationCategory` records, so it rides 0.5.0 unchanged.

### Removed
- The dangling `obligation_first_anchors` entry on `AIEL-2026-020` (CNN v. Perplexity), which pointed at `https://everyailaw.com/obligation/content-rights.json` — a record that has never existed in EveryAILaw's source or export. It resolved to nothing and was the single unresolved edge in the cross-repo anchor graph. Nothing recoverable is lost: the record's tags already carry copyright, content-reproduction, and hallucinated-attribution. If content rights should become a real EveryAILaw obligation category, add it there and restore the anchor.

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

[Unreleased]: https://github.com/snapsynapse/ai-incident-law/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/snapsynapse/ai-incident-law/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/snapsynapse/ai-incident-law/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/snapsynapse/ai-incident-law/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/snapsynapse/ai-incident-law/releases/tag/v0.1.0
