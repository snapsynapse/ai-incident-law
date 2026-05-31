#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const DATA_PATH = path.join(ROOT, "data", "data.json");
const OF_API_DIR = path.join(ROOT, "api", "v1", "of");
const SERVER_INFO = { name: "ai-incident-law", version: "1.0.0" };

function readJson(filePath, fallback = null) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function loadSourceData() {
  return readJson(DATA_PATH, { generated_at: null, datasets: {} });
}

function loadOfData() {
  const data = {};
  if (!fs.existsSync(OF_API_DIR)) return data;
  for (const file of fs.readdirSync(OF_API_DIR).filter(name => name.endsWith(".json"))) {
    data[file.replace(/\.json$/, "")] = readJson(path.join(OF_API_DIR, file), {});
  }
  return data;
}

const sourceData = loadSourceData();
const ofData = loadOfData();

function allRecords() {
  const records = [];
  for (const [dataset, bucket] of Object.entries(sourceData.datasets || {})) {
    for (const record of bucket.records || []) {
      records.push({ dataset, ...record });
    }
  }
  return records;
}

function recordId(record) {
  return record.error_id || record.candidate_id || record.translated_title || record.original_title || "";
}

function recordTitle(record) {
  return record.error_title || record.candidate_title || record.translated_title || record.original_title || "";
}

function compactRecord(record) {
  return {
    dataset: record.dataset,
    id: recordId(record),
    title: recordTitle(record),
    ai_system_name: record.ai_system_name || null,
    deployer: record.deployer || null,
    domain: record.domain || record.region || null,
    error_type: record.error_type || record.event_grain || null,
    public_matter_type: record.public_matter_type || null,
    public_matter_name: record.public_matter_name || record.candidate_matter || null,
    filing_status: record.filing_status || null,
    jurisdiction: record.jurisdiction || record.country || null,
    filing_date: record.filing_date || null,
    last_verified_date: record.last_verified_date || record.last_checked_date || null,
    source_quality: record.source_quality || null,
    needs_review: record.needs_review || null
  };
}

function meta() {
  return {
    generated: sourceData.generated_at || null,
    server: `${SERVER_INFO.name}/${SERVER_INFO.version}`,
    source: "AI Incident Law, PAICE.work PBC, CC BY 4.0",
    source_url: "https://aiincidentlaw.org/",
    freshness_note: "Check last_verified_date or last_checked_date before presenting a record as current. This is a public-record reference tool, not legal advice."
  };
}

function textResult(obj) {
  return { content: [{ type: "text", text: JSON.stringify(obj, null, 2) }] };
}

function structuredError({ error, detail, why, guidance }) {
  return {
    content: [{ type: "text", text: JSON.stringify({ error, detail, why, guidance }, null, 2) }],
    isError: true
  };
}

function invalidInputError(detail, guidance = {}) {
  return structuredError({
    error: "invalid_input",
    detail,
    why: "Tool arguments must match the advertised input schema before a handler runs.",
    guidance
  });
}

function validateSchemaValue(value, schema, pathName) {
  if (!schema || !schema.type) return null;
  if (schema.type === "string") return typeof value === "string" ? null : `${pathName} must be a string.`;
  if (schema.type === "number") return typeof value === "number" && Number.isFinite(value) ? null : `${pathName} must be a finite number.`;
  if (schema.type === "boolean") return typeof value === "boolean" ? null : `${pathName} must be a boolean.`;
  if (schema.type === "array") {
    if (!Array.isArray(value)) return `${pathName} must be an array.`;
    if (schema.minItems && value.length < schema.minItems) return `${pathName} must contain at least ${schema.minItems} item(s).`;
    if (schema.items) {
      for (let index = 0; index < value.length; index += 1) {
        const itemError = validateSchemaValue(value[index], schema.items, `${pathName}[${index}]`);
        if (itemError) return itemError;
      }
    }
    return null;
  }
  if (schema.type === "object") {
    if (!value || typeof value !== "object" || Array.isArray(value)) return `${pathName} must be an object.`;
    return null;
  }
  return null;
}

function validateToolArguments(tool, args) {
  const schema = tool.inputSchema || {};
  const normalized = args || {};
  const objectError = validateSchemaValue(normalized, schema, "arguments");
  if (objectError) return invalidInputError(objectError);

  const properties = schema.properties || {};
  const required = schema.required || [];
  for (const key of required) {
    if (!Object.prototype.hasOwnProperty.call(normalized, key)) {
      return invalidInputError(`Missing required argument: ${key}.`, { required });
    }
  }

  if (schema.additionalProperties === false) {
    const allowed = new Set(Object.keys(properties));
    const extra = Object.keys(normalized).filter(key => !allowed.has(key));
    if (extra.length > 0) {
      return invalidInputError(`Unexpected argument(s): ${extra.join(", ")}.`, { allowed_arguments: [...allowed] });
    }
  }

  for (const [key, propertySchema] of Object.entries(properties)) {
    if (!Object.prototype.hasOwnProperty.call(normalized, key)) continue;
    const valueError = validateSchemaValue(normalized[key], propertySchema, key);
    if (valueError) return invalidInputError(valueError);
  }

  return null;
}

