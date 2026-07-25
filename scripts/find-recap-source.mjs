#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const SEARCH_ENDPOINT = "https://courtlistener.com/api/rest/v4/search/";
const STORAGE_ORIGIN = "https://storage.courtlistener.com/";
const USER_AGENT = "ai-incident-law-recap-resolver/0.1";
const TOKEN_ENV = "COURTLISTENER_TOKEN";

const STOP_TOKENS = new Set([
  "and",
  "association",
  "company",
  "corporation",
  "county",
  "court",
  "department",
  "district",
  "inc",
  "llc",
  "ltd",
  "of",
  "the",
  "united",
  "states",
  "versus",
]);

export class ResolverError extends Error {
  constructor(message, { exitCode = 1, details = null } = {}) {
    super(message);
    this.name = "ResolverError";
    this.exitCode = exitCode;
    this.details = details;
  }
}

export function normalizeText(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\bversus\b/g, " v ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function significantCaptionTokens(value) {
  return normalizeText(value)
    .split(" ")
    .filter(token => token.length > 2 && token !== "pro" && !STOP_TOKENS.has(token));
}

export function captionMatches(expected, actual) {
  const expectedTokens = [...new Set(significantCaptionTokens(expected))];
  const actualTokens = new Set(significantCaptionTokens(actual));
  if (!expectedTokens.length) return false;
  return expectedTokens.every(token => actualTokens.has(token));
}

export function docketSignature(value) {
  return normalizeText(value)
    .split(" ")
    .map(part => (/^[0-9]+$/.test(part) ? String(Number(part)) : part))
    .join("");
}

export function docketBaseSignature(value) {
  const parts = normalizeText(value).split(" ");
  while (
    parts.length >= 2
    && /^[a-z]{2,6}$/.test(parts.at(-1))
    && parts.slice(0, -1).some(part => /^[0-9]+$/.test(part))
  ) {
    parts.pop();
  }
  return parts
    .map(part => (/^[0-9]+$/.test(part) ? String(Number(part)) : part))
    .join("");
}

export function docketMatches(expected, actual) {
  const expectedForms = new Set([docketSignature(expected), docketBaseSignature(expected)]);
  const actualForms = new Set([docketSignature(actual), docketBaseSignature(actual)]);
  return [...expectedForms].some(form => actualForms.has(form));
}

function escapeQueryPhrase(value) {
  return String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

function escapeQueryTerm(value) {
  if (!/^[a-z0-9_-]+$/i.test(String(value))) {
    throw new ResolverError(`Unsafe CourtListener field value: ${value}`, { exitCode: 2 });
  }
  return String(value);
}

export function buildDocketQuery(criteria) {
  const court = escapeQueryTerm(criteria.court);
  if (criteria.docket) {
    const docket = String(criteria.docket).replace(/(-[0-9]+)(?:-[A-Za-z]{2,6})+$/, "$1");
    return `docketNumber:"${escapeQueryPhrase(docket)}" AND court_id:${court}`;
  }
  return `caseName:"${escapeQueryPhrase(criteria.caption)}" AND court_id:${court}`;
}

export function buildDocumentQuery(docket, criteria) {
  const clauses = [`docket_id:${Number(docket.docket_id)}`];
  if (criteria.date) clauses.push(`entry_date_filed:${escapeQueryTerm(criteria.date)}`);
  if (criteria.entry !== undefined) clauses.push(`entry_number:${Number(criteria.entry)}`);
  if (criteria.query) clauses.push(`(${criteria.query})`);
  return clauses.join(" AND ");
}

function chooseUnique(items, label) {
  if (items.length === 1) return items[0];
  if (!items.length) {
    throw new ResolverError(`No ${label} matched every supplied criterion.`, {
      exitCode: 2,
    });
  }
  throw new ResolverError(`Multiple ${label} matched. Add a docket number, entry number, date, or document query.`, {
    exitCode: 3,
    details: items,
  });
}

export function selectDocket(results, criteria) {
  const matches = results.filter(result => {
    if (result.court_id !== criteria.court) return false;
    if (!captionMatches(criteria.caption, result.caseName)) return false;
    if (criteria.docket && !docketMatches(criteria.docket, result.docketNumber)) return false;
    return Boolean(result.docket_id && result.pacer_case_id);
  });
  return chooseUnique(matches, "CourtListener docket");
}

export function selectDocument(results, docket, criteria) {
  const matches = results.filter(result => {
    if (Number(result.docket_id) !== Number(docket.docket_id)) return false;
    if (criteria.date && result.entry_date_filed !== criteria.date) return false;
    if (criteria.entry !== undefined && Number(result.entry_number) !== Number(criteria.entry)) return false;
    return result.is_available === true && typeof result.filepath_local === "string" && result.filepath_local.length > 0;
  });
  const primaryDocuments = matches.filter(result => result.attachment_number === null || result.attachment_number === undefined);
  if (primaryDocuments.length === 1) return primaryDocuments[0];
  return chooseUnique(matches, "available RECAP document");
}

export function assertStoragePath(document, docket) {
  const expectedPrefix = `recap/gov.uscourts.${docket.court_id}.${docket.pacer_case_id}/`;
  if (!document.filepath_local.startsWith(expectedPrefix)) {
    throw new ResolverError(
      `RECAP path does not use the docket's PACER case ID. Expected prefix ${expectedPrefix}`,
      { exitCode: 2, details: { filepath_local: document.filepath_local } },
    );
  }
  return new URL(document.filepath_local, STORAGE_ORIGIN).toString();
}

function dateForms(isoDate) {
  const match = String(isoDate || "").match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/);
  if (!match) return [];
  const [, year, month, day] = match;
  return [
    `${month}/${day}/${year}`,
    `${month}/${day}/${year.slice(2)}`,
    `${year}-${month}-${day}`,
  ];
}

