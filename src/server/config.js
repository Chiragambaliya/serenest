/**
 * Central configuration — resolves project paths and validates env-derived
 * settings in one place so route modules never reach into process.env for
 * anything that needs parsing or validation.
 */
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';

// src/server/ → project root
export const ROOT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const DIST_DIR = join(ROOT_DIR, 'dist');

// Bookings and screenings are revenue-critical: when the database is not
// configured (or an insert fails) the lead is appended to this local JSONL
// file so nothing is silently lost. Safety net only — Render's free-tier
// disk is ephemeral across deploys.
export const FALLBACK_LEADS_FILE = join(ROOT_DIR, 'data', 'leads-fallback.jsonl');

// Expose an optional, validated GA4 measurement ID without loading Google.
// The browser loads the analytics script only after explicit consent.
export const GA_ID = /^[A-Za-z0-9-]{4,20}$/.test(process.env.GA_MEASUREMENT_ID || '')
  ? process.env.GA_MEASUREMENT_ID
  : '';

export const PORT = process.env.PORT || 3000;
