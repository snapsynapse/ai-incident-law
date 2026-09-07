# AI Incident Law v0.4.1

## Status

Local release candidate only. It is not tagged, pushed, published to npm, released on GitHub, or deployed.

## Scope

- Packages the reviewed corpus and generated Obligation-First projection current after v0.4.0, including source corrections and additional reviewed records.
- Adds adopter-owned scope continuity checks and validates the candidate with released Obligation-First v0.6.5 tooling.
- Adds bounded source monitoring and record-age diagnostics that report review work without changing admission, legal outcomes, or verification dates automatically.

## Verification

- `npm run build && npm run check` passed.
- A fresh consumer installed the retained `ai-incident-law-0.4.1.tgz`, initialized the MCP server as `ai-incident-law@0.4.1`, and listed eight tools.

## Remaining delivery

- Push the reviewed candidate commit, create and push the `v0.4.1` tag, and create the GitHub release.
- Publish the verified package to npm, then verify the registry artifact and any intended site deployment from their delivered bytes.
