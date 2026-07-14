# Serenest

Clinical telepsychiatry for India — online psychiatry, therapy, counselling,
self-screening (PHQ-9 / GAD-7), and de-addiction support, plus Serenest
Academy for clinician education. Live at **https://www.serenest.in**.

## Stack

- **Frontend:** Vite + React 18 single-page app (`src/`), React Router.
- **Backend:** Express server (`server.js`) serving the built SPA and all
  `/api/*` routes, with per-route SEO injection.
- **Database & auth:** Supabase (Postgres). Schema in `supabase/`.
- **Video:** Daily.co · **Payments:** Razorpay · **Email:** Resend ·
  **WhatsApp pings:** CallMeBot · **AI:** OpenAI (site guide), Anthropic
  (content generation).
- **Hosting:** Render (`render.yaml`) — see `DEPLOY.md`.

## Run locally

```bash
npm install
cp .env.example .env   # fill in at least the Supabase values
npm run build          # builds the SPA into dist/
npm start              # Express serves dist/ + /api on http://localhost:3000
```

For frontend development with hot reload, run `npm run dev` (Vite) alongside
`npm start`, and set `VITE_API_URL=http://localhost:3000` in `.env`.

## Environment variables

Every variable is documented in **`.env.example`**. What breaks when they're
missing (also verifiable live at `/api/health`):

| Variables | If missing |
|---|---|
| `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` | Bookings/screenings aren't stored in the database — they fall back to `data/leads-fallback.jsonl` on the server (lost on redeploy) |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | Patient/professional login is disabled in the browser |
| `RESEND_API_KEY`, `NOTIFY_EMAIL` | **No email alerts for new leads** — you only see them in `/admin` |
| `CALLMEBOT_WHATSAPP_APIKEY`, `CALLMEBOT_WHATSAPP_PHONE` | No WhatsApp pings for leads/visitors |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | Payments off — bookings become manual "we'll call you back" requests |
| `GA_MEASUREMENT_ID` | No analytics — no traffic or conversion measurement |
| `ADMIN_SECRET` | Admin dashboard/API unprotected routes refuse access |
| `DAILY_API_KEY` | Video consultation rooms can't be created |
| `OPENAI_API_KEY` | Serenest Guide chat disabled |

## Verify production

After every deploy, open **`https://www.serenest.in/api/health`** — it reports
whether the database, lead notifications, payments, and analytics are
configured. The admin dashboard (`/admin`) shows a warning banner when the
lead pipeline is misconfigured, and the server logs print a config summary at
startup.

## Structure

```
serenest/
├── server.js          Express API + static serving + SEO injection
├── index.html         Vite entry (SEO head is re-injected per route at runtime)
├── src/
│   ├── App.jsx        Routes
│   ├── pages/         Page components (BookingPage, ScreeningPage, AdminPage, …)
│   ├── lib/           API client, SEO map, analytics, Supabase browser client
│   └── server/        Server-side modules (notify, AI assistant, social)
├── public/            Static files (robots.txt, sitemap.xml, manifest, …)
├── supabase/          schema.sql + migrations (run in Supabase SQL editor)
├── render.yaml        Render Blueprint (see DEPLOY.md)
└── .env.example       All environment variables, documented
```
