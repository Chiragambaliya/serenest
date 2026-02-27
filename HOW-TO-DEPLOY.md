# How to deploy Serenest

You can deploy in three ways: **A) Your own server (VPS)**, **B) Railway / Render (one app)**, or **C) Vercel (frontend) + Railway/Render (backend)**.

---

## Option C — Vercel (frontend) + Railway or Render (backend)

**Idea:** The static site (HTML/CSS/JS) runs on Vercel. The API and database run on Railway or Render. The frontend calls your backend URL via `config.js`, which is set at build time.

### 1. Deploy the backend first

Deploy the **backend** to Railway or Render (see Option B below) so you have a URL like:

- `https://serenest-api.up.railway.app` or  
- `https://serenest-xxxx.onrender.com`

On that backend, set in **Environment**:

- `NODE_ENV=production`
- `ADMIN_SECRET=your-secret`
- `ALLOWED_ORIGIN=https://your-project.vercel.app` (replace with your Vercel URL or custom domain later)

The backend **only** needs to serve the API (no need to serve the HTML). So you can deploy only the `backend` folder to Railway/Render: **Root directory** = `backend`, **Build** = `npm install`, **Start** = `npm start`. The SQLite file will live on that service.

### 2. Deploy the frontend to Vercel

1. Push your project to **GitHub** (repo root = folder that contains `backend/`, all `.html`, `config.js`, `scripts/`, `vercel.json`).
2. Go to [vercel.com](https://vercel.com) → **Add New** → **Project** → import the repo.
3. Leave **Framework Preset** as “Other”.
4. **Build Command:** `node scripts/build-config.js`
5. **Environment variables:** add:
   - **Name:** `API_URL`  
   - **Value:** your backend URL (e.g. `https://serenest-api.up.railway.app`)  
   - No trailing slash.
6. Deploy. Vercel will run the build command and overwrite `config.js` with `window.API_BASE = "https://your-backend-url"`.
7. Your site will be at `https://your-project.vercel.app`. Test the Book, Contact, and Doctor forms — they should submit to your backend.

### 3. Point backend CORS to Vercel

On Railway/Render, set:

- `ALLOWED_ORIGIN=https://your-project.vercel.app`  
  (or your custom domain, e.g. `https://serenest.in`)

Redeploy the backend if needed.

### 4. Custom domain on Vercel (optional)

In the Vercel project → **Settings** → **Domains** → add your domain and follow the DNS instructions. Then set `ALLOWED_ORIGIN` on the backend to that domain (e.g. `https://serenest.in`).

### 5. Admin panel

Open **https://your-project.vercel.app/admin.html** and log in with your `ADMIN_SECRET`. All API calls will go to the backend URL from `config.js`.

---

---

## Option A — Deploy on a VPS (Ubuntu)

Use a cloud server (DigitalOcean, Linode, AWS Lightsail, etc.) with Ubuntu 22.04.

### 1. Create a server

- **Size:** 1 GB RAM is enough to start.
- **OS:** Ubuntu 22.04 LTS.
- Note the server **IP address** and use it in the steps below (e.g. `123.45.67.89`).

### 2. Connect and prepare the system

```bash
ssh root@YOUR_SERVER_IP
# Or: ssh ubuntu@YOUR_SERVER_IP  (if your provider uses 'ubuntu')
```

Update and install Node, nginx, and PM2:

```bash
apt update && apt upgrade -y
apt install -y nginx

# Node 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# PM2 (keeps Node running)
npm install -g pm2
```

### 3. Upload your project

**Option 3a — Git (if your code is in a repo):**

```bash
apt install -y git
cd /var/www
git clone https://github.com/YOUR_USERNAME/serenest-website.git
cd serenest-website
```

**Option 3b — Upload with SCP from your PC:**

From your **local machine** (PowerShell or terminal):

```bash
scp -r c:\Users\Admin\serenest-website root@YOUR_SERVER_IP:/var/www/serenest-website
```

Then on the server:

```bash
cd /var/www/serenest-website
```

### 4. Configure the backend

```bash
cd /var/www/serenest-website/backend
npm install
cp .env.example .env
nano .env
```

Set these (replace with your real values):

```env
NODE_ENV=production
PORT=3000
ADMIN_SECRET=your-long-random-secret-here
ALLOWED_ORIGIN=https://yourdomain.com
```

Save (Ctrl+O, Enter, Ctrl+X). Generate a secret if needed:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Start the app with PM2

```bash
cd /var/www/serenest-website/backend
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup
# Run the command it prints (e.g. sudo env PATH=... pm2 startup systemd -u root --hp /root)
```

Check it’s running:

```bash
pm2 status
curl -s http://127.0.0.1:3000/api/health
# Should return {"ok":true,"status":"ok","env":"production"}
```

### 6. Point nginx at your app

Create a config (replace `yourdomain.com` with your domain):

```bash
nano /etc/nginx/sites-available/serenest
```

Paste (and fix domain and paths if different):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/serenest-website;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and test:

```bash
ln -s /etc/nginx/sites-available/serenest /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

### 7. DNS

In your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.) add an **A record**:

- **Host:** `@` (and optionally `www`)
- **Value:** your server IP (e.g. `123.45.67.89`)

Wait a few minutes, then open **http://yourdomain.com**. You should see the site (API will work over HTTP).

### 8. HTTPS with Let’s Encrypt

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts (email, agree to terms). Certbot will adjust nginx for HTTPS. After that, use **https://yourdomain.com**.

### 9. Update ALLOWED_ORIGIN

Edit `backend/.env` and set:

```env
ALLOWED_ORIGIN=https://yourdomain.com
```

Then restart the app:

```bash
pm2 restart serenest
```

### 10. Backups (recommended)

Back up the database regularly:

```bash
crontab -e
# Add a line (daily at 2 AM):
0 2 * * * cp /var/www/serenest-website/backend/serenest.db /root/backups/serenest-$(date +\%Y\%m\%d).db
```

Create the folder first: `mkdir -p /root/backups`.

---

## Option B — Deploy on Railway or Render (no server to manage)

Your app is one Node server that serves both the site and the API. These platforms run it for you.

### Railway

1. Go to [railway.app](https://railway.app) and sign in (e.g. with GitHub).
2. **New project** → **Deploy from GitHub repo**. Connect the repo that contains `serenest-website` (or push your project to a GitHub repo first).
3. Set **root directory** to the folder that contains `backend` (e.g. `/` if the repo root has `backend/` and all HTML files).
4. Railway may auto-detect Node. If not, set:
   - **Build command:** `cd backend && npm install`
   - **Start command:** `cd backend && npm start`
   - **Root directory:** leave blank or `/` so that the start command can `cd backend`.
5. In **Variables**, add:
   - `NODE_ENV` = `production`
   - `PORT` = `3000` (Railway often sets PORT for you)
   - `ADMIN_SECRET` = your long random secret
   - `ALLOWED_ORIGIN` = `https://your-app.up.railway.app` (or your custom domain)
6. Deploy. Railway will give you a URL like `https://serenest-production.up.railway.app`.
7. **Important:** Your **entire app** (HTML + API) must be served from that one service. So the repo should have both the frontend files and the `backend` folder. The start command runs `node server.js` from `backend`, and that server serves static files from the parent directory — so the repo root should contain both `backend/` and all the `.html` files. If your repo structure is different, set **Root directory** so that when the app runs, `backend/server.js` can find the parent directory with the HTML files (e.g. project root = repo root).

**Custom domain on Railway:** In the project, go to **Settings** → **Domains** → add your domain and set the CNAME they give you at your DNS provider. Then set `ALLOWED_ORIGIN` to `https://yourdomain.com`.

### Render

1. Go to [render.com](https://render.com) and sign in.
2. **New** → **Web Service**. Connect the GitHub repo.
3. **Build command:** `cd backend && npm install`
4. **Start command:** `cd backend && npm start`
5. **Instance type:** Free or paid.
6. Under **Environment**, add:
   - `NODE_ENV` = `production`
   - `ADMIN_SECRET` = your secret
   - `ALLOWED_ORIGIN` = `https://your-service-name.onrender.com` (or your custom domain)
7. Deploy. Render gives you a URL.

**Note:** Render’s free tier spins down after inactivity; the first request may be slow. For always-on, use a paid plan or a VPS (Option A).

---

## After deploy

- **Site:** `https://yourdomain.com` (or the URL from Railway/Render).
- **Admin panel:** `https://yourdomain.com/admin.html` — open it and log in with your `ADMIN_SECRET` as the admin key.
- **Database:** On a VPS it’s `backend/serenest.db`. On Railway/Render the filesystem can be ephemeral, so for long-term data consider backing up the DB or moving to a managed DB later.

---

## Quick checklist

- [ ] **Vercel:** Backend deployed (Railway/Render); `API_URL` set in Vercel; `ALLOWED_ORIGIN` on backend set to your Vercel (or custom) URL.
- [ ] Domain A record (or CNAME) points to the server / platform URL.
- [ ] `backend/.env` has `NODE_ENV=production`, `ADMIN_SECRET`, and `ALLOWED_ORIGIN` (your live URL).
- [ ] App runs with PM2 (VPS) or is deployed and healthy (Railway/Render).
- [ ] HTTPS works (certbot on VPS; automatic on Railway/Render with their URL or custom domain).
- [ ] Forms (book, contact, doctors) submit and you see data in `/admin.html`.
- [ ] Backups of `serenest.db` (VPS cron or manual; check platform docs for Railway/Render).
