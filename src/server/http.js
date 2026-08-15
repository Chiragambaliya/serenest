/**
 * Shared HTTP helpers — the uniform `{ ok, ... }` / `{ ok:false, error }`
 * response envelope and the auth / precondition guards used by every route.
 */
import { supabase } from './db.js';

export function ok(res, data, status = 200) {
  return res.status(status).json({ ok: true, ...data });
}

export function err(res, message, status = 400) {
  return res.status(status).json({ ok: false, error: message });
}

/** Guard: database configured. Sends a 503 and returns false when missing. */
export function requireDb(res) {
  if (!supabase) {
    err(res, 'Database not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY.', 503);
    return false;
  }
  return true;
}

/** Guard: admin-only routes, authenticated via the x-admin-secret header. */
export function requireAdmin(req, res) {
  // Deny by default when ADMIN_SECRET isn't configured — otherwise
  // `undefined !== undefined` would let an unauthenticated request through.
  if (!process.env.ADMIN_SECRET || req.headers['x-admin-secret'] !== process.env.ADMIN_SECRET) {
    err(res, 'Unauthorized', 401);
    return false;
  }
  return true;
}

/** Extract a Bearer token from the Authorization header ('' when absent). */
export function bearer(req) {
  return (req.headers['authorization'] ?? '').replace(/^Bearer\s+/i, '');
}
