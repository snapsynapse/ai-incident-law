// Evals for admission-criteria invariants that live in the data rather than in
// prose. Each corresponds to a rule decided in INTENT.md on 2026-08-19; the
// point is that a record cannot quietly stop honouring a rule the corpus has
// committed to publicly.
'use strict';

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync('data/data.json', 'utf8'));
const included = data.datasets.included.records;
const intent = fs.readFileSync('INTENT.md', 'utf8');
const methodology = fs.readFileSync('docs/methodology.html', 'utf8');

const tagsOf = record => (record.tags || '').split(';').map(t => t.trim()).filter(Boolean);
const ATTRIBUTION_QUALIFIER = /attribution not determined/i;
const ATTRIBUTION_TAG = 'attribution-not-determined';

test('undetermined-attribution qualifier and tag always travel together', () => {
    for (const record of included) {
        const qualified = ATTRIBUTION_QUALIFIER.test(record.ai_system_name || '');
        const tagged = tagsOf(record).includes(ATTRIBUTION_TAG);
        assert.equal(
            qualified,
            tagged,
            `${record.error_id}: ai_system_name qualifier (${qualified}) and ` +
            `${ATTRIBUTION_TAG} tag (${tagged}) disagree. INTENT.md requires both or neither.`
        );
    }
});

test('undetermined-attribution records are capped at medium confidence', () => {
    const affected = included.filter(r => tagsOf(r).includes(ATTRIBUTION_TAG));
    for (const record of affected) {
        assert.ok(
            ['medium', 'low'].includes(record.confidence_score),
            `${record.error_id}: confidence_score is "${record.confidence_score}"; ` +
            'INTENT.md caps undetermined-attribution records at medium.'
        );
    }
});

test('undetermined-attribution records do not assert AI causation', () => {
    // The rule: the fabrication is the defect; AI is the record's unresolved
    // question. Catches the phrasings that would restate it as established.
    const asserts = /\b(AI|artificial intelligence)[^.]{0,40}\b(caused|generated the|produced the|fabricated the)\b/i;
    for (const record of included.filter(r => tagsOf(r).includes(ATTRIBUTION_TAG))) {
        for (const field of ['error_description', 'reliance_or_harm']) {
            assert.ok(
                !asserts.test(record[field] || ''),
                `${record.error_id}.${field} asserts AI causation, which INTENT.md ` +
                'forbids for undetermined-attribution records.'
            );
        }
    }
});

test('non-English source records record their source language as a tag', () => {
    // Promotion out of `global` drops the candidate shape's source_language
    // field, so the tag is the only thing preserving it.
    for (const record of included) {
        const languageTags = tagsOf(record).filter(t => t.startsWith('source-language-'));
        assert.ok(
            languageTags.length <= 1,
            `${record.error_id}: more than one source-language tag (${languageTags.join(', ')}).`
        );
        for (const tag of languageTags) {
            assert.match(
                tag,
                /^source-language-[a-z-]+$/,
                `${record.error_id}: malformed source-language tag "${tag}".`
            );
        }
    }
});

test('every admission rule decided in INTENT is documented publicly', () => {
    // Contributors submit against the methodology page, so a rule that exists
    // only in INTENT is a rule nobody outside the project can comply with.
    const rules = [
        { intent: '### Outcome valence is not an admission criterion', page: '<h2>Outcome valence</h2>' },
        { intent: '### Undetermined AI attribution', page: '<h2>AI attribution</h2>' },
        { intent: '### Jurisdiction and the `global` bucket', page: '<h2>Jurisdiction and language</h2>' },
    ];
    for (const rule of rules) {
        assert.ok(intent.includes(rule.intent), `INTENT.md lost the section "${rule.intent}".`);
        assert.ok(
            methodology.includes(rule.page),
            `docs/methodology.html no longer documents "${rule.intent}" (expected ${rule.page}).`
        );
    }
    const intentSections = (intent.match(/^### .+$/gm) || [])
        .filter(h => !h.startsWith('### Record submissions'));
    assert.equal(
        intentSections.length,
        rules.length,
        `INTENT.md has ${intentSections.length} policy subsections but only ${rules.length} are ` +
        'mapped to the public methodology page. Add the new rule to docs/methodology.html and to this test.'
    );
});

test('the global bucket holds candidate records, never admitted ones', () => {
    // `global` is review for non-US matters: a queue, not a publication bucket.
    for (const record of data.datasets.global.records) {
        assert.ok(record.candidate_id, 'a global record is missing candidate_id');
        assert.equal(
            record.error_id,
            undefined,
            `${record.candidate_id} carries error_id; admitted records belong in \`included\`.`
        );
        assert.notEqual(record.research_status, 'included');
    }
});

// --- Source rigor -----------------------------------------------------------
// INTENT.md and the maintainer sourcing rule require `public_record_link` to
// point at the issuing court, tribunal, or agency. Aggregators and commercial
// reporters may corroborate as secondary sources but never carry a record.
//
// Four records predate that rule. They are listed here as an accepted baseline
// so the backlog is visible and cannot silently grow: fixing one means deleting
// its line, and admitting a new aggregator-primary record fails the build.
// See ROADMAP.md, "Outstanding source gaps".
const AGGREGATOR_PRIMARY_BASELINE = new Set([
    'AIEL-2024-001', // canlii.org — blocked on a CanLII API key
    'AIEL-2023-002', // law.justia.com
    'AIEL-2024-003', // law.justia.com
    'AIEL-2017-012', // law.justia.com
]);

const AGGREGATOR_HOSTS = [
    'damiencharlotin.com', 'websitedc.s3.amazonaws.com', 'canlii.org',
    'indiankanoon.org', 'justia.com', 'casetext.com', 'scholar.google.com',
];

test('no new record cites an aggregator as its primary source', () => {
    const offenders = included
        .filter(r => AGGREGATOR_HOSTS.some(h => (r.public_record_link || '').includes(h)))
        .map(r => r.error_id);
    const added = offenders.filter(id => !AGGREGATOR_PRIMARY_BASELINE.has(id));
    assert.deepEqual(
        added,
        [],
        `${added.join(', ')} cite an aggregator as public_record_link. Records must cite the ` +
        'issuing court, tribunal, or agency; aggregators corroborate as secondary sources only.'
    );
    const fixed = [...AGGREGATOR_PRIMARY_BASELINE].filter(id => !offenders.includes(id));
    assert.deepEqual(
        fixed,
        [],
        `${fixed.join(', ')} no longer cite an aggregator. Remove them from ` +
        'AGGREGATOR_PRIMARY_BASELINE so the baseline keeps shrinking.'
    );
});

test('the discovery tracker never appears as a source anywhere', () => {
    // Charlotin's index is a discovery index only. This was a 30-record backlog
    // as of the v8 sweep and is now clear; the test keeps it that way.
    const TRACKER = /damiencharlotin\.com|websitedc\.s3/i;
    const fields = ['public_record_link', 'secondary_source_links', 'best_available_sources'];
    for (const bucket of ['included', 'review', 'global']) {
        for (const record of data.datasets[bucket].records) {
            for (const field of fields) {
                assert.ok(
                    !TRACKER.test(record[field] || ''),
                    `${record.error_id || record.candidate_id}.${field} cites the discovery ` +
                    'tracker. Cite the issuing body instead, or record the sourcing gap.'
                );
            }
        }
    }
});
