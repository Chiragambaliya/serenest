/**
 * Conversion event tracking — thin wrapper over GA4's gtag.
 * Analytics is loaded only after the visitor opts in.
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
