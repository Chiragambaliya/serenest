/**
 * AI-powered social media content generator for Serenest.
 * Uses Claude to produce platform-native posts based on brand context,
 * pillar rotation, and what has already been posted.
 */

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const BRAND_CONTEXT = `
BRAND: Serenest (Serenest Education Pvt Ltd, serenest.in)
TAGLINE: Doctor-led mental healthcare & professional education
AUDIENCE:
  - Instagram: Urban Indians 20–45 dealing with stress, anxiety, depression, or supporting someone who is
  - LinkedIn: Mental health professionals, HR/L&D managers, psychology students, corporates

SERVICES:
  - Online psychiatry, therapy, counselling — ₹800–₹2,500/session, pay-per-session, no subscription
  - Conditions: Depression, Anxiety, ADHD, OCD
  - Free tools: PHQ-9 (depression screening), GAD-7 (anxiety screening) at serenest.in/screening
  - Formats: Video, audio, or chat sessions

ACADEMY (serenest.in/academy):
  - Certificate in Counselling Skills (6 weeks, 12 modules)
  - Certificate in Clinical Psychology (8 weeks, 16 modules)
  - Certificate in Digital Mental Health (4 weeks, 8 modules)
  - Fellowship in Telepsychiatry (12 weeks, 24 modules)
  - Plus: 1:1 mentorship, placement guidance, CV review

BRAND VOICE: Warm, clear, clinically grounded. Never dismissive. Never preachy.
  Speaks to the real experience, not the ideal. Honest about complexity.
  Never sensationalise. Never claim to diagnose or cure. Always adds a helpline
  if crisis content: iCall 9152987821.

CRISIS RULE: Any post touching on self-harm or suicide MUST include iCall number.
`.trim();

const CONTENT_PILLARS = [
  { id: 'educate',     label: 'Educate',          ig: true,  li: true  },
  { id: 'normalize',   label: 'Normalise / Destigmatize', ig: true,  li: false },
  { id: 'convert',     label: 'Convert (CTA)',     ig: true,  li: true  },
  { id: 'authority',   label: 'Build Authority',   ig: false, li: true  },
  { id: 'academy',     label: 'Academy',           ig: true,  li: true  },
  { id: 'corporate',   label: 'Corporate Wellness',ig: false, li: true  },
  { id: 'recruitment', label: 'Clinician Recruitment', ig: false, li: true },
];

const IG_HASHTAG_SETS = {
  care:    '#MentalHealth #MentalHealthIndia #AnxietyAwareness #DepressionSupport #OnlineTherapy #TelepsychiatryIndia',
  academy: '#PsychologyStudents #MentalHealthEducation #ClinicalPsychology #CounsellingIndia',
  corp:    '#WorkplaceWellness #EmployeeMentalHealth #HRIndia #BurnoutPrevention',
  brand:   '#SerenestMind #MindMatters #YouAreNotAlone #BreakTheStigma',
};

/**
 * Generate a week of social posts.
 * @param {{ weekNumber: number, startDate: string, recentTopics: string[], focus?: string }} opts
 * @returns {{ posts: Array<{platform, caption, hashtags, image_brief, scheduled_at}> }}
 */
export async function generateWeekOfPosts({ weekNumber, startDate, recentTopics = [], focus = null }) {
  const start = new Date(startDate);

  // Build the 6 scheduled slots
  const slots = buildSlots(start);
  const topicsStr = recentTopics.length
    ? `Recently covered topics (do NOT repeat): ${recentTopics.join(', ')}`
    : 'No prior topics — this is the first week.';

  const focusStr = focus ? `This week's theme or focus: ${focus}` : 'Choose an engaging theme for this week.';

  const prompt = `You are the social media content strategist and copywriter for Serenest, an Indian mental health platform.

${BRAND_CONTEXT}

${topicsStr}
${focusStr}

Generate exactly 6 social media posts for Week ${weekNumber}. Use this exact slot schedule:
${slots.map((s, i) => `  ${i + 1}. ${s.platform} — ${s.dayLabel} ${s.timeLabel} IST — Pillar suggestion: ${s.pillar}`).join('\n')}

INSTAGRAM POSTS (slots 1, 3, 5):
- Hook: First 2 lines must stop the scroll. Use a question, a stat, or a provocative truth.
- Body: 3–6 short paragraphs or bullet points. Conversational. No jargon.
- CTA: End with a single clear action (link in bio / serenest.in / free screening).
- Length: 150–280 words
- Tone: Warm, direct, human. Write like a friend who happens to be a doctor.

LINKEDIN POSTS (slots 2, 4, 6):
- Hook: First 1–2 lines must compel a professional to stop scrolling.
- Body: Data, insight, or a pattern that a thoughtful professional would find valuable.
- CTA: Subtle — invite a conversation, DM, or visit.
- Length: 180–300 words
- Tone: Authoritative but not stiff. Like a respected clinician writing to peers.
- NO hashtags on LinkedIn.

Return ONLY valid JSON in this exact shape — no markdown, no explanation:
{
  "theme": "string — one-line theme for this week",
  "posts": [
    {
      "slot": 1,
      "platform": "instagram" | "linkedin",
      "pillar": "string",
      "caption": "full post text",
      "hashtags": "string or null",
      "image_brief": "1-sentence visual description for the designer",
      "scheduled_at": "ISO 8601 datetime string"
    }
  ]
}`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = message.content[0].text.trim();
  // Strip markdown code fences if present
  const jsonStr = raw.replace(/^```(?:json)?\n?/,'').replace(/\n?```$/,'');
  const parsed = JSON.parse(jsonStr);

  // Attach actual scheduled_at from our slot calculations
  parsed.posts = parsed.posts.map((p, i) => ({
    ...p,
    scheduled_at: slots[i].iso,
    status: 'scheduled',
  }));

  return parsed;
}

function buildSlots(startMonday) {
  const d = new Date(startMonday);
  // Ensure we start on a Monday
  const day = d.getDay();
  if (day !== 1) {
    const diff = (1 - day + 7) % 7;
    d.setDate(d.getDate() + diff);
  }

  const slots = [];
  const schedule = [
    { offset: 0, platform: 'instagram', hour: 9,  pillar: 'Educate or Normalize' },
    { offset: 1, platform: 'linkedin',  hour: 8,  pillar: 'Authority or Academy' },
    { offset: 2, platform: 'instagram', hour: 9,  pillar: 'Normalize or Destigmatize' },
    { offset: 3, platform: 'linkedin',  hour: 8,  pillar: 'Corporate or Recruitment' },
    { offset: 4, platform: 'instagram', hour: 9,  pillar: 'Convert (CTA + pricing/screening)' },
    { offset: 5, platform: 'linkedin',  hour: 8,  pillar: 'Thought Leadership' },
  ];

  for (const s of schedule) {
    const dt = new Date(d);
    dt.setDate(dt.getDate() + s.offset);
    dt.setHours(s.hour, 0, 0, 0);
    const iso = dt.toISOString();
    const dayLabel = dt.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' });
    slots.push({
      platform: s.platform,
      pillar: s.pillar,
      hour: s.hour,
      dayLabel,
      timeLabel: `${s.hour}:00`,
      iso,
    });
  }

  return slots;
}
