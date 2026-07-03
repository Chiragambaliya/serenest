-- ============================================================
-- 2026-07-03 — Tighten Row Level Security
--
-- Several early policies used `using (true)` for the
-- `authenticated` role, which let ANY logged-in Supabase user
-- (patient, professional, or academy learner) read — and in one
-- case update — every row in tables holding patient health data.
--
-- This migration replaces those with own-row policies:
--   * appointments            → patient sees only their own rows
--                                (matched by verified email/phone)
--   * professional_applications → professional sees/edits only the
--                                row matching their verified email
--   * signups, professionals, screening_responses,
--     contact_messages, session_notes, assessments
--                              → no client read access at all; the
--                                Express server (service role,
--                                bypasses RLS) is the only reader
--
-- Public INSERT policies (booking/contact/screening forms) are
-- unchanged. The admin panel and portals go through server.js with
-- the service role, so they are unaffected.
--
-- Idempotent — safe to re-run.
-- ============================================================

-- ── Helper: last-10-digit phone comparison ────────────────────
-- Indian mobiles are stored as 10 digits; JWT phone claims may
-- carry a country code. Empty values never match.
create or replace function public.phones_match(a text, b text)
returns boolean
language sql
immutable
as $$
  select coalesce(a, '') <> ''
     and coalesce(b, '') <> ''
     and right(regexp_replace(a, '\D', '', 'g'), 10)
       = right(regexp_replace(b, '\D', '', 'g'), 10)
     and length(regexp_replace(a, '\D', '', 'g')) >= 10
     and length(regexp_replace(b, '\D', '', 'g')) >= 10;
$$;

-- ── Appointments: patients read only their own ────────────────
drop policy if exists "auth_select_own_appointments" on public.appointments;
create policy "auth_select_own_appointments"
  on public.appointments for select
  to authenticated
  using (
    -- Matched by the verified email on the JWT…
    (coalesce(patient_email, '') <> ''
      and lower(patient_email) = lower(coalesce(auth.jwt() ->> 'email', '')))
    -- …or the verified phone on the JWT (phone-OTP logins)…
    or public.phones_match(patient_phone, auth.jwt() ->> 'phone')
    -- …or the phone stored on the caller's patients row.
    or exists (
      select 1 from public.patients p
      where p.auth_user_id = (select auth.uid())
        and public.phones_match(p.phone, patient_phone)
    )
  );

-- ── Professional applications: own row only, by verified email ─
drop policy if exists "auth_select_prof_apps" on public.professional_applications;
drop policy if exists "auth_update_prof_apps" on public.professional_applications;
drop policy if exists "auth_select_own_application" on public.professional_applications;
drop policy if exists "auth_update_own_application" on public.professional_applications;

create policy "auth_select_own_application"
  on public.professional_applications for select
  to authenticated
  using (
    coalesce(email, '') <> ''
    and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

create policy "auth_update_own_application"
  on public.professional_applications for update
  to authenticated
  using (
    coalesce(email, '') <> ''
    and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
  with check (
    coalesce(email, '') <> ''
    and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

-- ── Server-only tables: remove blanket authenticated access ───
-- Reads happen exclusively through server.js (service role), which
-- bypasses RLS. Public/anon INSERT policies stay for the forms.
drop policy if exists "auth_select_signups"       on public.signups;
drop policy if exists "auth_select_professionals" on public.professionals;
drop policy if exists "auth_select_screening"     on public.screening_responses;
drop policy if exists "auth_select_contact"       on public.contact_messages;

-- Clinical notes and assessments were readable/writable by any
-- authenticated user; they are managed by the server only.
drop policy if exists "auth_select_notes"          on public.session_notes;
drop policy if exists "auth_insert_notes"          on public.session_notes;
drop policy if exists "auth_update_unlocked_notes" on public.session_notes;
drop policy if exists "auth_select_assessments"    on public.assessments;
