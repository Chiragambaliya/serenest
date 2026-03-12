require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const https = require('https');
const crypto = require('crypto');
const { db, initDb } = require('./db');

// Static root: if server runs from repo root (e.g. Render), use __dirname; else backend/ -> use parent
const staticRoot = fs.existsSync(path.join(__dirname, 'index.html'))
  ? __dirname
  : path.join(__dirname, '..');

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProd = NODE_ENV === 'production';
const ADMIN_SECRET = process.env.ADMIN_SECRET || '';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || null;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM || ''; // e.g. whatsapp:+14155238886
const TWILIO_WHATSAPP_TO = process.env.TWILIO_WHATSAPP_TO || '';     // e.g. whatsapp:+919876543210
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const BOOKING_FROM_EMAIL = process.env.BOOKING_FROM_EMAIL || '';     // e.g. Serenest <bookings@serenest.in>
const BOOKING_VIDEO_LINK = process.env.BOOKING_VIDEO_LINK || '';     // default "Join video call" link
const CRON_SECRET = process.env.CRON_SECRET || '';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || '';
const APP_BASE_URL = process.env.APP_BASE_URL || 'http://localhost:3000';

const app = express();

if (isProd) {
  app.set('trust proxy', 1);
}

initDb();

// ——— Security & middleware ———
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(cors({
  origin: isProd && ALLOWED_ORIGIN ? ALLOWED_ORIGIN : true,
  credentials: true
}));

app.use(express.json({ limit: '100kb' }));

// Rate limit API (per IP)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProd ? 100 : 1000,
  message: { ok: false, error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', apiLimiter);

// Serve static frontend from project root
app.use(express.static(staticRoot, {
  maxAge: isProd ? '1d' : 0,
  etag: true
}));

// Landing page: / serves index.html. Clean URLs: /patients -> patients.html
app.get('*', (req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api')) return next();
  if (req.path.includes('.')) return next(); // already has extension
  const base = req.path === '/' ? '/index' : req.path; // index.html is the landing page
  const htmlPath = path.join(staticRoot, base + '.html');
  if (fs.existsSync(htmlPath)) return res.sendFile(htmlPath);
  next();
});

// 404 fallback: serve 404.html for missing frontend routes (not API)
app.get('*', (req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api')) return next();
  const notFoundPath = path.join(staticRoot, '404.html');
  if (fs.existsSync(notFoundPath)) res.status(404).sendFile(notFoundPath);
  else res.status(404).send('Page not found');
});

// ——— Helpers ———
function trimStr(val) {
  return typeof val === 'string' ? val.trim().slice(0, 2000) : '';
}

function requireAdmin(req, res, next) {
  if (!isProd || !ADMIN_SECRET) {
    return next();
  }
  const key = req.get('X-Admin-Key') || req.query.admin_key || '';
  if (key !== ADMIN_SECRET) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }
  next();
}

function requirePatient(req, res, next) {
  const token = req.get('X-Patient-Token') || req.query.token || '';
  if (!token) {
    return res.status(401).json({ ok: false, error: 'Login required' });
  }
  const row = db.prepare('SELECT patient_id FROM sessions WHERE token = ? AND datetime(expires_at) > datetime("now")').get(token);
  if (!row) {
    return res.status(401).json({ ok: false, error: 'Session expired. Please log in again.' });
  }
  req.patientId = row.patient_id;
  next();
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return salt + ':' + hash;
}
function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const v = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return v === hash;
}

// Notify you via Telegram when someone visits (no extra deps)
function sendTelegramMessage(text) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  const body = JSON.stringify({
    chat_id: TELEGRAM_CHAT_ID,
    text: text,
    disable_web_page_preview: true
  });
  const req = https.request({
    hostname: 'api.telegram.org',
    path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
  }, () => {});
  req.on('error', () => {});
  req.write(body);
  req.end();
}

