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

## 2. Run the schema

1. In the Supabase dashboard, open **SQL Editor**.
2. Paste and run the contents of **`supabase/schema.sql`**.
3. This creates `professional_applications`, `signups`, `professionals`, `screening_responses`, and RLS policies.

## 3. Configure environment variables

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```
2. Edit **`.env`** and set:
   - `VITE_SUPABASE_URL` — your Project URL
   - `VITE_SUPABASE_ANON_KEY` — your anon public key

## 4. Deploy (Render)

Add these environment variables in Render:

| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |

Without these, the app falls back to `localStorage` for professional applications and screening responses.
