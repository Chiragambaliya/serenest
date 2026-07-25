#!/usr/bin/env node
/**
 * Client-side smoke test across public marketing routes.
 * Loads each URL in Chromium, asserts HTTP 200 (or expected redirect),
 * no pageerror, and no unexpected console errors.
 */
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = process.argv[2] || 'http://127.0.0.1:4173';
const CHROME = process.env.CHROME_PATH || 'google-chrome-stable';

const ROUTES = [
  '/',
  '/services',
  '/services/psychiatry',
  '/services/therapy',
  '/services/addiction-care',
  '/services/digital-consultations',
  '/academy',
  '/academy/programs',
  '/academy/programs/clinical-excellence',
  '/academy/learning-paths',
  '/academy/workshops',
  '/academy/faculty',
  '/academy/faqs',
  '/pricing',
  '/about',
  '/professionals',
  '/team',
  '/contact',
  '/faq',
  '/book',
  '/screening',
  '/guides',
  '/blog',
  '/privacy',
  '/terms',
  '/consent',
  '/refund-policy',
  '/emergency-disclaimer',
  '/cookie-policy',
  '/grievance-policy',
  '/payment-policy',
  '/data-retention',
  '/intellectual-property',
  '/community-guidelines',
  '/legal',
  '/careers',
  '/corporate',
  '/partner',
  '/patient/login',
  '/professionals/login',
  '/professionals/learning',
  '/professionals/resources',
  '/professionals/guidelines',
  '/professionals/apply',
  '/online-psychiatrist-for-depression-india',
  '/anxiety-counselling-online-india',
  '/adhd-assessment-online-india',
  '/ocd-treatment-online-india',
];

const results = [];
let failures = 0;

function runChrome(url) {
  return new Promise((resolve) => {
    const errors = [];
    const consoleErrors = [];
    const args = [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--virtual-time-budget=8000',
      '--dump-dom',
      url,
    ];
    const child = spawn(CHROME, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => { stdout += d.toString(); });
    child.stderr.on('data', (d) => { stderr += d.toString(); });
    child.on('close', (code) => {
      const hasRoot = stdout.includes('id="root"') || stdout.includes('Serenest');
      const fatal = /FATAL|Aw, Snap|ERR_/i.test(stderr);
      // Filter noisy chrome headless logs
      const interesting = stderr
        .split('\n')
        .filter((l) => /Console|Uncaught|TypeError|ReferenceError|SyntaxError/i.test(l));
      resolve({
        code,
        hasRoot,
        fatal,
        interesting,
        bytes: stdout.length,
      });
    });
  });
}

async function checkHttp(path) {
  try {
    const res = await fetch(`${BASE}${path}`, { redirect: 'follow' });
    return { status: res.status, ok: res.ok };
  } catch (e) {
    return { status: 0, ok: false, error: String(e.message || e) };
  }
}

console.log(`Smoke testing ${ROUTES.length} routes against ${BASE}`);
for (const path of ROUTES) {
  const http = await checkHttp(path);
  const chrome = await runChrome(`${BASE}${path}`);
  const ok = http.ok && chrome.hasRoot && !chrome.fatal && chrome.interesting.length === 0;
  if (!ok) failures += 1;
  const row = {
    path,
    status: http.status,
    hasRoot: chrome.hasRoot,
    fatal: chrome.fatal,
    consoleIssues: chrome.interesting,
    ok,
  };
  results.push(row);
  console.log(`${ok ? '✓' : '✗'} ${path}  http=${http.status} root=${chrome.hasRoot} issues=${chrome.interesting.length}`);
  if (chrome.interesting.length) console.log('   ', chrome.interesting.slice(0, 3).join(' | '));
}

mkdirSync('/opt/cursor/artifacts', { recursive: true });
writeFileSync('/opt/cursor/artifacts/smoke-results.json', JSON.stringify({ base: BASE, failures, results }, null, 2));
console.log(failures === 0 ? `\n✅ ${ROUTES.length}-route smoke passed` : `\n❌ ${failures} route(s) failed`);
process.exit(failures === 0 ? 0 : 1);
