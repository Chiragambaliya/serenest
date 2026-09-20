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
 */

import { ROUTE_SEO, canonicalUrl, SITE_ORIGIN } from '../src/lib/seo.js';

const BASE = process.argv[2] || process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

const ROUTES_200 = [
  '/',
  '/services',
  '/pricing',
  '/book',
  '/screening',
  '/team',
  '/about',
  '/faq',
  '/guides',
  '/privacy',
  '/contact',
  '/services/psychiatry',
  '/services/therapy',
  '/services/addiction-care',
  '/corporate',
  '/careers',
  '/blog',
  '/online-psychiatrist-gujarat',
  '/screening/tool/pss-10',
  '/blog/telemedicine-guidelines-india',
  '/screening/pathway/mood-anxiety',
  '/online-psychiatrist-for-depression-india',
  '/anxiety-counselling-online-india',
  '/adhd-assessment-online-india',
  '/ocd-treatment-online-india',
  '/phq-9-depression-screening',
  '/gad-7-anxiety-screening',
  '/online-psychiatrist-prescription-india',
  '/patient/find-professional',
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
  ['/gujarati-speaking-psychiatrist-online', 'https://www.serenest.in/online-psychiatrist-gujarat'],
  ['/online-psychiatrist-ahmedabad', 'https://www.serenest.in/online-psychiatrist-gujarat'],
  ['/online-psychiatrist-surat', 'https://www.serenest.in/online-psychiatrist-gujarat'],
  ['/online-psychiatrist-rajkot', 'https://www.serenest.in/online-psychiatrist-gujarat'],
  ['/resources', 'https://www.serenest.in/blog'],
  ['/resources/telemedicine-guidelines-india', 'https://www.serenest.in/blog/telemedicine-guidelines-india'],
  ['/disclaimer', 'https://www.serenest.in/emergency-disclaimer'],
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
  '/academy',
  '/academy/',
  '/academy/programs',
  '/academy/programs/clinical-excellence',
  '/academy/login',
  '/academy/learn',
];
const ROUTES_404 = [
  '/this-route-does-not-exist',
  '/random/garbage',
  '/blog/not-a-real-post',
];

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

function decodeHtml(s) {
  return String(s || '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
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

  // Values
  const title = extract(html, /<title>([^<]*)<\/title>/i);
  if (decodeHtml(title) !== expected.title) {
    fail(path, `title mismatch — got ${JSON.stringify(title)}`);
  }

  const desc = extract(html, /<meta\s+name="description"\s+content="([^"]*)"/i);
  if (decodeHtml(desc) !== expected.description) fail(path, `description mismatch — got ${JSON.stringify(desc)}`);

  const canon = extract(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i);
  if (canon !== canonical) fail(path, `canonical mismatch — expected ${canonical}, got ${canon}`);

  const hreflang = extract(html, /<link\s+rel="alternate"\s+hreflang="en-IN"\s+href="([^"]*)"/i);
  if (hreflang !== canonical) fail(path, `hreflang en-IN mismatch — got ${JSON.stringify(hreflang)}`);

  const ogLocale = extract(html, /<meta\s+property="og:locale"\s+content="([^"]*)"/i);
  if (ogLocale !== 'en_IN') fail(path, `og:locale mismatch — got ${JSON.stringify(ogLocale)}`);

  const ogUrl = extract(html, /<meta\s+property="og:url"\s+content="([^"]*)"/i);
  if (ogUrl !== canonical) fail(path, `og:url mismatch — expected ${canonical}, got ${ogUrl}`);

  const ogImage = extract(html, /<meta\s+property="og:image"\s+content="([^"]*)"/i);
  if (ogImage !== `${SITE_ORIGIN}/og-image.jpg`) {
    fail(path, `og:image mismatch — got ${JSON.stringify(ogImage)}`);
  }

  const ogTitle = extract(html, /<meta\s+property="og:title"\s+content="([^"]*)"/i);
  if (decodeHtml(ogTitle) !== (expected.ogTitle || expected.title)) {
    fail(path, `og:title mismatch — got ${JSON.stringify(ogTitle)}`);
  }

  const ogDesc = extract(html, /<meta\s+property="og:description"\s+content="([^"]*)"/i);
  if (decodeHtml(ogDesc) !== (expected.ogDescription || expected.description)) {
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

console.log('\nSitemap coverage:');
{
  const { status, html } = await fetchPage('/sitemap.xml');
  if (status !== 200) {
    fail('/sitemap.xml', `expected 200, got ${status}`);
  } else {
    const mustInclude = [
      `${SITE_ORIGIN}/`,
      `${SITE_ORIGIN}/contact`,
      `${SITE_ORIGIN}/services/psychiatry`,
      `${SITE_ORIGIN}/online-psychiatrist-gujarat`,
      `${SITE_ORIGIN}/blog/telemedicine-guidelines-india`,
      `${SITE_ORIGIN}/screening`,
      `${SITE_ORIGIN}/patient/find-professional`,
    ];
    for (const loc of mustInclude) {
      if (!html.includes(`<loc>${loc}</loc>`)) fail('/sitemap.xml', `missing ${loc}`);
    }
    if (html.includes('/academy')) fail('/sitemap.xml', 'still lists retired Academy URLs');
    if (!html.includes('<lastmod>')) fail('/sitemap.xml', 'missing lastmod');
    if (mustInclude.every((loc) => html.includes(`<loc>${loc}</loc>`)) && html.includes('<lastmod>') && !html.includes('/academy')) {
      pass('/sitemap.xml', 'includes core Care URLs + lastmod, no Academy');
    }
  }
}

console.log(`\n${failures === 0 ? '✅ All checks passed.' : `❌ ${failures} check(s) failed.`}\n`);
process.exit(failures === 0 ? 0 : 1);
