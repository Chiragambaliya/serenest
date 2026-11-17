/**
 * Shared patient-facing contact, booking-step, and conversion helpers.
 * Keep phone/WhatsApp in one place so header, dock, booking, and contact stay in sync.
 */

export const CARE_PHONE_DISPLAY = '+91 77779 36367';
export const CARE_PHONE_LOCAL = '7777936367';
export const CARE_TEL_HREF = 'tel:+917777936367';
export const CARE_WA_NUMBER = '917777936367';
export const CARE_WA_PREFILL = "Hi, I'd like to book a session with Serenest";

export function careWaHref(text = CARE_WA_PREFILL) {
  return `https://wa.me/${CARE_WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

/** Last 10 digits of an Indian mobile, or empty string. */
export function indiaMobileDigits(phone) {
  const d = String(phone || '').replace(/\D/g, '');
  if (d.length === 12 && d.startsWith('91')) return d.slice(2);
  if (d.length === 11 && d.startsWith('0')) return d.slice(1);
  if (d.length === 10) return d;
  return d.slice(-10);
}

export function isIndiaMobile(phone) {
  const ten = indiaMobileDigits(phone);
  return ten.length === 10 && /^[6-9]/.test(ten);
}

/**
 * Canonical digits for a care lead, with country code.
 * A bare 10-digit Indian mobile (6–9) is stored as 91 plus those digits.
 * Every other country must include its calling code (+1, +44, 00…).
 * Returns null when the number is too short, too long, or missing a country code.
 */
export function normalizeLeadPhone(raw) {
  const text = String(raw ?? '').trim();
  if (!text) return null;
  const compact = text.replace(/\s/g, '');
  const explicitIntl = compact.startsWith('+') || compact.startsWith('00');
  let digits = text.replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('00')) digits = digits.slice(2);

  if (/^910[6-9]\d{9}$/.test(digits)) {
    digits = `91${digits.slice(3)}`;
  }

  if (!explicitIntl && /^0[6-9]\d{9}$/.test(digits)) {
    digits = `91${digits.slice(1)}`;
  } else if (!explicitIntl && /^[6-9]\d{9}$/.test(digits)) {
    digits = `91${digits}`;
  } else if (!explicitIntl && /^91[6-9]\d{9}$/.test(digits)) {
    // Already includes the India code, typed without a plus.
  } else if (!explicitIntl && digits.length <= 10) {
    return null;
  }

  if (!/^[1-9]\d{7,14}$/.test(digits)) return null;
  return digits;
}

export function isLeadPhone(phone) {
  return Boolean(normalizeLeadPhone(phone));
}

/** Display form: +91 98765 43210, or +{country}{number} for everywhere else. */
export function formatLeadPhone(phone) {
  const canonical = normalizeLeadPhone(phone);
  if (!canonical) {
    const digits = String(phone || '').replace(/\D/g, '');
    return digits ? `+${digits}` : '';
  }
  if (canonical.startsWith('91') && canonical.length === 12) {
    const local = canonical.slice(2);
    return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
  }
  return `+${canonical}`;
}

/** Keys that can match this person's own bookings, including older 10-digit India rows. */
export function leadPhoneLookupKeys(raw) {
  const keys = new Set();
  const digits = String(raw || '').replace(/\D/g, '');
  const canonical = normalizeLeadPhone(raw);
  if (digits) keys.add(digits);
  if (canonical) keys.add(canonical);
  if (canonical?.startsWith('91') && canonical.length === 12) keys.add(canonical.slice(2));
  if (digits.length === 12 && digits.startsWith('91')) keys.add(digits.slice(2));
  if (digits.length === 10 && /^[6-9]/.test(digits)) keys.add(`91${digits}`);
  return [...keys];
}

export const LEAD_PHONE_PLACEHOLDER = '98765 43210 or +1 415 555 2671';

export function sanitizeLeadPhoneInput(value) {
  const raw = String(value || '').replace(/[^\d+\s()-]/g, '').slice(0, 22);
  const plus = raw.trimStart().startsWith('+');
  return `${plus ? '+' : ''}${raw.replace(/\+/g, '')}`;
}

export function isPatientNameValid(name) {
  return String(name || '').trim().length >= 2;
}

export function canContinueContactStep({ name, phone, consent }) {
  return isPatientNameValid(name) && isLeadPhone(phone) && Boolean(consent);
}

/** Three-step request-first booking: contact, then care+slot, then confirm. */
export const BOOKING_STEPS = [
  { id: 1, label: 'You' },
  { id: 2, label: 'Care' },
  { id: 3, label: 'Confirm' },
];

export function hideReachDock(pathname) {
  const p = String(pathname || '');
  return (
    p.startsWith('/book') ||
    p.startsWith('/professionals/apply') ||
    p.startsWith('/admin') ||
    p.startsWith('/consultation')
  );
}

export const TRUST_POINTS = [
  { id: 'pay', label: 'Pay after we confirm' },
  { id: 'private', label: 'Private sessions' },
  { id: 'world', label: 'Care from anywhere' },
  { id: 'verified', label: 'Verified clinicians' },
];
