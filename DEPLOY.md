# Deploy Serenest to Render as serenest.in

Follow these steps to deploy the site and use the domain **serenest.in**.
The deploy is **one Node web service** — Serenest clinical and Serenest
Academy now ship together (Academy lives at `/academy`).

---

## 1. Create the Web Service on Render

1. Go to **[dashboard.render.com](https://dashboard.render.com)** and sign in.
2. Click **New** → **Web Service**.
3. **Connect repository:** choose **GitHub** and select **Chiragambaliya/serenest**.
4. Set:
   - **Name:** `serenest`
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build command:** `npm install && npm run build`
   - **Start command:** `npm start`
5. Click **Create Web Service**. Your site will be at `https://serenest.onrender.com` (or similar).

> The repo also contains `render.yaml` (Blueprint) describing this service —
> the Dashboard and the Blueprint stay in sync.

---

## 2. (Optional) Add Supabase env vars

If you want form data saved to Supabase:

1. In the Render dashboard, open your **serenest** web service.
2. Go to **Environment**.
3. Add:
   - **Key:** `SUPABASE_URL` → **Value:** your Supabase project URL
   - **Key:** `SUPABASE_SERVICE_KEY` → **Value:** your Supabase service-role key
   - **Key:** `VITE_SUPABASE_URL` → **Value:** same as `SUPABASE_URL`
   - **Key:** `VITE_SUPABASE_ANON_KEY` → **Value:** your Supabase anon key
4. Save. Render will redeploy automatically.

---

## 3. Enable Serenest Guide (OpenAI)

The floating **Guide** button on the site uses OpenAI on the server (`POST /api/assistant/chat`). The API key never goes in the browser.

1. Create a key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys).
2. Render → your **serenest** web service → **Environment** → add:
   - **Key:** `OPENAI_API_KEY` → **Value:** your OpenAI secret key
   - **Key:** `OPENAI_MODEL` → **Value:** `gpt-4o-mini` (optional; this is the default)
3. Save and wait for redeploy.
4. Confirm: open `https://www.serenest.in/api/health` — `"assistant": "configured"`. Then open the site and click **Guide** in the bottom corner.

For local dev, copy `.env.example` to `.env` and set `OPENAI_API_KEY` there too.

---

## 4. Add custom domain serenest.in

1. In your web service on Render, go to **Settings** → **Custom Domains**.
2. Click **Add Custom Domain**.
3. Enter: **`serenest.in`** → Add.
4. Render will show the DNS record you need.
5. (Optional) Add **`www.serenest.in`** the same way.

---

## 5. Configure DNS for serenest.in

Where you manage DNS for **serenest.in** (registrar, Cloudflare, etc.):

1. Add the record Render showed you. Typical setup:
   - **Type:** CNAME (or ALIAS / ANAME for the apex on supported providers)
   - **Name/host:** `@` or `serenest.in`
   - **Target/value:** the Render URL shown (e.g. `serenest-xxxx.onrender.com`)
2. For **www** (if you added it):
   - **Type:** CNAME
   - **Name:** `www`
   - **Target:** same Render URL
3. Save. DNS can take from a few minutes up to 48 hours to propagate.

---

## Summary

| Step | Where | What |
|------|--------|------|
| 1 | Render | New → Web Service, connect repo, build `npm install && npm run build`, start `npm start` |
| 2 | Render → Environment | Add Supabase vars (optional) |
| 3 | Render → Environment | Add `OPENAI_API_KEY` for Serenest Guide |
| 4 | Render → Settings → Custom Domains | Add `serenest.in` (and optionally `www.serenest.in`) |
| 5 | Your DNS (registrar/Cloudflare) | Add CNAME record(s) as shown by Render |

Live URL: **https://serenest.in** · Academy: **https://serenest.in/academy**
