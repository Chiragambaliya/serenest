/**
 * Corporate EAP and partner inquiries — public lead capture plus admin
 * review endpoints.
 */
import { ok, err, requireDb, requireAdmin } from '../http.js';
import { supabase } from '../db.js';
import { notify } from '../notify.js';

export function registerInquiryRoutes(app) {
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
}
