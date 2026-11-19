/**
 * Catalog integrity for adult specialties: unique URLs, booking roles,
 * and SEO registration for every page the site claims to offer.
 */
import { ROUTE_ALIASES, ROUTE_SEO } from '../src/lib/seo.js';
import {
  CARE_SPECIALTIES,
  CONDITION_SPECIALTIES,
  OWNED_SPECIALTIES,
  SPECIALTIES,
  SPECIALTY_INDEX_PATH,
  bookPathFor,
  specialtyById,
} from '../src/lib/specialties.js';

const ROLES = new Set(['psychiatrist', 'psychologist', 'therapist', 'counsellor']);
let failed = 0;

function assert(cond, message) {
  if (cond) return;
  failed += 1;
  console.error(`FAIL ${message}`);
}

const ids = new Set();
const paths = new Set();

for (const item of SPECIALTIES) {
  assert(!ids.has(item.id), `duplicate id ${item.id}`);
  ids.add(item.id);
  assert(!paths.has(item.path), `duplicate path ${item.path}`);
  paths.add(item.path);
  assert(item.path.startsWith('/'), `${item.id} path is absolute`);
  assert(ROUTE_SEO[item.path], `${item.path} missing from ROUTE_SEO`);
  assert(ROLES.has(item.role), `${item.id} role ${item.role} is not bookable`);
  assert(item.summary && item.name, `${item.id} missing name or summary`);
  const booking = bookPathFor(item);
  assert(booking.startsWith('/book?'), `${item.id} book path`);
  assert(booking.includes('concern='), `${item.id} book path includes concern`);
  assert(booking.includes(`role=${item.role}`), `${item.id} book path includes role`);
}

assert(CARE_SPECIALTIES.length >= 4, 'care specialties');
assert(CONDITION_SPECIALTIES.length >= 12, 'condition specialties');
assert(ROUTE_SEO[SPECIALTY_INDEX_PATH], 'specialty index SEO');
assert(!ROUTE_ALIASES[SPECIALTY_INDEX_PATH], 'index is not an alias');

for (const item of OWNED_SPECIALTIES) {
  assert(item.faqs?.length >= 4, `${item.id} needs at least 4 FAQs`);
  assert(item.limits?.length >= 3, `${item.id} needs limits`);
  assert(item.points?.length >= 3, `${item.id} needs points`);
  assert(item.lead && item.looksLike && item.emergencyNote, `${item.id} missing copy`);
  assert(item.seoTitle && item.seoDescription, `${item.id} missing SEO fields`);
  assert(ROUTE_SEO[item.path].title === item.seoTitle, `${item.id} SEO title drift`);
  for (const id of item.related || []) {
    assert(specialtyById(id), `${item.id} related ${id} missing`);
  }
  for (const alias of item.aliases || []) {
    assert(ROUTE_ALIASES[alias] === item.path, `${alias} should redirect to ${item.path}`);
    assert(!ROUTE_SEO[alias], `${alias} should not be its own indexable page`);
  }
}

if (failed) {
  console.error(`${failed} specialty check(s) failed`);
  process.exit(1);
}

console.log(`specialties ok: ${SPECIALTIES.length} total, ${OWNED_SPECIALTIES.length} new pages, index ${SPECIALTY_INDEX_PATH}`);
