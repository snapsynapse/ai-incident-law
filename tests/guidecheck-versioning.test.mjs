import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cp, mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function copyFixture(target) {
  await mkdir(path.join(target, "scripts"), { recursive: true });
  await mkdir(path.join(target, ".well-known"), { recursive: true });
  for (const relativePath of [
    ".well-known/assistant-guide-manifest.txt",
    ".well-known/assistant-guide.txt",
    "assistant-guide-manifest.txt",
    "assistant-guide.txt",
    "package.json",
    "scripts/validate-guidecheck.mjs",
    "search-audit.config.json",
  ]) {
    await cp(path.join(ROOT, relativePath), path.join(target, relativePath));
  }
}

test("GuideCheck release metadata fails when the package version advances alone", async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), "aiel-guide-version-"));
  try {
    await copyFixture(fixture);
    const packagePath = path.join(fixture, "package.json");
    const packageInfo = JSON.parse(await readFile(packagePath, "utf8"));
    packageInfo.version = "0.5.0";
    await writeFile(packagePath, `${JSON.stringify(packageInfo, null, 2)}\n`);

    const result = spawnSync(process.execPath, [path.join(fixture, "scripts", "validate-guidecheck.mjs")], {
      cwd: fixture,
      encoding: "utf8",
    });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /applies-to must be ai-incident-law 0\.5\.x/);
    assert.match(result.stderr, /releases\/tag\/v0\.5\.0/);
    assert.match(result.stderr, /blob\/v0\.5\.0\/CHANGELOG\.md/);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});
