-- ============================================================
-- 2026-08-13 — Record professional policy consent on apply
-- Idempotent.
-- ============================================================

alter table public.professional_applications
  add column if not exists policies_accepted_at timestamptz;
