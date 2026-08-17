-- ============================================================
-- 2026-08-14 — Policy consent columns for both application tables
--
-- /professionals/apply and /careers both gate submission on a policy
-- acknowledgement, but there was nowhere to record which policy version
-- was accepted or when. Without these columns the server had to drop the
-- consent fields to get the row in — a silent omission on exactly the
-- record that must not be silently omitted.
--
-- Timestamps are written from the server clock by the API, never from the
-- client, so consent cannot be back- or post-dated by the submitter.
--
-- Idempotent.
-- ============================================================

alter table public.professional_applications
  add column if not exists policies_accepted_at timestamptz,
  add column if not exists policy_version       text;

alter table public.job_applications
  add column if not exists policies_accepted_at timestamptz,
  add column if not exists policy_version       text;

comment on column public.professional_applications.policies_accepted_at is
  'Server-side timestamp when the applicant ticked the policy acknowledgement.';
comment on column public.professional_applications.policy_version is
  'Version of the consent statement / policies accepted (see POLICY_VERSION in server.js).';
comment on column public.job_applications.policies_accepted_at is
  'Server-side timestamp when the candidate ticked the policy acknowledgement.';
comment on column public.job_applications.policy_version is
  'Version of the consent statement / policies accepted (see POLICY_VERSION in server.js).';
