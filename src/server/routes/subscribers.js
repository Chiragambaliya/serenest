/**
 * Opt-in email capture — public subscribe endpoint and admin listing.
 */
import { ok, err, requireDb, requireAdmin } from '../http.js';
import { supabase } from '../db.js';
import { notify } from '../notify.js';

export function registerSubscriberRoutes(app) {
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
}
