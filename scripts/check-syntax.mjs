#!/usr/bin/env node
/**
 * Syntax-check every server-side module with `node --check`.
 * Fails with a non-zero exit code if any file has a parse error.
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const TARGETS = [
  'server.js',
  'src/server',
  'src/lib/seo.js',
  'src/lib/checkEvidence.js',
  'src/lib/checkSession.js',
  'scripts/check-syntax.mjs',
  'scripts/test-api.mjs',
  'scripts/test-screening-tools.mjs',
];

function collect(path) {
  const st = statSync(path);
  if (st.isFile()) return [path];
  return readdirSync(path)
    .flatMap((name) => collect(join(path, name)))
    .filter((f) => f.endsWith('.js') || f.endsWith('.mjs'));
}

const files = TARGETS.flatMap(collect);
let failed = 0;
for (const file of files) {
  try {
    execFileSync('node', ['--check', file], { stdio: 'pipe' });
  } catch (e) {
    failed += 1;
    console.error(`✗ ${file}\n${e.stderr}`);
  }
}
console.log(failed === 0
  ? `✅ ${files.length} files parsed cleanly`
  : `❌ ${failed} of ${files.length} files failed syntax check`);
process.exit(failed === 0 ? 0 : 1);