export function verifyDocumentText(text, criteria, document) {
  const sample = String(text || "");
  const normalized = normalizeText(sample);
  const captionTokens = significantCaptionTokens(criteria.caption);
  const missingCaptionTokens = captionTokens.filter(token => !normalized.includes(token));
  const sampleSignature = docketSignature(sample);
  const docketFound = [docketSignature(criteria.docket), docketBaseSignature(criteria.docket)]
    .some(signature => sampleSignature.includes(signature));
  const dateFound = dateForms(criteria.date).some(form => sample.includes(form));
  const entryPattern = new RegExp(`\\b(?:document|doc\\.?|ecf\\s+no\\.?)\\s*[:#]*\\s*${Number(document.entry_number)}\\b`, "i");
  const entryFound = entryPattern.test(sample);

  const checks = {
    caption: missingCaptionTokens.length === 0,
    docket: docketFound,
    filed_date: dateFound,
    entry_number: entryFound,
  };
  const failed = Object.entries(checks).filter(([, passed]) => !passed).map(([name]) => name);
  if (failed.length) {
    throw new ResolverError(`PDF verification failed: ${failed.join(", ")}.`, {
      exitCode: 2,
      details: { checks, missing_caption_tokens: missingCaptionTokens },
    });
  }
  return checks;
}

export function requestHeaders(token = process.env[TOKEN_ENV]) {
  const headers = {
    Accept: "application/json",
    "User-Agent": USER_AGENT,
  };
  if (token) headers.Authorization = `Token ${token}`;
  return headers;
}

async function defaultRequestJson(url, headers) {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    const retryAfter = response.headers.get("retry-after");
    const suffix = retryAfter ? ` Retry after ${retryAfter} seconds.` : "";
    throw new ResolverError(`CourtListener returned HTTP ${response.status}.${suffix}`, {
      exitCode: response.status === 429 ? 4 : 1,
    });
  }
  return response.json();
}

async function defaultFetchPdf(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
  });
  if (!response.ok) {
    throw new ResolverError(`RECAP PDF returned HTTP ${response.status}.`, { exitCode: 2 });
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  if (!bytes.subarray(0, 1024).includes(Buffer.from("%PDF-"))) {
    throw new ResolverError("RECAP document did not contain a PDF signature.", { exitCode: 2 });
  }
  return bytes;
}

