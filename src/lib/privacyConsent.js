export const PRIVACY_CHOICE_KEY = 'serenest_privacy_consent';
export const PRIVACY_CHOICE_EVENT = 'serenest:privacy-choice';
export const OPEN_PRIVACY_EVENT = 'serenest:open-privacy';

const VALID_CHOICES = new Set(['essential', 'analytics']);

export function getPrivacyChoice() {
  try {
    const choice = localStorage.getItem(PRIVACY_CHOICE_KEY);
    return VALID_CHOICES.has(choice) ? choice : null;
  } catch {
    return null;
  }
}

export function hasAnalyticsConsent() {
  return getPrivacyChoice() === 'analytics';
}

export function setPrivacyChoice(choice) {
  if (!VALID_CHOICES.has(choice)) return;

  try {
    localStorage.setItem(PRIVACY_CHOICE_KEY, choice);
  } catch {
    // The preference still applies for this page even when storage is blocked.
  }

  window.dispatchEvent(new CustomEvent(PRIVACY_CHOICE_EVENT, { detail: { choice } }));

  if (choice === 'analytics') {
    loadAnalytics();
  } else {
    disableAnalytics();
    try { localStorage.removeItem('serenest.vid'); } catch { /* ignore */ }
  }
}

export function openPrivacyChoices() {
  window.dispatchEvent(new Event(OPEN_PRIVACY_EVENT));
}

export function loadAnalytics() {
  if (typeof window === 'undefined' || !hasAnalyticsConsent()) return;
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

function expireCookie(name) {
  document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
  document.cookie = `${name}=; Max-Age=0; path=/; domain=${window.location.hostname}; SameSite=Lax`;
}

export function disableAnalytics() {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', { analytics_storage: 'denied' });
  }

  document.querySelector('#serenest-ga-script')?.remove();
  Object.keys(document.cookie ? document.cookie.split(';').reduce((all, item) => {
    const name = item.split('=')[0]?.trim();
    if (name) all[name] = true;
    return all;
  }, {}) : {})
    .filter((name) => name === '_ga' || name.startsWith('_ga_'))
    .forEach(expireCookie);
}
