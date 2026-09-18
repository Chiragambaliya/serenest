-- ============================================================
-- 2026-09-18 — Drop academy_content (Serenest Academy removed)
--
-- The Academy section (public pages, /academy routes, the admin
-- "Academy" tab, and the /api/academy/* endpoints) has been removed
-- from the site, so nothing reads or writes this table any more
-- (created in 20260628_academy_content.sql).
--
-- set_updated_at() is deliberately NOT dropped: it was declared here
-- but is a shared helper, so other tables may still attach it.
--
-- Not idempotent by nature of DROP, but IF EXISTS makes it safe to
-- re-run.
-- ============================================================

drop trigger if exists trg_academy_content_updated_at on public.academy_content;
drop policy  if exists "public_read_active" on public.academy_content;
drop table   if exists public.academy_content;
