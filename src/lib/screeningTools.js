/**
 * Serenest self-screening tools.
 *
 * A small, data-driven engine so each new validated questionnaire is just a
 * definition below. All instruments here are freely reproducible for clinical
 * / educational use (Pfizer PHQ/GAD, WHO ASRS & AUDIT, WHO-5, PSS, Kessler
 * K10, the public-domain PCL-5, and SCOFF).
 *
 * IMPORTANT: these are screening aids, not diagnoses. Scores only indicate
 * whether a professional conversation may help.
 */

// Shared 0–3 "over the last 2 weeks" frequency options (PHQ-9 / GAD-7)
const FREQ_0_3 = [
  { label: 'Not at all', value: 0 },
  { label: 'Several days', value: 1 },
  { label: 'More than half the days', value: 2 },
  { label: 'Nearly every day', value: 3 },
];

// Shared 0–4 "how often" options (PSS / ASRS)
const FREQ_0_4 = [
  { label: 'Never', value: 0 },
  { label: 'Almost never', value: 1 },
  { label: 'Sometimes', value: 2 },
  { label: 'Fairly often', value: 3 },
  { label: 'Very often', value: 4 },
];

const ASRS_0_4 = [
  { label: 'Never', value: 0 },
  { label: 'Rarely', value: 1 },
  { label: 'Sometimes', value: 2 },
  { label: 'Often', value: 3 },
  { label: 'Very often', value: 4 },
];

// WHO-5 wellbeing — 0–5, higher is better
const WHO5_OPTS = [
  { label: 'At no time', value: 0 },
  { label: 'Some of the time', value: 1 },
  { label: 'Less than half the time', value: 2 },
  { label: 'More than half the time', value: 3 },
  { label: 'Most of the time', value: 4 },
  { label: 'All of the time', value: 5 },
];

