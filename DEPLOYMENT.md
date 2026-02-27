# Serenest — Production deployment

## Quick start

1. **Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```
   Edit `.env`: set `NODE_ENV=production`, `ADMIN_SECRET` (random string), and `ALLOWED_ORIGIN` (your site URL, e.g. `https://serenest.in`).

2. **Run**
   ```bash
   npm start
   ```
   Or with PM2: `pm2 start ecosystem.config.cjs --env production`

3. **HTTPS** — Put nginx (or Caddy/Apache) in front with SSL; proxy `/api/` to the Node app. See `backend/README.md` for an nginx example.

## What runs where

- **Static site** — All HTML/CSS/JS (index.html, book.html, contact.html, etc.) are served by the same Node server from the project root, or you can serve them from nginx and point the frontend’s API calls to your backend URL.
- **API** — `POST /api/booking`, `/api/contact`, `/api/apply`; data is stored in `backend/serenest.db`.
- **Admin** — `GET /api/admin/bookings`, `/api/admin/contact`, `/api/admin/applications` are protected in production by the `X-Admin-Key` header (value = `ADMIN_SECRET`).

## Frontend and API on same domain (recommended)

Run the Node app; it serves both the static files and the API. Then in nginx, proxy the whole site to Node (or serve static with nginx and only proxy `/api` to Node). Either way, the forms use relative URLs (`/api/booking` etc.), so no frontend config is needed.

## If frontend and API are on different domains

Set `ALLOWED_ORIGIN` in `.env` to the frontend origin (e.g. `https://serenest.in`). If you ever host the frontend elsewhere (e.g. Vercel) and the API on a subdomain, you’d need to either:

- Set `ALLOWED_ORIGIN` to that frontend origin, and in the frontend set the API base (e.g. `https://api.serenest.in`) and use it in `fetch()`, or  
- Keep serving the frontend from the same Node app so everything stays same-origin.

## Checklist

- [ ] `backend/.env` created from `.env.example` with production values
- [ ] `ADMIN_SECRET` set and stored securely; use it for admin API calls
- [ ] `ALLOWED_ORIGIN` set to your public site URL
- [ ] Site served over HTTPS (reverse proxy + certificate)
- [ ] Backend run with PM2 or similar and set to start on boot
- [ ] Regular backups of `backend/serenest.db`
