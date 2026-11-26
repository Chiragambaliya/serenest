-- Allow teleconsultation bookings for every clinical branch.
-- Safe to re-run: drops any existing check that mentions practitioner_type,
-- then installs the catalog constraint used by src/lib/specialties.js.

do $$
declare
  cname text;
begin
  for cname in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname = 'appointments'
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) ilike '%practitioner_type%'
  loop
    execute format('alter table public.appointments drop constraint %I', cname);
  end loop;
end $$;

alter table public.appointments
  add constraint appointments_practitioner_type_check
  check (practitioner_type in (
    'psychiatrist','psychologist','therapist','counsellor',
    'general-physician','cardiologist','dermatologist','endocrinologist',
    'gastroenterologist','neurologist','pulmonologist','nephrologist',
    'rheumatologist','oncologist','paediatrician','gynaecologist',
    'ent','ophthalmologist','orthopaedic','urologist','general-surgeon','dentist'
  ));
