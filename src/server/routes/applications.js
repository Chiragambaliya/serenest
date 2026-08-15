/**
 * Professional onboarding applications — public apply endpoint with layered
 * fallbacks, plus admin review (list / promote / approve / reject) and the
 * SERENEST WhatsApp group invite tooling.
 */
import { ok, err, requireDb, requireAdmin } from '../http.js';
import { supabase } from '../db.js';
import { notify } from '../notify.js';
import {
  captureFallbackLead, readFallbackLeads, removeFallbackLeads,
  normalizeFallbackApplication, saveApplicationInbox, listInboxApplications,
  findContactLead, markContactLeadPromoted, isInternalLeadSubject, parseLeadMessage,
} from '../leads.js';

// Recorded verbatim as consent evidence. Keep in sync with the checkbox label
// in src/pages/ProfessionalOnboardingPage.jsx.
const CONSENT_STATEMENT =
  'I confirm the information is accurate and I consent to credential verification.';

export async function insertProfessionalApplication(row) {
  // Drop unknown/legacy columns one at a time and retry. This keeps apply
  // working across partially-migrated production schemas.
  const optionalDropOrder = [
    'consent_confirmed_at',
    'consent_method',
    'consent_evidence',
    'consent_credential_check',
    'social_handle',
    'medical_council_number',
    'consultation_fee',
    'designation',
    'degree',
    'role_label',
    'registration',
    'specialities',
    'languages',
    'availability',
    'modes',
    'clinic',
    'year',
    'council',
  ];

  let attempt = { ...row };
  let data = null;
  let error = null;

  for (let i = 0; i < optionalDropOrder.length + 1; i += 1) {
    ({ data, error } = await supabase
      .from('professional_applications')
      .insert(attempt)
      .select()
      .single());

    if (!error) break;

    const msg = `${error.message || ''} ${error.details || ''} ${error.hint || ''}`;
    console.warn('[professional_applications insert] failed', {
      attempt: i,
      message: error.message,
      code: error.code,
      details: error.details,
    });

    const missingCol = optionalDropOrder.find(
      (col) => attempt[col] !== undefined && new RegExp(col, 'i').test(msg),
    );
    if (missingCol) {
      const { [missingCol]: _omit, ...rest } = attempt;
      attempt = rest;
      continue;
    }

    if (/null value in column "designation"/i.test(msg) && attempt.designation == null) {
      attempt = { ...attempt, designation: row.role_label || row.role || 'Professional' };
      continue;
    }

    break;
  }

  return { data, error };
}

function fireTeamPingForInviteAll(emailed, skippedNoEmail, failed, total) {
  // Team WhatsApp is best-effort; notify.sendTeamWhatsApp is internal — use custom + WA via notify APIs.
  try {
    notify.custom(
      'SERENEST WA group invites sent',
      `<p style="margin:0">Emailed <strong>${emailed}</strong> of ${total} approved professionals.`
        + ` Skipped (no email): ${skippedNoEmail}. Failed: ${failed}.</p>`,
    );
  } catch { /* ignore */ }
}

