# Serenest Backend

Node.js + Express API for Serenest. Stores **bookings**, **contact messages**, and **doctor applications** in SQLite.

## Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env for production (see below)
npm start
```

Server runs at **http://localhost:3000** by default (`PORT` in `.env` overrides).

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/otp/send` | Send 6-digit OTP to a phone number |
| POST | `/api/otp/verify` | Verify OTP — logs in or auto-registers patient |
| GET | `/api/auth/google` | Redirect to Google consent screen |
| GET | `/api/auth/google/callback` | Google redirects here after login |
| POST | `/api/signup` | Register with email + password |
| POST | `/api/login` | Login with email + password |
| POST | `/api/logout` | Invalidate session token |
| GET | `/api/me` | Get current patient profile |
| PUT | `/api/me` | Update profile (full_name) |
| POST | `/api/me/change-password` | Change password |
| GET | `/api/me/bookings` | Get patient's own bookings |
| POST | `/api/booking` | Book a consultation (from book.html) |
| POST | `/api/contact` | Contact form (contact.html) |
| POST | `/api/apply` | Doctor application (doctors.html) |
| GET | `/api/health` | Health check |
| GET | `/api/admin/bookings` | List bookings (auth in prod) |
| GET | `/api/admin/contact` | List contact messages (auth in prod) |
| GET | `/api/admin/applications` | List applications (auth in prod) |

**Admin panel:** Open **`/admin.html`** in the browser. Enter your admin key (same as `ADMIN_SECRET` in `.env`). You can view and refresh Bookings, Contact messages, and Doctor applications. Session is kept until you close the tab or click Log out.

Data is stored in `backend/serenest.db` (SQLite). Open the site at **http://localhost:3000** (index.html, book.html, etc.) so form submits hit the same origin.

---

## Production

### 1. Environment

Copy `.env.example` to `.env` and set:

```env
NODE_ENV=production
PORT=3000

# Required to protect admin endpoints. Use a long random string.
ADMIN_SECRET=your-secret-here

# Your live site origin (e.g. https://serenest.in). Restricts CORS.
ALLOWED_ORIGIN=https://serenest.in
```

- **ADMIN_SECRET** — When set, admin routes require header `X-Admin-Key: <ADMIN_SECRET>` (or `?admin_key=<ADMIN_SECRET>`). Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- **ALLOWED_ORIGIN** — In production, set to your frontend origin so only your domain can call the API.

### 2. Security (built-in)

- **Helmet** — Security headers (X-Content-Type-Options, X-Frame-Options, etc.).
- **Rate limit** — 100 requests per 15 minutes per IP to `/api/*` in production (1000 in development).
- **CORS** — In production, only `ALLOWED_ORIGIN` is allowed when set.
- **Admin routes** — Return 401 unless `X-Admin-Key` matches `ADMIN_SECRET`.
- **Input** — All string fields trimmed and length-limited.

### 3. Run behind HTTPS (recommended)

Run the Node app on a private port (e.g. 3000) and put **nginx** (or another reverse proxy) in front with SSL:

```nginx
# Example nginx server block (SSL certs via Let's Encrypt or your provider)
server {
    listen 443 ssl http2;
    server_name serenest.in;

    ssl_certificate     /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

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

Then run the backend with `NODE_ENV=production` and `PORT=3000` (or match `proxy_pass`).

### 4. Process manager (PM2)

To keep the server running and restart on crash:

```bash
npm install -g pm2
cd backend
pm2 start server.js --name serenest
pm2 save
pm2 startup   # enable start on boot (follow its instructions)
```

Or use `ecosystem.config.cjs`:

```bash
pm2 start ecosystem.config.cjs
```

### 5. Database backup

SQLite DB file: `backend/serenest.db`. Back it up regularly (e.g. cron):

```bash
cp /path/to/backend/serenest.db /backups/serenest-$(date +%Y%m%d).db
```

### 6. OTP Login (SMS)

Patients can log in with their phone number:

1. Frontend calls `POST /api/otp/send` with `{ phone: "+919876543210" }`
2. A 6-digit OTP is sent via Twilio SMS
3. Frontend calls `POST /api/otp/verify` with `{ phone, code }` — returns a `token` on success
4. Frontend stores the token and sends it as `X-Patient-Token` header on protected routes

If no patient exists for that phone, one is auto-created.

Required env vars: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_SMS_FROM`

### 7. Google Login

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new **OAuth 2.0 Client ID** (Web application)
3. Add **Authorised redirect URI**: `https://serenest.in/api/auth/google/callback`
4. Copy **Client ID** and **Client Secret** into `.env`
5. Set `APP_BASE_URL=https://serenest.in` in `.env`

Flow:
- Patient clicks "Sign in with Google" → frontend navigates to `/api/auth/google`
- After consent, Google redirects to `/api/auth/google/callback`
- Server creates/links the patient account, then redirects to `/dashboard.html#token=<token>`
- Frontend reads the token from the URL fragment (`window.location.hash`)

Required env vars: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, `APP_BASE_URL`

### 8. Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Set a strong `ADMIN_SECRET` and use it for admin requests
- [ ] Set `ALLOWED_ORIGIN` to your live domain
- [ ] Serve the site over HTTPS (reverse proxy + SSL)
- [ ] Use PM2 or similar to keep the process running
- [ ] Back up `serenest.db` regularly
