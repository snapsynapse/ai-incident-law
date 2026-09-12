#!/usr/bin/env node
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { validateNamingProfileManifest } from "./check-naming-profile-manifest.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const REQUIRED_FILES = [
  ".well-known/obligation-first-naming-profile.jsonld",
  ".well-known/obligation-first-naming-profile-manifest.txt",
  ".well-known/assistant-guide-manifest.txt",
  ".well-known/assistant-guide.txt",
  "api/v1/of/tombstones.json",
  "assistant-guide-manifest.txt",
  "assistant-guide.txt",
  "design/PUBLISHED-MCP-0.4.2.snapshot.json",
  "design/publication-state.json",
  "design/provider-evidence/npm-0.4.2.json",
  "design/provider-evidence/mcp-registry-0.4.2.json",
  "design/provider-evidence/github-tag-v0.4.2.json",
  "design/provider-evidence/github-release-v0.4.2.json",
  "package.json",
  "scripts/mcp-server.js",
  "server.json",
];

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
    ...options,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    const detail = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
    throw new Error(`${command} ${args.join(" ")} exited ${result.status}${detail ? `\n${detail}` : ""}`);
  }
  return result;
}

function parsePackResult(stdout) {
  const start = stdout.indexOf("[");
  const end = stdout.lastIndexOf("]");
  if (start < 0 || end < start) throw new Error("npm pack did not return JSON metadata");
  const [metadata] = JSON.parse(stdout.slice(start, end + 1));
  if (!metadata?.filename || !Array.isArray(metadata.files)) {
    throw new Error("npm pack returned incomplete metadata");
  }
  return metadata;
}

function readResponses(stdout) {
  return stdout.trim().split("\n").filter(Boolean).map(line => JSON.parse(line));
}

