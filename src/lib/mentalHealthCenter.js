/**
 * Mental Health Center — Care front door.
 * Screening tools are one capability inside a larger understand → learn → help journey.
 */

/** India crisis resources — single source of truth for Care surfaces */
export const CRISIS_RESOURCES = {
  emergency: { label: 'Emergency', number: '112', href: 'tel:112' },
  telemanas: {
    label: 'Tele-MANAS',
    number: '14416',
    href: 'tel:14416',
    note: 'Free national mental-health support (Government of India), 24/7',
  },
  telemanasAlt: {
    label: 'Tele-MANAS (alternate)',
    number: '1800-891-4416',
    href: 'tel:18008914416',
    note: 'Alternate toll-free Tele-MANAS number',
  },
  // Additional support option — not the primary national crisis resource.
  icall: { label: 'iCALL', number: '9152987821', href: 'tel:9152987821', note: 'Psychosocial helpline (additional support)' },
  serenest: { label: 'Serenest support', number: '+91 77779 36367', href: 'tel:+917777936367' },
  emergencyPage: '/emergency-disclaimer',
};

/** Canonical crisis-panel statement — keep wording consistent across all crisis surfaces. */
export const CRISIS_STATEMENT =
  'If you may act on thoughts of harming yourself, cannot stay safe, or are in immediate danger, call 112 or go to the nearest emergency department. For free mental-health support in India, call Tele-MANAS at 14416 or 1800-891-4416.';

/** Snapshot dimensions — architecture for many future checks without redesign */
export const SNAPSHOT_DIMENSIONS = [
  {
    id: 'mood',
    label: 'Mood',
    question: 'How has your mood been?',
    toolId: 'phq9',
    status: 'live',
  },
  {
    id: 'anxiety',
    label: 'Anxiety',
    question: 'How much worry or tension?',
    toolId: 'gad7',
    status: 'live',
  },
  {
    id: 'stress',
    label: 'Stress',
    question: 'How overloaded does life feel?',
    toolId: 'pss10',
    // PSS-10 paused: instrument permission and interpretation bands under review.
    status: 'paused',
  },
  {
    id: 'wellbeing',
    label: 'Wellbeing',
    question: 'How is your general wellbeing?',
    toolId: 'who5',
    status: 'live',
  },
  {
    id: 'attention',
    label: 'Attention',
    question: 'Focus and restlessness?',
    toolId: 'asrs',
    status: 'live',
  },
  {
    id: 'distress',
    label: 'Distress',
    question: 'Overall emotional strain?',
    toolId: 'k10',
    status: 'live',
  },
  {
    id: 'trauma',
    label: 'After trauma',
    question: 'Symptoms after a stressful event?',
    toolId: 'pcl5',
    status: 'live',
  },
  {
    id: 'substance',
    label: 'Alcohol',
    question: 'Drinking patterns and risk?',
    toolId: 'auditc',
    status: 'live',
  },
  {
    id: 'eating',
    label: 'Eating',
    question: 'Relationship with food?',
    toolId: 'scoff',
    status: 'live',
  },
  {
    id: 'burnout',
    label: 'Burnout',
    question: 'Exhaustion and detachment?',
    toolId: 'bat12',
    status: 'live',
  },
  {
    id: 'sleep',
    label: 'Sleep',
    question: 'How is your sleep?',
    toolId: null,
    status: 'planned',
  },
  {
    id: 'digital',
    label: 'Digital wellbeing',
    question: 'Screens and stimulation?',
    toolId: null,
    status: 'planned',
  },
];

export const CHECK_CATEGORIES = [
  { id: 'all', label: 'All checks' },
  { id: 'mood', label: 'Mood' },
  { id: 'anxiety', label: 'Anxiety' },
  { id: 'stress', label: 'Stress & burnout' },
  { id: 'attention', label: 'Attention' },
  { id: 'trauma', label: 'Trauma' },
  { id: 'substance', label: 'Substance' },
  { id: 'eating', label: 'Eating' },
];

