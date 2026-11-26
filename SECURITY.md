# Security Policy

## Reporting

If you discover a security issue in this repository, do not open a public issue with exploit details.

Report it privately through GitHub private vulnerability reporting at https://github.com/snapsynapse/ai-incident-law/security/advisories/new and include:

- the affected file or workflow
- reproduction steps
- impact assessment
- any suggested remediation

## Scope

This repository is a static site plus an MCP stdio server published to npm as `ai-incident-law` (`scripts/mcp-server.js`), with local maintainer tooling. The main security-sensitive areas are:

- generated data artifacts
- URL normalization and validation logic
- GitHub Actions workflow configuration
- the MCP stdio server (`scripts/mcp-server.js`) and its published npm package

