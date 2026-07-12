# Supabase setup for Serenest

The Serenest React app connects to Supabase for:

- **Professional applications** — submitted via `/professionals/apply`, managed in `/admin`
- **Patient find professional** — approved professionals shown at `/patient/find-professional`
- **Screening responses** — saved when users complete the quick screening at `/screening`

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. In **Project Settings → API**, copy:
   - **Project URL**
   - **anon public** key

## 2. Run the schema + migrations

1. In the Supabase dashboard, open **SQL Editor**.
2. Paste and run the contents of **`supabase/schema.sql`** (idempotent — safe to re-run).
3. Run each file in **`supabase/migrations/`** in filename order (also idempotent).
   For an existing database, at minimum run **`2026_07_03_tighten_rls.sql`** — it
   replaces early `using (true)` RLS policies with own-row access.

## 3. Configure environment variables

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```
2. Edit **`.env`** and set:
   - `VITE_SUPABASE_URL` — your Project URL (browser client)
   - `VITE_SUPABASE_ANON_KEY` — your anon public key (browser client)
   - `SUPABASE_URL` — same Project URL (server)
   - `SUPABASE_SERVICE_KEY` — your **service_role** key (server only — never expose it to the browser)

## 4. Deploy (Render)

Add these environment variables in Render:

| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Your service-role key |

Without the server pair, every `/api/*` data endpoint returns 503 (`Database not configured`); without the `VITE_` pair, login and consultation chat are disabled in the browser.
