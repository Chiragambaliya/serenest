/**
 * Screening engine + Mental Health Check launch registry checks.
 * Run: node scripts/test-screening-tools.mjs
 */
import assert from 'node:assert/strict';
import { getTool, scoreTool, careTier, maxScore, getAllTools } from '../src/lib/screeningTools.js';
import {
  getCheckEvidence,
  listCheckEvidence,
  getLandingPathForTool,
} from '../src/lib/checkEvidence.js';
import { loadCheckDraft, saveCheckDraft, clearCheckDraft } from '../src/lib/checkSession.js';

const bat = getTool('bat12');
assert.ok(bat, 'BAT-12 registered');
assert.equal(bat.slug, 'burnout-bat-12');
assert.equal(bat.scoring, 'mean');
assert.equal(bat.questions.length, 12);
assert.equal(bat.dimensionId, 'burnout');
assert.equal(maxScore(bat), 5);

// All Never (1) → mean 1.00 → Lower concern
const low = scoreTool(bat, Array(12).fill(1));
assert.equal(low.complete, true);
assert.equal(low.score, 1);
assert.equal(low.band.label, 'Lower concern');
assert.equal(careTier(bat, low), 'mild');

const midAnswers = [...Array(6).fill(2), ...Array(6).fill(3)]; // mean 2.5 → Lower (≤2.53)
const midLow = scoreTool(bat, midAnswers);
assert.ok(Math.abs(midLow.score - 2.5) < 1e-9);
assert.equal(midLow.band.label, 'Lower concern');

const elevated = scoreTool(bat, Array(12).fill(3)); // mean 3.0 → Higher concern (≥2.96)
assert.ok(Math.abs(elevated.score - 3) < 1e-9);
assert.equal(elevated.band.label, 'Higher concern');
assert.equal(careTier(bat, elevated), 'high');

const atRisk = scoreTool(bat, [...Array(11).fill(2), 5]); // (22+5)/12 = 2.25 → Lower
assert.equal(atRisk.band.label, 'Lower concern');

const orangeInts = [3, 3, 3, 2, 2, 2, 3, 3, 2, 2, 2, 3]; // sum 30 / 12 = 2.5 → Lower
assert.equal(scoreTool(bat, orangeInts).band.label, 'Lower concern');
const orange2 = [3, 3, 3, 3, 2, 2, 3, 3, 2, 2, 2, 3]; // sum 31 / 12 ≈ 2.583 → Elevated
assert.equal(scoreTool(bat, orange2).band.label, 'Elevated');
assert.equal(careTier(bat, scoreTool(bat, orange2)), 'moderate');

const high = scoreTool(bat, Array(12).fill(5));
assert.equal(high.score, 5);
assert.equal(high.band.label, 'Higher concern');
assert.equal(careTier(bat, high), 'high');

const incomplete = scoreTool(bat, [1, 1, undefined, ...Array(9).fill(1)]);
assert.equal(incomplete.complete, false);

assert.ok(getAllTools().some((t) => t.id === 'bat12'));

assert.equal(bat.questions[0].text, 'I feel mentally exhausted');
assert.equal(bat.questions[3].text, 'I struggle to find any enthusiasm for my work');

const ev = getCheckEvidence('bat12');
assert.ok(ev, 'BAT-12 evidence registered');
assert.equal(ev.evidenceSlug, 'bat-12');
assert.equal(ev.landingPath, '/burnout-check');
assert.equal(ev.wordingStatus, 'exact');
assert.equal(ev.commercialPublicWebAllowed, true);
assert.equal(ev.permissionRequired, false);
assert.equal(ev.clinicalReviewStatus, 'pending');
assert.ok(ev.clinicalReviewNotice.includes('Clinical review pending'));
assert.equal(ev.lastClinicalReview, null);
assert.equal(ev.reviewer, null);
assert.ok(ev.educationalEvidence.length >= 3);
assert.ok(getCheckEvidence('bat-12')?.toolId === 'bat12');
assert.equal(getLandingPathForTool('bat12'), '/burnout-check');
assert.ok(listCheckEvidence().some((e) => e.toolId === 'bat12'));

assert.equal(loadCheckDraft('bat12'), null);
saveCheckDraft('bat12', { answers: Array(12).fill(1), submitted: false });
clearCheckDraft('bat12');

console.log('OK — screening tools / BAT-12 / evidence registry checks passed');