const scratch = await mkdtemp(path.join(tmpdir(), "aiel-package-eval-"));
try {
  const packDir = path.join(scratch, "pack");
  const consumerDir = path.join(scratch, "consumer");
  const npmEnv = { ...process.env, npm_config_cache: path.join(scratch, "npm-cache") };
  await mkdir(packDir);
  await mkdir(consumerDir);

  const pack = parsePackResult(run(
    npm,
    ["pack", "--json", "--pack-destination", packDir],
    { env: npmEnv }
  ).stdout);
  const packedPaths = new Set(pack.files.map(file => file.path));
  for (const required of REQUIRED_FILES) {
    assert.ok(packedPaths.has(required), `packed artifact is missing ${required}`);
  }

  const archivePath = path.join(packDir, pack.filename);
  const archiveSha256 = createHash("sha256").update(await readFile(archivePath)).digest("hex");
  await writeFile(
    path.join(consumerDir, "package.json"),
    `${JSON.stringify({ name: "aiel-package-eval-consumer", private: true }, null, 2)}\n`
  );
  run(npm, ["install", "--ignore-scripts", "--no-audit", "--no-fund", archivePath], {
    cwd: consumerDir,
    env: npmEnv,
  });

  const installedRoot = path.join(consumerDir, "node_modules", "ai-incident-law");
  const installedPackage = JSON.parse(await readFile(path.join(installedRoot, "package.json"), "utf8"));
  const installedServer = JSON.parse(await readFile(path.join(installedRoot, "server.json"), "utf8"));
  const publicationState = JSON.parse(await readFile(path.join(installedRoot, "design", "publication-state.json"), "utf8"));
  const publishedSnapshot = JSON.parse(await readFile(path.join(installedRoot, "design", "PUBLISHED-MCP-0.4.2.snapshot.json"), "utf8"));
  assert.equal(installedPackage.version, pack.version, "installed package version differs from packed version");
  assert.equal(installedServer.version, installedPackage.version, "registry server version differs from package version");
  assert.equal(installedServer.packages?.[0]?.version, installedPackage.version, "registry package version differs from package version");
  assert.equal(publicationState.release_source.version, installedPackage.version, "installed release identity differs");
  assert.equal(publicationState.observations.npm.version, publishedSnapshot.artifact.version, "published artifact identity differs from snapshot");
  for (const observation of Object.values(publicationState.observations)) {
    const evidence = await readFile(path.join(installedRoot, observation.evidence_path));
    assert.equal(`sha256:${createHash("sha256").update(evidence).digest("hex")}`, observation.integrity, "installed provider evidence digest differs");
  }
  assert.deepEqual(
    publishedSnapshot.mcp.tools.map(tool => tool.name),
    JSON.parse(await readFile(path.join(installedRoot, ".well-known", "mcp.json"), "utf8")).local_server.tools,
    "installed public tool claims differ from the published snapshot"
  );

  const guide = await readFile(path.join(installedRoot, ".well-known", "assistant-guide.txt"));
  const rootGuide = await readFile(path.join(installedRoot, "assistant-guide.txt"));
  const manifest = await readFile(path.join(installedRoot, ".well-known", "assistant-guide-manifest.txt"), "utf8");
  const rootManifest = await readFile(path.join(installedRoot, "assistant-guide-manifest.txt"), "utf8");
  assert.deepEqual(rootGuide, guide, "installed assistant-guide copies differ");
  assert.equal(rootManifest, manifest, "installed assistant-guide manifest copies differ");
  const expectedGuideHash = manifest.match(/^guide-sha256: ([a-f0-9]{64})$/m)?.[1];
  assert.ok(expectedGuideHash, "installed assistant-guide manifest lacks a SHA-256");
  assert.equal(createHash("sha256").update(guide).digest("hex"), expectedGuideHash, "installed assistant-guide hash differs from its manifest");

  validateNamingProfileManifest(
    await readFile(path.join(installedRoot, ".well-known/obligation-first-naming-profile.jsonld")),
    await readFile(path.join(installedRoot, ".well-known/obligation-first-naming-profile-manifest.txt"), "utf8")
  );

  const mcpInput = [
    { jsonrpc: "2.0", id: 1, method: "initialize", params: {} },
    { jsonrpc: "2.0", id: 2, method: "tools/list" },
    { jsonrpc: "2.0", id: 3, method: "server/discover", params: { _meta: { "io.modelcontextprotocol/protocolVersion": "2026-07-28" } } },
    { jsonrpc: "2.0", id: 4, method: "tools/call", params: { name: "get_record", arguments: { id: "AIEL-2024-001" } } },
    { jsonrpc: "2.0", id: 5, method: "tools/call", params: { name: "get_obligation_first_record", arguments: { kind: "proceedings", id: "aiel-2024-001-proceeding" } } },
    { jsonrpc: "2.0", id: 6, method: "tools/call", params: { name: "get_obligation_first_record", arguments: { kind: "unknown", id: "missing" } } },
    { jsonrpc: "2.0", id: 7, method: "tools/call", params: { name: "get_record", arguments: { id: "missing" } } },
  ].map(message => JSON.stringify(message)).join("\n") + "\n";
  const mcp = run(process.execPath, [path.join(installedRoot, "scripts", "mcp-server.js")], {
    cwd: consumerDir,
    input: mcpInput,
  });
  const [initialized, listed, discovered, source, projection, badKind, unknownId] = readResponses(mcp.stdout);
  assert.equal(initialized.result.serverInfo.name, installedPackage.name);
  assert.equal(initialized.result.serverInfo.version, installedPackage.version);
  assert.equal(listed.result.tools.length, 8, "installed MCP tool inventory changed");
  assert.equal(initialized.result.instructions, discovered.result.instructions);
  assert.ok(initialized.result.instructions.includes("https://obligationfirst.org/v1/context.jsonld"));
  for (const name of ["list_authorities", "get_authority", "get_obligation_first_record"]) {
    const tool = listed.result.tools.find(item => item.name === name);
    assert.ok(tool.description.includes("https://obligationfirst.org/v1/context.jsonld"));
  }
  const payload = response => JSON.parse(response.result.content[0].text);
  assert.equal(payload(source).data.error_id, "AIEL-2024-001");
  assert.equal(payload(projection).data["@type"], "of:Proceeding");
  assert.equal(badKind.result.isError, true);
  assert.equal(payload(badKind).error, "invalid_input");
  assert.equal(unknownId.result.isError, true);
  assert.equal(payload(unknownId).error, "not_found");

  console.log(JSON.stringify({
    status: "pass",
    package: `${installedPackage.name}@${installedPackage.version}`,
    packed_files: pack.entryCount,
    unpacked_bytes: pack.unpackedSize,
    archive_sha256: archiveSha256,
    mcp_tools: listed.result.tools.length,
    guide_sha256: expectedGuideHash,
  }));
} finally {
  await rm(scratch, { recursive: true, force: true });
}
