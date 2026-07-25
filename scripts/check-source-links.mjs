#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { WWW_REQUIRED_HOSTS } from "./url-policy.mjs";

const SOURCE_PATH = new URL("../data/data.json", import.meta.url);
// These hosts are known to return 403/429 to automated checks while serving the
// same URL in an interactive browser. Keep this narrow and evidence-based.
const BOT_FILTERED_HOSTS = new Set([
  "asbca.mil",
  "canlii.org",
  "courtlistener.com",
  "gao.gov",
  "law.justia.com",
  "michigan.gov",
  "nycourts.gov",
]);
const USER_AGENT = "AI-Incident-Law-Source-Checker/1.0 (+https://aiincidentlaw.org/)";
const MAX_CONCURRENCY = 4;
const TIMEOUT_MS = 20_000;

function bareHost(hostname) {
  return hostname.toLowerCase().replace(/^www\./, "");
}

function isPdf(bytes) {
  // The Seventh Circuit prepends a short docket metadata line before %PDF-.
  // Accept that valid wrapper while still rejecting HTML soft errors.
  return Buffer.from(bytes.subarray(0, Math.min(bytes.length, 1024))).includes(Buffer.from("%PDF-"));
}

export function assessSourceResponse(urlString, status, contentType, bytes) {
  const url = new URL(urlString);
  const host = bareHost(url.hostname);

  if (status < 200 || status >= 400) {
    if (BOT_FILTERED_HOSTS.has(host) && [403, 429].includes(status)) {
      return { ok: true, warning: `bot-filtered host returned HTTP ${status}` };
    }
    return { ok: false, reason: `HTTP ${status}` };
  }

  if (!bytes.length) {
    return { ok: false, reason: "empty response body" };
  }

  const expectsPdf = url.pathname.toLowerCase().endsWith(".pdf") ||
    String(contentType || "").toLowerCase().includes("application/pdf");
  if (expectsPdf && !isPdf(bytes)) {
    return { ok: false, reason: "expected PDF content but payload lacks %PDF- signature" };
  }

  if (WWW_REQUIRED_HOSTS.has(host)) {
    if (host === "oscn.net") {
      const text = Buffer.from(bytes).toString("utf8");
      if (bytes.length < 10_000 || !/Oklahoma/i.test(text) || !/SUPREME COURT/i.test(text)) {
        return { ok: false, reason: "OSCN payload does not contain the expected opinion content" };
      }
    } else if (url.pathname.toLowerCase().endsWith(".pdf") && !isPdf(bytes)) {
      return { ok: false, reason: `${host} payload is not the expected PDF` };
    }
  }

  return { ok: true };
}

async function fetchOnce(url) {
  const response = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/pdf,text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
    },
  });
  const bytes = new Uint8Array(await response.arrayBuffer());
  return assessSourceResponse(url, response.status, response.headers.get("content-type"), bytes);
}

async function checkSource({ id, url }) {
  let lastError;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const result = await fetchOnce(url);
      if (result.ok || attempt === 2 || !/^HTTP (?:429|5\d\d)$/.test(result.reason || "")) {
        return { id, url, ...result };
      }
      lastError = result.reason;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      if (attempt === 2) break;
    }
  }
  return { id, url, ok: false, reason: lastError || "request failed" };
}

async function run() {
  const source = JSON.parse(await readFile(SOURCE_PATH, "utf8"));
  const links = [];
  const seen = new Set();

  for (const [datasetKey, bucket] of Object.entries(source.datasets || {})) {
    for (const [index, record] of (bucket.records || []).entries()) {
      if (!record.public_record_link || seen.has(record.public_record_link)) continue;
      seen.add(record.public_record_link);
      links.push({
        id: record.error_id || record.candidate_id || `${datasetKey}[${index}]`,
        url: record.public_record_link,
      });
    }
  }

  const results = [];
  let cursor = 0;
  async function worker() {
    while (cursor < links.length) {
      const link = links[cursor];
      cursor += 1;
      results.push(await checkSource(link));
    }
  }

  await Promise.all(Array.from({ length: Math.min(MAX_CONCURRENCY, links.length) }, () => worker()));
  results.sort((a, b) => a.id.localeCompare(b.id));

  const failures = results.filter(result => !result.ok);
  const warnings = results.filter(result => result.warning);
  for (const warning of warnings) {
    console.warn(`source-link warning: ${warning.id}: ${warning.warning}: ${warning.url}`);
  }
  for (const failure of failures) {
    console.error(`source-link failure: ${failure.id}: ${failure.reason}: ${failure.url}`);
  }

  if (failures.length) {
    console.error(`Source link check failed: ${failures.length}/${results.length} links.`);
    process.exit(1);
  }
  console.log(`Checked ${results.length} source links (${warnings.length} allowed bot-filtered responses).`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  await run();
}
