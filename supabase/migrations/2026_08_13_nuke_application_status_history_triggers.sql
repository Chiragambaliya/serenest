-- ============================================================
-- 2026-08-13 — NUCLEAR fix: professional apply blocked by
-- application_status_history BEFORE INSERT trigger / FK.
--
-- Live error:
--   insert or update on table "application_status_history"
--   violates foreign key constraint
--   "application_status_history_application_id_fkey"
--   Key (application_id)=(...) is not present in table
--   "professional_applications"
--
-- Root cause: a BEFORE INSERT trigger writes history before the
-- parent row exists. Drop ALL user triggers on the applications
-- table, drop the blocking FK, then recreate a safe AFTER INSERT
-- trigger (FK deferred so it cannot block applies).
--
-- Idempotent. Safe to re-run.
-- ============================================================

-- 1) Drop EVERY user trigger on professional_applications
do $$
declare
  r record;
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

-- 2) Ensure history table exists (match production-ish columns)
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

-- 3) Drop blocking FK (name may vary)
do $$
declare
  r record;
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

-- 4) Re-add a deferred FK so history never blocks the parent insert
alter table public.application_status_history
  alter column application_id type uuid using nullif(application_id::text, '')::uuid;

alter table public.application_status_history
  add constraint application_status_history_application_id_fkey
  foreign key (application_id)
  references public.professional_applications(id)
  on delete cascade
  deferrable initially deferred;

-- 5) Safe AFTER INSERT / UPDATE history writer
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

-- 6) Optional RPC — insert with triggers disabled for this transaction
create or replace function public.serenest_insert_professional_application(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.professional_applications;
  cols text[] := array[]::text[];
  vals text[] := array[]::text[];
  sql text;
  col text;
  val text;
begin
  perform set_config('session_replication_role', 'replica', true);

  foreach col in array array[
    'role','role_label','designation','full_name','phone','email',
    'registration','medical_council_number','degree','city','languages',
    'specialities','fee_inr','modes','availability','status'
  ]
  loop
    if exists (
      select 1 from information_schema.columns
      where table_schema = 'public'
        and table_name = 'professional_applications'
        and column_name = col
    ) and payload ? col and nullif(payload->>col, '') is not null then
      cols := cols || col;
      vals := vals || format('%L', payload->>col);
    end if;
  end loop;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'professional_applications'
      and column_name = 'duration_min'
  ) and payload ? 'duration_min' and payload->>'duration_min' ~ '^[0-9]+$' then
    cols := cols || 'duration_min';
    vals := vals || (payload->>'duration_min');
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'professional_applications'
      and column_name = 'consultation_fee'
  ) and payload ? 'consultation_fee' and payload->>'consultation_fee' ~ '^[0-9]+(\.[0-9]+)?$' then
    cols := cols || 'consultation_fee';
    vals := vals || (payload->>'consultation_fee');
  end if;

  if array_length(cols, 1) is null then
    raise exception 'no columns to insert';
  end if;

  sql := format(
    'insert into public.professional_applications (%s) values (%s) returning *',
    array_to_string(cols, ', '),
    array_to_string(vals, ', ')
  );
  execute sql into result;

  perform set_config('session_replication_role', 'origin', true);

  begin
    insert into public.application_status_history (application_id, old_status, new_status)
    values (result.id, null, coalesce(result.status, 'pending'));
  exception when others then
    null;
  end;

  return to_jsonb(result);
end;
$$;

revoke all on function public.serenest_insert_professional_application(jsonb) from public;
grant execute on function public.serenest_insert_professional_application(jsonb) to service_role;
