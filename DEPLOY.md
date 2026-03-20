# Deploy Serenest to Render as serenest.fit

Follow these steps to deploy the site and use the domain **serenest.fit**.

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

---

## 2. (Optional) Add Supabase env vars

If you want form data saved to Supabase:

1. In the Render dashboard, open your **serenest** web service.
2. Go to **Environment**.
3. Add:
   - **Key:** `SUPABASE_URL` → **Value:** your Supabase project URL
   - **Key:** `SUPABASE_ANON_KEY` → **Value:** your Supabase anon key
4. Save. Render will redeploy automatically.

---

## 3. Add custom domain serenest.fit

1. In your web service on Render, go to **Settings** → **Custom Domains**.
2. Click **Add Custom Domain**.
3. Enter: **`serenest.fit`** → Add.
4. Render will show the DNS record you need.
5. (Optional) Add **`www.serenest.fit`** the same way.

---

## 4. Configure DNS for serenest.fit

Where you manage DNS for **serenest.fit** (registrar, Cloudflare, etc.):

1. Add the record Render showed you. Typical setup:
   - **Type:** CNAME
   - **Name/host:** `@` or `serenest.fit`
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
| 2 | Render → Environment | Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` (optional) |
| 3 | Render → Settings → Custom Domains | Add `serenest.fit` (and optionally `www.serenest.fit`) |
| 4 | Your DNS (registrar/Cloudflare) | Add CNAME record(s) as shown by Render |

Live URL: **https://serenest.fit**
