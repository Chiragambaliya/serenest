require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { db, initDb } = require('./db');

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProd = NODE_ENV === 'production';
const ADMIN_SECRET = process.env.ADMIN_SECRET || '';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || null;

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
app.use(express.static(path.join(__dirname, '..'), {
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

// ——— API Routes ———

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

    if (!first_name || !last_name || !email || !phone || !specialist || !session_type || !preferred_date || !time_slot) {
      return res.status(400).json({ ok: false, error: 'Missing required fields' });
    }

    const stmt = db.prepare(`
      INSERT INTO bookings (first_name, last_name, email, phone, specialist, session_type, preferred_date, time_slot, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(first_name, last_name, email, phone, specialist, session_type, preferred_date, time_slot, notes || null);

    res.status(201).json({ ok: true, message: 'Booking received. We will confirm by email.' });
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
