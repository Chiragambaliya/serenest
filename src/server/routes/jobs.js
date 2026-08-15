/**
 * Hiring — public job postings, the admin hiring pipeline (interviews,
 * offers, rejections), and job applications (HR).
 */
import { ok, err, requireDb, requireAdmin } from '../http.js';
import { supabase } from '../db.js';
import { notify } from '../notify.js';
import { saveContactLead, listContactLeads, patchJobApplicationRecord } from '../leads.js';

export function registerJobRoutes(app) {
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

  // ── Hiring pipeline — interviews ─────────────────────────────

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

    const { application, error } = await patchJobApplicationRecord(req.params.applicationId, {
      offer_salary,
      offer_date: offer_date || new Date().toISOString().split('T')[0],
      offer_deadline: offer_deadline || null,
      joining_date: joining_date || null,
      status: 'hired',
    });

    if (error || !application) return err(res, 'Failed to extend offer', 500);
    return ok(res, { application });
  });

  /** PATCH /api/hiring/offer/:applicationId/response — accept or decline (admin) */
  app.patch('/api/hiring/offer/:applicationId/response', async (req, res) => {
    if (!requireDb(res) || !requireAdmin(req, res)) return;
    const { accepted } = req.body;
    if (accepted === undefined) return err(res, 'accepted (boolean) is required');

    const { application, error } = await patchJobApplicationRecord(req.params.applicationId, {
      offer_accepted: accepted,
      status: accepted ? 'hired' : 'rejected',
    });

    if (error || !application) return err(res, 'Failed to record offer response', 500);
    return ok(res, { application });
  });

  /** POST /api/hiring/reject/:applicationId — reject with reason (admin only) */
  app.post('/api/hiring/reject/:applicationId', async (req, res) => {
    if (!requireDb(res) || !requireAdmin(req, res)) return;
    const { rejection_reason } = req.body;

    const { application, error } = await patchJobApplicationRecord(req.params.applicationId, {
      status: 'rejected',
      rejection_reason: rejection_reason?.trim() || null,
    });

    if (error || !application) return err(res, 'Failed to reject application', 500);
    return ok(res, { application });
  });

  // ── Job applications (HR) ────────────────────────────────────

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
      const fallbackRow = {
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
      };
      const contact = await saveContactLead('job_application', fallbackRow, error.message);
      if (contact) {
        const application = {
          id: contact.id,
          created_at: contact.created_at,
          ...fallbackRow,
          _fallback: true,
          _contact: true,
        };
        notify.jobApplication({
          candidate_name:  application.full_name,
          candidate_phone: application.phone,
          candidate_email: application.email,
          position:        `${application.role} (${application.department})`,
        });
        return ok(res, { application, fallback: true }, 201);
      }
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
    const dbApps = error ? [] : (data || []);
    if (error) console.warn('[GET /api/jobs/applications]', error.message);

    const extras = await listContactLeads('job_application');
    const seen = new Set(dbApps.map((a) => String(a.id)));
    const merged = [
      ...extras.filter((a) => {
        if (department && a.department !== department) return false;
        if (status && a.status !== status) return false;
        if (seen.has(String(a.id))) return false;
        seen.add(String(a.id));
        return true;
      }),
      ...dbApps,
    ];
    return ok(res, { applications: merged });
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

    if (!Object.keys(updates).length) return err(res, 'No updatable fields');

    const { application, error } = await patchJobApplicationRecord(req.params.id, updates);
    if (error || !application) return err(res, 'Failed to update application', 500);
    return ok(res, { application });
  });
}
