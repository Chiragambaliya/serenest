/**
 * Serenest AI Care Engine — Hybrid Clinical Triage, Client Acquisition & Concierge
 *
 * Responsibilities:
 *   1. Match visitors to the right care specialist (Psychiatrist, Psychologist,
 *      Therapist, Counsellor) and consultation mode (video, audio, chat).
 *   2. Acquire & convert clients directly — either via one-step AI intake
 *      (`POST /api/assistant/acquire`) or conversationally inside chat when a
 *      visitor shares their name and 10-digit Indian mobile number.
 *   3. Expose machine-readable care metadata (`/llms.txt` and `/api/ai/catalog`)
 *      so external AI agents and search engines can route patients to Serenest Care.
 *
 * Strictly non-diagnostic: never diagnoses, prescribes, or replaces emergency care.
 */

import { formatSiteGuideForPrompt, SITE_GUIDE_ROUTES } from './siteGuideRoutes.js';

const MAX_MESSAGES = 24;
const MAX_CONTENT_LEN = 3500;
const DEFAULT_MODEL = 'gpt-4o-mini';

const VALID_ROLES = ['psychiatrist', 'psychologist', 'therapist', 'counsellor'];
const VALID_MODES = ['video', 'audio', 'chat'];
const SLOT_TIMES = ['10:00', '11:30', '13:00', '15:30', '17:00', '19:00'];

