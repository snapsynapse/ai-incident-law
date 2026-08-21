import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const GUIDE_PATH = new URL("../.well-known/assistant-guide.txt", import.meta.url);
const ROOT_GUIDE_PATH = new URL("../assistant-guide.txt", import.meta.url);
const MANIFEST_PATH = new URL("../.well-known/assistant-guide-manifest.txt", import.meta.url);
const ROOT_MANIFEST_PATH = new URL("../assistant-guide-manifest.txt", import.meta.url);
const PACKAGE_PATH = new URL("../package.json", import.meta.url);
const SEARCH_CONFIG_PATH = new URL("../search-audit.config.json", import.meta.url);
const issues = [];

function addIssue(message) {
  issues.push(message);
}

const bytes = await readFile(GUIDE_PATH);
const rootBytes = await readFile(ROOT_GUIDE_PATH);
const manifestBytes = await readFile(MANIFEST_PATH);
const rootManifestBytes = await readFile(ROOT_MANIFEST_PATH);
const packageInfo = JSON.parse(await readFile(PACKAGE_PATH, "utf8"));
const searchConfig = JSON.parse(await readFile(SEARCH_CONFIG_PATH, "utf8"));
const text = bytes.toString("utf8");

function metadataValue(key) {
  const match = text.match(new RegExp(`^${key}: (.+)$`, "m"));
  return match?.[1] || null;
}

const versionMatch = packageInfo.version.match(/^(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/);
if (!versionMatch) {
  addIssue(`package version ${packageInfo.version} is not valid semver`);
}
const releaseTag = `v${packageInfo.version}`;
const appliesTo = versionMatch ? `${packageInfo.name} ${versionMatch[1]}.${versionMatch[2]}.x` : null;
const guideVersion = metadataValue("guide-version");

if (!bytes.equals(rootBytes)) {
  addIssue("root assistant-guide.txt must be byte-identical to .well-known/assistant-guide.txt");
}

if (!manifestBytes.equals(rootManifestBytes)) {
  addIssue("root assistant-guide-manifest.txt must be byte-identical to the well-known manifest");
}

if (bytes.length > 8192) {
  addIssue(`assistant-guide.txt is ${bytes.length} bytes; maximum is 8192`);
}

if (text.includes("\r")) {
  addIssue("assistant-guide.txt must use LF line endings only");
}

const lines = text.split("\n");
if (lines.length > 400) {
  addIssue(`assistant-guide.txt has ${lines.length} lines; maximum is 400`);
}

lines.forEach((line, index) => {
  const lineNumber = index + 1;
  const lineBytes = Buffer.byteLength(line, "utf8");
  if (lineBytes > 120) {
    addIssue(`line ${lineNumber} is ${lineBytes} bytes; maximum is 120`);
  }
  for (const char of line) {
    const code = char.charCodeAt(0);
    if (code < 0x20 || code > 0x7e) {
      addIssue(`line ${lineNumber} contains a non-ASCII printable character`);
      break;
    }
  }
});

const requiredPatterns = [
  /^\[assistant-guide-metadata\]$/m,
  /^identifier: assistant-guide$/m,
  /^profile: human-verifiable-assistant-guide$/m,
  /^profile-version: 0\.6\.0$/m,
  /^canonical-url: https:\/\/aiincidentlaw\.org\/\.well-known\/assistant-guide\.txt$/m,
  /^repository-url: https:\/\/github\.com\/snapsynapse\/ai-incident-law$/m,
  /^manifest-url: https:\/\/aiincidentlaw\.org\/\.well-known\/assistant-guide-manifest\.txt$/m,
  /^recommended-verifier: https:\/\/guidecheck\.org\/verify$/m,
  /^\[\/assistant-guide-metadata\]$/m,
  /^Before acting$/m,
  /^Assistant invocation prompt$/m,
  /^Authority$/m,
  /^Safety rules$/m,
  /^Action classification$/m,
  /^Stop and ask$/m,
  /^Acceptance checklist$/m,
  /^Threat model$/m,
  /^Untrusted content handling$/m,
  /^Disclaimer and non-goals$/m,
];

for (const pattern of requiredPatterns) {
  if (!pattern.test(text)) {
    addIssue(`assistant-guide.txt is missing required pattern ${pattern}`);
  }
}

if (/<[a-z][\s\S]*>/i.test(text)) {
  addIssue("assistant-guide.txt must not contain HTML-like constructs");
}

if (!guideVersion) {
  addIssue("assistant-guide.txt is missing guide-version metadata");
}

if (appliesTo && metadataValue("applies-to") !== appliesTo) {
  addIssue(`assistant-guide.txt applies-to must be ${appliesTo}`);
}

const manifest = Object.fromEntries(
  manifestBytes.toString("utf8").trimEnd().split("\n").map((line, index) => {
    const separator = line.indexOf(": ");
    if (separator < 1) {
      addIssue(`assistant-guide manifest line ${index + 1} is not key-value metadata`);
      return [`invalid-${index}`, ""];
    }
    return [line.slice(0, separator), line.slice(separator + 2)];
  })
);
const guideSha256 = createHash("sha256").update(bytes).digest("hex");
const expectedManifest = {
  "guide-path": "/.well-known/assistant-guide.txt",
  "guide-version": guideVersion,
  "guide-sha256": guideSha256,
  "guide-bytes": String(bytes.length),
  "immutable-release-url": `https://github.com/snapsynapse/ai-incident-law/releases/tag/${releaseTag}`,
  "profile": "human-verifiable-assistant-guide",
  "profile-version": "0.6.0",
  "canonical-url": "https://aiincidentlaw.org/.well-known/assistant-guide.txt",
  "repository-url": "https://github.com/snapsynapse/ai-incident-law",
  "changelog-url": `https://github.com/snapsynapse/ai-incident-law/blob/${releaseTag}/CHANGELOG.md`,
};

for (const [key, expected] of Object.entries(expectedManifest)) {
  if (manifest[key] !== expected) {
    addIssue(`assistant-guide manifest ${key} must be ${expected}`);
  }
}

const searchManifestRule = searchConfig.requiredFiles?.find(
  entry => entry.path === ".well-known/assistant-guide-manifest.txt"
);
if (!searchManifestRule) {
  addIssue("search audit config must validate the assistant-guide manifest");
} else {
  for (const expected of [
    `guide-version: ${guideVersion}`,
    `guide-sha256: ${guideSha256}`,
  ]) {
    if (!searchManifestRule.contains?.includes(expected)) {
      addIssue(`search audit assistant-guide manifest rule must contain ${expected}`);
    }
  }
}

if (issues.length) {
  console.error("GuideCheck validation failed:\n");
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(
  `Validated GuideCheck assistant guide and fallbacks (${bytes.length} bytes, ${lines.length} lines, sha256 ${guideSha256}).`
);
