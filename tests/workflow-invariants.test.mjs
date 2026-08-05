import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const workflow = await readFile(new URL("../.github/workflows/validate.yml", import.meta.url), "utf8");
const verifier = await readFile(new URL("../scripts/verify-ci.mjs", import.meta.url), "utf8");
const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const packageLock = JSON.parse(await readFile(new URL("../package-lock.json", import.meta.url), "utf8"));

test("validation workflow uses the canonical fail-closed entrypoint", () => {
  assert.match(workflow, /run: npm ci$/m);
  assert.doesNotMatch(workflow, /run: npm install$/m);
  assert.equal(packageLock.lockfileVersion, 3);
  assert.equal(packageLock.packages[""].version, packageJson.version, "package-lock root version must match package.json");
  assert.match(workflow, /run: npm run verify:ci$/m);
  assert.match(workflow, /CHECK_OF_REQUIRED: "1"/);
  for (const gate of ["npm, [\"run\", \"build\"]", "npm, [\"run\", \"check\"]", "[\"diff\", \"--check\"]", "[\"diff\", \"--exit-code\"]"]) {
    assert.ok(verifier.includes(gate), `verify-ci.mjs omits ${gate}`);
  }
  for (const gate of ["eval:of", "check:of", "validate:of", "check:of-fingerprint", "check:of-continuity", "test:build-of", "test:mcp"]) {
    assert.match(packageJson.scripts.check, new RegExp(`npm run ${gate.replace(":", "\\:")}(?: |$)`), `package check omits ${gate}`);
  }
});
