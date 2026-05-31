const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const ROOT = path.join(__dirname, "..");
const SERVER = path.join(ROOT, "scripts", "mcp-server.js");

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

function toolCall(id, name, args) {
  return {
    jsonrpc: "2.0",
    id,
    method: "tools/call",
    params: { name, arguments: args }
  };
}

function payload(response) {
  return JSON.parse(response.result.content[0].text);
}

function wrongValueFor(schema) {
  if (schema.type === "string") return 42;
  if (schema.type === "number") return "not-a-number";
  if (schema.type === "array") return "not-an-array";
  if (schema.type === "object") return "not-an-object";
  return null;
}

const validArgs = {
  list_datasets: {},
  list_records: { dataset: "included", limit: 5 },
  get_record: { id: "AIEL-2024-001" },
  search_records: { query: "chatbot", limit: 5 },
  list_authorities: {},
  get_authority: { id: "british-columbia-civil-resolution-tribunal" },
  get_obligation_first_record: { kind: "proceedings", id: "aiel-2024-001-proceeding" }
};

function listTools() {
  const [response] = callMcp([{ jsonrpc: "2.0", id: 1, method: "tools/list" }]);
  return response.result.tools;
}

test("MCP initializes and advertises tools", () => {
  const [response] = callMcp([{ jsonrpc: "2.0", id: 1, method: "initialize", params: {} }]);
  assert.equal(response.result.serverInfo.name, "ai-incident-law");
  assert.deepEqual(response.result.capabilities, { tools: {} });
});

test("MCP accepts one valid fixture for every advertised tool", () => {
  const tools = listTools();
  const messages = tools.map((tool, index) => {
    assert.ok(validArgs[tool.name], `missing valid fixture for ${tool.name}`);
    return toolCall(index + 1, tool.name, validArgs[tool.name]);
  });

  const responses = callMcp(messages);
  for (const response of responses) {
    assert.equal(response.result.isError, undefined, payload(response).detail);
  }
});

test("MCP rejects missing required arguments for every schema that requires them", () => {
  const tools = listTools().filter(tool => (tool.inputSchema.required || []).length > 0);
  const messages = tools.map((tool, index) => {
    const args = { ...validArgs[tool.name] };
    delete args[tool.inputSchema.required[0]];
    return toolCall(index + 1, tool.name, args);
  });

  const responses = callMcp(messages);
  for (const response of responses) {
    const body = payload(response);
    assert.equal(response.result.isError, true);
    assert.equal(body.error, "invalid_input");
    assert.match(body.detail, /Missing required argument/);
  }
});

test("MCP rejects wrong primitive argument types for every typed property", () => {
  const messages = [];
  for (const tool of listTools()) {
    const [name, schema] = Object.entries(tool.inputSchema.properties || {})[0] || [];
    if (!name) continue;
    messages.push(toolCall(messages.length + 1, tool.name, {
      ...validArgs[tool.name],
      [name]: wrongValueFor(schema)
    }));
  }

  const responses = callMcp(messages);
  for (const response of responses) {
    const body = payload(response);
    assert.equal(response.result.isError, true);
    assert.equal(body.error, "invalid_input");
  }
});

test("MCP rejects extra arguments for every strict tool schema", () => {
  const tools = listTools().filter(tool => tool.inputSchema.additionalProperties === false);
  const messages = tools.map((tool, index) => toolCall(index + 1, tool.name, {
    ...validArgs[tool.name],
    unexpected: true
  }));

  const responses = callMcp(messages);
  for (const response of responses) {
    const body = payload(response);
    assert.equal(response.result.isError, true);
    assert.equal(body.error, "invalid_input");
    assert.match(body.detail, /Unexpected argument/);
  }
});
