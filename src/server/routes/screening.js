/**
 * Self-screening (PHQ-9 / GAD-7) capture and admin listing.
 */
import crypto from 'crypto';
import { ok, err, requireDb, requireAdmin } from '../http.js';
import { supabase, insertDroppingUnknownColumns } from '../db.js';
import { notify } from '../notify.js';
import { captureFallbackLead } from '../leads.js';
import { consentRecord, CONSENT_OPTIONAL_COLUMNS, isTruthyConsent } from '../privacy.js';

export function registerScreeningRoutes(app) {
  /**
   * POST /api/screening
   * Save a self-screening response (PHQ-9 + GAD-7 + contact).
   */
  app.post('/api/screening', async (req, res) => {
    const {
      name, phone, email,
      reason, conditions = [], format, frequency,
      phq9_answers, phq9_score, phq9_severity,
      gad7_answers, gad7_score, gad7_severity,
      wants_callback = false,
    } = req.body;

    const cleanPhone = (phone || '').replace(/[^\d]/g, '');
    const hasContact = Boolean(name?.trim() || cleanPhone || email?.trim());
    if (hasContact && !isTruthyConsent(req.body?.consent)) {
      return err(res, 'consent is required to store your contact details with this screening');
    }

    const record = {
      name: name?.trim() || null,
      phone: cleanPhone || null,
      email: email?.trim() || null,
      reason: reason || null,
      conditions: Array.isArray(conditions) ? conditions : [],
      format: format || null,
      frequency: frequency || null,
      phq9_answers: phq9_answers || null,
      phq9_score: phq9_score ?? null,
      phq9_severity: phq9_severity || null,
      gad7_answers: gad7_answers || null,
      gad7_score: gad7_score ?? null,
      gad7_severity: gad7_severity || null,
    wants_callback,
    status: 'new',
    ...(hasContact ? consentRecord({ purpose: 'screening_follow_up' }) : {}),
  };

    if (supabase) {
      const { data, error } = await insertDroppingUnknownColumns(
        'screening_responses',
        record,
        CONSENT_OPTIONAL_COLUMNS,
      );

      if (!error) {
        notify.screening(data);
        return ok(res, { screening: data }, 201);
      }
      console.error('[POST /api/screening]', error);
    }

    // DB missing or insert failed — screenings can carry safety flags, so the
    // team alert and fallback capture must still go out.
    const fallback = { id: crypto.randomUUID(), ...record };
    captureFallbackLead('screening', fallback);
    notify.screening(fallback);
    return ok(res, { screening: fallback }, 201);
  });

  /** GET /api/screening — admin only — list all screening responses */
  app.get('/api/screening', async (req, res) => {
    if (!requireDb(res) || !requireAdmin(req, res)) return;

    const { data, error } = await supabase
      .from('screening_responses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return err(res, 'Failed to fetch screenings', 500);
    return ok(res, { screenings: data });
  });
}
