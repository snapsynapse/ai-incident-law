# Handoff: MCP registry submissions

Date: 2026-06-10
Author: Claude (Sonnet 4.6)
Status: Drafts ready; Sam to execute submissions
Audience: Sam, when ready to push to registries

## Why this is a handoff and not a commit

Registry submissions are externally visible actions on third-party systems. I drafted the
content; you click submit. This handoff has everything you need: a ready-to-paste
`server.json` for the official registry, web-form field values for Smithery and Glama, and
the open question for mcp.so.

## Prerequisite: decide the distribution shape

AI Incident Law's MCP server today is **local stdio only**, runnable as
`node scripts/mcp-server.js` from a fresh clone. `package.json` is `"private": true` and
no npm package is published.

Every public MCP registry wants one of two things:
- An npm (or pypi, docker, etc.) package that handles its own install: `npx -y <pkg>`
- A hosted HTTPS endpoint serving MCP-over-HTTP

Three options, ranked by reach-to-effort:

1. **Publish `ai-incident-law` to npm** (recommended). The script and tests already exist;
   you flip `"private": false`, add a `bin` entry, and `npm publish` once. From then on the
   canonical install is `npx -y ai-incident-law`. Unblocks every registry below.
2. **Skip the official registry; rely on auto-discovery for Glama/mcp.so**. Smithery wants
   an HTTPS endpoint we do not have, so it stays out. Cheapest path, narrowest reach.
3. **Stand up a hosted HTTP MCP wrapper** in front of the static `api/v1/of/*` endpoints.
   Most engineering; widest reach (Smithery, Cloudflare's MCP Hosting, anyone wanting
   HTTPS).

I assume option 1 below. Substitute paths if you take a different route.

## Registry 1: Official MCP Registry (registry.modelcontextprotocol.io)

**Mechanism**: `mcp-publisher` CLI publishing to `registry.modelcontextprotocol.io`.
GitHub OAuth or DNS verification for namespace ownership.

**Namespace recommendation**: DNS-verified `org.aiincidentlaw.*` (you own the domain).
The alternative is GitHub-verified `io.github.snapsynapse.*`. DNS is the more durable
identifier and matches the rest of the legal graph's IRI scheme.

**Submission steps**:

```bash
# One-time install
brew install mcp-publisher

# In ai-incident-law repo root, after npm publish
mcp-publisher init                                  # generates server.json template
# (edit server.json to match the draft below)

# DNS auth: generate Ed25519 keypair, add TXT record at _mcp-registry.aiincidentlaw.org
openssl genpkey -algorithm Ed25519 -out mcp-key.pem
# (follow the DNS TXT record setup at registry.modelcontextprotocol.io/docs)

mcp-publisher login dns --domain=aiincidentlaw.org --private-key=$(cat mcp-key.pem)
mcp-publisher publish
```

**Draft `server.json`** (paste into the repo root after `mcp-publisher init`):

```json
{
  "$schema": "https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json",
  "name": "org.aiincidentlaw/ai-incident-law",
  "title": "AI Incident Law",
  "description": "Public-record corpus of AI-related litigation, regulatory action, tribunal records, and review-queue matters. Searchable by case attributes; anchored to EveryAILaw obligations for cross-graph queries.",
  "websiteUrl": "https://aiincidentlaw.org/",
  "repository": {
    "url": "https://github.com/snapsynapse/ai-incident-law",
    "source": "github"
  },
  "version": "0.1.0",
  "packages": [
    {
      "registryType": "npm",
      "registryBaseUrl": "https://registry.npmjs.org",
      "identifier": "ai-incident-law",
      "version": "0.1.0",
      "transport": {
        "type": "stdio"
      }
    }
  ],
  "_meta": {
    "io.modelcontextprotocol.registry/publisher-provided": {
      "license": "MIT (code) / CC BY 4.0 (data)",
      "publisher": "PAICE.work PBC",
      "publisher_url": "https://paice.work/",
      "agents_json": "https://aiincidentlaw.org/agents.json",
      "discovery": "https://aiincidentlaw.org/.well-known/mcp.json",
      "legal_graph_layer": "case-and-enforcement-evidence",
      "legal_graph_position": 4,
      "legal_graph_narrative": "https://aiincidentlaw.org/docs/legal-graph.html"
    }
  }
}
```

