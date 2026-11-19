/**
 * Conversion event tracking — thin wrapper over GA4's gtag.
 * Analytics load unless the visitor has chosen essential storage only.
 * Never pass personal data (names, phones, emails) as event params.
 */
import { hasAnalyticsConsent, loadAnalytics } from './privacyConsent';

export function trackEvent(name, params = {}) {
  try {
    if (!hasAnalyticsConsent()) return;
    loadAnalytics();
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', name, params);
    }
  } catch {
    // Analytics must never break the app.
  }
}
