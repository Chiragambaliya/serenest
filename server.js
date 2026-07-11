import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import crypto from 'crypto';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from '@supabase/supabase-js';
import { notify } from './src/server/notify.js';
import { renderSeoHead, shouldNoindex, ROUTE_SEO, ROUTE_ALIASES, SITE_ORIGIN } from './src/lib/seo.js';
import { handleAssistantChat } from './src/server/aiAssistant.js';
import { publishPost, credentialStatus } from './src/server/socialPoster.js';
import { generateWeekOfPosts } from './src/server/socialContentGen.js';
import { generateAcademyContent } from './src/server/academyContentGen.js';
import cron from 'node-cron';

// ── Setup ────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const app  = express();
const dist = join(__dirname, 'dist');

// ── Supabase admin client (service role — server only) ───────
const supabase = (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY)
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
  : null;

// ── Security headers (Helmet) ────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false, // managed separately to allow inline scripts + Google Fonts
  crossOriginEmbedderPolicy: false, // needed for Daily.co video
}));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  next();
});

// ── Compression (gzip / br) ──────────────────────────────────
app.use(compression());

// ── Rate limiting ────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { ok: false, error: 'Too many requests — please try again in a few minutes.' },
});
const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { ok: false, error: 'Submission limit reached. Please try again later.' },
});
app.use('/api/', limiter);
app.use('/api/bookings', strictLimiter);
app.use('/api/screening', strictLimiter);
app.use('/api/professionals/apply', strictLimiter);
app.use('/api/contact', strictLimiter);
app.use('/api/subscribe', strictLimiter);

// ── CORS ─────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-secret'],
}));
app.use(express.json({ limit: '256kb' }));

// ── Helpers ──────────────────────────────────────────────────
function ok(res, data, status = 200) {
  return res.status(status).json({ ok: true, ...data });
}

function err(res, message, status = 400) {
  return res.status(status).json({ ok: false, error: message });
}

function requireDb(res) {
  if (!supabase) {
    err(res, 'Database not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY.', 503);
    return false;
  }
  return true;
}

// ── Razorpay (payments) ──────────────────────────────────────
const RZP_KEY_ID     = process.env.RAZORPAY_KEY_ID;
const RZP_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const DEFAULT_FEE_INR = Number(process.env.DEFAULT_FEE_INR) || 499;

/**
 * Payments are enforced only once both Razorpay keys are present — and can be
 * turned off with PAYMENTS_ENABLED=false as a kill-switch (e.g. if Razorpay is
 * down or under review), so patients can still book and pay offline.
 */
function paymentsEnabled() {
  if (String(process.env.PAYMENTS_ENABLED).toLowerCase() === 'false') return false;
  return Boolean(RZP_KEY_ID && RZP_KEY_SECRET);
}

/** Resolve the amount (in rupees) to charge for a booking, server-side. */
async function resolveFeeInr(professionalId) {
  if (professionalId && supabase) {
    const { data } = await supabase
      .from('professional_applications')
      .select('fee_inr')
      .eq('id', professionalId)
      .maybeSingle();
    const fee = Number(data?.fee_inr);
    if (Number.isFinite(fee) && fee > 0) return Math.round(fee);
  }
  return DEFAULT_FEE_INR;
}

