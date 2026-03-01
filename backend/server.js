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
    res.status(201).json({ ok: true, message: 'You’re subscribed. We’ll send you our next update.' });
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

app.delete('/api/admin/specialists/:id', requireAdmin, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ ok: false, error: 'Invalid id' });
    const info = db.prepare('DELETE FROM specialists WHERE id = ?').run(id);
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

app.post('/api/reviews', (req, res) => {
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
    const p = db.prepare('SELECT id, email, full_name, created_at FROM patients WHERE id = ?').get(req.patientId);
    if (!p) return res.status(404).json({ ok: false, error: 'Not found' });
    res.json({ ok: true, patient: p });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.put('/api/me', requirePatient, (req, res) => {
  try {
    const full_name = trimStr(req.body.full_name).slice(0, 200);
    db.prepare('UPDATE patients SET full_name = ? WHERE id = ?').run(full_name || null, req.patientId);
    const p = db.prepare('SELECT id, email, full_name, created_at FROM patients WHERE id = ?').get(req.patientId);
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

app.get('/api/me/bookings', requirePatient, (req, res) => {
  try {
    const rows = db.prepare('SELECT id, specialist, session_type, preferred_date, time_slot, video_link, created_at FROM bookings WHERE patient_id = ? ORDER BY created_at DESC').all(req.patientId);
    res.json({ ok: true, data: rows });
  } catch (err) {
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
      const sessionDate = new Date(b.preferred_date + 'T' + timeStr);
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