function extractFirstPageWithOcr(bytes) {
  const scratch = mkdtempSync(join(tmpdir(), "aiel-recap-ocr-"));
  try {
    const pdfPath = join(scratch, "document.pdf");
    const imagePrefix = join(scratch, "page");
    const imagePath = `${imagePrefix}.png`;
    writeFileSync(pdfPath, bytes);
    const render = spawnSync("pdftoppm", [
      "-f", "1",
      "-l", "1",
      "-singlefile",
      "-png",
      "-r", "180",
      pdfPath,
      imagePrefix,
    ], {
      encoding: "utf8",
      maxBuffer: 32 * 1024 * 1024,
    });
    if (render.error?.code === "ENOENT") {
      throw new ResolverError("pdftoppm is required to OCR image-only RECAP documents.", { exitCode: 1 });
    }
    if (render.status !== 0) {
      throw new ResolverError(`pdftoppm failed: ${String(render.stderr || "").trim()}`, { exitCode: 1 });
    }
    const ocr = spawnSync("tesseract", [imagePath, "stdout", "--psm", "6"], {
      encoding: "utf8",
      maxBuffer: 32 * 1024 * 1024,
    });
    if (ocr.error?.code === "ENOENT") {
      throw new ResolverError("tesseract is required to verify image-only RECAP documents.", { exitCode: 1 });
    }
    if (ocr.status !== 0) {
      throw new ResolverError(`tesseract failed: ${String(ocr.stderr || "").trim()}`, { exitCode: 1 });
    }
    return ocr.stdout;
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

function defaultExtractPdfText(bytes) {
  const result = spawnSync("pdftotext", ["-layout", "-", "-"], {
    input: bytes,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
  if (result.error?.code === "ENOENT") {
    throw new ResolverError("pdftotext is required for document-level verification.", { exitCode: 1 });
  }
  if (result.status !== 0) {
    throw new ResolverError(`pdftotext failed: ${String(result.stderr || "").trim()}`, { exitCode: 1 });
  }
  const substantiveText = normalizeText(result.stdout)
    .replace(/case [0-9]+ [0-9]+ cv [0-9]+ [a-z]+ document [0-9]+ filed [0-9]+ [0-9]+ [0-9]+ page [0-9]+ of [0-9]+/g, "")
    .trim();
  if (substantiveText.length >= 200) return result.stdout;
  return `${result.stdout}\n${extractFirstPageWithOcr(bytes)}`;
}

function searchUrl(type, query) {
  const url = new URL(SEARCH_ENDPOINT);
  url.search = new URLSearchParams({ type, q: query });
  return url;
}

export async function resolveRecapSource(criteria, adapters = {}) {
  validateCriteria(criteria);
  const token = adapters.token ?? process.env[TOKEN_ENV] ?? "";
  const headers = requestHeaders(token);
  const requestJson = adapters.requestJson || defaultRequestJson;
  const fetchPdf = adapters.fetchPdf || defaultFetchPdf;
  const extractPdfText = adapters.extractPdfText || defaultExtractPdfText;

  const docketResponse = await requestJson(searchUrl("r", buildDocketQuery(criteria)), headers);
  const docket = selectDocket(docketResponse.results || [], criteria);
  const documentResponse = await requestJson(searchUrl("rd", buildDocumentQuery(docket, criteria)), headers);
  const document = selectDocument(documentResponse.results || [], docket, criteria);
  const sourceUrl = assertStoragePath(document, docket);
  const pdfBytes = await fetchPdf(sourceUrl);
  const pdfText = await extractPdfText(pdfBytes);
  const checks = verifyDocumentText(pdfText, criteria, document);

  return {
    status: "verified",
    authentication: token ? "authenticated" : "anonymous",
    docket: {
      caption: docket.caseName,
      court: docket.court,
      court_id: docket.court_id,
      docket_number: docket.docketNumber,
      docket_id: docket.docket_id,
      pacer_case_id: docket.pacer_case_id,
    },
    document: {
      entry_number: document.entry_number,
      filed_date: document.entry_date_filed,
      description: document.description || document.short_description || "",
      filepath_local: document.filepath_local,
      source_url: sourceUrl,
    },
    checks,
  };
}

export function validateCriteria(criteria) {
  for (const field of ["caption", "court", "docket", "date"]) {
    if (!criteria[field]) {
      throw new ResolverError(`Missing required --${field}.`, { exitCode: 2 });
    }
  }
  if (!/^[a-z0-9_-]+$/i.test(criteria.court)) {
    throw new ResolverError("--court must be a CourtListener court ID such as pawd or nysd.", { exitCode: 2 });
  }
  if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(criteria.date)) {
    throw new ResolverError("--date must use YYYY-MM-DD.", { exitCode: 2 });
  }
  if (criteria.entry !== undefined && (!Number.isInteger(criteria.entry) || criteria.entry < 1)) {
    throw new ResolverError("--entry must be a positive integer.", { exitCode: 2 });
  }
}

export function parseArgs(argv) {
  const criteria = {};
  const valueFlags = new Map([
    ["--caption", "caption"],
    ["--court", "court"],
    ["--docket", "docket"],
    ["--date", "date"],
    ["--entry", "entry"],
    ["--query", "query"],
  ]);
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") return { help: true };
    const field = valueFlags.get(arg);
    if (!field) throw new ResolverError(`Unknown argument: ${arg}`, { exitCode: 2 });
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      throw new ResolverError(`Missing value for ${arg}.`, { exitCode: 2 });
    }
    criteria[field] = field === "entry" ? Number(value) : value;
    index += 1;
  }
  validateCriteria(criteria);
  return criteria;
}

export function helpText() {
  return `Usage:
  node scripts/find-recap-source.mjs \\
    --caption "Jakes v. Youngblood" \\
    --court pawd \\
    --docket "2:24-cv-01608" \\
    --date 2025-10-06 \\
    --entry 71

Required:
  --caption   Expected case caption
  --court     CourtListener court ID, such as pawd or nysd
  --docket    Expected docket number
  --date      Expected document filing date in YYYY-MM-DD

Optional:
  --entry     Expected docket entry number; strongly recommended
  --query     Additional trusted CourtListener query terms for disambiguation

Authentication:
  Set COURTLISTENER_TOKEN for authenticated requests. Anonymous requests are supported.

The command emits JSON only after the RECAP PDF itself matches the caption, docket,
filing date, entry number, and PACER-case-ID storage path.`;
}

async function main() {
  try {
    const criteria = parseArgs(process.argv.slice(2));
    if (criteria.help) {
      console.log(helpText());
      return;
    }
    console.log(JSON.stringify(await resolveRecapSource(criteria), null, 2));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(JSON.stringify({
      status: "error",
      error: message,
      details: error instanceof ResolverError ? error.details : null,
    }, null, 2));
    process.exitCode = error instanceof ResolverError ? error.exitCode : 1;
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  await main();
}
