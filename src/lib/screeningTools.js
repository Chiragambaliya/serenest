/** Clinically validated screeners (public-domain / commonly used wording). Not a diagnosis. */

export const PHQ9_QUESTIONS = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
  'Trouble concentrating on things, such as reading the newspaper or watching television',
  'Moving or speaking so slowly that other people could have noticed. Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual',
  'Thoughts that you would be better off dead, or of hurting yourself in some way',
];

export const GAD7_QUESTIONS = [
  'Feeling nervous, anxious or on edge',
  'Not being able to stop or control worrying',
  'Worrying too much about different things',
  'Trouble relaxing',
  'Being so restless that it is hard to sit still',
  'Becoming easily annoyed or irritable',
  'Feeling afraid as if something awful might happen',
];

/** Insomnia Severity Index — 7 items, 0–4 each (Bastien et al.) */
export const ISI_QUESTIONS = [
  'Difficulty falling asleep',
  'Difficulty staying asleep',
  'Problems waking up too early',
  'How SATISFIED are you with your current sleep pattern?',
  'How NOTICEABLE to others do you think your sleep problem is (work, functioning, etc.)?',
  'How WORRIED or DISTRESSED are you about your current sleep problem?',
  'How much do you feel your sleep problem INTERFERES with your daily functioning?',
];

/** Same 0–4 frequency scale as PHQ-9 for ISI items 1–3; 4–7 use satisfaction/interference wording via labels below */
export const ISI_OPTIONS = [
  { value: 0, label: 'None / not at all' },
  { value: 1, label: 'Mild' },
  { value: 2, label: 'Moderate' },
  { value: 3, label: 'Severe' },
  { value: 4, label: 'Very severe' },
];

/** AUDIT-C — alcohol (3 items, 0–4 each) */
export const AUDIT_QUESTIONS = [
  {
    text: 'How often do you have a drink containing alcohol?',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Monthly or less' },
      { value: 2, label: '2–4 times a month' },
      { value: 3, label: '2–3 times a week' },
      { value: 4, label: '4+ times a week' },
    ],
  },
  {
    text: 'How many drinks containing alcohol do you have on a typical day when you drink?',
    options: [
      { value: 0, label: '1–2' },
      { value: 1, label: '3–4' },
      { value: 2, label: '5–6' },
      { value: 3, label: '7–9' },
      { value: 4, label: '10 or more' },
    ],
  },
  {
    text: 'How often do you have six or more drinks on one occasion?',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Less than monthly' },
      { value: 2, label: 'Monthly' },
      { value: 3, label: 'Weekly' },
      { value: 4, label: 'Daily or almost daily' },
    ],
  },
];

/** SCOFF — eating disorders screen (Morgan et al.) */
export const SCOFF_QUESTIONS = [
  'Do you make yourself Sick because you feel uncomfortably full?',
  'Do you worry you have lost Control over how much you eat?',
  'Have you recently lost more than One stone (≈6 kg) in a three-month period?',
  'Do you believe yourself to be Fat when others say you are too thin?',
  'Would you say that Food dominates your life?',
];

/** PC-PTSD-5 style — after trauma exposure (simplified yes/no flow) */
export const PTSD_EVENT_QUESTION =
  'Have you ever experienced a traumatic or very frightening event (e.g. assault, accident, disaster, loss) that keeps affecting you?';

export const PTSD_SYMPTOM_QUESTIONS = [
  'In the past month, have you had nightmares or unwanted memories of the event?',
  'In the past month, have you tried hard not to think about the event or avoided reminders?',
  'In the past month, have you felt constantly on guard, watchful, or easily startled?',
  'In the past month, have you felt numb, distant, or cut off from others?',
  'In the past month, have you felt strong guilt, blamed yourself, or had strong negative feelings about yourself or the world?',
];

/** WHO-5 — Well-Being Index (WHO). Higher sum = better wellbeing (0–25 raw → ×4 = 0–100%). */
export const WHO5_QUESTIONS = [
  'I have felt cheerful and in good spirits',
  'I have felt calm and relaxed',
  'I have felt active and vigorous',
  'I woke up feeling fresh and rested',
  'My daily life has been filled with things that interest me',
];

