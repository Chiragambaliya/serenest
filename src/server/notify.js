/**
 * Notification helper — team alerts + optional patient confirmations.
 *
 * Email (free tier — Resend, 3k/mo):
 *   RESEND_API_KEY, NOTIFY_FROM, NOTIFY_EMAIL  → team inbox
 *   Same key sends patient confirmations when they leave an email (booking / screening).
 *   Verify your domain in Resend for best deliverability to arbitrary addresses.
 *
 * Team WhatsApp (free — CallMeBot, personal notifications):
 *   https://www.callmebot.com/blog/free-api-whatsapp-messages/
 *   Link your WhatsApp, get an apikey, then set:
 *   CALLMEBOT_WHATSAPP_APIKEY, CALLMEBOT_WHATSAPP_PHONE (digits only, e.g. 917777936367)
 *   → You get a short WhatsApp ping for each *new* unique visitor that day, and when someone opens Serenest Guide.
 *
 * Visitor email: first unique visitor of each UTC day by default. Set NOTIFY_EACH_UNIQUE_VISITOR_EMAIL=true
 * to receive an email for every unique visitor as well (noisy on busy days).
 *
 * Optional: TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID for Telegram backup.
 *
 * Failures are swallowed — notifications must never break user flow.
 */

const RESEND_KEY  = process.env.RESEND_API_KEY;
const NOTIFY_FROM = process.env.NOTIFY_FROM  || 'Serenest Alerts <onboarding@resend.dev>';
const NOTIFY_TO   = process.env.NOTIFY_EMAIL;

/** Shown in HTML email footers (legal entity). */
const LEGAL_ENTITY = 'Serenest Education Pvt Ltd';

const CALLMEBOT_KEY   = process.env.CALLMEBOT_WHATSAPP_APIKEY;
const CALLMEBOT_PHONE = process.env.CALLMEBOT_WHATSAPP_PHONE
  ? String(process.env.CALLMEBOT_WHATSAPP_PHONE).replace(/\D/g, '')
  : '';

// Optional secondary channel — kept silent unless explicitly enabled.
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_CHAT  = process.env.TELEGRAM_CHAT_ID;

// ── Internal: send email via Resend ───────────────────────────────
/** @param {{ subject: string, html: string, urgent?: boolean, to?: string | string[] }} opts If `to` omitted, uses NOTIFY_EMAIL. */
async function sendEmail({ subject, html, urgent = false, to = null }) {
  if (!RESEND_KEY) return false;

  let recipients = [];
  if (to) {
    recipients = (Array.isArray(to) ? to : String(to).split(',')).map((s) => s.trim()).filter(Boolean);
  } else if (NOTIFY_TO) {
    recipients = NOTIFY_TO.split(',').map((s) => s.trim()).filter(Boolean);
  }
  if (!recipients.length) return false;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_KEY}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        from:    NOTIFY_FROM,
        to:      recipients,
        subject: urgent ? `🚨 URGENT — ${subject}` : subject,
        html:    wrapHtml(html, urgent),
      }),
    });

    if (!r.ok) {
      const txt = await r.text().catch(() => '');
      console.warn('[notify] Resend failed:', r.status, txt.slice(0, 200));
      return false;
    }
    return true;
  } catch (e) {
    console.warn('[notify] Resend error:', e.message);
    return false;
  }
}

/** Short plain-text ping to your WhatsApp via CallMeBot (no Meta Business setup). */
async function sendTeamWhatsApp(text) {
  if (!CALLMEBOT_KEY || !CALLMEBOT_PHONE) return false;
  const safe = String(text).slice(0, 3500);
  try {
    const url =
      'https://api.callmebot.com/whatsapp.php?' +
      `phone=${encodeURIComponent(CALLMEBOT_PHONE)}&text=${encodeURIComponent(safe)}&apikey=${encodeURIComponent(CALLMEBOT_KEY)}`;
    const r = await fetch(url);
    const body = await r.text().catch(() => '');
    if (!r.ok || /error/i.test(body)) {
      console.warn('[notify] CallMeBot WhatsApp:', r.status, body.slice(0, 120));
      return false;
    }
    return true;
  } catch (e) {
    console.warn('[notify] CallMeBot error:', e.message);
    return false;
  }
}

