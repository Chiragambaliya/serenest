/**
 * Lead capture safety nets. Bookings, screenings, and applications are
 * revenue-critical: when the primary insert fails the lead is preserved in
 * (in order of preference) the durable Supabase `application_inbox`, the
 * production `contact_messages` table, or a local JSONL file — and the team
 * is always notified. Nothing is silently lost.
 */
import { readFileSync, appendFileSync, mkdirSync, existsSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import { supabase } from './db.js';
import { FALLBACK_LEADS_FILE } from './config.js';

// ── Local JSONL fallback (ephemeral across redeploys) ─────────

export function captureFallbackLead(kind, record) {
  console.warn(`[fallback lead] DB unavailable — ${kind} lead captured to ${FALLBACK_LEADS_FILE}`);
  try {
    mkdirSync(dirname(FALLBACK_LEADS_FILE), { recursive: true });
    appendFileSync(
      FALLBACK_LEADS_FILE,
      JSON.stringify({ kind, received_at: new Date().toISOString(), ...record }) + '\n',
    );
  } catch (e) {
    console.error('[fallback lead] write failed:', e.message);
  }
}

/** Read fallback leads captured when a DB insert failed. Newest first. */
export function readFallbackLeads(kind) {
  try {
    if (!existsSync(FALLBACK_LEADS_FILE)) return [];
    const rows = [];
    for (const line of readFileSync(FALLBACK_LEADS_FILE, 'utf8').split('\n')) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const row = JSON.parse(trimmed);
        if (!kind || row.kind === kind) rows.push(row);
      } catch {
        // skip corrupt lines
      }
    }
    return rows.reverse();
  } catch (e) {
    console.error('[fallback lead] read failed:', e.message);
    return [];
  }
}

/** Rewrite the fallback file without the given professional-application ids. */
export function removeFallbackLeads(ids) {
  const remove = new Set((ids || []).map(String));
  try {
    if (!existsSync(FALLBACK_LEADS_FILE) || remove.size === 0) return 0;
    const kept = [];
    let removed = 0;
    for (const line of readFileSync(FALLBACK_LEADS_FILE, 'utf8').split('\n')) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const row = JSON.parse(trimmed);
        if (row.kind === 'professional_application' && remove.has(String(row.id))) {
          removed += 1;
          continue;
        }
      } catch {
        // keep unparseable lines
      }
      kept.push(trimmed);
    }
    mkdirSync(dirname(FALLBACK_LEADS_FILE), { recursive: true });
    writeFileSync(FALLBACK_LEADS_FILE, kept.length ? `${kept.join('\n')}\n` : '', 'utf8');
    return removed;
  } catch (e) {
    console.error('[fallback lead] remove failed:', e.message);
    return 0;
  }
}

// ── contact_messages as a durable inbox ───────────────────────
// contact_messages already exists in production. When application_inbox /
// job_applications are missing, store the lead there so Admin still sees it
// after Render restarts — no SQL required.

export const INTERNAL_LEAD_SUBJECT = {
  professional_application: 'serenest:professional_application',
  job_application: 'serenest:job_application',
};

export function isInternalLeadSubject(subject) {
  return String(subject || '').startsWith('serenest:');
}

export function parseLeadMessage(message) {
  try {
    return JSON.parse(message || '{}');
  } catch {
    return {};
  }
}

export async function saveContactLead(kind, row, dbError) {
  if (!supabase) return null;
  const subject = INTERNAL_LEAD_SUBJECT[kind];
  if (!subject) return null;
  const { data, error } = await supabase
    .from('contact_messages')
    .insert({
      name: row.full_name || row.name || 'Applicant',
      email: row.email || null,
      phone: row.phone || null,
      subject,
      message: JSON.stringify({
        kind,
        status: row.status || (kind === 'job_application' ? 'new' : 'pending'),
        db_error: dbError || null,
        payload: row,
      }),
    })
    .select()
    .single();
  if (error) {
    console.error('[contact lead] insert failed:', error.message);
    return null;
  }
  return data;
}

export async function listContactLeads(kind) {
  if (!supabase) return [];
  const subject = INTERNAL_LEAD_SUBJECT[kind];
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .eq('subject', subject)
    .order('created_at', { ascending: false });
  if (error) {
    console.warn('[contact lead] list failed:', error.message);
    return [];
  }
  return (data || []).map((msg) => {
    const parsed = parseLeadMessage(msg.message);
    const payload = parsed.payload || {};
    if (kind === 'professional_application') {
      return normalizeFallbackApplication({
        ...payload,
        id: msg.id,
        created_at: msg.created_at,
        status: parsed.status || payload.status || 'pending',
        full_name: payload.full_name || msg.name,
        phone: payload.phone || msg.phone,
        email: payload.email || msg.email,
        _fallback: true,
        _inbox: true,
        _contact: true,
        _db_error: parsed.db_error || payload._db_error || null,
      });
    }
    return {
      id: msg.id,
      created_at: msg.created_at,
      updated_at: msg.created_at,
      status: parsed.status || payload.status || 'new',
      ...payload,
      full_name: payload.full_name || msg.name,
      email: payload.email || msg.email,
      phone: payload.phone || msg.phone,
      _fallback: true,
      _contact: true,
    };
  });
}

