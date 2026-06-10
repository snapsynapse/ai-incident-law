#!/usr/bin/env node
/**
 * Assert that the obligation-first checkout in use satisfies the version
 * range declared in the local naming profile (appliesTo field).
 *
 * Exits 0 when the version is compatible or no OF checkout is found (CI
 * always has one; local skip is safe). Exits 1 on a version mismatch --
 * this means the naming profile needs updating or the OF checkout is wrong.
 */

import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const profilePath = path.join(root, ".well-known", "obligation-first-naming-profile.jsonld");
const profile = JSON.parse(await readFile(profilePath, "utf8"));

const appliesTo = profile.appliesTo;
const rangeMatch = appliesTo?.match(/obligation-first\s+(\d+)\.(\d+)\.x/);
if (!rangeMatch) {
  console.error(`check-of-version: cannot parse appliesTo: "${appliesTo}"`);
  process.exit(1);
}
const [, expectedMajor, expectedMinor] = rangeMatch;

const candidates = [
  process.env.OBLIGATION_FIRST_DIR,
  path.join(root, "..", "obligation-first"),
  path.join(root, "obligation-first"),
].filter(Boolean);

const ofDir = candidates.find((d) => existsSync(path.join(d, "package.json")));

if (!ofDir) {
  console.log("check-of-version: no obligation-first checkout found; skipping.");
  process.exit(0);
}

const pkg = JSON.parse(await readFile(path.join(ofDir, "package.json"), "utf8"));
const actual = pkg.version;
const versionMatch = actual?.match(/^(\d+)\.(\d+)\./);
if (!versionMatch) {
  console.error(`check-of-version: cannot parse OF version: "${actual}"`);
  process.exit(1);
}
const [, actualMajor, actualMinor] = versionMatch;

if (actualMajor !== expectedMajor || actualMinor !== expectedMinor) {
  console.error(
    `check-of-version: MISMATCH — profile expects ${appliesTo} but OF checkout is ${actual}`,
  );
  console.error(
    `  Update .well-known/obligation-first-naming-profile.jsonld appliesTo, or use the correct OF checkout.`,
  );
  process.exit(1);
}

console.log(`check-of-version: OK — ${actual} satisfies ${appliesTo}`);
