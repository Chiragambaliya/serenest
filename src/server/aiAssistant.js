/**
 * Serenest AI Care Engine — Hybrid Clinical Triage & Concierge
 *
 * Endpoints:
 *   POST /api/assistant/triage — AI-guided care matching & clinician intake note builder
 *   POST /api/assistant/chat   — Conversational care concierge with action deep-links
 *
 * Uses OpenAI (`OPENAI_API_KEY` + optional `OPENAI_MODEL`) when configured and
 * automatically falls back to the built-in Serenest Clinical Triage & Concierge
 * model so the AI experience works out-of-the-box in every environment.
 *
 * Strictly non-diagnostic: never diagnoses, prescribes, or replaces emergency care.
 */

import { formatSiteGuideForPrompt } from './siteGuideRoutes.js';

const MAX_MESSAGES = 24;
const MAX_CONTENT_LEN = 3500;
const DEFAULT_MODEL = 'gpt-4o-mini';

const VALID_ROLES = ['psychiatrist', 'psychologist', 'therapist', 'counsellor'];
const VALID_MODES = ['video', 'audio', 'chat'];

const ROLE_META = {
  psychiatrist: {
    id: 'psychiatrist',
    label: 'Psychiatrist',
    badge: 'Medical assessment · prescriptions',
    summary: 'MD medical doctor for diagnosis, biological symptoms, sleep/appetite shifts, and medication evaluation.',
  },
  psychologist: {
    id: 'psychologist',
    label: 'Psychologist',
    badge: 'Structured clinical therapy · CBT/ACT',
    summary: 'Clinical specialist in structured assessment and evidence-based therapy (CBT, exposure, trauma-informed care).',
  },
  therapist: {
    id: 'therapist',
    label: 'Therapist',
    badge: 'Ongoing talk therapy · patterns & relationships',
    summary: 'Dedicated space to work through anxiety, mood patterns, relationships, grief, or sustained emotional load.',
  },
  counsellor: {
    id: 'counsellor',
    label: 'Counsellor',
    badge: 'Supportive check-in · stress & burnout',
    summary: 'Goal-focused, approachable first conversation for work stress, burnout, life transitions, or clarity.',
  },
};

