#!/usr/bin/env node

import { existsSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const candidates = [
  process.env.OBLIGATION_FIRST_DIR,
  path.join(root, "..", "obligation-first"),
  path.join(root, "obligation-first")
].filter(Boolean);

const obligationFirstDir = candidates.find(dir =>
  existsSync(path.join(dir, "scripts", "validate-adopter-records.mjs"))
);

if (!obligationFirstDir) {
  console.error("Could not find obligation-first checkout. Set OBLIGATION_FIRST_DIR or check it out beside AI Incident Law.");
  process.exit(1);
}

const validator = path.join(obligationFirstDir, "scripts", "validate-adopter-records.mjs");
const recordsDir = path.join(root, "api", "v1", "of", "records");
const result = spawnSync(process.execPath, [validator, recordsDir], {
  cwd: root,
  stdio: "inherit"
});

process.exit(result.status || 0);
