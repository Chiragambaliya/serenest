/**
 * Specialty catalog stays aligned with booking, SEO, and the appointments check.
 * Run: node scripts/test-specialties.mjs
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  SPECIALTIES,
  SPECIALTY_IDS,
  isSpecialty,
  specialtyById,
  specialtyLabel,
} from '../src/lib/specialties.js';
import { ROUTE_SEO, isKnownDynamicSpaPath, renderSeoBody } from '../src/lib/seo.js';

assert.equal(SPECIALTIES.length, 22);
assert.equal(new Set(SPECIALTY_IDS).size, SPECIALTY_IDS.length);

const summaries = new Set();
for (const specialty of SPECIALTIES) {
  assert.ok(specialty.id);
  assert.ok(specialty.label);
  assert.ok(specialty.summary.length > 40, specialty.id);
  assert.ok(specialty.online.length >= 2, specialty.id);
  assert.ok(specialty.inPerson.length >= 2, specialty.id);
  assert.ok(specialty.license, specialty.id);
  assert.equal(summaries.has(specialty.summary), false, specialty.id);
  summaries.add(specialty.summary);
  assert.equal(isSpecialty(specialty.id), true);
  assert.equal(specialtyById(specialty.id).label, specialty.label);
  assert.equal(specialtyLabel(specialty.id), specialty.label);
  assert.ok(ROUTE_SEO[`/specialties/${specialty.id}`], specialty.id);
  assert.equal(isKnownDynamicSpaPath(`/specialties/${specialty.id}`), true);
  const body = renderSeoBody(`/specialties/${specialty.id}`);
  assert.match(body, new RegExp(specialty.online[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(body, /book\?specialty=/);
}

assert.equal(isSpecialty('wizard'), false);
assert.equal(isSpecialty(''), false);
assert.equal(specialtyById('nope'), null);
assert.equal(isKnownDynamicSpaPath('/specialties/not-a-branch'), false);
assert.ok(ROUTE_SEO['/specialties']);
assert.match(renderSeoBody('/specialties'), /cardiologist/);

const schema = readFileSync(new URL('../supabase/schema.sql', import.meta.url), 'utf8');
const migration = readFileSync(
  new URL('../supabase/migrations/2026_11_26_all_specialty_appointments.sql', import.meta.url),
  'utf8',
);
for (const id of SPECIALTY_IDS) {
  assert.ok(schema.includes(`'${id}'`), `schema missing ${id}`);
  assert.ok(migration.includes(`'${id}'`), `migration missing ${id}`);
}

console.log('specialties catalog: ok');
