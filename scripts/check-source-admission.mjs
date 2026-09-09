#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { LEGACY_SHA256, hash, validateAdmission } from "./lib/source-admission.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
function git(root, args) {
  return spawnSync("git", args, { cwd: root, encoding: "utf8" });
}

export function readPriorAdmissions(root, base, bootstrapCommit) {
  if (!/^(?:HEAD|[a-f0-9]{40})$/.test(base)) throw new Error("Admission base must be HEAD or an exact commit SHA");
  const commit = git(root, ["cat-file", "-e", base + "^{commit}"]);
  if (commit.status !== 0) throw new Error("Admission base does not resolve to a commit: " + base);
  const shown = git(root, ["show", base + ":data/admission/receipts.json"]);
  if (shown.status === 0) return JSON.parse(shown.stdout);

  const resolved = git(root, ["rev-parse", base]);
  if (resolved.status !== 0) throw new Error("Admission base could not be resolved: " + base);
  const candidate = resolved.stdout.trim();
  const ancestor = git(root, ["merge-base", "--is-ancestor", candidate, bootstrapCommit]);
  if (ancestor.status !== 0) throw new Error("Admission receipts unavailable at a post-bootstrap comparison base");
  return null;
}

export async function runSourceAdmission({ root = ROOT, base = process.env.SOURCE_ADMISSION_BASE || "HEAD" } = {}) {
  const legacyBytes = await readFile(path.join(root, "data", "admission", "legacy.json"));
  if (hash(legacyBytes) !== LEGACY_SHA256) throw new Error("Pinned legacy baseline bytes changed");
  const [data, legacy, admissions] = await Promise.all([
    readFile(path.join(root, "data", "data.json"), "utf8").then(JSON.parse),
    Promise.resolve(JSON.parse(legacyBytes)),
    readFile(path.join(root, "data", "admission", "receipts.json"), "utf8").then(JSON.parse)
  ]);
  if (legacy.record_count !== Object.keys(legacy.records || {}).length) {
    throw new Error("Legacy record_count does not match the frozen inventory");
  }
  const priorAdmissions = readPriorAdmissions(root, base, legacy.base_commit);
  const report = validateAdmission({ data, legacy, admissions, root, priorAdmissions });
  report.comparison_base = base;
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (args.some(arg => arg !== "--quiet")) throw new Error("Usage: check-source-admission.mjs [--quiet]");
    const quiet = args.includes("--quiet");
    const report = await runSourceAdmission();
    if (report.status === "passed") {
      if (!quiet) console.log(JSON.stringify(report, null, 2));
    } else {
      if (quiet) console.error(report.errors.join("\n"));
      else console.log(JSON.stringify(report, null, 2));
      process.exitCode = 1;
    }
  } catch (error) {
    console.error("source-admission: FAILED");
    console.error("- " + error.message);
    process.exitCode = 1;
  }
}