/** Create a Razorpay order via the REST API (Basic auth — secret stays server-side). */
async function createRazorpayOrder(amountInr) {
  const auth = Buffer.from(`${RZP_KEY_ID}:${RZP_KEY_SECRET}`).toString('base64');
  const r = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` },
    body: JSON.stringify({
      amount: amountInr * 100, // paise
      currency: 'INR',
      payment_capture: 1,
    }),
  });
  if (!r.ok) {
    const detail = await r.text().catch(() => '');
    console.error('[razorpay order]', r.status, detail.slice(0, 200));
    return null;
  }
  return r.json();
}

/** Verify the Razorpay payment signature (HMAC-SHA256 of "order_id|payment_id"). */
function verifyRazorpaySignature({ order_id, payment_id, signature }) {
  if (!order_id || !payment_id || !signature) return false;
  const expected = crypto
    .createHmac('sha256', RZP_KEY_SECRET)
    .update(`${order_id}|${payment_id}`)
    .digest('hex');
  // Constant-time compare
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// ── Health ───────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  ok(res, {
    status: 'ok',
    assistant: process.env.OPENAI_API_KEY ? 'configured' : 'disabled',
    db: supabase ? 'connected' : 'not configured',
    daily: process.env.DAILY_API_KEY ? 'configured' : 'not configured',
    notifications: notify.isConfigured() ? 'enabled' : 'disabled',
    patient_email: notify.isPatientEmailEnabled() ? 'enabled' : 'disabled',
    team_whatsapp: notify.hasTeamWhatsApp() ? 'enabled' : 'disabled',
    payments: paymentsEnabled() ? 'enabled' : 'disabled',
    ts: new Date().toISOString(),
  });
});

// ══════════════════════════════════════════════════════════════
//  BOOKINGS
// ══════════════════════════════════════════════════════════════

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
  if (!requireDb(res)) return;

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

  const { data, error } = await supabase
    .from('appointments')
    .insert({
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
    })
    .select()
    .single();

  if (error) {
    console.error('[POST /api/bookings]', error);
    return err(res, 'Failed to save booking. Please try again.', 500);
  }

  notify.booking(data);
  return ok(res, { booking: data }, 201);
});

/**
 * GET /api/bookings/:id
 * Get a single booking by ID.
 */
app.get('/api/bookings/:id', async (req, res) => {
  if (!requireDb(res)) return;

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error || !data) return err(res, 'Booking not found', 404);
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

// ══════════════════════════════════════════════════════════════
//  PROFESSIONAL SELF-SERVICE PORTAL
//  A professional logs in with the email she applied with (Supabase
//  email OTP). Every endpoint resolves her own approved row from the
//  verified token email — she can never read or write another
//  professional's record, because the row id is never taken from the
//  client.
// ══════════════════════════════════════════════════════════════

function bearer(req) {
  return (req.headers['authorization'] ?? '').replace(/^Bearer\s+/i, '');
}

/**
 * Resolve the caller's Supabase identity and, if their verified email matches
 * an approved application, their own professional row. The row is looked up
 * from the token email only — never from client input — so a professional can
 * only ever act on her own record.
 * @returns {{ user: object|null, professional: object|null }}
 */
async function resolveProfessional(token) {
  if (!token || !supabase) return { user: null, professional: null };
  const { data: { user } = {}, error } = await supabase.auth.getUser(token);
  if (error || !user?.email) return { user: null, professional: null };
  const { data } = await supabase
    .from('professional_applications')
    .select('*')
    .ilike('email', user.email)          // case-insensitive exact match
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(1);
  return { user, professional: (data && data[0]) || null };
}

/**
 * GET /api/professional/me
 * Returns the authenticated professional's own profile row.
 * 401 if not signed in, 403 if signed in but not an approved professional.
 */
app.get('/api/professional/me', async (req, res) => {
  if (!requireDb(res)) return;
  const { user, professional } = await resolveProfessional(bearer(req));
  if (!user) return err(res, 'Unauthorized', 401);
  if (!professional) {
    return err(res, 'This account is not linked to an approved professional profile yet. If you applied recently, your application may still be under review.', 403);
  }
  return ok(res, { professional });
});

/**
 * PATCH /api/professional/me
 * Let a professional edit her own listing fields. Identity/verification
 * fields (email, phone, registration, role, status) stay admin-controlled.
 */
app.patch('/api/professional/me', async (req, res) => {
  if (!requireDb(res)) return;
  const { user, professional } = await resolveProfessional(bearer(req));
  if (!user) return err(res, 'Unauthorized', 401);
  if (!professional) return err(res, 'Not an approved professional', 403);

  const SELF_EDITABLE = [
    'full_name', 'degree', 'city', 'clinic', 'languages',
    'specialities', 'availability', 'social_handle',
    'fee_inr', 'duration_min', 'modes',
  ];
  const updates = {};
  for (const key of SELF_EDITABLE) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  if (updates.duration_min !== undefined && updates.duration_min !== null) {
    updates.duration_min = Number(updates.duration_min) || null;
  }
  if (!Object.keys(updates).length) return err(res, 'No updatable fields provided');

  const { data, error } = await supabase
    .from('professional_applications')
    .update(updates)
    .eq('id', professional.id)           // scoped to her own row
    .select()
    .single();

  if (error) {
    console.error('[PATCH /api/professional/me]', error);
    return err(res, 'Failed to save your profile. Please try again.', 500);
  }
  return ok(res, { professional: data });
});

/**
 * GET /api/professional/bookings
 * Appointments assigned to the authenticated professional.
 */
app.get('/api/professional/bookings', async (req, res) => {
  if (!requireDb(res)) return;
  const { user, professional } = await resolveProfessional(bearer(req));
  if (!user) return err(res, 'Unauthorized', 401);
  if (!professional) return err(res, 'Not an approved professional', 403);

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('professional_id', professional.id)
    .order('preferred_date', { ascending: false });

  if (error) {
    console.error('[GET /api/professional/bookings]', error);
    return err(res, 'Failed to load your appointments', 500);
  }
  return ok(res, { bookings: data ?? [] });
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

// ══════════════════════════════════════════════════════════════
//  SCREENING
// ══════════════════════════════════════════════════════════════

/**
 * POST /api/screening
 * Save a self-screening response (PHQ-9 + GAD-7 + contact).
 */
app.post('/api/screening', async (req, res) => {
  if (!requireDb(res)) return;

  const {
    name, phone, email,
    reason, conditions = [], format, frequency,
    phq9_answers, phq9_score, phq9_severity,
    gad7_answers, gad7_score, gad7_severity,
    wants_callback = false,
  } = req.body;

  const cleanPhone = (phone || '').replace(/[^\d]/g, '');

  const { data, error } = await supabase
    .from('screening_responses')
    .insert({
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
    })
    .select()
    .single();

  if (error) {
    console.error('[POST /api/screening]', error);
    return err(res, 'Failed to save screening response', 500);
  }

  notify.screening(data);
  return ok(res, { screening: data }, 201);
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

// ══════════════════════════════════════════════════════════════
//  PROFESSIONAL APPLICATIONS
// ══════════════════════════════════════════════════════════════

/**
 * POST /api/professionals/apply
 * Submit a professional onboarding application.
 */
app.post('/api/professionals/apply', async (req, res) => {
  if (!requireDb(res)) return;

  const {
    role, role_label, full_name, phone, email, social_handle,
    registration, degree, city, languages, specialities,
    fee_inr, duration_min, modes, availability,
  } = req.body;

  if (!role?.trim())      return err(res, 'role is required');
  if (!full_name?.trim()) return err(res, 'full_name is required');
  if (!phone?.trim())     return err(res, 'phone is required');

  const { data, error } = await supabase
    .from('professional_applications')
    .insert({
      role,
      role_label: role_label?.trim() || role,
      full_name: full_name.trim(),
      phone: phone.trim(),
      email: email?.trim() || null,
      social_handle: social_handle?.trim() || null,
      registration: registration?.trim() || null,
      degree: degree?.trim() || null,
      city: city?.trim() || null,
      languages: languages?.trim() || null,
      specialities: specialities?.trim() || null,
      fee_inr: fee_inr?.trim() || null,
      duration_min: duration_min ? Number(duration_min) : null,
      modes: modes || null,
      availability: availability?.trim() || null,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('[POST /api/professionals/apply]', error);
    return err(res, 'Failed to submit application. Please try again.', 500);
  }

  notify.professionalApplication(data);
  return ok(res, { application: data }, 201);
});

/**
 * GET /api/professionals/applications
 * List all professional applications (admin only).
 */
app.get('/api/professionals/applications', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;

  const { status } = req.query;
  let query = supabase
    .from('professional_applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);

  const { data, error } = await query;
  if (error) return err(res, 'Failed to fetch applications', 500);
  return ok(res, { applications: data });
});

/**
 * PATCH /api/professionals/applications/:id
 * Approve or reject a professional application (admin only).
 */
app.patch('/api/professionals/applications/:id', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;

  const VALID = ['pending', 'approved', 'rejected'];
  const { status } = req.body;
  if (!VALID.includes(status)) return err(res, `status must be one of: ${VALID.join(', ')}`);

  const { data, error } = await supabase
    .from('professional_applications')
    .update({ status })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return err(res, 'Failed to update application', 500);
  return ok(res, { application: data });
});

// ══════════════════════════════════════════════════════════════
//  PROFESSIONALS MANAGEMENT
// ══════════════════════════════════════════════════════════════

/** GET /api/professionals/directory — public patient directory (sanitized fields only) */
app.get('/api/professionals/directory', async (req, res) => {
  if (!requireDb(res)) return;

  const fields =
    'id,created_at,full_name,role,role_label,city,clinic,fee_inr,duration_min,languages,specialities,modes,availability,degree';

  const { data, error } = await supabase
    .from('professional_applications')
    .select(fields)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[GET /api/professionals/directory]', error);
    return err(res, 'Failed to load professionals', 500);
  }
  return ok(res, { professionals: data ?? [] });
});

/**
 * GET /api/professionals/verify?email= — is this email a joined (approved) professional?
 * Used to gate Academy clinician content. Returns only a boolean, no profile data.
 */
app.get('/api/professionals/verify', async (req, res) => {
  if (!requireDb(res)) return;

  const email = String(req.query.email ?? '').trim().toLowerCase();
  if (!email) return err(res, 'email is required');

  const { count, error } = await supabase
    .from('professional_applications')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'approved')
    .ilike('email', email);

  if (error) {
    console.error('[GET /api/professionals/verify]', error);
    return err(res, 'Failed to verify professional', 500);
  }
  return ok(res, { joined: (count ?? 0) > 0 });
});

/** GET /api/professionals/list — all approved professionals with booking counts */
app.get('/api/professionals/list', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;

  const { role } = req.query;
  let query = supabase
    .from('professional_applications')
    .select('*, appointments(id, status, preferred_date, preferred_time, patient_name, mode)')
    .eq('status', 'approved')
    .order('full_name');

  if (role) query = query.eq('role', role);

  const { data, error } = await query;
  if (error) return err(res, 'Failed to fetch professionals', 500);
  return ok(res, { professionals: data });
});

/** PATCH /api/professionals/:id — update professional profile details (admin) */
app.patch('/api/professionals/:id', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;

  const allowed = [
    'fee_inr', 'duration_min', 'availability',
    'modes', 'languages', 'specialities',
    'clinic', 'city', 'status',
  ];

  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  if (!Object.keys(updates).length) return err(res, 'No updatable fields provided');

  const { data, error } = await supabase
    .from('professional_applications')
    .update(updates)
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return err(res, 'Failed to update professional', 500);
  return ok(res, { professional: data });
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

// ══════════════════════════════════════════════════════════════
//  HIRING PIPELINE — JOB POSTINGS
// ══════════════════════════════════════════════════════════════

/** GET /api/jobs — public list of open job postings */
app.get('/api/jobs', async (req, res) => {
  if (!requireDb(res)) return;
  const { department } = req.query;
  let query = supabase
    .from('job_postings')
    .select('*')
    .eq('is_open', true)
    .order('created_at', { ascending: false });
  if (department) query = query.eq('department', department);
  const { data, error } = await query;
  if (error) return err(res, 'Failed to fetch jobs', 500);
  return ok(res, { jobs: data });
});

/** GET /api/jobs/all — all postings including closed (admin only) */
app.get('/api/jobs/all', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;
  const { data, error } = await supabase
    .from('job_postings')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return err(res, 'Failed to fetch job postings', 500);
  return ok(res, { jobs: data });
});

/** POST /api/jobs — create a job posting (admin only) */
app.post('/api/jobs', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;
  const { title, department, location, type, description, requirements, salary_range, closes_at } = req.body;
  if (!title?.trim())      return err(res, 'title is required');
  if (!department?.trim()) return err(res, 'department is required');

  const { data, error } = await supabase
    .from('job_postings')
    .insert({
      title: title.trim(),
      department: department.trim(),
      location: location?.trim() || 'Remote',
      type: type || 'full_time',
      description: description?.trim() || null,
      requirements: requirements?.trim() || null,
      salary_range: salary_range?.trim() || null,
      closes_at: closes_at || null,
      is_open: true,
    })
    .select()
    .single();
  if (error) return err(res, 'Failed to create job posting', 500);
  return ok(res, { job: data }, 201);
});

/** PATCH /api/jobs/:id — update or close a job posting (admin only) */
app.patch('/api/jobs/:id', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;
  const allowed = ['title','department','location','type','description','requirements','salary_range','closes_at','is_open'];
  const updates = {};
  for (const k of allowed) if (req.body[k] !== undefined) updates[k] = req.body[k];
  if (!Object.keys(updates).length) return err(res, 'No updatable fields');
  const { data, error } = await supabase
    .from('job_postings').update(updates).eq('id', req.params.id).select().single();
  if (error) return err(res, 'Failed to update posting', 500);
  return ok(res, { job: data });
});

/** DELETE /api/jobs/:id — permanently delete a posting (admin only) */
app.delete('/api/jobs/:id', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;
  const { error } = await supabase.from('job_postings').delete().eq('id', req.params.id);
  if (error) return err(res, 'Failed to delete posting', 500);
  return ok(res, { message: 'Deleted' });
});

// ── Hiring pipeline — pipeline overview ─────────────────────
/** GET /api/hiring/pipeline — counts per stage (admin only) */
app.get('/api/hiring/pipeline', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;

  const stages = ['new','reviewing','shortlisted','interviewing','hired','rejected'];
  const counts = await Promise.all(
    stages.map((s) =>
      supabase.from('job_applications').select('*', { count: 'exact', head: true }).eq('status', s)
    )
  );

  const pipeline = {};
  stages.forEach((s, i) => { pipeline[s] = counts[i].count ?? 0; });

  // also fetch recent applications with job title context
  const { data: recent } = await supabase
    .from('job_applications')
    .select('id, full_name, role, department, status, created_at')
    .order('created_at', { ascending: false })
    .limit(10);

  return ok(res, { pipeline, recent: recent ?? [] });
});

// ══════════════════════════════════════════════════════════════
//  HIRING PIPELINE — INTERVIEWS
// ══════════════════════════════════════════════════════════════

/** GET /api/hiring/interviews — all interviews (admin only) */
app.get('/api/hiring/interviews', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;
  const { application_id } = req.query;
  let query = supabase
    .from('interview_schedules')
    .select('*, job_applications(full_name, email, role, department)')
    .order('scheduled_at');
  if (application_id) query = query.eq('application_id', application_id);
  const { data, error } = await query;
  if (error) return err(res, 'Failed to fetch interviews', 500);
  return ok(res, { interviews: data });
});

/** POST /api/hiring/interviews — schedule an interview (admin only) */
app.post('/api/hiring/interviews', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;
  const { application_id, round, interview_type, scheduled_at, duration_min, interviewer_name, meeting_link, notes } = req.body;
  if (!application_id) return err(res, 'application_id is required');
  if (!scheduled_at)   return err(res, 'scheduled_at is required');

  const { data, error } = await supabase
    .from('interview_schedules')
    .insert({
      application_id,
      round: round ?? 1,
      interview_type: interview_type || 'video',
      scheduled_at,
      duration_min: duration_min ?? 45,
      interviewer_name: interviewer_name?.trim() || null,
      meeting_link: meeting_link?.trim() || null,
      notes: notes?.trim() || null,
      outcome: 'pending',
    })
    .select()
    .single();

  if (error) return err(res, 'Failed to schedule interview', 500);

  // auto-advance application status to interviewing
  await supabase
    .from('job_applications')
    .update({ status: 'interviewing' })
    .eq('id', application_id)
    .eq('status', 'shortlisted');

  return ok(res, { interview: data }, 201);
});

/** PATCH /api/hiring/interviews/:id — update outcome (admin only) */
app.patch('/api/hiring/interviews/:id', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;
  const allowed = ['outcome','outcome_notes','meeting_link','notes','scheduled_at','interviewer_name'];
  const updates = {};
  for (const k of allowed) if (req.body[k] !== undefined) updates[k] = req.body[k];
  const { data, error } = await supabase
    .from('interview_schedules').update(updates).eq('id', req.params.id).select().single();
  if (error) return err(res, 'Failed to update interview', 500);
  return ok(res, { interview: data });
});

// ── Hiring pipeline — offers ─────────────────────────────────
/** POST /api/hiring/offer/:applicationId — extend an offer (admin only) */
app.post('/api/hiring/offer/:applicationId', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;
  const { offer_salary, offer_date, offer_deadline, joining_date } = req.body;
  if (!offer_salary) return err(res, 'offer_salary is required');

  const { data, error } = await supabase
    .from('job_applications')
    .update({
      offer_salary,
      offer_date: offer_date || new Date().toISOString().split('T')[0],
      offer_deadline: offer_deadline || null,
      joining_date: joining_date || null,
      status: 'hired',
    })
    .eq('id', req.params.applicationId)
    .select()
    .single();

  if (error) return err(res, 'Failed to extend offer', 500);
  return ok(res, { application: data });
});

/** PATCH /api/hiring/offer/:applicationId/response — accept or decline (admin) */
app.patch('/api/hiring/offer/:applicationId/response', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;
  const { accepted } = req.body;
  if (accepted === undefined) return err(res, 'accepted (boolean) is required');

  const { data, error } = await supabase
    .from('job_applications')
    .update({
      offer_accepted: accepted,
      status: accepted ? 'hired' : 'rejected',
    })
    .eq('id', req.params.applicationId)
    .select()
    .single();

  if (error) return err(res, 'Failed to record offer response', 500);
  return ok(res, { application: data });
});

/** POST /api/hiring/reject/:applicationId — reject with reason (admin only) */
app.post('/api/hiring/reject/:applicationId', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;
  const { rejection_reason } = req.body;

  const { data, error } = await supabase
    .from('job_applications')
    .update({ status: 'rejected', rejection_reason: rejection_reason?.trim() || null })
    .eq('id', req.params.applicationId)
    .select()
    .single();

  if (error) return err(res, 'Failed to reject application', 500);
  return ok(res, { application: data });
});

// ══════════════════════════════════════════════════════════════
//  JOB APPLICATIONS (HR)
// ══════════════════════════════════════════════════════════════

/** POST /api/jobs/apply — submit a job application (public) */
app.post('/api/jobs/apply', async (req, res) => {
  if (!requireDb(res)) return;

  const {
    full_name, email, phone, city,
    linkedin_url, portfolio_url, cover_note,
    department, role, resume_url,
  } = req.body;

  if (!full_name?.trim()) return err(res, 'full_name is required');
  if (!email?.trim())     return err(res, 'email is required');
  if (!department?.trim()) return err(res, 'department is required');
  if (!role?.trim())       return err(res, 'role is required');

  const { data, error } = await supabase
    .from('job_applications')
    .insert({
      full_name: full_name.trim(),
      email: email.trim(),
      phone: phone?.trim() || null,
      city: city?.trim() || null,
      linkedin_url: linkedin_url?.trim() || null,
      portfolio_url: portfolio_url?.trim() || null,
      cover_note: cover_note?.trim() || null,
      department: department.trim(),
      role: role.trim(),
      resume_url: resume_url?.trim() || null,
      status: 'new',
    })
    .select()
    .single();

  if (error) {
    console.error('[POST /api/jobs/apply]', error);
    return err(res, 'Failed to submit application. Please try again.', 500);
  }

  notify.jobApplication({
    candidate_name:  data.full_name,
    candidate_phone: data.phone,
    candidate_email: data.email,
    position:        `${data.role} (${data.department})`,
  });
  return ok(res, { application: data }, 201);
});

/** GET /api/jobs/applications — list all job applications (admin only) */
app.get('/api/jobs/applications', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;

  const { department, status } = req.query;
  let query = supabase
    .from('job_applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (department) query = query.eq('department', department);
  if (status)     query = query.eq('status', status);

  const { data, error } = await query;
  if (error) return err(res, 'Failed to fetch job applications', 500);
  return ok(res, { applications: data });
});

/** PATCH /api/jobs/applications/:id — update status + HR notes (admin only) */
app.patch('/api/jobs/applications/:id', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;

  const VALID = ['new', 'reviewing', 'shortlisted', 'interviewing', 'hired', 'rejected'];
  const { status, hr_notes } = req.body;

  if (status && !VALID.includes(status)) {
    return err(res, `status must be one of: ${VALID.join(', ')}`);
  }

  const updates = {};
  if (status)   updates.status   = status;
  if (hr_notes !== undefined) updates.hr_notes = hr_notes;

  const { data, error } = await supabase
    .from('job_applications')
    .update(updates)
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return err(res, 'Failed to update application', 500);
  return ok(res, { application: data });
});

// ══════════════════════════════════════════════════════════════
//  VIDEO ROOMS (Daily.co)
// ══════════════════════════════════════════════════════════════

const DAILY_URL = 'https://api.daily.co/v1';

/**
 * POST /api/rooms
 * Create a Daily.co video room for an appointment.
 * The Daily API key stays on the server — never exposed to the browser.
 */
app.post('/api/rooms', async (req, res) => {
  const { appointment_id } = req.body;
  if (!appointment_id) return err(res, 'appointment_id is required');

  const key = process.env.DAILY_API_KEY;
  if (!key) return err(res, 'Video rooms not configured on this server', 503);

  const roomName = `serenest-${appointment_id}`;

  // Return existing room if it already exists
  const checkRes = await fetch(`${DAILY_URL}/rooms/${roomName}`, {
    headers: { Authorization: `Bearer ${key}` },
  });

  if (checkRes.ok) {
    const existing = await checkRes.json();
    return ok(res, { room: existing });
  }

  // Create a new room (expires in 2 hours)
  const createRes = await fetch(`${DAILY_URL}/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      name: roomName,
      properties: {
        max_participants: 2,
        enable_chat: true,
        enable_screenshare: false,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2,
        eject_at_room_exp: true,
      },
    }),
  });

  if (!createRes.ok) {
    const detail = await createRes.text();
    console.error('[POST /api/rooms] Daily error:', detail);
    return err(res, 'Failed to create video room', 502);
  }

  const room = await createRes.json();
  return ok(res, { room }, 201);
});