// ── Internal: optional Telegram backup ────────────────────────────
async function sendTelegram(text, { urgent = false, silent = false } = {}) {
  if (!TG_TOKEN || !TG_CHAT) return false;
  try {
    const r = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT,
        text: urgent ? '🚨 ' + text : text,
        parse_mode: 'HTML',
        disable_notification: silent,
        disable_web_page_preview: true,
      }),
    });
    return r.ok;
  } catch { return false; }
}

// ── HTML helpers ──────────────────────────────────────────────────
function esc(v) {
  if (v === null || v === undefined || v === '') return '—';
  return String(v).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function fmtPhone(p) {
  if (!p) return '—';
  const clean = String(p).replace(/[^\d]/g, '');
  if (clean.length === 10) return `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`;
  return clean;
}

function row(label, value) {
  if (value === undefined || value === null || value === '' || value === '—') return '';
  return `<tr><td style="padding:6px 14px 6px 0;color:#64748b;font-size:13px;white-space:nowrap;vertical-align:top">${esc(label)}</td><td style="padding:6px 0;font-size:14px;color:#0f172a">${value}</td></tr>`;
}

function wrapHtml(inner, urgent) {
  const accent = urgent ? '#dc2626' : '#0f766e';
  return `<!doctype html><html><body style="margin:0;padding:24px 12px;background:#f0fdfa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table role="presentation" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 20px rgba(15,118,110,0.08)">
  <tr><td style="background:linear-gradient(135deg,${accent},#0c4a45);padding:18px 24px;color:#ffffff">
    <div style="font-size:13px;letter-spacing:0.08em;text-transform:uppercase;opacity:.85">Serenest</div>
    <div style="font-size:18px;font-weight:700;margin-top:2px">${urgent ? 'Urgent — please respond today' : 'New activity on your site'}</div>
  </td></tr>
  <tr><td style="padding:22px 24px;color:#0f172a;font-size:14px;line-height:1.55">
    ${inner}
  </td></tr>
  <tr><td style="padding:14px 24px 22px;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px">
    <a href="https://serenest.in/admin" style="color:${accent};text-decoration:none;font-weight:600">Open admin dashboard →</a>
    <span style="float:right">${new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
    <div style="clear:both;padding-top:12px;margin-top:12px;border-top:1px solid #f1f5f9;font-size:11px;color:#94a3b8">${LEGAL_ENTITY}</div>
  </td></tr>
</table>
</body></html>`;
}

function wrapPatientHtml(inner, urgent) {
  const accent = urgent ? '#dc2626' : '#0f766e';
  const head = urgent
    ? 'Important message from Serenest'
    : 'Thank you for connecting with Serenest';
  return `<!doctype html><html><body style="margin:0;padding:24px 12px;background:#f0fdfa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table role="presentation" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 20px rgba(15,118,110,0.08)">
  <tr><td style="background:linear-gradient(135deg,${accent},#0c4a45);padding:18px 24px;color:#ffffff">
    <div style="font-size:13px;letter-spacing:0.08em;text-transform:uppercase;opacity:.85">Serenest</div>
    <div style="font-size:18px;font-weight:700;margin-top:2px">${head}</div>
  </td></tr>
  <tr><td style="padding:22px 24px;color:#0f172a;font-size:14px;line-height:1.55">
    ${inner}
  </td></tr>
  <tr><td style="padding:14px 24px 22px;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px;line-height:1.5">
    <a href="https://serenest.in" style="color:${accent};text-decoration:none;font-weight:600">serenest.in</a>
    <span style="display:block;margin-top:8px">Clinical telepsychiatry for India. Reply to this email only if it was sent from a staffed address.</span>
    <span style="display:block;margin-top:10px;font-size:11px;color:#94a3b8">${LEGAL_ENTITY}</span>
  </td></tr>
</table>
</body></html>`;
}

async function sendPatientEmail({ subject, html, urgent = false, to }) {
  if (!RESEND_KEY || !to?.trim()) return false;
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_KEY}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        from:    NOTIFY_FROM,
        to:      [to.trim()],
        subject: urgent ? `Important — ${subject}` : subject,
        html:    wrapPatientHtml(html, urgent),
      }),
    });
    if (!r.ok) {
      const txt = await r.text().catch(() => '');
      console.warn('[notify] Resend (patient) failed:', r.status, txt.slice(0, 200));
      return false;
    }
    return true;
  } catch (e) {
    console.warn('[notify] Resend (patient) error:', e.message);
    return false;
  }
}

