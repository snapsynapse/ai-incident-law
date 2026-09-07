import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { parseArgs, run } from '../scripts/observe-matters.mjs';

const require = createRequire(import.meta.url);
const core = require('../scripts/lib/freshness-contract.js');
const { collect } = require('../scripts/lib/matter-monitor/collector.js');

const NOW = '2026-09-06T12:00:00.000Z';

function matterSources({ mirror = false, htmlInsteadOfPdf = false } = {}) {
  return [
    { id: 'AIEL-TEST-001', kind: 'matter', url: 'https://courtlistener.com/docket/aiel-test-001', expectedHost: 'courtlistener.com', role: 'docket_metadata', identity: ['matter', 'one'], qualification: 'Docket metadata only; AI attribution and outcome remain unknown.', baselineStatus: 'filed', attribution: 'unknown' },
    { id: 'AIEL-TEST-002', kind: 'matter', url: 'https://aclu.org/cases/aiel-test-002', expectedHost: 'aclu.org', role: mirror ? 'secondary_mirror' : 'party_publication', identity: ['matter', 'two'], qualification: 'Party publication only; AI attribution and outcome remain unknown.', ...(mirror ? { unsupportedReason: 'Original court or party publication must be identified before qualified observation.' } : {}), baselineStatus: 'pending', attribution: 'unknown' },
    { id: 'AIEL-TEST-003', kind: 'matter', url: 'https://govinfo.gov/content/pkg/AIEL-TEST-003.pdf', expectedHost: 'govinfo.gov', role: 'court_document', identity: ['matter', 'three'], qualification: 'One court document; AI attribution and outcome remain unknown.', baselineStatus: 'filed', attribution: 'unknown', ...(htmlInsteadOfPdf ? { htmlInsteadOfPdf: true } : {}) },
    { id: 'AIEL-TEST-004', kind: 'matter', url: 'https://courtlistener.com/docket/aiel-test-004', expectedHost: 'courtlistener.com', role: 'docket_metadata', identity: ['matter', 'four'], qualification: 'Docket metadata only; AI attribution and outcome remain unknown.', baselineStatus: 'pending', attribution: 'unknown' },
    { id: 'AIEL-TEST-005', kind: 'matter', url: 'https://courtlistener.com/docket/aiel-test-005', expectedHost: 'courtlistener.com', role: 'docket_metadata', identity: ['matter', 'five'], qualification: 'Docket metadata only; AI attribution and outcome remain unknown.', baselineStatus: 'filed', attribution: 'unknown' }
  ];
}

function discoveryStreams() {
  return [
    { id: 'ftc-synthetic-stream', kind: 'discovery', url: 'https://ftc.gov/news-events/news/press-releases', expectedHost: 'ftc.gov', role: 'official_index', qualification: 'Bounded first official index page.' },
    { id: 'doj-synthetic-stream', kind: 'discovery', url: 'https://justice.gov/opa/pr', expectedHost: 'justice.gov', role: 'official_index', qualification: 'Bounded first official index page.' }
  ];
}

function receipt(source, body, { format = source.url.endsWith('.pdf') ? 'pdf' : 'text', contentType = format === 'pdf' ? 'application/pdf' : 'text/html' } = {}) {
  return {
    httpStatus: 200,
    contentType,
    body,
    rawBody: Buffer.from(body),
    retrievedUrl: source.url,
    format,
    retrievedAt: NOW
  };
}

function bodyFor(source, suffix = '') {
  return `<main>Official record for ${source.identity.join(' ')} ${suffix}</main>`;
}

function emptyIndex() {
  return { supported: true, items: [], scope: { complete: true, boundedFirstPage: true }, emptyEvidence: { kind: 'no-keyword-matches', inspectedOfficialReleaseItems: 3 } };
}

function readyState() {
  return core.emptyState({ reviewPolicy: { owner: 'Sam Rogers', capacityMinutesPerWeek: 30, scope: 'six-repo-portfolio' } });
}

async function runCollect({ matters = matterSources(), streams = discoveryStreams(), state = readyState(), index = [], parseIndex = () => emptyIndex(), bodySuffix = '', responseFor, persist = async () => {}, now = NOW } = {}) {
  const fetches = [];
  const result = await collect({
    matters,
    streams,
    state,
    index,
    now,
    maxRequests: 7,
    parseIndex,
    persist,
    retainRaw: async () => {},
    fetcher: async url => {
      const source = [...matters, ...streams].find(entry => entry.url === url);
      fetches.push(url);
      if (responseFor) return responseFor(source, url);
      return receipt(source, source.kind === 'matter' ? bodyFor(source, source.id === 'AIEL-TEST-001' ? bodySuffix : '') : '<main>Official index</main>');
    }
  });
  return { ...result, fetches };
}

