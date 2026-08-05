#!/usr/bin/env node
import { existsSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const candidates = [
  process.env.OBLIGATION_FIRST_DIR,
  path.join(root, "..", "obligation-first"),
  path.join(root, "obligation-first"),
].filter(Boolean);
const checker = path.join("scripts", "check-adopter-fingerprint.mjs");
const obligationFirstDir = candidates.find((dir) => existsSync(path.join(dir, checker)));

if (!obligationFirstDir) {
  if (process.env.CHECK_OF_REQUIRED === "1") {
    console.error(`check-of-fingerprint: no Obligation-First checkout providing ${checker} was found.`);
    console.error(`  searched: ${candidates.join(", ")}`);
    process.exit(1);
  }
  console.log("check-of-fingerprint: no Obligation-First checkout found; skipping.");
  process.exit(0);
}

const args = [
  path.join(obligationFirstDir, checker),
  "--records", path.join(root, "api", "v1", "of", "records"),
  "--profile", path.join(root, ".well-known", "obligation-first-naming-profile.jsonld"),
  "--expected", path.join(root, "tests", "fixtures", "of-contract-fingerprint.json"),
];
if (process.argv.includes("--write")) args.push("--write");
const result = spawnSync(process.execPath, args, { cwd: root, stdio: "inherit" });
process.exit(result.status || 0);
