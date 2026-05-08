/**
 * Notification helper — alerts the Serenest team about meaningful
 * events on the site. Currently uses Resend (email).
 *
 * Setup (3 minutes):
 *   1. Sign up at https://resend.com (free — 3,000 emails/month)
 *   2. Verify a domain you own (e.g. serenest.fit) under Domains
 *      — OR — skip verification & use the default test sender
 *        `onboarding@resend.dev` (works immediately, may hit spam)
 *   3. Create an API key at https://resend.com/api-keys
 *   4. Set RESEND_API_KEY, NOTIFY_FROM, NOTIFY_EMAIL in .env / Render
 *
 * Failures are swallowed — notifications must never break user flow.
 */

const RESEND_KEY  = process.env.RESEND_API_KEY;
const NOTIFY_FROM = process.env.NOTIFY_FROM  || 'Serenest Alerts <onboarding@resend.dev>';
const NOTIFY_TO   = process.env.NOTIFY_EMAIL;

// Optional secondary channel — kept silent unless explicitly enabled.
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_CHAT  = process.env.TELEGRAM_CHAT_ID;

// ── Internal: send email via Resend ───────────────────────────────
async function sendEmail({ subject, html, urgent = false }) {
  if (!RESEND_KEY || !NOTIFY_TO) return false;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_KEY}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        from:    NOTIFY_FROM,
        to:      NOTIFY_TO.split(',').map((s) => s.trim()).filter(Boolean),
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
    <a href="https://serenest.fit/admin" style="color:${accent};text-decoration:none;font-weight:600">Open admin dashboard →</a>
    <span style="float:right">${new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
  </td></tr>
</table>
</body></html>`;
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
      `<b>📅 New booking</b>\n<b>${esc(b.patient_name)}</b>\n📞 ${esc(fmtPhone(b.patient_phone))}\n${esc(b.practitioner_type)} • ${esc(b.preferred_date)} ${esc(b.preferred_time)}`
    ));
  },

  screening(s) {
    const safety = Array.isArray(s.phq9_answers) && (s.phq9_answers[8] ?? 0) > 0;
    const sevColor = (label) => ({
      Minimal: '#16a34a', Mild: '#2563eb', Moderate: '#ea580c',
      'Moderately Severe': '#f97316', Severe: '#dc2626',
    }[label] ?? '#64748b');

    const sevPill = (score, max, label) =>
      `<strong>${esc(score)}/${max}</strong> · <span style="background:${sevColor(label)}18;color:${sevColor(label)};padding:2px 8px;border-radius:99px;font-size:12px;font-weight:700">${esc(label)}</span>`;

    const extras = s.optional_screenings;
    const extraRowList = [];
    if (extras && typeof extras === 'object') {
      if (extras.isi) extraRowList.push(row('ISI (sleep)', `${esc(extras.isi.score)} · ${esc(extras.isi.severity)}`));
      if (extras.audit_c) extraRowList.push(row('AUDIT-C', `${esc(extras.audit_c.score)}/12 · ${esc(extras.audit_c.severity)}`));
      if (extras.scoff) extraRowList.push(row('SCOFF', `${esc(extras.scoff.yes_count)} yes · ${extras.scoff.positive ? 'screen +' : 'screen −'}`));
      if (extras.ptsd_screen) {
        const p = extras.ptsd_screen;
        extraRowList.push(
          row('Trauma screen', p.event ? `${esc(p.symptom_yes_count)}/5 yes · ${p.positive ? 'further eval +' : 'below cut-off'}` : 'No trauma endorsement'),
        );
      }
    }

    const html = `
      ${safety ? `<div style="background:#fee2e2;border:2px solid #dc2626;border-radius:10px;padding:12px 14px;margin-bottom:14px;color:#991b1b"><strong>⚠ Safety alert:</strong> Respondent indicated thoughts of self-harm (PHQ-9 Q9). Please reach out today.</div>` : ''}
      <p style="margin:0 0 8px;font-size:16px"><strong>${esc(s.name || 'Anonymous')}</strong> just completed the self-screening.</p>
      ${table([
        row('Phone',     fmtPhone(s.phone)),
        row('Email',     esc(s.email)),
        row('PHQ-9 (depression)', sevPill(s.phq9_score, 27, s.phq9_severity)),
        row('GAD-7 (anxiety)',    sevPill(s.gad7_score, 21, s.gad7_severity)),
        ...extraRowList,
        row('Wants callback?',    s.wants_callback ? '<strong style="color:#0f766e">Yes — please reach out</strong>' : 'No'),
      ])}
      ${callouts({ phone: s.phone, email: s.email })}
    `;
    let tgExtra = '';
    if (extraRowList.length) {
      const parts = [];
      if (extras.isi) parts.push(`ISI ${esc(extras.isi.score)}`);
      if (extras.audit_c) parts.push(`AUDIT-C ${esc(extras.audit_c.score)}`);
      if (extras.scoff) parts.push(`SCOFF ${esc(extras.scoff.yes_count)}y`);
      if (extras.ptsd_screen?.event) parts.push(`Trauma ${esc(extras.ptsd_screen.symptom_yes_count)}/5`);
      tgExtra = `\n${parts.join(' · ')}`;
    }
    fire(sendEmail({ subject: `${safety ? '🚨 SAFETY' : 'New screening'} — ${s.name || 'Anonymous'} (PHQ-9: ${s.phq9_score}, GAD-7: ${s.gad7_score})`, html, urgent: safety }));
    fire(sendTelegram(
      (safety ? `<b>⚠️ SAFETY ALERT</b>\n` : `<b>🧠 New screening</b>\n`) +
      `<b>${esc(s.name)}</b> · 📞 ${esc(fmtPhone(s.phone))}\nPHQ-9: ${esc(s.phq9_score)} (${esc(s.phq9_severity)}) · GAD-7: ${esc(s.gad7_score)} (${esc(s.gad7_severity)})${tgExtra}`,
      { urgent: safety }
    ));
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
      <p style="margin:12px 0 0;color:#64748b;font-size:13px">Review this application in <a href="https://serenest.fit/admin" style="color:#0f766e;font-weight:600">Admin → Applications</a>.</p>
    `;
    fire(sendEmail({ subject: `New ${p.role} application — ${p.full_name}`, html }));
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
      <p style="margin:12px 0 0;color:#64748b;font-size:13px">Review this candidate in <a href="https://serenest.fit/admin" style="color:#0f766e;font-weight:600">Admin → HR / Hiring</a>.</p>
    `;
    fire(sendEmail({ subject: `New job application — ${j.candidate_name} for ${j.position}`, html }));
  },

  signup(s) {
    const html = `
      <p style="margin:0 0 8px"><strong>${esc(s.email)}</strong> joined the waitlist.</p>
      ${table([row('Phone', fmtPhone(s.mobile))])}
    `;
    fire(sendEmail({ subject: `Waitlist signup — ${s.email}`, html }));
  },

  /**
   * First visit of the day from a unique browser.
   * Sent silent / less prominently because traffic emails would be noisy.
   */
  firstVisitToday({ count, path, referrer, userAgent }) {
    // Only email the *first* visitor of each day (count === 1) to keep
    // your inbox sane. Subsequent unique visitors are tracked silently
    // and visible via /api/track/today.
    if (count !== 1) return;

    const html = `
      <p style="margin:0 0 8px;font-size:16px">First visitor of the day just landed on Serenest 🎉</p>
      ${table([
        row('Page',     path     ? `<code style="font-family:monospace">${esc(path)}</code>` : ''),
        row('Referrer', esc(referrer)),
        row('Browser',  userAgent ? `<span style="color:#64748b;font-size:12px">${esc(userAgent.slice(0, 100))}</span>` : ''),
      ])}
      <p style="margin:12px 0 0;color:#64748b;font-size:13px">You'll get one email per day for traffic. The live count is at <a href="https://serenest.fit/admin" style="color:#0f766e;font-weight:600">/admin → Overview</a>.</p>
    `;
    fire(sendEmail({ subject: `Today's first visitor on Serenest`, html }));
  },

  custom(subject, html, opts) {
    fire(sendEmail({ subject, html, ...opts }));
  },

  isConfigured() {
    return Boolean(RESEND_KEY && NOTIFY_TO);
  },
};

export default notify;
