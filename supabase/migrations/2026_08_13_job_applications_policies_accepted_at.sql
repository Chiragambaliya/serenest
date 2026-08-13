-- ============================================================
-- 2026-08-13 — Record HR/job application policy consent
-- Idempotent.
-- ============================================================

alter table public.job_applications
  add column if not exists policies_accepted_at timestamptz;
