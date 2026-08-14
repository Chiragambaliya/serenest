-- ============================================================
-- 2026-08-14 — Exactly-once guard for the candidate decision email
--
-- Accepting a candidate sets status='hired' and emails them. Without a
-- persisted marker, a double-click, a retry, or a second admin hitting
-- Accept would mail the candidate twice.
--
-- transitionJobApplication() in server.js stamps this column in the same
-- update that sets the status, so a concurrent caller observes the claim
-- and skips the send. If the send then fails the marker is cleared, so a
-- later retry can still reach the candidate rather than silently recording
-- them as emailed.
--
-- Idempotent.
-- ============================================================

alter table public.job_applications
  add column if not exists decision_email_sent_at timestamptz;

comment on column public.job_applications.decision_email_sent_at is
  'Set when the acceptance email was sent. Guards against duplicate sends on repeated accepts.';
