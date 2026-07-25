export const URL_FIELD_POLICIES = {
  public_record_link: "single",
  secondary_source_links: "list",
  best_available_sources: "list",
};

// Hosts whose bare domain does not serve, so stripping `www.` produces a dead link.
// This is the server-config carve-out to the bare-domain rule, not a style
// preference: for these hosts `www` and bare are genuinely different endpoints.
// Each entry records the observed failure and the date it was verified.
//   damiencharlotin.com — bare returns HTTP 400 (Django DisallowedHost) on every
//     path including the site root; only the www host answers. Verified 2026-07-24.
//   gasupreme.us — bare fails TLS with a certificate hostname mismatch; the
//     certificate covers the www host only. Verified 2026-07-24.
//   oscn.net — the Oklahoma State Courts Network SILENTLY fails on the bare host:
//     it answers HTTP 200 with a ~6 KB generic landing page instead of the
//     requested document, so a status-code-only link check passes while the
//     content is gone. The www host returns the real document. Verified
//     2026-07-24. This is the most dangerous shape of this bug — prefer content
//     assertions over status codes when adding hosts here.
//   opn.ca6.uscourts.gov — bare does not resolve at all (NXDOMAIN); the Sixth
//     Circuit serves opinions only from the www host. Verified 2026-07-24.
//   asbca.mil — bare does not resolve (NXDOMAIN); the www host serves the Board's
//     publication surface and returns a bot-filter response to scripted checks.
//     Verified 2026-07-25.
//   ca5.uscourts.gov — bare does not resolve (NXDOMAIN); the www host serves the
//     Fifth Circuit opinion PDF. Verified 2026-07-25.
// Re-check periodically: if a host starts serving its bare domain, drop it from this
// set so the corpus converges back on the bare-domain default.
export const WWW_REQUIRED_HOSTS = new Set([
  "asbca.mil",
  "ca5.uscourts.gov",
  "damiencharlotin.com",
  "gasupreme.us",
  "oscn.net",
  "opn.ca6.uscourts.gov",
]);

const CONTROL_CHAR_RE = /[\u0000-\u001f\u007f]/;
const WHITESPACE_RE = /\s/;
const RAW_DELIMITER_RE = /[<>"'`]/;
const ENCODED_BACKSLASH_RE = /%5c/i;
const ENCODED_CONTROL_CHAR_RE = /%(?:0[0-9a-f]|1[0-9a-f]|7f)/i;
const ENCODED_PROTOCOL_RELATIVE_RE = /^%2f%2f/i;

export function normalizeUrlToken(value, location = "URL") {
  const issues = [];
  const raw = String(value || "");
  const token = raw.trim();

  if (!token) {
    return { value: "", issues: [`${location}: URL token is empty`] };
  }

  if (CONTROL_CHAR_RE.test(token)) {
    issues.push(`${location}: URL contains a control character`);
  }

  if (WHITESPACE_RE.test(token)) {
    issues.push(`${location}: URL contains whitespace`);
  }

  if (RAW_DELIMITER_RE.test(token)) {
    issues.push(`${location}: URL contains unsafe delimiter characters`);
  }

  if (ENCODED_CONTROL_CHAR_RE.test(token)) {
    issues.push(`${location}: URL contains an encoded control character`);
  }

  if (token.includes("\\") || ENCODED_BACKSLASH_RE.test(token)) {
    issues.push(`${location}: URL must not contain backslashes`);
  }

  if (token.startsWith("//") || ENCODED_PROTOCOL_RELATIVE_RE.test(token)) {
    issues.push(`${location}: URL must include an explicit https:// scheme`);
  }

  if (!/^https?:\/\//i.test(token)) {
    issues.push(`${location}: URL must be an absolute http(s) URL`);
  }

  let parsed;
  try {
    parsed = new URL(token);
  } catch {
    issues.push(`${location}: invalid URL "${token}"`);
  }

  if (parsed) {
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      issues.push(`${location}: URL must use https`);
    }

    if (parsed.username || parsed.password) {
      issues.push(`${location}: URL must not include credentials`);
    }
  }

  if (issues.length || !parsed) {
    return { value: token, issues };
  }

  if (parsed.protocol === "http:") {
    parsed.protocol = "https:";
  }

  const hostname = parsed.hostname.toLowerCase();
  if (hostname.startsWith("www.")) {
    const bare = hostname.slice(4);
    // Keep `www` only where the bare host provably does not serve; see
    // WWW_REQUIRED_HOSTS above.
    if (!WWW_REQUIRED_HOSTS.has(bare)) {
      parsed.hostname = bare;
    }
  } else if (WWW_REQUIRED_HOSTS.has(hostname)) {
    // Repair links already written bare against a host that needs `www`.
    parsed.hostname = `www.${hostname}`;
  }

  return { value: parsed.toString(), issues: [] };
}

export function normalizeUrlField(field, value, location = field) {
  const policy = URL_FIELD_POLICIES[field];
  if (!policy) {
    return { value, issues: [`${location}: unsupported URL field "${field}"`] };
  }

  if (value === undefined || value === null || value === "") {
    return { value: "", issues: [] };
  }

  const raw = String(value);
  if (policy === "single") {
    const issues = [];
    if (raw.includes(";")) {
      issues.push(`${location}: public_record_link must contain exactly one URL`);
    }
    const normalized = normalizeUrlToken(raw, location);
    return { value: normalized.value, issues: issues.concat(normalized.issues) };
  }

  const parts = raw.split(";");
  const normalizedUrls = [];
  const issues = [];

  parts.forEach((part, index) => {
    const trimmed = part.trim();
    if (!trimmed) {
      issues.push(`${location}[${index + 1}]: URL token is empty`);
      return;
    }

    const normalized = normalizeUrlToken(trimmed, `${location}[${index + 1}]`);
    normalizedUrls.push(normalized.value);
    issues.push(...normalized.issues);
  });

  return { value: normalizedUrls.join("; "), issues };
}

export function normalizeUrlFields(record, location) {
  const next = { ...record };
  const issues = [];

  for (const field of Object.keys(URL_FIELD_POLICIES)) {
    if (!next[field]) {
      continue;
    }

    const normalized = normalizeUrlField(field, next[field], `${location}.${field}`);
    next[field] = normalized.value;
    issues.push(...normalized.issues);
  }

  return { record: next, issues };
}