export const WHO5_OPTIONS = [
  { value: 0, label: 'At no time' },
  { value: 1, label: 'Some of the time' },
  { value: 2, label: 'Less than half' },
  { value: 3, label: 'More than half' },
  { value: 4, label: 'Most of the time' },
  { value: 5, label: 'All of the time' },
];

/** STOP-BANG — obstructive sleep apnoea risk screen (yes/no). Not a diagnosis. */
export const STOPBANG_QUESTIONS = [
  'Do you Snore loudly (loud enough to be heard through closed doors or louder than talking)?',
  'Do you often feel Tired, fatigued, or sleepy during daytime?',
  'Has anyone Observed you stop breathing during your sleep?',
  'Do you have or are you being treated for high blood Pressure?',
  'Is your BMI more than 35 kg/m²? (or do you believe you would be classified as severely overweight by a clinician?)',
  'Are you older than 50 years of age?',
  'Is your neck circumference large — e.g. shirt collar roughly 17 in (43 cm) or more if male, 16 in (41 cm) or more if female?',
  'Are you male?',
];

export const FREQ_OPTIONS = [
  { value: 0, label: 'Not at all', sub: '0 days' },
  { value: 1, label: 'Several days', sub: '1–6 days' },
  { value: 2, label: 'More than half the days', sub: '7–11 days' },
  { value: 3, label: 'Nearly every day', sub: '12–14 days' },
];

export function buildFlow(modules) {
  const f = ['intro', 'phq9', 'gad7'];
  if (modules.sleep) f.push('isi');
  if (modules.osa) f.push('stopbang');
  if (modules.alcohol) f.push('audit');
  if (modules.eating) f.push('scoff');
  if (modules.trauma) f.push('ptsd');
  if (modules.wellbeing) f.push('who5');
  f.push('contact');
  return f;
}

export function phq9Severity(score) {
  if (score <= 4) return { label: 'Minimal', color: '#198754', desc: 'Symptoms are minimal and unlikely to need treatment.' };
  if (score <= 9) return { label: 'Mild', color: '#0d6efd', desc: 'Mild symptoms — watchful waiting, lifestyle and follow-up.' };
  if (score <= 14) return { label: 'Moderate', color: '#e67e22', desc: 'Moderate symptoms — talk therapy is recommended.' };
  if (score <= 19) return { label: 'Moderately Severe', color: '#fd7e14', desc: 'Active treatment recommended — therapy and possibly medication.' };
  return { label: 'Severe', color: '#dc3545', desc: 'Severe symptoms — immediate active treatment is recommended.' };
}

export function gad7Severity(score) {
  if (score <= 4) return { label: 'Minimal', color: '#198754', desc: 'Anxiety is within normal range.' };
  if (score <= 9) return { label: 'Mild', color: '#0d6efd', desc: 'Mild anxiety — monitor and consider self-care strategies.' };
  if (score <= 14) return { label: 'Moderate', color: '#e67e22', desc: 'Moderate anxiety — talk therapy can help.' };
  return { label: 'Severe', color: '#dc3545', desc: 'Severe anxiety — professional support is strongly recommended.' };
}

export function isiSeverity(score) {
  if (score <= 7) return { label: 'No clinical insomnia', color: '#198754', desc: 'Score suggests sleep is not in the clinical insomnia range.' };
  if (score <= 14) return { label: 'Subthreshold', color: '#0d6efd', desc: 'Some sleep difficulty — good to discuss sleep hygiene or follow-up.' };
  if (score <= 21) return { label: 'Moderate insomnia', color: '#e67e22', desc: 'Moderate severity — consider speaking with a clinician about sleep.' };
  return { label: 'Severe insomnia', color: '#dc3545', desc: 'Severe symptoms — professional assessment is recommended.' };
}

