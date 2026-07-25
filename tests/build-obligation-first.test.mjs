import assert from "node:assert/strict";
import { cp, mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);

test("build:of removes stale companion artifacts", async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), "aiel-build-of-"));
  await cp(path.join(ROOT, "scripts"), path.join(fixture, "scripts"), { recursive: true });
  await cp(path.join(ROOT, "data"), path.join(fixture, "data"), { recursive: true });

  const staleDir = path.join(fixture, "determination");
  const staleFile = path.join(staleDir, "aiel-2026-039-determination.json");
  await mkdir(staleDir, { recursive: true });
  await writeFile(staleFile, "{}\n", "utf8");

  const result = spawnSync(process.execPath, [path.join(fixture, "scripts", "build-obligation-first.mjs")], {
    cwd: fixture,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  await assert.rejects(readFile(staleFile, "utf8"), { code: "ENOENT" });
});
