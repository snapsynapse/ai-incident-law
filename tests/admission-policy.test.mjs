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
