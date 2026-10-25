/**
 * Serenest Care AI — clinical triage, client acquisition & AI catalog tests.
 * Run: node scripts/test-ai-assistant.mjs
 */
import assert from 'node:assert/strict';
import {
  analyzeCareTriage,
  buildConciergeReply,
  extractLeadFromMessages,
  nextDefaultSlot,
  buildAiCareCatalog,
  renderLlmsTxt,
} from '../src/server/aiAssistant.js';

// 1. Sleep + medication inquiry -> Psychiatrist
const sleepMed = analyzeCareTriage({
  concern: 'I have not been sleeping for 3 weeks and want to know if medication or SSRI tablets would help.',
  duration: '2–4 weeks',
});
assert.equal(sleepMed.practitioner_type, 'psychiatrist');
assert.equal(sleepMed.practitioner_label, 'Psychiatrist');
assert.equal(sleepMed.crisis, false);
assert.match(sleepMed.structured_note, /Duration: 2–4 weeks/);
assert.match(sleepMed.book_path, /prole=psychiatrist/);

// 2. Work burnout -> Counsellor + BAT-12 screening suggestion
const burnout = analyzeCareTriage({
  concern: 'I feel burned out, exhausted from work stress and office deadlines.',
  duration: '1–3 months',
});
assert.equal(burnout.practitioner_type, 'counsellor');
assert.equal(burnout.suggested_screening.path, '/screening/tool/burnout-bat-12');

// 3. CBT / phobia / trauma -> Psychologist
const cbt = analyzeCareTriage({
  concern: 'Looking for structured CBT for social anxiety and phobia with a clinical psychologist.',
});
assert.equal(cbt.practitioner_type, 'psychologist');

// 4. Relationship / grief + camera-off preference -> Therapist + Audio mode
const relAudio = analyzeCareTriage({
  concern: 'Going through relationship breakup and grief, prefer voice only with camera off.',
});
assert.equal(relAudio.practitioner_type, 'therapist');
assert.equal(relAudio.mode, 'audio');
assert.match(relAudio.book_path, /mode=audio/);

// 5. Crisis safety detection -> immediate 112 / Tele-MANAS 14416 notice
const crisis = analyzeCareTriage({
  concern: 'I feel like ending my life and hurting myself tonight.',
});
assert.equal(crisis.crisis, true);
assert.match(crisis.crisis_notice, /112/);
assert.match(crisis.crisis_notice, /14416/);

// 6. Conversational concierge replies
const priceReply = buildConciergeReply([
  { role: 'user', content: 'How much does a session cost and when do I pay?' },
]);
assert.match(priceReply.reply, /₹499/);
assert.equal(priceReply.recommendation.path, '/book');

const symptomReply = buildConciergeReply([
  { role: 'user', content: 'I have insomnia and panic attacks and want to know if I need a psychiatrist' },
]);
assert.equal(symptomReply.recommendation.practitioner_type, 'psychiatrist');
assert.ok(symptomReply.recommendation.structured_note.length > 10);

const crisisChat = buildConciergeReply([
  { role: 'user', content: 'I want to kill myself' },
]);
assert.match(crisisChat.reply, /14416/);
assert.equal(crisisChat.recommendation, null);

// 7. Conversational lead extraction from chat messages
const extracted = extractLeadFromMessages([
  { role: 'user', content: 'I have been having severe sleep issues and overthinking' },
  { role: 'assistant', content: 'Share your name and 10-digit number to book.' },
  { role: 'user', content: 'Rohan Desai, +91 98765 43210' },
]);
assert.ok(extracted);
assert.equal(extracted.name, 'Rohan Desai');
assert.equal(extracted.phone, '9876543210');
assert.match(extracted.concern, /sleep issues/);

// 8. Next default slot & AI catalog / llms.txt (Care only, no Academy)
const slot = nextDefaultSlot(new Date('2026-10-25T05:00:00Z'));
assert.ok(slot.date);
assert.ok(slot.time);

const catalog = buildAiCareCatalog('https://www.serenest.in');
assert.equal(catalog.organization.starting_fee_inr, 499);
assert.equal(catalog.specialists.length, 4);
assert.ok(catalog.ai_endpoints.acquire);

const llmsTxt = renderLlmsTxt('https://www.serenest.in');
assert.match(llmsTxt, /Serenest/);
assert.match(llmsTxt, /\/api\/assistant\/acquire/);
assert.doesNotMatch(llmsTxt, /\/academy/i);

console.log('ai-assistant helpers: ok');
