# Source admission

## Contract
Run npm run check:admission before accepting a native record change. The canonical npm run check invokes the same gate, and build:of validates the current record, receipt, and source state before writing generated projections.

data/admission/legacy.json freezes the 115 native records at merged commit 8d8c7913d2015c05ea133f0846c3472807b68005. Its status is legacy-unreviewed; the checker pins its exact bytes. The inventory protects existing record and field digests without certifying legal accuracy, currentness, source sufficiency, or prior human review. There is no bulk refresh command.

At the pinned bootstrap state, data/admission/receipts.json starts empty. The current file contains accepted receipts for reviewed changes made after that bootstrap. A new record or any field change requires a record receipt. Unchanged records remain explicit debt and do not need fabricated receipts. Removing a legacy record requires a separately reviewed retirement migration.

## Evidence and review packet
A receipt binds:

- the before and after canonical record digests;
- every changed field through before and after unit digests;
- exact retained UTF-8 primary-source bytes and SHA-256;
- canonical bare-domain HTTPS URL;
- document ID, title, issuer, type, version, locator, identity excerpts, and supporting excerpt;
- scope, exception, and time qualifications for every changed unit;
- reviewer actor, actor type (agent or human), decision, scope, and real UTC review time;
- an explicit unresolved list;
- a digest of the complete review packet.

Primary retrieval evidence also retains the original bytes, their digest, final observed URL, successful HTTP status, content type, and real retrieval time. Use retained_snapshot when original transport metadata was not retained. Do not invent retrieval timestamps.

Evidence must live under data/admission/raw/. Native records, generated API/site output, secondary-source folders, and AI Incident Law's own published surfaces cannot ground a change. Identity and support excerpts must occur exactly in the retained readable snapshot. If normalized readable text differs from downloaded bytes, retain and hash both.

## Semantic safeguards
A changed AI attribution needs a source-located AI excerpt. A changed non-English record needs an original-language excerpt and an English rendering. An agent receipt cannot renew last_verified_date.

A changed source_quality on an included record must use one of the explicit source roles: primary record, official statement, reliable reporting, party case page, or media-hosted pleading copy. The retained evidence must match that role and the current public_record_link. This gate applies to reviewed changes and does not certify unchanged legacy labels. A narrower source-role correction does not renew currentness or determine whether a record belongs in included; those decisions remain separate.

A changed adjudicative status, determination projection, or determination/remedy note must cite an adjudicative primary document. A complaint cannot support an order, sanctions result, judgment, settlement, or other determination. Pending, rejected, stale, missing, self-generated, wrong-document, and packet-mutated evidence fails.

SOURCE_ADMISSION_BASE accepts only HEAD or an exact 40-character commit SHA. The CLI reads the prior receipt inventory at that base. Missing receipt history is allowed only at the frozen bootstrap commit or its ancestors, so a reviewed record cannot drop its receipt and revert to grandfathered status. CI uses full Git history.

## Projection disclosure
Generated AIL graph records carry two separate fields:

- projection_basis: the path that produced that entity, such as curated-legal-graph, legacy-filing-status-inference, legacy-record-inference, legacy-jurisdiction-inference, native-record-projection, or curated-retirement;
- admission_status: legacy-unreviewed or source-consistency-reviewed-changes.

source-consistency-reviewed-changes applies only to the changed units named in the receipt. It does not say that every field or emitted entity was reviewed. source_review_unresolved carries a validated receipt's nonempty unresolved list; it is absent for legacy records because their review questions were not inventoried.

canonical_source_conflicted is existing native subject-matter text describing what an AI output contradicted. It is not a source-review conflict flag and remains unchanged.

## Limits
Receipt acceptance proves deterministic traceability and a declared, bounded review of changed fields. Exact hash and excerpt matching do not establish legal entailment, complete source interpretation, docket currentness, authenticated human identity, or exhaustive corpus review. Human-type declarations still require an actual human decision outside this code. Semantic disagreements remain human-owned.
