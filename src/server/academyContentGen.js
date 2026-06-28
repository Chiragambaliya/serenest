/**
 * AI-powered academy content generator for Serenest.
 * Uses Claude to produce announcements, program updates, and events
 * for the academy_content table displayed on serenest.in/academy.
 */

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const ACADEMY_CONTEXT = `
ACADEMY: Serenest Academy (serenest.in/academy)
OPERATOR: Serenest Education Pvt Ltd
AUDIENCE: Psychology students, practising counsellors, HR/L&D professionals, aspiring mental health practitioners in India

PROGRAMS:
- Certificate in Counselling Skills (6 weeks, 12 modules) — foundational communication, empathy, CBT basics
- Certificate in Clinical Psychology (8 weeks, 16 modules) — assessment, diagnosis, case conceptualisation
- Certificate in Digital Mental Health (4 weeks, 8 modules) — teletherapy, digital tools, platform ethics
- Fellowship in Telepsychiatry (12 weeks, 24 modules) — advanced clinical training for psychiatry trainees
- All include: 1:1 mentorship, placement guidance, CV review

TONE: Encouraging but professional. Warm, direct. Never overhype. Accurate about time commitment.
Never promise outcomes you can't guarantee. Keep language plain and relatable — avoid corporate speak.
GOAL: Attract enrollments, motivate current learners, showcase outcomes.
`.trim();

const CONTENT_TYPES = {
  announcement: 'General updates, new features, team news, industry recognition',
  program_update: 'Curriculum changes, new modules, cohort dates, pricing updates, enrollment open/close',
  event: 'Webinars, live sessions, Q&A calls, guest lectures, workshops',
};

/**
 * Generate a batch of academy content items.
 * @param {{ focus?: string, count?: number, types?: string[] }} opts
 * @returns {{ items: Array<{type, title, body, link, link_label, pinned}> }}
 */
export async function generateAcademyContent({ focus = null, count = 4, types = ['announcement', 'program_update', 'event'] }) {
  const typeDesc = types.map((t) => `  - ${t}: ${CONTENT_TYPES[t]}`).join('\n');
  const focusStr = focus ? `This batch's theme or context: ${focus}` : 'Choose a mix of relevant, timely topics.';

  const prompt = `You are the content manager for Serenest Academy, an Indian mental health education platform.

${ACADEMY_CONTEXT}

${focusStr}

Generate exactly ${count} academy content items. Choose from these types as appropriate:
${typeDesc}

Rules:
- Title: 6–14 words, specific and action-oriented, no exclamation marks
- Body: 20–50 words, plain language, what it means for the reader
- Link: use a realistic relative URL (/academy/program/counselling-skills, /academy/learn, etc.) or null
- Link_label: 3–6 words (e.g. "Enroll now", "Join the webinar", "Read the update") or null if no link
- Pinned: true only for the single most important item in this batch, false for the rest
- Vary the types — don't return 4 of the same type
- Reflect real Indian mental health education context

Return ONLY valid JSON — no markdown, no explanation:
{
  "items": [
    {
      "type": "announcement" | "program_update" | "event",
      "title": "string",
      "body": "string",
      "link": "string or null",
      "link_label": "string or null",
      "pinned": boolean
    }
  ]
}`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = message.content[0].text.trim();
  const jsonStr = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  return JSON.parse(jsonStr);
}
