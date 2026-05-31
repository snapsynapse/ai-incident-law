const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf8"));
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
  assert.equal(discovery.discovery.agents_json, "https://aiincidentlaw.org/agents.json");
  assert.equal(discovery.local_server.transport, "stdio");
  assert.ok(discovery.local_server.tools.includes("search_records"));
});

test("robots.txt advertises agent and MCP discovery", () => {
  const robots = fs.readFileSync(path.join(ROOT, "robots.txt"), "utf8");
  assert.match(robots, /^Agents: https:\/\/aiincidentlaw\.org\/agents\.json$/m);
  assert.match(robots, /^MCP: https:\/\/aiincidentlaw\.org\/\.well-known\/mcp\.json$/m);
  assert.doesNotMatch(robots, /https:\/\/www\./);
  assert.doesNotMatch(robots, /http:\/\//);
});
