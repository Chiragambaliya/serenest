# Deploy Serenest on Render

You can run the **entire app** (website + API + SQLite) on Render as a single **Web Service**. No Vercel or VPS needed.

---

## 1. Push your code to GitHub

Your repo should look like this (project root = repo root):

```
your-repo/
  index.html
  book.html
  contact.html
  admin.html
  ... (all other .html)
  config.js
  backend/
    server.js
    db.js
    package.json
    .env.example
  scripts/
    build-config.js
```

Push to GitHub (and add `backend/.env` to `.gitignore` — do **not** commit `.env`).

---

## 2. Create a Web Service on Render

1. Go to [render.com](https://render.com) and sign in (GitHub is fine).
2. Click **New +** → **Web Service**.
3. Connect your GitHub account if needed, then select the **repository** that contains Serenest.
4. Use these settings:

   | Field | Value |
   |-------|--------|
   | **Name** | `serenest` (or any name) |
   | **Region** | Choose nearest to your users |
   | **Branch** | `main` (or your default branch) |
   | **Root Directory** | Leave **empty** (repo root) |
   | **Runtime** | `Node` |
   | **Build Command** | `cd backend && npm install` |
   | **Start Command** | `cd backend && npm start` |
   | **Instance Type** | Free or paid (Free spins down after ~15 min inactivity) |

5. Click **Advanced** and add **Environment Variables**:

   | Key | Value |
   |-----|--------|
   | `NODE_ENV` | `production` |
   | `ADMIN_SECRET` | Your long random secret (e.g. from `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
   | `ALLOWED_ORIGIN` | Leave **empty** for now, or set to your Render URL after first deploy (e.g. `https://serenest-xxxx.onrender.com`) |

6. Click **Create Web Service**.

Render will build and start the app. When it’s live, you’ll get a URL like **`https://serenest-xxxx.onrender.com`**.

---

## 3. Set ALLOWED_ORIGIN (after first deploy)

1. In the Render dashboard, open your service → **Environment**.
2. Add or edit:
   - **Key:** `ALLOWED_ORIGIN`
   - **Value:** `https://serenest-xxxx.onrender.com` (your actual Render URL, no trailing slash).
3. Save. Render will redeploy automatically.

---

## 4. Test

- **Site:** Open `https://serenest-xxxx.onrender.com` (or `/index.html`, `/book.html`, etc.).
- **Forms:** Submit a test booking, contact message, or doctor application.
- **Admin:** Open `https://serenest-xxxx.onrender.com/admin.html` and log in with your `ADMIN_SECRET`.

---

## 5. Custom domain (optional)

1. In the Render dashboard → your service → **Settings** → **Custom Domains**.
2. Add your domain (e.g. `serenest.in`).
3. Render will show a **CNAME** target (e.g. `serenest-xxxx.onrender.com`). In your DNS provider, add a CNAME record pointing your domain to that target.
4. Update **Environment** → `ALLOWED_ORIGIN` to `https://yourdomain.com`.

---

## Notes

- **Free tier:** The service may “spin down” after inactivity; the first request can take 30–60 seconds. For always-on, use a paid instance.
- **Database:** SQLite lives in `backend/serenest.db` on Render’s disk. On the free tier the filesystem can be ephemeral (data may be lost on redeploy). For production, consider backing up the DB or moving to a managed database later.
- **API_URL:** If you later put the frontend on Vercel and only the backend on Render, set `API_URL` in Vercel to this Render URL and `ALLOWED_ORIGIN` on Render to your Vercel URL.
