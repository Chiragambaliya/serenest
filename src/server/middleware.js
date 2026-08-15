/**
 * Global middleware — security headers, compression, rate limiting, CORS,
 * and JSON body parsing. Order matters and mirrors production behavior.
 */
import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';

export function applyGlobalMiddleware(app) {
  // ── Security headers (Helmet) ──────────────────────────────
  app.use(helmet({
    contentSecurityPolicy: false, // managed separately to allow inline scripts + Google Fonts
    crossOriginEmbedderPolicy: false, // needed for Daily.co video
  }));
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }
    next();
  });

  // ── Compression (gzip / br) ────────────────────────────────
  app.use(compression());

  // ── Rate limiting ──────────────────────────────────────────
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { ok: false, error: 'Too many requests — please try again in a few minutes.' },
  });
  const strictLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 30,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { ok: false, error: 'Submission limit reached. Please try again later.' },
  });
  app.use('/api/', limiter);
  app.use('/api/bookings', strictLimiter);
  app.use('/api/screening', strictLimiter);
  app.use('/api/professionals/apply', strictLimiter);
  app.use('/api/contact', strictLimiter);
  app.use('/api/subscribe', strictLimiter);
  app.use('/api/privacy/request', strictLimiter);

  // ── CORS ───────────────────────────────────────────────────
  app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-secret'],
  }));
  app.use(express.json({ limit: '256kb' }));
}
