/**
 * Professional self-service portal.
 * A professional logs in with the email she applied with (Supabase email
 * OTP). Every endpoint resolves her own approved row from the verified token
 * email — she can never read or write another professional's record, because
 * the row id is never taken from the client.
 */
import { ok, err, requireDb, bearer } from '../http.js';
import { supabase } from '../db.js';

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

export function registerProfessionalPortalRoutes(app) {
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
}