export const SCREENING_TOOLS = [
  {
    id: 'phq9',
    slug: 'phq-9',
    name: 'PHQ-9',
    short: 'Depression',
    title: 'Depression check (PHQ-9)',
    icon: '🌧️',
    blurb: 'A 9-question check for low mood and depression.',
    timeframe: 'Over the last 2 weeks, how often have you been bothered by…',
    source: 'Patient Health Questionnaire (Kroenke et al.)',
    options: FREQ_0_3,
    scoring: 'sum',
    direction: 'higher_worse',
    crisisItem: 8, // item 9 — thoughts of self-harm
    questions: [
      { text: 'Little interest or pleasure in doing things' },
      { text: 'Feeling down, depressed, or hopeless' },
      { text: 'Trouble falling or staying asleep, or sleeping too much' },
      { text: 'Feeling tired or having little energy' },
      { text: 'Poor appetite or overeating' },
      { text: 'Feeling bad about yourself — or that you are a failure or have let yourself or your family down' },
      { text: 'Trouble concentrating on things, such as reading or watching television' },
      { text: 'Moving or speaking so slowly that others could have noticed — or being fidgety/restless' },
      { text: 'Thoughts that you would be better off dead, or of hurting yourself in some way' },
    ],
    bands: [
      { max: 4,  label: 'Minimal',            color: '#198754', desc: 'Symptoms are minimal and unlikely to need treatment.' },
      { max: 9,  label: 'Mild',               color: '#0d6efd', desc: 'Mild symptoms — self-care and follow-up may be enough.' },
      { max: 14, label: 'Moderate',           color: '#e67e22', desc: 'Moderate symptoms — talking to a professional is recommended.' },
      { max: 19, label: 'Moderately severe',  color: '#fd7e14', desc: 'Active treatment is recommended — therapy and possibly medication.' },
      { max: 27, label: 'Severe',             color: '#dc3545', desc: 'Severe symptoms — please speak to a psychiatrist soon.' },
    ],
  },

  {
    id: 'gad7',
    slug: 'gad-7',
    name: 'GAD-7',
    short: 'Anxiety',
    title: 'Anxiety check (GAD-7)',
    icon: '💭',
    blurb: 'A 7-question check for worry and anxiety.',
    timeframe: 'Over the last 2 weeks, how often have you been bothered by…',
    source: 'Generalized Anxiety Disorder scale (Spitzer et al.)',
    options: FREQ_0_3,
    scoring: 'sum',
    direction: 'higher_worse',
    questions: [
      { text: 'Feeling nervous, anxious, or on edge' },
      { text: 'Not being able to stop or control worrying' },
      { text: 'Worrying too much about different things' },
      { text: 'Trouble relaxing' },
      { text: 'Being so restless that it is hard to sit still' },
      { text: 'Becoming easily annoyed or irritable' },
      { text: 'Feeling afraid, as if something awful might happen' },
    ],
    bands: [
      { max: 4,  label: 'Minimal',  color: '#198754', desc: 'Anxiety is within the normal range.' },
      { max: 9,  label: 'Mild',     color: '#0d6efd', desc: 'Mild anxiety — monitor and try self-care strategies.' },
      { max: 14, label: 'Moderate', color: '#e67e22', desc: 'Moderate anxiety — talk therapy can help.' },
      { max: 21, label: 'Severe',   color: '#dc3545', desc: 'Severe anxiety — speaking to a professional is strongly recommended.' },
    ],
  },

  {
    id: 'pss10',
    slug: 'pss-10',
    name: 'PSS-10',
    short: 'Stress',
    title: 'Stress check (PSS-10)',
    icon: '😖',
    blurb: 'A 10-question check for how stretched and overloaded life feels.',
    timeframe: 'In the last month, how often have you felt or thought this way…',
    source: 'Perceived Stress Scale (Cohen et al.)',
    options: FREQ_0_4,
    scoring: 'sum',
    direction: 'higher_worse',
    questions: [
      { text: 'Been upset because of something that happened unexpectedly' },
      { text: 'Felt that you were unable to control the important things in your life' },
      { text: 'Felt nervous and stressed' },
      { text: 'Felt confident about your ability to handle your personal problems', reverse: true },
      { text: 'Felt that things were going your way', reverse: true },
      { text: 'Found that you could not cope with all the things you had to do' },
      { text: 'Been able to control irritations in your life', reverse: true },
      { text: 'Felt that you were on top of things', reverse: true },
      { text: 'Been angered because of things outside of your control' },
      { text: 'Felt difficulties were piling up so high you could not overcome them' },
    ],
    bands: [
      { max: 13, label: 'Low stress',      color: '#198754', desc: 'Your perceived stress is low right now.' },
      { max: 26, label: 'Moderate stress', color: '#e67e22', desc: 'Moderate stress — some support or coping strategies may help.' },
      { max: 40, label: 'High stress',     color: '#dc3545', desc: 'High perceived stress — talking to a professional could really help.' },
    ],
    seoTitle: 'Stress Test Online (PSS-10) | Serenest',
    seoDescription: 'Take the free PSS-10 perceived stress self-check online from India. 10 validated questions on how overloaded and stretched life feels. Instant result — not a diagnosis.',
  },

  {
    id: 'who5',
    slug: 'who-5-wellbeing',
    name: 'WHO-5',
    short: 'Wellbeing',
    title: 'Wellbeing check (WHO-5)',
    icon: '🌿',
    blurb: 'A short, positive 5-question check on your general wellbeing.',
    timeframe: 'Over the last 2 weeks…',
    source: 'WHO-5 Wellbeing Index',
    options: WHO5_OPTS,
    scoring: 'sum_scaled',
    scale: 4,          // raw 0–25 × 4 → 0–100
    direction: 'higher_better',
    questions: [
      { text: 'I have felt cheerful and in good spirits' },
      { text: 'I have felt calm and relaxed' },
      { text: 'I have felt active and vigorous' },
      { text: 'I woke up feeling fresh and rested' },
      { text: 'My daily life has been filled with things that interest me' },
    ],
    bands: [
      { max: 28,  label: 'Very low wellbeing', color: '#dc3545', desc: 'This score can be a sign of low mood or depression. Speaking to a professional is a good idea.' },
      { max: 50,  label: 'Low wellbeing',      color: '#e67e22', desc: 'Your wellbeing is on the lower side — support may help you feel better.' },
      { max: 75,  label: 'Moderate wellbeing', color: '#0d6efd', desc: 'Reasonable wellbeing, with room to feel better.' },
      { max: 100, label: 'Good wellbeing',     color: '#198754', desc: 'Your wellbeing is good right now — keep it up.' },
    ],
    seoTitle: 'WHO-5 Wellbeing Test Online | Serenest',
    seoDescription: 'Take the free WHO-5 wellbeing self-check online from India. 5 short, positive questions scored 0–100. Instant result — a screening aid, not a diagnosis.',
  },

  {
    id: 'auditc',
    slug: 'alcohol-audit-c',
    name: 'AUDIT-C',
    short: 'Alcohol',
    title: 'Alcohol use check (AUDIT-C)',
    icon: '🍺',
    blurb: 'A 3-question check on drinking patterns and risk.',
    timeframe: 'Please answer about your typical drinking…',
    source: 'Alcohol Use Disorders Identification Test — Consumption (WHO)',
    scoring: 'sum',
    direction: 'higher_worse',
    // Per-question option sets
    questions: [
      {
        text: 'How often do you have a drink containing alcohol?',
        options: [
          { label: 'Never', value: 0 },
          { label: 'Monthly or less', value: 1 },
          { label: '2–4 times a month', value: 2 },
          { label: '2–3 times a week', value: 3 },
          { label: '4 or more times a week', value: 4 },
        ],
      },
      {
        text: 'How many standard drinks do you have on a typical day when you are drinking?',
        options: [
          { label: '1 or 2', value: 0 },
          { label: '3 or 4', value: 1 },
          { label: '5 or 6', value: 2 },
          { label: '7 to 9', value: 3 },
          { label: '10 or more', value: 4 },
        ],
      },
      {
        text: 'How often do you have six or more drinks on one occasion?',
        options: [
          { label: 'Never', value: 0 },
          { label: 'Less than monthly', value: 1 },
          { label: 'Monthly', value: 2 },
          { label: 'Weekly', value: 3 },
          { label: 'Daily or almost daily', value: 4 },
        ],
      },
    ],
    bands: [
      { max: 2,  label: 'Lower risk',        color: '#198754', desc: 'Your drinking appears to be in the lower-risk range.' },
      { max: 4,  label: 'Increased risk',    color: '#e67e22', desc: 'Some increased risk. (For women, a score of 3+ already suggests this.) Cutting back or a chat with a professional may help.' },
      { max: 7,  label: 'Higher risk',       color: '#fd7e14', desc: 'Higher-risk drinking — support to cut down is recommended.' },
      { max: 12, label: 'Possible dependence', color: '#dc3545', desc: 'This pattern can point to alcohol dependence. Please speak to a professional.' },
    ],
    note: 'A “standard drink” ≈ 1 can of beer, 1 small glass of wine, or 1 measure (30 ml) of spirits.',
    seoTitle: 'Alcohol Use Self-Test Online (AUDIT-C) | Serenest',
    seoDescription: 'Take the free WHO AUDIT-C alcohol self-screening online from India. 3 quick questions on drinking patterns and risk. Confidential, instant result — not a diagnosis.',
  },

  {
    id: 'asrs',
    slug: 'adhd-asrs',
    name: 'ASRS v1.1',
    short: 'Adult ADHD',
    title: 'Adult ADHD screener (ASRS)',
    icon: '⚡',
    blurb: 'The WHO 6-question screener for adult attention / hyperactivity.',
    timeframe: 'Over the past 6 months, how often…',
    source: 'Adult ADHD Self-Report Scale v1.1 Part A (WHO)',
    options: ASRS_0_4,
    scoring: 'threshold_count',
    positiveMin: 4, // ≥4 items in the shaded zone = a positive screen
    questions: [
      { text: 'How often do you have trouble wrapping up the final details of a project, once the challenging parts are done?', thresholdMin: 2 },
      { text: 'How often do you have difficulty getting things in order when you have to do a task that requires organization?', thresholdMin: 2 },
      { text: 'How often do you have problems remembering appointments or obligations?', thresholdMin: 2 },
      { text: 'When you have a task that requires a lot of thought, how often do you avoid or delay getting started?', thresholdMin: 3 },
      { text: 'How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?', thresholdMin: 3 },
      { text: 'How often do you feel overly active and compelled to do things, like you were driven by a motor?', thresholdMin: 3 },
    ],
    positiveBand: { label: 'Symptoms consistent with adult ADHD', color: '#e67e22', desc: 'Your answers are consistent with adult ADHD. This is not a diagnosis — a full assessment with a professional is the next step.' },
    negativeBand: { label: 'Unlikely to indicate ADHD', color: '#198754', desc: 'Your answers are not strongly consistent with adult ADHD. If concerns persist, a professional can still help.' },
    seoTitle: 'Adult ADHD Self-Test Online (ASRS v1.1) | Serenest',
    seoDescription: 'Take the free WHO ASRS v1.1 adult ADHD self-screening online from India. The standard 6-question screener for attention and hyperactivity. Instant result — not a diagnosis.',
  },

  {
    id: 'k10',
    slug: 'distress-k10',
    name: 'K10',
    short: 'Distress',
    title: 'Psychological distress check (K10)',
    icon: '🌊',
    blurb: 'A 10-question check on overall emotional distress in the last month.',
    timeframe: 'In the past 30 days, about how often did you feel…',
    source: 'Kessler Psychological Distress Scale (Kessler et al.)',
    options: [
      { label: 'None of the time', value: 1 },
      { label: 'A little of the time', value: 2 },
      { label: 'Some of the time', value: 3 },
      { label: 'Most of the time', value: 4 },
      { label: 'All of the time', value: 5 },
    ],
    scoring: 'sum',
    direction: 'higher_worse',
    questions: [
      { text: 'Tired out for no good reason' },
      { text: 'Nervous' },
      { text: 'So nervous that nothing could calm you down' },
      { text: 'Hopeless' },
      { text: 'Restless or fidgety' },
      { text: 'So restless you could not sit still' },
      { text: 'Depressed' },
      { text: 'That everything was an effort' },
      { text: 'So sad that nothing could cheer you up' },
      { text: 'Worthless' },
    ],
    bands: [
      { max: 19, label: 'Likely well',        color: '#198754', desc: 'Your distress levels appear to be in the healthy range.' },
      { max: 24, label: 'Mild distress',      color: '#0d6efd', desc: 'Mild distress — self-care and monitoring may be enough, but support is available.' },
      { max: 29, label: 'Moderate distress',  color: '#e67e22', desc: 'Moderate distress — talking to a professional is likely to help.' },
      { max: 50, label: 'Severe distress',    color: '#dc3545', desc: 'Severe distress — please consider speaking to a professional soon.' },
    ],
    seoTitle: 'Psychological Distress Test Online (K10) | Serenest',
    seoDescription: 'Take the free K10 psychological distress self-check online from India. 10 validated questions on stress, anxiety, and low mood in the last month. A screening tool, not a diagnosis.',
  },

  {
    id: 'pcl5',
    slug: 'ptsd-pcl-5',
    name: 'PCL-5',
    short: 'PTSD',
    title: 'Post-traumatic stress check (PCL-5)',
    icon: '🛡️',
    blurb: 'The standard 20-question check for symptoms after a stressful or traumatic event.',
    timeframe: 'Thinking of your most stressful experience: in the past month, how much were you bothered by…',
    source: 'PTSD Checklist for DSM-5 (U.S. National Center for PTSD — public domain)',
    note: 'Answer with one specific stressful experience in mind. Take a break at any time — some questions can bring up difficult feelings.',
    options: [
      { label: 'Not at all', value: 0 },
      { label: 'A little bit', value: 1 },
      { label: 'Moderately', value: 2 },
      { label: 'Quite a bit', value: 3 },
      { label: 'Extremely', value: 4 },
    ],
    scoring: 'sum',
    direction: 'higher_worse',
    questions: [
      { text: 'Repeated, disturbing, and unwanted memories of the stressful experience' },
      { text: 'Repeated, disturbing dreams of the stressful experience' },
      { text: 'Suddenly feeling or acting as if the stressful experience were actually happening again (as if you were reliving it)' },
      { text: 'Feeling very upset when something reminded you of the stressful experience' },
      { text: 'Having strong physical reactions when something reminded you of the stressful experience (heart pounding, trouble breathing, sweating)' },
      { text: 'Avoiding memories, thoughts, or feelings related to the stressful experience' },
      { text: 'Avoiding external reminders of the stressful experience (people, places, conversations, activities, objects, or situations)' },
      { text: 'Trouble remembering important parts of the stressful experience' },
      { text: 'Having strong negative beliefs about yourself, other people, or the world (e.g. "I am bad", "no one can be trusted", "the world is completely dangerous")' },
      { text: 'Blaming yourself or someone else for the stressful experience or what happened after it' },
      { text: 'Having strong negative feelings such as fear, horror, anger, guilt, or shame' },
      { text: 'Loss of interest in activities that you used to enjoy' },
      { text: 'Feeling distant or cut off from other people' },
      { text: 'Trouble experiencing positive feelings (e.g. being unable to feel happiness or have loving feelings for people close to you)' },
      { text: 'Irritable behaviour, angry outbursts, or acting aggressively' },
      { text: 'Taking too many risks or doing things that could cause you harm' },
      { text: 'Being "super-alert", watchful, or on guard' },
      { text: 'Feeling jumpy or easily startled' },
      { text: 'Having difficulty concentrating' },
      { text: 'Trouble falling or staying asleep' },
    ],
    bands: [
      { max: 30, label: 'Below screening threshold', color: '#198754', desc: 'Your score is below the usual PTSD screening threshold. If these symptoms still trouble you, a professional can help regardless of score.' },
      { max: 80, label: 'Consistent with PTSD symptoms', color: '#dc3545', desc: 'Your score is above the usual screening threshold (31+). This is not a diagnosis — a trauma-informed assessment with a professional is the right next step.' },
    ],
    seoTitle: 'PTSD Self-Screening Online (PCL-5) | Serenest',
    seoDescription: 'Take the free PCL-5 PTSD self-screening online from India. The standard 20-item checklist for post-traumatic stress symptoms. Confidential, instant result — not a diagnosis.',
  },

  {
    id: 'scoff',
    slug: 'eating-scoff',
    name: 'SCOFF',
    short: 'Eating',
    title: 'Eating patterns check (SCOFF)',
    icon: '🍽️',
    blurb: 'A quick 5-question check for possible eating-disorder patterns.',
    timeframe: 'Please answer yes or no…',
    source: 'SCOFF questionnaire (Morgan, Reid & Lacey)',
    options: [
      { label: 'No', value: 0 },
      { label: 'Yes', value: 1 },
    ],
    scoring: 'sum',
    direction: 'higher_worse',
    questions: [
      { text: 'Do you make yourself sick (vomit) because you feel uncomfortably full?' },
      { text: 'Do you worry you have lost control over how much you eat?' },
      { text: 'Have you recently lost more than 6 kg in a three-month period?' },
      { text: 'Do you believe yourself to be fat when others say you are too thin?' },
      { text: 'Would you say that food dominates your life?' },
    ],
    bands: [
      { max: 1, label: 'Low likelihood',  color: '#198754', desc: 'Your answers do not suggest an eating disorder. If food or body image still worries you, a professional can help.' },
      { max: 5, label: 'Positive screen', color: '#e67e22', desc: 'Two or more "yes" answers suggest a possible eating disorder. This is not a diagnosis — please consider a professional assessment.' },
    ],
    seoTitle: 'Eating Disorder Screening Online (SCOFF) | Serenest',
    seoDescription: 'Take the free SCOFF eating-disorder self-screening online from India. 5 quick, validated yes/no questions. Confidential, instant result — a screening aid, not a diagnosis.',
  },
];