const CRISIS_PATTERNS = [
  /\b(suicid(e|al)|kill\s+myself|end\s+my\s+life|want\s+to\s+die|better\s+off\s+dead)\b/i,
  /\b(self[- ]?harm|hurt(ing)?\s+myself|cut(ting)?\s+myself|overdos(e|ing))\b/i,
  /\b(immediate\s+danger|can'?t\s+keep\s+myself\s+safe|ending\s+it\s+all)\b/i,
];

const SYMPTOM_SIGNALS = [
  {
    id: 'medication_or_medical',
    label: 'Medication or medical evaluation',
    role: 'psychiatrist',
    weight: 4,
    regex: /\b(medicat(e|ion|ions)|medicine|prescri(be|ption)|antidepressant|ssri|tablet|dose|dosage|side\s+effect|psychiatrist|diagnos(e|is)|bipolar|psychosis|hallucinat|mania|manic|schizophren)\b/i,
  },
  {
    id: 'sleep_or_somatic',
    label: 'Sleep, appetite, or physical toll',
    role: 'psychiatrist',
    weight: 3,
    regex: /\b(insomnia|can'?t\s+sleep|not\s+sleeping|waking\s+up|sleep\s+schedule|oversleep|appetite|weight\s+(loss|gain)|panic\s+attack|heart\s+racing|chest\s+tight|trembl|palpitat)\b/i,
  },
  {
    id: 'adhd_or_ocd',
    label: 'Attention (ADHD) or OCD patterns',
    role: 'psychiatrist',
    weight: 3,
    regex: /\b(adhd|add\b|attention|hyperactiv|inattent|intrusive\s+thought|compulsi(on|ve)|ocd\b|rituals?|checking\s+over)\b/i,
  },
  {
    id: 'addiction_or_substance',
    label: 'Substance use or recovery support',
    role: 'psychiatrist',
    weight: 3,
    regex: /\b(alcohol|drinking|addict(ed|ion)|substance|withdrawal|craving|relapse|smoking|nicotine|cannabis|weed)\b/i,
  },
  {
    id: 'severe_mood',
    label: 'Persistent low mood or numbness',
    role: 'psychiatrist',
    weight: 2,
    regex: /\b(depress(ed|ion)|hopeless|empty|numb|crying\s+all|can'?t\s+get\s+out\s+of\s+bed|months?\s+of|no\s+energy|worthless)\b/i,
  },
  {
    id: 'cbt_or_structured',
    label: 'Structured therapy (CBT / clinical patterns)',
    role: 'psychologist',
    weight: 3,
    regex: /\b(cbt\b|cognitive|behavioural|behavioral|psychologist|phobia|social\s+anxiety|health\s+anxiety|ptsd|trauma|flashback|nightmare|testing| psychometric)\b/i,
  },
  {
    id: 'anxiety_and_worry',
    label: 'Anxiety, overthinking, or worry',
    role: 'therapist',
    weight: 2,
    regex: /\b(anxiet(y|ies)|anxious|overthink(ing)?|racing\s+thoughts?|worry|worrying|nervous|on\s+edge|restless|spiral(ling)?|dread)\b/i,
  },
  {
    id: 'relationships_or_grief',
    label: 'Relationships, family, or grief',
    role: 'therapist',
    weight: 3,
    regex: /\b(relationship|marriage|partner|couple|breakup|divorce|family|parents?|grief|loss|bereave|lonel(y|iness)|attachment|boundaries|childhood|therapy|therapist)\b/i,
  },
  {
    id: 'burnout_or_stress',
    label: 'Work stress, burnout, or exhaustion',
    role: 'counsellor',
    weight: 3,
    regex: /\b(burnout|burned\s+out|burnt\s+out|work\s+stress|office|job|career|exam|study|academic|overwhelm(ed)?|exhaust(ed|ion)|drained|motivation|procrastinat|confused|first\s+time)\b/i,
  },
];

function detectCrisis(text) {
  if (!text) return false;
  return CRISIS_PATTERNS.some((re) => re.test(text));
}

function inferModePreference(text, explicitMode) {
  if (explicitMode && VALID_MODES.includes(explicitMode)) {
    return {
      mode: explicitMode,
      modeReason:
        explicitMode === 'audio'
          ? 'Audio call selected — voice-only, no camera required.'
          : explicitMode === 'chat'
            ? 'Secure text consultation selected — quiet, camera-free messaging.'
            : 'Video consultation selected — face-to-face clinical session from home.',
    };
  }
  const lower = (text || '').toLowerCase();
  if (/\b(no\s+camera|camera\s+off|voice\s+only|audio|phone\s+call|shy\s+on\s+video|low\s+bandwidth)\b/.test(lower)) {
    return {
      mode: 'audio',
      modeReason: 'Audio consultation fits well when you prefer a private voice-only session without turning on your camera.',
    };
  }
  if (/\b(chat|text\s+only|typing|type|can'?t\s+talk\s+out\s+loud|shared\s+room|quiet)\b/.test(lower)) {
    return {
      mode: 'chat',
      modeReason: 'Chat consultation lets you message your clinician privately when speaking aloud is difficult.',
    };
  }
  return {
    mode: 'video',
    modeReason: 'Video is our standard first-session format so your clinician can read cues and build rapport naturally.',
  };
}

function inferSuggestedScreening(matchedIds, text) {
  const lower = (text || '').toLowerCase();
  if (matchedIds.includes('burnout_or_stress') || /burnout|exhaust|work/.test(lower)) {
    return {
      path: '/screening/tool/burnout-bat-12',
      label: 'BAT-12 Burnout Check (3 min)',
    };
  }
  if (matchedIds.includes('adhd_or_ocd') && /adhd|attention|focus/.test(lower)) {
    return {
      path: '/adhd-assessment-online-india',
      label: 'Adult ADHD Care Guide',
    };
  }
  if (matchedIds.includes('anxiety_and_worry') || /anxiet|worry|panic/.test(lower)) {
    return {
      path: '/gad-7-anxiety-screening',
      label: 'GAD-7 Anxiety Check (2 min)',
    };
  }
  if (matchedIds.includes('severe_mood') || /depress|mood|low/.test(lower)) {
    return {
      path: '/phq-9-depression-screening',
      label: 'PHQ-9 Mood Check (2 min)',
    };
  }
  return {
    path: '/screening/pathway/mood-anxiety',
    label: 'Guided Mood & Anxiety Check (PHQ-9 + GAD-7)',
  };
}

/**
 * Pure deterministic clinical triage & intake structurer.
 * Used both as primary fast path and as guaranteed fallback when OpenAI is unset.
 */
export function analyzeCareTriage({
  concern = '',
  goal = '',
  duration = '',
  preferredMode = '',
  screening = '',
} = {}) {
  const combined = [concern, goal, duration, screening].filter(Boolean).join(' ').trim();
  const isCrisis = detectCrisis(combined);

  const scores = {
    psychiatrist: 0,
    psychologist: 0,
    therapist: 0,
    counsellor: 0,
  };
  const matchedSignals = [];

  for (const sig of SYMPTOM_SIGNALS) {
    if (sig.regex.test(combined)) {
      scores[sig.role] += sig.weight;
      matchedSignals.push(sig);
    }
  }

  // Duration weighting: longer-standing symptoms lean toward psychiatrist/psychologist
  if (/\b(months?|years?|long\s+time|chronic|getting\s+worse)\b/i.test(combined)) {
    scores.psychiatrist += 1;
    scores.psychologist += 1;
  }

  // Screening severity weighting if PHQ/GAD scores are present in text
  const phqMatch = combined.match(/phq[- ]?9[:\s]*(\d+)/i);
  const gadMatch = combined.match(/gad[- ]?7[:\s]*(\d+)/i);
  const phqVal = phqMatch ? Number(phqMatch[1]) : 0;
  const gadVal = gadMatch ? Number(gadMatch[1]) : 0;
  if (phqVal >= 15 || gadVal >= 15) scores.psychiatrist += 4;
  else if (phqVal >= 10 || gadVal >= 10) scores.psychologist += 3;

  // Pick winning role; default to therapist if conversational, psychiatrist if medical, counsellor if first check-in
  let bestRole = 'therapist';
  let bestScore = -1;
  for (const role of VALID_ROLES) {
    if (scores[role] > bestScore) {
      bestScore = scores[role];
      bestRole = role;
    }
  }
  if (bestScore === 0) {
    bestRole = combined.length > 0 ? 'therapist' : 'psychiatrist';
  }

  // Secondary role alternative
  const sortedRoles = [...VALID_ROLES].sort((a, b) => scores[b] - scores[a]);
  const alternativeRole = sortedRoles.find((r) => r !== bestRole) || 'psychiatrist';

  const { mode, modeReason } = inferModePreference(combined, preferredMode);
  const matchedLabels = matchedSignals.slice(0, 3).map((s) => s.label);
  const matchedIds = matchedSignals.map((s) => s.id);

  const roleMeta = ROLE_META[bestRole];
  const altMeta = ROLE_META[alternativeRole];

  let rationale;
  if (bestRole === 'psychiatrist') {
    rationale = matchedLabels.length
      ? `Because you mentioned ${matchedLabels.join(' and ').toLowerCase()}, starting with a Psychiatrist (MD) is the safest fit. They can evaluate medical and biological contributors, discuss whether prescription treatment is helpful, and coordinate therapy if needed.`
      : 'A Psychiatrist (MD) can provide a comprehensive clinical evaluation, clarify what is driving your symptoms, and discuss both medical and therapeutic options.';
  } else if (bestRole === 'psychologist') {
    rationale = matchedLabels.length
      ? `What you shared points toward ${matchedLabels.join(' and ').toLowerCase()}. A Clinical Psychologist is well-suited for structured assessment and evidence-based frameworks like CBT.`
      : 'A Clinical Psychologist offers structured assessment and evidence-based therapy to help you map patterns and build practical coping tools.';
  } else if (bestRole === 'counsellor') {
    rationale = matchedLabels.length
      ? `For ${matchedLabels.join(' and ').toLowerCase()}, a Counsellor offers a calm, supportive first session to unpack current stressors, restore footing, and decide next steps.`
      : 'A Counsellor provides a warm, structured first conversation to sort through what you are carrying without pressure.';
  } else {
    rationale = matchedLabels.length
      ? `Given your focus on ${matchedLabels.join(' and ').toLowerCase()}, a Therapist gives you space to work through thoughts, emotions, and day-to-day patterns at your own pace.`
      : 'A Therapist offers a private, collaborative space to talk through what you are experiencing and clarify what support helps most.';
  }

  // Build a clean, clinician-ready intake note
  const cleanedConcern = concern.trim().replace(/\s+/g, ' ');
  const noteParts = [];
  if (cleanedConcern) {
    const clipped = cleanedConcern.length > 260 ? `${cleanedConcern.slice(0, 257)}...` : cleanedConcern;
    noteParts.push(`What I'm experiencing: ${clipped}`);
  } else if (matchedLabels.length) {
    noteParts.push(`Focus areas: ${matchedLabels.join(', ')}.`);
  }
  if (duration && duration.trim()) {
    noteParts.push(`Duration: ${duration.trim()}.`);
  }
  if (goal && goal.trim()) {
    noteParts.push(`What I'd like from this session: ${goal.trim()}.`);
  } else {
    noteParts.push(
      bestRole === 'psychiatrist'
        ? 'Goal: Clinical assessment and guidance on treatment options (including whether medication or therapy is appropriate).'
        : `Goal: Initial ${roleMeta.label.toLowerCase()} consultation to understand patterns and practical next steps.`,
    );
  }
  if (screening && screening.trim()) {
    noteParts.push(screening.trim());
  }

  const structuredNote = noteParts.join('\n');
  const suggestedScreening = inferSuggestedScreening(matchedIds, combined);

  const bookParams = new URLSearchParams({
    prole: bestRole,
    mode,
  });

  return {
    crisis: isCrisis,
    crisis_notice: isCrisis
      ? 'If you or someone else is in immediate danger or thinking about self-harm, please call 112 / 108 or reach India’s 24×7 Tele-MANAS helpline at 14416 immediately. Serenest appointments are scheduled care and not an emergency service.'
      : null,
    practitioner_type: bestRole,
    practitioner_label: roleMeta.label,
    practitioner_badge: roleMeta.badge,
    practitioner_summary: roleMeta.summary,
    alternative_type: alternativeRole,
    alternative_label: altMeta.label,
    mode,
    mode_reason: modeReason,
    focus_tags: matchedLabels.length ? matchedLabels : ['Initial clinical consultation'],
    rationale,
    structured_note: structuredNote,
    suggested_screening: suggestedScreening,
    book_path: `/book?${bookParams.toString()}`,
    disclaimer: 'AI care matching helps you pick a starting point and prepare your note — it is not a medical diagnosis. Your clinician can always redirect if another specialist is a better fit.',
  };
}

/**
 * Deterministic conversational concierge fallback so `/api/assistant/chat`
 * always responds helpfully even when OPENAI_API_KEY is not configured.
 */
export function buildConciergeReply(messages = [], context = {}) {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
  const lower = lastUser.toLowerCase();

  if (detectCrisis(lastUser)) {
    return {
      reply:
        'I hear how heavy things feel right now. Because Serenest is a scheduled outpatient service and not an emergency line, please reach immediate support first:\n\n' +
        '• **Emergency (India):** Call **112** or **108**\n' +
        '• **Tele-MANAS (24×7 Govt. mental health helpline):** **14416** or **1800-891-4416**\n' +
        '• Or go to the nearest hospital emergency department.\n\n' +
        'Once you are safe and ready for a scheduled consultation, our care team is here at **/book** or on WhatsApp at **+91 77779 36367**.',
      recommendation: null,
      suggestions: [
        'View emergency disclaimer (/emergency-disclaimer)',
        'How does a scheduled psychiatrist visit work?',
      ],
    };
  }

  // Pricing / fees / payment questions
  if (/\b(price|pricing|fee|fees|cost|charge|pay|payment|razorpay|refund|how\s+much)\b/.test(lower)) {
    return {
      reply:
        'Here is how fees and payment work on Serenest:\n\n' +
        '• **Request first, pay after confirmation:** Submitting a booking request at **/book** is free. Our care team confirms your clinician and time slot by phone or WhatsApp first — you only pay once the slot is locked.\n' +
        '• **Session fees:** Standard consultations start at **₹499** (and vary by clinician experience and session length, shown upfront on **/pricing** and **/patient/find-professional**).\n' +
        '• **Self-screening:** All check-ins at **/screening** (PHQ-9, GAD-7, BAT-12 Burnout Check) are **100% free** and stay on your device.',
      recommendation: {
        label: 'Request a slot (pay after confirmation)',
        path: '/book',
        secondary_label: 'See full fee guide',
        secondary_path: '/pricing',
      },
      suggestions: [
        'Help me choose between a psychiatrist and therapist',
        'Can a psychiatrist send a valid prescription online?',
        'Take a free 2-minute mood & anxiety check',
      ],
    };
  }

  // Prescription / medication legality questions
  if (/\b(prescri(be|ption)|valid\s+rx|telemedicine\s+guideline|schedule\s+h|medicine\s+online)\b/.test(lower)) {
    return {
      reply:
        'Yes — **Psychiatrists (MD)** on Serenest can issue legally valid digital prescriptions after a live video consultation, in compliance with India’s **Telemedicine Practice Guidelines**.\n\n' +
        '• **When prescriptions are issued:** Only when clinically appropriate after a direct psychiatric evaluation.\n' +
        '• **Regulated medicines:** Certain habit-forming or restricted (Schedule X / narcotic) medications cannot be prescribed online under Indian law.\n' +
        '• **How to book:** Choose **Psychiatrist** and **Video** mode on **/book**.',
      recommendation: {
        label: 'Book a Psychiatrist video consultation',
        path: '/book?prole=psychiatrist&mode=video',
        secondary_label: 'Read prescription rules',
        secondary_path: '/online-psychiatrist-prescription-india',
      },
      suggestions: [
        'I have sleep & anxiety issues — match my care',
        'How much does a consultation cost?',
        'What is the difference between a psychiatrist and psychologist?',
      ],
    };
  }

  // Screening / self-check questions
  if (/\b(screen(ing)?|check[- ]?in|phq|gad|test|assess(ment)?\s+tool|not\s+sure\s+if\s+i\s+need)\b/.test(lower)) {
    return {
      reply:
        'If you are not sure whether to book yet, start with a **private 2–3 minute check-in** at **/screening**:\n\n' +
        '• **Guided Mood & Anxiety Pathway (PHQ-9 + GAD-7):** Best general starting point for low mood, worry, or restlessness.\n' +
        '• **Burnout Check (BAT-12):** Built for sustained work exhaustion and mental distance.\n' +
        '• **Privacy:** Answers are scored in your browser and never sold. At the end, you can carry your result straight into **/book** with one tap.',
      recommendation: {
        label: 'Start a free private check-in',
        path: '/screening',
        secondary_label: 'Skip to booking',
        secondary_path: '/book',
      },
      suggestions: [
        'Help me choose: psychiatrist or therapist?',
        'I feel exhausted from work stress',
        'How does booking confirmation work?',
      ],
    };
  }

  // Difference between clinician types OR symptom description -> run triage!
  const triage = analyzeCareTriage({ concern: lastUser, preferredMode: context?.mode });
  const hasSymptomSignal = triage.focus_tags[0] !== 'Initial clinical consultation' || /\b(who\s+should\s+i\s+see|psychiatrist\s+or\s+therapist|difference\s+between|help\s+me\s+choose|match\s+me|recommend)\b/.test(lower);

  if (hasSymptomSignal) {
    return {
      reply:
        `Based on what you shared, here is a calm starting point:\n\n` +
        `• **Recommended clinician:** **${triage.practitioner_label}** (${triage.practitioner_badge})\n` +
        `• **Why this fits:** ${triage.rationale}\n` +
        `• **Recommended format:** **${triage.mode.charAt(0).toUpperCase() + triage.mode.slice(1)}** — ${triage.mode_reason}\n\n` +
        `You can apply this directly to your booking below, or start with the **${triage.suggested_screening.label}**.`,
      recommendation: {
        label: `Book with a ${triage.practitioner_label} (${triage.mode})`,
        path: triage.book_path,
        practitioner_type: triage.practitioner_type,
        mode: triage.mode,
        structured_note: triage.structured_note,
        secondary_label: triage.suggested_screening.label,
        secondary_path: triage.suggested_screening.path,
      },
      suggestions: [
        'How does pay-after-confirmation work?',
        'Can a psychiatrist prescribe medication online?',
        'Take a private 2-min check-in first',
      ],
    };
  }

  // General navigation / default concierge reply
  return {
    reply:
      'I can help you find the right care path on Serenest in a couple of steps:\n\n' +
      '1. **Tell me what you are going through** (e.g. trouble sleeping, work burnout, persistent anxiety, or wondering about medication) and I will match you with the right clinician type (**Psychiatrist, Psychologist, Therapist, or Counsellor**) and draft your booking note.\n' +
      '2. **Take a private check-in** at **/screening** (PHQ-9, GAD-7, or Burnout BAT-12) — free and stays on your device.\n' +
      '3. **Request a slot** at **/book** — we confirm by phone or WhatsApp before you pay.',
    recommendation: {
      label: 'Open AI-guided booking',
      path: '/book',
      secondary_label: 'Start a free check-in',
      secondary_path: '/screening',
    },
    suggestions: [
      'I have trouble sleeping and constant overthinking',
      'I feel burned out and exhausted from work',
      'Help me choose: psychiatrist vs therapist',
      'How do fees and confirmation work?',
    ],
  };
}

const SYSTEM_PROMPT = `You are **Serenest Care AI**, the clinical-care navigation and intake assistant for **Serenest** (doctor-led online psychiatry and therapy across India, serenest.in).

Your role:
1. Help visitors understand which clinician fits their needs (**Psychiatrist** for medical assessment/sleep/appetite/prescriptions/ADHD/OCD; **Psychologist** for structured CBT/assessments; **Therapist** for ongoing talk therapy & relationships; **Counsellor** for stress, burnout, or a supportive first check-in).
2. Explain Serenest's **request-first model** clearly: patients request a slot at **/book**, our team confirms by phone or WhatsApp, and payment happens **after** the slot is confirmed.
3. Point visitors to private, on-device self-checks at **/screening** (PHQ-9, GAD-7, BAT-12 Burnout Check) when they want to reflect first.
4. Keep Serenest strictly focused on **patient care and clinical mental health** (there is no Academy).

**Site map (same domain — use these paths in answers)**
${formatSiteGuideForPrompt()}

**Strict clinical safety rules**
1. You are **not** a doctor and do **not** diagnose, prescribe, or change medication doses.
2. For **immediate danger, self-harm, or medical emergencies**, tell the user to call **112** or **108**, or India's 24×7 **Tele-MANAS helpline at 14416**, or visit the nearest emergency room.
3. Keep answers concise, warm, stigma-free, and grounded in the Indian context.`;

function jsonErr(res, message, status = 400) {
  return res.status(status).json({ ok: false, error: message });
}

function sanitizeMessages(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  for (const m of raw.slice(-MAX_MESSAGES)) {
    if (!m || typeof m !== 'object') continue;
    const role = m.role === 'assistant' ? 'assistant' : m.role === 'user' ? 'user' : null;
    if (!role) continue;
    let content = typeof m.content === 'string' ? m.content.trim() : '';
    if (!content) continue;
    if (content.length > MAX_CONTENT_LEN) content = `${content.slice(0, MAX_CONTENT_LEN)}…`;
    out.push({ role, content });
  }
  return out;
}

/**
 * POST /api/assistant/triage
 * Body: { concern: string, goal?: string, duration?: string, preferredMode?: string, screening?: string }
 */
export async function handleCareTriage(req, res) {
  const {
    concern = '',
    goal = '',
    duration = '',
    preferredMode = '',
    screening = '',
  } = req.body || {};

  const cleanConcern = typeof concern === 'string' ? concern.trim().slice(0, 2000) : '';
  const cleanGoal = typeof goal === 'string' ? goal.trim().slice(0, 600) : '';
  const cleanDuration = typeof duration === 'string' ? duration.trim().slice(0, 200) : '';
  const cleanScreening = typeof screening === 'string' ? screening.trim().slice(0, 500) : '';

  if (!cleanConcern && !cleanGoal && !cleanScreening) {
    return jsonErr(res, 'Share a few words about what you would like help with so we can match your care.', 400);
  }

  // Always compute the deterministic clinical triage baseline first (also handles crisis detection)
  const baseline = analyzeCareTriage({
    concern: cleanConcern,
    goal: cleanGoal,
    duration: cleanDuration,
    preferredMode,
    screening: cleanScreening,
  });

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey || baseline.crisis) {
    return res.status(200).json({
      ok: true,
      engine: 'clinical-triage',
      triage: baseline,
    });
  }

  // Enhance rationale & structured_note with OpenAI when configured
  const model = (process.env.OPENAI_MODEL || DEFAULT_MODEL).trim();
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        response_format: { type: 'json_object' },
        max_tokens: 450,
        temperature: 0.4,
        messages: [
          {
            role: 'system',
            content:
              'You are Serenest Care AI, a non-diagnostic clinical intake assistant for an Indian telepsychiatry clinic. ' +
              'Return JSON with keys: practitioner_type ("psychiatrist"|"psychologist"|"therapist"|"counsellor"), ' +
              'mode ("video"|"audio"|"chat"), rationale (2 warm sentences, non-diagnostic), ' +
              'structured_note (first-person concise intake summary for the clinician, max 3 lines), ' +
              'focus_tags (array of up to 3 short phrases). Never diagnose or prescribe.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              concern: cleanConcern,
              goal: cleanGoal,
              duration: cleanDuration,
              preferredMode,
              screening: cleanScreening,
            }),
          },
        ],
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const parsed = JSON.parse(data?.choices?.[0]?.message?.content || '{}');
      const role = VALID_ROLES.includes(parsed.practitioner_type)
        ? parsed.practitioner_type
        : baseline.practitioner_type;
      const mode = VALID_MODES.includes(parsed.mode) ? parsed.mode : baseline.mode;
      const roleMeta = ROLE_META[role];
      return res.status(200).json({
        ok: true,
        engine: 'openai',
        triage: {
          ...baseline,
          practitioner_type: role,
          practitioner_label: roleMeta.label,
          practitioner_badge: roleMeta.badge,
          practitioner_summary: roleMeta.summary,
          mode,
          rationale: typeof parsed.rationale === 'string' && parsed.rationale.trim()
            ? parsed.rationale.trim()
            : baseline.rationale,
          structured_note: typeof parsed.structured_note === 'string' && parsed.structured_note.trim()
            ? parsed.structured_note.trim()
            : baseline.structured_note,
          focus_tags: Array.isArray(parsed.focus_tags) && parsed.focus_tags.length
            ? parsed.focus_tags.slice(0, 3).map(String)
            : baseline.focus_tags,
          book_path: `/book?prole=${encodeURIComponent(role)}&mode=${encodeURIComponent(mode)}`,
        },
      });
    }
  } catch (e) {
    console.warn('[POST /api/assistant/triage] falling back to built-in clinical engine:', e?.message);
  }

  return res.status(200).json({
    ok: true,
    engine: 'clinical-triage',
    triage: baseline,
  });
}

