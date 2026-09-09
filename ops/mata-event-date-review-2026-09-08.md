# Mata event-date source review
Date: 2026-09-08.
Status: reviewed local correction; unpublished.
Scope: AIEL-2023-002 native record and its existing Obligation-First proceeding, allegation, and determination identifiers.

## Retained source
Primary source: https://storage.courtlistener.com/recap/gov.uscourts.nysd.575368/gov.uscourts.nysd.575368.54.0_8.pdf
Document identity: Mata v. Avianca, Inc., No. 22-cv-1461 (PKC), Document 54, Opinion and Order on Sanctions, filed and dated June 22, 2023.
Retained source SHA-256: `68c7e61823d8dd1540e1b8ce61ce3da99d601f032e4ea22825eba224a78c4d32`.
Review locators:
- PDF page 3, Findings of Fact paragraph 1: Roberto Mata commenced the state action on or about February 2, 2022; Avianca removed it to federal court on February 22, 2022.
- PDF page 1: Peter LoDuca, Steven A. Schwartz, and Levidow, Levidow & Oberman P.C. are defined collectively as the respondents.
- PDF page 34, Conclusion paragraphs a-d: the court orders notices and imposes a $5,000 penalty jointly and severally on the respondents; the order is dated June 22, 2023.

## Event scope decision
The native AIEL record describes the sanctions order, so its `public_matter_type` remains `sanctions order` and its `filing_date` remains June 22, 2023. That date is not used as the filing date of the generated proceeding.

The stable `aiel-2023-002-proceeding` projection represents the federal civil action heard by the U.S. District Court for the Southern District of New York. Its `filed_date` is February 22, 2022, the exact removal date established in Findings of Fact paragraph 1, and its `procedural_stage` is `federal-civil-action-after-removal`. The approximate February 2 state commencement is retained in this receipt but is not projected as an exact date or substituted for the federal event.

The stable `aiel-2023-002-determination` represents the sanctions opinion and order. Its `issued_date` is June 22, 2023. It decides the existing AI-related allegation projection, while the remedy and resolution notes name the individual attorneys and firm on whom the court imposed sanctions. The court source does not establish liability of the AI system provider, and the obligation-category anchor is an editorial graph link rather than a statutory holding.

## Currentness and publication boundary
The review preserves `last_verified_date` as September 1, 2026. It does not renew corpus freshness, establish the live docket status, certify unrelated records, or publish the correction. The previously retained published-package failure remains separate evidence for version 0.4.1.

## Local validation
- `npm run build` regenerated the native bundle and Obligation-First outputs from `data/data.json` and validated all 115 source records.
- The source-grounded build regression passes and checks the native date qualifier, source URL and locator, stable graph IDs, federal-removal proceeding date and stage, sanctions issuance date, respondent names, allegation-to-determination edge, and unchanged September 1 verification date.
- `npm run check` passes, including source, projection, identifier-continuity, package, MCP, discovery, and maintenance gates.
- The reviewed semantic fingerprint delta adds one proceeding with `procedural_stage` and one determination with `issued_date`. Counts move from 6 to 7 proceedings with `procedural_stage` and from 3 to 4 determinations with `issued_date`; the corresponding missing counts each decrease by one. No identifiers or record counts change.
- A fresh local package candidate contains 356 files and eight MCP tools. Archive SHA-256: `c18e2594e22f2d359b89d4a58eda8f03905402e2f8ae4fc6d0336604426042f5`. This candidate remains labeled 0.4.1 and is unpublished.
- Replaying the eight frozen requests from the retained failed-package exercise against that extracted candidate preserves the three graph IDs and explicit unknown-ID error. The proceeding returns `filed_date: 2022-02-22` with `procedural_stage: federal-civil-action-after-removal`; the determination returns `issued_date: 2023-06-22`; the source record explains that its `filing_date` is the sanctions opinion and order filing date.
- The retained failed packet, responses, and source PDF still match their recorded SHA-256 values. Candidate evidence uses a separate temporary path and does not replace the published-package evidence.
