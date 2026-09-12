import assert from "node:assert/strict";
import test from "node:test";

import { validatePublicationState } from "../scripts/check-publication-state.mjs";
import { readFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const read = relative => readFileSync(path.join(ROOT, relative));
function fixture() {
  const state = JSON.parse(read("design/publication-state.json"));
  const snapshotBytes = read(state.observations.npm.artifact_snapshot_path);
  const providerEvidence = Object.fromEntries(Object.entries(state.observations).map(([provider, observation]) => {
    const bytes = read(observation.evidence_path);
    return [provider, { path: observation.evidence_path, bytes, json: JSON.parse(bytes) }];
  }));
  return {
    state,
    snapshot: JSON.parse(snapshotBytes),
    snapshotBytes,
    providerEvidence,
    pkg: JSON.parse(read("package.json")),
    server: JSON.parse(read("server.json")),
    discovery: JSON.parse(read(".well-known/mcp.json")),
    readme: read("README.md").toString("utf8"),
    legalGraph: read("docs/legal-graph.html").toString("utf8"),
    guideBytes: read(".well-known/assistant-guide.txt"),
    guideManifest: read(".well-known/assistant-guide-manifest.txt").toString("utf8")
  };
}

test("published release state selects the exact verified package and capabilities", () => {
  assert.deepEqual(validatePublicationState(fixture()), []);
});

test("a source version bump remains separate from the recorded published release", () => {
  const value = fixture();
  value.pkg.version = "0.4.4";
  value.server.version = "0.4.4";
  value.server.packages[0].version = "0.4.4";
  assert.deepEqual(validatePublicationState(value), []);
  assert.equal(value.state.observations.npm.version, "0.4.2");
});

test("a published source keeps neutral package guidance when npm catches up", () => {
  const value = fixture();
  value.pkg.version = "0.4.2";
  value.server.version = "0.4.2";
  value.server.packages[0].version = "0.4.2";
  assert.deepEqual(validatePublicationState(value), []);
});

test("missing or wrong provider evidence fails closed", () => {
  const missing = fixture();
  missing.state.observations.github_release.integrity = null;
  assert.match(validatePublicationState(missing).join("\n"), /github_release published status requires evidence integrity/);
  const wrong = fixture();
  wrong.state.observations.npm.tarball_sha256 = "0".repeat(64);
  assert.match(validatePublicationState(wrong).join("\n"), /npm tarball evidence differs from the frozen artifact snapshot/);
});

test("provider versions and integrity must match retained raw response bytes", () => {
  const version = fixture();
  version.state.observations.mcp_registry.version = "0.4.0";
  assert.match(validatePublicationState(version).join("\n"), /MCP Registry response does not support/);
  const integrity = fixture();
  integrity.state.observations.mcp_registry.integrity = `sha256:${"a".repeat(64)}`;
  assert.match(validatePublicationState(integrity).join("\n"), /mcp_registry integrity does not bind the retained provider response/);
});

test("absent observations require retained 404 or 410 evidence", () => {
  const value = fixture();
  value.state.observations.github_release.status = "absent";
  value.state.observations.github_release.version = null;
  assert.match(validatePublicationState(value).join("\n"), /absent status requires an observed HTTP 404 or 410/);
});

test("provider evidence paths and endpoints are fixed to their owning surfaces", () => {
  const traversal = fixture();
  traversal.state.observations.npm.evidence_path = "design/provider-evidence/../publication-state.json";
  assert.match(validatePublicationState(traversal).join("\n"), /evidence_path must be one retained provider-evidence JSON filename/);
  const endpoint = fixture();
  endpoint.state.observations.mcp_registry.evidence_url = "https://registry.npmjs.org/ai-incident-law";
  assert.match(validatePublicationState(endpoint).join("\n"), /mcp_registry evidence_url does not identify the expected provider endpoint/);
});

test("provider errors require nonempty detail", () => {
  const value = fixture();
  value.state.observations.npm.status = "error";
  value.state.observations.npm.version = null;
  value.state.observations.npm.error = "   ";
  assert.match(validatePublicationState(value).join("\n"), /error status requires nonempty error detail/);
});

test("provider error and unknown states cannot select an install version", () => {
  for (const status of ["error", "unknown"]) {
    const value = fixture();
    value.state.observations.npm.status = status;
    value.state.observations.npm.version = null;
    value.state.observations.npm.error = status === "error" ? "synthetic provider failure" : null;
    assert.match(validatePublicationState(value).join("\n"), /hosted install claims require a published npm observation/);
  }
});

test("unrecorded tools cannot leak into published discovery claims", () => {
  const value = fixture();
  value.discovery.local_server.tools.push("candidate_only_tool");
  assert.match(validatePublicationState(value).join("\n"), /public discovery tools differ from the published artifact snapshot/);
});

test("public guide bytes and immutable anchors remain bound to the published artifact", () => {
  const changedGuide = fixture();
  changedGuide.guideBytes = Buffer.concat([changedGuide.guideBytes, Buffer.from("candidate-only\n")]);
  assert.match(validatePublicationState(changedGuide).join("\n"), /guide bytes.*published artifact/);
  const absentRelease = fixture();
  absentRelease.state.observations.github_release.status = "absent";
  absentRelease.state.observations.github_release.version = null;
  assert.match(validatePublicationState(absentRelease).join("\n"), /verified GitHub Release anchor/i);
});

test("Git tag evidence cannot masquerade as GitHub Release evidence", () => {
  const value = fixture();
  value.state.observations.github_tag.evidence_url = value.state.observations.github_release.evidence_url;
  assert.match(validatePublicationState(value).join("\n"), /Git tag evidence must remain distinct/);
});
