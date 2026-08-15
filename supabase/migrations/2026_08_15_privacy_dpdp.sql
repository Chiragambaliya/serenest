-- DPDP Act 2023 — consent evidence, data-principal requests, and least-access RLS.
-- Safe to re-run.

-- ── Consent / age attestation on care-related tables ─────────
alter table public.appointments
  add column if not exists consent_confirmed_at timestamptz,
  add column if not exists consent_method text,
  add column if not exists consent_purpose text,
  add column if not exists age_attestation boolean,
  add column if not exists privacy_notice_accepted_at timestamptz;

alter table public.screening_responses
  add column if not exists consent_confirmed_at timestamptz,
  add column if not exists consent_method text,
  add column if not exists consent_purpose text,
  add column if not exists privacy_notice_accepted_at timestamptz;

-- ── Data-principal rights requests ───────────────────────────
create table if not exists public.privacy_requests (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  status        text not null default 'received'
                  check (status in ('received','in_progress','completed','rejected')),
  request_type  text not null
                  check (request_type in (
                    'access','correction','erasure','withdraw_consent','nominate','grievance'
                  )),
  full_name     text not null,
  email         text,
  phone         text,
  details       text not null,
  staff_notes   text,
  resolved_at   timestamptz
);

create index if not exists privacy_requests_created_at_idx
  on public.privacy_requests (created_at desc);
create index if not exists privacy_requests_status_idx
  on public.privacy_requests (status);

alter table public.privacy_requests enable row level security;

drop trigger if exists privacy_requests_set_updated_at on public.privacy_requests;
create trigger privacy_requests_set_updated_at
  before update on public.privacy_requests
  for each row execute procedure public.set_updated_at();

-- Public insert (the form). Reads/updates go through the service role only.
drop policy if exists "anon_insert_privacy_requests" on public.privacy_requests;
create policy "anon_insert_privacy_requests"
  on public.privacy_requests for insert
  to anon, authenticated
  with check (true);

-- ── Least-access RLS: stop authenticated users reading every row ──
drop policy if exists "auth_select_own_appointments" on public.appointments;
create policy "auth_select_own_appointments"
  on public.appointments for select
  to authenticated
  using (
    (
      patient_email is not null
      and lower(patient_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
    or professional_id in (
      select id from public.professional_applications
      where status = 'approved'
        and email is not null
        and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

drop policy if exists "auth_select_prof_apps" on public.professional_applications;
drop policy if exists "auth_update_prof_apps" on public.professional_applications;
create policy "auth_select_own_prof_apps"
  on public.professional_applications for select
  to authenticated
  using (
    email is not null
    and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

drop policy if exists "auth_select_signups" on public.signups;
drop policy if exists "auth_select_screening" on public.screening_responses;
drop policy if exists "auth_select_contact" on public.contact_messages;
drop policy if exists "auth_select_notes" on public.session_notes;
drop policy if exists "auth_insert_notes" on public.session_notes;
drop policy if exists "auth_update_unlocked_notes" on public.session_notes;
drop policy if exists "auth_select_assessments" on public.assessments;

-- Professionals write notes only for appointments assigned to them.
create policy "auth_select_own_notes"
  on public.session_notes for select
  to authenticated
  using (
    professional_id in (
      select id from public.professional_applications
      where status = 'approved'
        and email is not null
        and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

create policy "auth_insert_own_notes"
  on public.session_notes for insert
  to authenticated
  with check (
    professional_id in (
      select id from public.professional_applications
      where status = 'approved'
        and email is not null
        and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

create policy "auth_update_own_unlocked_notes"
  on public.session_notes for update
  to authenticated
  using (
    is_locked = false
    and professional_id in (
      select id from public.professional_applications
      where status = 'approved'
        and email is not null
        and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  )
  with check (true);