## Registry 2: Smithery (smithery.ai)

**Mechanism**: Web form at <https://smithery.ai/new>. Smithery wants either an HTTPS MCP
endpoint or an `.mcpb` bundle. **Skip unless you take option 3 above** (stand up an HTTPS
wrapper).

If you do have an HTTPS endpoint:

- URL: smithery.ai/new
- Field "MCP server URL": `https://<your-mcp-host>/mcp`
- Field "Display name": `AI Incident Law`
- Field "Description": `Public-record corpus of AI-related litigation, regulatory action,
  and tribunal records, anchored to EveryAILaw obligations for cross-graph queries.`
- Smithery auto-scans for tools; if scan fails, serve
  `/.well-known/mcp/server-card.json` with metadata (the existing
  `/.well-known/mcp.json` is close but not identical to Smithery's schema)

## Registry 3: Glama (glama.ai)

**Mechanism**: Web form via the "Add Server" button. Glama also performs some
GitHub auto-discovery, so a published npm package + good repo README may surface
without manual submission.

Manual submission fields (typical for Glama-style MCP directories):

- **Name**: `AI Incident Law`
- **Description**: `Public-record corpus of AI-related litigation, regulatory action,
  tribunal records, and review-queue matters. Stewarded by PAICE.work PBC. Searchable
  by case attributes; anchored to EveryAILaw obligations for cross-graph queries.
  Code MIT; dataset CC BY 4.0.`
- **GitHub repo**: `https://github.com/snapsynapse/ai-incident-law`
- **Homepage / website**: `https://aiincidentlaw.org/`
- **License**: `MIT (code) / CC BY 4.0 (data)`
- **Install command**: `npx -y ai-incident-law`
- **Categories / tags**: `legal`, `regulation`, `research`, `public-records`, `litigation`,
  `compliance`, `paice-legal-graph`

## Registry 4: mcp.so

**Mechanism**: Unclear from public documentation. The site exists and lists MCP servers,
but no documented submission flow surfaces in Perplexity sonar-pro or direct site fetch
(403 on `/submit` as of 2026-06-10). Best options in order:

1. Try the homepage for a "Submit" or "Add server" affordance.
2. Check if mcp.so auto-discovers from the official registry; if so, registry 1 ships
   this one for free.
3. Look for a maintainer contact (likely a GitHub handle in the site footer or `/about`)
   and email asking for inclusion criteria.

If still no path, deprioritize. mcp.so's reach is a function of its scrape sources --
the official registry covers most of the audience.

## Suggested order of operations

1. Decide distribution shape (recommend npm publish).
2. Publish `ai-incident-law` to npm.
3. Submit to Official MCP Registry (registry 1) using the drafted `server.json`.
4. Update `index.html` Legal Graph strip and the cross-graph demo recipe in
   `docs/legal-graph.html` to use `npx -y ai-incident-law` once published. Update the post
   draft at `handoffs/2026-06-10-cross-graph-demo-post-draft.md` to the same.
5. Submit to Glama via the web form.
6. Skip Smithery and mcp.so for now; revisit if hosted HTTPS or auto-discovery materializes.
7. Add a line to `agents.json` `usage_notes` once the npm package is live, so other agents
   know the install path.

## Documentation that needs updating once npm package is live

- `docs/legal-graph.html` -- "Configure both MCP servers" block, replace the local-stdio
  config with `npx -y ai-incident-law`.
- `handoffs/2026-06-10-cross-graph-demo-post-draft.md` -- the "Try it yourself" paragraph.
- `mcp.json` and `.well-known/mcp.json` -- add a `package` block pointing at the npm
  identifier so HTTPS-only clients can still discover the install path.
- `README.md` -- add an `npx -y ai-incident-law` install section.
- `agents.json` -- the `capabilities.api.endpoints` array could gain an explicit
  `install_command` field (informational, not breaking).

## Related

- Official MCP Registry: https://registry.modelcontextprotocol.io/
- Publishing guide: https://github.com/modelcontextprotocol/registry/blob/main/docs/reference/server-json/generic-server-json.md
- Glama: https://glama.ai/mcp/servers
- Smithery: https://smithery.ai/
- mcp.so: https://mcp.so/
