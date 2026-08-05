# AI Incident Law v0.3.0

Release date: 2026-08-04

AI Incident Law v0.3.0 migrates the case-and-enforcement evidence layer of the PAICE legal graph to Obligation-First v0.6.0, completes a primary-source rigor pass, and adds deterministic controls that make schema, workflow, transport, and generated-output drift fail before publication.

## Highlights

- Publishes 278 Obligation-First v0.6 records with typed jurisdictions, valid Authority organization classes, explicit native identifiers, and stable proceeding, allegation, and determination relations.
- Adds `of:Party` records for deployers and other proceeding participants while preserving the boundary between parties and adjudicating Authorities.
- Resolves broad legal-graph anchors to EveryAILaw ObligationCategories while retaining concrete Obligation anchors only where the specific Term-duty nexus is defensible.
- Replaces every remaining third-party tracker citation with a verified court, tribunal, agency, government, or CourtListener RECAP primary record.
- Adds new verified matters, retires the duplicate AIEL-2026-039 identifier without reuse, and publishes the corpus methodology and GuideCheck assistant guide.
- Adds one canonical fail-closed CI entrypoint, a reviewed structural fingerprint, deterministic builds across UTC and America/Denver, workflow-invariant tests, and MCP byte-boundary tests.

## Verification

- The complete local check and canonical CI suites passed.
- 278 Obligation-First records passed v0.6.0 validation and the reviewed structural fingerprint matched.
- Generated artifacts were byte-identical across UTC and America/Denver.
- MCP framing passed at 65,535, 65,536, and 65,537 bytes.
- The cross-repository federation resolved every AI Incident Law anchor after all adopters migrated.

## Compatibility

The naming profile requires `obligation-first >=0.6.0 <0.7.0`. This release changes the public projection contract and therefore uses a new minor version. The npm package and MCP server remain read-only public surfaces.

See [CHANGELOG.md](CHANGELOG.md) for the complete change inventory.
