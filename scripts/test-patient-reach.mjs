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
  hideReachDock,
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

assert.equal(CARE_TEL_HREF, 'tel:+917777936367');
assert.ok(careWaHref().startsWith(`https://wa.me/${CARE_WA_NUMBER}?text=`));
assert.match(decodeURIComponent(careWaHref().split('text=')[1]), /book a session/i);

console.log('patient-reach helpers: ok');
