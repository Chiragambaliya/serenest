-- ── Prescriptions (issued by the assigned professional after a consultation) ──
-- One prescription per appointment. Created/updated by admin (acting on behalf
-- of the professional) via the protected API; viewable publicly by reference
-- so a patient can open it from their consultation room link.

create table if not exists public.prescriptions (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  appointment_id  uuid not null references public.appointments(id) on delete cascade,
  professional_id uuid references public.professional_applications(id) on delete set null,
  professional_name text,
  patient_name    text,
  medicines       jsonb not null default '[]', -- [{ name, dosage, frequency, duration, instructions }]
  advice          text,
  follow_up_date  date,
  is_locked       boolean not null default false,
  locked_at       timestamptz
);

create unique index if not exists prescriptions_appointment_id_key
  on public.prescriptions (appointment_id);

-- RLS enabled with no policies = deny-all for anon/authenticated clients.
-- The service role (used by the Express API) bypasses RLS, matching the
-- pattern used by every other table in this schema.
alter table public.prescriptions enable row level security;
