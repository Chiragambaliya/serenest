/**
 * Serenest server entry point.
 *
 * The backend lives in src/server/:
 *   app.js         Express app assembly (middleware → routes → SPA → errors)
 *   config.js      Paths + validated env-derived settings
 *   db.js          Supabase admin client
 *   http.js        Response envelope + auth guards
 *   middleware.js  Helmet, compression, rate limits, CORS, JSON parsing
 *   leads.js       Lead-capture safety nets (inbox / contact / JSONL)
 *   payments.js    Razorpay orders + signature verification
 *   cron.js        Social publishing + appointment-reminder jobs
 *   spa.js         Static assets + SEO-injected SPA fallback
 *   routes/        One module per API domain
 */
import 'dotenv/config';
import { createApp } from './src/server/app.js';
import { startCronJobs } from './src/server/cron.js';
import { PORT, GA_ID, FALLBACK_LEADS_FILE } from './src/server/config.js';
import { supabase } from './src/server/db.js';
import { paymentsEnabled } from './src/server/payments.js';
import { notify } from './src/server/notify.js';

const app = createApp();
startCronJobs();

app.listen(PORT, () => {
  console.log(`\n🟢 Serenest server running on http://localhost:${PORT}`);
  console.log(`   DB:    ${supabase ? '✅ Supabase connected' : '⚠️  Not configured (set SUPABASE_URL + SUPABASE_SERVICE_KEY)'}`);
  console.log(`   Video: ${process.env.DAILY_API_KEY ? '✅ Daily.co configured' : '⚠️  Not configured (set DAILY_API_KEY)'}`);
  console.log(`   Admin: ${process.env.ADMIN_SECRET ? '✅ Secret set' : '⚠️  Not configured (set ADMIN_SECRET)'}`);
  console.log(`   Alert: ${notify.isConfigured() ? '✅ Team email (Resend)' : '⚠️  Team email incomplete'} (RESEND_API_KEY + NOTIFY_EMAIL)`);
  console.log(`   Patient email: ${notify.isPatientEmailEnabled() ? '✅ Resend key set' : '⚠️  Add RESEND_API_KEY for confirmations'}`);
  console.log(`   Team WhatsApp: ${notify.hasTeamWhatsApp() ? '✅ CallMeBot configured' : '○ Optional: CALLMEBOT_WHATSAPP_APIKEY + CALLMEBOT_WHATSAPP_PHONE'}`);
  console.log(`   Payments: ${paymentsEnabled() ? '✅ Razorpay enabled' : '○ Disabled (set RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET)'}`);
  console.log(`   Analytics: ${GA_ID ? `✅ GA4 (${GA_ID})` : '○ Disabled (set GA_MEASUREMENT_ID)'}\n`);

  // Lead-pipeline warnings — these misconfigurations are the ones that
  // silently cost clients, so make them impossible to miss in the logs.
  if (!supabase) {
    console.warn('🚨 LEADS AT RISK: database not configured. Bookings and screenings are being');
    console.warn(`   captured to ${FALLBACK_LEADS_FILE} only (lost on redeploy).`);
    console.warn('   Set SUPABASE_URL + SUPABASE_SERVICE_KEY in your hosting dashboard.\n');
  }
  if (!notify.isConfigured() && !notify.hasTeamWhatsApp()) {
    console.warn('🚨 NO LEAD ALERTS: neither team email (RESEND_API_KEY + NOTIFY_EMAIL) nor');
    console.warn('   WhatsApp (CALLMEBOT_*) is configured. New bookings will NOT notify anyone —');
    console.warn('   you would only see them by opening /admin.\n');
  }
});
