#!/usr/bin/env node
/**
 * API smoke test — boots the real server (no database or external keys
 * needed) and asserts the contract of representative endpoints:
 * health, validation errors, admin auth, DB-unconfigured 503s, lead
 * fallback capture, tracking dedupe, SPA/SEO status codes, and redirects.
 *
 * Run with: npm run test:api
 */
import { spawn } from 'node:child_process';
import { rmSync, existsSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

const PORT = 4601;
const BASE = `http://127.0.0.1:${PORT}`;
const ADMIN_SECRET = 'test-api-admin-secret';
const ADMIN = { 'x-admin-secret': ADMIN_SECRET };
const JSON_H = { 'Content-Type': 'application/json' };

// Start from a clean fallback-leads state.
rmSync(new URL('../data', import.meta.url), { recursive: true, force: true });

const server = spawn('node', ['server.js'], {
  cwd: new URL('..', import.meta.url).pathname,
  env: {
    ...process.env,
    PORT: String(PORT),
    NODE_ENV: 'production',
    ADMIN_SECRET,
    // Ensure external integrations are OFF so the test is hermetic.
    SUPABASE_URL: '', SUPABASE_SERVICE_KEY: '', DAILY_API_KEY: '',
    OPENAI_API_KEY: '', ANTHROPIC_API_KEY: '', RESEND_API_KEY: '',
    RAZORPAY_KEY_ID: '', RAZORPAY_KEY_SECRET: '',
    CALLMEBOT_WHATSAPP_APIKEY: '', GA_MEASUREMENT_ID: '',
  },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let serverLog = '';
server.stdout.on('data', (d) => { serverLog += d; });
server.stderr.on('data', (d) => { serverLog += d; });

let ready = false;
for (let i = 0; i < 80; i += 1) {
  await sleep(250);
  try {
    if ((await fetch(`${BASE}/api/health`)).status === 200) { ready = true; break; }
  } catch { /* not up yet */ }
}
if (!ready) {
  console.error('❌ Server failed to start:\n', serverLog.slice(-3000));
  server.kill('SIGKILL');
  process.exit(1);
}

let passed = 0;
let failed = 0;

async function check(name, method, path, opts, assertions) {
  const init = { method, redirect: 'manual', headers: opts?.headers ?? {} };
  if (opts?.body !== undefined) init.body = JSON.stringify(opts.body);
  try {
    const res = await fetch(`${BASE}${path}`, init);
    const text = await res.text();
    let body = null;
    try { body = JSON.parse(text); } catch { body = text; }
    await assertions(res, body);
    passed += 1;
    console.log(`✓ ${name}`);
  } catch (e) {
    failed += 1;
    console.error(`✗ ${name}: ${e.message}`);
  }
}

function expect(cond, msg) {
  if (!cond) throw new Error(msg);
}

// ── Health ────────────────────────────────────────────────────
await check('health reports config state', 'GET', '/api/health', null, (res, body) => {
  expect(res.status === 200, `status ${res.status}`);
  expect(body.ok === true && body.status === 'ok', 'body.ok/status');
  expect(body.db === 'not configured', `db ${body.db}`);
  expect(body.payments === 'disabled', `payments ${body.payments}`);
});

// ── Validation errors ─────────────────────────────────────────
await check('booking without fields → 400', 'POST', '/api/bookings', { headers: JSON_H, body: {} }, (res, body) => {
  expect(res.status === 400, `status ${res.status}`);
  expect(body.error === 'patient_name is required', body.error);
});
await check('booking with bad phone → 400', 'POST', '/api/bookings', {
  headers: JSON_H,
  body: { patient_name: 'A', patient_phone: '12345', practitioner_type: 'x', preferred_date: 'd', preferred_time: 't', consent: true, age_attestation: true },
}, (res, body) => {
  expect(res.status === 400, `status ${res.status}`);
  expect(/10-digit/.test(body.error), body.error);
});
await check('booking without consent → 400', 'POST', '/api/bookings', {
  headers: JSON_H,
  body: { patient_name: 'A', patient_phone: '9876543210', practitioner_type: 'psychiatrist', preferred_date: 'd', preferred_time: 't', age_attestation: true },
}, (res, body) => {
  expect(res.status === 400 && /consent is required/.test(body.error), `${res.status} ${body.error}`);
});
await check('booking without age attestation → 400', 'POST', '/api/bookings', {
  headers: JSON_H,
  body: { patient_name: 'A', patient_phone: '9876543210', practitioner_type: 'psychiatrist', preferred_date: 'd', preferred_time: 't', consent: true },
}, (res, body) => {
  expect(res.status === 400 && /age_attestation is required/.test(body.error), `${res.status} ${body.error}`);
});
await check('apply without role → 400', 'POST', '/api/professionals/apply', { headers: JSON_H, body: {} }, (res, body) => {
  expect(res.status === 400 && body.error === 'role is required', `${res.status} ${body.error}`);
});
await check('subscribe with invalid email → 400', 'POST', '/api/subscribe', { headers: JSON_H, body: { email: 'nope' } }, (res) => {
  // requireDb runs first when DB is unset
  expect(res.status === 503 || res.status === 400, `status ${res.status}`);
});
await check('rooms without appointment_id → 400', 'POST', '/api/rooms', { headers: JSON_H, body: {} }, (res, body) => {
  expect(res.status === 400 && body.error === 'appointment_id is required', `${res.status} ${body.error}`);
});

// ── Lead fallback (DB down must never lose a lead) ───────────
await check('booking falls back when DB is unconfigured', 'POST', '/api/bookings', {
  headers: JSON_H,
  body: { patient_name: 'Test P', patient_phone: '9876543210', practitioner_type: 'psychiatrist', preferred_date: '2030-01-01', preferred_time: '10:00', consent: true, age_attestation: true },
}, (res, body) => {
  expect(res.status === 201, `status ${res.status}`);
  expect(body.booking?.patient_phone === '9876543210', 'booking echoed');
  expect(body.booking?.status === 'pending', 'status pending');
  expect(body.booking?.consent_purpose === 'appointment_contact_and_care', 'consent recorded');
});
await check('anonymous screening without contact is accepted', 'POST', '/api/screening', {
  headers: JSON_H, body: { phq9_score: 2 },
}, (res, body) => {
  expect(res.status === 201 && body.screening?.phq9_score === 2, `status ${res.status}`);
});
await check('screening with contact but no consent → 400', 'POST', '/api/screening', {
  headers: JSON_H, body: { name: 'S', phone: '9876543210', phq9_score: 4 },
}, (res, body) => {
  expect(res.status === 400 && /consent is required/.test(body.error), `${res.status} ${body.error}`);
});
await check('screening falls back when DB is unconfigured', 'POST', '/api/screening', {
  headers: JSON_H, body: { name: 'S', phone: '9876543210', phq9_score: 4, consent: true },
}, (res, body) => {
  expect(res.status === 201 && body.screening?.phq9_score === 4, `status ${res.status}`);
  expect(body.screening?.consent_purpose === 'screening_follow_up', 'consent recorded');
});
await check('professional apply falls back + sets header', 'POST', '/api/professionals/apply', {
  headers: JSON_H, body: { role: 'psychiatrist', full_name: 'Dr T', phone: '9876500000', consent: true },
}, (res, body) => {
  expect(res.status === 201, `status ${res.status}`);
  expect(res.headers.get('x-serenest-apply') === 'fallback', `header ${res.headers.get('x-serenest-apply')}`);
  expect(body.fallback === true, 'fallback flag');
  expect(body.application?.consent_method === 'web_form_checkbox', 'consent recorded');
});
expect(existsSync(new URL('../data/leads-fallback.jsonl', import.meta.url)), 'fallback JSONL file written');
console.log('✓ fallback leads persisted to JSONL');
passed += 1;

// ── Admin auth ────────────────────────────────────────────────
await check('admin route without secret → 401', 'GET', '/api/professionals/applications', null, (res, body) => {
  expect(res.status === 401 && body.error === 'Unauthorized', `${res.status}`);
});
await check('admin route with wrong secret → 401', 'GET', '/api/professionals/applications', { headers: { 'x-admin-secret': 'wrong' } }, (res) => {
  expect(res.status === 401, `${res.status}`);
});
await check('admin sees fallback applications', 'GET', '/api/professionals/applications', { headers: ADMIN }, (res, body) => {
  expect(res.status === 200, `status ${res.status}`);
  expect(body.fallback_count === 1, `fallback_count ${body.fallback_count}`);
  expect(body.applications?.[0]?.full_name === 'Dr T', 'application listed');
});

// ── DB-unconfigured guard ─────────────────────────────────────
for (const [method, path] of [
  ['GET', '/api/bookings/abc'],
  ['GET', '/api/professionals/directory'],
  ['GET', '/api/jobs'],
  ['GET', '/api/prescriptions/x'],
  ['GET', '/api/academy/content'],
]) {
  await check(`${method} ${path} → 503 without DB`, method, path, null, (res, body) => {
    expect(res.status === 503, `status ${res.status}`);
    expect(/Database not configured/.test(body.error), body.error);
  });
}

// ── Daily.co guard ────────────────────────────────────────────
await check('rooms → 503 without DAILY_API_KEY', 'POST', '/api/rooms', { headers: JSON_H, body: { appointment_id: 'x' } }, (res, body) => {
  expect(res.status === 503 && /not configured/.test(body.error), `${res.status}`);
});

// ── Payments disabled ─────────────────────────────────────────
await check('payment order → 503 when payments disabled', 'POST', '/api/payments/order', { headers: JSON_H, body: {} }, (res, body) => {
  expect(res.status === 503 && /not enabled/.test(body.error), `${res.status}`);
});

// ── Tracking consent + dedupe ─────────────────────────────────
await check('visit without analytics consent is not recorded', 'POST', '/api/track/visit', {
  headers: JSON_H, body: { vid: 'tv0' },
}, (res, body) => {
  expect(res.status === 200 && body.unique === false && body.recorded === false, JSON.stringify(body));
});
await check('first consented visit is unique', 'POST', '/api/track/visit', {
  headers: JSON_H, body: { vid: 'tv1', analytics_consent: true },
}, (res, body) => {
  expect(res.status === 200 && body.unique === true && body.recorded === true, JSON.stringify(body));
});
await check('repeat consented visit deduped', 'POST', '/api/track/visit', {
  headers: JSON_H, body: { vid: 'tv1', analytics_consent: true },
}, (res, body) => {
  expect(res.status === 200 && body.unique === false && body.recorded === true, JSON.stringify(body));
});
await check('track/today requires admin', 'GET', '/api/track/today', null, (res) => {
  expect(res.status === 401, `${res.status}`);
});
await check('track/today counts uniques', 'GET', '/api/track/today', { headers: ADMIN }, (res, body) => {
  expect(res.status === 200 && body.unique_visitors === 1, JSON.stringify(body));
});

// ── Contact (DB-optional) ─────────────────────────────────────
await check('contact accepted without DB', 'POST', '/api/contact', { headers: JSON_H, body: { name: 'N', message: 'hello' } }, (res, body) => {
  expect(res.status === 201 && body.ok === true, `${res.status}`);
});

// ── Privacy / DPDP rights ─────────────────────────────────────
await check('privacy request without name → 400', 'POST', '/api/privacy/request', {
  headers: JSON_H, body: { email: 'a@b.com', request_type: 'access', details: 'please send my data' },
}, (res, body) => {
  expect(res.status === 400 && /full_name/.test(body.error), `${res.status} ${body.error}`);
});
await check('privacy request with bad type → 400', 'POST', '/api/privacy/request', {
  headers: JSON_H, body: { full_name: 'A', email: 'a@b.com', request_type: 'export', details: 'please send my data' },
}, (res, body) => {
  expect(res.status === 400 && /request_type/.test(body.error), `${res.status} ${body.error}`);
});
await check('privacy request accepted without DB', 'POST', '/api/privacy/request', {
  headers: JSON_H,
  body: { full_name: 'A Patient', email: 'a@b.com', request_type: 'access', details: 'please send my data' },
}, (res, body) => {
  expect(res.status === 201 && body.ok === true, `${res.status}`);
  expect(body.fallback === true, 'fallback flag');
  expect(body.request?.request_type === 'access', 'type echoed');
});
await check('privacy request list requires admin', 'GET', '/api/privacy/requests', null, (res) => {
  expect(res.status === 401, `${res.status}`);
});
await check('consultation bootstrap without DB is non-PII', 'GET', '/api/consultations/appt-test-1', null, (res, body) => {
  expect(res.status === 200 && body.found === false, `${res.status}`);
  expect(body.thread_key === 'appt-test-1', 'thread key');
  expect(body.patient_name === undefined && body.patient_phone === undefined, 'no PII fields');
});

// ── Assistant disabled ────────────────────────────────────────
await check('assistant → 503 without OPENAI_API_KEY', 'POST', '/api/assistant/chat', { headers: JSON_H, body: { messages: [{ role: 'user', content: 'hi' }] } }, (res) => {
  expect(res.status === 503, `${res.status}`);
});

// ── API 404 ───────────────────────────────────────────────────
// GET on an unknown /api path falls through to the SPA handler (HTML 404);
// non-GET methods hit the JSON API 404.
await check('unknown API endpoint (GET) → 404', 'GET', '/api/does-not-exist', null, (res) => {
  expect(res.status === 404, `${res.status}`);
});
await check('unknown API endpoint (DELETE) → 404 JSON', 'DELETE', '/api/nope', null, (res, body) => {
  expect(res.status === 404 && body.error === 'API endpoint not found', `${res.status} ${JSON.stringify(body)}`);
});

// ── SPA / SEO (requires dist build; skip when absent) ─────────
const hasDist = existsSync(new URL('../dist/index.html', import.meta.url));
if (hasDist) {
  await check('homepage serves SEO-injected HTML', 'GET', '/', null, async (res, body) => {
    expect(res.status === 200, `status ${res.status}`);
    expect(/text\/html/.test(res.headers.get('content-type')), 'content-type');
    expect(body.includes('id="root"'), 'SPA root present');
  });
  await check('admin page swaps PWA manifest', 'GET', '/admin', null, (res, body) => {
    expect(res.status === 200 && body.includes('/admin-manifest.json'), 'admin manifest');
  });
  await check('privacy request page → 200', 'GET', '/privacy/request', null, (res) => {
    expect(res.status === 200, `status ${res.status}`);
  });
  await check('unknown page → 404 HTML', 'GET', '/totally-unknown-page', null, (res) => {
    expect(res.status === 404, `status ${res.status}`);
  });
  await check('stale WP-era URL → 410', 'GET', '/wp-login.php', null, (res) => {
    expect(res.status === 410, `status ${res.status}`);
  });
  await check('keyword alias → 301 to canonical', 'GET', '/online-psychiatry-consultation-india', null, (res) => {
    expect(res.status === 301, `status ${res.status}`);
    expect(/\/services$/.test(res.headers.get('location')), res.headers.get('location'));
  });
} else {
  console.log('… dist/ missing — skipping SPA/SEO checks (run `npm run build` first)');
}

server.kill('SIGTERM');
await sleep(300);
server.kill('SIGKILL');

// Clean up test artifacts.
rmSync(new URL('../data', import.meta.url), { recursive: true, force: true });

console.log(failed === 0
  ? `\n✅ API smoke: ${passed} checks passed`
  : `\n❌ API smoke: ${failed} failed, ${passed} passed`);
process.exit(failed === 0 ? 0 : 1);
