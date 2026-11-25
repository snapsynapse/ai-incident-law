# AI Incident Law v0.4.4

## Scope
- Carries the source, graph, and MCP maintenance recorded in the 0.4.4 changelog, including explicit `admission_status` and `source_review_unresolved` responses, bounded MCP frame handling, and matter-monitor checkpoint recovery.
- Updates the assistant guide to 0.1.3 with the admission-status interpretation and binds both packaged copies to the same SHA-256 manifest.
- Retains the frozen-corpus and source-admission boundaries. No record receives a new human verification date from this release.

## Verification boundary
- Exact-main Validate passed on release commit d0eb86f, and a fresh consumer installed the published package and passed the MCP smoke. Delivery record: ops/release-delivery-v0.4.4.json.

## Delivery state
Published 2026-11-19; provider evidence in design/provider-evidence/*-0.4.4.json.
