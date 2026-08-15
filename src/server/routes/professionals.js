/**
 * Professionals management — public directory / verification and admin
 * profile updates.
 */
import { ok, err, requireDb, requireAdmin, bearer } from '../http.js';
import { supabase } from '../db.js';

export function registerProfessionalRoutes(app) {
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
   * Requires a matching signed-in session (or admin) so the endpoint cannot be
   * used to enumerate clinicians by email.
   */
  app.get('/api/professionals/verify', async (req, res) => {
    if (!requireDb(res)) return;

    const email = String(req.query.email ?? '').trim().toLowerCase();
    if (!email) return err(res, 'email is required');

    const isAdmin = process.env.ADMIN_SECRET
      && req.headers['x-admin-secret'] === process.env.ADMIN_SECRET;
    if (!isAdmin) {
      const token = bearer(req);
      if (!token) return err(res, 'Unauthorized', 401);
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (authError || !user?.email) return err(res, 'Unauthorized', 401);
      if (String(user.email).trim().toLowerCase() !== email) {
        return err(res, 'Forbidden', 403);
      }
    }

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
}
