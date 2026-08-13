-- ============================================================
-- 2026-08-13 — Create job_applications (Careers / HR hiring)
--
-- /careers posts to POST /api/jobs/apply, which inserts into
-- public.job_applications. That table was used by server.js but
-- missing from schema/migrations, so Careers submissions could
-- fail or never appear under Admin → HR / Hiring.
-- Idempotent.
-- ============================================================

create table if not exists public.job_applications (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  status         text not null default 'new'
                   check (status in ('new','reviewing','shortlisted','interviewing','hired','rejected')),
  full_name      text not null,
  email          text not null,
  phone          text,
  city           text,
  linkedin_url   text,
  portfolio_url  text,
  cover_note     text,
  department     text not null,
  role           text not null,
  resume_url     text,
  hr_notes       text,
  rejection_reason text
);

create index if not exists job_applications_created_at_idx
  on public.job_applications (created_at desc);

create index if not exists job_applications_status_idx
  on public.job_applications (status);

alter table public.job_applications enable row level security;

-- Public insert for careers form (anon). Reads/updates stay service-role only.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'job_applications'
      and policyname = 'job_applications_public_insert'
  ) then
    create policy job_applications_public_insert
      on public.job_applications for insert
      to anon, authenticated
      with check (true);
  end if;
end $$;
