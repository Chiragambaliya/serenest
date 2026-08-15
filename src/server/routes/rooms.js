/**
 * Video rooms (Daily.co). The Daily API key stays on the server — never
 * exposed to the browser.
 */
import { ok, err } from '../http.js';

const DAILY_URL = 'https://api.daily.co/v1';

export function registerRoomRoutes(app) {
  /**
   * POST /api/rooms
   * Create a Daily.co video room for an appointment.
   */
  app.post('/api/rooms', async (req, res) => {
    const { appointment_id } = req.body;
    if (!appointment_id) return err(res, 'appointment_id is required');

    const key = process.env.DAILY_API_KEY;
    if (!key) return err(res, 'Video rooms not configured on this server', 503);

    const roomName = `serenest-${appointment_id}`;

    // Return existing room if it already exists
    const checkRes = await fetch(`${DAILY_URL}/rooms/${roomName}`, {
      headers: { Authorization: `Bearer ${key}` },
    });

    if (checkRes.ok) {
      const existing = await checkRes.json();
      return ok(res, { room: existing });
    }

    // Create a new room (expires in 2 hours)
    const createRes = await fetch(`${DAILY_URL}/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        name: roomName,
        properties: {
          max_participants: 2,
          enable_chat: true,
          enable_screenshare: false,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2,
          eject_at_room_exp: true,
        },
      }),
    });

    if (!createRes.ok) {
      const detail = await createRes.text();
      console.error('[POST /api/rooms] Daily error:', detail);
      return err(res, 'Failed to create video room', 502);
    }

    const room = await createRes.json();
    return ok(res, { room }, 201);
  });

  /**
   * GET /api/rooms/:appointmentId
   * Get an existing Daily.co room by appointment ID.
   */
  app.get('/api/rooms/:appointmentId', async (req, res) => {
    const key = process.env.DAILY_API_KEY;
    if (!key) return err(res, 'Video rooms not configured on this server', 503);

    const roomName = `serenest-${req.params.appointmentId}`;
    const r = await fetch(`${DAILY_URL}/rooms/${roomName}`, {
      headers: { Authorization: `Bearer ${key}` },
    });

    if (!r.ok) return err(res, 'Room not found', 404);
    return ok(res, { room: await r.json() });
  });
}
