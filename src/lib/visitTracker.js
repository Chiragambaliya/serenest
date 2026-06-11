/**
 * Lightweight visitor ping. The server dedupes per-day per-browser fingerprint.
 * Each **new** visitor that day can trigger a team WhatsApp ping (if configured);
 * email defaults to the first visitor of the day only (see NOTIFY_EACH_UNIQUE_VISITOR_EMAIL).
 *
 * - vid: random per-browser UUID stored in localStorage (cookieless)
 * - We swallow all errors — analytics must never break the page.
 */

const BASE = import.meta.env.VITE_API_URL ?? '';
const VID_KEY = 'serenest.vid';

export function getVisitorId() {
  try {
    let v = localStorage.getItem(VID_KEY);
    if (!v) {
      v = (crypto?.randomUUID?.() ?? String(Math.random()).slice(2) + Date.now().toString(36));
      localStorage.setItem(VID_KEY, v);
    }
    return v;
  } catch {
    return 'anon';
  }
}

// Already-pinged paths in this tab session — avoids duplicate beacons
const seenInTab = new Set();

export function trackVisit(path = window.location.pathname) {
  // De-dupe within a single tab/session
  if (seenInTab.has(path)) return;
  seenInTab.add(path);

  const body = JSON.stringify({
    vid: getVisitorId(),
    path,
    referrer: document.referrer || '',
  });

  // Use sendBeacon when supported — fires even on page unload.
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(`${BASE}/api/track/visit`, blob);
      return;
    }
  } catch { /* ignore */ }

  fetch(`${BASE}/api/track/visit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {});
}

export default { trackVisit, getVisitorId };
