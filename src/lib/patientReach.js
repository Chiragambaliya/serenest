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

export function isPatientNameValid(name) {
  return String(name || '').trim().length >= 2;
}

export function canContinueContactStep({ name, phone, consent }) {
  return isPatientNameValid(name) && isIndiaMobile(phone) && Boolean(consent);
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
  { id: 'india', label: 'Care from anywhere in India' },
  { id: 'verified', label: 'Verified clinicians' },
];
