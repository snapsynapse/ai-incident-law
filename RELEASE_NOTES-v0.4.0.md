# AI Incident Law v0.4.0

Release date: 2026-08-20

AI Incident Law v0.4.0 strengthens the evidentiary and publication contracts for the public corpus. It settles three admission-policy questions, corrects legal-graph projections that overstated legal outcomes or combined distinct authorities, preserves retired identifiers through discoverable Tombstones, and makes the packed npm artifact a canonical release gate.

## Highlights

- Settles jurisdiction, source-language, AI-attribution, and outcome-valence rules in the repository intent and public methodology.
- Adds two source-verified matters, including the first admitted non-English primary source and the first matter admitted with undetermined AI attribution under the new bounded rule.
- Stops filed complaints from generating false `of:Determination` records and separates six composite Authority identifiers that conflated distinct bodies or procedural stages.
- Preserves the retired identifiers as discoverable Tombstones across static API manifests, the language-model index, and the MCP `get_obligation_first_record` tool.
- Adds source-contract regression tests for composite Authorities, graph references, retirements, duplicate identifiers, and projection scope.
- Adds a repository-owned packed-consumer evaluation that verifies archive contents, trust pairs, registry metadata, MCP initialization, and all eight tools outside the checkout.
- Adds accessibility regression coverage for all four public HTML routes and a staged, URL-preserving plan for the separately gated GitHub Pages migration.

## Verification

- The canonical `npm run verify:ci` suite passed on the exact release candidate.
- The packed-consumer evaluation installed the candidate archive outside the checkout and verified package metadata, GuideCheck trust pairs, MCP initialization, and eight tools.
- Identifier continuity matched the generated `v0.4.0` baseline with 317 identifiers.
- The four-route accessibility regression gate passed on the exact pull-request head.
- The default-branch Validate workflow, GitHub Pages deployment, and production search contract passed after merge.

## Compatibility

This release changes public legal-graph projections and adds Tombstone discovery, so the pre-1.0 package advances to a new minor version. The naming profile continues to require Obligation-First `>=0.6.0 <0.7.0`. The npm package and MCP server remain read-only public surfaces.

The GitHub Pages source remains `main /`. The planned `/docs` migration is a separate change that requires a deterministic artifact builder and URL-parity proof before any repository setting changes.

See [CHANGELOG.md](CHANGELOG.md) for the complete change inventory.
