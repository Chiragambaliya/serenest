# How to deploy Serenest

Choose **one** of these:

---

## Option 1: Render (easiest — one service for site + API)

Good if your GitHub repo has **everything in the root**: `server.js`, `db.js`, `package.json`, and all `.html` files together.

### 1. Push code to GitHub

- Put your project in a GitHub repo (all HTML + `server.js`, `db.js`, `package.json`, etc. in the **repo root**).
- If you use a `backend/` folder locally, either:
  - Push the **root** with `server.js` and `package.json` in the root (copy from `backend/`), or
  - On Render, set **Root Directory** to `backend` and use **Build:** `npm install`, **Start:** `npm start` — then your repo root must still contain the HTML files so the server can serve them (e.g. parent of `backend/` = repo root with HTML).

### 2. Create a Web Service on Render

1. Go to [render.com](https://render.com) → Sign in (e.g. with GitHub).
2. **New +** → **Web Service**.
3. Connect your GitHub repo and select it.
4. Configure:
   - **Name:** e.g. `serenest`
   - **Region:** choose closest to your users
   - **Branch:** `main`
   - **Root Directory:** leave **empty** if `server.js` and `package.json` are in the repo root. If your backend is in a `backend/` folder, set **Root Directory** to `backend`.
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
| `ALLOWED_ORIGIN` | `https://your-service-name.onrender.com` (or your custom domain, e.g. `https://serenest.info`) |
| `TELEGRAM_BOT_TOKEN` | *(optional)* Telegram bot token — visit notifications to Telegram |
| `TELEGRAM_CHAT_ID` | *(optional)* Your Telegram chat ID |
| `TWILIO_ACCOUNT_SID` | *(optional)* Twilio Account SID — visit notifications to WhatsApp |
| `TWILIO_AUTH_TOKEN` | *(optional)* Twilio Auth Token |
| `TWILIO_WHATSAPP_FROM` | *(optional)* Twilio WhatsApp "From" number, e.g. `whatsapp:+14155238886` (sandbox) |
| `TWILIO_WHATSAPP_TO` | *(optional)* Your WhatsApp number, e.g. `whatsapp:+919876543210` |
| `RAZORPAY_KEY_ID` | *(optional)* Razorpay key ID — enable “Pay & book” on the booking page |
| `RAZORPAY_KEY_SECRET` | *(optional)* Razorpay key secret |
| `CONSULTATION_AMOUNT_INR` | *(optional)* Consultation fee in INR (default `500`) |

Save. Render will redeploy.

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

## Option 2: Vercel (frontend) + Render (backend)

Use this if you want the **frontend** on Vercel and the **API** on Render.

### 1. Deploy backend on Render

- Create a **new** repo or use a subfolder: only the **backend** code (`server.js`, `db.js`, `package.json`, etc.). No need to serve HTML.
- On Render: **New** → **Web Service** → connect that repo.
  - **Root Directory:** (where your `package.json` and `server.js` live, e.g. `backend` or empty).
  - **Build:** `npm install`
  - **Start:** `npm start`
- Environment: `NODE_ENV=production`, `ADMIN_SECRET`, `ALLOWED_ORIGIN=https://your-site.vercel.app` (you’ll update this after Vercel deploy).
- Note the Render URL, e.g. `https://serenest-xxxx.onrender.com`.

### 2. Deploy frontend on Vercel

1. Push the **full project** (all HTML + `backend/` or at least `config.js`, `scripts/build-config.js`, `vercel.json`) to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New** → **Project** → import the repo.
3. **Build Command:** `node scripts/build-config.js`
4. **Environment variable:** `API_URL` = your Render URL (e.g. `https://serenest-xxxx.onrender.com`) — no trailing slash.
5. Deploy. Vercel will write `config.js` with `window.API_BASE = "https://..."` so forms and admin call your backend.

### 3. CORS

On Render, set **Environment** → `ALLOWED_ORIGIN` = your Vercel URL or custom domain (e.g. `https://serenest.info`).

### 4. Custom domain

Add the domain in Vercel (frontend) and/or Render (if you expose the API on a subdomain). Set `ALLOWED_ORIGIN` to that domain.

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

## Payments (Razorpay)

The **Book** page can accept payment at booking. If Razorpay is not configured, the form still works and the booking is saved without payment (you can collect payment later).

1. **Sign up:** [razorpay.com](https://razorpay.com) → Dashboard → **API Keys** (under Settings). Create a key pair. Use **Test** keys for development and **Live** for production.
2. **Set env vars** on Render:
   - `RAZORPAY_KEY_ID` = your key id (starts with `rzp_`)
   - `RAZORPAY_KEY_SECRET` = your key secret
   - `CONSULTATION_AMOUNT_INR` = fee in INR (default `500`)
3. Redeploy. On the booking page, after the user fills the form and clicks **Pay & Confirm**, the Razorpay checkout opens. After successful payment, the booking is saved with the payment id (visible in Admin when you add a payment column to the bookings table).
4. **Webhook (optional):** For production you can add a Razorpay webhook to confirm payments; the current flow verifies the payment signature on the server before saving the booking.

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
- [ ] **Book** form submits and you get a success message. If Razorpay env vars are set, the payment popup opens and, after payment, the booking is confirmed.
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