const ROLE_META = {
  psychiatrist: {
    id: 'psychiatrist',
    label: 'Psychiatrist',
    badge: 'Medical assessment · prescriptions',
    summary: 'MD medical doctor for diagnosis, biological symptoms, sleep/appetite shifts, and medication evaluation.',
    starting_fee_inr: 499,
  },
  psychologist: {
    id: 'psychologist',
    label: 'Psychologist',
    badge: 'Structured clinical therapy · CBT/ACT',
    summary: 'Clinical specialist in structured assessment and evidence-based therapy (CBT, exposure, trauma-informed care).',
    starting_fee_inr: 499,
  },
  therapist: {
    id: 'therapist',
    label: 'Therapist',
    badge: 'Ongoing talk therapy · patterns & relationships',
    summary: 'Dedicated space to work through anxiety, mood patterns, relationships, grief, or sustained emotional load.',
    starting_fee_inr: 499,
  },
  counsellor: {
    id: 'counsellor',
    label: 'Counsellor',
    badge: 'Supportive check-in · stress & burnout',
    summary: 'Goal-focused, approachable first conversation for work stress, burnout, life transitions, or clarity.',
    starting_fee_inr: 499,
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
    regex: /\b(insomnia|can'?t\s+sleep|not\s+sleeping|waking\s+up|sleep\s+schedule|oversleep|appetite|weight\s+(loss|gain)|panic\s+attack|heart\s+racing|chest\s+tight|trembl|palpitat|sleeping)\b/i,
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
    regex: /\b(cbt\b|cognitive|behavioural|behavioral|psychologist|phobia|social\s+anxiety|health\s+anxiety|ptsd|trauma|flashback|nightmare|testing|psychometric)\b/i,
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

function pad2(n) {
  return String(n).padStart(2, '0');
}

function localDateKey(dt) {
  return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
}

/**
 * Compute the next bookable date + time slot so AI can register a client
 * request immediately without forcing them to pick from a calendar grid.
 */
export function nextDefaultSlot(now = new Date()) {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  for (const t of SLOT_TIMES) {
    const [h, m] = t.split(':').map(Number);
    if (h * 60 + m > nowMinutes + 60) {
      const label = now.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' });
      return { date: localDateKey(now), time: t, label: `${label} · ${t}` };
    }
  }
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const label = tomorrow.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' });
  return { date: localDateKey(tomorrow), time: SLOT_TIMES[0], label: `${label} · ${SLOT_TIMES[0]}` };
}

/**
 * Extract a client's 10-digit Indian mobile number and name from a chat thread
 * when they ask the AI to book or arrange a callback directly in chat.
 */
export function extractLeadFromMessages(messages = []) {
  if (!Array.isArray(messages) || messages.length === 0) return null;
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
  if (!lastUser) return null;

  // Look for a 10-digit Indian mobile number in the latest user message
  const cleanedDigits = lastUser.replace(/[\s\-().]/g, '');
  const phoneMatch = cleanedDigits.match(/(?:\+?91|0)?([6-9]\d{9})\b/);
  if (!phoneMatch) return null;
  const phone = phoneMatch[1];

  // Try to extract name from the latest user message or earlier user messages
  let name = '';
  const namePatterns = [
    /(?:my\s+name\s+is|i\s+am|i'm|this\s+is|name\s*[:=-])\s*([A-Za-z][A-Za-z\s.]{1,40})/i,
    /^([A-Za-z][A-Za-z\s.]{1,32}?)\s*[,|\-–:/]\s*(?:\+?91[\s-]?)?[6-9]\d{4}/i,
    /(?:\+?91[\s-]?)?[6-9]\d[\d\s-]{8,11}\s*[,|\-–:/]\s*([A-Za-z][A-Za-z\s.]{1,32})$/i,
  ];

  for (const m of [...messages].reverse()) {
    if (m.role !== 'user') continue;
    for (const pat of namePatterns) {
      const hit = m.content.match(pat);
      if (hit && hit[1]) {
        const candidate = hit[1]
          .replace(/\b(and|phone|number|mobile|call|whatsapp|book|please|at|on)\b.*$/i, '')
          .trim();
        if (candidate.length >= 2 && !/^\d+$/.test(candidate)) {
          name = candidate;
          break;
        }
      }
    }
    if (name) break;
  }

  // Fallback: if message is just "Name 9876543210", strip the phone number and punctuation
  if (!name) {
    const stripped = lastUser
      .replace(/(?:\+?91[\s-]?)?[6-9][\d\s-]{8,12}/g, '')
      .replace(/\b(call\s+me|book|please|whatsapp|my\s+number|phone|mobile|is|at|on)\b/gi, '')
      .replace(/[^A-Za-z\s.]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (stripped.length >= 2 && stripped.length <= 36) {
      name = stripped;
    }
  }

  // Gather clinical concern from earlier user messages in the conversation
  const concernMessages = messages
    .filter((m) => m.role === 'user')
    .map((m) => m.content)
    .join(' ');

  return {
    name: name || 'Care Visitor',
    phone,
    concern: concernMessages,
  };
}

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
  const nextSlot = nextDefaultSlot();

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
    starting_fee_inr: roleMeta.starting_fee_inr,
    alternative_type: alternativeRole,
    alternative_label: altMeta.label,
    mode,
    mode_reason: modeReason,
    next_slot: nextSlot,
    focus_tags: matchedLabels.length ? matchedLabels : ['Initial clinical consultation'],
    rationale,
    structured_note: structuredNote,
    suggested_screening: suggestedScreening,
    book_path: `/book?${bookParams.toString()}`,
    disclaimer: 'AI care matching helps you pick a starting point and prepare your note — it is not a medical diagnosis. Your clinician can always redirect if another specialist is a better fit.',
  };
}

/**
 * Deterministic conversational concierge & client acquisition engine.
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
    const slot = nextDefaultSlot();
    return {
      reply:
        'Here is how fees and payment work on Serenest:\n\n' +
        '• **Request first, pay after confirmation:** Submitting a booking request is free. Our care team confirms your clinician and time slot by phone or WhatsApp first — you only pay once the slot is locked.\n' +
        '• **Session fees:** Standard consultations start at **₹499**.\n' +
        '• **Book right here:** Share your **name and 10-digit number** in the card below and I will lock a callback for the next open slot (**' + slot.label + '**).',
      recommendation: {
        label: 'Open full booking calendar',
        path: '/book',
        practitioner_type: 'psychiatrist',
        practitioner_label: 'Psychiatrist',
        mode: 'video',
        structured_note: 'Goal: Initial consultation — requested via Serenest Care AI.',
        secondary_label: 'See full fee guide',
        secondary_path: '/pricing',
        allow_inline_capture: true,
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
        '• **Book right here:** Enter your name and 10-digit number below and I will register a **Psychiatrist (Video)** request for you immediately.',
      recommendation: {
        label: 'Book a Psychiatrist video consultation',
        path: '/book?prole=psychiatrist&mode=video',
        practitioner_type: 'psychiatrist',
        practitioner_label: 'Psychiatrist',
        mode: 'video',
        structured_note: 'Focus areas: Medication / prescription evaluation via live video consultation.',
        secondary_label: 'Read prescription rules',
        secondary_path: '/online-psychiatrist-prescription-india',
        allow_inline_capture: true,
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
        '• Or drop your name & number below if you would like our care team to call and guide you.',
      recommendation: {
        label: 'Start a free private check-in',
        path: '/screening',
        practitioner_type: 'counsellor',
        practitioner_label: 'Counsellor',
        mode: 'video',
        structured_note: 'Goal: Exploratory first check-in — requested via Serenest Care AI.',
        secondary_label: 'Open booking page',
        secondary_path: '/book',
        allow_inline_capture: true,
      },
      suggestions: [
        'Help me choose: psychiatrist or therapist?',
        'I feel exhausted from work stress',
        'How does booking confirmation work?',
      ],
    };
  }

  // Symptom description or specialist comparison -> run clinical triage!
  const triage = analyzeCareTriage({ concern: lastUser, preferredMode: context?.mode });
  const hasSymptomSignal =
    triage.focus_tags[0] !== 'Initial clinical consultation'
    || /\b(who\s+should\s+i\s+see|psychiatrist\s+or\s+therapist|difference\s+between|help\s+me\s+choose|match\s+me|recommend|book|appointment|slot|talk\s+to\s+someone)\b/.test(lower);

  if (hasSymptomSignal) {
    return {
      reply:
        `Based on what you shared, here is your matched care plan:\n\n` +
        `• **Recommended specialist:** **${triage.practitioner_label}** (${triage.practitioner_badge})\n` +
        `• **Why this fits:** ${triage.rationale}\n` +
        `• **Format & fee:** **${triage.mode.charAt(0).toUpperCase() + triage.mode.slice(1)}** · starts at **₹${triage.starting_fee_inr}** (pay only after we confirm your slot)\n\n` +
        `Enter your **name and 10-digit number** below and I will register this request with our care team right now — or reply with your name and number in chat.`,
      recommendation: {
        label: `Customize slot on booking page`,
        path: triage.book_path,
        practitioner_type: triage.practitioner_type,
        practitioner_label: triage.practitioner_label,
        mode: triage.mode,
        structured_note: triage.structured_note,
        secondary_label: triage.suggested_screening.label,
        secondary_path: triage.suggested_screening.path,
        allow_inline_capture: true,
      },
      suggestions: [
        'How does pay-after-confirmation work?',
        'Can a psychiatrist prescribe medication online?',
        'Take a private 2-min check-in first',
      ],
    };
  }

  return {
    reply:
      'I am **Serenest Care AI** — I can match you with the right clinician and **book your appointment request right here in chat**:\n\n' +
      '1. **Tell me what you are going through** (e.g. trouble sleeping, work burnout, persistent anxiety, or wondering about medication).\n' +
      '2. I will match you with a **Psychiatrist, Psychologist, Therapist, or Counsellor** and prepare your clinician intake brief.\n' +
      '3. Share your **name + 10-digit mobile number** right here (or use the instant request card below) and I will lock in your callback — you pay nothing until our team confirms your slot.',
    recommendation: {
      label: 'Open AI-guided booking page',
      path: '/book',
      practitioner_type: 'psychiatrist',
      practitioner_label: 'Psychiatrist',
      mode: 'video',
      structured_note: 'Goal: Initial care consultation — requested via Serenest Care AI.',
      secondary_label: 'Start a free check-in',
      secondary_path: '/screening',
      allow_inline_capture: true,
    },
    suggestions: [
      'I have trouble sleeping and constant overthinking',
      'I feel burned out and exhausted from work',
      'Help me choose: psychiatrist vs therapist',
      'How do fees and confirmation work?',
    ],
  };
}

/**
 * Machine-readable AI Care Catalog (`GET /api/ai/catalog`) so external AI
 * agents and on-site workflows can inspect services, fees, screening tools,
 * and intake endpoints.
 */
export function buildAiCareCatalog(siteOrigin = 'https://www.serenest.in') {
  return {
    organization: {
      name: 'Serenest',
      legal_name: 'Serenest Education Pvt Ltd',
      domain: siteOrigin,
      focus: 'Clinical telepsychiatry, psychotherapy, counselling, and private mental health self-screening across India (Care only — no Academy).',
      billing_model: 'Request-first: patients request a slot at no upfront cost; the care team confirms clinician and timing by phone/WhatsApp before payment.',
      starting_fee_inr: 499,
      languages: ['English', 'Hindi', 'Gujarati'],
      contact: {
        phone: '+91 77779 36367',
        whatsapp: 'https://wa.me/917777936367',
        email: 'support@serenest.in',
      },
      emergency_notice: 'Not an emergency service. In India, call 112 / 108 or Tele-MANAS 14416 for immediate crisis support.',
    },
    specialists: Object.values(ROLE_META).map((r) => ({
      ...r,
      booking_url: `${siteOrigin}/book?prole=${r.id}&mode=video`,
    })),
    consultation_modes: [
      { id: 'video', label: 'Video consultation', note: 'Required for digital prescriptions under India Telemedicine Practice Guidelines.' },
      { id: 'audio', label: 'Audio consultation', note: 'Voice-only session without camera.' },
      { id: 'chat', label: 'Chat consultation', note: 'Live text session in a private thread.' },
    ],
    ai_endpoints: {
      triage: {
        method: 'POST',
        path: '/api/assistant/triage',
        description: 'Non-diagnostic clinical intake matcher: maps free-text concerns to specialist type, consultation mode, rationale, and a structured clinician intake brief.',
      },
      analyze: {
        method: 'POST',
        path: '/api/assistant/analyze',
        description: 'AI mental health pattern & screening result analyzer: produces key drivers, a 3-step action plan, specialist match, and a clinician-ready brief.',
      },
      acquire: {
        method: 'POST',
        path: '/api/assistant/acquire',
        description: 'One-step AI client acquisition: accepts patient name, 10-digit Indian mobile number, and concern; runs clinical triage and registers a pending appointment request.',
      },
      chat: {
        method: 'POST',
        path: '/api/assistant/chat',
        description: 'Conversational care concierge with automatic lead capture when a visitor shares their name and 10-digit mobile number.',
      },
    },
    routes: SITE_GUIDE_ROUTES.map((r) => ({
      url: `${siteOrigin}${r.path}`,
      path: r.path,
      label: r.label,
    })),
  };
}

/**
 * Plain-text `/llms.txt` specification for AI search engines & LLM agents.
 */
export function renderLlmsTxt(siteOrigin = 'https://www.serenest.in') {
  return [
    '# Serenest — Online Psychiatry, Therapy & Mental Health Care in India',
    '',
    '> Doctor-led online psychiatry, clinical psychology, therapy, counselling, and private mental health screening across India. Request-first booking: patients request a slot and pay only after phone/WhatsApp confirmation.',
    '',
    '## Core Care Model (Care Only — No Academy)',
    '- **Psychiatrist (MD):** Medical assessment, diagnosis, sleep/appetite/biological symptoms, adult ADHD, OCD, addiction care, and valid digital prescriptions on video under India Telemedicine Practice Guidelines.',
    '- **Psychologist:** Structured clinical assessment and evidence-based psychotherapy (CBT, ACT, exposure, trauma-informed care).',
    '- **Therapist:** Ongoing private talk therapy for anxiety, mood patterns, relationships, family stress, and grief.',
    '- **Counsellor:** Supportive, goal-focused sessions for work burnout, academic/career stress, and life transitions.',
    '- **Consultation Modes:** Video, Audio (camera-off), and Chat.',
    '- **Fees & Payment:** Sessions start at ₹499. Request-first model — no charge when submitting a booking request; payment is collected after our care team confirms the clinician and slot on phone or WhatsApp.',
    '- **Languages:** English, Hindi, Gujarati.',
    '- **Contact:** Phone `+91 77779 36367` · WhatsApp `https://wa.me/917777936367` · Email `support@serenest.in`',
    '- **Emergency Boundary:** Serenest is for scheduled outpatient care, not emergencies. In urgent danger in India, dial `112` / `108` or the 24×7 Tele-MANAS helpline at `14416`.',
    '',
    '## Key Patient Paths',
    `- [AI-Guided Appointment Booking](${siteOrigin}/book): Match with the right specialist via Serenest Care AI and request a slot in under a minute.`,
    `- [Find a Verified Clinician](${siteOrigin}/patient/find-professional): Filter psychiatrists, psychologists, therapists, and counsellors by language, city, and fee.`,
    `- [Private Mental Health Check-ins](${siteOrigin}/screening): Free, on-device PHQ-9 (depression), GAD-7 (anxiety), and BAT-12 (burnout) self-screenings.`,
    `- [Services Overview](${siteOrigin}/services): Psychiatry, therapy, addiction recovery, and digital consultations.`,
    `- [Session Pricing](${siteOrigin}/pricing): Transparent fee structure and refund policy.`,
    `- [Patient Guides](${siteOrigin}/guides): Evidence-informed guides on depression, anxiety, ADHD, OCD, and online prescriptions in India.`,
    '',
    '## AI & Agent Integration Endpoints',
    `- \`GET ${siteOrigin}/api/ai/catalog\` — Structured JSON catalog of specialists, fees, modes, and routes.`,
    `- \`POST ${siteOrigin}/api/assistant/triage\` — Non-diagnostic clinical intake matcher (\`{ concern, duration, preferredMode }\`).`,
    `- \`POST ${siteOrigin}/api/assistant/analyze\` — AI mental health pattern & screening analyzer (\`{ toolId, score, bandLabel, symptoms, concern }\`).`,
    `- \`POST ${siteOrigin}/api/assistant/acquire\` — Direct AI client acquisition endpoint (\`{ patient_name, patient_phone, concern }\`).`,
    '',
  ].join('\n');
}

const SYSTEM_PROMPT = `You are **Serenest Care AI**, the clinical-care navigation and client-acquisition assistant for **Serenest** (doctor-led online psychiatry and therapy across India, serenest.in).

Your mission:
1. Understand what the visitor is experiencing and match them to the right specialist (**Psychiatrist** for medical assessment/sleep/appetite/prescriptions/ADHD/OCD; **Psychologist** for structured CBT/assessments; **Therapist** for ongoing talk therapy & relationships; **Counsellor** for stress, burnout, or a supportive first check-in).
2. Proactively convert visitors into cared-for clients: explain that Serenest uses a **request-first model** (sessions from **₹499**, **no payment until our team confirms the slot by phone or WhatsApp**), and invite them to share their **name and 10-digit Indian mobile number** right in the chat card (or on **/book**) so you can register their appointment request immediately.
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
  const cleanDuration = typeof duration === 'string' ? duration.trim().trim().slice(0, 200) : '';
  const cleanScreening = typeof screening === 'string' ? screening.trim().slice(0, 500) : '';

  if (!cleanConcern && !cleanGoal && !cleanScreening) {
    return jsonErr(res, 'Share a few words about what you would like help with so we can match your care.', 400);
  }

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
 * Optional `onAcquireLead(leadPayload)` callback lets the server persist a
 * booking automatically when the visitor shares their name + 10-digit phone in chat.
 */
export async function handleAssistantChat(req, res, { onAcquireLead } = {}) {
  const messages = sanitizeMessages(req.body?.messages);
  if (messages.length === 0) {
    return jsonErr(res, 'Send at least one message.', 400);
  }

  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  if (!lastUser) {
    return jsonErr(res, 'Include a user message.', 400);
  }

  const context = req.body?.context && typeof req.body.context === 'object' ? req.body.context : {};

  // Check if the visitor shared a 10-digit Indian phone number to book directly in chat
  if (!detectCrisis(lastUser.content) && typeof onAcquireLead === 'function') {
    const extracted = extractLeadFromMessages(messages);
    if (extracted) {
      const triage = analyzeCareTriage({
        concern: extracted.concern,
        preferredMode: context?.mode,
      });
      const slot = nextDefaultSlot();
      try {
        const booking = await onAcquireLead({
          patient_name: extracted.name,
          patient_phone: extracted.phone,
          practitioner_type: triage.practitioner_type,
          mode: triage.mode,
          preferred_date: slot.date,
          preferred_time: slot.time,
          language: 'English',
          notes: `[AI Chat Intake · ${triage.practitioner_label}]\n${triage.structured_note}`,
        });
        const refCode = booking?.id ? String(booking.id).slice(0, 8).toUpperCase() : 'PENDING';
        return res.status(200).json({
          ok: true,
          engine: 'clinical-concierge',
          acquired_booking: booking,
          reply:
            `✓ **Appointment request registered (Ref: ${refCode})**\n\n` +
            `Thank you, **${extracted.name}**. I have logged your request for a **${triage.practitioner_label}** (${triage.mode} session) for the next open slot (**${slot.label}**).\n\n` +
            `• **What happens next:** Our care team will reach out on **+91 ${extracted.phone}** via WhatsApp or phone to confirm your clinician and exact timing.\n` +
            `• **Payment:** You do not pay anything until your slot is confirmed.`,
          recommendation: null,
          suggestions: [
            'Take a private 2-min check-in while I wait',
            'What happens during a first consultation?',
          ],
        });
      } catch (err) {
        console.warn('[POST /api/assistant/chat] auto-lead capture failed:', err?.message);
      }
    }
  }

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

/**
 * Pure deterministic AI Mental Health Pattern & Screening Result Analyzer.
 * Supports both:
 *   1. Validated tool results (`toolId`, `toolName`, `score`, `maxScore`, `bandLabel`, `highItems`)
 *   2. Multi-dimension symptom & check-in reflection (`symptoms`, `sleepState`, `energyState`, `stressState`, `concern`)
 */
export function analyzeMentalHealth({
  toolId = '',
  toolName = '',
  humanTitle = '',
  score = null,
  maxScore = null,
  bandLabel = '',
  bandDesc = '',
  highItems = [],
  crisisFlag = false,
  phqScore = null,
  gadScore = null,
  concern = '',
  symptoms = [],
  sleepState = '',
  energyState = '',
  stressState = '',
} = {}) {
  const symptomList = Array.isArray(symptoms) ? symptoms.map(String).filter(Boolean) : [];
  const itemSignals = Array.isArray(highItems) ? highItems.map(String).filter(Boolean) : [];
  const combinedText = [
    toolName,
    humanTitle,
    bandLabel,
    bandDesc,
    concern,
    ...symptomList,
    ...itemSignals,
    sleepState ? `sleep: ${sleepState}` : '',
    energyState ? `energy: ${energyState}` : '',
    stressState ? `stress: ${stressState}` : '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  const isCrisis = Boolean(crisisFlag) || detectCrisis(combinedText);

  // Determine severity tier
  const bandLower = (bandLabel || '').toLowerCase();
  let severityTier = 'moderate';
  if (
    isCrisis
    || /severe|high risk|higher risk|higher concern|possible dependence|positive screen/i.test(bandLower)
    || Number(phqScore) >= 15
    || Number(gadScore) >= 15
    || (sleepState === 'heavy' && energyState === 'heavy' && stressState === 'heavy')
  ) {
    severityTier = 'high';
  } else if (
    /moderately|moderate|elevated|at risk|consistent with/i.test(bandLower)
    || Number(phqScore) >= 10
    || Number(gadScore) >= 10
    || symptomList.length >= 3
    || [sleepState, energyState, stressState].filter((s) => s === 'heavy').length >= 2
  ) {
    severityTier = 'elevated';
  } else if (/minimal|low|good|unlikely|normal/i.test(bandLower) && symptomList.length <= 1) {
    severityTier = 'low';
  }

  // Run triage to match specialist + mode
  const triage = analyzeCareTriage({
    concern: combinedText,
    screening: toolName
      ? `${toolName}: ${score ?? '—'}${maxScore ? `/${maxScore}` : ''} (${bandLabel || 'completed'})`
      : '',
  });

  // Override specialist by toolId + severityTier when appropriate
  let recRole = triage.practitioner_type;
  if (severityTier === 'high' || ['asrs', 'auditc', 'pcl5'].includes(toolId)) {
    recRole = 'psychiatrist';
  } else if (toolId === 'bat12' || toolId === 'pss10') {
    recRole = severityTier === 'elevated' ? 'therapist' : 'counsellor';
  } else if (toolId === 'phq9' || toolId === 'gad7') {
    recRole = severityTier === 'elevated' ? 'psychologist' : recRole;
  }
  const roleMeta = ROLE_META[recRole] || ROLE_META.psychiatrist;

  // Build key drivers
  const keyDrivers = [];
  if (itemSignals.length > 0) {
    for (const item of itemSignals.slice(0, 3)) {
      keyDrivers.push(`Elevated response on: “${item}”`);
    }
  } else {
    if (sleepState === 'heavy' || sleepState === 'strained' || /sleep|insomnia|waking/i.test(combinedText)) {
      keyDrivers.push('Sleep rhythm & physical restoration strain — disrupted rest often amplifies both mood and worry.');
    }
    if (energyState === 'heavy' || energyState === 'strained' || /exhaust|fatigue|energy|burnout|drained/i.test(combinedText)) {
      keyDrivers.push('Sustained energy depletion & mental fatigue — carrying cognitive load without enough recovery margin.');
    }
    if (stressState === 'heavy' || stressState === 'strained' || /anxiet|worry|overthink|panic|restless/i.test(combinedText)) {
      keyDrivers.push('Hyper-vigilance & overthinking loops — nervous system staying switched on even during rest.');
    }
    for (const sym of symptomList) {
      if (keyDrivers.length >= 3) break;
      if (!keyDrivers.some((d) => d.toLowerCase().includes(sym.slice(0, 8).toLowerCase()))) {
        keyDrivers.push(`Reported pattern: ${sym}`);
      }
    }
  }
  if (keyDrivers.length === 0) {
    keyDrivers.push(
      toolName
        ? `${toolName} responses sit in the “${bandLabel || 'Observed'}” band — useful baseline context for a clinician.`
        : 'Initial self-reflection across mood, energy, and daily stress load.',
    );
  }

  // Build 3-step action plan
  const actionPlan = [];
  if (severityTier === 'high') {
    actionPlan.push('Prioritize a structured evaluation with a Psychiatrist (MD) this week so biological, sleep, and medical factors are properly assessed.');
    actionPlan.push('Avoid making major work or life decisions while exhausted — reduce non-essential commitments for the next 7 days.');
    actionPlan.push('Share your structured intake brief below when booking so you do not have to repeat your story from scratch.');
  } else if (severityTier === 'elevated') {
    actionPlan.push(`Schedule a first session with a ${roleMeta.label} to map what is keeping these symptoms active and agree on a 4-week plan.`);
    actionPlan.push('Anchor one daily transition (consistent wake time, 15-minute daylight walk, or a hard screen cutoff 45 minutes before bed).');
    actionPlan.push('Re-check your score in 2 weeks on Serenest to track whether the pattern is easing or needs medical review.');
  } else {
    actionPlan.push('Protect your baseline routines: consistent sleep window, steady meals, and noticing early signs of overload.');
    actionPlan.push(`Consider a single exploratory session with a ${roleMeta.label} if you want clarity on specific stressors or patterns.`);
    actionPlan.push('Bookmark this check and revisit in 2–4 weeks if life demands increase.');
  }

  const headline = toolName
    ? `${toolName} AI Pattern Reading: ${bandLabel || 'Completed'}`
    : severityTier === 'high'
      ? 'High Strain Pattern — Prompt Clinical Assessment Recommended'
      : severityTier === 'elevated'
        ? 'Moderate-to-Elevated Strain — Structured Support Recommended'
        : 'Manageable Baseline with Actionable Focus Areas';

  const patternReading = toolName
    ? `Your responses on the ${humanTitle || toolName} (${score !== null ? `${score}${maxScore ? `/${maxScore}` : ''} · ` : ''}${bandLabel}) point to ${
        severityTier === 'high'
          ? 'a heavier symptom load that deserves timely, compassionate clinical attention from a specialist.'
          : severityTier === 'elevated'
            ? 'a meaningful pattern that is likely taking a daily toll on your energy, focus, or peace of mind.'
            : 'a lighter or manageable pattern right now, where proactive self-care and early reflection go a long way.'
      } ${roleMeta.summary}`
    : `Based on the symptoms and daily load you selected, your pattern reflects ${
        (keyDrivers[0] || 'emotional and cognitive strain').replace(/\.$/, '').toLowerCase()
      }. Starting with a ${roleMeta.label} (${roleMeta.badge}) gives you a clear, non-judgmental plan.`;

  // Build clinician brief
  const briefLines = [];
  if (toolName) {
    briefLines.push(`[AI Screening Analysis · ${toolName}: ${score ?? '—'}${maxScore ? `/${maxScore}` : ''} (${bandLabel})]`);
  } else if (phqScore !== null || gadScore !== null) {
    briefLines.push(`[AI Pathway Analysis · PHQ-9: ${phqScore ?? '—'} · GAD-7: ${gadScore ?? '—'}]`);
  } else {
    briefLines.push(`[AI Mental Health Analysis ·Matched: ${roleMeta.label}]`);
  }
  if (symptomList.length) {
    briefLines.push(`Reported experiences: ${symptomList.join(', ')}.`);
  }
  if (itemSignals.length) {
    briefLines.push(`Notable check items: ${itemSignals.slice(0, 3).join('; ')}.`);
  }
  if (sleepState || energyState || stressState) {
    briefLines.push(
      `Daily check-in — Sleep: ${sleepState || '—'}, Energy: ${energyState || '—'}, Stress/Worry: ${stressState || '—'}.`,
    );
  }
  if (concern && concern.trim()) {
    briefLines.push(`Patient note: ${concern.trim().slice(0, 220)}`);
  }
  briefLines.push(`Recommended care path: ${roleMeta.label} (${triage.mode}) · ${headline}`);

  const clinicianBrief = briefLines.join('\n');
  const nextSlot = nextDefaultSlot();
  const bookParams = new URLSearchParams({
    prole: recRole,
    mode: triage.mode,
    ...(toolName ? { tool: toolName } : {}),
    ...(score !== null && score !== undefined ? { score: String(score) } : {}),
    ...(bandLabel ? { band: bandLabel } : {}),
    note: clinicianBrief,
  });

  return {
    crisis: isCrisis,
    crisis_notice: isCrisis
      ? 'If you are in immediate danger or having thoughts of self-harm, please call 112 / 108 or India’s 24×7 Tele-MANAS helpline at 14416 right away.'
      : null,
    headline,
    severity_tier: severityTier,
    pattern_reading: patternReading,
    key_drivers: keyDrivers,
    action_plan: actionPlan,
    recommended_specialist: {
      type: recRole,
      label: roleMeta.label,
      badge: roleMeta.badge,
      summary: roleMeta.summary,
      mode: triage.mode,
      starting_fee_inr: roleMeta.starting_fee_inr,
      rationale: triage.rationale,
    },
    suggested_check: triage.suggested_screening,
    clinician_brief: clinicianBrief,
    book_path: `/book?${bookParams.toString()}`,
    next_slot: nextSlot,
    disclaimer:
      'Serenest AI Analysis organizes your responses into educational patterns and a clinician handoff brief — it is not a medical diagnosis.',
  };
}

/**
 * POST /api/assistant/analyze
 * Returns a structured AI mental health analysis from either a completed
 * screening check or an interactive symptom check-in on /screening.
 */
export async function handleMentalHealthAnalysis(req, res) {
  const payload = req.body || {};
  const baseline = analyzeMentalHealth(payload);

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey || baseline.crisis) {
    return res.status(200).json({
      ok: true,
      engine: 'clinical-analyzer',
      analysis: baseline,
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
        response_format: { type: 'json_object' },
        max_tokens: 550,
        temperature: 0.4,
        messages: [
          {
            role: 'system',
            content:
              'You are Serenest Care AI, a non-diagnostic mental health pattern analyzer for an Indian telepsychiatry platform. ' +
              'Return JSON with keys: headline (short empathetic title), pattern_reading (2-3 warm sentences explaining what the pattern suggests without diagnosing), ' +
              'key_drivers (array of 3 concise observations), action_plan (array of 3 practical next steps), ' +
              'practitioner_type ("psychiatrist"|"psychologist"|"therapist"|"counsellor").',
          },
          {
            role: 'user',
            content: JSON.stringify(payload),
          },
        ],
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const parsed = JSON.parse(data?.choices?.[0]?.message?.content || '{}');
      const role = VALID_ROLES.includes(parsed.practitioner_type)
        ? parsed.practitioner_type
        : baseline.recommended_specialist.type;
      const roleMeta = ROLE_META[role];
      return res.status(200).json({
        ok: true,
        engine: 'openai',
        analysis: {
          ...baseline,
          headline: typeof parsed.headline === 'string' && parsed.headline.trim()
            ? parsed.headline.trim()
            : baseline.headline,
          pattern_reading: typeof parsed.pattern_reading === 'string' && parsed.pattern_reading.trim()
            ? parsed.pattern_reading.trim()
            : baseline.pattern_reading,
          key_drivers: Array.isArray(parsed.key_drivers) && parsed.key_drivers.length
            ? parsed.key_drivers.slice(0, 3).map(String)
            : baseline.key_drivers,
          action_plan: Array.isArray(parsed.action_plan) && parsed.action_plan.length
            ? parsed.action_plan.slice(0, 3).map(String)
            : baseline.action_plan,
          recommended_specialist: {
            ...baseline.recommended_specialist,
            type: role,
            label: roleMeta.label,
            badge: roleMeta.badge,
            summary: roleMeta.summary,
          },
        },
      });
    }
  } catch (e) {
    console.warn('[POST /api/assistant/analyze] falling back to clinical-analyzer:', e?.message);
  }

  return res.status(200).json({
    ok: true,
    engine: 'clinical-analyzer',
    analysis: baseline,
  });
}
