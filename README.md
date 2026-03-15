# Serenest

Aligning minds, enhancing lives — website with screening, services, and backend storage.

## Run locally

Open `index.html` in a browser, or use a local server:

```bash
npx serve .
```

Then visit **http://localhost:3000** (or the URL shown).

## Backend (Supabase)

Form submissions (sign up, professionals, screening) are stored in Supabase when configured.

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. In **Project Settings → API**, copy:
   - **Project URL**
   - **anon public** key (safe to use in the browser).

### 2. Create the database tables

1. In the Supabase dashboard, open **SQL Editor**.
2. Paste and run the contents of **`supabase/schema.sql`**.
3. This creates `signups`, `professionals`, and `screening_responses` and allows anonymous inserts.

### 3. Connect the site to Supabase

1. Copy the example config:
   ```bash
   cp js/config.example.js js/config.js
   ```
2. Edit **`js/config.js`** and set:
   - `SERENEST_SUPABASE_URL` — your Project URL
   - `SERENEST_SUPABASE_ANON_KEY` — your anon public key

If `js/config.js` is missing or the values are empty, forms still show “Thank you” but data is not saved.

### What gets stored

| Form              | Table                | Data                                      |
|-------------------|----------------------|-------------------------------------------|
| Sign up (email + mobile) | `signups`       | email, mobile, created_at                 |
| Join as a professional   | `professionals` | name, email, mobile, role, created_at     |
| Screening questionnaire  | `screening_responses` | reason, conditions[], format, frequency, created_at |

View and export data in **Supabase Dashboard → Table Editor**.

## Deploy to Render (e.g. serenest.fit)

1. **Create a Static Site on Render**
   - Go to [dashboard.render.com](https://dashboard.render.com) → **New** → **Static Site**.
   - Connect the repo: **https://github.com/Chiragambaliya/serenest**.
   - **Name:** `serenest` (or any name).
   - **Build command:** `npm run build`
   - **Publish directory:** `.`
   - Click **Create Static Site**.

2. **Environment variables** (optional, for Supabase)
   - In the new static site → **Environment** → **Add Environment Variable**.
   - Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` (your Supabase project URL and anon key).
   - Save. A new deploy will run.

3. **Add custom domain serenest.fit**
   - In your static site → **Settings** → **Custom Domains** → **Add Custom Domain**.
   - Enter: `serenest.fit`
   - Optionally add: `www.serenest.fit`
   - Render will show the DNS records you need (e.g. CNAME `serenest.fit` → your Render host, or A record).

4. **Point your domain to Render**
   - In the DNS panel where you bought **serenest.fit** (Registrar / Cloudflare / etc.):
   - Add the record Render shows (usually):
     - **CNAME** `serenest.fit` → `your-service-name.onrender.com`  
       or **A** record if Render gives an IP.
     - For `www`: **CNAME** `www` → `your-service-name.onrender.com`
   - Save. SSL is automatic once DNS propagates (can take a few minutes to 48 hours).

Your site will be live at **https://serenest.fit** (and https://www.serenest.fit if you added it).

## Structure

- **`index.html`** — Home (hero, about, services teaser, screening CTA, practice, professionals, sign up)
- **`screening.html`** — Full screening questionnaire
- **`services.html`** — Services and conditions
- **`profile.html`** — Profile and sign-in/sign-up
- **`for-professionals.html`** — Professionals sign-up and benefits
- **`styles.css`** — Layout and theme
- **`main.js`** — Nav, form handling, screening flow, Supabase save
- **`js/config.js`** — Supabase URL and anon key (copy from `config.example.js`)
- **`js/supabase-loader.js`** — Loads Supabase client when config is set
- **`supabase/schema.sql`** — Database schema for Supabase

No build step required.
