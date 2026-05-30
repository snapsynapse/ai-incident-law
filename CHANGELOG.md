# Changelog

## 0.1.0 - 2026-05-30

- Hardened URL-field parsing for source data so validation rejects malformed URL text instead of extracting only URL-looking substrings.
- Added a shared maintainer URL policy for build and validation, including single-URL enforcement for `public_record_link` and semicolon-list enforcement for secondary source fields.
- Added URL-policy regression coverage for normalization, bypass attempts, malformed schemes, credentials, encoded and raw control characters, and representative existing corpus URLs.
- Added a no-dependency URL-policy pipeline eval that runs malformed-source fixtures through the real build and validation scripts in temporary directories.
