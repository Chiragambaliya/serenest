/**
 * Visitor tracking — WhatsApp ping per new visitor/day, persisted traffic
 * analytics, and the Serenest Guide open beacon.
 *
 * Analytics persistence and unique-visitor pings require an explicit
 * `analytics_consent: true` flag (DPDP — consent before optional tracking).
 * Paths and referrers are sanitised so query strings and clinical URLs
 * never land in storage or team alerts.
 */
import { ok, err, requireDb, requireAdmin } from '../http.js';
import { supabase } from '../db.js';
import { notify } from '../notify.js';
import { hashFingerprint, isTruthyConsent, sanitizePath, sanitizeReferrer } from '../privacy.js';

// Daily-rotating sets — reset at midnight UTC. Values are hashed fingerprints.
let visitorDay   = new Date().toISOString().slice(0, 10);
let seenVisitors = new Set();
let seenAssistantOpens = new Set();

function rolloverIfNeeded() {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== visitorDay) {
    visitorDay   = today;
    seenVisitors = new Set();
    seenAssistantOpens = new Set();
  }
}

/** Classify a user-agent string into a coarse device type. */
function deviceFromUA(ua = '') {
  const s = ua.toLowerCase();
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/.test(s)) return 'tablet';
  if (/mobi|iphone|ipod|android.*mobile|windows phone/.test(s)) return 'mobile';
  return 'desktop';
}

function clientIp(req) {
  return (req.headers['x-forwarded-for']?.split(',')[0] || req.ip || '').trim();
}

export function registerTrackingRoutes(app) {
  /** POST /api/track/visit — records a visit only after analytics consent. */
  app.post('/api/track/visit', (req, res) => {
    rolloverIfNeeded();

    if (!isTruthyConsent(req.body?.analytics_consent)) {
      return ok(res, { unique: false, recorded: false });
    }

    const { vid, path = '/', referrer = '' } = req.body || {};
    const ip = clientIp(req);
    const ua = req.headers['user-agent'] || '';
    const device = deviceFromUA(ua);
    const country = (req.headers['cf-ipcountry'] || req.headers['x-vercel-ip-country'] || null);
    const safePath = sanitizePath(path);
    const safeRef = sanitizeReferrer(referrer);
    const visitorHash = hashFingerprint(vid || 'anon');

    if (supabase) {
      supabase.from('site_visits').insert({
        visitor_id: visitorHash,
        path: safePath,
        referrer: safeRef,
        device,
        country: country && country !== 'XX' ? country : null,
      }).then(({ error }) => {
        if (error) console.warn('[track/visit] insert:', error.message);
      });
    }

    const fp = hashFingerprint(`${vid || 'anon'}|${ip}`);
    if (seenVisitors.has(fp)) return ok(res, { unique: false, recorded: true });

    seenVisitors.add(fp);
    notify.siteVisitor({
      count: seenVisitors.size,
      path: safePath,
      referrer: safeRef || '',
    });

    return ok(res, { unique: true, recorded: true, total_today: seenVisitors.size });
  });

  /** POST /api/assistant/notify-open — Serenest Guide opened (team WhatsApp, deduped / day / visitor). */
  app.post('/api/assistant/notify-open', (req, res) => {
    rolloverIfNeeded();

    const { vid, path: pg = '/' } = req.body || {};
    const ip = clientIp(req);
    const fp = hashFingerprint(`guide|${vid || 'anon'}|${ip}`);
    if (seenAssistantOpens.has(fp)) return ok(res, { notified: false });

    seenAssistantOpens.add(fp);
    notify.serenestGuideOpened({ path: sanitizePath(typeof pg === 'string' ? pg : '/') });

    return ok(res, { notified: true });
  });

  /** GET /api/track/today — admin only — quick traffic count. */
  app.get('/api/track/today', (req, res) => {
    if (!requireAdmin(req, res)) return;
    rolloverIfNeeded();
    return ok(res, { date: visitorDay, unique_visitors: seenVisitors.size });
  });

  /** GET /api/track/stats — admin only — persisted traffic analytics. */
  app.get('/api/track/stats', async (req, res) => {
    if (!requireDb(res) || !requireAdmin(req, res)) return;

    const now = new Date();
    const since = (days) => new Date(now.getTime() - days * 86400000).toISOString();
    const startOfToday = new Date(now); startOfToday.setHours(0, 0, 0, 0);

    const { data: rows, error } = await supabase
      .from('site_visits')
      .select('created_at, visitor_id, path, referrer, device, country')
      .gte('created_at', since(30))
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[GET /api/track/stats]', error);
      return err(res, 'Failed to load traffic', 500);
    }

    const all = rows ?? [];
    const todayIso = startOfToday.toISOString();
    const weekIso = since(7);

    const inToday = all.filter((r) => r.created_at >= todayIso);
    const inWeek = all.filter((r) => r.created_at >= weekIso);

    const uniq = (list) => new Set(list.map((r) => r.visitor_id || r.created_at)).size;

    const tally = (list, key) => {
      const m = new Map();
      for (const r of list) {
        const v = r[key] || (key === 'referrer' ? 'Direct / none' : '—');
        m.set(v, (m.get(v) || 0) + 1);
      }
      return [...m.entries()].sort((a, b) => b[1] - a[1]);
    };

    const cleanRef = (r) => {
      if (!r) return 'Direct / none';
      try { return new URL(r).hostname.replace(/^www\./, ''); } catch { return r.slice(0, 60); }
    };
    const refList = inWeek.map((r) => ({ ...r, referrer: cleanRef(r.referrer) }));

    return ok(res, {
      totals: {
        today: inToday.length,
        today_unique: uniq(inToday),
        week: inWeek.length,
        week_unique: uniq(inWeek),
        month: all.length,
        month_unique: uniq(all),
      },
      top_pages: tally(inWeek, 'path').slice(0, 12),
      top_referrers: tally(refList, 'referrer').slice(0, 10),
      devices: tally(inWeek, 'device'),
      recent: all.slice(0, 40),
    });
  });
}
