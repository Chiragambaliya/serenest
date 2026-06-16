-- ── Email subscribers (opt-in newsletter / "get updates" capture) ──
create table if not exists public.subscribers (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  email       text not null,
  source      text,           -- where they subscribed from (e.g. footer, /pricing)
  unique (email)
);

alter table public.subscribers enable row level security;

-- ── Site visits (anonymous web analytics — no raw IP, no identity) ──
-- visitor_id is a cookieless random id generated in the browser. We store
-- page, referrer, device class, and (when the platform provides it) an
-- approximate country header. No personal data, no IP address.
create table if not exists public.site_visits (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  visitor_id  text,
  path        text,
  referrer    text,
  device      text,   -- mobile | tablet | desktop
  country     text
);

create index if not exists site_visits_created_at_idx
  on public.site_visits (created_at desc);
create index if not exists site_visits_path_idx
  on public.site_visits (path);

alter table public.site_visits enable row level security;