// Notify you via WhatsApp (Twilio) when someone visits
function sendWhatsAppMessage(text) {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM || !TWILIO_WHATSAPP_TO) return;
  const body = new URLSearchParams({
    To: TWILIO_WHATSAPP_TO,
    From: TWILIO_WHATSAPP_FROM,
    Body: text
  }).toString();
  const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');
  const req = https.request({
    hostname: 'api.twilio.com',
    path: `/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(body),
      'Authorization': `Basic ${auth}`
    }
  }, () => {});
  req.on('error', () => {});
  req.write(body);
  req.end();
}

// Send email via Resend (booking confirmation to patient)
function sendResendEmail(to, subject, html) {
  if (!RESEND_API_KEY || !BOOKING_FROM_EMAIL || !to) return;
  const body = JSON.stringify({
    from: BOOKING_FROM_EMAIL,
    to: [to],
    subject: subject,
    html: html
  });
  const req = https.request({
    hostname: 'api.resend.com',
    path: '/emails',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + RESEND_API_KEY,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    }
  }, () => {});
  req.on('error', () => {});
  req.write(body);
  req.end();
}

function sendBookingEmails(booking) {
  const name = [booking.first_name, booking.last_name].filter(Boolean).join(' ') || 'Patient';
  const dateTime = booking.preferred_date + ' ' + (booking.time_slot || '');
  const adminMsg = '📅 New booking\n' + name + '\n' + booking.email + '\n' + booking.specialist + '\n' + dateTime;
  sendTelegramMessage(adminMsg);
  sendWhatsAppMessage(adminMsg);

  const html = '<!DOCTYPE html><html><body style="font-family:sans-serif;line-height:1.6;color:#333;max-width:560px;margin:0 auto;padding:24px;">' +
    '<h2 style="color:#4A6B50;">Booking received — Serenest</h2>' +
    '<p>Hi ' + escapeHtml(booking.first_name) + ',</p>' +
    '<p>We have received your booking request.</p>' +
    '<p><strong>Details:</strong></p>' +
    '<ul><li>Specialist: ' + escapeHtml(booking.specialist) + '</li>' +
    '<li>Session: ' + escapeHtml(booking.session_type) + '</li>' +
    '<li>Preferred date: ' + escapeHtml(booking.preferred_date) + '</li>' +
    '<li>Time slot: ' + escapeHtml(booking.time_slot) + '</li></ul>' +
    '<p>We will confirm your appointment shortly. If you have any questions, reply to this email or contact us.</p>' +
    '<p>— Serenest</p></body></html>';
  sendResendEmail(booking.email, 'Booking received — Serenest', html);
}

function escapeHtml(s) {
  if (s == null) return '';
  const str = String(s);
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ——— API Routes ———

// Public: get available slots for a date (optional specialist filter)
app.get('/api/slots', (req, res) => {
  try {
    const date = trimStr(req.query.date).slice(0, 10);
    const specialist = trimStr(req.query.specialist).slice(0, 200);
    if (!date) return res.status(400).json({ ok: false, error: 'Date required (YYYY-MM-DD)' });
    let sql = `
      SELECT s.id, s.specialist, s.slot_date, s.slot_time
      FROM slots s
      WHERE s.slot_date = ?
      AND NOT EXISTS (
        SELECT 1 FROM bookings b
        WHERE b.specialist = s.specialist AND b.preferred_date = s.slot_date AND b.time_slot = s.slot_time
      )
    `;
    const params = [date];
    if (specialist) {
      sql += ' AND s.specialist = ?';
      params.push(specialist);
    }
    sql += ' ORDER BY s.slot_time';
    const rows = db.prepare(sql).all(...params);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/booking', (req, res) => {
  try {
    const first_name = trimStr(req.body.first_name);
    const last_name = trimStr(req.body.last_name);
    const email = trimStr(req.body.email).slice(0, 320);
    const phone = trimStr(req.body.phone).slice(0, 32);
    const specialist = trimStr(req.body.specialist).slice(0, 200);
    const session_type = trimStr(req.body.session_type).slice(0, 50);
    const preferred_date = trimStr(req.body.preferred_date).slice(0, 20);
    const time_slot = trimStr(req.body.time_slot).slice(0, 50);
    const notes = trimStr(req.body.notes);
    let patient_id = null;
    const token = req.get('X-Patient-Token') || req.body.token || '';
    if (token) {
      const session = db.prepare('SELECT patient_id FROM sessions WHERE token = ? AND datetime(expires_at) > datetime("now")').get(token);
      if (session) patient_id = session.patient_id;
    }
    const video_link = trimStr(req.body.video_link).slice(0, 500) || BOOKING_VIDEO_LINK.slice(0, 500) || null;

    if (!first_name || !last_name || !email || !phone || !specialist || !session_type || !preferred_date || !time_slot) {
      return res.status(400).json({ ok: false, error: 'Missing required fields' });
    }

    const stmt = db.prepare(`
      INSERT INTO bookings (first_name, last_name, email, phone, specialist, session_type, preferred_date, time_slot, notes, payment_id, video_link, patient_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(first_name, last_name, email, phone, specialist, session_type, preferred_date, time_slot, notes || null, null, video_link || null, Number.isFinite(patient_id) ? patient_id : null);

    const booking = { first_name, last_name, email, phone, specialist, session_type, preferred_date, time_slot, notes };
    setImmediate(() => sendBookingEmails(booking));

    res.status(201).json({
      ok: true,
      message: 'Booking received. We will confirm by email.',
      video_link: video_link || BOOKING_VIDEO_LINK || null
    });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ ok: false, error: 'Could not save booking. Please try again.' });
  }
});

app.post('/api/contact', (req, res) => {
  try {
    const first_name = trimStr(req.body.first_name);
    const last_name = trimStr(req.body.last_name);
    const email = trimStr(req.body.email).slice(0, 320);
    const phone = trimStr(req.body.phone).slice(0, 32);
    const reaching_out_as = trimStr(req.body.reaching_out_as).slice(0, 100);
    const subject = trimStr(req.body.subject).slice(0, 100);
    const message = trimStr(req.body.message);

    if (!first_name || !last_name || !email || !message) {
      return res.status(400).json({ ok: false, error: 'Missing required fields' });
    }

    const stmt = db.prepare(`
      INSERT INTO contact_messages (first_name, last_name, email, phone, reaching_out_as, subject, message)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(first_name, last_name, email, phone || null, reaching_out_as || null, subject || null, message);

    res.status(201).json({ ok: true, message: 'Message received. We will get back to you within one business day.' });
  } catch (err) {
    console.error('Contact error:', err);
    res.status(500).json({ ok: false, error: 'Could not send message. Please try again.' });
  }
});

app.post('/api/apply', (req, res) => {
  try {
    const first_name = trimStr(req.body.first_name);
    const last_name = trimStr(req.body.last_name);
    const email = trimStr(req.body.email).slice(0, 320);
    const phone = trimStr(req.body.phone).slice(0, 32);
    const specialty = trimStr(req.body.specialty).slice(0, 100);
    const years_experience = trimStr(req.body.years_experience).slice(0, 50);
    const introduction = trimStr(req.body.introduction);

    if (!first_name || !last_name || !email || !phone || !specialty || !years_experience) {
      return res.status(400).json({ ok: false, error: 'Missing required fields' });
    }

    const stmt = db.prepare(`
      INSERT INTO doctor_applications (first_name, last_name, email, phone, specialty, years_experience, introduction)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(first_name, last_name, email, phone, specialty, years_experience, introduction || null);

    res.status(201).json({ ok: true, message: 'Application received. We will review and get back within 3-5 business days.' });
  } catch (err) {
    console.error('Apply error:', err);
    res.status(500).json({ ok: false, error: 'Could not submit application. Please try again.' });
  }
});

// Admin routes (protected in production when ADMIN_SECRET is set)
app.get('/api/admin/bookings', requireAdmin, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all();
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/api/admin/contact', requireAdmin, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all();
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/api/admin/applications', requireAdmin, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM doctor_applications ORDER BY created_at DESC').all();
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/newsletter', (req, res) => {
  try {
    const raw = typeof req.body.email === 'string' ? req.body.email.trim() : '';
    const email = raw.slice(0, 320);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ ok: false, error: 'Please enter a valid email address.' });
    }
    const stmt = db.prepare('INSERT INTO newsletter_subscribers (email) VALUES (?)');
    stmt.run(email);
    res.status(201).json({ ok: true, message: "You're subscribed. We'll send you our next update." });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(200).json({ ok: true, message: 'This email is already subscribed.' });
    }
    console.error('Newsletter error:', err);
    res.status(500).json({ ok: false, error: 'Could not subscribe. Please try again.' });
  }
});

