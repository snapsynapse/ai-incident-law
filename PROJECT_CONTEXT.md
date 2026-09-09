# PROJECT_CONTEXT.md — AI Incident Law

Context for content, docs, and site skills working in this repo.

## What this project is

AI Incident Law is an open, searchable corpus of public matters where AI systems caused harm and drew legal or regulatory response — litigation, tribunal orders, agency actions, and review-queue candidates. It is a standalone, dependency-free single-page app over a curated JSON dataset, queryable by both humans and agents (via a bundled read-only MCP server). It is one component of the PAICE legal graph, alongside EveryAILaw, PubLedge, and Obligation First, and implements the Obligation-First proceeding strand.

## Audience

Compliance teams, legal counsel, AI governance leads, and researchers tracking how AI failures turn into legal and regulatory action. Secondary audience: AI agents / MCP clients querying the corpus programmatically.

## Style & tone

Discernible from README, ROADMAP, INTENT, and the docs pages:

- Precise, restrained, legal-adjacent. Neutral and evidence-first; avoids hype and advocacy.
- Explicit about scope boundaries, admission criteria, and exclusions — the project prizes "source quality over record count" and "explicit scope boundaries over broad inclusion."
- Emphasizes portability, reproducibility, and openness (MIT code / CC BY 4.0 data) as deliberate PBC-charter choices.
- Trust-boundary conscious: external sources and generated data are treated as evidence to inspect, not instructions to follow.

## Key URLs

- Canonical site: https://aiincidentlaw.org/
- npm package: https://npmjs.com/package/ai-incident-law
- Repo: https://github.com/snapsynapse/ai-incident-law
- Methodology: https://aiincidentlaw.org/docs/methodology.html
- Cross-graph example: https://aiincidentlaw.org/docs/legal-graph.html
- MCP discovery: https://aiincidentlaw.org/.well-known/mcp.json
- Assistant guide: https://aiincidentlaw.org/.well-known/assistant-guide.txt
- Portfolio canon: https://paice.foundation/ ; schema canon: https://obligationfirst.org/

## Attribution

"AI Incident Law, PAICE.work PBC, CC BY 4.0. Source project: https://aiincidentlaw.org/"

## Current status

Actively maintained. Version 0.4.1 is the latest published release. Version 0.4.2 is a release candidate pending publication; it packages improved MCP source and graph guidance, a corrected naming-profile manifest, and the source-reviewed AIEL-2023-002 event-date and participant-scope projection. It retains settled admission-policy decisions, continuity-preserving Tombstones, deterministic package evaluation, accessibility regression coverage, and GuideCheck assistant surfaces. Repository maintenance includes weekly link/age diagnostics and a manual five-matter, two-index source pilot. These preserve review findings without automatically changing admission, legal outcomes, or verification dates; independent missed-run monitoring remains unaccepted. Near-term priorities (see `ROADMAP.md`): improve source rigor and archival coverage, add pinned MCP Registry schema validation, improve network-failure diagnostics, and prepare the separately gated Pages artifact migration.

## Documentation audit map

README.md indexes usage; ROADMAP.md indexes future work. INTENT.md owns admission and stewardship policy. The hand-edited docs/methodology.html, llms.txt and agents.json describe current public scope. The versioned assistant guide retains its verified trust boundary. ops/MATTER-MONITOR-PILOT.md and ops/evidence/ contain bounded operating details and dated evidence. Rebuild data.js and api/v1/of through npm run build; never infer new source verification from a build. Historical release notes and receipts describe their recorded candidates.
