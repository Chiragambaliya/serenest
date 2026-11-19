import { analyticsAllowed } from '../src/lib/privacyConsent.js';

let failed = 0;
function assert(cond, message) {
  if (cond) return;
  failed += 1;
  console.error(`FAIL ${message}`);
}

assert(analyticsAllowed(null) === true, 'no choice keeps analytics on');
assert(analyticsAllowed('analytics') === true, 'explicit analytics stays on');
assert(analyticsAllowed('essential') === false, 'essential only switches analytics off');

if (failed) {
  console.error(`${failed} privacy consent check(s) failed`);
  process.exit(1);
}
console.log('privacy consent: analytics on unless essential only');