/**
 * POST /api/assistant/chat
 * Body: { messages: [{ role, content }], context?: { path?: string, mode?: string } }
 */
export async function handleAssistantChat(req, res) {
  const messages = sanitizeMessages(req.body?.messages);
  if (messages.length === 0) {
    return jsonErr(res, 'Send at least one message.', 400);
  }

  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  if (!lastUser) {
    return jsonErr(res, 'Include a user message.', 400);
  }

  const context = req.body?.context && typeof req.body.context === 'object' ? req.body.context : {};
  const fallback = buildConciergeReply(messages, context);

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey || detectCrisis(lastUser.content)) {
    return res.status(200).json({
      ok: true,
      engine: 'clinical-concierge',
      reply: fallback.reply,
      recommendation: fallback.recommendation,
      suggestions: fallback.suggestions,
    });
  }

  const model = (process.env.OPENAI_MODEL || DEFAULT_MODEL).trim();

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        max_tokens: 700,
        temperature: 0.55,
      }),
    });

    const raw = await response.text();
    let data;
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      data = null;
    }

    const reply = data?.choices?.[0]?.message?.content?.trim();
    if (response.ok && reply) {
      return res.status(200).json({
        ok: true,
        engine: 'openai',
        reply,
        recommendation: fallback.recommendation,
        suggestions: fallback.suggestions,
      });
    }
  } catch (e) {
    console.warn('[POST /api/assistant/chat] falling back to built-in clinical concierge:', e?.message);
  }

  return res.status(200).json({
    ok: true,
    engine: 'clinical-concierge',
    reply: fallback.reply,
    recommendation: fallback.recommendation,
    suggestions: fallback.suggestions,
  });
}
