# AGENTS.md

## Cursor Cloud specific instructions

### What this app is
Serenest is a single React (Vite) SPA frontend plus an Express API backend, deployed
as one Node web service. Persistence + auth use Supabase.

- Frontend: Vite dev server (port `5173`). Entry `index.html` → `src/main.jsx`.
- Backend: Express in `server.js` (port `3000`), exposes `/api/*` and (in prod) serves the built `dist/`.
- In dev, Vite proxies `/api` → `http://localhost:3000` (see `vite.config.mjs`), so run BOTH servers.

### Running locally (dev)
- Backend API: `node server.js` (reads `.env` via dotenv).
- Frontend: `npm run dev` (Vite on 5173). Open `http://localhost:5173`.
- Production-style run: `npm run build` then `node server.js` (a.k.a. `npm start`) serves `dist/` + API + per-route SEO on port 3000.
- SEO assertion suite: `npm run verify:seo` (i.e. `node scripts/verify-seo.mjs http://localhost:3000`). It needs the built server running on 3000 (requires a prior `npm run build`).
- There is no lint config and no automated test suite in this repo; `verify:seo` is the only programmatic check.

### Backend requires Supabase (non-obvious)
Every React form submits through the Express API (`src/lib/api.js` → `/api/*`), which uses
the Supabase service role. With no Supabase env vars the server still boots, but every DB
write returns HTTP 503 (`requireDb`) and forms (booking, screening, professional apply) cannot
complete. To exercise core flows you MUST provide:
`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` in `.env`
(see `.env.example`). `VITE_*` are read at dev/build time by Vite; the others by the server.

### Bringing up a self-contained local Supabase (no external secrets)
The cloud VM has no Docker/Supabase CLI preinstalled (the update script only runs `npm install`).
To get a working backend for testing, install them once per VM and start a local stack:
1. Install Docker (Docker-in-Docker). Docker 29 needs fuse-overlayfs with the containerd
   snapshotter disabled — set `/etc/docker/daemon.json` to
   `{"storage-driver":"fuse-overlayfs","features":{"containerd-snapshotter":false}}`,
   use iptables-legacy, then `sudo dockerd &`.
2. Install the Supabase CLI. IMPORTANT: the CLI is a shim that needs its co-located
   `supabase-go` binary — extract the release tarball into ONE directory on PATH (don't move
   only the `supabase` binary), or `npm i -g supabase`.
3. `supabase init` (creates `supabase/config.toml`; not committed) then
   `supabase start` (heavy services can be skipped: `-x studio,imgproxy,edge-runtime,realtime,logflare,vector,pooler,storage`).
4. Get legacy JWT keys with `supabase status -o env` → use `ANON_KEY` for `VITE_SUPABASE_ANON_KEY`
   and `SERVICE_ROLE_KEY` for `SUPABASE_SERVICE_KEY`; URL is `http://127.0.0.1:54321`.

### Schema gotchas (important)
`supabase/schema.sql` is the documented schema but is OUT OF SYNC with `server.js`:
- It has forward references (e.g. `appointments` references `professional_applications`
  defined later), so apply it 2× idempotently. A few `chat_messages` RLS policies fail to
  create (the `chat_appointment_is_valid` function fails on a fresh DB) — harmless for non-chat flows.
- `screening_responses` in `schema.sql` is an older shape; the server writes extra columns
  (`name, phone, email, phq9_*, gad7_*, wants_callback, status`) that must be added with
  `alter table ... add column if not exists ...` for `/api/screening` to work.
- `server.js` also references tables NOT in `schema.sql` (`job_postings`, `job_applications`,
  `interview_schedules`) — those admin/jobs endpoints need extra tables.
- Tables created via `psql` (not the Supabase API) do NOT inherit grants automatically — run
  `grant usage on schema public ...` + `grant all on all tables/sequences in schema public to anon, authenticated, service_role;`
  or inserts fail with `42501 permission denied`.
- The `appointments` table matches the server exactly, so the booking flow (`/book`) works with
  only `schema.sql` applied — it is the simplest end-to-end smoke test (ends on a "Booking received!" screen with a reference code).

### Local helper files
`.env`, `supabase/config.toml`, and `supabase/.gitignore` are gitignored/untracked dev-only
artifacts — do not commit secrets.
