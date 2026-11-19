import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const wrappers = [
  ['validate-obligation-first.mjs', 'validate-adopter-records.mjs'],
  ['check-of-version.mjs', 'check-adopter-of-version.mjs'],
  ['check-of-continuity.mjs', 'check-identifier-continuity.mjs']
];

for (const [wrapper, checker] of wrappers) {
  test(`${wrapper} propagates checker exits and fails on signal termination`, () => {
    const checkout = mkdtempSync(path.join(os.tmpdir(), 'ail-of-checker-'));
    try {
      mkdirSync(path.join(checkout, 'scripts'));
      const checkerPath = path.join(checkout, 'scripts', checker);
      for (const [script, expected] of [
        ['process.exit(0)', 0],
        ['process.exit(2)', 2],
        ["process.kill(process.pid, 'SIGTERM')", 1]
      ]) {
        writeFileSync(checkerPath, script);
        const result = spawnSync(process.execPath, [path.join(root, 'scripts', wrapper)], {
          cwd: root,
          env: { ...process.env, OBLIGATION_FIRST_DIR: checkout, CHECK_OF_REQUIRED: '1' },
          encoding: 'utf8'
        });
        assert.equal(result.status, expected, `${wrapper}: ${script}\n${result.stderr}`);
      }
    } finally {
      rmSync(checkout, { recursive: true, force: true });
    }
  });
}