/** Guided pathway — human language, not “begin screening” */
export const GUIDED_PATHWAYS = [
  {
    id: 'mood-anxiety',
    title: 'Check mood & anxiety',
    blurb: 'Two short, widely used checks (PHQ-9 and GAD-7). About 5–7 minutes. Helps you see mood and worry together.',
    minutes: '5–7 min',
    audience: 'Anyone wondering about low mood, worry, or both',
    toolIds: ['phq9', 'gad7'],
    href: '/screening/pathway/mood-anxiety',
  },
];

const SESSION_KEY = 'serenest_mh_snapshot_v1';

/** Session-only snapshot (no server). Privacy-first until patient portal history exists. */
export function loadSnapshotSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveSnapshotDimension(dimensionId, payload) {
  try {
    const prev = loadSnapshotSession();
    const next = {
      ...prev,
      [dimensionId]: {
        ...payload,
        updatedAt: new Date().toISOString(),
      },
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
    return next;
  } catch {
    return {};
  }
}

/** Remove one dimension's snapshot result from this browser session ("Clear my answers"). */
export function clearSnapshotDimension(dimensionId) {
  if (!dimensionId) return loadSnapshotSession();
  try {
    const prev = loadSnapshotSession();
    if (!(dimensionId in prev)) return prev;
    const next = { ...prev };
    delete next[dimensionId];
    if (Object.keys(next).length === 0) {
      sessionStorage.removeItem(SESSION_KEY);
    } else {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
    }
    return next;
  } catch {
    return {};
  }
}

/**
 * Scriba Insight — calm, non-diagnostic copy from tool + band.
 * Template-based now; swap body for model output later without UI redesign.
 */
export function buildScribaInsight(tool, result) {
  const band = result?.band;
  if (!tool || !band) return null;

  const name = tool.humanTitle || tool.short;
  const scale = tool.name;
  const label = band.label;

  let body = `Based on your answers to the ${scale}, your responses sit in the “${label}” range for this check. That is useful information — not a diagnosis, and not a verdict about who you are.`;

  if (tool.crisisItem !== undefined && result.crisisFlag) {
    body = `You shared something that suggests you may need support right away. Please use the safety resources below. A score or label can wait — your safety comes first. When you are ready, a clinician can help you make sense of everything else.`;
  } else if (tool.direction === 'higher_better' && (result.score ?? 0) <= 50) {
    body = `Your ${name} check suggests wellbeing may be lower than you’d like right now. Many people feel this way during hard seasons. Understanding that pattern is a first step — a professional can help if it persists or feels heavy.`;
  } else if (tool.scoring === 'threshold_count' && result.positive) {
    body = `Your answers on the ${scale} are consistent with patterns people discuss in a full assessment. That does not mean you have a diagnosis. It means a structured conversation with a clinician is a reasonable next step if these experiences affect your life.`;
  } else if (/severe|higher risk|higher concern|possible dependence|positive screen|consistent with|above a provisional/i.test(label)) {
    body = `Your ${name} result suggests this may be affecting you more than mildly. Many people in this range benefit from talking with a psychiatrist or psychologist — not because a form decided your future, but because support can make the next weeks easier.`;
  } else if (/moderate|increased|mild distress|elevated|at risk/i.test(label)) {
    body = `Your ${name} result sits in a middle range. That often means self-care and learning help, and a professional conversation is worth considering if symptoms last, worsen, or interfere with work, sleep, or relationships.`;
  } else {
    body = `Your ${name} result is in a lower-concern range for this particular check. You can still learn, track how you feel over time, or speak with someone if something else is bothering you — prevention and curiosity are valid reasons to seek care.`;
  }

  return {
    eyebrow: 'Scriba Insight',
    title: 'A calm reading of your responses',
    body,
    disclaimer:
      'Scriba offers supportive framing from your answers. It does not diagnose, prescribe, or replace a clinician’s judgment.',
  };
}
