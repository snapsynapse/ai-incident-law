import { readFile } from "node:fs/promises";

const GUIDE_PATH = new URL("../.well-known/assistant-guide.txt", import.meta.url);
const issues = [];

function addIssue(message) {
  issues.push(message);
}

const bytes = await readFile(GUIDE_PATH);
const text = bytes.toString("utf8");

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

if (issues.length) {
  console.error("GuideCheck validation failed:\n");
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(`Validated GuideCheck assistant guide (${bytes.length} bytes, ${lines.length} lines).`);