function table(rows) {
  return `<table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:6px 0">${rows.filter(Boolean).join('')}</table>`;
}

function callouts({ phone, email }) {
  const btns = [];
  if (phone) {
    const clean = String(phone).replace(/[^\d]/g, '');
    btns.push(`<a href="tel:${clean}" style="display:inline-block;background:#0f766e;color:#fff;text-decoration:none;padding:9px 16px;border-radius:8px;font-size:13px;font-weight:600;margin:4px 6px 0 0">📞 Call</a>`);
    btns.push(`<a href="https://wa.me/91${clean}" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;padding:9px 16px;border-radius:8px;font-size:13px;font-weight:600;margin:4px 6px 0 0">💬 WhatsApp</a>`);
  }
  if (email) btns.push(`<a href="mailto:${email}" style="display:inline-block;background:#475569;color:#fff;text-decoration:none;padding:9px 16px;border-radius:8px;font-size:13px;font-weight:600;margin:4px 6px 0 0">✉️ Email</a>`);
  return btns.length ? `<div style="margin-top:12px">${btns.join('')}</div>` : '';
}

function patientBookingBody(b) {
  const firstToken = (b.patient_name || 'there').trim().split(/\s+/)[0];
  const first = esc(firstToken);
  const ref = b.id ? esc(b.id.slice(0, 8).toUpperCase()) : '';
  return (
    `<p style="margin:0 0 12px">Hi ${first},</p>`
    + `<p style="margin:0 0 12px">Thank you for choosing Serenest. We have received your booking request for a <strong>${esc(b.mode)}</strong> consultation (${esc(b.practitioner_type)}).</p>`
    + `<p style="margin:0 0 12px"><strong>Preferred slot:</strong> ${esc(b.preferred_date)} at ${esc(b.preferred_time)}</p>`
    + `<p style="margin:0 0 12px">Our team will contact you on <strong>${fmtPhone(b.patient_phone)}</strong> shortly to confirm and share payment details.</p>`
    + (ref ? `<p style="margin:0;color:#64748b;font-size:13px">Reference: <code style="font-family:monospace">${ref}</code></p>` : '')
    + `<p style="margin:16px 0 0;font-size:13px;color:#64748b">Questions? WhatsApp <a href="https://wa.me/917777936367" style="color:#0f766e">+91 77779 36367</a>.</p>`
  );
}

function patientScreeningBody(s) {
  const safety = Array.isArray(s.phq9_answers) && (s.phq9_answers[8] ?? 0) > 0;
  const firstToken = (s.name || 'there').trim().split(/\s+/)[0];
  const first = esc(firstToken);
  const crisis = safety
    ? '<div style="background:#fee2e2;border:1px solid #fecaca;border-radius:10px;padding:14px 16px;margin:0 0 16px;color:#991b1b">'
      + '<strong>If you are in crisis or thinking about hurting yourself, please reach out now.</strong><br/>'
      + 'iCall: <a href="tel:9152987821" style="color:#991b1b;font-weight:700">9152987821</a> · '
      + 'Vandrevala: <a href="tel:7777936367" style="color:#991b1b;font-weight:700">7777936367</a>'
      + '</div>'
    : '';
  return (
    `<p style="margin:0 0 12px">Hi ${first},</p>`
    + crisis
    + '<p style="margin:0 0 12px">Thanks for completing the self-screening on Serenest. This is a screening tool, not a medical diagnosis.</p>'
    + `<p style="margin:0 0 12px"><strong>PHQ-9:</strong> ${esc(s.phq9_score)} (${esc(s.phq9_severity)})<br/>`
    + `<strong>GAD-7:</strong> ${esc(s.gad7_score)} (${esc(s.gad7_severity)})</p>`
    + `<p style="margin:0 0 12px">${s.wants_callback
      ? 'You asked to be contacted — our team will reach out when possible.'
      : 'You can book a consultation anytime on our website.'}</p>`
    + '<p style="margin:16px 0 0;font-size:13px;color:#64748b">Need to talk? <a href="https://wa.me/917777936367" style="color:#0f766e">Message Serenest on WhatsApp</a>.</p>'
  );
}

