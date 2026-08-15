/**
 * Serenest Academy — learners listing and content management (with AI
 * generation via Anthropic).
 */
import { ok, err, requireDb, requireAdmin } from '../http.js';
import { supabase } from '../db.js';
import { generateAcademyContent } from '../academyContentGen.js';

export function registerAcademyRoutes(app) {
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
}
