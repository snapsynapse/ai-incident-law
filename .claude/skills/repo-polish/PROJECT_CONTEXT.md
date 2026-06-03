# repo-polish PROJECT_CONTEXT — ai-incident-law

canonical_domain: aiincidentlaw.org
homepage_url: https://aiincidentlaw.org/
brand: paice
is_fork: false
upstream_url: n/a
license: MIT (code) + CC BY 4.0 (data, see DATA_LICENSE)
repo: snapsynapse/ai-incident-law
default_branch: main

primary_signal: >
  When an AI system causes harm, the legal and regulatory fallout ends up
  scattered across dockets, tribunal orders, and agency actions with no common
  index. AI Incident Law is an open, searchable corpus of those public matters,
  queryable by humans and agents.

differentiator: >
  Public-record only, curated for source quality over volume. Records bind to
  the Obligation-First model and are queryable over a static JSON API and a
  zero-dependency read-only MCP server. Freshness is auto-derived and visible.

target_audience: >
  Compliance teams, legal counsel, AI governance leads, litigators, regulators,
  journalists, and researchers tracking how AI failures turn into legal and
  regulatory action.

## Portfolio position
Part of the PAICE legal graph (Regulation vector) alongside EveryAILaw
(https://everyailaw.com/), PubLedge (https://publedge.org/), and Obligation
First (https://obligationfirst.org/). Stewarded by PAICE.work PBC.

## Decisions locked in (2026-06-02 run)
- Topics (10): ai-incident, ai-governance, ai-regulation, ai-law, legal-tech,
  compliance, mcp-server, open-data, paice, ai-safety
- Discussions: enabled. Wiki: disabled. Issues: enabled.
- Issue templates: bug_report, feature_request, record_correction + config.yml
  routing questions to Discussions and security to SECURITY.md.
- Release line: v0.x SemVer. v0.2.0 = freshness auto-derive + staleness tooling.

## Outstanding manual step
- Social preview image (1280x640) not uploadable via gh CLI. Upload at
  https://github.com/snapsynapse/ai-incident-law/settings after
  promo-orchestrator generates the image prompt.
