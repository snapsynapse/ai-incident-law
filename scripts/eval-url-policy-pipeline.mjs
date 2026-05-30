#!/usr/bin/env node

import { cp, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const failures = [];

function fail(message) {
  failures.push(message);
}

async function makeFixture() {
  const dir = await mkdtemp(path.join(tmpdir(), "aiel-url-policy-"));
  await cp(path.join(ROOT, "scripts"), path.join(dir, "scripts"), { recursive: true });
  await cp(path.join(ROOT, "data"), path.join(dir, "data"), { recursive: true });
  return dir;
}

async function mutateFixture(dir, mutate) {
  const file = path.join(dir, "data", "data.json");
  const data = JSON.parse(await readFile(file, "utf8"));
  mutate(data);
  await writeFile(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function runScript(dir, scriptName) {
  return spawnSync(process.execPath, [path.join(dir, "scripts", scriptName)], {
    cwd: dir,
    encoding: "utf8",
  });
}

function expectPass(result, label) {
  if (result.status !== 0) {
    fail(`${label}: expected pass, got exit ${result.status}\n${result.stderr || result.stdout}`);
  }
}

function expectFail(result, label, pattern) {
  const output = `${result.stdout || ""}\n${result.stderr || ""}`;
  if (result.status === 0) {
    fail(`${label}: expected failure, got pass`);
    return;
  }
  if (!pattern.test(output)) {
    fail(`${label}: expected ${pattern}, got\n${output}`);
  }
}

async function withFixture(label, mutate, check) {
  const dir = await makeFixture();
  await mutateFixture(dir, mutate);
  await check(dir, label);
}

await withFixture(
  "valid corpus",
  () => {},
  async (dir, label) => {
    expectPass(runScript(dir, "validate-data.mjs"), `${label} validate-data`);
    expectPass(runScript(dir, "build-data.mjs"), `${label} build-data`);
  },
);

await withFixture(
  "appended primary URL payload",
  (data) => {
    data.datasets.included.records[0].public_record_link =
      "https://canlii.org/en/bc/bccrt/doc/2024/2024bccrt149/2024bccrt149.html; javascript:alert(1); //evil.example/path";
  },
  async (dir, label) => {
    expectFail(runScript(dir, "validate-data.mjs"), `${label} validate-data`, /public_record_link must contain exactly one URL/);
    expectFail(runScript(dir, "build-data.mjs"), `${label} build-data`, /public_record_link must contain exactly one URL/);
  },
);

await withFixture(
  "second primary URL",
  (data) => {
    data.datasets.included.records[0].public_record_link =
      "https://canlii.org/en/bc/bccrt/doc/2024/2024bccrt149/2024bccrt149.html; https://evil.example/extra";
  },
  async (dir, label) => {
    expectFail(runScript(dir, "validate-data.mjs"), `${label} validate-data`, /public_record_link must contain exactly one URL/);
    expectFail(runScript(dir, "build-data.mjs"), `${label} build-data`, /public_record_link must contain exactly one URL/);
  },
);

await withFixture(
  "encoded control source URL",
  (data) => {
    data.datasets.included.records[0].secondary_source_links = "https://example.com/%0a";
  },
  async (dir, label) => {
    expectFail(runScript(dir, "validate-data.mjs"), `${label} validate-data`, /encoded control character/);
    expectFail(runScript(dir, "build-data.mjs"), `${label} build-data`, /encoded control character/);
  },
);

if (failures.length) {
  console.error(`eval-url-policy-pipeline: FAILED (${failures.length})`);
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("eval-url-policy-pipeline: OK");