/**
 * GET /api/rooms/:appointmentId
 * Get an existing Daily.co room by appointment ID.
 */
app.get('/api/rooms/:appointmentId', async (req, res) => {
  const key = process.env.DAILY_API_KEY;
  if (!key) return err(res, 'Video rooms not configured on this server', 503);

  const roomName = `serenest-${req.params.appointmentId}`;
  const r = await fetch(`${DAILY_URL}/rooms/${roomName}`, {
    headers: { Authorization: `Bearer ${key}` },
  });

  if (!r.ok) return err(res, 'Room not found', 404);
  return ok(res, { room: await r.json() });
});

// ══════════════════════════════════════════════════════════════
//  PRESCRIPTIONS
// ══════════════════════════════════════════════════════════════

/**
 * GET /api/prescriptions/:appointmentId
 * Public — a patient opens this from their consultation room link.
 */
app.get('/api/prescriptions/:appointmentId', async (req, res) => {
  if (!requireDb(res)) return;

  const { data, error } = await supabase
    .from('prescriptions')
    .select('*')
    .eq('appointment_id', req.params.appointmentId)
    .maybeSingle();

  if (error) {
    console.error('[GET /api/prescriptions/:appointmentId]', error);
    return err(res, 'Failed to load prescription', 500);
  }
  return ok(res, { prescription: data ?? null });
});

