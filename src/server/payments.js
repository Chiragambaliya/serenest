/**
 * Razorpay payments — order creation and signature verification.
 * The key secret never leaves the server.
 */
import crypto from 'crypto';
import { supabase } from './db.js';

export const RZP_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RZP_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const DEFAULT_FEE_INR = Number(process.env.DEFAULT_FEE_INR) || 499;

/**
 * Payments are enforced only once both Razorpay keys are present — and can be
 * turned off with PAYMENTS_ENABLED=false as a kill-switch (e.g. if Razorpay is
 * down or under review), so patients can still book and pay offline.
 */
export function paymentsEnabled() {
  if (String(process.env.PAYMENTS_ENABLED).toLowerCase() === 'false') return false;
  return Boolean(RZP_KEY_ID && RZP_KEY_SECRET);
}

/** Resolve the amount (in rupees) to charge for a booking, server-side. */
export async function resolveFeeInr(professionalId) {
  if (professionalId && supabase) {
    const { data } = await supabase
      .from('professional_applications')
      .select('fee_inr')
      .eq('id', professionalId)
      .maybeSingle();
    const fee = Number(data?.fee_inr);
    if (Number.isFinite(fee) && fee > 0) return Math.round(fee);
  }
  return DEFAULT_FEE_INR;
}

/** Create a Razorpay order via the REST API (Basic auth — secret stays server-side). */
export async function createRazorpayOrder(amountInr) {
  const auth = Buffer.from(`${RZP_KEY_ID}:${RZP_KEY_SECRET}`).toString('base64');
  const r = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Basic ${auth}` },
    body: JSON.stringify({
      amount: amountInr * 100, // paise
      currency: 'INR',
      payment_capture: 1,
    }),
  });
  if (!r.ok) {
    const detail = await r.text().catch(() => '');
    console.error('[razorpay order]', r.status, detail.slice(0, 200));
    return null;
  }
  return r.json();
}

/** Verify the Razorpay payment signature (HMAC-SHA256 of "order_id|payment_id"). */
export function verifyRazorpaySignature({ order_id, payment_id, signature }) {
  if (!order_id || !payment_id || !signature) return false;
  const expected = crypto
    .createHmac('sha256', RZP_KEY_SECRET)
    .update(`${order_id}|${payment_id}`)
    .digest('hex');
  // Constant-time compare
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
