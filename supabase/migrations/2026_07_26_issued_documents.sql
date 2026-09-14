-- Admin-issuable formal documents: Academy certificates, joining letters,
-- and experience letters. Print-to-PDF via browser (same pattern as prescriptions).

create table if not exists public.issued_documents (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  doc_type        text not null
                    check (doc_type in ('certificate', 'joining_letter', 'experience_letter')),
  status          text not null default 'draft'
                    check (status in ('draft', 'issued', 'revoked')),

  professional_id uuid references public.professional_applications(id) on delete set null,
  recipient_name  text not null,
  recipient_email text,
  recipient_phone text,

  -- Certificate
  program_slug    text,
  program_title   text,
  completion_date date,

  -- Joining / experience
  role_title      text,
  department      text,
  join_date       date,
  end_date        date,
  employment_type text,

  -- Shared letterhead
  ref_code        text unique,
  issuer_name     text not null default 'Serenest Education Pvt Ltd',
  signatory_name  text not null default 'Dr. Chirag Aambalia',
  signatory_title text not null default 'Psychiatrist & Founder',
  body_extra      text,
  meta            jsonb not null default '{}'::jsonb,

  is_locked       boolean not null default false,
  locked_at       timestamptz,
  issued_at       timestamptz,
  issued_by       text
);

create index if not exists issued_documents_type_status_idx
  on public.issued_documents (doc_type, status);

create index if not exists issued_documents_professional_idx
  on public.issued_documents (professional_id);

create index if not exists issued_documents_created_idx
  on public.issued_documents (created_at desc);

comment on table public.issued_documents is
  'Formal documents issued by admin: Academy certificates, joining letters, experience letters.';