/**
 * POST /api/prescriptions
 * Issue or update a prescription for an appointment (admin only).
 * Upserts on appointment_id — re-issuing replaces the previous draft
 * unless it has already been locked.
 */
app.post('/api/prescriptions', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;

  const { appointment_id, medicines = [] } = req.body;

  if (!appointment_id) return err(res, 'appointment_id is required');
  if (!Array.isArray(medicines) || medicines.length === 0) {
    return err(res, 'At least one medicine is required');
  }

  const { data: existing } = await supabase
    .from('prescriptions')
    .select('id, is_locked')
    .eq('appointment_id', appointment_id)
    .maybeSingle();

  if (existing?.is_locked) return err(res, 'This prescription is locked and cannot be changed', 409);

  // Whitelist of text fields accepted from the issue form.
  const TEXT_FIELDS = [
    'professional_name', 'patient_name', 'mode', 'advice', 'review_after',
    'patient_age_gender', 'patient_contact',
    'doctor_qualification', 'doctor_specialization', 'doctor_reg_no', 'doctor_contact',
    'chief_complaints', 'complaint_duration', 'history_summary',
    'provisional_diagnosis', 'risk_assessment', 'emergency_advice', 'important_notes',
    'clinic_name', 'clinic_address', 'clinic_contact', 'clinic_website',
  ];
  const row = {
    appointment_id,
    professional_id: req.body.professional_id || null,
    medicines,
    follow_up_date: req.body.follow_up_date || null,
    updated_at: new Date().toISOString(),
  };
  for (const f of TEXT_FIELDS) {
    row[f] = typeof req.body[f] === 'string' ? req.body[f].trim() || null : null;
  }

  const { data, error } = await supabase
    .from('prescriptions')
    .upsert(row, { onConflict: 'appointment_id' })
    .select()
    .single();

  if (error) {
    console.error('[POST /api/prescriptions]', error);
    return err(res, 'Failed to save prescription', 500);
  }
  return ok(res, { prescription: data }, 201);
});

/**
 * PATCH /api/prescriptions/:id/lock
 * Lock a prescription so it can no longer be edited (admin only).
 */
app.patch('/api/prescriptions/:id/lock', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;

  const { data, error } = await supabase
    .from('prescriptions')
    .update({ is_locked: true, locked_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return err(res, 'Failed to lock prescription', 500);
  return ok(res, { prescription: data });
});

// ══════════════════════════════════════════════════════════════
//  ADMIN — aggregated helpers
// ══════════════════════════════════════════════════════════════

function requireAdmin(req, res) {
  // Deny by default when ADMIN_SECRET isn't configured — otherwise
  // `undefined !== undefined` would let an unauthenticated request through.
  if (!process.env.ADMIN_SECRET || req.headers['x-admin-secret'] !== process.env.ADMIN_SECRET) {
    err(res, 'Unauthorized', 401);
    return false;
  }
  return true;
}

/** GET /api/admin/stats — counts for the dashboard overview */
app.get('/api/admin/stats', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;

  const tables = [
    'appointments', 'professional_applications',
    'contact_messages', 'signups', 'job_applications',
  ];

  const results = await Promise.all(
    tables.map((t) =>
      supabase.from(t).select('*', { count: 'exact', head: true })
    )
  );

  const [bookings, applications, messages, signups, jobs] = results.map(
    (r) => (r.error ? 0 : (r.count ?? 0))
  );

  // pending counts + approved professionals
  const [pendingBookings, pendingApps, newJobs, approvedProfessionals] = await Promise.all([
    supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('professional_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('job_applications').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('professional_applications').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
  ]);

  return ok(res, {
    stats: {
      bookings,
      applications,
      messages,
      signups,
      jobs,
      pending_bookings: pendingBookings.count ?? 0,
      pending_applications: pendingApps.count ?? 0,
      new_jobs: newJobs.count ?? 0,
      active_professionals: approvedProfessionals.count ?? 0,
    },
  });
});

/** GET /api/contacts — list contact messages (admin only) */
app.get('/api/contacts', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;

  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return err(res, 'Failed to fetch messages', 500);
  return ok(res, { messages: data });
});

