# P1 filing-date precision mitigation

Scope: AI Incident Law OF exporter, review F06 and F08. Local implementation dated 2026-09-04.

Only an exact YYYY-MM-DD source value populates filed_date. Year-only and year-month inputs no longer acquire January 1 or the first day of the month. The adopter extension filing_date_source, mapped to ail:filingDateSource in the record context, preserves the original source string for every Proceeding. No source filing dates were edited. Consumers must not interpret omission of filed_date as absence of a filing event.

The same exact-date normalization is used for provenance and determination issuance; missing/partial inputs remain absent in day-precision OF fields. Existing curated proceeding dates remain preferred over matter-level display dates. Synthetic rebuild tests cover absent, year, month, and exact-day inputs for filing, issuance, and verification, including curated-date precedence and companion parity. JSON-LD round trips verify the extension survives.

Shared federation now rebuilds source projections in a temporary directory. This adopter's fingerprint records exact relation and provenance values; a same-host anchor retarget or verification-date regression fails. Date precision is independent from curated versus inferred procedural meaning, which remains P2 F15.

## Candidate review, 2026-09-05

The isolated candidate preserves all 67 admitted source records and all 332 graph identifiers. The 69 Proceeding records gain the source-string extension; 63 exact filing dates remain unchanged, while two year-only and four month-only dates lose their fabricated day values. All other record fields and the 263 non-Proceeding records remain unchanged. All 69 extension values were checked through JSON-LD expansion, compaction, and re-expansion using the local OF context.

The full build and check gates pass, including generated companion parity, source snapshot checks, schema and identifier continuity checks, and the packed MCP consumer. The CI workflow obtains OF from its default branch; the new fingerprint baseline requires a compatible OF checker there before this adopter's delivery. Candidate snapshot commits are test evidence only and do not identify accepted or published revisions.
