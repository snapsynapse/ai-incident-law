#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { normalizeUrlField } from "./url-policy.mjs";

const SOURCE_PATH = new URL("../data/data.json", import.meta.url);
const failures = [];

function fail(message) {
  failures.push(message);
}

function expectClean(field, value, expected, label) {
  const result = normalizeUrlField(field, value, label);
  if (result.issues.length) {
    fail(`${label}: expected clean, got ${result.issues.join("; ")}`);
  }
  if (result.value !== expected) {
    fail(`${label}: expected "${expected}", got "${result.value}"`);
  }
}

function expectRejected(field, value, label) {
  const result = normalizeUrlField(field, value, label);
  if (!result.issues.length) {
    fail(`${label}: expected rejection for "${value}"`);
  }
}

expectClean(
  "public_record_link",
  "https://example.com/path",
  "https://example.com/path",
  "valid primary URL",
);
expectClean(
  "secondary_source_links",
  "https://example.com/a; https://agency.gov/b",
  "https://example.com/a; https://agency.gov/b",
  "valid semicolon URL list",
);
expectClean(
  "public_record_link",
  "http://example.com/path",
  "https://example.com/path",
  "http normalization",
);
expectClean(
  "public_record_link",
  "https://www.example.com/path",
  "https://example.com/path",
  "www normalization",
);
expectClean(
  "public_record_link",
  "HTTPS://WWW.EXAMPLE.COM/path",
  "https://example.com/path",
  "scheme and host case normalization",
);
expectClean(
  "public_record_link",
  "https://example.com:443/path",
  "https://example.com/path",
  "default port normalization",
);

expectRejected(
  "public_record_link",
  "https://example.com/path; javascript:alert(1); //evil.example/path",
  "appended text after primary URL",
);
expectRejected(
  "public_record_link",
  "https://example.com/a; https://example.org/b",
  "second URL in primary field",
);
expectRejected("public_record_link", "javascript:alert(1)", "javascript scheme");
expectRejected("public_record_link", "data:text/html,hello", "data scheme");
expectRejected("public_record_link", "//example.com/path", "protocol-relative URL");
expectRejected("public_record_link", "%2f%2fexample.com/path", "encoded protocol-relative URL");
expectRejected("public_record_link", "https://example.com\\path", "backslash URL");
expectRejected("public_record_link", "https://example.com/%5cpath", "encoded backslash URL");
expectRejected("public_record_link", "https://user:pass@example.com/path", "credential URL");
expectRejected("public_record_link", "https://example.com/a b", "whitespace URL");
expectRejected("public_record_link", "https://example.com/\u0001", "control character URL");
expectRejected("public_record_link", "https://example.com/%00", "encoded null byte URL");
expectRejected("public_record_link", "https://example.com/%0a", "encoded newline URL");
expectRejected("public_record_link", "https://example.com/%7f", "encoded delete URL");
expectRejected("public_record_link", "https://", "malformed absolute URL");
expectRejected("secondary_source_links", "https://example.com/a; ; https://example.org/b", "empty list token");
expectRejected(
  "secondary_source_links",
  "https://example.com/a; javascript:alert(1)",
  "bad URL inside source list",
);

const source = JSON.parse(await readFile(SOURCE_PATH, "utf8"));
for (const [datasetKey, bucket] of Object.entries(source.datasets || {})) {
  for (const [index, record] of (bucket.records || []).entries()) {
    const id = record.error_id || record.candidate_id || `${datasetKey}[${index}]`;
    for (const field of ["public_record_link", "secondary_source_links", "best_available_sources"]) {
      if (!record[field]) {
        continue;
      }

      const result = normalizeUrlField(field, record[field], `${datasetKey}.${id}.${field}`);
      if (result.issues.length) {
        fail(`${datasetKey}.${id}.${field}: ${result.issues.join("; ")}`);
      }
    }
  }
}

if (failures.length) {
  console.error(`test-url-policy: FAILED (${failures.length})`);
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("test-url-policy: OK");
