const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const ROOT = path.join(__dirname, "..");
const SERVER = path.join(ROOT, "scripts", "mcp-server.js");

const PUBLIC_SURFACE_PATHS = [
  "README.md",
  "agents.json",
  ".well-known/mcp.json",
  "server.json",
  "llms.txt",
  "index.html",
  "docs/methodology.html",
  "docs/legal-graph.html",
  "docs/submit-a-case.html"
];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf8"));
}

function readText(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function latestChangelogVersion() {
  const changelog = readText("CHANGELOG.md");
  const match = changelog.match(/^## \[(\d+\.\d+\.\d+)\]/m);
  assert.ok(match, "CHANGELOG.md must contain at least one released version");
  return match[1];
}

function callMcp(messages) {
  const input = `${messages.map(message => JSON.stringify(message)).join("\n")}\n`;
  const result = spawnSync(process.execPath, [SERVER], {
    cwd: ROOT,
    input,
    encoding: "utf8",
    maxBuffer: 1024 * 1024
  });

  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim().split("\n").filter(Boolean).map(line => JSON.parse(line));
}

test("agent discovery JSON uses canonical URLs and advertises MCP", () => {
  const agents = readJson("agents.json");
  assert.equal(agents.url, "https://aiincidentlaw.org/");
  assert.equal(agents.capabilities.mcp_discovery, "https://aiincidentlaw.org/.well-known/mcp.json");
  assert.equal(agents.capabilities.mcp_config, "https://aiincidentlaw.org/mcp.json");
  assert.equal(agents.capabilities.api.authentication, "none");
});

test("well-known MCP discovery points at local stdio tooling", () => {
  const discovery = readJson(".well-known/mcp.json");
  assert.ok(fs.existsSync(path.join(ROOT, ".nojekyll")), ".nojekyll is required for GitHub Pages .well-known files");
  assert.equal(discovery.discovery.agents_json, "https://aiincidentlaw.org/agents.json");
  assert.equal(discovery.package.homepage, "https://npmjs.com/package/ai-incident-law");
  assert.equal(discovery.local_server.transport, "stdio");
  assert.ok(discovery.local_server.tools.includes("search_records"));
});

test("public discovery and docs do not use www URLs", () => {
  for (const relativePath of PUBLIC_SURFACE_PATHS) {
    const text = readText(relativePath);
    assert.doesNotMatch(text, /https:\/\/www\./, `${relativePath} contains a www URL`);
  }
});

test("package, registry, discovery, docs, and MCP initialize metadata stay aligned", () => {
  const pkg = readJson("package.json");
  const registry = readJson("server.json");
  const discovery = readJson(".well-known/mcp.json");
  const localMcp = readJson("mcp.json");
  const readme = readText("README.md");
  const [initialize] = callMcp([{ jsonrpc: "2.0", id: 1, method: "initialize", params: {} }]);
  const [toolList] = callMcp([{ jsonrpc: "2.0", id: 2, method: "tools/list" }]);

  assert.equal(pkg.name, "ai-incident-law");
  assert.equal(pkg.mcpName, registry.name);
  assert.equal(pkg.version, registry.version);
  assert.equal(registry.packages[0].identifier, pkg.name);
  assert.equal(registry.packages[0].version, pkg.version);
  assert.equal(discovery.package.name, pkg.name);
  assert.equal(discovery.package.install_command, `npx -y ${pkg.name}`);
  assert.match(readme, /"args": \["-y", "ai-incident-law"\]/);
  assert.equal(localMcp.mcpServers["ai-incident-law"].args.join(" "), "scripts/mcp-server.js");
  assert.equal(initialize.result.serverInfo.name, pkg.name);
  assert.equal(initialize.result.serverInfo.version, pkg.version);
  assert.equal(pkg.version, latestChangelogVersion());

  const advertised = [...discovery.local_server.tools].sort();
  const actual = toolList.result.tools.map(tool => tool.name).sort();
  assert.deepEqual(advertised, actual);
});

test("public HTML and docs link surface stays canonical and internally resolvable", () => {
  const staleNamePattern = /(ai-regulation-reference|aireg\.snapsynapse\.com)/;
  const internalLinkPattern = /\b(?:href|src)="([^"#?][^"#?]*)/g;

  for (const relativePath of PUBLIC_SURFACE_PATHS) {
    const text = readText(relativePath);
    assert.doesNotMatch(text, /http:\/\//, `${relativePath} contains an http URL`);
    assert.doesNotMatch(text, /https:\/\/www\./, `${relativePath} contains a www URL`);
    assert.doesNotMatch(text, staleNamePattern, `${relativePath} contains a stale project name or URL`);

    let match;
    while ((match = internalLinkPattern.exec(text)) !== null) {
      const target = match[1];
      if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith("//")) continue;
      if (target === "/") continue;
      const fileTarget = target.startsWith("/")
        ? path.join(ROOT, target)
        : path.join(ROOT, path.dirname(relativePath), target);
      assert.ok(fs.existsSync(fileTarget), `${relativePath} links to missing local target ${target}`);
    }
  }

  const requiredAgentSurface = [
    "https://aiincidentlaw.org/agents.json",
    "https://aiincidentlaw.org/.well-known/mcp.json",
    "https://aiincidentlaw.org/.well-known/assistant-guide.txt",
    "https://aiincidentlaw.org/docs/methodology.html",
    "https://aiincidentlaw.org/docs/legal-graph.html",
    "https://aiincidentlaw.org/docs/submit-a-case.html"
  ];
  const combined = PUBLIC_SURFACE_PATHS.map(readText).join("\n");
  for (const url of requiredAgentSurface) {
    assert.ok(combined.includes(url), `public docs do not mention ${url}`);
  }
});

test("robots.txt advertises agent and MCP discovery", () => {
  const robots = fs.readFileSync(path.join(ROOT, "robots.txt"), "utf8");
  assert.match(robots, /^Agents: https:\/\/aiincidentlaw\.org\/agents\.json$/m);
  assert.match(robots, /^MCP: https:\/\/aiincidentlaw\.org\/\.well-known\/mcp\.json$/m);
  assert.match(robots, /^Assistant-Guide: https:\/\/aiincidentlaw\.org\/\.well-known\/assistant-guide\.txt$/m);
  assert.doesNotMatch(robots, /https:\/\/www\./);
  assert.doesNotMatch(robots, /http:\/\//);
});
