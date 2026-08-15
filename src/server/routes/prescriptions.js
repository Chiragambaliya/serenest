/**
 * Prescriptions — issue, send, and lock prescriptions for appointments.
 */
import { ok, err, requireDb, requireAdmin } from '../http.js';
import { supabase } from '../db.js';
import { notify } from '../notify.js';

export function registerPrescriptionRoutes(app) {
  /**
   * GET /api/prescriptions
   * Admin — list all issued prescriptions (newest first), with booking contact fields.
   * Must be registered before /:appointmentId so Express does not treat "list" as an id.
   */
  app.get('/api/prescriptions', async (req, res) => {
    if (!requireDb(res) || !requireAdmin(req, res)) return;

    const { data: rows, error } = await supabase
      .from('prescriptions')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(500);

    if (error) {
      console.error('[GET /api/prescriptions]', error);
      return err(res, 'Failed to load prescriptions', 500);
    }

    const prescriptions = rows || [];
    const appointmentIds = [...new Set(prescriptions.map((p) => p.appointment_id).filter(Boolean))];

    let bookingsById = {};
    if (appointmentIds.length) {
      const { data: bookings, error: bErr } = await supabase
        .from('appointments')
        .select('id, patient_name, patient_email, patient_phone, practitioner_type, mode, status, preferred_date, preferred_time')
        .in('id', appointmentIds);
      if (bErr) {
        console.error('[GET /api/prescriptions] bookings join', bErr);
      } else {
        bookingsById = Object.fromEntries((bookings || []).map((b) => [b.id, b]));
      }
    }

    const enriched = prescriptions.map((p) => {
      const booking = bookingsById[p.appointment_id] || null;
      const meds = Array.isArray(p.medicines) ? p.medicines : [];
      return {
        ...p,
        medicine_count: meds.filter((m) => m?.name).length,
        booking,
        view_path: `/consultation/${p.appointment_id}/prescription`,
      };
    });

    return ok(res, { prescriptions: enriched, count: enriched.length });
  });

  /**
   * GET /api/prescriptions/:appointmentId
   * Public — a patient opens this from their consultation room link.
   */
  app.get('/api/prescriptions/:appointmentId', async (req, res) => {
    if (!requireDb(res)) return;
    const appointmentId = String(req.params.appointmentId || '').trim();
    if (!appointmentId || appointmentId.length < 8) {
      return err(res, 'Invalid appointment reference', 400);
    }

    const { data, error } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('appointment_id', appointmentId)
      .maybeSingle();

    if (error) {
      console.error('[GET /api/prescriptions/:appointmentId]', error);
      return err(res, 'Failed to load prescription', 500);
    }
    return ok(res, { prescription: data ?? null });
  });

  /**
   * POST /api/prescriptions
   * Issue or update a prescription for an appointment (admin only).
   * Upserts on appointment_id — re-issuing replaces the previous draft
   * unless it has already been locked.
   *
   * Optional body flags:
   *   send: true  → email the patient a link to view/print the Rx (locks on success)
   *   lock: true  → lock after save (ignored when send is true and email fails)
   */
  app.post('/api/prescriptions', async (req, res) => {
    if (!requireDb(res) || !requireAdmin(req, res)) return;

    const { appointment_id, medicines = [], send = false, lock = false } = req.body;
    const shouldSend = Boolean(send);
    const wantLock = Boolean(lock);

    if (!appointment_id) return err(res, 'appointment_id is required');
    if (!Array.isArray(medicines) || medicines.length === 0) {
      return err(res, 'At least one medicine is required');
    }

    const { data: existing } = await supabase
      .from('prescriptions')
      .select('id, is_locked')
      .eq('appointment_id', appointment_id)
      .maybeSingle();

    if (existing?.is_locked) return err(res, 'This prescription is locked and cannot be changed', 409);

    // Whitelist of text fields accepted from the issue form.
    const TEXT_FIELDS = [
      'professional_name', 'patient_name', 'mode', 'advice', 'review_after',
      'patient_age_gender', 'patient_contact',
      'doctor_qualification', 'doctor_specialization', 'doctor_reg_no', 'doctor_contact',
      'chief_complaints', 'complaint_duration', 'history_summary',
      'provisional_diagnosis', 'risk_assessment', 'emergency_advice', 'important_notes',
      'clinic_name', 'clinic_address', 'clinic_contact', 'clinic_website',
    ];
    const row = {
      appointment_id,
      professional_id: req.body.professional_id || null,
      medicines,
      follow_up_date: req.body.follow_up_date || null,
      updated_at: new Date().toISOString(),
    };
    for (const f of TEXT_FIELDS) {
      row[f] = typeof req.body[f] === 'string' ? req.body[f].trim() || null : null;
    }

    const { data, error } = await supabase
      .from('prescriptions')
      .upsert(row, { onConflict: 'appointment_id' })
      .select()
      .single();

    if (error) {
      console.error('[POST /api/prescriptions]', error);
      return err(res, 'Failed to save prescription', 500);
    }

    let prescription = data;
    let sent = false;
    let patientEmail = null;
    let sendError = null;

    if (shouldSend) {
      const { data: booking } = await supabase
        .from('appointments')
        .select('id, patient_name, patient_email, patient_phone, practitioner_type, mode')
        .eq('id', appointment_id)
        .maybeSingle();

      patientEmail = booking?.patient_email?.trim() || null;

      if (!notify.isPatientEmailEnabled()) {
        sendError = 'Patient email is not configured (set RESEND_API_KEY)';
      } else if (!patientEmail) {
        sendError = 'This booking has no patient email — share the prescription link via WhatsApp instead';
      } else {
        sent = await notify.prescriptionIssued(booking || { id: appointment_id }, prescription);
        if (!sent) sendError = 'Email failed to send — try Re-send or share the link manually';
      }
    }

    // If send was requested, lock only after a successful email.
    // Otherwise honor an explicit lock flag (Lock only).
    const doLock = shouldSend ? sent : wantLock;
    if (doLock && prescription?.id) {
      const { data: locked, error: lockErr } = await supabase
        .from('prescriptions')
        .update({ is_locked: true, locked_at: new Date().toISOString() })
        .eq('id', prescription.id)
        .select()
        .single();
      if (lockErr) {
        console.error('[POST /api/prescriptions] lock after save', lockErr);
      } else {
        prescription = locked;
      }
    }

    return ok(res, {
      prescription,
      sent,
      locked: Boolean(prescription?.is_locked),
      patient_email: patientEmail,
      send_error: sendError,
      view_path: `/consultation/${appointment_id}/prescription`,
    }, 201);
  });

  /**
   * POST /api/prescriptions/:appointmentId/send
   * Re-send the existing prescription link to the patient (admin only).
   * Locks the prescription if it is still a draft.
   */
  app.post('/api/prescriptions/:appointmentId/send', async (req, res) => {
    if (!requireDb(res) || !requireAdmin(req, res)) return;

    const appointmentId = req.params.appointmentId;

    const { data: prescription, error } = await supabase
      .from('prescriptions')
      .select('*')
      .eq('appointment_id', appointmentId)
      .maybeSingle();

    if (error) {
      console.error('[POST /api/prescriptions/:appointmentId/send]', error);
      return err(res, 'Failed to load prescription', 500);
    }
    if (!prescription) return err(res, 'No prescription found for this appointment — save one first', 404);

    const { data: booking } = await supabase
      .from('appointments')
      .select('id, patient_name, patient_email, patient_phone, practitioner_type, mode')
      .eq('id', appointmentId)
      .maybeSingle();

    const patientEmail = booking?.patient_email?.trim() || null;
    if (!notify.isPatientEmailEnabled()) {
      return err(res, 'Patient email is not configured (set RESEND_API_KEY)', 503);
    }
    if (!patientEmail) {
      return err(res, 'This booking has no patient email — share the prescription link via WhatsApp instead', 400);
    }

    const sent = await notify.prescriptionIssued(booking || { id: appointmentId }, prescription);
    if (!sent) return err(res, 'Failed to send prescription email', 502);

    let lockedRx = prescription;
    if (!prescription.is_locked) {
      const { data: locked, error: lockErr } = await supabase
        .from('prescriptions')
        .update({ is_locked: true, locked_at: new Date().toISOString() })
        .eq('id', prescription.id)
        .select()
        .single();
      if (!lockErr && locked) lockedRx = locked;
    }

    return ok(res, {
      prescription: lockedRx,
      sent: true,
      locked: Boolean(lockedRx.is_locked),
      patient_email: patientEmail,
      view_path: `/consultation/${appointmentId}/prescription`,
    });
  });

  /**
   * PATCH /api/prescriptions/:id/lock
   * Lock a prescription so it can no longer be edited (admin only).
   */
  app.patch('/api/prescriptions/:id/lock', async (req, res) => {
    if (!requireDb(res) || !requireAdmin(req, res)) return;

    const { data, error } = await supabase
      .from('prescriptions')
      .update({ is_locked: true, locked_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return err(res, 'Failed to lock prescription', 500);
    return ok(res, { prescription: data });
  });
}
