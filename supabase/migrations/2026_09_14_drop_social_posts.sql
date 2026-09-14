-- ============================================================
-- 2026-09-14 — Drop social_posts (social scheduling removed)
--
-- The site no longer schedules or publishes social media posts
-- (Instagram/LinkedIn poster + AI content generator removed from
-- server.js and the admin UI). This table has held zero rows since
-- it was created (20260628_social_posts.sql) and nothing else
-- references it — safe to drop along with its trigger/function.
--
-- Not idempotent by nature of DROP, but IF EXISTS makes it safe to
-- re-run.
-- ============================================================

drop trigger if exists trg_social_posts_updated_at on public.social_posts;
drop function if exists public.set_social_posts_updated_at();
drop table if exists public.social_posts;
