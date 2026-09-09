#!/usr/bin/env node
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PROFILE_PATH = "/.well-known/obligation-first-naming-profile.jsonld";

export function validateNamingProfileManifest(profileBytes, manifestText) {
  const profile = JSON.parse(profileBytes.toString("utf8"));
  assert.equal(profile.adopter, "https://aiincidentlaw.org/", "profile adopter must be canonical");
  assert.match(profile.appliesTo, /^obligation-first .+$/, "profile appliesTo must name Obligation-First");
  const fields = {};
  for (const line of manifestText.trim().split(/\r?\n/)) {
    const match = line.match(/^([a-z0-9-]+): (.+)$/);
    assert.ok(match, `invalid manifest line: ${line}`);
    assert.ok(!Object.hasOwn(fields, match[1]), `duplicate manifest field: ${match[1]}`);
    fields[match[1]] = match[2];
  }
  const expected = {
    "profile-path": PROFILE_PATH,
    "profile-version": profile.profileVersion,
    "profile-sha256": createHash("sha256").update(profileBytes).digest("hex"),
    "profile-bytes": String(profileBytes.length),
    adopter: profile.adopter,
    spec: "obligation-first",
    "spec-version-range": profile.appliesTo.slice("obligation-first ".length),
    "canonical-url": new URL(PROFILE_PATH, profile.adopter).href,
    "repository-url": "https://github.com/snapsynapse/ai-incident-law",
  };
  assert.deepEqual(Object.keys(fields).sort(), [...Object.keys(expected), "released-at"].sort(), "manifest field inventory differs");
  for (const [key, value] of Object.entries(expected)) {
    assert.equal(fields[key], value, `${key} differs from the canonical profile`);
  }
  assert.match(fields["released-at"], /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/, "released-at must be a UTC timestamp");
  const publishedAt = new Date(fields["released-at"]);
  assert.ok(Number.isFinite(publishedAt.getTime()), "released-at must be a real date");
  assert.equal(publishedAt.toISOString(), fields["released-at"].replace(/Z$/, ".000Z"), "released-at must be a real calendar date");
  // Publication provenance needs a release receipt; profile bytes cannot establish it.
  return fields;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    validateNamingProfileManifest(
      readFileSync(path.join(ROOT, PROFILE_PATH)),
      readFileSync(path.join(ROOT, ".well-known/obligation-first-naming-profile-manifest.txt"), "utf8")
    );
    console.log("Naming-profile manifest matches canonical profile bytes and metadata.");
  } catch (error) {
    console.error(`check-naming-profile-manifest: ${error.message}`);
    process.exitCode = 1;
  }
}
