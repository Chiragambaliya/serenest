/**
 * Admin dashboard aggregates — stats, contact messages, and waitlist signups.
 */
import { ok, err, requireDb, requireAdmin } from '../http.js';
import { supabase } from '../db.js';
import { readFallbackLeads, listContactLeads, isInternalLeadSubject } from '../leads.js';

export function registerAdminRoutes(app) {
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

    const fileFallbackApps = readFallbackLeads('professional_application');
    let inboxPending = 0;
    if (supabase) {
      const { count, error: inboxCountError } = await supabase
        .from('application_inbox')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      if (!inboxCountError) inboxPending = count ?? 0;
      const contactApps = await listContactLeads('professional_application');
      inboxPending += contactApps.length;
    }
    const fallbackPending = fileFallbackApps.filter((a) => (a.status || 'pending') === 'pending').length + inboxPending;

    return ok(res, {
      stats: {
        bookings,
        applications: applications + fallbackPending,
        messages,
        signups,
        jobs,
        pending_bookings: pendingBookings.count ?? 0,
        pending_applications: (pendingApps.count ?? 0) + fallbackPending,
        fallback_applications: fallbackPending,
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
    return ok(res, {
      messages: (data || []).filter((m) => !isInternalLeadSubject(m.subject)),
    });
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
}
