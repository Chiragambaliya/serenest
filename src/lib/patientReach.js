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

/** One-screen request. Name, phone, and consent are required; care and time start filled in. */
export const BOOKING_STEPS = [
  { id: 1, label: 'Request' },
];

/** Preferred times offered on the booking form. Values stay 24-hour for the API. */
export const BOOKING_TIMES = ['10:00', '11:30', '13:00', '15:30', '17:00', '19:00'];

export function localDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** "10:00" → "10:00 am". Unknown strings are returned unchanged. */
export function formatSlotTime(hhmm) {
  const [hRaw, mRaw] = String(hhmm || '').split(':');
  const h = Number(hRaw);
  const m = Number(mRaw);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return String(hhmm || '');
  const suffix = h >= 12 ? 'pm' : 'am';
  const hr = h % 12 || 12;
  return `${hr}:${String(m).padStart(2, '0')} ${suffix}`;
}

/**
 * The next few days that still have an open time.
 * Today drops slots that start inside `leadMinutes`.
 */
export function upcomingSlots(now = new Date(), { days = 5, times = BOOKING_TIMES, leadMinutes = 30 } = {}) {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const cutoff = now.getHours() * 60 + now.getMinutes() + leadMinutes;
  const out = [];

  for (let offset = 0; offset < 12 && out.length < days; offset += 1) {
    const dt = new Date(start);
    dt.setDate(start.getDate() + offset);
    const open = times.filter((slot) => {
      if (offset > 0) return true;
      const [h, m] = slot.split(':').map(Number);
      return h * 60 + m >= cutoff;
    });
    if (!open.length) continue;
    let label = dt.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    if (offset === 0) label = 'Today';
    else if (offset === 1) label = 'Tomorrow';
    out.push({ key: localDateKey(dt), label, times: open });
  }

  return out;
}

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
  { id: 'language', label: 'Ask for English, Hindi, or Gujarati' },
  { id: 'verified', label: 'Verified clinicians' },
];

/**
 * Reasons a patient visitor can start from. The request link opens booking
 * with that reason; `learn` is the longer page for people who want to read first.
 */
export const PATIENT_REASONS = [
  {
    id: 'low-mood',
    label: 'Low mood',
    practitioner: 'psychiatrist',
    learn: '/online-psychiatrist-for-depression-india',
    note: 'Starting point: low mood.',
  },
  {
    id: 'anxiety',
    label: 'Anxiety',
    practitioner: 'therapist',
    learn: '/anxiety-counselling-online-india',
    note: 'Starting point: anxiety.',
  },
  {
    id: 'adhd',
    label: 'ADHD',
    practitioner: 'psychiatrist',
    learn: '/adhd-assessment-online-india',
    note: 'Starting point: ADHD.',
  },
  {
    id: 'ocd',
    label: 'OCD',
    practitioner: 'psychiatrist',
    learn: '/ocd-treatment-online-india',
    note: 'Starting point: OCD.',
  },
  {
    id: 'addiction',
    label: 'Addiction',
    practitioner: 'psychiatrist',
    learn: '/services/addiction-care',
    note: 'Starting point: addiction and recovery.',
  },
  {
    id: 'sleep-stress',
    label: 'Sleep and stress',
    practitioner: 'therapist',
    learn: '/screening',
    note: 'Starting point: sleep and stress.',
  },
  {
    id: 'psychiatry',
    label: 'Psychiatry',
    practitioner: 'psychiatrist',
    note: 'Starting point: psychiatry.',
    chip: false,
  },
  {
    id: 'therapy',
    label: 'Therapy',
    practitioner: 'therapist',
    note: 'Starting point: therapy or counselling.',
    chip: false,
  },
  {
    id: 'video',
    label: 'Video, audio, or chat',
    practitioner: 'psychiatrist',
    note: 'Starting point: a video, audio, or chat session.',
    chip: false,
  },
];

export function patientReasonById(id) {
  const key = String(id || '').trim().toLowerCase();
  return PATIENT_REASONS.find((reason) => reason.id === key) || null;
}

export function bookHrefForReason(id) {
  const reason = patientReasonById(id);
  if (!reason) return '/book';
  return `/book?reason=${encodeURIComponent(reason.id)}`;
}
