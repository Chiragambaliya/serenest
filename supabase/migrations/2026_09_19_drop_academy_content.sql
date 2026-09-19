-- ============================================================
-- 2026-09-19 — Drop academy_content (Serenest Academy removed)
--
-- Serenest Academy (public /academy pages, admin Academy tab, and
-- the /api/academy/* endpoints) has been removed from the site, so
-- nothing reads or writes this table any more. Drop it along with
-- its RLS policy and updated_at trigger (the shared set_updated_at()
-- function is left in place in case other tables reuse it).
--
-- Not idempotent by nature of DROP, but IF EXISTS makes it safe to
-- re-run.
-- ============================================================

drop trigger if exists trg_academy_content_updated_at on public.academy_content;
drop policy if exists "public_read_active" on public.academy_content;
drop table if exists public.academy_content;
