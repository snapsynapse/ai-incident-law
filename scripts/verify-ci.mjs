#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const gates = [
  [npm, ["run", "build"]],
  [npm, ["run", "check"]],
  ["git", ["diff", "--check"]],
  ["git", ["diff", "--exit-code"]],
];

for (const [command, args] of gates) {
  const result = spawnSync(command, args, { stdio: "inherit", env: process.env });
  if (result.error) {
    console.error(`verify-ci: ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status || 1);
}

console.log("AI Incident Law canonical CI verification passed.");
