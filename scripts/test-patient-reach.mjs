/**
 * Patient conversion helpers — contact validation, booking steps, dock paths.
 * Run: node scripts/test-patient-reach.mjs
 */
import assert from 'node:assert/strict';
import {
  CARE_TEL_HREF,
  CARE_WA_NUMBER,
  BOOKING_STEPS,
  TRUST_POINTS,
  careWaHref,
  indiaMobileDigits,
  isIndiaMobile,
  isPatientNameValid,
  canContinueContactStep,
  canSubmitCallback,
  buildCallbackPayload,
  isCallbackSubject,
  bookingIntentStorageKey,
  hideReachDock,
  normalizeContactLead,
} from '../src/lib/patientReach.js';

assert.equal(indiaMobileDigits('9876543210'), '9876543210');
assert.equal(indiaMobileDigits('+91 98765 43210'), '9876543210');
assert.equal(indiaMobileDigits('09876543210'), '9876543210');
assert.equal(indiaMobileDigits('919876543210'), '9876543210');

assert.equal(isIndiaMobile('9876543210'), true);
assert.equal(isIndiaMobile('5876543210'), false);
assert.equal(isIndiaMobile('123'), false);
assert.equal(isIndiaMobile('+91 88888 88888'), true);

assert.equal(isPatientNameValid('A'), false);
assert.equal(isPatientNameValid('  Jo'), true);

assert.equal(canContinueContactStep({ name: 'Asha', phone: '9876543210', consent: true }), true);
assert.equal(canContinueContactStep({ name: 'Asha', phone: '9876543210', consent: false }), false);
assert.equal(canContinueContactStep({ name: 'A', phone: '9876543210', consent: true }), false);

assert.deepEqual(BOOKING_STEPS.map((s) => s.label), ['You', 'Care', 'Confirm']);
assert.equal(BOOKING_STEPS[0].id, 1);
assert.ok(TRUST_POINTS.some((p) => /pay after/i.test(p.label)));

assert.equal(hideReachDock('/book'), true);
assert.equal(hideReachDock('/book?pid=1'), true);
assert.equal(hideReachDock('/admin'), true);
assert.equal(hideReachDock('/'), false);
assert.equal(hideReachDock('/services'), false);

assert.equal(canSubmitCallback({ name: 'Asha', phone: '+91 98765 43210', consent: true }), true);
assert.equal(canSubmitCallback({ name: 'Asha', phone: '9876543210', consent: false }), false);

const payload = buildCallbackPayload({
  name: '  Asha  ',
  phone: '+91 98765 43210',
  email: 'asha@example.com',
  source: 'homepage',
  note: 'Wants a psychiatrist',
});
assert.equal(payload.name, 'Asha');
assert.equal(payload.phone, '9876543210');
assert.equal(payload.email, 'asha@example.com');
assert.equal(payload.subject, 'Callback · homepage');
assert.match(payload.message, /Wants a psychiatrist/);
assert.equal(isCallbackSubject(payload.subject), true);
assert.equal(isCallbackSubject('Enquiry'), false);
assert.equal(bookingIntentStorageKey('+91 98765 43210'), 'serenest_booking_intent_9876543210');

const defaultPayload = buildCallbackPayload({ name: 'Jo', phone: '8888888888' });
assert.equal(defaultPayload.subject, 'Callback · callback');
assert.match(defaultPayload.message, /pay after we confirm/i);
assert.equal(defaultPayload.email, undefined);

assert.equal(normalizeContactLead({ name: 'A', phone: '9876543210' }).error, 'name is required');
assert.equal(normalizeContactLead({ name: 'Asha', phone: '123' }).error, 'A valid 10-digit Indian mobile is required');
assert.equal(normalizeContactLead({ name: 'Asha', phone: '9876543210' }).record.phone, '9876543210');
assert.equal(normalizeContactLead({ name: 'Asha', phone: '9876543210' }).record.message.includes('call back'), true);
assert.equal(normalizeContactLead({
  name: 'Asha',
  phone: '+91 98765 43210',
  subject: 'Callback · homepage',
  message: 'Please call back. Source: homepage.',
}).record.subject, 'Callback · homepage');

assert.equal(CARE_TEL_HREF, 'tel:+917777936367');
assert.ok(careWaHref().startsWith(`https://wa.me/${CARE_WA_NUMBER}?text=`));
assert.match(decodeURIComponent(careWaHref().split('text=')[1]), /book a session/i);

console.log('patient-reach helpers: ok');
