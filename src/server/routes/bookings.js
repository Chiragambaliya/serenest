/**
 * Bookings — payment orders, booking creation (with payment verification),
 * patient self-service listing, and admin management.
 */
import crypto from 'crypto';
import { ok, err, requireDb, requireAdmin, bearer } from '../http.js';
import { supabase, insertDroppingUnknownColumns } from '../db.js';
import { notify } from '../notify.js';
import { captureFallbackLead } from '../leads.js';
import { consentRecord, CONSENT_OPTIONAL_COLUMNS, isTruthyConsent } from '../privacy.js';
import {
  RZP_KEY_ID, paymentsEnabled, resolveFeeInr,
  createRazorpayOrder, verifyRazorpaySignature,
} from '../payments.js';

export function registerBookingRoutes(app) {
  /**
   * POST /api/payments/order
   * Create a Razorpay order for a booking. The amount is computed server-side
   * from the chosen professional's fee (never trusted from the client).
   */
  app.post('/api/payments/order', async (req, res) => {
    if (!paymentsEnabled()) return err(res, 'Payments are not enabled on this server.', 503);

    const { professional_id } = req.body || {};
    const amountInr = await resolveFeeInr(professional_id);

    // Razorpay minimum is 100 paise (₹1).
    if (!Number.isFinite(amountInr) || amountInr < 1) {
      return err(res, 'Invalid consultation fee for this booking.');
    }

    const order = await createRazorpayOrder(amountInr);
    if (!order?.id) return err(res, 'Could not start payment. Please try again.', 502);

    return ok(res, {
      order_id: order.id,
      amount: amountInr,
      currency: 'INR',
      key_id: RZP_KEY_ID,
    });
  });

  /**
   * POST /api/bookings
   * Create a new appointment booking request. When payments are enabled the
   * request must carry a verified Razorpay payment; the booking is only saved
   * after the signature checks out.
   */
  app.post('/api/bookings', async (req, res) => {
    const {
      patient_name, patient_phone, patient_email,
      practitioner_type, mode, preferred_date, preferred_time,
      language = 'English', notes = '', professional_id,
      razorpay_order_id, razorpay_payment_id, razorpay_signature,
    } = req.body;

    if (!patient_name?.trim())  return err(res, 'patient_name is required');
    if (!patient_phone?.trim()) return err(res, 'patient_phone is required');
    if (!practitioner_type)     return err(res, 'practitioner_type is required');
    if (!preferred_date)        return err(res, 'preferred_date is required');
    if (!preferred_time)        return err(res, 'preferred_time is required');
    if (!isTruthyConsent(req.body?.consent)) {
      return err(res, 'consent is required — please confirm you agree to be contacted about this appointment');
    }
    if (!isTruthyConsent(req.body?.age_attestation)) {
      return err(res, 'age_attestation is required — you must confirm you are 18 or booking as a parent/guardian');
    }

    const phone = patient_phone.replace(/[^\d]/g, '');
    if (phone.length !== 10 || !/^[6-9]/.test(phone)) {
      return err(res, 'patient_phone must be a valid 10-digit Indian mobile number');
    }

    // Payment gate — only when Razorpay is configured.
    let payment = { status: 'unpaid', id: null, order_id: null, amount: null };
    if (paymentsEnabled()) {
      const valid = verifyRazorpaySignature({
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        signature: razorpay_signature,
      });
      if (!valid) return err(res, 'Payment could not be verified. You have not been charged for an unconfirmed booking.', 402);
      payment = {
        status: 'paid',
        id: razorpay_payment_id,
        order_id: razorpay_order_id,
        amount: await resolveFeeInr(professional_id),
      };
    }

    const record = {
      patient_name: patient_name.trim(),
      patient_phone: phone,
      patient_email: patient_email?.trim() || null,
      practitioner_type,
      mode: mode || 'video',
      preferred_date,
      preferred_time,
      language,
      notes: notes.trim(),
      professional_id: professional_id || null,
      status: 'pending',
      payment_status: payment.status,
      payment_id: payment.id,
      payment_order_id: payment.order_id,
      amount_paid: payment.amount,
      ...consentRecord({ purpose: 'appointment_contact_and_care' }),
      age_attestation: true,
    };

    if (supabase) {
      const { data, error } = await insertDroppingUnknownColumns(
        'appointments',
        record,
        [...CONSENT_OPTIONAL_COLUMNS, 'payment_status', 'payment_id', 'payment_order_id', 'amount_paid'],
      );

      if (!error) {
        notify.booking(data);
        return ok(res, { booking: data }, 201);
      }
      console.error('[POST /api/bookings]', error);
    }

    // DB missing or insert failed — never turn away a patient. Alert the team
    // and persist the lead to the fallback file instead of erroring out.
    const fallback = { id: crypto.randomUUID(), ...record };
    captureFallbackLead('booking', fallback);
    notify.booking(fallback);
    return ok(res, { booking: fallback }, 201);
  });

  /**
   * GET /api/bookings/:id
   * Admin, or the authenticated patient whose email/phone matches the row.
   * Not a public capability URL — booking records contain health-adjacent PII.
   */
  app.get('/api/bookings/:id', async (req, res) => {
    if (!requireDb(res)) return;

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) return err(res, 'Booking not found', 404);

    if (process.env.ADMIN_SECRET && req.headers['x-admin-secret'] === process.env.ADMIN_SECRET) {
      return ok(res, { booking: data });
    }

    const token = bearer(req);
    if (!token) return err(res, 'Unauthorized', 401);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return err(res, 'Unauthorized', 401);

    const email = String(user.email || '').trim().toLowerCase();
    const { data: patient } = await supabase
      .from('patients')
      .select('phone')
      .eq('auth_user_id', user.id)
      .maybeSingle();
    const phone = patient?.phone ? String(patient.phone).replace(/[^\d]/g, '') : '';
    const owns = (email && String(data.patient_email || '').toLowerCase() === email)
      || (phone && String(data.patient_phone || '').replace(/[^\d]/g, '') === phone);
    if (!owns) return err(res, 'Forbidden', 403);

    return ok(res, { booking: data });
  });

  /**
   * GET /api/bookings
   * List all bookings (admin only — protect with ADMIN_SECRET in production).
   */
  app.get('/api/bookings', async (req, res) => {
    if (!requireDb(res) || !requireAdmin(req, res)) return;

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return err(res, 'Failed to fetch bookings', 500);
    return ok(res, { bookings: data });
  });

  /**
   * GET /api/patient/bookings
   * Return the authenticated patient's own appointments.
   * Matches by email (from JWT) and phone stored in the patients table,
   * so bookings made before account creation are also surfaced.
   */
  app.get('/api/patient/bookings', async (req, res) => {
    if (!requireDb(res)) return;

    const token = (req.headers['authorization'] ?? '').replace(/^Bearer\s+/i, '');
    if (!token) return err(res, 'Unauthorized', 401);

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return err(res, 'Unauthorized', 401);

    const email = user.email;

    const { data: patient } = await supabase
      .from('patients')
      .select('phone')
      .eq('auth_user_id', user.id)
      .single();

    const phone = patient?.phone ? patient.phone.replace(/[^\d]/g, '') : null;

    const [byEmail, byPhone] = await Promise.all([
      supabase.from('appointments').select('*').eq('patient_email', email).order('created_at', { ascending: false }),
      phone
        ? supabase.from('appointments').select('*').eq('patient_phone', phone).order('created_at', { ascending: false })
        : Promise.resolve({ data: [] }),
    ]);

    const seen = new Set();
    const bookings = [...(byEmail.data ?? []), ...(byPhone.data ?? [])]
      .filter((b) => { if (seen.has(b.id)) return false; seen.add(b.id); return true; })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return ok(res, { bookings });
  });

  /**
   * PATCH /api/bookings/:id/status
   * Update booking status (admin: confirm / cancel / complete).
   */
  app.patch('/api/bookings/:id/status', async (req, res) => {
    if (!requireDb(res) || !requireAdmin(req, res)) return;

    const VALID = ['pending', 'confirmed', 'cancelled', 'completed'];
    const { status } = req.body;
    if (!VALID.includes(status)) return err(res, `status must be one of: ${VALID.join(', ')}`);

    const { data, error } = await supabase
      .from('appointments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return err(res, 'Failed to update booking', 500);
    return ok(res, { booking: data });
  });

  /** DELETE /api/bookings/:id — hard-delete a booking (admin only) */
  app.delete('/api/bookings/:id', async (req, res) => {
    if (!requireDb(res) || !requireAdmin(req, res)) return;

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', req.params.id);

    if (error) return err(res, 'Failed to delete booking', 500);
    return ok(res, { deleted: true });
  });

  /** POST /api/bookings/:id/assign — assign a professional to a booking (admin) */
  app.post('/api/bookings/:id/assign', async (req, res) => {
    if (!requireDb(res) || !requireAdmin(req, res)) return;

    const { professional_id } = req.body;
    if (!professional_id) return err(res, 'professional_id is required');

    const { data, error } = await supabase
      .from('appointments')
      .update({ professional_id, status: 'confirmed' })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return err(res, 'Failed to assign professional', 500);
    return ok(res, { booking: data });
  });
}