/** DELETE /api/contacts/:id — delete a contact message (admin only) */
app.delete('/api/contacts/:id', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;

  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', req.params.id);

  if (error) return err(res, 'Failed to delete message', 500);
  return ok(res, { deleted: true });
});

/** GET /api/signups — list waitlist signups (admin only) */
app.get('/api/signups', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;

  const { data, error } = await supabase
    .from('signups')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return err(res, 'Failed to fetch signups', 500);
  return ok(res, { signups: data });
});

// ══════════════════════════════════════════════════════════════
//  VISITOR TRACKING (WhatsApp per new visitor/day; email configurable)
// ══════════════════════════════════════════════════════════════

// Daily-rotating sets — reset at midnight UTC.
let visitorDay   = new Date().toISOString().slice(0, 10);
let seenVisitors = new Set();
let seenAssistantOpens = new Set();

function rolloverIfNeeded() {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== visitorDay) {
    visitorDay   = today;
    seenVisitors = new Set();
    seenAssistantOpens = new Set();
  }
}

/** Classify a user-agent string into a coarse device type. */
function deviceFromUA(ua = '') {
  const s = ua.toLowerCase();
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/.test(s)) return 'tablet';
  if (/mobi|iphone|ipod|android.*mobile|windows phone/.test(s)) return 'mobile';
  return 'desktop';
}

/** POST /api/track/visit — quietly records a visit. */
app.post('/api/track/visit', (req, res) => {
  rolloverIfNeeded();

  const { vid, path = '/', referrer = '' } = req.body || {};
  const ip = (req.headers['x-forwarded-for']?.split(',')[0] || req.ip || '').trim();
  const ua = req.headers['user-agent'] || '';
  const device = deviceFromUA(ua);
  // Approximate country if the hosting platform/CDN supplies a header
  // (Cloudflare / Vercel). Render does not by default — stays null then.
  const country = (req.headers['cf-ipcountry'] || req.headers['x-vercel-ip-country'] || null);

  // Persist every visit (best-effort — never block or fail the beacon).
  if (supabase) {
    supabase.from('site_visits').insert({
      visitor_id: vid || null,
      path: String(path).slice(0, 300),
      referrer: String(referrer).slice(0, 300) || null,
      device,
      country: country && country !== 'XX' ? country : null,
    }).then(({ error }) => {
      if (error) console.warn('[track/visit] insert:', error.message);
    });
  }

  // Fingerprint = browser-supplied vid (cookie-less) + IP + UA hash
  const fp = `${vid || 'anon'}|${ip}`;
  if (seenVisitors.has(fp)) return ok(res, { unique: false });

  seenVisitors.add(fp);
  notify.siteVisitor({
    count: seenVisitors.size,
    path, referrer,
    userAgent: ua,
  });

  return ok(res, { unique: true, total_today: seenVisitors.size });
});

/** POST /api/assistant/notify-open — Serenest Guide opened (team WhatsApp, deduped / day / visitor). */
app.post('/api/assistant/notify-open', (req, res) => {
  rolloverIfNeeded();

  const { vid, path: pg = '/' } = req.body || {};
  const ip = (req.headers['x-forwarded-for']?.split(',')[0] || req.ip || '').trim();
  const fp = `guide|${vid || 'anon'}|${ip}`;
  if (seenAssistantOpens.has(fp)) return ok(res, { notified: false });

  seenAssistantOpens.add(fp);
  notify.serenestGuideOpened({ path: typeof pg === 'string' ? pg : '/' });

  return ok(res, { notified: true });
});

/** GET /api/track/today — admin only — quick traffic count. */
app.get('/api/track/today', (req, res) => {
  if (!requireAdmin(req, res)) return;
  rolloverIfNeeded();
  return ok(res, { date: visitorDay, unique_visitors: seenVisitors.size });
});

/** GET /api/track/stats — admin only — persisted traffic analytics. */
app.get('/api/track/stats', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;

  const now = new Date();
  const since = (days) => new Date(now.getTime() - days * 86400000).toISOString();
  const startOfToday = new Date(now); startOfToday.setHours(0, 0, 0, 0);

  // Pull the last 30 days of visits once, then aggregate in memory.
  const { data: rows, error } = await supabase
    .from('site_visits')
    .select('created_at, visitor_id, path, referrer, device, country')
    .gte('created_at', since(30))
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[GET /api/track/stats]', error);
    return err(res, 'Failed to load traffic', 500);
  }

  const all = rows ?? [];
  const todayIso = startOfToday.toISOString();
  const weekIso = since(7);

  const inToday = all.filter((r) => r.created_at >= todayIso);
  const inWeek = all.filter((r) => r.created_at >= weekIso);

  const uniq = (list) => new Set(list.map((r) => r.visitor_id || r.created_at)).size;

  const tally = (list, key) => {
    const m = new Map();
    for (const r of list) {
      const v = r[key] || (key === 'referrer' ? 'Direct / none' : '—');
      m.set(v, (m.get(v) || 0) + 1);
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  };

  const cleanRef = (r) => {
    if (!r) return 'Direct / none';
    try { return new URL(r).hostname.replace(/^www\./, ''); } catch { return r.slice(0, 60); }
  };
  const refList = inWeek.map((r) => ({ ...r, referrer: cleanRef(r.referrer) }));

  return ok(res, {
    totals: {
      today: inToday.length,
      today_unique: uniq(inToday),
      week: inWeek.length,
      week_unique: uniq(inWeek),
      month: all.length,
      month_unique: uniq(all),
    },
    top_pages: tally(inWeek, 'path').slice(0, 12),
    top_referrers: tally(refList, 'referrer').slice(0, 10),
    devices: tally(inWeek, 'device'),
    recent: all.slice(0, 40),
  });
});

// ══════════════════════════════════════════════════════════════
//  SUBSCRIBERS (opt-in email capture)
// ══════════════════════════════════════════════════════════════

/** POST /api/subscribe — public — capture an opt-in email. */
app.post('/api/subscribe', async (req, res) => {
  if (!requireDb(res)) return;

  const { email, source } = req.body || {};
  const clean = (email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
    return err(res, 'Please enter a valid email address.');
  }

  const { data, error } = await supabase
    .from('subscribers')
    .upsert({ email: clean, source: source?.slice(0, 80) || null }, { onConflict: 'email' })
    .select()
    .single();

  if (error) {
    console.error('[POST /api/subscribe]', error);
    return err(res, 'Could not save your email. Please try again.', 500);
  }

  notify.subscriber(clean, source);

  return ok(res, { subscriber: data }, 201);
});

/** GET /api/academy/learners — admin only — registered Academy accounts. */
app.get('/api/academy/learners', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;

  const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) {
    console.error('[GET /api/academy/learners]', error);
    return err(res, 'Failed to fetch learners', 500);
  }

  const learners = (data?.users ?? []).map((u) => ({
    id: u.id,
    email: u.email,
    full_name: u.user_metadata?.full_name ?? null,
    role: u.user_metadata?.role ?? null,
    created_at: u.created_at,
    confirmed: Boolean(u.email_confirmed_at),
  }));
  return ok(res, { learners });
});

/** GET /api/academy/content — public — active content items ordered pinned-first. */
app.get('/api/academy/content', async (req, res) => {
  if (!requireDb(res)) return;
  const { data, error } = await supabase
    .from('academy_content')
    .select('*')
    .eq('is_active', true)
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) {
    console.error('[GET /api/academy/content]', error);
    return err(res, 'Failed to fetch academy content', 500);
  }
  return ok(res, { content: data ?? [] });
});

