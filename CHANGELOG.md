# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
