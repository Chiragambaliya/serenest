/*
 * Serenest service worker — makes the site installable and resilient offline.
 *
 * Safety rules for a clinical app:
 *  - /api/* is NEVER cached or served from cache (bookings, screening, admin,
 *    prescriptions, chat). These always hit the network so users never see
 *    stale health data. Offline, they fail as they would without a SW.
 *  - HTML navigations are network-first (fresh content wins) with an offline
 *    fallback to the cached app shell so the SPA can still boot.
 *  - Fingerprinted build assets (/assets/*, content-hashed by Vite) and a few
 *    static files are cache-first — they're immutable, so this is safe and fast.
 *  - Cross-origin requests (Google Fonts, Supabase, etc.) are left untouched.
 */

const VERSION = 'serenest-v1';
const SHELL_CACHE = `${VERSION}-shell`;
const ASSET_CACHE = `${VERSION}-assets`;

// The app shell + static files worth precaching for an instant / offline boot.
const SHELL_URL = '/';
const PRECACHE_URLS = [SHELL_URL, '/favicon.svg', '/manifest.json', '/icon-1024.jpg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      // Cache each URL independently so one failure doesn't abort the install.
      await Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(url)));
      // Activate this worker immediately rather than waiting for old tabs to close.
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Drop caches from previous versions.
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== SHELL_CACHE && key !== ASSET_CACHE)
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

// Allow the page to trigger an immediate update (see registration in main.jsx).
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

function isAssetRequest(url) {
  return (
    url.pathname.startsWith('/assets/') ||
    url.pathname === '/favicon.svg' ||
    url.pathname === '/manifest.json' ||
    url.pathname === '/admin-manifest.json' ||
    url.pathname === '/icon-1024.jpg' ||
    url.pathname === '/icon-maskable.svg'
  );
}

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only ever handle GETs — never interfere with POST/PUT/DELETE.
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Leave cross-origin requests (fonts, Supabase, analytics) to the browser.
  if (url.origin !== self.location.origin) return;

  // Never touch the API: health data must always be live, never cached.
  if (url.pathname === '/api' || url.pathname.startsWith('/api/')) return;

  // HTML navigations: network-first, fall back to the cached shell offline.
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request, url));
    return;
  }

  // Immutable build assets: cache-first for speed.
  if (isAssetRequest(url)) {
    event.respondWith(cacheFirst(request));
  }
});

async function handleNavigation(request, url) {
  try {
    const response = await fetch(request);
    // Keep the homepage shell fresh as our offline fallback. We only store the
    // "/" shell (not per-route or /admin HTML) to avoid caching sensitive views.
    if (response.ok && url.pathname === SHELL_URL) {
      const cache = await caches.open(SHELL_CACHE);
      cache.put(SHELL_URL, response.clone());
    }
    return response;
  } catch (err) {
    const cache = await caches.open(SHELL_CACHE);
    const cached = (await cache.match(request)) || (await cache.match(SHELL_URL));
    if (cached) return cached;
    return new Response(
      '<!doctype html><meta charset="utf-8"><title>Offline</title>' +
        '<style>body{font-family:system-ui,sans-serif;max-width:32rem;margin:20vh auto;padding:0 1.5rem;color:#2b2b2b;text-align:center}h1{color:#3c4a2c}</style>' +
        '<h1>You’re offline</h1><p>Serenest needs a connection to load this page. Please reconnect and try again.</p>',
      { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    );
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (err) {
    // Nothing cached and network failed — surface the failure to the app.
    return cached || Response.error();
  }
}
