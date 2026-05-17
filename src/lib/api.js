/**
 * Serenest API client
 * Calls the Express backend (/api/*) — never exposes server secrets.
 */

const BASE = import.meta.env.VITE_API_URL ?? '';

async function request(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body !== undefined) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);
  const raw = await res.text();
  let json;
  try {
    json = raw ? JSON.parse(raw) : {};
  } catch {
    json = {
      ok: false,
      error: res.ok
        ? 'Server returned an unexpected response. Please refresh and try again.'
        : `Request failed (${res.status}). Please try again in a few moments.`,
    };
  }

  if (!json.ok) {
    const error = new Error(json.error ?? 'Request failed');
    error.status = res.status;
    throw error;
  }
  return json;
}

const get  = (path)        => request('GET',   path);
const post = (path, body)  => request('POST',  path, body);
const patch = (path, body) => request('PATCH', path, body);

// ── Health ──────────────────────────────────────────────────
export const health = () => get('/api/health');

// ── Bookings ────────────────────────────────────────────────
export const bookings = {
  /**
   * Create a booking request.
   * @param {{ patient_name, patient_phone, patient_email?,
   *           practitioner_type, mode, preferred_date, preferred_time,
   *           language?, notes? }} data
   */
  create: (data) => post('/api/bookings', data),

  /** Get a single booking by ID. */
  get: (id) => get(`/api/bookings/${id}`),
};

// ── Screening ───────────────────────────────────────────────
export const screening = {
  /**
   * Save a completed self-screening (PHQ-9 + GAD-7).
   * @param {{ name, phone, email?,
   *           phq9_answers, phq9_score, phq9_severity,
   *           gad7_answers, gad7_score, gad7_severity,
   *           wants_callback?, reason? }} data
   */
  submit: (data) => post('/api/screening', data),
};

// ── Professionals ────────────────────────────────────────────
export const professionals = {
  /**
   * Submit a professional onboarding application.
   * @param {{ role, full_name, phone, email?, registration?,
   *           degree?, year?, council?, clinic?, city?,
   *           languages?, specialities?, fee_inr?,
   *           duration_min?, modes?, availability? }} data
   */
  apply: (data) => post('/api/professionals/apply', data),

  /** Public directory: approved professionals (sanitized fields). */
  directory: () => get('/api/professionals/directory'),
};

// ── Video rooms ──────────────────────────────────────────────
export const rooms = {
  /**
   * Create or fetch a Daily.co video room for an appointment.
   * The Daily API key stays on the server.
   * @param {string} appointmentId
   */
  create: (appointmentId) => post('/api/rooms', { appointment_id: appointmentId }),

  /** Get an existing room by appointment ID. */
  get: (appointmentId) => get(`/api/rooms/${appointmentId}`),
};

// ── Contact ─────────────────────────────────────────────────
export const contact = {
  /**
   * Send a contact / enquiry message.
   * @param {{ name, email?, phone?, subject?, message }} data
   */
  send: (data) => post('/api/contact', data),
};

export default { health, bookings, screening, professionals, rooms, contact };