export function registerApplicationRoutes(app) {
  /**
   * POST /api/professionals/apply
   * Submit a professional onboarding application.
   */
  app.post('/api/professionals/apply', async (req, res) => {
    const {
      role, role_label, full_name, phone, email, social_handle,
      registration, degree, city, languages, specialities,
      fee_inr, duration_min, modes, availability, consent,
    } = req.body;

    if (!role?.trim())      return err(res, 'role is required');
    if (!full_name?.trim()) return err(res, 'full_name is required');
    if (!phone?.trim())     return err(res, 'phone is required');

    const roleLabel = role_label?.trim() || role;
    const feeRaw = fee_inr != null ? String(fee_inr).trim() : '';
    const feeNum = feeRaw === '' ? null : Number(feeRaw);

    // Prefer the current schema; include legacy aliases (designation) so older
    // production tables that still require them can accept the row.
    const row = {
      role: role.trim(),
      role_label: roleLabel,
      designation: roleLabel, // legacy NOT NULL column on older DBs
      full_name: full_name.trim(),
      phone: phone.trim(),
      email: email?.trim() || null,
      social_handle: social_handle?.trim() || null,
      registration: registration?.trim() || null,
      medical_council_number: registration?.trim() || null, // legacy alias
      degree: degree?.trim() || null,
      city: city?.trim() || null,
      languages: languages?.trim() || null,
      specialities: specialities?.trim() || null,
      // fee_inr is text in schema.sql and numeric in a legacy migration —
      // send a numeric when parseable so either column type accepts it.
      fee_inr: Number.isFinite(feeNum) ? feeNum : (feeRaw || null),
      consultation_fee: Number.isFinite(feeNum) ? feeNum : null, // legacy alias
      duration_min: duration_min ? Number(duration_min) : null,
      modes: modes || null,
      availability: availability?.trim() || null,
      // The apply form gates submission on a consent checkbox, but until now it
      // was never persisted. enforce_listing_consent() refuses to approve any
      // application without consent_confirmed_at, so an unrecorded tick left
      // every application permanently stuck at 'pending'.
      ...(consent === true
        ? {
            consent_confirmed_at: new Date().toISOString(),
            consent_method: 'web_form_checkbox',
            consent_evidence: CONSENT_STATEMENT,
            consent_credential_check: true,
          }
        : {}),
      status: 'pending',
    };

    let insertError = null;
    if (supabase) {
      const { data, error } = await insertProfessionalApplication(row);
      if (!error && data) {
        res.setHeader('X-Serenest-Apply', 'db');
        notify.professionalApplication(data);
        return ok(res, { application: data }, 201);
      }
      insertError = error;
      if (error) console.error('[POST /api/professionals/apply]', error);
    }

    // Same safety net as bookings/screening: never lose a clinician lead when
    // the schema is partially migrated. Prefer durable Supabase inbox, then
    // local JSONL, and always notify the team.
    const dbErrorMsg = insertError?.message
      || (supabase ? 'Database insert failed — stored in application inbox until recovered' : 'database not configured');

    const inbox = await saveApplicationInbox(row, dbErrorMsg);
    const fallback = {
      id: inbox?.id || `fallback-${Date.now()}`,
      ...row,
      created_at: inbox?.created_at || new Date().toISOString(),
      _fallback: true,
      _inbox: Boolean(inbox),
      _db_error: dbErrorMsg,
    };

    if (!inbox) captureFallbackLead('professional_application', fallback);
    notify.professionalApplication(fallback);
    res.setHeader('X-Serenest-Apply', inbox ? 'inbox' : 'fallback');
    return ok(res, { application: fallback, fallback: true, inbox: Boolean(inbox) }, 201);
  });

  /**
   * GET /api/professionals/applications
   * List all professional applications (admin only), including durable inbox
   * rows and local fallback leads accepted when the main insert failed.
   */
  app.get('/api/professionals/applications', async (req, res) => {
    if (!requireAdmin(req, res)) return;

    const { status } = req.query;
    let dbApps = [];
    if (supabase) {
      let query = supabase
        .from('professional_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (status) query = query.eq('status', status);

      const { data, error } = await query;
      if (error) return err(res, 'Failed to fetch applications', 500);
      dbApps = data || [];
    }

    const dbKeys = new Set(
      dbApps.flatMap((a) => [
        String(a.id),
        `${String(a.phone || '').replace(/\D/g, '')}|${String(a.email || '').toLowerCase()}`,
      ]),
    );

    const seen = new Set(dbKeys);
    const pendingExtras = [];

    for (const a of await listInboxApplications(status)) {
      const key = `${String(a.phone || '').replace(/\D/g, '')}|${String(a.email || '').toLowerCase()}`;
      if (seen.has(String(a.id)) || seen.has(key)) continue;
      seen.add(String(a.id));
      seen.add(key);
      pendingExtras.push(a);
    }

    for (const a of readFallbackLeads('professional_application').map(normalizeFallbackApplication)) {
      if (status && a.status !== status) continue;
      const key = `${String(a.phone || '').replace(/\D/g, '')}|${String(a.email || '').toLowerCase()}`;
      if (seen.has(String(a.id)) || seen.has(key)) continue;
      seen.add(String(a.id));
      seen.add(key);
      pendingExtras.push(a);
    }

    const applications = [...pendingExtras, ...dbApps].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    return ok(res, {
      applications,
      fallback_count: pendingExtras.length,
    });
  });

  /**
   * POST /api/professionals/applications/:id/promote
   * Move an inbox/fallback application into professional_applications.
   */
  app.post('/api/professionals/applications/:id/promote', async (req, res) => {
    if (!requireDb(res) || !requireAdmin(req, res)) return;

    const id = String(req.params.id);
    let source = 'file';
    let fallback = readFallbackLeads('professional_application')
      .find((row) => String(row.id) === id) || null;

    if (!fallback && supabase) {
      const { data: inboxRow } = await supabase
        .from('application_inbox')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (inboxRow) {
        source = 'inbox';
        fallback = { ...inboxRow, ...(inboxRow.payload || {}) };
      }
    }

    if (!fallback && supabase) {
      const contactRow = await findContactLead(id);
      if (contactRow && isInternalLeadSubject(contactRow.subject)) {
        source = 'contact';
        const parsed = parseLeadMessage(contactRow.message);
        fallback = {
          ...(parsed.payload || {}),
          id: contactRow.id,
          full_name: parsed.payload?.full_name || contactRow.name,
          phone: parsed.payload?.phone || contactRow.phone,
          email: parsed.payload?.email || contactRow.email,
        };
      }
    }

    if (!fallback) return err(res, 'Fallback application not found', 404);

    const row = {
      role: fallback.role,
      role_label: fallback.role_label || fallback.role,
      designation: fallback.role_label || fallback.role,
      full_name: fallback.full_name,
      phone: fallback.phone,
      email: fallback.email || null,
      social_handle: fallback.social_handle || null,
      registration: fallback.registration || null,
      medical_council_number: fallback.registration || null,
      degree: fallback.degree || null,
      city: fallback.city || null,
      languages: fallback.languages || null,
      specialities: fallback.specialities || null,
      fee_inr: fallback.fee_inr ?? null,
      consultation_fee: fallback.fee_inr ?? null,
      duration_min: fallback.duration_min ?? null,
      modes: fallback.modes || null,
      availability: fallback.availability || null,
      status: 'pending',
    };

    const { data, error } = await insertProfessionalApplication(row);
    if (error || !data) {
      console.error('[POST /api/professionals/applications/:id/promote]', error);
      return err(res, error?.message || 'Failed to save application to the database. Run the latest Supabase migrations first.', 500);
    }

    if (source === 'inbox') {
      await supabase
        .from('application_inbox')
        .update({ status: 'promoted', promoted_application_id: data.id })
        .eq('id', id);
    } else if (source === 'contact') {
      await markContactLeadPromoted(id, data.id);
    } else {
      removeFallbackLeads([id]);
    }

    return ok(res, { application: data, promoted: true, source });
  });

  /**
   * PATCH /api/professionals/applications/:id
   * Approve or reject a professional application (admin only).
   * On approve: emails the clinician a SERENEST WhatsApp group invite (if configured).
   */
  app.patch('/api/professionals/applications/:id', async (req, res) => {
    if (!requireDb(res) || !requireAdmin(req, res)) return;

    const VALID = ['pending', 'approved', 'rejected'];
    const { status } = req.body;
    if (!VALID.includes(status)) return err(res, `status must be one of: ${VALID.join(', ')}`);

    const { data: existing } = await supabase
      .from('professional_applications')
      .select('id, status')
      .eq('id', req.params.id)
      .maybeSingle();

    const { data, error } = await supabase
      .from('professional_applications')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return err(res, 'Failed to update application', 500);

    let waInvite = null;
    const newlyApproved = status === 'approved' && existing?.status !== 'approved';
    if (newlyApproved && data) {
      waInvite = await notify.professionalApproved(data);
    }

    return ok(res, {
      application: data,
      wa_group_invite: notify.getSerenestWaGroupInvite() || null,
      approval_notify: waInvite,
    });
  });

  /**
   * GET /api/professionals/wa-group
   * Admin — SERENEST WhatsApp group invite URL (from server env).
   */
  app.get('/api/professionals/wa-group', async (req, res) => {
    if (!requireAdmin(req, res)) return;
    const invite = notify.getSerenestWaGroupInvite();
    return ok(res, {
      group_name: 'SERENEST',
      invite_url: invite || null,
      configured: Boolean(invite),
      hint: invite
        ? null
        : 'Set SERENEST_WA_GROUP_INVITE to your chat.whatsapp.com invite link in Render → Environment',
    });
  });

  /**
   * POST /api/professionals/wa-group/invite-all
   * Admin — email every approved professional the SERENEST WhatsApp group invite.
   * WhatsApp cannot add members via API; email + manual WA are the supported paths.
   */
  app.post('/api/professionals/wa-group/invite-all', async (req, res) => {
    if (!requireDb(res) || !requireAdmin(req, res)) return;

    const invite = notify.getSerenestWaGroupInvite();
    if (!invite) {
      return err(res, 'SERENEST WhatsApp group invite is not configured. Set SERENEST_WA_GROUP_INVITE on the server.', 503);
    }
    if (!notify.isPatientEmailEnabled()) {
      return err(res, 'Patient/clinician email is not configured (set RESEND_API_KEY)', 503);
    }

    const { data: pros, error } = await supabase
      .from('professional_applications')
      .select('id, full_name, email, phone, role, role_label, status')
      .eq('status', 'approved')
      .order('full_name');

    if (error) return err(res, 'Failed to load professionals', 500);

    const list = pros || [];
    let emailed = 0;
    let skippedNoEmail = 0;
    let failed = 0;
    const results = [];

    for (const p of list) {
      if (!p.email?.trim()) {
        skippedNoEmail += 1;
        results.push({ id: p.id, name: p.full_name, ok: false, reason: 'no_email' });
        continue;
      }
      const r = await notify.inviteToSerenestWaGroup(p);
      if (r.ok) {
        emailed += 1;
        results.push({ id: p.id, name: p.full_name, ok: true, email: p.email });
      } else {
        failed += 1;
        results.push({ id: p.id, name: p.full_name, ok: false, reason: r.reason, email: p.email });
      }
    }

    fireTeamPingForInviteAll(emailed, skippedNoEmail, failed, list.length);

    return ok(res, {
      group_name: 'SERENEST',
      invite_url: invite,
      total: list.length,
      emailed,
      skipped_no_email: skippedNoEmail,
      failed,
      results,
    });
  });
}