app.get('/api/admin/newsletter', requireAdmin, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM newsletter_subscribers ORDER BY created_at DESC').all();
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/grievance', (req, res) => {
  try {
    const first_name = trimStr(req.body.first_name);
    const last_name = trimStr(req.body.last_name);
    const email = trimStr(req.body.email).slice(0, 320);
    const phone = trimStr(req.body.phone).slice(0, 32);
    const subject = trimStr(req.body.subject).slice(0, 200);
    const message = trimStr(req.body.message);

    if (!first_name || !last_name || !email || !message) {
      return res.status(400).json({ ok: false, error: 'Please fill in name, email, and your grievance message.' });
    }

    const stmt = db.prepare(`
      INSERT INTO grievances (first_name, last_name, email, phone, subject, message)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(first_name, last_name, email, phone || null, subject || null, message);

    res.status(201).json({ ok: true, message: 'Your grievance has been submitted. We will acknowledge within 3 working days.' });
  } catch (err) {
    console.error('Grievance error:', err);
    res.status(500).json({ ok: false, error: 'Could not submit. Please try again or email us.' });
  }
});

app.get('/api/admin/grievances', requireAdmin, (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM grievances ORDER BY created_at DESC').all();
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/api/admin/analytics', requireAdmin, (req, res) => {
  try {
    const visitsTotal = db.prepare('SELECT COUNT(*) as n FROM visits').get().n;
    const bookingsThisMonth = db.prepare(`
      SELECT COUNT(*) as n FROM bookings
      WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')
    `).get().n;
    const topPages = db.prepare(`
      SELECT page, COUNT(*) as count FROM visits
      GROUP BY page ORDER BY count DESC LIMIT 20
    `).all();
    res.json({ ok: true, data: { visitsTotal, bookingsThisMonth, topPages } });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ——— Slots (admin) ———
app.get('/api/admin/slots', requireAdmin, (req, res) => {
  try {
    const date = trimStr(req.query.date).slice(0, 10);
    let sql = 'SELECT * FROM slots';
    const params = [];
    if (date) {
      sql += ' WHERE slot_date = ?';
      params.push(date);
    }
    sql += ' ORDER BY slot_date DESC, slot_time LIMIT 500';
    const rows = db.prepare(sql).all(...params);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/admin/slots', requireAdmin, (req, res) => {
  try {
    const specialist = trimStr(req.body.specialist).slice(0, 200);
    const slot_date = trimStr(req.body.slot_date).slice(0, 10);
    const slot_time = trimStr(req.body.slot_time).slice(0, 50);
    if (!specialist || !slot_date || !slot_time) {
      return res.status(400).json({ ok: false, error: 'Specialist, date and time required.' });
    }
    db.prepare('INSERT INTO slots (specialist, slot_date, slot_time) VALUES (?, ?, ?)').run(specialist, slot_date, slot_time);
    const row = db.prepare('SELECT * FROM slots WHERE id = last_insert_rowid()').get();
    res.status(201).json({ ok: true, slot: row });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.delete('/api/admin/slots/:id', requireAdmin, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ ok: false, error: 'Invalid id' });
    const stmt = db.prepare('DELETE FROM slots WHERE id = ?');
    const info = stmt.run(id);
    if (info.changes === 0) return res.status(404).json({ ok: false, error: 'Slot not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ——— Specialists (doctors) ———
app.get('/api/specialists', (req, res) => {
  try {
    const rows = db.prepare('SELECT id, name, display_order FROM specialists ORDER BY display_order ASC, name ASC').all();
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/admin/specialists', requireAdmin, (req, res) => {
  try {
    const name = trimStr(req.body.name).slice(0, 200);
    if (!name) return res.status(400).json({ ok: false, error: 'Name is required.' });
    const maxOrder = db.prepare('SELECT COALESCE(MAX(display_order), -1) + 1 AS next_order FROM specialists').get();
    const nextOrder = maxOrder && Number.isFinite(maxOrder.next_order) ? maxOrder.next_order : 0;
    db.prepare('INSERT INTO specialists (name, display_order) VALUES (?, ?)').run(name, nextOrder);
    const row = db.prepare('SELECT * FROM specialists WHERE id = last_insert_rowid()').get();
    res.status(201).json({ ok: true, specialist: row });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

function deleteSpecialistById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ ok: false, error: 'Invalid id' });
    const info = db.prepare('DELETE FROM specialists WHERE id = ?').run(id);
    if (info.changes === 0) return res.status(404).json({ ok: false, error: 'Specialist not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}

app.delete('/api/admin/specialists/:id', requireAdmin, deleteSpecialistById);

// DELETE by id (for admin panel) — use /api/admin/specialists/:id instead
// This route is kept for backwards-compat but routes by numeric id only
app.delete('/api/specialists/:id', requireAdmin, (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isFinite(id)) {
    return deleteSpecialistById(req, res);
  }
  // If not a number, treat as a name (URL-encoded)
  try {
    const name = decodeURIComponent(req.params.id || '').trim().slice(0, 200);
    if (!name) return res.status(400).json({ ok: false, error: 'Name or numeric id required.' });
    const info = db.prepare('DELETE FROM specialists WHERE name = ?').run(name);
    if (info.changes === 0) return res.status(404).json({ ok: false, error: 'Specialist not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ——— Blog (public + admin) ———
app.get('/api/posts', (req, res) => {
  try {
    const slug = trimStr(req.query.slug);
    if (slug) {
      const row = db.prepare('SELECT * FROM posts WHERE slug = ?').get(slug);
      if (!row) return res.status(404).json({ ok: false, error: 'Post not found' });
      return res.json({ ok: true, post: row });
    }
    const rows = db.prepare(`
      SELECT id, title, slug, excerpt, category, author_name, created_at
      FROM posts ORDER BY created_at DESC
    `).all();
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/api/posts/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ ok: false, error: 'Invalid id' });
    const row = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
    if (!row) return res.status(404).json({ ok: false, error: 'Post not found' });
    res.json({ ok: true, post: row });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/admin/posts', requireAdmin, (req, res) => {
  try {
    const title = trimStr(req.body.title);
    const slug = trimStr(req.body.slug).replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'post';
    const excerpt = trimStr(req.body.excerpt);
    const body = typeof req.body.body === 'string' ? req.body.body : '';
    const category = trimStr(req.body.category).slice(0, 100);
    const author_name = trimStr(req.body.author_name).slice(0, 200);

    if (!title || !body) return res.status(400).json({ ok: false, error: 'Title and body are required.' });

    const stmt = db.prepare(`
      INSERT INTO posts (title, slug, excerpt, body, category, author_name)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(title, slug, excerpt, body, category || null, author_name || null);
    const row = db.prepare('SELECT * FROM posts WHERE id = last_insert_rowid()').get();
    res.status(201).json({ ok: true, post: row });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') return res.status(400).json({ ok: false, error: 'Slug already in use.' });
    console.error('Post create error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.put('/api/admin/posts/:id', requireAdmin, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ ok: false, error: 'Invalid id' });
    const existing = db.prepare('SELECT slug FROM posts WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ ok: false, error: 'Post not found' });
    const title = trimStr(req.body.title);
    let slug = trimStr(req.body.slug).replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (!slug) slug = existing.slug;
    const excerpt = trimStr(req.body.excerpt);
    const body = typeof req.body.body === 'string' ? req.body.body : '';
    const category = trimStr(req.body.category).slice(0, 100);
    const author_name = trimStr(req.body.author_name).slice(0, 200);

    if (!title || !body) return res.status(400).json({ ok: false, error: 'Title and body are required.' });

    const stmt = db.prepare(`
      UPDATE posts SET title = ?, slug = ?, excerpt = ?, body = ?, category = ?, author_name = ?, updated_at = datetime('now')
      WHERE id = ?
    `);
    const info = stmt.run(title, slug, excerpt, body, category || null, author_name || null, id);
    if (info.changes === 0) return res.status(404).json({ ok: false, error: 'Post not found' });
    const row = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
    res.json({ ok: true, post: row });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') return res.status(400).json({ ok: false, error: 'Slug already in use.' });
    console.error('Post update error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.delete('/api/admin/posts/:id', requireAdmin, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ ok: false, error: 'Invalid id' });
    const stmt = db.prepare('DELETE FROM posts WHERE id = ?');
    const info = stmt.run(id);
    if (info.changes === 0) return res.status(404).json({ ok: false, error: 'Post not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ——— Reviews ———
app.get('/api/reviews', (req, res) => {
  try {
    const specialist = trimStr(req.query.specialist).slice(0, 200);
    let sql = 'SELECT id, specialist_name, rating, comment, patient_name, created_at FROM reviews ORDER BY created_at DESC';
    const params = [];
    if (specialist) {
      sql = 'SELECT id, specialist_name, rating, comment, patient_name, created_at FROM reviews WHERE specialist_name = ? ORDER BY created_at DESC';
      params.push(specialist);
    }
    const rows = db.prepare(sql).all(...params);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/reviews', requirePatient, (req, res) => {
  try {
    const specialist_name = trimStr(req.body.specialist_name).slice(0, 200);
    const rating = parseInt(req.body.rating, 10);
    const comment = trimStr(req.body.comment).slice(0, 2000);
    const patient_name = trimStr(req.body.patient_name).slice(0, 200);
    if (!specialist_name || !Number.isFinite(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ ok: false, error: 'Specialist name and rating (1–5) required.' });
    }
    db.prepare('INSERT INTO reviews (specialist_name, rating, comment, patient_name) VALUES (?, ?, ?, ?)').run(specialist_name, rating, comment || null, patient_name || null);
    res.status(201).json({ ok: true, message: 'Thank you for your feedback.' });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ——— Patient auth ———
app.post('/api/signup', (req, res) => {
  try {
    const email = (trimStr(req.body.email) || '').toLowerCase().slice(0, 320);
    const password = req.body.password;
    const full_name = trimStr(req.body.full_name).slice(0, 200);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ ok: false, error: 'Valid email required.' });
    if (!password || typeof password !== 'string' || password.length < 8) return res.status(400).json({ ok: false, error: 'Password must be at least 8 characters.' });
    const password_hash = hashPassword(password);
    db.prepare('INSERT INTO patients (email, password_hash, full_name) VALUES (?, ?, ?)').run(email, password_hash, full_name || null);
    const row = db.prepare('SELECT id, email, full_name, created_at FROM patients WHERE id = last_insert_rowid()').get();
    res.status(201).json({ ok: true, patient: row });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') return res.status(400).json({ ok: false, error: 'This email is already registered.' });
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/login', (req, res) => {
  try {
    const email = (trimStr(req.body.email) || '').toLowerCase().slice(0, 320);
    const password = req.body.password;
    const patient = db.prepare('SELECT id, email, password_hash, full_name FROM patients WHERE email = ?').get(email);
    if (!patient || !verifyPassword(password, patient.password_hash)) {
      return res.status(401).json({ ok: false, error: 'Invalid email or password.' });
    }
    const token = crypto.randomBytes(32).toString('hex');
    const expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    db.prepare('INSERT INTO sessions (patient_id, token, expires_at) VALUES (?, ?, ?)').run(patient.id, token, expires_at);
    res.json({ ok: true, token, patient: { id: patient.id, email: patient.email, full_name: patient.full_name } });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/api/me', requirePatient, (req, res) => {
  try {
    const p = db.prepare('SELECT id, email, full_name, phone, avatar_url, email_verified, created_at FROM patients WHERE id = ?').get(req.patientId);
    if (!p) return res.status(404).json({ ok: false, error: 'Not found' });
    res.json({ ok: true, patient: p });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.put('/api/me', requirePatient, (req, res) => {
  try {
    const full_name = trimStr(req.body.full_name).slice(0, 200);
    const phone = trimStr(req.body.phone || '').slice(0, 20);
    db.prepare('UPDATE patients SET full_name = ?, phone = ? WHERE id = ?').run(full_name || null, phone || null, req.patientId);
    const p = db.prepare('SELECT id, email, full_name, phone, avatar_url, email_verified, created_at FROM patients WHERE id = ?').get(req.patientId);
    res.json({ ok: true, patient: p });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/me/change-password', requirePatient, (req, res) => {
  try {
    const current = req.body.current_password;
    const newPassword = req.body.new_password;
    if (!current || !newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      return res.status(400).json({ ok: false, error: 'Current password and new password (min 8 characters) required.' });
    }
    const patient = db.prepare('SELECT password_hash FROM patients WHERE id = ?').get(req.patientId);
    if (!patient || !verifyPassword(current, patient.password_hash)) {
      return res.status(401).json({ ok: false, error: 'Current password is incorrect.' });
    }
    const password_hash = hashPassword(newPassword);
    db.prepare('UPDATE patients SET password_hash = ? WHERE id = ?').run(password_hash, req.patientId);
    res.json({ ok: true, message: 'Password updated.' });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/logout', requirePatient, (req, res) => {
  try {
    const token = req.get('X-Patient-Token') || req.query.token || '';
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    res.json({ ok: true, message: 'Logged out.' });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/api/me/bookings', requirePatient, (req, res) => {
  try {
    const rows = db.prepare('SELECT id, specialist, session_type, preferred_date, time_slot, video_link, status, confirmed_at, created_at FROM bookings WHERE patient_id = ? ORDER BY created_at DESC').all(req.patientId);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Patient: cancel their own booking
app.delete('/api/me/bookings/:id', requirePatient, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ ok: false, error: 'Invalid id' });
    const booking = db.prepare('SELECT id, patient_id, status FROM bookings WHERE id = ? AND patient_id = ?').get(id, req.patientId);
    if (!booking) return res.status(404).json({ ok: false, error: 'Booking not found.' });
    if (booking.status === 'confirmed') return res.status(400).json({ ok: false, error: 'Confirmed bookings cannot be cancelled. Please contact us.' });
    db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run('cancelled', id);
    res.json({ ok: true, message: 'Booking cancelled.' });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ——— Forgot / Reset password ———

app.post('/api/forgot-password', async (req, res) => {
  try {
    const email = (trimStr(req.body.email) || '').toLowerCase().slice(0, 320);
    if (!email) return res.status(400).json({ ok: false, error: 'Email is required.' });
    const patient = db.prepare('SELECT id, full_name FROM patients WHERE email = ?').get(email);
    // Always respond ok to prevent email enumeration
    if (!patient) return res.json({ ok: true, message: 'If an account exists, a reset link has been sent.' });

    // Invalidate old tokens
    db.prepare('UPDATE password_reset_tokens SET used = 1 WHERE patient_id = ? AND used = 0').run(patient.id);

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
    db.prepare('INSERT INTO password_reset_tokens (patient_id, token, expires_at) VALUES (?, ?, ?)').run(patient.id, token, expiresAt);

    const resetUrl = `${APP_BASE_URL}/reset-password.html?token=${token}`;
    const html = `<!DOCTYPE html><html><body style="font-family:sans-serif;line-height:1.6;color:#333;max-width:560px;margin:0 auto;padding:24px;">
      <h2 style="color:#4A6B50;">Reset your password — Serenest</h2>
      <p>Hi ${escapeHtml(patient.full_name || 'there')},</p>
      <p>Click below to reset your password. This link expires in 1 hour.</p>
      <p><a href="${resetUrl}" style="display:inline-block;background:#4A6B50;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">Reset Password</a></p>
      <p>If you didn't request this, you can safely ignore this email.</p>
      <p>— Serenest</p></body></html>`;
    sendResendEmail(email, 'Reset your Serenest password', html);

    res.json({ ok: true, message: 'If an account exists, a reset link has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/reset-password', (req, res) => {
  try {
    const token = trimStr(req.body.token).slice(0, 100);
    const newPassword = req.body.new_password;
    if (!token || !newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      return res.status(400).json({ ok: false, error: 'Token and new password (min 8 characters) required.' });
    }
    const row = db.prepare(
      `SELECT id, patient_id FROM password_reset_tokens WHERE token = ? AND used = 0 AND datetime(expires_at) > datetime('now')`
    ).get(token);
    if (!row) return res.status(400).json({ ok: false, error: 'Reset link is invalid or has expired. Please request a new one.' });

    const password_hash = hashPassword(newPassword);
    db.prepare('UPDATE patients SET password_hash = ? WHERE id = ?').run(password_hash, row.patient_id);
    db.prepare('UPDATE password_reset_tokens SET used = 1 WHERE id = ?').run(row.id);
    // Invalidate all sessions for security
    db.prepare('DELETE FROM sessions WHERE patient_id = ?').run(row.patient_id);

    res.json({ ok: true, message: 'Password updated. Please log in again.' });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Admin: PATCH booking status (confirm / cancel / reschedule)
app.patch('/api/admin/bookings/:id/status', requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ ok: false, error: 'Invalid id' });
    const status = trimStr(req.body.status).toLowerCase();
    const allowed = ['pending', 'confirmed', 'cancelled', 'rescheduled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ ok: false, error: `Status must be one of: ${allowed.join(', ')}` });
    }
    const confirmedAt = status === 'confirmed' ? new Date().toISOString() : null;
    const info = db.prepare('UPDATE bookings SET status = ?, confirmed_at = ? WHERE id = ?').run(status, confirmedAt, id);
    if (info.changes === 0) return res.status(404).json({ ok: false, error: 'Booking not found' });
    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);

    // If confirming and patient has an email, send notification
    if (status === 'confirmed' && booking.email) {
      const videoLink = booking.video_link || (process.env.BOOKING_VIDEO_LINK || '');
      const videoHtml = videoLink
        ? `<p>Join your session: <a href="${videoLink}" style="color:#4A6B50;">${videoLink}</a></p>`
        : '<p>Your session link will be shared shortly.</p>';
      const html = `<!DOCTYPE html><html><body style="font-family:sans-serif;line-height:1.6;color:#333;max-width:560px;margin:0 auto;padding:24px;">
        <h2 style="color:#4A6B50;">Your session is confirmed — Serenest</h2>
        <p>Hi ${escapeHtml(booking.first_name || 'there')},</p>
        <p>Great news — your session with <strong>${escapeHtml(booking.specialist || '')}</strong> on <strong>${escapeHtml(booking.preferred_date || '')}</strong> at <strong>${escapeHtml(booking.time_slot || '')}</strong> has been confirmed.</p>
        ${videoHtml}
        <p>If you have any questions, reply to this email or contact us through the website.</p>
        <p>— The Serenest Team</p></body></html>`;
      sendResendEmail(booking.email, 'Your Serenest session is confirmed', html);
    }

    res.json({ ok: true, booking });
  } catch (err) {
    console.error('Admin patch booking status error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Admin: confirm booking + send video link email
app.post('/api/admin/bookings/:id/confirm', requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ ok: false, error: 'Invalid id' });
    const video_link = trimStr(req.body.video_link || '').slice(0, 500);
    const info = db.prepare('UPDATE bookings SET status = ?, confirmed_at = ?, video_link = ? WHERE id = ?')
      .run('confirmed', new Date().toISOString(), video_link || null, id);
    if (info.changes === 0) return res.status(404).json({ ok: false, error: 'Booking not found' });
    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);

    if (booking.email) {
      const finalLink = booking.video_link || (process.env.BOOKING_VIDEO_LINK || '');
      const videoHtml = finalLink
        ? `<p><a href="${finalLink}" style="display:inline-block;background:#4A6B50;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">Join Session</a></p><p>Or copy this link: <a href="${finalLink}">${finalLink}</a></p>`
        : '<p>Your session link will be shared shortly before the session.</p>';
      const html = `<!DOCTYPE html><html><body style="font-family:sans-serif;line-height:1.6;color:#333;max-width:560px;margin:0 auto;padding:24px;">
        <h2 style="color:#4A6B50;">Session confirmed — here's your link</h2>
        <p>Hi ${escapeHtml(booking.first_name || 'there')},</p>
        <p>Your session with <strong>${escapeHtml(booking.specialist || '')}</strong> on <strong>${escapeHtml(booking.preferred_date || '')}</strong> at <strong>${escapeHtml(booking.time_slot || '')}</strong> is confirmed.</p>
        ${videoHtml}
        <p>Please be ready a few minutes before your session time.</p>
        <p>— The Serenest Team</p></body></html>`;
      sendResendEmail(booking.email, 'Serenest session confirmed — your video link', html);
    }

    res.json({ ok: true, booking });
  } catch (err) {
    console.error('Admin confirm booking error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Admin: get all patients
app.get('/api/admin/patients', requireAdmin, (req, res) => {
  try {
    const patients = db.prepare(`
      SELECT p.id, p.full_name, p.email, p.phone, p.email_verified, p.created_at,
             COUNT(b.id) AS booking_count,
             MAX(b.preferred_date) AS last_booking_date
      FROM patients p
      LEFT JOIN bookings b ON b.patient_id = p.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `).all();
    res.json({ ok: true, data: patients });
  } catch (err) {
    console.error('Admin patients error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Admin: generate unique Jitsi room for a booking
app.post('/api/admin/bookings/:id/room', requireAdmin, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ ok: false, error: 'Invalid id' });
    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
    if (!booking) return res.status(404).json({ ok: false, error: 'Booking not found' });

    // Generate a unique room name — deterministic from booking id + a secret salt so it's not guessable
    const salt = (process.env.ADMIN_SECRET || 'serenest').slice(0, 16);
    const rawName = `serenest-${salt}-${id}-${Date.now().toString(36)}`;
    const roomName = rawName.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 48);

    // Jitsi Meet public server — no account needed, free, end-to-end encrypted
    const APP_BASE = process.env.APP_BASE_URL || 'https://serenest.onrender.com';
    const jitsiUrl = `https://meet.jit.si/${roomName}`;
    // Internal session page wraps Jitsi with patient display name pre-filled
    const sessionUrl = `${APP_BASE}/session.html?room=${encodeURIComponent(roomName)}&booking=${id}`;

    // Save sessionUrl as the video_link
    db.prepare('UPDATE bookings SET video_link = ? WHERE id = ?').run(sessionUrl, id);
    const updated = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);

    // Auto-confirm and email patient
    db.prepare('UPDATE bookings SET status = ?, confirmed_at = ? WHERE id = ?')
      .run('confirmed', new Date().toISOString(), id);

    if (updated.email) {
      const html = `<!DOCTYPE html><html><body style="font-family:sans-serif;line-height:1.6;color:#333;max-width:560px;margin:0 auto;padding:24px;">
        <h2 style="color:#4A6B50;">Your session is ready \u2014 Serenest</h2>
        <p>Hi ${escapeHtml(updated.first_name || 'there')},</p>
        <p>Your session with <strong>${escapeHtml(updated.specialist || '')}</strong> on <strong>${escapeHtml(updated.preferred_date || '')}</strong> at <strong>${escapeHtml(updated.time_slot || '')}</strong> is confirmed.</p>
        <p>
          <a href="${sessionUrl}" style="display:inline-block;background:#4A6B50;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">Join your video session</a>
        </p>
        <p style="font-size:0.85rem;color:#666;">Or copy this link: <a href="${sessionUrl}">${sessionUrl}</a></p>
        <p>Please be ready a few minutes before your session time. Allow camera and microphone access when prompted.</p>
        <p>\u2014 The Serenest Team</p></body></html>`;
      sendResendEmail(updated.email, 'Your Serenest video session is ready', html);
    }

    res.json({ ok: true, room: roomName, session_url: sessionUrl, jitsi_url: jitsiUrl, booking: db.prepare('SELECT * FROM bookings WHERE id = ?').get(id) });
  } catch (err) {
    console.error('Generate room error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Admin: update booking (e.g. set video_link)
app.put('/api/admin/bookings/:id', requireAdmin, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ ok: false, error: 'Invalid id' });
    const video_link = trimStr(req.body.video_link).slice(0, 500);
    const stmt = db.prepare('UPDATE bookings SET video_link = ? WHERE id = ?');
    const info = stmt.run(video_link || null, id);
    if (info.changes === 0) return res.status(404).json({ ok: false, error: 'Booking not found' });
    const row = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);
    res.json({ ok: true, booking: row });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ——— SMS OTP Auth ———

// Helper: send SMS via Twilio
function sendTwilioSms(to, body) {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) return Promise.reject(new Error('Twilio not configured'));
  const TWILIO_SMS_FROM = process.env.TWILIO_SMS_FROM || '';
  if (!TWILIO_SMS_FROM) return Promise.reject(new Error('TWILIO_SMS_FROM not set'));
  const params = new URLSearchParams({ To: to, From: TWILIO_SMS_FROM, Body: body }).toString();
  const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.twilio.com',
      path: `/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(params),
        'Authorization': `Basic ${auth}`
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error_code) reject(new Error(json.message || 'Twilio error'));
          else resolve(json);
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(params);
    req.end();
  });
}

// POST /api/otp/send — send a 6-digit OTP to a phone number
app.post('/api/otp/send', async (req, res) => {
  try {
    const phone = trimStr(req.body.phone).slice(0, 20);
    if (!phone || !/^\+[1-9]\d{6,14}$/.test(phone)) {
      return res.status(400).json({ ok: false, error: 'Valid phone number in E.164 format required (e.g. +919876543210).' });
    }

    // Rate-limit: max 3 OTPs per phone per 10 minutes
    const recent = db.prepare(
      `SELECT COUNT(*) as n FROM otp_codes WHERE phone = ? AND datetime(created_at) > datetime('now', '-10 minutes')`
    ).get(phone);
    if (recent && recent.n >= 3) {
      return res.status(429).json({ ok: false, error: 'Too many OTP requests. Please wait 10 minutes.' });
    }

    // Invalidate any previous unused OTPs for this phone
    db.prepare(`UPDATE otp_codes SET used = 1 WHERE phone = ? AND used = 0`).run(phone);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes
    db.prepare('INSERT INTO otp_codes (phone, code, expires_at) VALUES (?, ?, ?)').run(phone, code, expiresAt);

    await sendTwilioSms(phone, `Your Serenest OTP is: ${code}. Valid for 10 minutes. Do not share it with anyone.`);

    res.json({ ok: true, message: 'OTP sent.' });
  } catch (err) {
    console.error('OTP send error:', err);
    res.status(500).json({ ok: false, error: err.message || 'Could not send OTP. Please try again.' });
  }
});

// POST /api/otp/verify — verify OTP and log in (or auto-register) the patient
app.post('/api/otp/verify', (req, res) => {
  try {
    const phone = trimStr(req.body.phone).slice(0, 20);
    const code = trimStr(req.body.code).slice(0, 10);
    const full_name = trimStr(req.body.full_name || '').slice(0, 200);

    if (!phone || !code) {
      return res.status(400).json({ ok: false, error: 'Phone and OTP code are required.' });
    }

    const otpRow = db.prepare(
      `SELECT id, code FROM otp_codes WHERE phone = ? AND used = 0 AND datetime(expires_at) > datetime('now') ORDER BY id DESC LIMIT 1`
    ).get(phone);

    if (!otpRow) {
      return res.status(400).json({ ok: false, error: 'OTP expired or not found. Please request a new one.' });
    }
    if (otpRow.code !== code) {
      return res.status(400).json({ ok: false, error: 'Incorrect OTP.' });
    }

    // Mark OTP as used
    db.prepare('UPDATE otp_codes SET used = 1 WHERE id = ?').run(otpRow.id);

    // Find or create patient by phone
    let patient = db.prepare('SELECT id, email, full_name, phone, avatar_url FROM patients WHERE phone = ?').get(phone);
    if (!patient) {
      // Auto-register with phone only (email and password_hash can be set later)
      const placeholder_email = `phone_${phone.replace(/\D/g, '')}@serenest.local`;
      const password_hash = hashPassword(crypto.randomBytes(16).toString('hex')); // random unusable password
      db.prepare('INSERT INTO patients (email, password_hash, full_name, phone) VALUES (?, ?, ?, ?)').run(
        placeholder_email, password_hash, full_name || null, phone
      );
      patient = db.prepare('SELECT id, email, full_name, phone, avatar_url FROM patients WHERE phone = ?').get(phone);
    } else if (full_name && !patient.full_name) {
      db.prepare('UPDATE patients SET full_name = ? WHERE id = ?').run(full_name, patient.id);
      patient.full_name = full_name;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    db.prepare('INSERT INTO sessions (patient_id, token, expires_at) VALUES (?, ?, ?)').run(patient.id, token, expires_at);

    res.json({
      ok: true,
      token,
      patient: { id: patient.id, email: patient.email, full_name: patient.full_name, phone: patient.phone, avatar_url: patient.avatar_url }
    });
  } catch (err) {
    console.error('OTP verify error:', err);
    res.status(500).json({ ok: false, error: err.message || 'Verification failed. Please try again.' });
  }
});

// ——— Google OAuth ———

// Helper: exchange Google auth code for tokens and user profile
function fetchGoogleTokens(code) {
  const redirectUri = GOOGLE_REDIRECT_URI || `${APP_BASE_URL}/api/auth/google/callback`;
  const body = new URLSearchParams({
    code,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code'
  }).toString();
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'oauth2.googleapis.com',
      path: '/token',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(body) }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch (e) { reject(e); } });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function fetchGoogleUserInfo(accessToken) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'www.googleapis.com',
      path: '/oauth2/v2/userinfo',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${accessToken}` }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch (e) { reject(e); } });
    });
    req.on('error', reject);
    req.end();
  });
}

// GET /api/auth/google — redirect patient to Google consent screen
app.get('/api/auth/google', (req, res) => {
  if (!GOOGLE_CLIENT_ID) {
    return res.status(503).json({ ok: false, error: 'Google login is not configured.' });
  }
  const redirectUri = GOOGLE_REDIRECT_URI || `${APP_BASE_URL}/api/auth/google/callback`;
  const state = crypto.randomBytes(16).toString('hex');
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'online',
    state
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
});

// GET /api/auth/google/callback — Google redirects here after consent
app.get('/api/auth/google/callback', async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) {
      return res.redirect(`${APP_BASE_URL}/login.html?error=google_denied`);
    }

    const tokens = await fetchGoogleTokens(code);
    if (tokens.error) {
      console.error('Google token error:', tokens.error_description || tokens.error);
      return res.redirect(`${APP_BASE_URL}/login.html?error=google_token_failed`);
    }

    const profile = await fetchGoogleUserInfo(tokens.access_token);
    if (!profile.id || !profile.email) {
      return res.redirect(`${APP_BASE_URL}/login.html?error=google_no_email`);
    }

    // Find patient by google_id, then by email, then create
    let patient = db.prepare('SELECT id, email, full_name, phone, avatar_url FROM patients WHERE google_id = ?').get(profile.id);
    if (!patient) {
      patient = db.prepare('SELECT id, email, full_name, phone, avatar_url FROM patients WHERE email = ?').get(profile.email.toLowerCase());
      if (patient) {
        // Link Google ID to existing account
        db.prepare('UPDATE patients SET google_id = ?, avatar_url = ? WHERE id = ?').run(
          profile.id, profile.picture || null, patient.id
        );
        patient.google_id = profile.id;
        patient.avatar_url = profile.picture || patient.avatar_url;
      } else {
        // Auto-register new patient via Google
        const password_hash = hashPassword(crypto.randomBytes(16).toString('hex'));
        db.prepare('INSERT INTO patients (email, password_hash, full_name, google_id, avatar_url) VALUES (?, ?, ?, ?, ?)').run(
          profile.email.toLowerCase(), password_hash, profile.name || null, profile.id, profile.picture || null
        );
        patient = db.prepare('SELECT id, email, full_name, phone, avatar_url FROM patients WHERE google_id = ?').get(profile.id);
      }
    } else {
      // Update avatar in case it changed
      if (profile.picture && profile.picture !== patient.avatar_url) {
        db.prepare('UPDATE patients SET avatar_url = ? WHERE id = ?').run(profile.picture, patient.id);
        patient.avatar_url = profile.picture;
      }
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    db.prepare('INSERT INTO sessions (patient_id, token, expires_at) VALUES (?, ?, ?)').run(patient.id, token, expires_at);

    // Redirect to frontend with token in URL fragment (never in query string)
    res.redirect(`${APP_BASE_URL}/dashboard.html#token=${token}`);
  } catch (err) {
    console.error('Google callback error:', err);
    res.redirect(`${APP_BASE_URL}/login.html?error=google_failed`);
  }
});

// ——— Cron: appointment reminders (call with CRON_SECRET) ———
app.post('/api/cron/send-reminders', (req, res) => {
  if (CRON_SECRET && req.get('X-Cron-Secret') !== CRON_SECRET) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }
  try {
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in1h = new Date(now.getTime() + 60 * 60 * 1000);
    const fmt = (d) => d.toISOString().slice(0, 10);
    const reminders = [];
    const rows = db.prepare('SELECT id, first_name, email, phone, specialist, preferred_date, time_slot FROM bookings WHERE preferred_date >= ? AND preferred_date <= ?').all(fmt(now), fmt(in24h));
    for (const b of rows) {
      const raw = (b.time_slot || '12:00').trim();
      const match = raw.match(/(\d+):(\d+)\s*([AP]M)/i);
      let timeStr = '12:00:00';
      if (match) {
        let hour = parseInt(match[1], 10);
        const min = match[2];
        if ((match[3] || '').toUpperCase() === 'PM' && hour < 12) hour += 12;
        if ((match[3] || '').toUpperCase() === 'AM' && hour === 12) hour = 0;
        timeStr = hour + ':' + min + ':00';
      }
      // Treat preferred_date + time as IST (UTC+5:30); append offset so JS parses correctly
      const sessionDate = new Date(b.preferred_date + 'T' + timeStr + '+05:30');
      const diff = sessionDate.getTime() - now.getTime();
      const hours = diff / (60 * 60 * 1000);
      if (hours >= 23 && hours <= 25) reminders.push({ ...b, when: '24h' });
      else if (hours >= 0.9 && hours <= 1.1) reminders.push({ ...b, when: '1h' });
    }
    for (const r of reminders) {
      const msg = r.when === '24h'
        ? `Reminder: Your Serenest session with ${r.specialist} is tomorrow (${r.preferred_date} at ${r.time_slot}).`
        : `Reminder: Your Serenest session with ${r.specialist} is in 1 hour (${r.preferred_date} at ${r.time_slot}).`;
      const html = '<p>' + msg.replace(/\n/g, '<br>') + '</p><p>— Serenest</p>';
      sendResendEmail(r.email, 'Session reminder — Serenest', '<!DOCTYPE html><html><body style="font-family:sans-serif;">' + html + '</body></html>');
      sendWhatsAppMessage(msg);
    }
    res.json({ ok: true, sent: reminders.length });
  } catch (err) {
    console.error('Reminders error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Visit ping: frontend calls this once per session; you get a Telegram notification
const visitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { ok: true },
  standardHeaders: true,
  legacyHeaders: false
});

app.post('/api/visit', visitLimiter, (req, res) => {
  try {
    const page = trimStr(req.body.page).slice(0, 200) || '/';
    const referrer = trimStr(req.body.referrer).slice(0, 500);
    const ip = (req.ip || req.connection?.remoteAddress || '').slice(0, 45);

    const stmt = db.prepare('INSERT INTO visits (page, referrer, ip) VALUES (?, ?, ?)');
    stmt.run(page || '/', referrer || null, ip || null);

    const time = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const telegramMsg = `🟢 *Serenest visit*\nPage: ${page}\nFrom: ${referrer || 'Direct'}\n${time}`;
    sendTelegramMessage(telegramMsg);

    const whatsappMsg = `Serenest visit\nPage: ${page}\nFrom: ${referrer || 'Direct'}\n${time}`;
    sendWhatsAppMessage(whatsappMsg);

    res.status(201).json({ ok: true });
  } catch (err) {
    console.error('Visit ping error:', err);
    res.status(500).json({ ok: false });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, status: 'ok', env: NODE_ENV });
});

// Start server
app.listen(PORT, () => {
  console.log(`Serenest backend running (${NODE_ENV}) at http://localhost:${PORT}`);
  console.log(`  - Static site: http://localhost:${PORT}/index.html`);
  console.log(`  - API: POST /api/booking, /api/contact, /api/apply`);
  if (isProd && ADMIN_SECRET) {
    console.log(`  - Admin: protected with X-Admin-Key header`);
  }
});