/** GET /api/academy/content/all — admin only — all items including inactive. */
app.get('/api/academy/content/all', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;
  const { data, error } = await supabase
    .from('academy_content')
    .select('*')
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) {
    console.error('[GET /api/academy/content/all]', error);
    return err(res, 'Failed to fetch academy content', 500);
  }
  return ok(res, { content: data ?? [] });
});

/** POST /api/academy/content — admin only — create a content item. */
app.post('/api/academy/content', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;
  const { type = 'announcement', title, body, link, link_label, is_active = true, pinned = false } = req.body ?? {};
  if (!title?.trim()) return err(res, 'title is required', 400);
  const { data, error } = await supabase
    .from('academy_content')
    .insert([{ type, title: title.trim(), body: body ?? null, link: link ?? null, link_label: link_label ?? 'Learn more', is_active, pinned }])
    .select()
    .single();
  if (error) {
    console.error('[POST /api/academy/content]', error);
    return err(res, 'Failed to create content item', 500);
  }
  return ok(res, { item: data });
});

/** PATCH /api/academy/content/:id — admin only — update a content item. */
app.patch('/api/academy/content/:id', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;
  const { id } = req.params;
  const allowed = ['type', 'title', 'body', 'link', 'link_label', 'is_active', 'pinned'];
  const updates = Object.fromEntries(Object.entries(req.body ?? {}).filter(([k]) => allowed.includes(k)));
  if (updates.title !== undefined && !updates.title?.trim()) return err(res, 'title cannot be empty', 400);
  if (updates.title) updates.title = updates.title.trim();
  const { data, error } = await supabase
    .from('academy_content')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) {
    console.error('[PATCH /api/academy/content/:id]', error);
    return err(res, 'Failed to update content item', 500);
  }
  return ok(res, { item: data });
});

/** DELETE /api/academy/content/:id — admin only — delete a content item. */
app.delete('/api/academy/content/:id', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;
  const { id } = req.params;
  const { error } = await supabase.from('academy_content').delete().eq('id', id);
  if (error) {
    console.error('[DELETE /api/academy/content/:id]', error);
    return err(res, 'Failed to delete content item', 500);
  }
  return ok(res, { deleted: id });
});

/** POST /api/academy/content/generate — admin — AI generates a batch of academy content items */
app.post('/api/academy/content/generate', async (req, res) => {
  if (!requireAdmin(req, res)) return;
  if (!process.env.ANTHROPIC_API_KEY) return err(res, 'ANTHROPIC_API_KEY not configured', 503);
  const { focus = null, count = 4, types } = req.body ?? {};
  try {
    const result = await generateAcademyContent({ focus, count: Math.min(count || 4, 6), types });
    return ok(res, result);
  } catch (e) {
    console.error('[POST /api/academy/content/generate]', e.message);
    return err(res, e.message, 500);
  }
});

// ─────────────────────────────────────────────────────────────────
// SOCIAL MEDIA SCHEDULING
// ─────────────────────────────────────────────────────────────────

/** GET /api/social/status — admin — check credential config */
app.get('/api/social/status', (req, res) => {
  if (!requireAdmin(req, res)) return;
  return ok(res, credentialStatus());
});

/** GET /api/social/posts — admin — list all posts */
app.get('/api/social/posts', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;
  const { data, error } = await supabase
    .from('social_posts')
    .select('*')
    .order('scheduled_at', { ascending: false })
    .limit(100);
  if (error) return err(res, 'Could not load posts', 500);
  return ok(res, { posts: data });
});

/** POST /api/social/posts — admin — create / schedule a post */
app.post('/api/social/posts', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;
  const { platform, caption, hashtags, image_url, scheduled_at, status } = req.body;
  if (!platform || !caption?.trim()) return err(res, 'platform and caption are required');
  if (!scheduled_at) return err(res, 'scheduled_at is required');
  const { data, error } = await supabase.from('social_posts').insert({
    platform,
    caption: caption.trim(),
    hashtags: hashtags?.trim() || null,
    image_url: image_url?.trim() || null,
    scheduled_at,
    status: status ?? 'scheduled',
  }).select().single();
  if (error) return err(res, 'Could not create post', 500);
  return ok(res, { post: data });
});

/** PATCH /api/social/posts/:id — admin — edit a post */
app.patch('/api/social/posts/:id', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;
  const { id } = req.params;
  const allowed = ['platform','caption','hashtags','image_url','scheduled_at','status'];
  const updates = {};
  for (const k of allowed) if (req.body[k] !== undefined) updates[k] = req.body[k];
  const { data, error } = await supabase.from('social_posts').update(updates).eq('id', id).select().single();
  if (error) return err(res, 'Could not update post', 500);
  return ok(res, { post: data });
});

/** DELETE /api/social/posts/:id — admin — delete a post */
app.delete('/api/social/posts/:id', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;
  const { id } = req.params;
  const { error } = await supabase.from('social_posts').delete().eq('id', id);
  if (error) return err(res, 'Could not delete post', 500);
  return ok(res, { deleted: id });
});

/** POST /api/social/posts/:id/publish — admin — publish immediately */
app.post('/api/social/posts/:id/publish', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;
  const { id } = req.params;
  const { data: post, error: fetchErr } = await supabase
    .from('social_posts').select('*').eq('id', id).single();
  if (fetchErr || !post) return err(res, 'Post not found', 404);
  if (post.status === 'posted') return err(res, 'Already posted');

  const result = await publishPost(post);
  const newStatus = result.errors.length === 0 ? 'posted'
    : (result.linkedin_post_id || result.instagram_post_id) ? 'partial' : 'failed';

  await supabase.from('social_posts').update({
    status: newStatus,
    posted_at: newStatus !== 'failed' ? new Date().toISOString() : null,
    linkedin_post_id: result.linkedin_post_id,
    instagram_post_id: result.instagram_post_id,
    error_message: result.errors.length ? result.errors.join(' | ') : null,
  }).eq('id', id);

  return ok(res, { status: newStatus, errors: result.errors });
});

/** POST /api/social/generate — admin — AI generates a week of posts */
app.post('/api/social/generate', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;
  if (!process.env.ANTHROPIC_API_KEY) return err(res, 'ANTHROPIC_API_KEY not configured', 503);

  const { weekNumber, startDate, recentTopics, focus } = req.body;
  if (!startDate) return err(res, 'startDate is required');

  try {
    const result = await generateWeekOfPosts({
      weekNumber: weekNumber ?? 1,
      startDate,
      recentTopics: recentTopics ?? [],
      focus: focus ?? null,
    });
    return ok(res, result);
  } catch (e) {
    console.error('[POST /api/social/generate]', e.message);
    return err(res, `Generation failed: ${e.message}`, 500);
  }
});

/** POST /api/social/generate/save — admin — save AI-generated posts to DB */
app.post('/api/social/generate/save', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;
  const { posts } = req.body;
  if (!Array.isArray(posts) || posts.length === 0) return err(res, 'posts array required');

  const rows = posts.map(({ platform, caption, hashtags, image_brief, scheduled_at }) => ({
    platform, caption, hashtags: hashtags ?? null,
    image_url: null,
    scheduled_at, status: 'scheduled',
  }));

  const { data, error } = await supabase.from('social_posts').insert(rows).select();
  if (error) return err(res, 'Could not save posts', 500);
  return ok(res, { saved: data.length, posts: data });
});

// ─── Cron: publish due posts every minute ───────────────────────
cron.schedule('* * * * *', async () => {
  if (!supabase) return;
  const { data: duePosts } = await supabase
    .from('social_posts')
    .select('*')
    .eq('status', 'scheduled')
    .lte('scheduled_at', new Date().toISOString())
    .limit(10);

  if (!duePosts?.length) return;

  for (const post of duePosts) {
    try {
      const result = await publishPost(post);
      const newStatus = result.errors.length === 0 ? 'posted'
        : (result.linkedin_post_id || result.instagram_post_id) ? 'partial' : 'failed';
      await supabase.from('social_posts').update({
        status: newStatus,
        posted_at: newStatus !== 'failed' ? new Date().toISOString() : null,
        linkedin_post_id: result.linkedin_post_id,
        instagram_post_id: result.instagram_post_id,
        error_message: result.errors.length ? result.errors.join(' | ') : null,
      }).eq('id', post.id);
      console.log(`[social-cron] ${post.platform} post ${post.id} → ${newStatus}`);
    } catch (e) {
      console.error(`[social-cron] post ${post.id} failed:`, e.message);
      await supabase.from('social_posts').update({
        status: 'failed', error_message: e.message,
      }).eq('id', post.id);
    }
  }
});