function fire(promise) {
  Promise.resolve(promise).catch((e) =>
    console.warn('[notify] background error:', e.message)
  );
}

// ── Public: typed event helpers ───────────────────────────────────

export const notify = {
  booking(b) {
    const html = `
      <p style="margin:0 0 8px;font-size:16px"><strong>${esc(b.patient_name)}</strong> just booked a session.</p>
      ${table([
        row('Phone',          fmtPhone(b.patient_phone)),
        row('Email',          esc(b.patient_email)),
        row('Practitioner',   esc(b.practitioner_type)),
        row('Mode',           esc(b.mode)),
        row('Preferred slot', `${esc(b.preferred_date)} at ${esc(b.preferred_time)}`),
        row('Language',       esc(b.language)),
        row('Notes',          b.notes ? `<em style="color:#475569">${esc(b.notes)}</em>` : ''),
        row('Reference',      b.id ? `<code style="font-family:monospace">${esc(b.id.slice(0, 8))}</code>` : ''),
      ])}
      ${callouts({ phone: b.patient_phone, email: b.patient_email })}
    `;
    fire(sendEmail({ subject: `New booking — ${b.patient_name} (${b.preferred_date})`, html }));
    fire(sendTelegram(
      `<b>📅 New booking</b>\n<b>${esc(b.patient_name)}</b>\n📞 ${esc(fmtPhone(b.patient_phone))}\n${esc(b.practitioner_type)} • ${esc(b.preferred_date)} ${esc(b.preferred_time)}`,
    ));
    const phoneDigits = String(b.patient_phone || '').replace(/\D/g, '');
    fire(sendTeamWhatsApp(
      `Serenest — New booking\n${b.patient_name}\n+91 ${phoneDigits}\n${b.practitioner_type} · ${b.mode}\n${b.preferred_date} ${b.preferred_time}${b.id ? `\nRef: ${b.id.slice(0, 8).toUpperCase()}` : ''}`,
    ));

    const bookingPatientEmail = b.patient_email?.trim();
    if (bookingPatientEmail) {
      fire(sendPatientEmail({
        subject: 'We received your booking request',
        html: patientBookingBody(b),
        to: bookingPatientEmail,
      }));
    }
  },

  screening(s) {
    const safety = Array.isArray(s.phq9_answers) && (s.phq9_answers[8] ?? 0) > 0;
    const sevColor = (label) => ({
      Minimal: '#16a34a', Mild: '#2563eb', Moderate: '#ea580c',
      'Moderately Severe': '#f97316', Severe: '#dc2626',
    }[label] ?? '#64748b');

    const sevPill = (score, max, label) =>
      `<strong>${esc(score)}/${max}</strong> · <span style="background:${sevColor(label)}18;color:${sevColor(label)};padding:2px 8px;border-radius:99px;font-size:12px;font-weight:700">${esc(label)}</span>`;

    const html = `
      ${safety ? `<div style="background:#fee2e2;border:2px solid #dc2626;border-radius:10px;padding:12px 14px;margin-bottom:14px;color:#991b1b"><strong>⚠ Safety alert:</strong> Respondent indicated thoughts of self-harm (PHQ-9 Q9). Please reach out today.</div>` : ''}
      <p style="margin:0 0 8px;font-size:16px"><strong>${esc(s.name || 'Anonymous')}</strong> just completed the self-screening.</p>
      ${table([
        row('Phone',     fmtPhone(s.phone)),
        row('Email',     esc(s.email)),
        row('PHQ-9 (depression)', sevPill(s.phq9_score, 27, s.phq9_severity)),
        row('GAD-7 (anxiety)',    sevPill(s.gad7_score, 21, s.gad7_severity)),
        row('Wants callback?',    s.wants_callback ? '<strong style="color:#0f766e">Yes — please reach out</strong>' : 'No'),
      ])}
      ${callouts({ phone: s.phone, email: s.email })}
    `;
    fire(sendEmail({ subject: `${safety ? '🚨 SAFETY' : 'New screening'} — ${s.name || 'Anonymous'} (PHQ-9: ${s.phq9_score}, GAD-7: ${s.gad7_score})`, html, urgent: safety }));
    fire(sendTelegram(
      (safety ? `<b>⚠️ SAFETY ALERT</b>\n` : `<b>🧠 New screening</b>\n`) +
      `<b>${esc(s.name)}</b> · 📞 ${esc(fmtPhone(s.phone))}\nPHQ-9: ${esc(s.phq9_score)} (${esc(s.phq9_severity)}) · GAD-7: ${esc(s.gad7_score)} (${esc(s.gad7_severity)})`,
      { urgent: safety },
    ));
    const screeningDigits = String(s.phone || '').replace(/\D/g, '');
    fire(sendTeamWhatsApp(
      `Serenest — ${safety ? 'SAFETY ' : ''}Screening\n${s.name || 'Anonymous'}\n+91 ${screeningDigits}\nPHQ-9: ${s.phq9_score} (${s.phq9_severity}) · GAD-7: ${s.gad7_score} (${s.gad7_severity})`,
    ));

    const screeningPatientEmail = s.email?.trim();
    if (screeningPatientEmail) {
      fire(sendPatientEmail({
        subject: safety ? 'Support resources after your screening' : 'We received your self-screening',
        html: patientScreeningBody(s),
        to: screeningPatientEmail,
        urgent: safety,
      }));
    }
  },

  contact(c) {
    const html = `
      <p style="margin:0 0 8px;font-size:16px"><strong>${esc(c.name)}</strong> sent an enquiry.</p>
      ${table([
        row('Phone',   fmtPhone(c.phone)),
        row('Email',   esc(c.email)),
        row('Subject', esc(c.subject)),
      ])}
      <div style="background:#f8fafc;border-left:3px solid #0f766e;border-radius:6px;padding:12px 14px;margin:10px 0;font-style:italic;color:#334155;white-space:pre-wrap">${esc(c.message)}</div>
      ${callouts({ phone: c.phone, email: c.email })}
    `;
    fire(sendEmail({ subject: `New enquiry — ${c.name}${c.subject ? ' · ' + c.subject : ''}`, html }));
    fire(sendTeamWhatsApp(
      `Serenest — Enquiry\n${c.name}\n+91 ${String(c.phone || '').replace(/\D/g, '')}\n${c.subject || '—'}\n${String(c.message || '').slice(0, 200)}`,
    ));
  },

  professionalApplication(p) {
    const html = `
      <p style="margin:0 0 8px;font-size:16px"><strong>${esc(p.full_name)}</strong> applied to join as a <strong>${esc(p.role)}</strong>.</p>
      ${table([
        row('Phone',         fmtPhone(p.phone)),
        row('Email',         esc(p.email)),
        row('Qualification', p.degree ? `${esc(p.degree)}${p.year ? ` (${esc(p.year)})` : ''}` : ''),
        row('Council',       esc(p.council)),
        row('Registration #',esc(p.registration)),
        row('City',          esc(p.city)),
        row('Clinic',        esc(p.clinic)),
        row('Fee / duration', p.fee_inr ? `₹${esc(p.fee_inr)} / ${esc(p.duration_min || 45)} min` : ''),
      ])}
      ${callouts({ phone: p.phone, email: p.email })}
      <p style="margin:12px 0 0;color:#64748b;font-size:13px">Review this application in <a href="https://serenest.in/admin" style="color:#0f766e;font-weight:600">Admin → Applications</a>.</p>
    `;
    fire(sendEmail({ subject: `New ${p.role} application — ${p.full_name}`, html }));
    fire(sendTeamWhatsApp(
      `Serenest — Clinician application\n${p.full_name} (${p.role})\n+91 ${String(p.phone || '').replace(/\D/g, '')}\n${p.city || ''}`.trim(),
    ));
  },

  jobApplication(j) {
    const html = `
      <p style="margin:0 0 8px;font-size:16px"><strong>${esc(j.candidate_name)}</strong> applied for <strong>${esc(j.position)}</strong>.</p>
      ${table([
        row('Phone',      fmtPhone(j.candidate_phone)),
        row('Email',      esc(j.candidate_email)),
        row('Experience', j.experience_years ? `${esc(j.experience_years)} years` : ''),
      ])}
      ${callouts({ phone: j.candidate_phone, email: j.candidate_email })}
      <p style="margin:12px 0 0;color:#64748b;font-size:13px">Review this candidate in <a href="https://serenest.in/admin" style="color:#0f766e;font-weight:600">Admin → HR / Hiring</a>.</p>
    `;
    fire(sendEmail({ subject: `New job application — ${j.candidate_name} for ${j.position}`, html }));
    fire(sendTeamWhatsApp(
      `Serenest — Job application\n${j.candidate_name} · ${j.position}\n+91 ${String(j.candidate_phone || '').replace(/\D/g, '')}`,
    ));
  },

  signup(s) {
    const html = `
      <p style="margin:0 0 8px"><strong>${esc(s.email)}</strong> joined the waitlist.</p>
      ${table([row('Phone', fmtPhone(s.mobile))])}
    `;
    fire(sendEmail({ subject: `Waitlist signup — ${s.email}`, html }));
  },

  /**
   * Each new unique site visitor today (after server dedupe).
   * WhatsApp: ping on every new visitor when CallMeBot is configured.
   * Email: first visitor of the UTC day only, unless NOTIFY_EACH_UNIQUE_VISITOR_EMAIL is truthy.
   */
  siteVisitor({ count, path, referrer, userAgent }) {
    const pathEsc = path || '/';
    const refShort = String(referrer || '').slice(0, 140);
    const wa =
      `Serenest — Visitor on site (#${count} unique today)\n` +
      `Page: ${pathEsc}` +
      (refShort ? `\nRef: ${refShort}` : '');
    fire(sendTeamWhatsApp(wa));

    const emailEach = /^1|true|yes$/i.test(process.env.NOTIFY_EACH_UNIQUE_VISITOR_EMAIL || '');
    if (!emailEach && count !== 1) return;

    const subject =
      count === 1
        ? `Today's first visitor on Serenest`
        : `Serenest visitor (#${count} unique today)`;

    const html = `
      <p style="margin:0 0 8px;font-size:16px">${
        count === 1
          ? 'First visitor of the day just landed on Serenest 🎉'
          : `Another visitor on Serenest today (#${count} unique)`
      }</p>
      ${table([
        row('Page', pathEsc ? `<code style="font-family:monospace">${esc(pathEsc)}</code>` : ''),
        row('Referrer', esc(referrer)),
        row(
          'Browser',
          userAgent ? `<span style="color:#64748b;font-size:12px">${esc(userAgent.slice(0, 160))}</span>` : '',
        ),
      ])}
      <p style="margin:12px 0 0;color:#64748b;font-size:13px">Traffic overview: <a href="https://serenest.in/admin" style="color:#0f766e;font-weight:600">Admin</a>. WhatsApp pings fire for each new visitor when CallMeBot is set.</p>
    `;
    fire(sendEmail({ subject, html }));
  },

  /** Someone opened the Serenest Guide AI panel (once per visitor per UTC day). */
  serenestGuideOpened({ path }) {
    const p = path || '/';
    fire(sendTeamWhatsApp(`Serenest — AI Guide opened\nPage: ${p}`));
  },

  custom(subject, html, opts) {
    fire(sendEmail({ subject, html, ...opts }));
  },

  isConfigured() {
    return Boolean(RESEND_KEY && NOTIFY_TO);
  },

  /** Resend API key set — can send patient confirmation emails. */
  isPatientEmailEnabled() {
    return Boolean(RESEND_KEY);
  },

  /** CallMeBot WhatsApp — free team pings. */
  hasTeamWhatsApp() {
    return Boolean(CALLMEBOT_KEY && CALLMEBOT_PHONE);
  },
};

export default notify;
