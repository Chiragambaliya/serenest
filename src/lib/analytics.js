/**
 * Conversion event tracking — thin wrapper over GA4's gtag.
 * The gtag snippet is injected server-side only when GA_MEASUREMENT_ID is
 * set (see server.js), so this must silently no-op when analytics is off.
 * Never pass personal data (names, phones, emails) as event params.
 */
export function trackEvent(name, params = {}) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', name, params);
    }
  } catch {
    // Analytics must never break the app.
  }
}
