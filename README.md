# AI Incident Law

Standalone, dependency-free single-page application for browsing AI Incident Law, a searchable index of public matters involving AI-related incidents, failures, and resulting legal or regulatory action.

## Who this is for

Compliance teams, legal counsel, AI governance leads, and researchers tracking how AI failures turn into legal and regulatory action.

## What problem it solves

AI incidents and their legal consequences are scattered across public records with no structured, searchable index. AI Incident Law is an open corpus of public AI-related matters, queryable by humans and agents.

## Canonical URL

https://aiincidentlaw.org/

## Part of the PAICE legal graph

AI Incident Law is one component of the PAICE legal graph (with EveryAILaw, PubLedge, and Obligation First). It is intentionally open: code under MIT, dataset under CC BY 4.0, commercial use permitted with attribution. The open siblings are funded by EveryAILaw Pro, the graph's single restricted layer; openness here is a deliberate PBC-charter choice. The canonical model is in the PAICE Foundation INTENT. Attribution: "AI Incident Law, PAICE.work PBC, CC BY 4.0".

## Repo layout

- `index.html` is the application shell.
- `styles.css` is the local stylesheet.
- `app.js` handles local search, filtering, and rendering.
- `data/data.json` is the canonical dataset for maintainers.
- `data.js` is a generated browser bundle consumed by `index.html`.
- `api/v1/of/` contains the generated Obligation-First binding for included public matters.
- `mcp.json` configures the local read-only MCP stdio server.
- `.well-known/mcp.json` advertises public MCP and static query endpoints.
- `agents.json` and `robots.txt` advertise agent-facing discovery metadata.
- `scripts/mcp-server.js` exposes query tools for MCP clients.
- `scripts/build-data.mjs` normalizes source data and regenerates `data.js`.
- `scripts/build-obligation-first.mjs` generates Obligation-First authorities, proceedings, allegations, and determinations.
- `scripts/validate-data.mjs` validates record shape, duplicate identifiers, and URL conventions.

## Runtime properties

The shipped app still has no runtime dependencies:

- No framework
- No CDN
- No API calls
- No analytics
- No persistent browser storage

The footer displays the dataset freshness date from `generated_at` in the canonical JSON bundle.

Open `index.html` directly in a browser or host the folder on any static file server. Public-record links are outbound links and load only when selected.

## Maintainer workflow

The repo uses Node.js only for maintainer tooling. There are no install-time dependencies.

```bash
npm run build:data
npm run build:of
npm run validate:data
npm run test:url-policy
npm run eval:url-policy
npm run test:mcp
npm run test:discovery
```

Or run the combined build and check:

```bash
npm run build
npm run check
```

To preview over a local static server:

```bash
npm run serve
```

Then open the local server in your browser.

## Data conventions

- `data/data.json` is the source of truth.
- `data.js` is generated and should not be edited by hand.
- Source URLs are normalized to `https://` bare domains during the build step.
- Validation fails on duplicate record identifiers and malformed URL-field structure.
- `public_record_link` must contain exactly one primary URL.
- `secondary_source_links` and `best_available_sources` are semicolon-delimited URL lists.
- URL normalization is intentionally narrow: `http://` is rewritten to `https://`, leading `www.` is stripped, surrounding whitespace is trimmed, and the URL parser serializes the final value.
- URL validation rejects appended prose, empty list entries, protocol-relative URLs, non-HTTP schemes, credentials, backslashes, encoded backslashes, embedded whitespace, control characters, and unsafe raw delimiters.
- URL-policy evals run malformed-source fixtures through the real build and validation scripts in temporary directories.
- Included records are exported to Obligation-First as `of:Proceeding`, `of:Allegation`, and, when no longer pending, `of:Determination` records.
- `review` and `global` records are editorial queues and are not exported to Obligation-First.

## MCP access

AI Incident Law includes a zero-dependency, read-only MCP stdio server for local agent queries:
```bash
node scripts/mcp-server.js
```
MCP clients can use [mcp.json](/Users/snap/Git/ai-incident-law/mcp.json). The public site advertises static discovery at `https://aiincidentlaw.org/.well-known/mcp.json`.

Advertised tools:

- `list_datasets`
- `list_records`
- `get_record`
- `search_records`
- `list_authorities`
- `get_authority`
- `get_obligation_first_record`

## Repository metadata

- [CONTRIBUTING.md](/Users/snap/Git/ai-incident-law/CONTRIBUTING.md) documents the expected edit and review flow.
- [SECURITY.md](/Users/snap/Git/ai-incident-law/SECURITY.md) documents private security reporting expectations.
- [ROADMAP.md](/Users/snap/Git/ai-incident-law/ROADMAP.md) captures near-term maintenance and curation priorities.
- [docs/data-schema.md](/Users/snap/Git/ai-incident-law/docs/data-schema.md) documents the dataset structure and field intent.
- [validate.yml](/Users/snap/Git/ai-incident-law/.github/workflows/validate.yml) runs the build and validation pipeline on pushes and pull requests.
- [LICENSE](/Users/snap/Git/ai-incident-law/LICENSE) applies the MIT license to the software in this repository.
- [DATA_LICENSE](/Users/snap/Git/ai-incident-law/DATA_LICENSE) applies CC BY 4.0 to the dataset and generated data bundle.

## Licensing

- Code and maintainer tooling are licensed under MIT.
  This includes `index.html`, `styles.css`, `app.js`, `package.json`, and `scripts/`.
- Data is licensed under CC BY 4.0.
  This includes `data/data.json` and the generated `data.js`.
- If you reuse the dataset, provide attribution and indicate changes where applicable.

## Attribution

Preferred dataset attribution:

```text
AI Incident Law, PAICE.work PBC, CC BY 4.0.
Source project: https://aiincidentlaw.org/
```

If you publish an adapted version of the dataset, indicate that changes were made and retain a link to the CC BY 4.0 license:

https://creativecommons.org/licenses/by/4.0/
