/**
 * DPDP Act 2023 helpers — consent evidence, data minimisation, and retention.
 * Clinical records are never auto-deleted here; only marketing / analytics /
 * operational leftovers that the published retention schedule allows.
 */
import crypto from 'crypto';
import { supabase } from './db.js';
import { FALLBACK_LEADS_FILE } from './config.js';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

export const CONSENT_OPTIONAL_COLUMNS = [
  'consent_confirmed_at',
  'consent_method',
  'consent_purpose',
  'age_attestation',
  'privacy_notice_accepted_at',
];

export function isTruthyConsent(value) {
  return value === true || value === 'true' || value === 1 || value === '1';
}

/** Fields persisted when the data principal ticks a required consent box. */
export function consentRecord({ purpose, method = 'web_form_checkbox' } = {}) {
  const now = new Date().toISOString();
  return {
    consent_confirmed_at: now,
    consent_method: method,
    consent_purpose: purpose || null,
    privacy_notice_accepted_at: now,
  };
}

/** Hash a visitor/IP fingerprint so raw identifiers are not held in memory logs. */
export function hashFingerprint(value) {
  return crypto.createHash('sha256').update(String(value || '')).digest('hex').slice(0, 32);
}

/** Strip query strings (they can carry emails, tokens, or clinical ids). */
export function sanitizePath(path) {
  const raw = String(path || '/').split('?')[0].split('#')[0];
  if (raw.startsWith('/consultation/')) return '/consultation';
  if (raw.startsWith('/admin')) return '/admin';
  if (raw.startsWith('/patient/dashboard')) return '/patient/dashboard';
  return raw.slice(0, 200) || '/';
}

/** Keep only the referring host — never the full URL with query params. */
export function sanitizeReferrer(referrer) {
  const raw = String(referrer || '').trim();
  if (!raw) return null;
  try {
    return new URL(raw).hostname.replace(/^www\./, '').slice(0, 120);
  } catch {
    return raw.split('?')[0].slice(0, 60);
  }
}

export function isUuidLike(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''));
}

/** Appointment lookup that never selects patient contact or clinical notes. */
export async function findAppointmentSession(routeId) {
  if (!supabase || !routeId) return null;
  const fields = 'id, appointment_id, mode, status, daily_room_url, daily_room_name';
  const { data: byId } = await supabase
    .from('appointments')
    .select(fields)
    .eq('id', routeId)
    .maybeSingle();
  if (byId) return byId;
  const { data: byKey } = await supabase
    .from('appointments')
    .select(fields)
    .eq('appointment_id', routeId)
    .maybeSingle();
  return byKey || null;
}

export function daysAgoIso(days) {
  return new Date(Date.now() - days * 86400000).toISOString();
}

/** Anonymise then delete site_visits per the published retention schedule. */
export async function purgeExpiredAnalytics() {
  if (!supabase) return { anonymised: 0, deleted: 0 };
  const { data: stale } = await supabase
    .from('site_visits')
    .update({ visitor_id: null, referrer: null })
    .lt('created_at', daysAgoIso(90))
    .not('visitor_id', 'is', null)
    .select('id');
  const { data: gone } = await supabase
    .from('site_visits')
    .delete()
    .lt('created_at', daysAgoIso(730))
    .select('id');
  return { anonymised: stale?.length ?? 0, deleted: gone?.length ?? 0 };
}

/** Drop contact enquiries older than 3 years (internal lead subjects are kept). */
export async function purgeExpiredContactMessages() {
  if (!supabase) return 0;
  const { data } = await supabase
    .from('contact_messages')
    .delete()
    .lt('created_at', daysAgoIso(365 * 3))
    .not('subject', 'like', 'serenest:%')
    .select('id');
  return data?.length ?? 0;
}

/** Remove ephemeral JSONL leads older than 30 days. */
export function purgeExpiredFallbackLeads(maxAgeDays = 30) {
  try {
    if (!existsSync(FALLBACK_LEADS_FILE)) return 0;
    const cutoff = Date.now() - maxAgeDays * 86400000;
    const kept = [];
    let removed = 0;
    for (const line of readFileSync(FALLBACK_LEADS_FILE, 'utf8').split('\n')) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const row = JSON.parse(trimmed);
        const at = Date.parse(row.received_at || row.created_at || '');
        if (Number.isFinite(at) && at < cutoff) {
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
    console.error('[privacy] fallback purge failed:', e.message);
    return 0;
  }
}

export async function runRetentionSweep() {
  const analytics = await purgeExpiredAnalytics();
  const contacts = await purgeExpiredContactMessages();
  const fallback = purgeExpiredFallbackLeads(30);
  console.log(
    `[privacy-retention] analytics anonymised=${analytics.anonymised} deleted=${analytics.deleted}`
    + ` contacts=${contacts} fallback=${fallback}`,
  );
  return { analytics, contacts, fallback };
}
