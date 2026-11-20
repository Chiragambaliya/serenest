-- Open appointments.practitioner_type beyond psychiatry.
-- Does not change row-level security, grants, or views.

alter table public.appointments drop constraint if exists appointments_practitioner_type_check;

alter table public.appointments
  add constraint appointments_practitioner_type_check
  check (practitioner_type in (
    'psychiatrist','psychologist','therapist','counsellor',
    'general-physician','cardiologist','dermatologist','endocrinologist',
    'gastroenterologist','neurologist','pulmonologist','nephrologist',
    'rheumatologist','oncologist','paediatrician','gynaecologist',
    'ent','ophthalmologist','orthopaedic','urologist','general-surgeon','dentist'
  ));
