/**
 * Admin operations helpers — phone/WhatsApp links and command-bar search.
 * Used by /admin to convert request-first bookings without leaving the inbox.
 */

export function digitsOnly(phone) {
  return String(phone || '').replace(/\D/g, '');
}

/** E.164-ish Indian mobile for wa.me (no plus). */
export function indiaWaNumber(phone) {
  const d = digitsOnly(phone);
  if (!d) return null;
  if (d.length === 10) return `91${d}`;
  if (d.startsWith('0') && d.length === 11) return `91${d.slice(1)}`;
  if (d.startsWith('91') && d.length >= 12) return d;
  return d;
}

export function telHref(phone) {
  const d = digitsOnly(phone);
  if (!d) return null;
  if (d.length === 10) return `tel:+91${d}`;
  if (d.startsWith('0') && d.length === 11) return `tel:+91${d.slice(1)}`;
  if (d.startsWith('91')) return `tel:+${d}`;
  return `tel:+${d}`;
}

export function patientConfirmMessage(booking) {
  const name = String(booking?.patient_name || '').trim().split(/\s+/)[0] || 'there';
  const slot = [booking?.preferred_date, booking?.preferred_time].filter(Boolean).join(' · ');
  const type = booking?.practitioner_type || 'clinician';
  const mode = booking?.mode || 'video';
  return `Hi ${name}, this is Serenest. We received your request for a ${type} (${mode})${slot ? ` on ${slot}` : ''}. We will confirm the slot shortly — you do not pay until then. Reply here if you need to change the time.`;
}

export function screeningCallbackMessage(screening) {
  const name = String(screening?.name || '').trim().split(/\s+/)[0] || 'there';
  return `Hi ${name}, this is Serenest reaching out about your recent self-screening. Would you like to talk to one of our professionals? You can request a slot at https://www.serenest.in/book — you do not pay until we confirm.`;
}

export function contactReplyMessage(message) {
  const name = String(message?.name || '').trim().split(/\s+/)[0] || 'there';
  return `Hi ${name}, this is Serenest. Thanks for writing in — how can we help you book a session?`;
}

export function waMeUrl(phone, text) {
  const num = indiaWaNumber(phone);
  if (!num) return null;
  const q = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${num}${q}`;
}

export function waMePatientUrl(booking) {
  return waMeUrl(booking?.patient_phone, patientConfirmMessage(booking));
}

export function haystack(...parts) {
  return parts.filter(Boolean).join(' ').toLowerCase();
}

/**
 * Jump-search across bookings, messages, screenings, and clinicians.
 * @returns {Array<{ kind: string, id: string, tab: string, title: string, sub: string }>}
 */
export function searchAdminRecords({ query, bookings, messages, screenings, professionals }) {
  const q = String(query || '').trim().toLowerCase();
  if (q.length < 2) return [];
  const hits = [];

  for (const b of bookings || []) {
    if (haystack(b.patient_name, b.patient_phone, b.patient_email, b.practitioner_type, b.mode, b.status, b.notes).includes(q)) {
      hits.push({
        kind: 'booking',
        id: b.id,
        tab: 'bookings',
        title: b.patient_name || 'Booking',
        sub: [b.status, b.patient_phone, b.practitioner_type].filter(Boolean).join(' · '),
      });
    }
  }

  for (const m of messages || []) {
    if (haystack(m.name, m.email, m.phone, m.subject, m.message).includes(q)) {
      hits.push({
        kind: 'message',
        id: m.id,
        tab: 'messages',
        title: m.name || 'Message',
        sub: [m.subject, m.phone || m.email].filter(Boolean).join(' · ') || 'Inbox',
      });
    }
  }

  for (const s of screenings || []) {
    if (haystack(s.name, s.phone, s.email, s.phq9_severity, s.gad7_severity).includes(q)) {
      hits.push({
        kind: 'screening',
        id: s.id,
        tab: 'screenings',
        title: s.name || 'Anonymous check-in',
        sub: [
          s.wants_callback ? 'callback' : null,
          s.phone,
          s.phq9_severity && `PHQ-9 ${s.phq9_severity}`,
        ].filter(Boolean).join(' · '),
      });
    }
  }

  for (const p of professionals || []) {
    if (haystack(p.full_name, p.email, p.phone, p.role, p.city).includes(q)) {
      hits.push({
        kind: 'clinician',
        id: p.id,
        tab: 'professionals',
        title: p.full_name || 'Clinician',
        sub: [p.role, p.city, p.phone].filter(Boolean).join(' · '),
      });
    }
  }

  return hits.slice(0, 10);
}

export function rankBookingStatus(status) {
  if (status === 'pending') return 0;
  if (status === 'confirmed') return 1;
  if (status === 'completed') return 2;
  return 3;
}

export function isUnassignedActive(booking) {
  return Boolean(booking)
    && !booking.professional_id
    && booking.status !== 'cancelled'
    && booking.status !== 'completed';
}

export function screeningHasSafetyFlag(screening) {
  const q9 = Array.isArray(screening?.phq9_answers) ? screening.phq9_answers[8] : 0;
  return Number(q9) > 0;
}