export function getTool(slug) {
  return SCREENING_TOOLS.find((t) => t.slug === slug || t.id === slug) || null;
}

function optsFor(tool, q) {
  return q.options || tool.options || [];
}

/** Maximum possible numeric score (for the progress bar). */
export function maxScore(tool) {
  if (tool.scoring === 'threshold_count') return tool.questions.length;
  const raw = tool.questions.reduce((sum, q) => {
    const vals = optsFor(tool, q).map((o) => o.value);
    return sum + (vals.length ? Math.max(...vals) : 0);
  }, 0);
  return tool.scale ? raw * tool.scale : raw;
}

/**
 * Score a completed tool.
 * @param {object} tool
 * @param {number[]} answers  selected option value per question (may contain undefined)
 * @returns {{score?:number, count?:number, positive?:boolean, band:object, complete:boolean}}
 */
export function scoreTool(tool, answers) {
  const complete = tool.questions.every((_, i) => answers[i] !== undefined && answers[i] !== null);

  if (tool.scoring === 'threshold_count') {
    const count = tool.questions.reduce(
      (n, q, i) => n + ((answers[i] ?? -1) >= q.thresholdMin ? 1 : 0),
      0,
    );
    const positive = count >= tool.positiveMin;
    return { count, positive, band: positive ? tool.positiveBand : tool.negativeBand, complete };
  }

  let raw = 0;
  tool.questions.forEach((q, i) => {
    const v = Number(answers[i] ?? 0);
    if (q.reverse) {
      const vals = optsFor(tool, q).map((o) => o.value);
      const maxV = vals.length ? Math.max(...vals) : 0;
      raw += maxV - v;
    } else {
      raw += v;
    }
  });
  const score = tool.scale ? raw * tool.scale : raw;
  const band = tool.bands.find((b) => score <= b.max) || tool.bands[tool.bands.length - 1];
  return { score, band, complete };
}
