#!/usr/bin/env node
/**
 * Verify route-specific SEO metadata in the raw HTML response (no JS).
 *
 * Usage:
 *   node scripts/verify-seo.mjs [baseUrl]
 *
 * Default baseUrl is http://localhost:${PORT||3000}. Set BASE_URL env to
 * point at staging/production. Exits non-zero on any failure.
 *
 * The script asserts, per route:
 *   - HTTP status code (200 for valid, 404 for unknown, 410 for stale)
 *   - <title> matches the audit-recommended title
 *   - <meta name="description"> matches
 *   - <link rel="canonical"> points at https://www.serenest.in<path>
 *   - og:title / og:description / og:url present and consistent
 *   - exactly one of each tag (no duplicates)
 *   - JSON-LD block present and parses as JSON
 *
 * It also asserts three whole-site invariants, each of which was broken at some
 * point by the router, the route registry, the SEO map, and sitemap.xml being
 * maintained by hand and drifting apart:
 *   - every path in src/App.jsx is a route the server recognises
 *   - every indexable route has its own ROUTE_SEO entry
 *   - every URL in sitemap.xml is 200, self-canonical, and not noindex
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { ROUTE_SEO, ROUTE_ALIASES, canonicalUrl, shouldNoindex, SITE_ORIGIN } from '../src/lib/seo.js';
import { VALID_ROUTES, VALID_PREFIXES, isValidSpaRoute, normalizePath } from '../src/lib/routes.js';
import { BLOG_POSTS } from '../src/lib/blogPosts.js';
import { ACADEMY_PROGRAMS } from '../src/lib/academyPrograms.js';
import { SCREENING_TOOLS } from '../src/lib/screeningTools.js';
import { listCheckEvidence } from '../src/lib/checkEvidence.js';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

const BASE = process.argv[2] || process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

const ROUTES_200 = [
  '/',
  '/services',
  '/services/psychiatry',
  '/services/therapy',
  '/services/addiction-care',
  '/services/digital-consultations',
  '/pricing',
  '/book',
  '/screening',
  '/screening/pathway/mood-anxiety',
  '/team',
  '/about',
  '/contact',
  '/faq',
  '/guides',
  '/careers',
  '/corporate',
  '/partner',
  '/academy',
  '/academy/programs',
  '/academy/workshops',
  '/academy/learning-paths',
  '/academy/faculty',
  '/academy/resources',
  '/academy/faqs',
  '/academy/programs/clinical-excellence',
  '/blog',
  '/blog/telemedicine-guidelines-india',
  '/privacy',
  '/online-psychiatrist-for-depression-india',
  '/anxiety-counselling-online-india',
  '/adhd-assessment-online-india',
  '/ocd-treatment-online-india',
  '/phq-9-depression-screening',
  '/gad-7-anxiety-screening',
  '/online-psychiatrist-prescription-india',
];
const ROUTES_301 = [
  ['/online-psychiatrist-consultation-india', 'https://www.serenest.in/services'],
  ['/online-psychiatry-consultation-india', 'https://www.serenest.in/services'],
  ['/psychiatry-online-consultation', 'https://www.serenest.in/services'],
  ['/online-mental-health-consultation', 'https://www.serenest.in/services'],
  ['/consult-psychiatrist-online-india', 'https://www.serenest.in/services'],
  ['/online-psychiatry-india', 'https://www.serenest.in/services'],
  ['/depression-treatment-online-india', 'https://www.serenest.in/online-psychiatrist-for-depression-india'],
  ['/depression-counselling-online-india', 'https://www.serenest.in/online-psychiatrist-for-depression-india'],
  ['/online-psychiatrist-for-anxiety-india', 'https://www.serenest.in/anxiety-counselling-online-india'],
  ['/online-adhd-consultation-india', 'https://www.serenest.in/adhd-assessment-online-india'],
  ['/adult-adhd-psychiatrist-online-india', 'https://www.serenest.in/adhd-assessment-online-india'],
  ['/online-ocd-treatment-india', 'https://www.serenest.in/ocd-treatment-online-india'],
  ['/ocd-counselling-online-india', 'https://www.serenest.in/ocd-treatment-online-india'],
  ['/gujarati-speaking-psychiatrist-online', 'https://www.serenest.in/services'],
  ['/online-psychiatrist-gujarat', 'https://www.serenest.in/services'],
  ['/phq-9-test-online-india', 'https://www.serenest.in/phq-9-depression-screening'],
  ['/gad-7-test-online-india', 'https://www.serenest.in/gad-7-anxiety-screening'],
  ['/online-psychiatry-prescription-india', 'https://www.serenest.in/online-psychiatrist-prescription-india'],
  ['/is-online-psychiatric-prescription-valid-in-india', 'https://www.serenest.in/online-psychiatrist-prescription-india'],
];
const ROUTES_410 = [
  '/kotagiri/',
  '/kotagiri',
  '/travelx-tour-guides-section/',
  '/travelx-tour-guides-section',
  '/2025/11/05/kak-zritelnye-effekty-ukrepljajut-vpechatlenija/',
  '/2025/11/05/kak-zritelnye-effekty-ukrepljajut-vpechatlenija',
];
const ROUTES_404 = ['/this-route-does-not-exist', '/random/garbage'];

let failures = 0;
function fail(route, msg) {
  failures += 1;
  console.log(`  ✗ ${route}: ${msg}`);
}
function pass(route, msg) {
  console.log(`  ✓ ${route}: ${msg}`);
}

function countMatches(html, re) {
  return (html.match(re) || []).length;
}

function extract(html, re) {
  const m = html.match(re);
  return m ? m[1] : null;
}

/** Decode the entities renderSeoHead escapes, so comparisons work on plain text. */
function decodeEntities(value) {
  if (value == null) return value;
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

async function fetchPage(path) {
  const res = await fetch(`${BASE}${path}`, { redirect: 'manual' });
  const html = await res.text();
  return { status: res.status, html };
}

async function checkIndexable(path) {
  const expected = ROUTE_SEO[path];
  const canonical = canonicalUrl(path);
  const { status, html } = await fetchPage(path);

  if (status !== 200) {
    fail(path, `expected 200, got ${status}`);
    return;
  }

  // No duplicate tags
  const titleCount = countMatches(html, /<title>/gi);
  if (titleCount !== 1) fail(path, `expected 1 <title>, got ${titleCount}`);

  const descCount = countMatches(html, /<meta\s+name="description"/gi);
  if (descCount !== 1) fail(path, `expected 1 meta description, got ${descCount}`);

  const canonCount = countMatches(html, /<link\s+rel="canonical"/gi);
  if (canonCount !== 1) fail(path, `expected 1 canonical, got ${canonCount}`);

  const ogUrlCount = countMatches(html, /<meta\s+property="og:url"/gi);
  if (ogUrlCount !== 1) fail(path, `expected 1 og:url, got ${ogUrlCount}`);

  // Values. Text is compared in decoded form so correctly escaped markup
  // (an "&" served as "&amp;") is not reported as a mismatch.
  const title = extract(html, /<title>([^<]*)<\/title>/i);
  if (decodeEntities(title) !== expected.title) {
    fail(path, `title mismatch — got ${JSON.stringify(title)}`);
  }

  const desc = extract(html, /<meta\s+name="description"\s+content="([^"]*)"/i);
  if (decodeEntities(desc) !== expected.description) {
    fail(path, `description mismatch — got ${JSON.stringify(desc)}`);
  }

  const canon = extract(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i);
  if (canon !== canonical) fail(path, `canonical mismatch — expected ${canonical}, got ${canon}`);

  const ogUrl = extract(html, /<meta\s+property="og:url"\s+content="([^"]*)"/i);
  if (ogUrl !== canonical) fail(path, `og:url mismatch — expected ${canonical}, got ${ogUrl}`);

  const ogTitle = extract(html, /<meta\s+property="og:title"\s+content="([^"]*)"/i);
  if (decodeEntities(ogTitle) !== (expected.ogTitle || expected.title)) {
    fail(path, `og:title mismatch — got ${JSON.stringify(ogTitle)}`);
  }

  const ogDesc = extract(html, /<meta\s+property="og:description"\s+content="([^"]*)"/i);
  if (decodeEntities(ogDesc) !== (expected.ogDescription || expected.description)) {
    fail(path, `og:description mismatch — got ${JSON.stringify(ogDesc)}`);
  }

  // JSON-LD present and parses
  const jsonLdMatches = [...html.matchAll(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  if (jsonLdMatches.length < 1) {
    fail(path, 'no JSON-LD found');
  } else {
    for (const m of jsonLdMatches) {
      try {
        JSON.parse(m[1]);
      } catch (e) {
        fail(path, `JSON-LD failed to parse: ${e.message}`);
      }
    }
  }

  // No stray www-less canonical/og:url left over
  if (/https:\/\/serenest\.in[^"\/]/.test(html) || /href="https:\/\/serenest\.in\//.test(html) || /content="https:\/\/serenest\.in\//.test(html)) {
    fail(path, 'found non-www host in raw HTML');
  }

  // noindex must NOT be present on indexable routes
  if (/<meta\s+name="robots"[^>]*content="noindex/i.test(html)) {
    fail(path, 'unexpected noindex on indexable route');
  }

  pass(path, `200 + title="${title}" canonical=${canon}`);
}

async function checkStatus(path, expected, { mustNoindex = false } = {}) {
  const { status, html } = await fetchPage(path);
  if (status !== expected) {
    fail(path, `expected ${expected}, got ${status}`);
    return;
  }
  // Must keep 404 UI (Serenest branding present)
  if (!/Serenest/.test(html)) {
    fail(path, 'expected branded UI in response body');
  }
  if (mustNoindex && !/<meta\s+name="robots"[^>]*content="noindex/i.test(html)) {
    fail(path, `expected noindex meta on ${expected} response`);
  }
  pass(path, `status=${status}${mustNoindex ? ' + noindex' : ''}`);
}

console.log(`\n→ Verifying ${BASE}\n`);

console.log('Indexable routes (200 + route-specific metadata):');
for (const r of ROUTES_200) await checkIndexable(r);

console.log('\nStale URLs (410 Gone + noindex):');
for (const r of ROUTES_410) await checkStatus(r, 410, { mustNoindex: true });

console.log('\nUnknown routes (404 + noindex):');
for (const r of ROUTES_404) await checkStatus(r, 404, { mustNoindex: true });

console.log('\nAlias routes (301 → canonical landing page):');
for (const [from, expectedLocation] of ROUTES_301) {
  const res = await fetch(`${BASE}${from}`, { redirect: 'manual' });
  if (res.status !== 301) {
    fail(from, `expected 301, got ${res.status}`);
    continue;
  }
  const loc = res.headers.get('location');
  if (loc !== expectedLocation) {
    fail(from, `expected Location ${expectedLocation}, got ${loc}`);
    continue;
  }
  pass(from, `301 → ${loc}`);
}

// ── Metadata uniqueness: titles and descriptions should not collide across
//    indexable routes (Google flags duplicate metadata as a quality signal). ──
console.log('\nMetadata uniqueness (titles + descriptions per indexable route):');
{
  const titles = new Map();
  const descs = new Map();
  for (const r of ROUTES_200) {
    const seo = ROUTE_SEO[r];
    if (!seo) {
      fail(r, 'no ROUTE_SEO entry');
      continue;
    }
    if (titles.has(seo.title)) {
      fail(r, `duplicate <title> shared with ${titles.get(seo.title)}: ${JSON.stringify(seo.title)}`);
    } else titles.set(seo.title, r);
    if (descs.has(seo.description)) {
      fail(r, `duplicate meta description shared with ${descs.get(seo.description)}`);
    } else descs.set(seo.description, r);
  }
  if (titles.size === ROUTES_200.length && descs.size === ROUTES_200.length) {
    pass('uniqueness', `${ROUTES_200.length} unique titles and descriptions`);
  }
}

// ── Router ↔ route registry: a <Route path> the server does not recognise is
//    served a hard 404 on direct visits, refreshes, shared links, and crawls,
//    while still appearing to work via in-app navigation. ──────────────────
console.log('\nRouter coverage (every src/App.jsx path is a route the server serves):');
{
  // A concrete, valid instance for each parameterised route, so the check
  // exercises real slug resolution rather than the literal ":slug" template.
  const DYNAMIC_SAMPLES = {
    '/blog/:slug': `/blog/${BLOG_POSTS[0].slug}`,
    '/resources/:slug': `/resources/${BLOG_POSTS[0].slug}`,
    '/academy/programs/:slug': `/academy/programs/${ACADEMY_PROGRAMS[0].slug}`,
    '/academy/program/:slug': `/academy/program/${ACADEMY_PROGRAMS[0].slug}`,
    '/screening/tool/:toolId': `/screening/tool/${SCREENING_TOOLS[0].slug}`,
    '/evidence/:slug': `/evidence/${listCheckEvidence()[0].evidenceSlug}`,
    '/consultation/:appointmentId': '/consultation/sample-appointment-id',
    '/consultation/:appointmentId/prescription': '/consultation/sample-appointment-id/prescription',
  };

  const appSource = readFileSync(join(repoRoot, 'src/App.jsx'), 'utf8');
  const declared = [...appSource.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]);
  const paths = new Set();
  for (const raw of declared) {
    if (raw === '*') continue; // catch-all renders the 404 page by design
    paths.add(raw.startsWith('/') ? normalizePath(raw) : normalizePath(`/${raw}`));
  }

  let unresolved = 0;
  for (const p of [...paths].sort()) {
    let target = p;
    if (p.includes(':')) {
      target = DYNAMIC_SAMPLES[p];
      if (!target) {
        fail(p, 'parameterised route has no sample in DYNAMIC_SAMPLES — add one so it gets checked');
        unresolved += 1;
        continue;
      }
    }
    // A route may legitimately be served as a redirect instead of a page.
    if (ROUTE_ALIASES[normalizePath(target)]) continue;
    if (!isValidSpaRoute(target)) {
      fail(target, 'declared in src/App.jsx but not in src/lib/routes.js — would 404 on direct visit');
      unresolved += 1;
    }
  }
  if (unresolved === 0) pass('router coverage', `${paths.size} declared route paths all resolve`);
}

// ── Metadata coverage: an indexable route with no ROUTE_SEO entry falls back
//    to noindex, so a forgotten entry silently hides a real page. ──────────
console.log('\nMetadata coverage (every indexable route has its own ROUTE_SEO entry):');
{
  const missing = [...VALID_ROUTES]
    .filter((r) => !shouldNoindex(r) && !ROUTE_ALIASES[r] && !ROUTE_SEO[r])
    .sort();
  for (const r of missing) fail(r, 'indexable route with no ROUTE_SEO entry — would be served noindex');
  if (missing.length === 0) {
    pass('metadata coverage', `${VALID_ROUTES.size} routes, every indexable one has metadata`);
  }
}

// ── sitemap.xml ↔ served HTML: listing a URL in the sitemap while the page
//    says noindex, redirects, or 404s sends search engines contradictory
//    instructions about the same URL. ──────────────────────────────────────
console.log('\nSitemap integrity (every listed URL is 200, self-canonical, and indexable):');
{
  const res = await fetch(`${BASE}/sitemap.xml`);
  if (!res.ok) {
    fail('/sitemap.xml', `expected 200, got ${res.status}`);
  } else {
    const xml = await res.text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    if (locs.length === 0) fail('/sitemap.xml', 'no <loc> entries found');

    let bad = 0;
    for (const loc of locs) {
      if (!loc.startsWith(`${SITE_ORIGIN}/`)) {
        fail(loc, `not on the canonical host ${SITE_ORIGIN}`);
        bad += 1;
        continue;
      }
      const path = loc.slice(SITE_ORIGIN.length) || '/';
      const { status, html } = await fetchPage(path);
      if (status !== 200) {
        fail(path, `listed in sitemap.xml but returns ${status}`);
        bad += 1;
        continue;
      }
      if (/<meta\s+name="robots"[^>]*content="noindex/i.test(html)) {
        fail(path, 'listed in sitemap.xml but served noindex');
        bad += 1;
        continue;
      }
      const canon = extract(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i);
      if (canon !== canonicalUrl(path)) {
        fail(path, `listed in sitemap.xml but canonicalises elsewhere — got ${canon}`);
        bad += 1;
      }
    }
    if (bad === 0) pass('sitemap.xml', `${locs.length} URLs all 200, indexable, and self-canonical`);
  }
}

console.log(`\n${failures === 0 ? '✅ All checks passed.' : `❌ ${failures} check(s) failed.`}\n`);
process.exit(failures === 0 ? 0 : 1);
