-- ============================================================
-- 2026-08-13 — Harden professional_applications for onboarding
--
-- Ensures current onboarding columns exist and legacy NOT NULL
-- constraints (e.g. designation) do not block /professionals/apply.
-- Idempotent.
-- ============================================================

alter table public.professional_applications
  add column if not exists role           text,
  add column if not exists role_label     text,
  add column if not exists social_handle  text,
  add column if not exists registration   text,
  add column if not exists degree         text,
  add column if not exists year           text,
  add column if not exists council        text,
  add column if not exists clinic         text,
  add column if not exists city           text,
  add column if not exists languages      text,
  add column if not exists specialities   text,
  add column if not exists fee_inr        text,
  add column if not exists duration_min   integer,
  add column if not exists modes          text,
  add column if not exists availability   text,
  add column if not exists status         text;

-- Soften legacy required columns that the new form no longer collects.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'professional_applications'
      and column_name = 'email'
  ) then
    begin
      alter table public.professional_applications alter column email drop not null;
    exception when others then null;
    end;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'professional_applications'
      and column_name = 'designation'
  ) then
    begin
      alter table public.professional_applications alter column designation drop not null;
    exception when others then null;
    end;
  end if;
end $$;

-- Keep status values consistent when present.
update public.professional_applications
set status = coalesce(nullif(trim(status), ''), 'pending')
where status is null or trim(status) = '';
