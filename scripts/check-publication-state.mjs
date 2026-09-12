#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const hash = value => createHash("sha256").update(value).digest("hex");
const SEMVER = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/;
const SHA256 = /^[a-f0-9]{64}$/;
const STATUS = new Set(["published", "absent", "unknown", "error"]);

function exactKeys(value, expected, label, errors) {
  const actual = Object.keys(value || {}).sort();
  const wanted = [...expected].sort();
  if (JSON.stringify(actual) !== JSON.stringify(wanted)) {
    errors.push(`${label} fields must be exactly ${wanted.join(", ")}`);
  }
}

function validTimestamp(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?Z$/.test(value)) return false;
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime()) || parsed.getTime() > Date.now()) return false;
  const normalizedInput = value.replace(/(\.\d{3})\d+Z$/, "$1Z").replace(/Z$/, value.includes(".") ? "Z" : ".000Z");
  return parsed.toISOString() === normalizedInput;
}

function httpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && !url.hostname.startsWith("www.");
  } catch {
    return false;
  }
}

function compareSemver(left, right) {
  const a = left.split(/[+-]/)[0].split(".").map(Number);
  const b = right.split(/[+-]/)[0].split(".").map(Number);
  for (let index = 0; index < 3; index++) {
    if (a[index] !== b[index]) return a[index] - b[index];
  }
  return 0;
}

function expectedEvidenceUrl(provider, version) {
  if (provider === "npm") return `https://registry.npmjs.org/ai-incident-law/${version}`;
  if (provider === "mcp_registry") return `https://registry.modelcontextprotocol.io/v0.1/servers/io.github.snapsynapse%2Fai-incident-law/versions/${version}`;
  if (provider === "github_tag") return `https://api.github.com/repos/snapsynapse/ai-incident-law/git/ref/tags/v${version}`;
  if (provider === "github_release") return `https://api.github.com/repos/snapsynapse/ai-incident-law/releases/tags/v${version}`;
  return null;
}

