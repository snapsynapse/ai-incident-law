import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const workflow = await readFile(new URL("../.github/workflows/validate.yml", import.meta.url), "utf8");
const accessibilityWorkflow = await readFile(
  new URL("../.github/workflows/accessibility.yml", import.meta.url),
  "utf8"
);
const npmPublishWorkflow = await readFile(
  new URL("../.github/workflows/publish-npm-reviewed.yml", import.meta.url),
  "utf8"
);
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
  assert.match(workflow, /comparison_base:[\s\S]*required: true/);
  assert.match(workflow, /node obligation-first\/scripts\/resolve-admission-base.mjs --root \. --github-env/);
  assert.doesNotMatch(workflow, /SOURCE_ADMISSION_BASE:.*github\.sha/);
  for (const gate of ["npm, [\"run\", \"build\"]", "npm, [\"run\", \"check\"]", "[\"diff\", \"--check\"]", "[\"diff\", \"--exit-code\"]"]) {
    assert.ok(verifier.includes(gate), `verify-ci.mjs omits ${gate}`);
  }
  for (const gate of ["eval:of", "check:of", "validate:of", "check:of-fingerprint", "check:of-continuity", "test:build-of", "test:mcp"]) {
    assert.match(packageJson.scripts.check, new RegExp(`npm run ${gate.replace(":", "\\:")}(?: |$)`), `package check omits ${gate}`);
  }
});

test("accessibility workflow is a fail-closed four-route release gate", () => {
  assert.match(
    accessibilityWorkflow,
    /snapsynapse\/skill-a11y-audit\/\.github\/actions\/scan@88b55612e34c9a436b6d0b886ae2bdca9b3b6b17/
  );
  assert.match(accessibilityWorkflow, /^\s+serve-path: \.$/m);
  assert.match(accessibilityWorkflow, /^\s+fail-on: errors$/m);
  for (const route of [
    "http://127.0.0.1:8088/",
    "http://127.0.0.1:8088/docs/methodology.html",
    "http://127.0.0.1:8088/docs/legal-graph.html",
    "http://127.0.0.1:8088/docs/submit-a-case.html"
  ]) {
    assert.ok(accessibilityWorkflow.includes(route), `accessibility workflow omits ${route}`);
  }
});

test("reviewed npm publication is first-attempt only and reruns verify pinned bytes", () => {
  for (const step of ["Confirm npm version is absent", "Publish exact reviewed tarball through npm OIDC"]) {
    assert.match(npmPublishWorkflow, new RegExp(`- name: ${step}\\n        if: github\\.run_attempt == '1'`));
  }
  assert.match(npmPublishWorkflow, /for attempt in \{1\.\.37\}; do/);
  assert.match(npmPublishWorkflow, /probe=\$\{attempt\}/);
  assert.match(npmPublishWorkflow, /sha256sum "\$RUNNER_TEMP\/published\.tgz"[\s\S]*da514afe228826aad4f90a65fc961b2390f287cd4ff646ab554306690d832597/);
});

for (const file of ['check-search.mjs', 'check-production-search.mjs']) {
    test(`${file}: XML decoding is complete and single-pass`, async () => {
        const source = await readFile(new URL(`../scripts/${file}`, import.meta.url), 'utf8');
        const decoder = source.match(/function decode\(value\) \{[\s\S]*?\n\}/)?.[0];
        assert.ok(decoder, 'decoder exists');
        const entities = source.match(/const XML_ENTITIES = [^;]+;/)?.[0] || '';
        const decode = vm.runInNewContext(`${entities}\n${decoder}\ndecode`);
        for (const [input, expected] of [
            ['&amp;lt;tag&amp;gt;', '&lt;tag&gt;'],
            ['a=1&amp;b=2', 'a=1&b=2'],
            ['&lt;b&gt; &quot;q&quot; &apos;s&#39; &#x27;', '<b> "q" \'s\' \''],
            ['&#38;amp;', '&amp;'],
            ['\n https://aiincidentlaw.org/ \n', 'https://aiincidentlaw.org/'],
            ['&#0; &#xD800; &#1114112; &unknown;', '&#0; &#xD800; &#1114112; &unknown;'],
        ]) assert.equal(decode(input), expected);
    });
}

test("frozen maintenance removes recurring source collection while preserving manual and offline-age boundaries", async () => {
  const links = await readFile(new URL("../.github/workflows/check-source-links.yml", import.meta.url), "utf8");
  const age = await readFile(new URL("../.github/workflows/staleness-report.yml", import.meta.url), "utf8");
  assert.match(links, /^  workflow_dispatch:/m);
  assert.doesNotMatch(links, /^\s+schedule:|^\s+- cron:/m);
  assert.match(links, /run: npm run check:links/);
  assert.match(age, /cron: "47 13 \* \* 1"/);
  assert.doesNotMatch(age, /check:links|observe:matters|fetch-source/);
});