test('matter comparison uses the latest qualified snapshot across an A-to-B-to-A reversion after persisted reload', async () => {
  const state = readyState();
  const first = await runCollect({ state, now: '2026-09-06T12:00:00.000Z' });
  assert.equal(first.fetches.length, 7);
  assert.equal(first.report.sources.filter(source => source.kind === 'matter' && source.assessment === 'baseline_source_review').length, 5);
  const baselineFindingCount = Object.keys(state.findings).length;
  assert.equal(baselineFindingCount, 5);

  const second = await runCollect({ state, now: '2026-09-06T12:01:00.000Z' });
  assert.equal(Object.keys(state.findings).length, baselineFindingCount);
  assert.equal(second.report.sources.filter(source => source.kind === 'matter' && source.assessment === 'unchanged_source').length, 5);

  const third = await runCollect({ state, now: '2026-09-06T12:02:00.000Z' });
  assert.equal(third.report.sources.filter(source => source.kind === 'matter' && source.assessment === 'unchanged_source').length, 5);

  const changed = await runCollect({ state, bodySuffix: 'amended docket metadata', now: '2026-09-06T12:03:00.000Z' });
  const changedSource = changed.report.sources.find(source => source.id === 'AIEL-TEST-001');
  assert.equal(changedSource.assessment, 'existing_development_review');
  assert.equal(Object.keys(state.findings).length, baselineFindingCount + 1);
  const finding = state.findings[changedSource.findingId];
  assert.equal(finding.status, 'pending');
  assert.equal(finding.newValue.assessment, 'existing_development_review');
  assert.equal(finding.newValue.qualification, 'Docket metadata only; AI attribution and outcome remain unknown.');

  const directory = await mkdtemp(path.join(os.tmpdir(), 'aiincidentlaw-matter-monitor-'));
  const filename = path.join(directory, 'state.json');
  try {
    await core.saveState(filename, state, { now: '2026-09-06T12:04:00.000Z' });
    const reloaded = await core.loadState(filename, { now: '2026-09-06T12:04:00.000Z' });
    const repeatedChanged = await runCollect({ state: reloaded, bodySuffix: 'amended docket metadata', now: '2026-09-06T12:05:00.000Z' });
    assert.equal(repeatedChanged.report.sources.find(source => source.id === 'AIEL-TEST-001').assessment, 'unchanged_source');
    const thirdChanged = await runCollect({ state: reloaded, bodySuffix: 'amended docket metadata', now: '2026-09-06T12:06:00.000Z' });
    assert.equal(thirdChanged.report.sources.find(source => source.id === 'AIEL-TEST-001').assessment, 'unchanged_source');
    const reverted = await runCollect({ state: reloaded, now: '2026-09-06T12:07:00.000Z' });
    assert.equal(reverted.report.sources.find(source => source.id === 'AIEL-TEST-001').assessment, 'existing_development_review');
    assert.equal(Object.keys(reloaded.findings).length, baselineFindingCount + 1);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('secondary mirrors, blocked HTML, and an HTML shell at a PDF URL are unqualified and do not establish coverage', async () => {
  const matters = matterSources({ mirror: true, htmlInsteadOfPdf: true });
  const result = await runCollect({
    matters,
    responseFor: source => {
      if (source.id === 'AIEL-TEST-001') return receipt(source, '<html><body>Access denied. Verify you are human.</body></html>');
      if (source.id === 'AIEL-TEST-003') return receipt(source, '<html><body>matter three document download</body></html>', { format: 'text', contentType: 'text/html' });
      return receipt(source, source.kind === 'matter' ? bodyFor(source) : '<main>Official index</main>');
    }
  });
  const byId = Object.fromEntries(result.report.sources.map(source => [source.id, source]));
  assert.equal(byId['AIEL-TEST-001'].status, 'unavailable');
  assert.match(byId['AIEL-TEST-001'].reason, /blocked_html/i);
  assert.equal(byId['AIEL-TEST-002'].status, 'unsupported');
  assert.equal(byId['AIEL-TEST-003'].status, 'unavailable');
  assert.match(byId['AIEL-TEST-003'].reason, /original PDF bytes/i);
  for (const id of ['AIEL-TEST-001', 'AIEL-TEST-002', 'AIEL-TEST-003']) {
    const observation = result.state.observations[byId[id].observationId];
    assert.equal(observation.coverageQualified, false);
  }
  assert.equal(result.report.status, 'degraded');
});

test('discovery routes known source URLs to existing review, keeps new candidates pending, and never admits insufficient AI attribution', async () => {
  const existingUrl = 'https://ftc.gov/news-events/news/press-releases/2026/09/existing-ai-matter';
  const newUrl = 'https://ftc.gov/news-events/news/press-releases/2026/09/new-ai-matter';
  const insufficientUrl = 'https://ftc.gov/news-events/news/press-releases/2026/09/consumer-privacy';
  const result = await runCollect({
    index: [{ id: 'AIEL-EXISTING', urls: [existingUrl] }],
    parseIndex: (_body, { source }) => source.id === 'ftc-synthetic-stream' ? {
      supported: true,
      scope: { complete: true, boundedFirstPage: true },
      items: [
        { id: 'existing-release', title: 'Artificial intelligence enforcement update', url: existingUrl },
        { id: 'new-release', title: 'Automated decision enforcement action', url: newUrl },
        { id: 'privacy-release', title: 'Consumer privacy update', url: insufficientUrl }
      ]
    } : emptyIndex()
  });
  const byUrl = Object.fromEntries(result.report.items.map(item => [item.url, item]));
  assert.deepEqual(byUrl[existingUrl].recordIds, ['AIEL-EXISTING']);
  assert.equal(byUrl[existingUrl].type, 'existing_matter_review');
  assert.equal(byUrl[newUrl].type, 'candidate_needs_primary_document');
  assert.equal(byUrl[insufficientUrl].type, 'insufficient_ai_attribution');
  const insufficientFinding = result.state.findings[byUrl[insufficientUrl].findingId];
  assert.equal(insufficientFinding.status, 'pending');
  assert.equal(insufficientFinding.newValue.admission, 'human_review_required');
  assert.equal(insufficientFinding.newValue.aiAttribution, 'not_established_by_index');
});

test('a qualified empty discovery query retains prior pending discovery findings', async () => {
  const candidateUrl = 'https://ftc.gov/news-events/news/press-releases/2026/09/automated-decision-case';
  const state = readyState();
  await runCollect({
    state,
    parseIndex: (_body, { source }) => source.id === 'ftc-synthetic-stream' ? {
      supported: true,
      scope: { complete: true, boundedFirstPage: true },
      items: [{ id: 'candidate', title: 'Automated decision enforcement action', url: candidateUrl }]
    } : emptyIndex()
  });
  const pendingBefore = Object.values(state.findings).filter(finding => finding.newValue?.url === candidateUrl);
  assert.equal(pendingBefore.length, 1);
  const second = await runCollect({ state });
  assert.equal(second.report.items.length, 0);
  assert.equal(Object.values(state.findings).filter(finding => finding.newValue?.url === candidateUrl && finding.status === 'pending').length, 1);
  const ftc = second.report.sources.find(source => source.id === 'ftc-synthetic-stream');
  assert.equal(ftc.status, 'covered');
  assert.equal(ftc.emptyEvidence.kind, 'no-keyword-matches');
});

test('invalid source kind, role, identity, and a missing discovery parser fail before a fetch', async () => {
  for (const mutate of [
    sources => { sources[0].kind = 'unknown'; },
    sources => { sources[0].role = 'unknown'; },
    sources => { sources[0].identity = []; }
  ]) {
    const matters = matterSources();
    mutate(matters);
    let fetches = 0;
    await assert.rejects(() => collect({ matters, streams: discoveryStreams(), now: NOW, parseIndex: () => emptyIndex(), fetcher: async () => { fetches++; } }), /source|kind|role|identity/i);
    assert.equal(fetches, 0);
  }
  let fetches = 0;
  await assert.rejects(() => collect({ matters: matterSources(), streams: discoveryStreams(), now: NOW, fetcher: async () => { fetches++; } }), /discovery parser/i);
  assert.equal(fetches, 0);
});

test('source cardinality, source IDs, URL host, and seven-request budget are bounded', async () => {
  await assert.rejects(() => collect({ matters: matterSources().slice(0, 4), streams: discoveryStreams(), now: NOW, parseIndex: () => emptyIndex() }), /five distinct active matters/i);
  const duplicate = matterSources();
  duplicate[1].id = duplicate[0].id;
  await assert.rejects(() => collect({ matters: duplicate, streams: discoveryStreams(), now: NOW, parseIndex: () => emptyIndex() }), /five distinct active matters/i);
  const wrongHost = matterSources();
  wrongHost[0].expectedHost = 'example.gov';
  await assert.rejects(() => collect({ matters: wrongHost, streams: discoveryStreams(), now: NOW, parseIndex: () => emptyIndex() }), /Unexpected source URL/i);
  for (const maxRequests of [0, 8]) {
    await assert.rejects(() => collect({ matters: matterSources(), streams: discoveryStreams(), now: NOW, maxRequests, parseIndex: () => emptyIndex() }), /budget must be 1\.\.7/i);
  }
});

test('a persistence failure prevents the first source fetch', async () => {
  let fetches = 0;
  await assert.rejects(() => collect({
    matters: matterSources(),
    streams: discoveryStreams(),
    now: NOW,
    parseIndex: () => emptyIndex(),
    fetcher: async () => { fetches++; throw Error('fetch should not run'); },
    persist: async () => { throw Error('state storage unavailable'); }
  }), /state storage unavailable/);
  assert.equal(fetches, 0);
});

test('CLI requires explicit live authorization and rejects unsafe report/state arguments without touching the corpus', async () => {
  assert.throws(() => parseArgs([]), /Pass --live/i);
  assert.throws(() => parseArgs(['--live', '--unknown']), /Unknown argument/i);
  assert.throws(() => parseArgs(['--live', '--reports']), /Missing reports path/i);
  assert.throws(() => parseArgs(['--live', '--reports', '/tmp/matter-monitor-evidence', '--state', '/tmp/matter-monitor-evidence/state.json']), /outside the report directory/i);
  await assert.rejects(() => run({ live: false }), /Live authorization required/i);
});
