/**
 * Background jobs — social post publishing and appointment reminders.
 * Started once from the server entry point.
 */
import cron from 'node-cron';
import { supabase } from './db.js';
import { notify } from './notify.js';
import { publishPost } from './socialPoster.js';
import { runRetentionSweep } from './privacy.js';

function istDateString(offsetDays = 0) {
  return new Date(Date.now() + offsetDays * 86400000)
    .toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

export function startCronJobs() {
  // ─── Cron: publish due posts every minute ───────────────────────
  cron.schedule('* * * * *', async () => {
    if (!supabase) return;
    const { data: duePosts } = await supabase
      .from('social_posts')
      .select('*')
      .eq('status', 'scheduled')
      .lte('scheduled_at', new Date().toISOString())
      .limit(10);

    if (!duePosts?.length) return;

    for (const post of duePosts) {
      try {
        const result = await publishPost(post);
        const newStatus = result.errors.length === 0 ? 'posted'
          : (result.linkedin_post_id || result.instagram_post_id) ? 'partial' : 'failed';
        await supabase.from('social_posts').update({
          status: newStatus,
          posted_at: newStatus !== 'failed' ? new Date().toISOString() : null,
          linkedin_post_id: result.linkedin_post_id,
          instagram_post_id: result.instagram_post_id,
          error_message: result.errors.length ? result.errors.join(' | ') : null,
        }).eq('id', post.id);
        console.log(`[social-cron] ${post.platform} post ${post.id} → ${newStatus}`);
      } catch (e) {
        console.error(`[social-cron] post ${post.id} failed:`, e.message);
        await supabase.from('social_posts').update({
          status: 'failed', error_message: e.message,
        }).eq('id', post.id);
      }
    }
  });

  // ─── Cron: appointment reminders (~24h before a confirmed session) ──────
  // Every 15 minutes: email each confirmed appointment happening within the
  // next 24 hours whose reminder hasn't been sent (reminder_sent_at is null).
  // The flag is set only after Resend accepts the patient email, so transient
  // failures retry on the next tick. Requires the reminder_sent_at column
  // (supabase/migrations/2026_07_09_add_appointment_reminder_sent_at.sql).
  cron.schedule('4,19,34,49 * * * *', async () => {
    if (!supabase || !notify.isPatientEmailEnabled()) return;

    const { data: due, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('status', 'confirmed')
      .is('reminder_sent_at', null)
      .in('preferred_date', [istDateString(0), istDateString(1)])
      .limit(25);

    if (error) {
      // Most likely the migration hasn't been applied yet — warn, don't crash.
      console.warn('[reminder-cron] query failed (is reminder_sent_at migrated?):', error.message);
      return;
    }
    if (!due?.length) return;

    const now = Date.now();
    for (const b of due) {
      // Appointment times are IST wall-clock strings ("2026-07-10" + "13:00").
      const at = Date.parse(`${b.preferred_date}T${b.preferred_time || '09:00'}:00+05:30`);
      if (!Number.isFinite(at)) continue;
      const msUntil = at - now;
      if (msUntil <= 0 || msUntil > 24 * 3600000) continue; // only within the next 24h

      let professionalEmail = null;
      if (b.professional_id) {
        const { data: pro } = await supabase
          .from('professional_applications')
          .select('email')
          .eq('id', b.professional_id)
          .maybeSingle();
        professionalEmail = pro?.email ?? null;
      }

      try {
        const sent = await notify.appointmentReminder(b, { professionalEmail });
        if (sent) {
          await supabase.from('appointments')
            .update({ reminder_sent_at: new Date().toISOString() })
            .eq('id', b.id);
          console.log(`[reminder-cron] reminded ${b.id.slice(0, 8)} (${b.preferred_date} ${b.preferred_time})`);
        }
      } catch (e) {
        console.error(`[reminder-cron] ${b.id} failed:`, e.message);
      }
    }
  });

  // Daily 03:17 IST — anonymise / delete data past the published retention window.
  cron.schedule('17 3 * * *', async () => {
    try {
      await runRetentionSweep();
    } catch (e) {
      console.error('[privacy-retention] sweep failed:', e.message);
    }
  }, { timezone: 'Asia/Kolkata' });
}
