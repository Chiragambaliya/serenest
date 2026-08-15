import { ok } from '../http.js';
import { supabase } from '../db.js';
import { GA_ID } from '../config.js';
import { paymentsEnabled } from '../payments.js';
import { notify } from '../notify.js';

export function registerHealthRoutes(app) {
  app.get('/api/health', (_req, res) => {
    ok(res, {
      status: 'ok',
      assistant: process.env.OPENAI_API_KEY ? 'configured' : 'disabled',
      db: supabase ? 'connected' : 'not configured',
      daily: process.env.DAILY_API_KEY ? 'configured' : 'not configured',
      notifications: notify.isConfigured() ? 'enabled' : 'disabled',
      patient_email: notify.isPatientEmailEnabled() ? 'enabled' : 'disabled',
      team_whatsapp: notify.hasTeamWhatsApp() ? 'enabled' : 'disabled',
      serenest_wa_group: notify.getSerenestWaGroupInvite() ? 'configured' : 'missing',
      payments: paymentsEnabled() ? 'enabled' : 'disabled',
      analytics: GA_ID ? 'enabled' : 'disabled',
      ts: new Date().toISOString(),
    });
  });
}
