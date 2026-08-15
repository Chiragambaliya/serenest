/**
 * Consultation session bootstrap — returns only the fields the video/chat
 * room needs. Patient contact and clinical notes stay off this response.
 */
import { ok, err } from '../http.js';
import { supabase } from '../db.js';
import { findAppointmentSession } from '../privacy.js';

export function registerConsultationRoutes(app) {
  /**
   * GET /api/consultations/:id
   * Public capability URL (UUID). Returns mode + thread key, never PII.
   */
  app.get('/api/consultations/:id', async (req, res) => {
    const id = String(req.params.id || '').trim();
    if (!id) return err(res, 'appointment id is required');

    if (!supabase) {
      return ok(res, {
        found: false,
        mode: 'video',
        thread_key: id,
      });
    }

    const appt = await findAppointmentSession(id);
    if (!appt) {
      return ok(res, {
        found: false,
        mode: 'video',
        thread_key: id,
      });
    }

    return ok(res, {
      found: true,
      mode: appt.mode || 'video',
      thread_key: appt.appointment_id || appt.id,
      room_url: appt.daily_room_url || null,
    });
  });
}
