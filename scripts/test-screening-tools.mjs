/**
 * Screening engine + Mental Health Check launch registry checks.
 * Run: node scripts/test-screening-tools.mjs
 */
import assert from 'node:assert/strict';
import {
  getTool,
  scoreTool,
  careTier,
  maxScore,
  getAllTools,
  toolsForCategory,
  isToolPaused,
} from '../src/lib/screeningTools.js';
import {
  getCheckEvidence,
  listCheckEvidence,
  getLandingPathForTool,
  PENDING_REVIEW_NOTICE,
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
assert.equal(ev.clinicalReviewNotice, PENDING_REVIEW_NOTICE);
assert.equal(ev.lastClinicalReview, null);
assert.equal(ev.reviewer, null);
assert.ok(ev.educationalEvidence.length >= 3);
assert.ok(getCheckEvidence('bat-12')?.toolId === 'bat12');
assert.equal(getLandingPathForTool('bat12'), '/burnout-check');
assert.ok(listCheckEvidence().some((e) => e.toolId === 'bat12'));

assert.equal(loadCheckDraft('bat12'), null);
saveCheckDraft('bat12', { answers: Array(12).fill(1), submitted: false });
clearCheckDraft('bat12');

// ---------------------------------------------------------------------------
// PSS-10 pause: withheld from public listings but definition retained.
const pss = getTool('pss-10');
assert.ok(pss, 'PSS-10 definition retained (not deleted)');
assert.equal(pss.status, 'paused');
assert.ok(isToolPaused(pss));
assert.ok(pss.pausedMessage.includes('temporarily unavailable'));
assert.ok(!getAllTools().some((t) => t.id === 'pss10'), 'paused tool hidden from listings');
assert.ok(!toolsForCategory('stress').some((t) => t.id === 'pss10'), 'paused tool hidden from category filters');
assert.ok(!toolsForCategory('all').some((t) => t.id === 'pss10'));

// ---------------------------------------------------------------------------
// Clinical wording corrections.
const phq = getTool('phq9');
const phqBands = phq.bands.map((b) => b.desc).join(' ');
assert.ok(!/active treatment is recommended/i.test(phqBands), 'no score-based treatment directive');
assert.ok(!/possibly medication/i.test(phqBands), 'no score-based medication advice');
assert.ok(phq.bands[0].desc.includes('does not rule out'), 'PHQ-9 minimal band avoids false reassurance');
assert.ok(phq.bands[3].desc.includes('clinical assessment is recommended'));

const gad = getTool('gad7');
assert.ok(gad.bands[0].desc.includes('minimal anxiety range'), 'GAD-7 minimal band reworded');
assert.ok(!/normal range/i.test(gad.bands[0].desc));

const k10 = getTool('k10');
assert.equal(k10.bands[0].label, 'Lower distress range');
assert.ok(k10.bands[0].desc.includes('does not rule out'));

const pcl = getTool('pcl5');
assert.equal(pcl.bands[1].label, 'Above a provisional PTSD screening threshold');
assert.ok(pcl.bands[1].desc.includes('not a PTSD diagnosis'));
assert.ok(pcl.limitationNote.includes('structured clinical interview'));
assert.equal(careTier(pcl, scoreTool(pcl, Array(20).fill(2))), 'high', 'PCL-5 high band still routes to high care tier');

const asrs = getTool('asrs');
assert.equal(asrs.positiveBand.label, 'Positive adult ADHD screen');
assert.ok(asrs.positiveBand.desc.includes('does not confirm ADHD'));
assert.ok(asrs.ageNote.includes('18 years and above'));
assert.ok(asrs.attribution.includes('World Health Organization'));
// Official ASRS Part A scoring unchanged: 4+ shaded items = positive.
const asrsPositive = scoreTool(asrs, [2, 2, 2, 3, 0, 0]);
assert.equal(asrsPositive.positive, true);
assert.equal(asrsPositive.band.label, 'Positive adult ADHD screen');
const asrsNegative = scoreTool(asrs, [2, 2, 2, 0, 0, 0]);
assert.equal(asrsNegative.positive, false);

// ---------------------------------------------------------------------------
// Evidence governance: every live tool has a complete evidence record.
const REQUIRED_EVIDENCE_FIELDS = [
  'officialName',
  'authors',
  'primaryPaper',
  'licensingStatus',
  'scoringMethod',
  'thresholdSource',
  'ageGroup',
  'limitations',
  'indianNorms',
  'clinicalReviewStatus',
  'clinicalReviewNotice',
];
for (const tool of getAllTools()) {
  const record = getCheckEvidence(tool.id);
  assert.ok(record, `evidence record exists for ${tool.id}`);
  for (const field of REQUIRED_EVIDENCE_FIELDS) {
    assert.ok(record[field] !== undefined && record[field] !== '', `${tool.id} evidence has ${field}`);
  }
  assert.ok('lastClinicalReview' in record, `${tool.id} evidence has lastClinicalReview`);
  assert.ok('reviewer' in record, `${tool.id} evidence has reviewer`);
  assert.equal(record.clinicalReviewStatus, 'pending');
  assert.equal(record.clinicalReviewNotice, PENDING_REVIEW_NOTICE);
}

console.log('OK — screening tools / pause / wording / evidence registry checks passed');
