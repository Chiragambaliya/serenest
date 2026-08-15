/**
 * Contact / enquiry messages.
 */
import { ok, err } from '../http.js';
import { supabase } from '../db.js';
import { notify } from '../notify.js';

export function registerContactRoutes(app) {
  /**
   * POST /api/contact
   * Save a contact/enquiry message.
   */
  app.post('/api/contact', async (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    if (!name?.trim())    return err(res, 'name is required');
    if (!message?.trim()) return err(res, 'message is required');

    if (supabase) {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: name.trim(),
          email: email?.trim() || null,
          phone: phone?.trim() || null,
          subject: subject?.trim() || null,
          message: message.trim(),
        });

      if (error) {
        console.error('[POST /api/contact]', error);
        // Non-fatal — still return success so the user isn't blocked
      }
    }

    notify.contact({
      name:    name.trim(),
      email:   email?.trim() || null,
      phone:   phone?.trim() || null,
      subject: subject?.trim() || null,
      message: message.trim(),
    });

    return ok(res, { message: 'Message received. We will get back to you soon.' }, 201);
  });
}
