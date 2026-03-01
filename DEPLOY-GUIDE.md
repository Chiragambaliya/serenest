# How to deploy Serenest

Choose **one** of these:

---

## Deploy to Render (quick — Blueprint)

1. **Push** this repo to GitHub (you already have it at `Chiragambaliya/serenest`).
2. Go to [render.com](https://render.com) → **Sign in** (e.g. with GitHub).
3. **New +** → **Blueprint**.
4. Connect **GitHub** and select the **serenest** repo. Render will read `render.yaml` from the repo.
5. Click **Apply**. Render creates one **Web Service** (Node, root: `backend`).
6. In the Dashboard → your **serenest** service → **Environment**:
   - **ADMIN_SECRET:** set a long random string (you’ll use this to log in to `/admin.html`).
   - **ALLOWED_ORIGIN:** set your live URL, e.g. `https://serenest.onrender.com` (no trailing slash). Use the URL Render shows for your service; add a custom domain later if you want.
7. **Save** → Render will redeploy. When the deploy is green, open `https://your-service-name.onrender.com`.
8. **(Optional)** Add more env vars (Telegram, Resend, Twilio, etc.) as in **Option 1** below, then redeploy.

---

## Option 1: Everything on Render (one service for site + API)

**Use this if your whole app (HTML + API) is on a single Render service.** Same origin = no `API_URL` or build step. Keep `config.js` with `window.API_BASE = ''`.

Good if your GitHub repo has the **backend in `backend/`** and all `.html` files in the repo root.

### 1. Push code to GitHub

- Your repo has **HTML in the root** and **backend in `backend/`** (server.js, db.js, package.json). Push to GitHub.

### 2. Create one Web Service on Render

1. Go to [render.com](https://render.com) → Sign in (e.g. with GitHub).
2. **New +** → **Web Service**.
3. Connect your GitHub repo and select it.
4. Configure:
   - **Name:** e.g. `serenest`
   - **Region:** choose closest to your users
   - **Branch:** `main`
   - **Root Directory:** `backend` (so Render runs from the backend folder; the server will serve HTML from the repo root automatically)
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance type:** Free (or Paid for always-on)

### 3. Environment variables

In the Render dashboard → your service → **Environment** → Add:

| Key            | Value |
|----------------|--------|
| `NODE_ENV`     | `production` |
| `ADMIN_SECRET` | A long random string (e.g. generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
| `ALLOWED_ORIGIN` | The URL users use to open your site: `https://your-service-name.onrender.com` or your custom domain (e.g. `https://serenest.fit`) — no trailing slash |
| `TELEGRAM_BOT_TOKEN` | *(optional)* Telegram bot token — visit notifications to Telegram |
| `TELEGRAM_CHAT_ID` | *(optional)* Your Telegram chat ID |
| `TWILIO_ACCOUNT_SID` | *(optional)* Twilio Account SID — visit notifications to WhatsApp |
| `TWILIO_AUTH_TOKEN` | *(optional)* Twilio Auth Token |
| `TWILIO_WHATSAPP_FROM` | *(optional)* Twilio WhatsApp "From" number, e.g. `whatsapp:+14155238886` (sandbox) |
| `TWILIO_WHATSAPP_TO` | *(optional)* Your WhatsApp number, e.g. `whatsapp:+919876543210` |
| `RESEND_API_KEY` | *(optional)* Resend API key — sends booking confirmation email to patient |
| `BOOKING_FROM_EMAIL` | *(optional)* From address for booking emails, e.g. `Serenest <bookings@serenest.in>` (must be verified in Resend) |
| `BOOKING_VIDEO_LINK` | *(optional)* Default "Join video call" URL shown after every booking (e.g. Zoom/Meet). You can override per booking in Admin → Bookings → Set link |
| `CRON_SECRET` | *(optional)* Secret for the reminder cron endpoint; set this and call `POST /api/cron/send-reminders` with header `X-Cron-Secret: <value>` every hour (e.g. Render Cron Job) |

Save. Render will redeploy.

**Note:** With everything on Render you do **not** set `API_URL` or run any build. Keep `config.js` as in the repo (`window.API_BASE = ''`).

### 4. Deploy

Click **Deploy**. Wait for the build to finish. Your site will be at:

`https://your-service-name.onrender.com`

- Homepage: `/`
- Book: `/book.html`
- Admin: `/admin.html` (log in with the value you set for `ADMIN_SECRET`)

### 5. Custom domain (e.g. serenest.info)

1. In Render → your service → **Settings** → **Custom Domains** → Add `serenest.info` (and `www.serenest.info` if you use it).
2. Render shows a CNAME (e.g. `serenest-xxxx.onrender.com`). At your domain registrar (where you bought the domain), add:
   - **Type:** CNAME  
   - **Name:** `@` or `www` (as Render instructs)  
   - **Value:** the CNAME Render gave you
3. After DNS propagates, Render will issue HTTPS automatically.
4. Update **Environment** → `ALLOWED_ORIGIN` to `https://serenest.info` and save (redeploy if needed).

---

## Option 2 (Option B): Backend on Render + frontend with build

Use this when your **frontend** is on Vercel (or any host) and the **API** runs on Render. The build step injects the Render API URL into `config.js` so Book, Contact, and Admin work.

### 1. Deploy backend on Render

1. Go to [render.com](https://render.com) → **New +** → **Web Service**.
2. Connect your **GitHub repo** (the full Serenest repo).
3. Configure:
   - **Name:** e.g. `serenest-api`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. **Environment** → Add:
   - `NODE_ENV` = `production`
   - `ADMIN_SECRET` = (your secret)
   - `ALLOWED_ORIGIN` = your frontend URL, e.g. `https://serenest.fit` or `https://your-app.vercel.app` (no trailing slash)
   - (Optional: Telegram, WhatsApp vars as in Option 1)
5. Deploy. Copy your **service URL**, e.g. `https://serenest-api.onrender.com` (no trailing slash).

### 2. Deploy frontend (Vercel) with API URL

1. Go to [vercel.com](https://vercel.com) → **Add New** → **Project** → import the **same** repo.
2. **Build Command:** `node scripts/build-config.js`
3. **Environment variable:** add `API_URL` = your Render URL from step 1 (e.g. `https://serenest-api.onrender.com`).
4. Deploy. The build runs the script and writes `config.js` with `window.API_BASE = "https://serenest-api.onrender.com"`, so the booking and contact forms call your Render API.
5. If you use a custom domain (e.g. serenest.fit) on Vercel, go back to Render → **Environment** → set `ALLOWED_ORIGIN` = `https://serenest.fit` and redeploy.

### 3. Custom domain

- **Frontend:** In Vercel → Project → Settings → Domains → add e.g. `serenest.fit`. Then set Render `ALLOWED_ORIGIN` to that URL.
- **Backend:** You can keep the Render URL for API calls; no need to expose it on a custom domain unless you want to.

---

## Option 3: Your own server (VPS)

See **HOW-TO-DEPLOY.md** → **Option A** for full steps (Ubuntu, nginx, PM2, HTTPS with Let’s Encrypt).

---

## Visit notifications (Telegram)

When someone visits any page on your site, you can get an instant notification on your phone.

1. **Create a bot:** In Telegram, open [@BotFather](https://t.me/BotFather), send `/newbot`, follow the steps. Copy the **token** (e.g. `123456789:ABCdef...`).
2. **Get your chat ID:** Send any message to your new bot (e.g. "Hi"). Then in a browser open:  
   `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`  
   In the JSON, find `"chat":{"id": 123456789}` — that number is your **chat ID**.
3. **Set env vars** on Render (or your host):  
   - `TELEGRAM_BOT_TOKEN` = the token from step 1  
   - `TELEGRAM_CHAT_ID` = the number from step 2  
   Redeploy. Each new visitor (one ping per browser session) will trigger a message like:  
   *Serenest visit — Page: / — From: Direct — 25/02/2025, 3:45:00 pm*

Visits are also stored in the database (table `visits`). You can add a "Visits" tab in the admin panel later to view them.

---

## Visit notifications (WhatsApp via Twilio)

You can get visit alerts on **WhatsApp** using Twilio’s WhatsApp Sandbox (free for testing).

1. **Sign up:** [twilio.com](https://www.twilio.com/try-twilio) → create an account.
2. **WhatsApp Sandbox:** In Twilio Console go to **Messaging** → **Try it out** → **Send a WhatsApp message**. You’ll see:
   - A “From” number (e.g. `+1 415 523 8886`) and a **join code** (e.g. `join happy-tiger`).
   - From **your** WhatsApp, send that join code to the Twilio number. You’ll get a confirmation. (You must do this so Twilio can deliver messages to you.)
3. **Get credentials:** In Twilio Console → **Account** → **API keys & tokens**:
   - **Account SID** and **Auth Token** (or create an API key and use SID + Secret).
4. **Set env vars** on Render (or your host):
   - `TWILIO_ACCOUNT_SID` = your Account SID  
   - `TWILIO_AUTH_TOKEN` = your Auth Token  
   - `TWILIO_WHATSAPP_FROM` = `whatsapp:+14155238886` (use the sandbox number from step 2, with country code, no spaces)  
   - `TWILIO_WHATSAPP_TO` = `whatsapp:+91XXXXXXXXXX` (your WhatsApp number in E.164: country code + number, no spaces or zeros after country code)  
   Redeploy.
5. When someone visits your site, you’ll get a WhatsApp message: *Serenest visit — Page: / — From: Direct — 25/02/2025, 3:45:00 pm*.

You can use **both** Telegram and WhatsApp; if both are configured, you’ll get two notifications per visit.

---

## Booking confirmation email (Resend)

When a patient books a session, you can:

1. **Notify yourself** — Same as visit notifications: if Telegram and/or Twilio WhatsApp are set, you get a short “New booking” message (name, email, specialist, date/time).
2. **Email the patient** — A confirmation email is sent to the patient if you configure [Resend](https://resend.com):

   1. Sign up at [resend.com](https://resend.com), verify your domain (e.g. `serenest.in`), and add a sending address like `bookings@serenest.in`.
   2. In Resend dashboard, create an API key.
   3. Set env vars on Render (or your host):
      - `RESEND_API_KEY` = your Resend API key  
      - `BOOKING_FROM_EMAIL` = the verified “From” address, e.g. `Serenest <bookings@serenest.in>`  
   Redeploy. After each booking, the patient receives an email with their booking details.

---

## Appointment reminders (cron)

To send email and WhatsApp reminders 24 hours and 1 hour before each session:

1. Set **CRON_SECRET** in Render (or your host) to a long random string.
2. Call **POST /api/cron/send-reminders** every hour with header **X-Cron-Secret: &lt;your CRON_SECRET&gt;**.
3. On **Render**: add a **Cron Job** (same service or a separate one) that runs `curl -X POST -H "X-Cron-Secret: $CRON_SECRET" https://your-app.onrender.com/api/cron/send-reminders` every hour.

The endpoint finds bookings whose session is in ~24h or ~1h and sends a reminder email (Resend) and WhatsApp (Twilio) if configured.

---

## SEO (search engines)

The site includes:

- **Meta descriptions** and **canonical URLs** on the homepage and main pages (patients, doctors, book, contact, about, services, FAQ, screenings, crisis, blog, resources, pricing, specialists, privacy, terms).
- **Open Graph** and **Twitter Card** tags on the homepage for better link previews.
- **JSON-LD** (MedicalOrganization) on the homepage for rich results.
- **sitemap.xml** and **robots.txt** in the project root.

**Before or after going live:** If your site URL is **not** `https://serenest.in`, do a find-and-replace across the project:

- Replace `https://serenest.in` with your real URL (e.g. `https://www.serenest.in` or your custom domain) in:
  - `index.html` (canonical, og:url, JSON-LD)
  - `sitemap.xml` (all `<loc>` and the sitemap URL in the last line)
  - `robots.txt` (Sitemap line)
  - Every other HTML file that has `<link rel="canonical" href="https://serenest.in/...">`

Then:

1. In [Google Search Console](https://search.google.com/search-console), add your property and submit `https://yourdomain.com/sitemap.xml`.
2. Optionally add your site to Bing Webmaster Tools and submit the same sitemap.

---

## After deploy – checklist

- [ ] Site loads at your URL.
- [ ] **Book** form submits and you get a success message.
- [ ] **Contact** and **Doctors (Apply)** forms work.
- [ ] **Newsletter** on the blog subscribes (check Admin → Newsletter).
- [ ] **Admin:** open `/admin.html`, log in with `ADMIN_SECRET`, and see Bookings / Contact / Applications / Newsletter.
- [ ] *(Optional)* **Visit notifications:** If you set Telegram or Twilio WhatsApp env vars, open your site in a new incognito window and check Telegram/WhatsApp for a visit message.
- [ ] `ALLOWED_ORIGIN` matches your live site URL (no trailing slash).
- [ ] If using Render free tier, first load after idle can be slow (cold start).

---

## Troubleshooting

| Problem | What to check |
|--------|----------------|
| Blank page or 404 | On Render, ensure **Start** runs from the directory that contains both `server.js` and `index.html` (or static root is set correctly in code). |
| Forms don’t submit | Backend URL in `config.js` (Vercel) or same-origin (Render). `ALLOWED_ORIGIN` must match the site’s origin exactly. |
| Admin 401 | You must send header `X-Admin-Key: <your ADMIN_SECRET>`. The admin page does this after you log in. |
| Database empty after redeploy | On Render/Railway, the filesystem can reset. For production, consider backing up `serenest.db` or using a managed database. |
