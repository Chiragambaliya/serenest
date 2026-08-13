-- ============================================================
-- 2026-08-13 — Add social_handle to professional_applications
--
-- POST /api/professionals/apply writes social_handle, but the
-- column was missing from the original schema. That caused
-- "Failed to submit application. Please try again." (500).
-- ============================================================

alter table public.professional_applications
  add column if not exists social_handle text;
