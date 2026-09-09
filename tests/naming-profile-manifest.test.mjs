import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateNamingProfileManifest } from "../scripts/check-naming-profile-manifest.mjs";

const profile = readFileSync(new URL("../.well-known/obligation-first-naming-profile.jsonld", import.meta.url));
const manifest = readFileSync(new URL("../.well-known/obligation-first-naming-profile-manifest.txt", import.meta.url), "utf8");

function replaceField(key, value) {
  return manifest.replace(new RegExp(`^${key}: .+$`, "m"), `${key}: ${value}`);
}

test("current naming-profile manifest matches its exact canonical bytes", () => {
  assert.doesNotThrow(() => validateNamingProfileManifest(profile, manifest));
});

for (const [key, value] of Object.entries({
  "profile-version": "1.1.0",
  "spec-version-range": ">=0.4.0, <0.6.0",
  "profile-sha256": "0".repeat(64),
  "profile-bytes": "1477",
  "profile-path": "/wrong.jsonld",
  adopter: "https://example.org/",
  spec: "wrong-spec",
  "canonical-url": "https://example.org/profile.jsonld",
  "repository-url": "https://github.com/example/wrong",
})) {
  test(`naming-profile manifest rejects independent ${key} drift`, () => {
    assert.throws(() => validateNamingProfileManifest(profile, replaceField(key, value)), new RegExp(key));
  });
}

test("even a whitespace-only profile change invalidates the exact byte manifest", () => {
  assert.throws(() => validateNamingProfileManifest(Buffer.concat([profile, Buffer.from("\n")]), manifest), /profile-sha256/);
});

test("manifest rejects missing, duplicate, and unrecognized fields", () => {
  for (const changed of [
    manifest.replace(/^profile-version: .+\n/m, ""),
    `${manifest}profile-version: 2.0.0\n`,
    `${manifest}extra: value\n`,
  ]) assert.throws(() => validateNamingProfileManifest(profile, changed), /field/);
});

test("release timestamps require an actual UTC calendar date", () => {
  for (const date of ["not-a-date", "2026-02-30T00:00:00Z", "2026-09-07T15:28:05+00:00"]) {
    assert.throws(() => validateNamingProfileManifest(profile, replaceField("released-at", date)), /released-at/);
  }
});