/** AUDIT-C total 0–12; common cut-off ≥4 for men, ≥3 for women — we flag ≥4 and note in copy */
export function auditCSeverity(total) {
  if (total <= 2) return { label: 'Low risk', color: '#198754', desc: 'Pattern does not suggest risky drinking on this screen.' };
  if (total <= 3) return { label: 'Borderline', color: '#0d6efd', desc: 'Slightly elevated — worth discussing with a clinician (women often use cut-off 3).' };
  return { label: 'Elevated', color: '#e67e22', desc: 'Suggests unhealthy alcohol use for many people — please discuss results with a professional.' };
}

export function scoffResult(yesCount) {
  const positive = yesCount >= 2;
  if (!positive) {
    return { positive, label: 'Negative screen', color: '#198754', desc: 'Does not meet typical SCOFF cut-off — still seek help if you struggle with eating or body image.' };
  }
  return { positive, label: 'Further evaluation suggested', color: '#e67e22', desc: 'Two or more yes answers often triggers further assessment for eating difficulties — not a diagnosis.' };
}

export function ptsdScreenResult(eventYes, symptomYesCount) {
  if (!eventYes) {
    return { positive: false, label: 'Not assessed', color: '#64748b', desc: 'Trauma-related items were not endorsed; speak to a clinician if you still feel distressed.' };
  }
  const positive = symptomYesCount >= 3;
  if (!positive) {
    return { positive, label: 'Below typical cut-off', color: '#0d6efd', desc: 'Fewer than 3 symptoms — still seek care if trauma affects your daily life.' };
  }
  return { positive, label: 'Further assessment suggested', color: '#e67e22', desc: 'Pattern can warrant PTSD assessment — only a clinician can diagnose.' };
}

/** Raw sum 0–25; index score = sum × 4 (0–100). ≤28 suggests poor wellbeing per WHO guidance. */
export function who5Severity(rawSum) {
  const index = rawSum * 4;
  if (index <= 28) {
    return {
      label: 'Poor wellbeing',
      color: '#dc3545',
      desc: 'This pattern often warrants a fuller mood check-in with a clinician — many people also benefit from counselling.',
    };
  }
  if (index <= 50) {
    return {
      label: 'Below average',
      color: '#e67e22',
      desc: 'There may be room to improve energy, sleep, and daily enjoyment — self-care and professional support can help.',
    };
  }
  if (index <= 70) {
    return { label: 'Moderate', color: '#0d6efd', desc: 'Reasonable wellbeing with some ups and downs — fine to optimise further.' };
  }
  return { label: 'Good', color: '#198754', desc: 'Scores suggest relatively strong wellbeing over the past two weeks.' };
}

/** YES count 0–8. ≥3 and ≥5 often used as increasing OSA risk tiers. */
export function stopBangResult(yesCount) {
  if (yesCount <= 2) {
    return {
      elevated: false,
      label: 'Lower risk',
      color: '#198754',
      desc: 'Fewer risk factors on this screen — still seek evaluation if you have heavy snoring, choking in sleep, or severe sleepiness.',
    };
  }
  if (yesCount <= 4) {
    return {
      elevated: true,
      label: 'Intermediate risk',
      color: '#e67e22',
      desc: 'Several risk factors — consider discussing sleep apnoea with a doctor, especially if you snore or feel non-restored after sleep.',
    };
  }
  return {
    elevated: true,
    label: 'Higher risk',
    color: '#dc3545',
    desc: 'Many risk factors — a formal sleep evaluation may be appropriate; this screen does not diagnose sleep apnoea.',
  };
}

export function flowStepLabel(stepId) {
  const map = {
    intro: 'Start',
    phq9: 'Mood (PHQ-9)',
    gad7: 'Anxiety (GAD-7)',
    isi: 'Sleep (ISI)',
    stopbang: 'Sleep apnoea risk',
    audit: 'Alcohol (AUDIT-C)',
    scoff: 'Eating (SCOFF)',
    ptsd: 'Trauma stress',
    who5: 'Wellbeing (WHO-5)',
    contact: 'Your details',
  };
  return map[stepId] ?? stepId;
}
