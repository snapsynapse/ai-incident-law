import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { streams, parseIndex } = require('../scripts/lib/matter-monitor/discovery.js');
const source = id => streams.find(stream => stream.id === id);

function page(identity, links) {
  return `<html><body><nav><a href="https://ftc.gov/news-events/news/press-releases/2026/01/artificial-intelligence-nav">Artificial intelligence nav</a></nav><main><h1>${identity}</h1>${links}</main><footer>Artificial intelligence footer</footer></body></html>`;
}

test('declares exactly two fixed, official discovery streams', () => {
  assert.deepEqual(streams.map(({ id, kind, url, expectedHost }) => ({ id, kind, url, expectedHost })), [
    { id: 'ftc-press-releases', kind: 'discovery', url: 'https://ftc.gov/news-events/news/press-releases', expectedHost: 'ftc.gov' },
    { id: 'doj-opa-press-releases', kind: 'discovery', url: 'https://justice.gov/opa/pr', expectedHost: 'justice.gov' }
  ]);
});

test('filters FTC releases from main content, normalizes www, and deduplicates repeats', () => {
  const result = parseIndex(page('Federal Trade Commission Press Releases', `
    <article><a href="https://www.ftc.gov/news-events/news/press-releases/2026/09/agency-takes-action-on-facial-recognition">Agency takes action on facial recognition</a></article>
    <article><a href="/news-events/news/press-releases/2026/09/agency-takes-action-on-facial-recognition">Agency takes action on facial recognition</a></article>
    <article><a href="/news-events/news/press-releases/2026/09/consumer-privacy">Consumer privacy update</a></article>
  `), { source: source('ftc-press-releases') });

  assert.equal(result.supported, true);
  assert.deepEqual(result.items, [{
    id: 'https://ftc.gov/news-events/news/press-releases/2026/09/agency-takes-action-on-facial-recognition',
    url: 'https://ftc.gov/news-events/news/press-releases/2026/09/agency-takes-action-on-facial-recognition',
    title: 'Agency takes action on facial recognition'
  }]);
  assert.deepEqual(result.scope, { boundedFirstPage: true, complete: true });
});

test('emits a valid local-filter-zero receipt only after finding official FTC releases', () => {
  const result = parseIndex(page('Federal Trade Commission Press Releases', `
    <article><a href="/news-events/news/press-releases/2026/09/consumer-privacy">Consumer privacy update</a></article>
  `), { source: source('ftc-press-releases') });

  assert.equal(result.supported, true);
  assert.deepEqual(result.items, []);
  assert.deepEqual(result.emptyEvidence, { kind: 'no-keyword-matches', inspectedOfficialReleaseItems: 1 });
});

test('rejects a recognized FTC page with no eligible official release items', () => {
  const result = parseIndex(page('Federal Trade Commission Press Releases', '<a href="/news-events/consumer-advice">Consumer advice</a>'), {
    source: source('ftc-press-releases')
  });

  assert.equal(result.supported, false);
  assert.match(result.reason, /no nonempty official release links/i);
});

test('fails closed when a release URL has conflicting title text', () => {
  const result = parseIndex(page('Federal Trade Commission Press Releases', `
    <a href="/news-events/news/press-releases/2026/09/algorithmic-screening">Algorithmic screening action</a>
    <a href="/news-events/news/press-releases/2026/09/algorithmic-screening">Different title</a>
  `), { source: source('ftc-press-releases') });

  assert.equal(result.supported, false);
  assert.match(result.reason, /conflicting titles/i);
});

test('accepts only DOJ OPA release paths and flags the 40-item bound', () => {
  const links = Array.from({ length: 41 }, (_, index) => `<a href="/opa/pr/automated-decision-${index}">Automated decision release ${index}</a>`).join('');
  const body = `<main><h1>Press Releases</h1><p>U.S. Department of Justice Office of Public Affairs</p>${links}<a href="/opa/media/999999">Automated decision media page</a></main>`;
  const result = parseIndex(body, { source: source('doj-opa-press-releases') });

  assert.equal(result.supported, true);
  assert.equal(result.items.length, 40);
  assert.deepEqual(result.scope, { boundedFirstPage: true, complete: false });
  assert.ok(result.items.every(item => item.url.startsWith('https://justice.gov/opa/pr/')));
});

test('treats blocked or malformed pages as unsupported rather than no-results evidence', () => {
  const blocked = parseIndex('<main><h1>Federal Trade Commission Press Releases</h1><p>Access denied. Verify you are human.</p></main>', {
    source: source('ftc-press-releases')
  });
  const malformed = parseIndex('<main><h1>Federal Trade Commission Press Releases</h1></main>', {
    source: source('ftc-press-releases')
  });

  assert.equal(blocked.supported, false);
  assert.match(blocked.reason, /blocked/i);
  assert.equal(malformed.supported, false);
  assert.match(malformed.reason, /no nonempty official release links/i);
});

test('recognizes the DOJ Bot Manager interstitial as blocked, not an empty index', () => {
  const result = parseIndex(`
    <html><head><meta http-equiv="refresh" content="5; URL='/news/press-releases?bm-verify=token'"></head>
    <body><iframe src="https://www.justice.gov/apology_objects/interstitial/doj-interstitial.html"></iframe>
    <script>xhr.open("POST", "/_sec/verify?provider=interstitial", false)</script></body></html>
  `, { source: source('doj-opa-press-releases') });

  assert.equal(result.supported, false);
  assert.deepEqual(result.items, []);
  assert.match(result.reason, /blocked/i);
  assert.equal(result.emptyEvidence, undefined);
});
