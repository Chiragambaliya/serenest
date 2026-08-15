/**
 * DPDP Act 2023 — data-principal rights requests (access, correction,
 * erasure, withdraw consent, nominate, grievance).
 */
import crypto from 'crypto';
import { ok, err, requireDb, requireAdmin } from '../http.js';
import { supabase } from '../db.js';
import { notify } from '../notify.js';
import { captureFallbackLead } from '../leads.js';

const REQUEST_TYPES = [
  'access',
  'correction',
  'erasure',
  'withdraw_consent',
  'nominate',
  'grievance',
];

const VALID_STATUS = ['received', 'in_progress', 'completed', 'rejected'];

export function registerPrivacyRoutes(app) {
  /**
   * POST /api/privacy/request
   * Public — file a data-principal request. Always accepted (fallback file
   * when the table is missing) so a rights request is never silently lost.
   */
  app.post('/api/privacy/request', async (req, res) => {
    const { full_name, email, phone, request_type, details } = req.body || {};
    if (!full_name?.trim()) return err(res, 'full_name is required');
    if (!email?.trim() && !phone?.trim()) {
      return err(res, 'email or phone is required so we can verify and reply');
    }
    if (!REQUEST_TYPES.includes(request_type)) {
      return err(res, `request_type must be one of: ${REQUEST_TYPES.join(', ')}`);
    }
    if (!details?.trim() || details.trim().length < 8) {
      return err(res, 'Please describe what you need in a few words');
    }

    const row = {
      full_name: full_name.trim(),
      email: email?.trim().toLowerCase() || null,
      phone: phone?.trim() || null,
      request_type,
      details: details.trim().slice(0, 4000),
      status: 'received',
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('privacy_requests')
        .insert(row)
        .select()
        .single();
      if (!error && data) {
        notify.privacyRequest(data);
        return ok(res, {
          request: { id: data.id, status: data.status, request_type: data.request_type },
          message: 'We received your request and will respond within 30 days.',
        }, 201);
      }
      if (error) console.error('[POST /api/privacy/request]', error);
    }

    const fallback = { id: crypto.randomUUID(), ...row, created_at: new Date().toISOString() };
    captureFallbackLead('privacy_request', fallback);
    notify.privacyRequest(fallback);
    return ok(res, {
      request: { id: fallback.id, status: 'received', request_type },
      message: 'We received your request and will respond within 30 days.',
      fallback: true,
    }, 201);
  });

  /** GET /api/privacy/requests — admin — list rights requests. */
  app.get('/api/privacy/requests', async (req, res) => {
    if (!requireAdmin(req, res)) return;
    if (!requireDb(res)) return;

    const { status } = req.query;
    let query = supabase
      .from('privacy_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) return err(res, 'Failed to fetch privacy requests', 500);
    return ok(res, { requests: data ?? [] });
  });

  /** PATCH /api/privacy/requests/:id — admin — update status / notes. */
  app.patch('/api/privacy/requests/:id', async (req, res) => {
    if (!requireDb(res) || !requireAdmin(req, res)) return;
    const { status, staff_notes } = req.body || {};
    const updates = {};
    if (status) {
      if (!VALID_STATUS.includes(status)) {
        return err(res, `status must be one of: ${VALID_STATUS.join(', ')}`);
      }
      updates.status = status;
      if (status === 'completed' || status === 'rejected') {
        updates.resolved_at = new Date().toISOString();
      }
    }
    if (staff_notes !== undefined) updates.staff_notes = String(staff_notes).slice(0, 4000);
    if (!Object.keys(updates).length) return err(res, 'No updatable fields');

    const { data, error } = await supabase
      .from('privacy_requests')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();
    if (error || !data) return err(res, 'Failed to update request', 500);
    return ok(res, { request: data });
  });
}
