/**
 * Static assets + SPA fallback with route-specific SEO injection.
 * Every HTML response goes through the SEO injector so the initial HTML
 * carries route-correct title, meta description, canonical, Open Graph,
 * and JSON-LD — and unknown paths return real 404/410 status codes.
 */
import express from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { DIST_DIR, GA_ID } from './config.js';
import { renderSeoHead, shouldNoindex, ROUTE_SEO, ROUTE_ALIASES, SITE_ORIGIN } from '../lib/seo.js';

// Routes the SPA actually handles. Anything outside this set should
// return a real 404/410 status code instead of a soft-200 SPA shell.
// Keep this in sync with src/App.jsx.
const VALID_ROUTES = new Set([
  '/',
  '/preview',
  '/about',
  '/team',
  '/services',
  '/professionals',
  '/professionals/learning',
  '/professionals/resources',
  '/professionals/guidelines',
  '/professionals/apply',
  '/professionals/terms',
  '/professionals/code-of-conduct',
  '/professionals/login',
  '/professionals/portal',
  '/book',
  '/pricing',
  '/faq',
  '/guides',
  '/blog',
  '/privacy',
  '/terms',
  '/patient/terms',
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
  '/admin',
  '/patient/find-professional',
  '/patient/login',
  '/patient/dashboard',
  '/careers',
  '/corporate',
  '/partner',
  '/screening',
  '/screening/pathway/mood-anxiety',
  '/burnout-check',
  '/evidence',
  '/academy',
  '/academy/login',
  '/academy/learn',
  '/academy/learn/pharmacology',
  '/academy/learn/psychology',
  '/online-psychiatrist-consultation-india',
  '/online-psychiatrist-for-depression-india',
  '/anxiety-counselling-online-india',
  '/adhd-assessment-online-india',
  '/ocd-treatment-online-india',
  '/online-psychiatrist-gujarat',
  '/phq-9-depression-screening',
  '/gad-7-anxiety-screening',
  '/online-psychiatrist-prescription-india',
]);

// Dynamic-route prefixes that the SPA legitimately serves.
const VALID_PREFIXES = ['/blog/', '/consultation/', '/academy/program/', '/screening/tool/', '/evidence/'];

// Known stale URLs surfaced in search from prior site contents. These have no
// healthcare replacement, so return 410 Gone to ask Google to drop them.
// Patterns are anchored and accept optional trailing slashes.
const GONE_PATTERNS = [
  /^\/kotagiri\/?$/i,
  /^\/travelx-tour-guides-section\/?$/i,
  /^\/\d{4}\/\d{2}\/\d{2}\/[^?#]*$/, // old WP-style dated post URLs (with or without trailing slash)
  /^\/category(\/|$)/i,
  /^\/tag(\/|$)/i,
  /^\/wp-/i,
];

function normalize(pathname) {
  if (pathname === '/') return '/';
  return pathname.replace(/\/+$/, '');
}

function isValidSpaRoute(pathname) {
  const norm = normalize(pathname);
  if (VALID_ROUTES.has(norm)) return true;
  return VALID_PREFIXES.some((p) => pathname.startsWith(p) && pathname.length > p.length);
}

// ── SEO injection ─────────────────────────────────────────────
// Read the built dist/index.html once and substitute the sentinel block per
// request so the initial HTML response carries route-correct title, meta
// description, canonical, Open Graph, and JSON-LD. Falls back gracefully if
// the template is missing (e.g. before first build).
const SEO_SENTINEL = /<!--SEO_HEAD_START-->[\s\S]*?<!--SEO_HEAD_END-->/;
let templateCache = null;
function loadTemplate() {
  if (templateCache !== null) return templateCache;
  try {
    templateCache = readFileSync(join(DIST_DIR, 'index.html'), 'utf8');
  } catch {
    templateCache = '';
  }
  return templateCache;
}
// Disable cache in development so edits to index.html are picked up
// without a server restart.
if (process.env.NODE_ENV !== 'production') {
  templateCache = null;
  // re-read every request in dev
  loadTemplate.__dev = true;
}

function seoRouteKey(pathname) {
  const norm = normalize(pathname);
  // Map non-indexable SPA routes to a generic noindex SEO entry; only routes
  // present in ROUTE_SEO get their own bespoke title/description.
  return ROUTE_SEO[norm] ? norm : null;
}

const GA_META = GA_ID
  ? `<meta name="serenest-ga-id" content="${GA_ID}" />\n`
  : '';

function buildHtmlForRequest(pathname, { status }) {
  const tpl = loadTemplate.__dev
    ? readFileSync(join(DIST_DIR, 'index.html'), 'utf8')
    : loadTemplate();
  if (!tpl) return '';

  const routeKey = seoRouteKey(pathname);
  const noindex = status === 404 || status === 410 || shouldNoindex(pathname) || !routeKey;
  // For unknown/410 paths, use the homepage SEO entry as a baseline but mark
  // noindex,nofollow so search engines don't index the 404 UI.
  const renderPath = routeKey || '/';
  const replacement = `<!--SEO_HEAD_START-->\n    ${renderSeoHead(renderPath, { noindex })}\n    <!--SEO_HEAD_END-->`;
  let html = tpl.replace(SEO_SENTINEL, replacement);
  if (GA_META) html = html.replace('</head>', `${GA_META}</head>`);

  // Admin is a separate installable PWA: on /admin routes we swap the web app
  // manifest, theme colour and title so it installs as its own "Serenest Admin"
  // app that opens straight to the dashboard in full-screen (dark chrome).
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    html = html
      .replace('<link rel="manifest" href="/manifest.json" />', '<link rel="manifest" href="/admin-manifest.json" />')
      .replace('<meta name="apple-mobile-web-app-title" content="Serenest" />', '<meta name="apple-mobile-web-app-title" content="Serenest Admin" />')
      .replace('<meta name="theme-color" content="#3c4a2c" />', '<meta name="theme-color" content="#141c25" />');
  }
  return html;
}

function sendHtml(req, res, status) {
  const html = buildHtmlForRequest(req.path, { status });
  if (!html) {
    // Template missing — fall back to plain file send so the user still
    // sees something rather than an error.
    return res.status(status).sendFile(join(DIST_DIR, 'index.html'));
  }
  res.status(status);
  res.set('Content-Type', 'text/html; charset=utf-8');
  if (req.method === 'HEAD') return res.end();
  return res.send(html);
}

export function registerSpaHandlers(app) {
  // Fingerprinted assets (/assets/*) get immutable caching — Vite content-hashes the filenames.
  app.use('/assets', express.static(join(DIST_DIR, 'assets'), {
    index: false,
    maxAge: '1y',
    immutable: true,
  }));

  // Static for /favicon.svg, /sitemap.xml, /manifest.json, etc. The {index:false} guard
  // prevents express.static from serving dist/index.html directly for "/" — we
  // want every HTML response (including "/") to go through the SEO injector.
  app.use(express.static(DIST_DIR, { index: false }));

  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    const pathname = req.path;

    // Keyword-variant aliases → 301 to the canonical landing page.
    const aliasTarget = ROUTE_ALIASES[normalize(pathname)] || ROUTE_ALIASES[pathname];
    if (aliasTarget) {
      res.set('Location', `${SITE_ORIGIN}${aliasTarget}`);
      return res.status(301).end();
    }

    if (GONE_PATTERNS.some((re) => re.test(pathname))) {
      return sendHtml(req, res, 410);
    }
    if (!isValidSpaRoute(pathname)) {
      return sendHtml(req, res, 404);
    }
    return sendHtml(req, res, 200);
  });
}
