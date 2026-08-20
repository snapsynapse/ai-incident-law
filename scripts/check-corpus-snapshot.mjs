#!/usr/bin/env node
// Guards hand-maintained corpus-count snapshots in local agent tooling against
// dataset drift. Maintainer skills keep a "corpus snapshot" block for dedupe
// orientation; a stale block silently narrows or widens a dedupe pass.
//
// Agent tooling directories are gitignored by design, so in a clean checkout
// (CI) there is nothing to check and this passes with a note. It only asserts
// when a snapshot is actually present, which is the local maintainer case where
// drift happens.
'use strict';

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const BUCKETS = ['included', 'review', 'global'];
const SNAPSHOT_GLOBS = ['.agents/skills', '.claude/skills'];

// `- \`included\`: 64 records` / `- \`review\`: 26 candidates`
const COUNT_LINE = bucket =>
    new RegExp(`^-\\s+\`${bucket}\`:\\s+(\\d+)\\s+(?:records|candidates)\\b`, 'm');

function datasetCounts() {
    const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/data.json'), 'utf8'));
    return Object.fromEntries(BUCKETS.map(b => [b, data.datasets[b].records.length]));
}

function findSnapshotFiles() {
    const found = [];
    for (const base of SNAPSHOT_GLOBS) {
        const dir = path.join(ROOT, base);
        let entries;
        try {
            entries = fs.readdirSync(dir, { withFileTypes: true });
        } catch {
            continue; // absent in a clean checkout
        }
        for (const entry of entries) {
            if (!entry.isDirectory() && !entry.isSymbolicLink()) continue;
            const file = path.join(dir, entry.name, 'SKILL.md');
            if (fs.existsSync(file)) found.push(file);
        }
    }
    // `.claude/skills` is commonly a symlink to `.agents/skills`; collapse both
    // onto one real file so a single snapshot is not reported twice.
    const seen = new Set();
    return found.filter(file => {
        const real = fs.realpathSync(file);
        if (seen.has(real)) return false;
        seen.add(real);
        return true;
    });
}

const counts = datasetCounts();
const files = findSnapshotFiles();
let defects = 0;
let checked = 0;

for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    const rel = path.relative(ROOT, file);
    const present = BUCKETS.filter(b => COUNT_LINE(b).test(text));
    if (present.length === 0) continue; // skill carries no snapshot block
    checked++;
    for (const bucket of present) {
        const claimed = Number(text.match(COUNT_LINE(bucket))[1]);
        if (claimed !== counts[bucket]) {
            defects++;
            console.error(
                `SNAPSHOT  ${rel}: \`${bucket}\` claims ${claimed}, dataset has ${counts[bucket]}`
            );
        }
    }
}

const canonical = BUCKETS.map(b => `${b}=${counts[b]}`).join(' ');

if (defects > 0) {
    console.error(`\nDataset is authoritative: ${canonical}`);
    console.error('Update the snapshot block, or re-run after rebuilding.');
    process.exit(1);
}

if (checked === 0) {
    console.log(`check-corpus-snapshot: no local snapshot to check (${canonical})`);
} else {
    console.log(`check-corpus-snapshot: ${checked} snapshot(s) match the dataset (${canonical})`);
}