export async function findContactLead(id) {
  if (!supabase) return null;
  const { data } = await supabase
    .from('contact_messages')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  return data || null;
}

export async function markContactLeadPromoted(id, promotedId) {
  const msg = await findContactLead(id);
  if (!msg) return;
  const parsed = parseLeadMessage(msg.message);
  parsed.status = 'promoted';
  parsed.promoted_application_id = promotedId;
  await supabase
    .from('contact_messages')
    .update({
      subject: `${msg.subject}:promoted`,
      message: JSON.stringify(parsed),
    })
    .eq('id', id);
}

/** Update a job application in job_applications, or in contact_messages if that's where it lives. */
export async function patchJobApplicationRecord(id, updates) {
  const { data, error } = await supabase
    .from('job_applications')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (!error && data) return { application: data, error: null };

  const msg = await findContactLead(id);
  if (!msg || msg.subject !== INTERNAL_LEAD_SUBJECT.job_application) {
    return { application: null, error: error || { message: 'Application not found' } };
  }
  const parsed = parseLeadMessage(msg.message);
  const payload = { ...(parsed.payload || {}), ...updates };
  if (updates.status) parsed.status = updates.status;
  parsed.payload = payload;
  parsed.status = updates.status || parsed.status || payload.status;
  const { data: saved, error: saveError } = await supabase
    .from('contact_messages')
    .update({ message: JSON.stringify(parsed) })
    .eq('id', id)
    .select()
    .single();
  if (saveError || !saved) {
    return { application: null, error: saveError || { message: 'Failed to update application' } };
  }
  return {
    application: {
      id: saved.id,
      created_at: saved.created_at,
      ...payload,
      status: parsed.status,
      full_name: payload.full_name || saved.name,
      email: payload.email || saved.email,
      phone: payload.phone || saved.phone,
      _fallback: true,
      _contact: true,
    },
    error: null,
  };
}

export function normalizeFallbackApplication(row) {
  return {
    id: row.id || `fallback-${row.received_at || Date.now()}`,
    created_at: row.created_at || row.received_at || new Date().toISOString(),
    status: row.status || 'pending',
    role: row.role || null,
    role_label: row.role_label || row.role || null,
    full_name: row.full_name || 'Unknown applicant',
    phone: row.phone || null,
    email: row.email || null,
    social_handle: row.social_handle || null,
    registration: row.registration || null,
    degree: row.degree || null,
    city: row.city || null,
    languages: row.languages || null,
    specialities: row.specialities || null,
    fee_inr: row.fee_inr ?? null,
    duration_min: row.duration_min ?? null,
    modes: row.modes || null,
    availability: row.availability || null,
    _fallback: true,
    _inbox: Boolean(row._inbox),
    _db_error: row._db_error || row.db_error || null,
  };
}

/** Durable Supabase inbox — survives Render redeploys (unlike JSONL fallback). */
export async function saveApplicationInbox(row, dbError) {
  if (!supabase) return null;
  const payload = {
    source: 'professionals_apply',
    status: 'pending',
    full_name: row.full_name,
    phone: row.phone,
    email: row.email || null,
    role: row.role || null,
    role_label: row.role_label || row.role || null,
    social_handle: row.social_handle || null,
    registration: row.registration || null,
    degree: row.degree || null,
    city: row.city || null,
    languages: row.languages || null,
    specialities: row.specialities || null,
    fee_inr: row.fee_inr != null ? String(row.fee_inr) : null,
    duration_min: row.duration_min ?? null,
    modes: row.modes || null,
    availability: row.availability || null,
    payload: row,
    db_error: dbError || null,
  };
  const { data, error } = await supabase
    .from('application_inbox')
    .insert(payload)
    .select()
    .single();
  if (error) {
    console.error('[application_inbox] insert failed:', error.message);
    // Table may not exist yet — reuse contact_messages (already in production).
    return saveContactLead('professional_application', { ...row, status: 'pending' }, dbError);
  }
  return data;
}

export async function listInboxApplications(status) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('application_inbox')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
  if (error) {
    // Table may not exist until migration is applied — don't break admin.
    console.warn('[application_inbox] list failed:', error.message);
  }
  const inboxRows = error
    ? []
    : (data || [])
      .map((row) => normalizeFallbackApplication({
        ...row,
        _fallback: true,
        _inbox: true,
        _db_error: row.db_error,
      }))
      .filter((a) => !status || a.status === status);

  const contactRows = (await listContactLeads('professional_application'))
    .filter((a) => !status || a.status === status);

  return [...inboxRows, ...contactRows];
}
