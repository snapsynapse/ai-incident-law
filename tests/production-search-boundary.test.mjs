import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const origin = 'https://aiincidentlaw.org/';

function runScenario(mode) {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'ail-production-search-'));
  try {
    const config = path.join(dir, 'config.json');
    const preload = path.join(dir, 'fetch.mjs');
    const log = path.join(dir, 'requests.jsonl');
    writeFileSync(config, JSON.stringify({
      contractVersion: 4, canonicalOrigin: origin, outputDir: '.',
      requiredFiles: [], expectedNotFoundPaths: [], sitemaps: ['sitemap.xml'],
      compareRepositorySitemaps: false, requireJsonLd: false
    }));
    writeFileSync(preload, `
      import { appendFileSync } from 'node:fs';
      globalThis.fetch = async (url, options) => {
        appendFileSync(process.env.REQUEST_LOG, JSON.stringify({ url, redirect: options.redirect }) + '\\n');
        const mode = process.env.TEST_MODE;
        const page = 'https://aiincidentlaw.org/page';
        let body = '', status = 200, headers = { 'content-type': 'application/xml' };
        if (url.endsWith('/sitemap.xml') || url.endsWith('/real-sitemap.xml')) {
          if (mode === 'redirect') { status = 302; headers.location = 'http://127.0.0.1/private'; }
          else if (mode === 'approved-redirect' && url.endsWith('/sitemap.xml') && !url.endsWith('/real-sitemap.xml')) {
            status = 302; headers.location = '/real-sitemap.xml';
          }
          else if (mode === 'oversize') body = 'x'.repeat(9 * 1024 * 1024);
          else body = '<urlset><url><loc>' + (mode === 'forbidden' ? 'http://127.0.0.1/private' : page) + '</loc></url></urlset>';
        } else if (url === page) {
          headers = { 'content-type': 'text/html' };
          body = '<link rel="canonical" href="' + page + '">';
        } else throw Error('Unexpected request: ' + url);
        const response = new Response(body, { status, headers });
        Object.defineProperty(response, 'url', { value: url });
        return response;
      };
    `);
    const result = spawnSync(process.execPath, ['--import', preload, path.join(root, 'scripts', 'check-production-search.mjs'), `--config=${config}`], {
      cwd: root, encoding: 'utf8', env: { ...process.env, REQUEST_LOG: log, TEST_MODE: mode }
    });
    const requests = readFileSync(log, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
    return { result, requests };
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

test('production search never fetches noncanonical sitemap locations', () => {
  const { result, requests } = runScenario('forbidden');
  assert.notEqual(result.status, 0, result.stdout);
  assert.deepEqual(requests.map(item => item.url), [`${origin}sitemap.xml`]);
});

test('production search checks each redirect before the next request', () => {
  const { result, requests } = runScenario('redirect');
  assert.notEqual(result.status, 0, result.stdout);
  assert.deepEqual(requests.map(item => item.url), [`${origin}sitemap.xml`]);
  assert.equal(requests[0].redirect, 'manual');
});

test('production search stops oversized sitemap bodies', () => {
  const { result, requests } = runScenario('oversize');
  assert.notEqual(result.status, 0, result.stdout);
  assert.deepEqual(requests.map(item => item.url), [`${origin}sitemap.xml`]);
  assert.match(result.stderr, /exceeds .* bytes/);
});

test('production search still checks an approved page', () => {
  const { result, requests } = runScenario('valid');
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.deepEqual(requests.map(item => item.url), [`${origin}sitemap.xml`, `${origin}page`]);
});

test('production search follows an approved same-origin redirect', () => {
  const { result, requests } = runScenario('approved-redirect');
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.deepEqual(requests.map(item => item.url), [
    `${origin}sitemap.xml`, `${origin}real-sitemap.xml`, `${origin}page`
  ]);
  assert.ok(requests.every(item => item.redirect === 'manual'));
});
