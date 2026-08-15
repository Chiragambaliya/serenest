/**
 * Social media scheduling — post CRUD, immediate publish, and AI generation.
 */
import { ok, err, requireDb, requireAdmin } from '../http.js';
import { supabase } from '../db.js';
import { publishPost, credentialStatus } from '../socialPoster.js';
import { generateWeekOfPosts } from '../socialContentGen.js';

export function registerSocialRoutes(app) {
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
}
