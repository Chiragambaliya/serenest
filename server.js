import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from '@supabase/supabase-js';
import { notify } from './src/server/notify.js';
import { renderSeoHead, shouldNoindex, ROUTE_SEO, ROUTE_ALIASES, SITE_ORIGIN } from './src/lib/seo.js';

// ── Setup ────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const app  = express();
const dist = join(__dirname, 'dist');

// ── Supabase admin client (service role — server only) ───────
const supabase = (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY)
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
  : null;

// ── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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

// ── Health ───────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  ok(res, {
    status: 'ok',
    db: supabase ? 'connected' : 'not configured',
    daily: process.env.DAILY_API_KEY ? 'configured' : 'not configured',
    notifications: notify.isConfigured() ? 'enabled' : 'disabled',
    patient_email: notify.isPatientEmailEnabled() ? 'enabled' : 'disabled',
    team_whatsapp: notify.hasTeamWhatsApp() ? 'enabled' : 'disabled',
    ts: new Date().toISOString(),
  });
});

// ══════════════════════════════════════════════════════════════
//  BOOKINGS
// ══════════════════════════════════════════════════════════════

/**
 * POST /api/bookings
 * Create a new appointment booking request.
 */
app.post('/api/bookings', async (req, res) => {
  if (!requireDb(res)) return;

  const {
    patient_name, patient_phone, patient_email,
    practitioner_type, mode, preferred_date, preferred_time,
    language = 'English', notes = '',
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
      status: 'pending',
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
  if (!requireDb(res)) return;
  if (req.headers['x-admin-secret'] !== process.env.ADMIN_SECRET) {
    return err(res, 'Unauthorized', 401);
  }

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return err(res, 'Failed to fetch bookings', 500);
  return ok(res, { bookings: data });
});

/**
 * PATCH /api/bookings/:id/status
 * Update booking status (admin: confirm / cancel / complete).
 */
app.patch('/api/bookings/:id/status', async (req, res) => {
  if (!requireDb(res)) return;
  if (req.headers['x-admin-secret'] !== process.env.ADMIN_SECRET) {
    return err(res, 'Unauthorized', 401);
  }

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
    role, full_name, phone, email, registration,
    degree, year, council, clinic, city,
    languages, specialities, fee_inr, duration_min,
    modes, availability,
  } = req.body;

  if (!role?.trim())      return err(res, 'role is required');
  if (!full_name?.trim()) return err(res, 'full_name is required');
  if (!phone?.trim())     return err(res, 'phone is required');

  const { data, error } = await supabase
    .from('professional_applications')
    .insert({
      role, role_label: role,
      full_name: full_name.trim(),
      phone: phone.trim(),
      email: email?.trim() || null,
      registration, degree, year, council,
      clinic, city, languages, specialities,
      fee_inr,
      duration_min: duration_min ? Number(duration_min) : null,
      modes, availability,
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
  if (!requireDb(res)) return;
  if (req.headers['x-admin-secret'] !== process.env.ADMIN_SECRET) {
    return err(res, 'Unauthorized', 401);
  }

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
  if (!requireDb(res)) return;
  if (req.headers['x-admin-secret'] !== process.env.ADMIN_SECRET) {
    return err(res, 'Unauthorized', 401);
  }

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
//  ADMIN — aggregated helpers
// ══════════════════════════════════════════════════════════════

function requireAdmin(req, res) {
  if (req.headers['x-admin-secret'] !== process.env.ADMIN_SECRET) {
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
//  VISITOR TRACKING (lightweight — Telegram alert on first visit/day)
// ══════════════════════════════════════════════════════════════

// Daily-rotating set of visitor fingerprints. Resets at midnight UTC.
let visitorDay   = new Date().toISOString().slice(0, 10);
let seenVisitors = new Set();

function rolloverIfNeeded() {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== visitorDay) {
    visitorDay   = today;
    seenVisitors = new Set();
  }
}

/** POST /api/track/visit — quietly records a visit. */
app.post('/api/track/visit', (req, res) => {
  rolloverIfNeeded();

  const { vid, path = '/', referrer = '' } = req.body || {};
  const ip = (req.headers['x-forwarded-for']?.split(',')[0] || req.ip || '').trim();
  const ua = req.headers['user-agent'] || '';

  // Fingerprint = browser-supplied vid (cookie-less) + IP + UA hash
  const fp = `${vid || 'anon'}|${ip}`;
  if (seenVisitors.has(fp)) return ok(res, { unique: false });

  seenVisitors.add(fp);
  notify.firstVisitToday({
    count: seenVisitors.size,
    path, referrer,
    userAgent: ua,
  });

  return ok(res, { unique: true, total_today: seenVisitors.size });
});

/** GET /api/track/today — admin only — quick traffic count. */
app.get('/api/track/today', (req, res) => {
  if (req.headers['x-admin-secret'] !== process.env.ADMIN_SECRET) {
    return err(res, 'Unauthorized', 401);
  }
  rolloverIfNeeded();
  return ok(res, { date: visitorDay, unique_visitors: seenVisitors.size });
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
//  STATIC + SPA FALLBACK (with route-specific SEO injection)
// ══════════════════════════════════════════════════════════════
// Static for /assets, /favicon.svg, /sitemap.xml, etc. The {index:false} guard
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
  '/book',
  '/pricing',
  '/faq',
  '/blog',
  '/privacy',
  '/admin',
  '/patient/find-professional',
  '/screening',
  '/online-psychiatrist-consultation-india',
  '/online-psychiatrist-for-depression-india',
  '/anxiety-counselling-online-india',
  '/adhd-assessment-online-india',
  '/online-psychiatrist-gujarat',
  '/phq-9-depression-screening',
  '/gad-7-anxiety-screening',
  '/online-psychiatrist-prescription-india',
]);

// Dynamic-route prefixes that the SPA legitimately serves.
const VALID_PREFIXES = ['/blog/', '/consultation/'];

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
  return tpl.replace(SEO_SENTINEL, replacement);
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
