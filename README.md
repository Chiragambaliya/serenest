# Serenest

Aligning minds, enhancing lives — website with screening, services, backend storage, and Supabase Auth.

## Run locally

Open `index.html` in a browser, or use a local server:

```bash
npx serve .
```

Then visit **http://localhost:3000** (or the URL shown).

---

## Backend (Supabase)

Form submissions (sign up, professionals, screening) are stored in Supabase. Auth (email + password) is also handled by Supabase.

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. In **Project Settings → API**, copy:
   - **Project URL**
   - **anon public** key (safe to use in the browser).

### 2. Create the database tables + policies + auth trigger

1. In the Supabase dashboard, open **SQL Editor**.
2. Paste and run the contents of **`supabase/schema.sql`**.
3. This creates `signups`, `professionals`, and `screening_responses`, enables RLS, adds read policies for authenticated users, and sets up a trigger that mirrors new patient sign-ups into the `signups` table automatically.

### 3. Enable email auth

1. In Supabase Dashboard → **Authentication → Providers → Email**, enable email logins.
2. In **Authentication → URL Configuration**, set **Site URL** to your deployed domain (e.g. `https://serenest.fit`).
3. Optionally disable email confirmation during testing (Authentication → Settings → "Enable email confirmations").

### 4. Connect the site to Supabase

1. Copy the example config:
   ```bash
   cp js/config.example.js js/config.js
   ```
2. Edit **`js/config.js`** and set:
   - `SERENEST_SUPABASE_URL` — your Project URL
   - `SERENEST_SUPABASE_ANON_KEY` — your anon public key

If `js/config.js` is missing or the values are empty, forms still show “Thank you” but data is not saved and auth will not work.

---

## Auth flow

| Page | What happens |
|------|--------------|
| `index.html #signup` | Patient can **create account** (email + password) or **sign in**. After sign-in they are redirected to `profile.html`. |
| `for-professionals.html` | Professional can **create account** or **log in**. After log-in they are redirected to `professionals-dashboard.html`. When already logged in, the form is replaced by a dashboard link. |
| `professionals-dashboard.html` | Auth-gated. Non-authenticated visitors are redirected to `for-professionals.html`. Shows stat cards (patient count, professional count, screening count) and recent data tables. |
| All pages | `js/auth.js` checks session on every page and updates the nav — “Sign up” becomes “My account” and “For professionals” becomes “My dashboard” when logged in. |

---

## Deploying on Render

See `DEPLOY.md` for full instructions. Key environment variables to set in Render:

| Variable | Value |
|----------|-------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your Supabase anon key |

If you use a build step to inject `js/config.js`, add it to your build script. Otherwise commit a `js/config.js` with real keys (only do this on private repos).

---

## File structure

```
serenest/
├── index.html                  Homepage + patient signup/login
├── for-professionals.html      Professionals landing + account auth
├── professionals-dashboard.html  Auth-gated professional dashboard
├── screening.html              Mental health screening questionnaire
├── services.html               Services overview
├── profile.html                User profile page
├── styles.css                  Global styles
├── main.js                     Form submission + nav + screening logic
├── js/
│   ├── config.example.js        Copy to config.js and fill in keys
│   ├── config.js                (git-ignored) Your real Supabase keys
│   ├── supabase-loader.js       Dynamically loads Supabase JS client
│   └── auth.js                  Email auth helpers (signup, login, logout, guard)
├── supabase/
│   └── schema.sql               Run this in Supabase SQL Editor once
├── assets/                     Images and icons
└── DEPLOY.md                   Render deployment instructions
```
