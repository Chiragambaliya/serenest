export const PRIVACY_CHOICE_KEY = 'serenest_privacy_consent';
export const PRIVACY_CHOICE_EVENT = 'serenest:privacy-choice';
export const OPEN_PRIVACY_EVENT = 'serenest:open-privacy';

/**
 * Analytics is always enabled across Serenest Care (first-party visit tracking
 * + privacy-safe GA4 when configured; ad storage and ad personalization remain
 * permanently denied).
 */
export function getPrivacyChoice() {
  return 'analytics';
}

export function hasAnalyticsConsent() {
  return true;
}

export function setPrivacyChoice() {
  try {
    localStorage.setItem(PRIVACY_CHOICE_KEY, 'analytics');
  } catch {
    // Ignore storage restrictions
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PRIVACY_CHOICE_EVENT, { detail: { choice: 'analytics' } }));
  }

  loadAnalytics();
}

export function openPrivacyChoices() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(OPEN_PRIVACY_EVENT));
  }
}

export function loadAnalytics() {
  if (typeof window === 'undefined') return;
  if (document.getElementById('serenest-ga-script')) return;

  const measurementId = document
    .querySelector('meta[name="serenest-ga-id"]')
    ?.getAttribute('content');

  if (!measurementId || !/^[A-Za-z0-9-]{4,20}$/.test(measurementId)) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  const script = document.createElement('script');
  script.id = 'serenest-ga-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
}

export function disableAnalytics() {
  // Analytics is always kept on per platform configuration.
  loadAnalytics();
}
