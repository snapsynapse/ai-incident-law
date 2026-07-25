#!/usr/bin/env node
/**
 * Assert that the obligation-first checkout in use satisfies the version range
 * declared in this repo's naming profile (its `appliesTo` field).
 *
 * The comparison rule used to live here. It now lives in obligation-first
 * (scripts/check-adopter-of-version.mjs) so EveryAILaw, PubLedge, and this repo
 * share one implementation instead of three copies. This wrapper only locates
 * the checkout and points the shared script at our profile.
 *
 * Exits 0 when compatible, or when no obligation-first checkout is found
 * (CI always has one; a local skip is safe). Exits 1 on a version mismatch.
 */

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

const CHECKER = path.join("scripts", "check-adopter-of-version.mjs");
const obligationFirstDir = candidates.find((dir) => existsSync(path.join(dir, CHECKER)));

if (!obligationFirstDir) {
  console.log("check-of-version: no obligation-first checkout found; skipping.");
  process.exit(0);
}

const profilePath = path.join(root, ".well-known", "obligation-first-naming-profile.jsonld");
const result = spawnSync(
  process.execPath,
  [path.join(obligationFirstDir, CHECKER), profilePath],
  { cwd: root, stdio: "inherit" },
);

process.exit(result.status || 0);