// ─── Cron: appointment reminders (~24h before a confirmed session) ──────
// Every 15 minutes: email each confirmed appointment happening within the
// next 24 hours whose reminder hasn't been sent (reminder_sent_at is null).
// The flag is set only after Resend accepts the patient email, so transient
// failures retry on the next tick. Requires the reminder_sent_at column
// (supabase/migrations/2026_07_09_add_appointment_reminder_sent_at.sql).
function istDateString(offsetDays = 0) {
  return new Date(Date.now() + offsetDays * 86400000)
    .toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

cron.schedule('4,19,34,49 * * * *', async () => {
  if (!supabase || !notify.isPatientEmailEnabled()) return;

  const { data: due, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('status', 'confirmed')
    .is('reminder_sent_at', null)
    .in('preferred_date', [istDateString(0), istDateString(1)])
    .limit(25);

  if (error) {
    // Most likely the migration hasn't been applied yet — warn, don't crash.
    console.warn('[reminder-cron] query failed (is reminder_sent_at migrated?):', error.message);
    return;
  }
  if (!due?.length) return;

  const now = Date.now();
  for (const b of due) {
    // Appointment times are IST wall-clock strings ("2026-07-10" + "13:00").
    const at = Date.parse(`${b.preferred_date}T${b.preferred_time || '09:00'}:00+05:30`);
    if (!Number.isFinite(at)) continue;
    const msUntil = at - now;
    if (msUntil <= 0 || msUntil > 24 * 3600000) continue; // only within the next 24h

    let professionalEmail = null;
    if (b.professional_id) {
      const { data: pro } = await supabase
        .from('professional_applications')
        .select('email')
        .eq('id', b.professional_id)
        .maybeSingle();
      professionalEmail = pro?.email ?? null;
    }

    try {
      const sent = await notify.appointmentReminder(b, { professionalEmail });
      if (sent) {
        await supabase.from('appointments')
          .update({ reminder_sent_at: new Date().toISOString() })
          .eq('id', b.id);
        console.log(`[reminder-cron] reminded ${b.id.slice(0, 8)} (${b.preferred_date} ${b.preferred_time})`);
      }
    } catch (e) {
      console.error(`[reminder-cron] ${b.id} failed:`, e.message);
    }
  }
});

/** GET /api/subscribers — admin only — list opt-in emails. */
app.get('/api/subscribers', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;

  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return err(res, 'Failed to fetch subscribers', 500);
  return ok(res, { subscribers: data });
});

// ══════════════════════════════════════════════════════════════
//  CORPORATE EAP
// ══════════════════════════════════════════════════════════════

/** POST /api/corporate/inquiry — public — corporate EAP lead */
app.post('/api/corporate/inquiry', async (req, res) => {
  const { name, email, company, phone, size, message } = req.body;
  if (!name?.trim() || !email?.trim() || !company?.trim()) {
    return err(res, 'name, email, and company are required');
  }
  if (supabase) {
    await supabase.from('corporate_inquiries').insert({
      name: name.trim(), email: email.trim(), company: company.trim(),
      phone: phone?.trim() || null, team_size: size?.trim() || null,
      message: message?.trim() || null, status: 'new',
    });
  }
  notify.corporateInquiry?.({ name, email, company, size });
  return ok(res, { message: 'Received' }, 201);
});

/** GET /api/corporate/inquiries — admin — list corporate leads */
app.get('/api/corporate/inquiries', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;
  const { data, error } = await supabase
    .from('corporate_inquiries')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return err(res, 'Failed to fetch inquiries', 500);
  return ok(res, { inquiries: data });
});

/** PATCH /api/corporate/inquiries/:id — admin — update status */
app.patch('/api/corporate/inquiries/:id', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;
  const allowed = ['status', 'notes'];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
  const { data, error } = await supabase.from('corporate_inquiries').update(updates).eq('id', req.params.id).select().single();
  if (error) return err(res, 'Failed to update', 500);
  return ok(res, { inquiry: data });
});

// ══════════════════════════════════════════════════════════════
//  PARTNER INQUIRIES
// ══════════════════════════════════════════════════════════════

/** POST /api/partner/inquiry — public — partnership application */
app.post('/api/partner/inquiry', async (req, res) => {
  const { name, email, phone, partner_type, handle, audience_size, message } = req.body;
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return err(res, 'name, email, and message are required');
  }
  if (supabase) {
    await supabase.from('partner_inquiries').insert({
      name: name.trim(), email: email.trim(), phone: phone?.trim() || null,
      partner_type: partner_type || 'influencer',
      handle: handle?.trim() || null, audience_size: audience_size?.trim() || null,
      message: message.trim(), status: 'new',
    });
  }
  return ok(res, { message: 'Received' }, 201);
});

/** GET /api/partner/inquiries — admin — list partner applications */
app.get('/api/partner/inquiries', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;
  const { data, error } = await supabase
    .from('partner_inquiries')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return err(res, 'Failed to fetch', 500);
  return ok(res, { inquiries: data });
});

/** PATCH /api/partner/inquiries/:id — admin — approve / update */
app.patch('/api/partner/inquiries/:id', async (req, res) => {
  if (!requireDb(res) || !requireAdmin(req, res)) return;
  const allowed = ['status', 'notes', 'referral_code', 'commission_pct'];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
  const { data, error } = await supabase.from('partner_inquiries').update(updates).eq('id', req.params.id).select().single();
  if (error) return err(res, 'Failed to update', 500);
  return ok(res, { inquiry: data });
});

// ══════════════════════════════════════════════════════════════
//  CONTACT
// ══════════════════════════════════════════════════════════════

/**
 * POST /api/contact
 * Save a contact/enquiry message.
 */
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name?.trim())    return err(res, 'name is required');
  if (!message?.trim()) return err(res, 'message is required');

  if (supabase) {
    const { error } = await supabase
      .from('contact_messages')
      .insert({
        name: name.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        subject: subject?.trim() || null,
        message: message.trim(),
      });

    if (error) {
      console.error('[POST /api/contact]', error);
      // Non-fatal — still return success so the user isn't blocked
    }
  }

  notify.contact({
    name:    name.trim(),
    email:   email?.trim() || null,
    phone:   phone?.trim() || null,
    subject: subject?.trim() || null,
    message: message.trim(),
  });

  return ok(res, { message: 'Message received. We will get back to you soon.' }, 201);
});

// ══════════════════════════════════════════════════════════════
//  AI ASSISTANT (site concierge — OpenAI, server-side key only)
// ══════════════════════════════════════════════════════════════

/** POST /api/assistant/chat — body: { messages: [{ role, content }] } */
app.post('/api/assistant/chat', (req, res, next) => {
  handleAssistantChat(req, res).catch(next);
});

// ══════════════════════════════════════════════════════════════
//  STATIC + SPA FALLBACK (with route-specific SEO injection)
// ══════════════════════════════════════════════════════════════
// Fingerprinted assets (/assets/*) get immutable caching — Vite content-hashes the filenames.
app.use('/assets', express.static(join(dist, 'assets'), {
  index: false,
  maxAge: '1y',
  immutable: true,
}));

// Static for /favicon.svg, /sitemap.xml, /manifest.json, etc. The {index:false} guard
// prevents express.static from serving dist/index.html directly for "/" — we
// want every HTML response (including "/") to go through the SEO injector.
app.use(express.static(dist, { index: false }));

