-- Paste this entire file into Supabase → SQL Editor → Run
-- Project: asjyanjhqfpxqfvyirqj
-- Fixes: professional apply FK/trigger so applications are stored (not just fallback).

do $$
declare r record;
begin
  for r in
    select t.tgname
    from pg_trigger t
    join pg_class c on c.oid = t.tgrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = 'professional_applications'
      and not t.tgisinternal
  loop
    execute format('drop trigger if exists %I on public.professional_applications', r.tgname);
  end loop;
end $$;

create table if not exists public.application_status_history (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  application_id uuid,
  old_status     text,
  new_status     text
);

alter table public.application_status_history
  add column if not exists old_status text,
  add column if not exists new_status text,
  add column if not exists note text;

do $$
declare r record;
begin
  for r in
    select c.conname
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    where n.nspname = 'public'
      and t.relname = 'application_status_history'
      and c.contype = 'f'
  loop
    execute format(
      'alter table public.application_status_history drop constraint if exists %I',
      r.conname
    );
  end loop;
end $$;

alter table public.application_status_history
  add constraint application_status_history_application_id_fkey
  foreign key (application_id)
  references public.professional_applications(id)
  on delete cascade
  deferrable initially deferred;

create or replace function public.log_professional_application_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if TG_OP = 'INSERT' then
    insert into public.application_status_history (application_id, old_status, new_status, note)
    values (NEW.id, null, coalesce(NEW.status, 'pending'), 'application created');
    return NEW;
  end if;
  if TG_OP = 'UPDATE' and NEW.status is distinct from OLD.status then
    insert into public.application_status_history (application_id, old_status, new_status, note)
    values (NEW.id, OLD.status, NEW.status, 'status changed');
  end if;
  return NEW;
end;
$$;

drop trigger if exists trg_professional_application_status_history
  on public.professional_applications;

create trigger trg_professional_application_status_history
  after insert or update of status
  on public.professional_applications
  for each row
  execute function public.log_professional_application_status();

alter table public.professional_applications
  add column if not exists policies_accepted_at timestamptz;

alter table public.job_applications
  add column if not exists policies_accepted_at timestamptz;

-- Smoke test (safe rollback)
do $$
declare
  test_id uuid;
begin
  insert into public.professional_applications (role, full_name, phone, status)
  values ('psychiatrist', 'SQL Smoke Test', '9000000000', 'pending')
  returning id into test_id;
  delete from public.professional_applications where id = test_id;
  raise notice 'Apply fix OK — test insert succeeded and was cleaned up';
end $$;
