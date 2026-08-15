/**
 * Express app assembly — global middleware, every API route module, static /
 * SPA serving with SEO injection, and the final 404 + error handlers.
 *
 * Registration order is deliberate and mirrors request-matching precedence:
 * middleware first, API routes next, static + SPA fallback after, and the
 * API 404 / error handlers last.
 */
import express from 'express';
import { err } from './http.js';
import { applyGlobalMiddleware } from './middleware.js';
import { registerHealthRoutes } from './routes/health.js';
import { registerBookingRoutes } from './routes/bookings.js';
import { registerProfessionalPortalRoutes } from './routes/professionalPortal.js';
import { registerScreeningRoutes } from './routes/screening.js';
import { registerApplicationRoutes } from './routes/applications.js';
import { registerProfessionalRoutes } from './routes/professionals.js';
import { registerJobRoutes } from './routes/jobs.js';
import { registerRoomRoutes } from './routes/rooms.js';
import { registerPrescriptionRoutes } from './routes/prescriptions.js';
import { registerAdminRoutes } from './routes/admin.js';
import { registerTrackingRoutes } from './routes/tracking.js';
import { registerSubscriberRoutes } from './routes/subscribers.js';
import { registerAcademyRoutes } from './routes/academy.js';
import { registerSocialRoutes } from './routes/social.js';
import { registerInquiryRoutes } from './routes/inquiries.js';
import { registerContactRoutes } from './routes/contact.js';
import { registerAssistantRoutes } from './routes/assistant.js';
import { registerSpaHandlers } from './spa.js';

export function createApp() {
  const app = express();

  applyGlobalMiddleware(app);

  // ── API routes ───────────────────────────────────────────────
  registerHealthRoutes(app);
  registerBookingRoutes(app);
  registerProfessionalPortalRoutes(app);
  registerScreeningRoutes(app);
  registerApplicationRoutes(app);
  registerProfessionalRoutes(app);
  registerJobRoutes(app);
  registerRoomRoutes(app);
  registerPrescriptionRoutes(app);
  registerAdminRoutes(app);
  registerTrackingRoutes(app);
  registerSubscriberRoutes(app);
  registerAcademyRoutes(app);
  registerSocialRoutes(app);
  registerInquiryRoutes(app);
  registerContactRoutes(app);
  registerAssistantRoutes(app);

  // ── Static + SPA fallback (with route-specific SEO injection) ─
  registerSpaHandlers(app);

  // ── 404 for unmatched API routes ─────────────────────────────
  app.use('/api', (_req, res) => err(res, 'API endpoint not found', 404));

  // ── Global error handler ─────────────────────────────────────
  // eslint-disable-next-line no-unused-vars
  app.use((error, _req, res, _next) => {
    console.error('[Unhandled error]', error);
    err(res, 'Internal server error', 500);
  });

  return app;
}
