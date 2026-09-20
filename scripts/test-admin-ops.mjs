/**
 * Admin ops helpers — phone links, WhatsApp templates, command search.
 * Run: node scripts/test-admin-ops.mjs
 */
import assert from 'node:assert/strict';
import {
  digitsOnly,
  indiaWaNumber,
  telHref,
  patientConfirmMessage,
  waMeUrl,
  waMePatientUrl,
  searchAdminRecords,
  rankBookingStatus,
  isUnassignedActive,
  screeningHasSafetyFlag,
} from '../src/lib/adminOps.js';

assert.equal(digitsOnly('+91 98765-43210'), '919876543210');
assert.equal(indiaWaNumber('9876543210'), '919876543210');
assert.equal(indiaWaNumber('09876543210'), '919876543210');
assert.equal(indiaWaNumber('+91 98765 43210'), '919876543210');
assert.equal(indiaWaNumber(''), null);
assert.equal(telHref('9876543210'), 'tel:+919876543210');
assert.equal(telHref('919876543210'), 'tel:+919876543210');

const booking = {
  id: 'b1',
  patient_name: 'Asha Rao',
  patient_phone: '9876543210',
  patient_email: 'asha@example.com',
  practitioner_type: 'psychiatrist',
  mode: 'video',
  preferred_date: '2026-09-22',
  preferred_time: '18:00',
  status: 'pending',
  notes: 'evening slot',
};

const msg = patientConfirmMessage(booking);
assert.match(msg, /Hi Asha/);
assert.match(msg, /psychiatrist/);
assert.match(msg, /you do not pay until then/i);

const wa = waMePatientUrl(booking);
assert.ok(wa.startsWith('https://wa.me/919876543210?text='));
assert.ok(decodeURIComponent(wa.split('text=')[1]).includes('Asha'));

assert.equal(waMeUrl('', 'hi'), null);
assert.equal(rankBookingStatus('pending'), 0);
assert.equal(isUnassignedActive(booking), true);
assert.equal(isUnassignedActive({ ...booking, professional_id: 'p1' }), false);
assert.equal(isUnassignedActive({ ...booking, status: 'cancelled' }), false);

assert.equal(screeningHasSafetyFlag({ phq9_answers: [0, 0, 0, 0, 0, 0, 0, 0, 2] }), true);
assert.equal(screeningHasSafetyFlag({ phq9_answers: [1, 1, 1, 1, 1, 1, 1, 1, 0] }), false);

const hits = searchAdminRecords({
  query: 'asha',
  bookings: [booking],
  messages: [{ id: 'm1', name: 'Ravi', phone: '9999999999', subject: 'Fees', message: 'cost?' }],
  screenings: [{ id: 's1', name: 'Asha Rao', phone: '9876543210', wants_callback: true }],
  professionals: [{ id: 'p1', full_name: 'Dr Mehta', role: 'psychiatrist', city: 'Mumbai' }],
});
assert.ok(hits.some((h) => h.kind === 'booking' && h.tab === 'bookings'));
assert.ok(hits.some((h) => h.kind === 'screening'));
assert.equal(searchAdminRecords({ query: 'x', bookings: [booking] }).length, 0);

const feeHits = searchAdminRecords({
  query: 'fees',
  bookings: [],
  messages: [{ id: 'm1', name: 'Ravi', subject: 'Fees', message: 'cost?' }],
});
assert.equal(feeHits[0].kind, 'message');

console.log('admin-ops helpers: ok');