function containsText(value, query) {
  if (value === undefined || value === null) return false;
  if (Array.isArray(value)) return value.some(item => containsText(item, query));
  if (typeof value === "object") return Object.values(value).some(item => containsText(item, query));
  return String(value).toLowerCase().includes(query);
}

function filterRecords(args = {}) {
  let records = allRecords();
  const filters = {
    dataset: args.dataset,
    domain: args.domain,
    error_type: args.error_type,
    jurisdiction: args.jurisdiction,
    filing_status: args.filing_status,
    source_quality: args.source_quality,
    needs_review: args.needs_review
  };

  for (const [field, expected] of Object.entries(filters)) {
    if (!expected) continue;
    const q = expected.toLowerCase();
    records = records.filter(record => String(record[field] || "").toLowerCase().includes(q));
  }

  return records;
}

function suggestId(input, validIds) {
  const q = input.toLowerCase();
  const substringMatches = validIds.filter(id => id.includes(q) || q.includes(id));
  if (substringMatches.length > 0) return substringMatches.slice(0, 3);
  const scored = validIds.map(id => {
    const chars = new Set(q.split(""));
    const overlap = id.split("").filter(char => chars.has(char)).length;
    return { id, score: overlap / Math.max(id.length, q.length) };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).filter(item => item.score > 0.3).map(item => item.id);
}

function notFoundError(entityType, id, validIds, listTool) {
  const guidance = { use_tool: listTool, reason: `Call ${listTool} to see valid ${entityType} IDs.` };
  const suggestions = suggestId(id, validIds);
  if (suggestions.length > 0) guidance.did_you_mean = suggestions;
  return structuredError({
    error: "not_found",
    detail: `No ${entityType} found with ID "${id}".`,
    why: "IDs must match the stable identifier exposed by the dataset.",
    guidance
  });
}

const TOOLS = [
  {
    name: "list_datasets",
    description: "Summarize the available AI Incident Law dataset buckets and record counts.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false }
  },
  {
    name: "list_records",
    description: "List compact AI incident law records, optionally filtered by dataset, domain, type, jurisdiction, status, source quality, or review flag.",
    inputSchema: {
      type: "object",
      properties: {
        dataset: { type: "string", description: "Dataset bucket, such as included, review, or global." },
        domain: { type: "string", description: "Domain/category substring filter." },
        error_type: { type: "string", description: "Error or event type substring filter." },
        jurisdiction: { type: "string", description: "Jurisdiction, country, or authority substring filter." },
        filing_status: { type: "string", description: "Outcome or procedural posture substring filter." },
        source_quality: { type: "string", description: "Source quality substring filter." },
        needs_review: { type: "string", description: "Review flag, usually yes or no." },
        limit: { type: "number", description: "Maximum records to return. Default 25." }
      },
      additionalProperties: false
    }
  },
  {
    name: "get_record",
    description: "Get one full AI Incident Law source record by error_id or candidate_id.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string", description: "Record ID, such as AIEL-2024-001." } },
      required: ["id"],
      additionalProperties: false
    }
  },
  {
    name: "search_records",
    description: "Search across record titles, descriptions, parties, jurisdictions, tags, and source metadata.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Case-insensitive search query." },
        dataset: { type: "string", description: "Optional dataset bucket filter." },
        limit: { type: "number", description: "Maximum matches to return. Default 10." }
      },
      required: ["query"],
      additionalProperties: false
    }
  },
  {
    name: "list_authorities",
    description: "List Obligation-First authority records generated from included public matters.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false }
  },
  {
    name: "get_authority",
    description: "Get a generated Obligation-First authority record by authority ID.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string", description: "Authority ID, such as british-columbia-civil-resolution-tribunal." } },
      required: ["id"],
      additionalProperties: false
    }
  },
  {
    name: "get_obligation_first_record",
    description: "Get a generated Obligation-First proceeding, allegation, determination, or authority record by kind and ID.",
    inputSchema: {
      type: "object",
      properties: {
        kind: { type: "string", description: "Record kind: proceedings, allegations, determinations, or authorities." },
        id: { type: "string", description: "Generated Obligation-First record ID." }
      },
      required: ["kind", "id"],
      additionalProperties: false
    }
  }
];

const TOOL_BY_NAME = new Map(TOOLS.map(tool => [tool.name, tool]));

function handleListDatasets() {
  const datasets = Object.entries(sourceData.datasets || {}).map(([key, bucket]) => ({
    id: key,
    label: bucket.label || key,
    description: bucket.description || "",
    count: (bucket.records || []).length
  }));
  return textResult({ meta: meta(), data: datasets });
}

