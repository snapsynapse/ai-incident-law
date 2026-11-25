# AI Incident Law v0.4.5

## Scope
- Documentation and metadata release for the frozen corpus. The packaged README no longer contains absolute local checkout paths, and its links resolve on GitHub and npm.
- Carries the post-freeze record corrections from PRs #24 to #28 recorded in the 0.4.5 changelog: 11 more included records reviewed against retained source bytes, for 24 in all.
- Updates the assistant guide to 0.1.4 with the frozen operating state and binds both packaged copies to the same SHA-256 manifest. MCP server instructions and discovery descriptions state the frozen snapshot.
- Retains the frozen-corpus and source-admission boundaries. No record receives a new human verification date from this release.

## Verification boundary
- Required before publication: exact-commit Validate and Accessibility Regression Gate passes, and a clean-consumer pack and MCP smoke on the candidate.

## Delivery state
Release candidate. Publication is recorded only by provider evidence in design/provider-evidence/.