export function validatePublicationState({ state, snapshot, snapshotBytes, providerEvidence, pkg, server, discovery, readme, legalGraph, guideBytes, guideManifest }) {
  const errors = [];
  exactKeys(state, ["schema_version", "document_updated", "package", "release_source", "observations", "hosted_policy", "limitations"], "publication state", errors);
  if (state.schema_version !== 1) errors.push("publication state schema_version must be 1");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(state.document_updated || "") || new Date(`${state.document_updated}T00:00:00Z`).toISOString().slice(0, 10) !== state.document_updated || state.document_updated > new Date().toISOString().slice(0, 10)) errors.push("document_updated must be a real non-future ISO date");
  exactKeys(state.package, ["name", "registry_server_name"], "package identity", errors);
  if (state.package?.name !== pkg.name || state.package?.registry_server_name !== pkg.mcpName) {
    errors.push("publication package identity differs from package.json");
  }
  exactKeys(state.release_source, ["version", "status", "commit", "tag"], "release source", errors);
  if (state.release_source?.version !== pkg.version || state.release_source?.status !== "published-release") {
    errors.push("package.json must identify the verified published release");
  }
  if (!/^[a-f0-9]{40}$/.test(state.release_source?.commit || "") || state.release_source?.tag !== `v${pkg.version}`) {
    errors.push("release source requires the exact release commit and tag");
  }
  if (server.name !== pkg.mcpName || server.version !== pkg.version || server.packages?.[0]?.version !== pkg.version) {
    errors.push("server.json must describe the release source, not a different artifact");
  }

  exactKeys(state.observations, ["npm", "mcp_registry", "github_tag", "github_release"], "observations", errors);
  const observationKeys = ["status", "version", "observed_at", "evidence_url", "evidence_path", "integrity", "http_status", "tarball_sha256", "artifact_snapshot_path", "artifact_snapshot_sha256", "error"];
  for (const [provider, observation] of Object.entries(state.observations || {})) {
    exactKeys(observation, observationKeys, `${provider} observation`, errors);
    if (!STATUS.has(observation?.status)) errors.push(`${provider} has an invalid status`);
    if (!validTimestamp(observation?.observed_at)) errors.push(`${provider} observed_at must be a real non-future UTC timestamp`);
    const queriedVersion = observation?.version || state.release_source?.version;
    if (observation?.evidence_url !== expectedEvidenceUrl(provider, queriedVersion)) errors.push(`${provider} evidence_url does not identify the expected provider endpoint`);
    if (typeof observation?.evidence_path !== "string" || !/^design\/provider-evidence\/[a-z0-9.-]+\.json$/.test(observation.evidence_path)) errors.push(`${provider} evidence_path must be one retained provider-evidence JSON filename`);
    if (observation?.status === "published") {
      if (!SEMVER.test(observation.version || "")) errors.push(`${provider} published status requires a version`);
      if (!httpsUrl(observation.evidence_url)) errors.push(`${provider} published status requires a bare HTTPS evidence URL`);
      if (typeof observation.integrity !== "string" || !observation.integrity.trim()) errors.push(`${provider} published status requires evidence integrity`);
      if (observation.http_status !== 200) errors.push(`${provider} published status requires an observed HTTP 200`);
      if (observation.error !== null) errors.push(`${provider} published status cannot retain an error`);
    } else if (observation?.status === "absent") {
      if (![404, 410].includes(observation.http_status)) errors.push(`${provider} absent status requires an observed HTTP 404 or 410`);
      if (observation?.version !== null) errors.push(`${provider} absent status must not claim a version`);
    } else if (observation?.version !== null) {
      errors.push(`${provider} ${observation.status} status must not claim a version`);
    }
    if (observation?.status === "error" && (typeof observation.error !== "string" || !observation.error.trim())) errors.push(`${provider} error status requires nonempty error detail`);
    const evidence = providerEvidence?.[provider];
    if (!evidence || evidence.path !== observation.evidence_path) {
      errors.push(`${provider} observation lacks retained provider response bytes`);
      continue;
    }
    if (observation.integrity !== `sha256:${hash(evidence.bytes)}`) errors.push(`${provider} integrity does not bind the retained provider response`);
    if (observation.status === "published") {
      if (provider === "npm") {
        const release = evidence.json;
        if (release?.name !== pkg.name || release?.version !== observation.version || release?.mcpName !== pkg.mcpName) errors.push("npm response does not support the observed package identity and version");
        if (release?.dist?.integrity !== snapshot.artifact?.integrity || release?.dist?.tarball !== snapshot.artifact?.tarball_url || release?.dist?.shasum !== snapshot.artifact?.npm_shasum || release?.dist?.unpackedSize !== snapshot.artifact?.unpacked_bytes) errors.push("npm response artifact metadata differs from the frozen published snapshot");
      } else if (provider === "mcp_registry") {
        const descriptor = evidence.json.server;
        const official = evidence.json._meta?.["io.modelcontextprotocol.registry/official"];
        if (descriptor?.name !== pkg.mcpName || descriptor?.version !== observation.version || descriptor?.packages?.[0]?.identifier !== pkg.name || descriptor?.packages?.[0]?.version !== observation.version || official?.status !== "active" || official?.isLatest !== true) errors.push("MCP Registry response does not support the active latest server identity and version");
        if (!validTimestamp(official?.publishedAt) || new Date(official.publishedAt) > new Date(observation.observed_at)) errors.push("MCP Registry response has no valid publication time for the observed version");
      } else if (provider === "github_tag") {
        if (evidence.json.ref !== `refs/tags/v${observation.version}` || evidence.json.object?.type !== "tag" || !/^[a-f0-9]{40}$/.test(evidence.json.object?.sha || "")) errors.push("GitHub tag response does not support the observed tag version and object");
      } else if (provider === "github_release") {
        const asset = evidence.json.assets?.find(item => item.name === `${pkg.name}-${observation.version}.tgz`);
        if (evidence.json.tag_name !== `v${observation.version}` || evidence.json.draft !== false || evidence.json.prerelease !== false || !validTimestamp(evidence.json.published_at) || new Date(evidence.json.published_at) > new Date(observation.observed_at)) errors.push("GitHub Release response does not support the published release version and time");
        if (asset?.digest !== `sha256:${snapshot.artifact?.tarball_sha256}` || asset?.size !== snapshot.artifact?.packed_bytes) errors.push("GitHub Release asset differs from the exact published npm artifact");
      }
    }
  }
  if (state.observations?.github_tag?.evidence_url === state.observations?.github_release?.evidence_url) {
    errors.push("Git tag evidence must remain distinct from GitHub Release evidence");
  }

  exactKeys(state.hosted_policy, ["install_source", "install_version_from", "capabilities_from", "hosted_site_status", "hosted_site_version_from", "public_guide_artifact_from", "source_release_url"], "hosted policy", errors);
  const policy = state.hosted_policy || {};
  if (policy.install_source !== "npm" || policy.install_version_from !== "observations.npm.version") errors.push("hosted install policy must derive from the npm observation");
  if (policy.capabilities_from !== "observations.npm.artifact_snapshot_path" || policy.public_guide_artifact_from !== "observations.npm.artifact_snapshot_path") {
    errors.push("hosted capability and guide claims must derive from the published npm artifact snapshot");
  }
  if (policy.hosted_site_status !== "post-publication-evidence" || policy.hosted_site_version_from !== "release_source.version") {
    errors.push("hosted source/data state must explicitly identify post-publication evidence");
  }
  if (!httpsUrl(policy.source_release_url) || /releases\/tag/.test(policy.source_release_url)) {
    errors.push("release source documentation must use a source URL, not a release URL");
  }

  const npmObservation = state.observations?.npm || {};
  if (npmObservation.status !== "published") errors.push("hosted install claims require a published npm observation");
  if (SEMVER.test(npmObservation.version || "") && SEMVER.test(pkg.version || "") && compareSemver(npmObservation.version, pkg.version) > 0) {
    errors.push("published npm version cannot be ahead of the declared release source");
  }
  if (npmObservation.artifact_snapshot_path !== `design/PUBLISHED-MCP-${npmObservation.version}.snapshot.json`) errors.push("npm artifact snapshot path must identify its exact published version");
  if (!SHA256.test(npmObservation.artifact_snapshot_sha256 || "") || hash(snapshotBytes) !== npmObservation.artifact_snapshot_sha256) errors.push("published capability snapshot bytes differ from the recorded digest");
  if (snapshot.schema_version !== 1 || snapshot.artifact?.source !== "npm") errors.push("published capability snapshot has an unknown contract");
  if (snapshot.artifact?.name !== pkg.name || snapshot.artifact?.version !== npmObservation.version) errors.push("published capability snapshot does not match npm identity");
  if (snapshot.identity?.registry_server_name !== pkg.mcpName || snapshot.identity?.server_version !== npmObservation.version) errors.push("published snapshot server identity is inconsistent");
  if (snapshot.artifact?.tarball_sha256 !== npmObservation.tarball_sha256) errors.push("npm tarball evidence differs from the frozen artifact snapshot");
  if (!SHA256.test(snapshot.mcp?.tools_sha256 || "") || hash(JSON.stringify(snapshot.mcp?.tools)) !== snapshot.mcp?.tools_sha256) errors.push("published tool snapshot digest is invalid");
  if (snapshot.mcp?.tool_count !== snapshot.mcp?.tools?.length) errors.push("published tool count is inconsistent");
  const toolNames = snapshot.mcp?.tools?.map(tool => tool.name) || [];
  if (JSON.stringify(discovery.local_server?.tools) !== JSON.stringify(toolNames)) errors.push("public discovery tools differ from the published artifact snapshot");
  const exactPackage = `${pkg.name}@${npmObservation.version}`;
  if (discovery.hosted_source?.status !== "published-release" || discovery.hosted_source?.version !== pkg.version || discovery.hosted_source?.release_tag !== state.release_source.tag || discovery.hosted_source?.release_commit !== state.release_source.commit || discovery.hosted_source?.publication_state !== "https://aiincidentlaw.org/design/publication-state.json") {
    errors.push("public discovery must identify the verified published release separately");
  }
  if (discovery.package?.install_command !== `npx -y ${exactPackage}` || discovery.package?.published_version !== npmObservation.version || discovery.package?.artifact_snapshot !== npmObservation.artifact_snapshot_path) {
    errors.push("public discovery must exact-pin the verified published npm artifact and snapshot");
  }
  if (!readme.includes(`"args": ["-y", "${exactPackage}"]`) || readme.includes(`"args": ["-y", "${pkg.name}"]`)) errors.push("README install example must exact-pin the published npm artifact");
  if (!legalGraph.includes(`"args": ["-y", "${exactPackage}"]`) || legalGraph.includes(`"args": ["-y", "${pkg.name}"]`)) errors.push("legal graph install example must exact-pin the published npm artifact");
  if (hash(guideBytes) !== snapshot.guide?.sha256 || guideBytes.length !== snapshot.guide?.bytes) errors.push("public guide bytes differ from the verified published artifact");
  const releaseVersion = state.observations?.github_release?.status === "published" ? state.observations.github_release.version : null;
  if (!releaseVersion || !guideManifest.includes(`immutable-release-url: https://github.com/snapsynapse/ai-incident-law/releases/tag/v${releaseVersion}`)) errors.push("guide manifest lacks its verified GitHub Release anchor");
  if (!releaseVersion || !guideManifest.includes(`changelog-url: https://github.com/snapsynapse/ai-incident-law/blob/v${releaseVersion}/CHANGELOG.md`)) errors.push("guide manifest changelog lacks its verified release tag anchor");
  if (!Array.isArray(state.limitations) || state.limitations.length < 3) errors.push("publication state requires explicit limitations");
  return errors;
}

export function readPublicationInputs(root = ROOT) {
  const read = relative => readFileSync(path.join(root, relative));
  const state = JSON.parse(read("design/publication-state.json"));
  const snapshotBytes = read(state.observations?.npm?.artifact_snapshot_path);
  const providerEvidence = Object.fromEntries(Object.entries(state.observations).map(([provider, observation]) => {
    if (typeof observation.evidence_path !== "string" || !/^design\/provider-evidence\/[a-z0-9.-]+\.json$/.test(observation.evidence_path)) return [provider, null];
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

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.some(arg => arg !== "--quiet")) {
    console.error("Usage: check-publication-state.mjs [--quiet]");
    process.exit(1);
  }
  const quiet = args.includes("--quiet");
  const errors = validatePublicationState(readPublicationInputs());
  if (errors.length) {
    console.error("publication-state: FAILED");
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  if (!quiet) console.log(`publication-state: verified published release ${readPublicationInputs().state.release_source.version}`);
}