// Routes the SPA actually handles. Anything outside this set should
// return a real 404/410 status code instead of a soft-200 SPA shell.
// Keep this in sync with src/App.jsx.
const VALID_ROUTES = new Set([
  '/',
  '/about',
  '/team',
  '/services',
  '/professionals',
  '/professionals/learning',
  '/professionals/resources',
  '/professionals/guidelines',
  '/professionals/apply',
  '/professionals/terms',
  '/professionals/code-of-conduct',
  '/professionals/login',
  '/professionals/portal',
  '/book',
  '/pricing',
  '/faq',
  '/guides',
  '/blog',
  '/privacy',
  '/terms',
  '/patient/terms',
  '/consent',
  '/refund-policy',
  '/emergency-disclaimer',
  '/cookie-policy',
  '/grievance-policy',
  '/payment-policy',
  '/data-retention',
  '/intellectual-property',
  '/community-guidelines',
  '/legal',
  '/admin',
  '/patient/login',
  '/patient/dashboard',
  '/careers',
  '/corporate',
  '/partner',
  '/screening',
  '/screening/pathway/mood-anxiety',
  '/burnout-check',
  '/evidence',
  '/academy',
  '/academy/login',
  '/academy/learn',
  '/academy/learn/pharmacology',
  '/academy/learn/psychology',
  '/online-psychiatrist-consultation-india',
  '/online-psychiatrist-for-depression-india',
  '/anxiety-counselling-online-india',
  '/adhd-assessment-online-india',
  '/ocd-treatment-online-india',
  '/online-psychiatrist-gujarat',
  '/phq-9-depression-screening',
  '/gad-7-anxiety-screening',
  '/online-psychiatrist-prescription-india',
]);

// Dynamic-route prefixes that the SPA legitimately serves.
const VALID_PREFIXES = ['/blog/', '/consultation/', '/academy/program/', '/screening/tool/', '/evidence/'];

// Known stale URLs surfaced in search from prior site contents. These have no
// healthcare replacement, so return 410 Gone to ask Google to drop them.
// Patterns are anchored and accept optional trailing slashes.
const GONE_PATTERNS = [
  /^\/kotagiri\/?$/i,
  /^\/travelx-tour-guides-section\/?$/i,
  /^\/\d{4}\/\d{2}\/\d{2}\/[^?#]*$/, // old WP-style dated post URLs (with or without trailing slash)
  /^\/category(\/|$)/i,
  /^\/tag(\/|$)/i,
  /^\/wp-/i,
];

function normalize(pathname) {
  if (pathname === '/') return '/';
  return pathname.replace(/\/+$/, '');
}

function isValidSpaRoute(pathname) {
  const norm = normalize(pathname);
  if (VALID_ROUTES.has(norm)) return true;
  return VALID_PREFIXES.some((p) => pathname.startsWith(p) && pathname.length > p.length);
}

// ── SEO injection ─────────────────────────────────────────────
// Read the built dist/index.html once and substitute the sentinel block per
// request so the initial HTML response carries route-correct title, meta
// description, canonical, Open Graph, and JSON-LD. Falls back gracefully if
// the template is missing (e.g. before first build).
const SEO_SENTINEL = /<!--SEO_HEAD_START-->[\s\S]*?<!--SEO_HEAD_END-->/;
let templateCache = null;
function loadTemplate() {
  if (templateCache !== null) return templateCache;
  try {
    templateCache = readFileSync(join(dist, 'index.html'), 'utf8');
  } catch {
    templateCache = '';
  }
  return templateCache;
}
// Disable cache in development so edits to index.html are picked up
// without a server restart.
if (process.env.NODE_ENV !== 'production') {
  templateCache = null;
  // re-read every request in dev
  loadTemplate.__dev = true;
}

function seoRouteKey(pathname) {
  const norm = normalize(pathname);
  // Map non-indexable SPA routes to a generic noindex SEO entry; only routes
  // present in ROUTE_SEO get their own bespoke title/description.
  return ROUTE_SEO[norm] ? norm : null;
}

function buildHtmlForRequest(pathname, { status }) {
  const tpl = loadTemplate.__dev
    ? readFileSync(join(dist, 'index.html'), 'utf8')
    : loadTemplate();
  if (!tpl) return '';

  const routeKey = seoRouteKey(pathname);
  const noindex = status === 404 || status === 410 || shouldNoindex(pathname) || !routeKey;
  // For unknown/410 paths, use the homepage SEO entry as a baseline but mark
  // noindex,nofollow so search engines don't index the 404 UI.
  const renderPath = routeKey || '/';
  const replacement = `<!--SEO_HEAD_START-->\n    ${renderSeoHead(renderPath, { noindex })}\n    <!--SEO_HEAD_END-->`;
  let html = tpl.replace(SEO_SENTINEL, replacement);

  // Admin is a separate installable PWA: on /admin routes we swap the web app
  // manifest, theme colour and title so it installs as its own "Serenest Admin"
  // app that opens straight to the dashboard in full-screen (dark chrome).
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    html = html
      .replace('<link rel="manifest" href="/manifest.json" />', '<link rel="manifest" href="/admin-manifest.json" />')
      .replace('<meta name="apple-mobile-web-app-title" content="Serenest" />', '<meta name="apple-mobile-web-app-title" content="Serenest Admin" />')
      .replace('<meta name="theme-color" content="#3c4a2c" />', '<meta name="theme-color" content="#141c25" />');
  }
  return html;
}

function sendHtml(req, res, status) {
  const html = buildHtmlForRequest(req.path, { status });
  if (!html) {
    // Template missing — fall back to plain file send so the user still
    // sees something rather than an error.
    return res.status(status).sendFile(join(dist, 'index.html'));
  }
  res.status(status);
  res.set('Content-Type', 'text/html; charset=utf-8');
  if (req.method === 'HEAD') return res.end();
  return res.send(html);
}

app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  const pathname = req.path;

  // Keyword-variant aliases → 301 to the canonical landing page.
  const aliasTarget = ROUTE_ALIASES[normalize(pathname)] || ROUTE_ALIASES[pathname];
  if (aliasTarget) {
    res.set('Location', `${SITE_ORIGIN}${aliasTarget}`);
    return res.status(301).end();
  }

  if (GONE_PATTERNS.some((re) => re.test(pathname))) {
    return sendHtml(req, res, 410);
  }
  if (!isValidSpaRoute(pathname)) {
    return sendHtml(req, res, 404);
  }
  return sendHtml(req, res, 200);
});

// ── 404 for unmatched API routes ─────────────────────────────
app.use('/api', (_req, res) => err(res, 'API endpoint not found', 404));

// ── Global error handler ─────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((error, _req, res, _next) => {
  console.error('[Unhandled error]', error);
  err(res, 'Internal server error', 500);
});

// ── Start ────────────────────────────────────────────────────
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`\n🟢 Serenest server running on http://localhost:${port}`);
  console.log(`   DB:    ${supabase ? '✅ Supabase connected' : '⚠️  Not configured (set SUPABASE_URL + SUPABASE_SERVICE_KEY)'}`);
  console.log(`   Video: ${process.env.DAILY_API_KEY ? '✅ Daily.co configured' : '⚠️  Not configured (set DAILY_API_KEY)'}`);
  console.log(`   Admin: ${process.env.ADMIN_SECRET ? '✅ Secret set' : '⚠️  Not configured (set ADMIN_SECRET)'}`);
  console.log(`   Alert: ${notify.isConfigured() ? '✅ Team email (Resend)' : '⚠️  Team email incomplete'} (RESEND_API_KEY + NOTIFY_EMAIL)`);
  console.log(`   Patient email: ${notify.isPatientEmailEnabled() ? '✅ Resend key set' : '⚠️  Add RESEND_API_KEY for confirmations'}`);
  console.log(`   Team WhatsApp: ${notify.hasTeamWhatsApp() ? '✅ CallMeBot configured' : '○ Optional: CALLMEBOT_WHATSAPP_APIKEY + CALLMEBOT_WHATSAPP_PHONE'}\n`);
});