function handleListRecords(args = {}) {
  const limit = Math.max(1, Math.min(args.limit || 25, 100));
  const records = filterRecords(args).map(compactRecord);
  return textResult({ meta: meta(), data: records.slice(0, limit), total_matches: records.length, limit });
}

function handleGetRecord({ id }) {
  const normalized = id.toLowerCase();
  const records = allRecords();
  const record = records.find(item => recordId(item).toLowerCase() === normalized);
  if (!record) return notFoundError("record", id, records.map(recordId).filter(Boolean), "list_records");
  return textResult({ meta: meta(), data: record });
}

function handleSearchRecords({ query, dataset, limit } = {}) {
  const q = query.trim().toLowerCase();
  if (!q) return invalidInputError("query must not be empty.");
  const max = Math.max(1, Math.min(limit || 10, 50));
  const results = filterRecords({ dataset })
    .filter(record => containsText(record, q))
    .map(record => compactRecord(record));
  return textResult({ meta: meta(), data: results.slice(0, max), total_matches: results.length, limit: max });
}

function authorityRecords() {
  return ofData.authorities?.authorities || [];
}

function handleListAuthorities() {
  return textResult({ meta: meta(), data: authorityRecords() });
}

function handleGetAuthority({ id }) {
  const record = authorityRecords().find(item => item.id === id);
  if (!record) return notFoundError("authority", id, authorityRecords().map(item => item.id), "list_authorities");
  return textResult({ meta: meta(), data: record });
}

function handleGetObligationFirstRecord({ kind, id }) {
  const collections = {
    authorities: authorityRecords(),
    proceedings: ofData.proceedings?.proceedings || [],
    allegations: ofData.allegations?.allegations || [],
    determinations: ofData.determinations?.determinations || []
  };
  const records = collections[kind];
  if (!records) {
    return invalidInputError(`Unsupported kind: ${kind}.`, { allowed_kinds: Object.keys(collections) });
  }
  const record = records.find(item => item.id === id);
  if (!record) return notFoundError(kind.replace(/s$/, ""), id, records.map(item => item.id), "get_obligation_first_record");
  return textResult({ meta: meta(), data: record });
}

const TOOL_HANDLERS = {
  list_datasets: handleListDatasets,
  list_records: handleListRecords,
  get_record: handleGetRecord,
  search_records: handleSearchRecords,
  list_authorities: handleListAuthorities,
  get_authority: handleGetAuthority,
  get_obligation_first_record: handleGetObligationFirstRecord
};

function jsonRpcResponse(id, result) {
  return JSON.stringify({ jsonrpc: "2.0", id, result });
}

function jsonRpcError(id, code, message) {
  return JSON.stringify({ jsonrpc: "2.0", id, error: { code, message } });
}

function handleMessage(msg) {
  const { id, method, params } = msg;
  switch (method) {
    case "initialize":
      return jsonRpcResponse(id, {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO
      });
    case "notifications/initialized":
      return null;
    case "ping":
      return jsonRpcResponse(id, {});
    case "tools/list":
      return jsonRpcResponse(id, { tools: TOOLS });
    case "tools/call": {
      const toolName = params?.name;
      const handler = TOOL_HANDLERS[toolName];
      if (!handler) {
        return jsonRpcResponse(id, structuredError({
          error: "unknown_tool",
          detail: `No tool named "${toolName}".`,
          why: "The tool name must match one of the registered MCP tools exactly.",
          guidance: { available_tools: Object.keys(TOOL_HANDLERS) }
        }));
      }
      const validationError = validateToolArguments(TOOL_BY_NAME.get(toolName), params?.arguments || {});
      if (validationError) return jsonRpcResponse(id, validationError);
      try {
        return jsonRpcResponse(id, handler(params?.arguments || {}));
      } catch (err) {
        return jsonRpcResponse(id, structuredError({
          error: "tool_error",
          detail: `Tool "${toolName}" threw an error: ${err.message}`,
          why: "An unexpected error occurred while reading local dataset files.",
          guidance: { retry: true }
        }));
      }
    }
    default:
      if (method?.startsWith("notifications/")) return null;
      return jsonRpcError(id, -32601, `Method not found: ${method}`);
  }
}

let buffer = "";

process.stdin.setEncoding("utf8");
process.stdin.on("data", chunk => {
  buffer += chunk;
  let newlineIndex;
  while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
    const line = buffer.slice(0, newlineIndex).trim();
    buffer = buffer.slice(newlineIndex + 1);
    if (!line) continue;
    let msg;
    try {
      msg = JSON.parse(line);
    } catch {
      process.stdout.write(`${jsonRpcError(null, -32700, "Parse error")}\n`);
      continue;
    }
    const response = handleMessage(msg);
    if (response !== null) process.stdout.write(`${response}\n`);
  }
});

process.stdin.on("end", () => process.exit(0));

process.on("uncaughtException", err => {
  console.error("[mcp-server] Uncaught exception:", err.message);
});

console.error(`[mcp-server] AI Incident Law MCP server started (${sourceData.generated_at || "unknown"} data)`);
