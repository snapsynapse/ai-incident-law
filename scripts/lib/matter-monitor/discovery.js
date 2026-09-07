'use strict';

const { visibleText } = require('./text');

const streams = [
  {
    id: 'ftc-press-releases',
    kind: 'discovery',
    url: 'https://ftc.gov/news-events/news/press-releases',
    expectedHost: 'ftc.gov',
    label: 'FTC press releases',
    keywords: ['artificial intelligence', 'algorithmic', 'facial recognition', 'automated decision']
  },
  {
    id: 'doj-opa-press-releases',
    kind: 'discovery',
    url: 'https://justice.gov/opa/pr',
    expectedHost: 'justice.gov',
    label: 'DOJ Office of Public Affairs press releases',
    keywords: ['artificial intelligence', 'algorithmic', 'facial recognition', 'automated decision']
  }
];

const streamById = new Map(streams.map(stream => [stream.id, stream]));
const KEYWORD_PATTERN = /\bartificial[\s-]+intelligence\b|\balgorithmic\b|\bfacial[\s-]+recognition\b|\bautomated[\s-]+decision\b/i;

function pageBody(html) {
  const main = /<main\b[^>]*>([\s\S]*?)<\/main\s*>/i.exec(html);
  return main ? main[1] : html;
}

function anchors(html) {
  const result = [];
  const content = html.replace(/<(script|style|nav|footer|noscript)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, ' ');
  const pattern = /<a\b([^>]*)>([\s\S]*?)<\/a\s*>/gi;
  let match;
  while ((match = pattern.exec(content))) {
    const hidden = /\bhidden\b|aria-hidden\s*=\s*["']true["']/i.test(match[1]);
    if (hidden) continue;
    const href = /\bhref\s*=\s*(?:["']([^"']*)["']|([^\s"'=<>`]+))/i.exec(match[1]);
    const title = visibleText(match[2]).replace(/\s+/g, ' ').trim();
    if (href && title) result.push({ href: href[1] ?? href[2], title });
  }
  return result;
}

function canonicalReleaseUrl(href, source) {
  let candidate;
  try {
    candidate = new URL(href, source.url);
  } catch {
    return null;
  }
  const host = candidate.hostname.replace(/^www\./i, '').toLowerCase();
  if (candidate.protocol !== 'https:' || host !== source.expectedHost || candidate.username || candidate.password || candidate.port) return null;
  const path = candidate.pathname.replace(/\/$/, '');
  const isFtc = source.id === 'ftc-press-releases' && /^\/news-events\/news\/press-releases\/\d{4}\/\d{2}\/[a-z0-9][a-z0-9-]*$/i.test(path);
  const isDoj = source.id === 'doj-opa-press-releases' && /^\/opa\/pr\/[a-z0-9][a-z0-9-]*$/i.test(path);
  return isFtc || isDoj ? `https://${source.expectedHost}${path}` : null;
}

function recognizedPage(text, source) {
  if (source.id === 'ftc-press-releases') return /(?:federal trade commission|\bftc\b)/i.test(text) && /press releases/i.test(text);
  if (source.id === 'doj-opa-press-releases') return /(?:department of justice|\bdoj\b)/i.test(text) && /(?:office of public affairs|press releases)/i.test(text);
  return false;
}

function parseIndex(body, { source, url } = {}) {
  const configured = source && streamById.get(source.id);
  if (!configured || source.kind !== 'discovery' || source.url !== configured.url || source.expectedHost !== configured.expectedHost) {
    return { supported: false, items: [], scope: { boundedFirstPage: true, complete: false }, reason: 'Unrecognized discovery stream configuration.' };
  }
  if (!body || typeof body !== 'string') {
    return { supported: false, items: [], scope: { boundedFirstPage: true, complete: false }, reason: 'Empty index response.' };
  }

  const text = visibleText(pageBody(body));
  if (/\b(?:access denied|captcha|verify you are human|unusual traffic|temporarily blocked)\b/i.test(text)
    || /(?:\bbm-verify\b|doj-interstitial\.html|\/_sec\/verify)/i.test(body)) {
    return { supported: false, items: [], scope: { boundedFirstPage: true, complete: false }, reason: 'Blocked index response.' };
  }
  if (!recognizedPage(text, source)) {
    return { supported: false, items: [], scope: { boundedFirstPage: true, complete: false }, reason: 'Unrecognized official press-release index.' };
  }

  const byUrl = new Map();
  for (const anchor of anchors(pageBody(body))) {
    const releaseUrl = canonicalReleaseUrl(anchor.href, source);
    if (!releaseUrl) continue;
    const previous = byUrl.get(releaseUrl);
    if (previous && previous !== anchor.title) {
      return { supported: false, items: [], scope: { boundedFirstPage: true, complete: false }, reason: 'Conflicting titles for the same official release URL.' };
    }
    byUrl.set(releaseUrl, anchor.title);
  }
  if (!byUrl.size) {
    return { supported: false, items: [], scope: { boundedFirstPage: true, complete: false }, reason: 'Recognized index has no nonempty official release links.' };
  }

  const all = [...byUrl.entries()].map(([itemUrl, title]) => ({ id: itemUrl, url: itemUrl, title }));
  const complete = all.length <= 40;
  const inspected = all.slice(0, 40);
  const filtered = inspected.filter(item => KEYWORD_PATTERN.test(item.title));
  const items = filtered.slice(0, 40);
  return {
    supported: true,
    items,
    scope: { boundedFirstPage: true, complete },
    ...(items.length === 0 ? { emptyEvidence: { kind: 'no-keyword-matches', inspectedOfficialReleaseItems: inspected.length } } : {})
  };
}

module.exports = { streams, parseIndex };
