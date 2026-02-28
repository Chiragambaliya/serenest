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
const Razorpay = require('razorpay');

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
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const CONSULTATION_AMOUNT_INR = Math.max(1, parseInt(process.env.CONSULTATION_AMOUNT_INR || '500', 10));
const razorpay = (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) ? new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET }) : null;

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

// ——— API Routes ———

// Create Razorpay order for payment (amount in INR from body or default)
app.post('/api/create-order', (req, res) => {
  if (!razorpay) {
    return res.status(503).json({ ok: false, error: 'Payments not configured. Please contact support.' });
  }
  try {
    const amountInr = Math.max(1, parseInt(req.body.amount, 10) || CONSULTATION_AMOUNT_INR);
    const amountPaise = amountInr * 100;
    const order = razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: 'serenest_' + Date.now()
    });
    return res.json({ ok: true, order_id: order.id, key_id: RAZORPAY_KEY_ID, amount: amountInr });
  } catch (err) {
    console.error('Create order error:', err);
    return res.status(500).json({ ok: false, error: 'Could not create payment order. Please try again.' });
  }
});

function verifyRazorpaySignature(orderId, paymentId, signature) {
  if (!RAZORPAY_KEY_SECRET) return false;
  const body = orderId + '|' + paymentId;
  const expected = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET).update(body).digest('hex');
  return expected === signature;
}

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
    const payment_id = trimStr(req.body.razorpay_payment_id).slice(0, 64);
    const order_id = trimStr(req.body.razorpay_order_id).slice(0, 64);
    const razorpay_signature = trimStr(req.body.razorpay_signature).slice(0, 256);

    if (!first_name || !last_name || !email || !phone || !specialist || !session_type || !preferred_date || !time_slot) {
      return res.status(400).json({ ok: false, error: 'Missing required fields' });
    }

    let paymentIdToStore = null;
    if (razorpay && payment_id && order_id && razorpay_signature) {
      if (!verifyRazorpaySignature(order_id, payment_id, razorpay_signature)) {
        return res.status(400).json({ ok: false, error: 'Payment verification failed. Please try again or contact support.' });
      }
      paymentIdToStore = payment_id;
    }

    const stmt = db.prepare(`
      INSERT INTO bookings (first_name, last_name, email, phone, specialist, session_type, preferred_date, time_slot, notes, payment_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(first_name, last_name, email, phone, specialist, session_type, preferred_date, time_slot, notes || null, paymentIdToStore);

    res.status(201).json({ ok: true, message: paymentIdToStore ? 'Booking confirmed. Payment received. We will send confirmation by email.' : 'Booking received. We will confirm by email.' });
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
