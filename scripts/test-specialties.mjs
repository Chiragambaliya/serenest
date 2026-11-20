import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { isSpecialty, SPECIALTY_IDS, specialtyLabel } from '../src/lib/specialties.js';

const LEGACY = ['psychiatrist', 'psychologist', 'therapist', 'counsellor'];
for (const id of LEGACY) {
  assert.equal(isSpecialty(id), true, `${id} must stay bookable`);
}

assert.equal(isSpecialty('cardiologist'), true);
assert.equal(isSpecialty('general-physician'), true);
assert.equal(isSpecialty('dentist'), true);
assert.equal(isSpecialty('academy'), false);
assert.equal(isSpecialty(''), false);
assert.equal(specialtyLabel('ent'), 'ENT specialist');
assert.equal(SPECIALTY_IDS.length > LEGACY.length, true);

const schema = readFileSync(new URL('../supabase/schema.sql', import.meta.url), 'utf8');
const migration = readFileSync(new URL('../supabase/migrations/2026_11_20_all_specialties.sql', import.meta.url), 'utf8');
for (const id of SPECIALTY_IDS) {
  assert.match(schema, new RegExp(`'${id}'`));
  assert.match(migration, new RegExp(`'${id}'`));
}
assert.doesNotMatch(migration, /enable row level security|grant |create policy|security definer/i);

console.log(`specialties: ${SPECIALTY_IDS.length} ids, schema and migration match, no access changes`);
