export const URL_FIELD_POLICIES = {
  public_record_link: "single",
  secondary_source_links: "list",
  best_available_sources: "list",
};

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

  if (parsed.hostname.toLowerCase().startsWith("www.")) {
    parsed.hostname = parsed.hostname.slice(4);
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
