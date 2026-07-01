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
5. Apply the schema: `psql "$DB_URL" -v ON_ERROR_STOP=1 -f supabase/schema.sql` (single pass).

### Schema notes
`supabase/schema.sql` is the single source of truth and now applies cleanly in ONE pass on a
fresh database (it is also idempotent / safe to re-run and self-upgrades older DBs via
`add column if not exists`). It is in sync with `server.js`:
- Tables are created in dependency order, so foreign keys never reference a missing table.
- It includes all tables the server uses, including the hiring pipeline
  (`job_postings`, `job_applications`, `interview_schedules`).
- `appointments` has a human-friendly `appointment_id` (auto-filled by a trigger) that the
  consultation chat (`chat_appointment_is_valid`) depends on.
- `screening_responses` matches `POST /api/screening` (`name, phone, email, phq9_*, gad7_*,
  wants_callback, status`).
- It grants the Supabase API roles (`anon, authenticated, service_role`) so it also works when
  applied via `psql` (outside the Supabase SQL Editor, default privileges are not auto-applied).
- Simplest end-to-end smoke test: the booking flow (`/book`) → ends on a "Booking received!"
  screen with a reference code; the row lands in `appointments`.
- The files in `supabase/migrations/` are historical fixes against the OLD production table
  shapes (they reference legacy columns like `designation`); do NOT apply them on top of a fresh
  `schema.sql` database.

### Local helper files
`.env`, `supabase/config.toml`, and `supabase/.gitignore` are gitignored/untracked dev-only
artifacts — do not commit secrets.
