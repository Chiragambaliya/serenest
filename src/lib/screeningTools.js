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
 *
 * BAT-12 (Burnout Assessment Tool) is non-proprietary (Schaufeli et al.);
 * items must not be modified. Cite Schaufeli, Desart & De Witte (2020).
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

// BAT frequency scale (official 1–5; Never → Always)
const BAT_1_5 = [
  { label: 'Never', value: 1 },
  { label: 'Rarely', value: 2 },
  { label: 'Sometimes', value: 3 },
  { label: 'Often', value: 4 },
  { label: 'Always', value: 5 },
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

  {
    id: 'bat12',
    slug: 'burnout-bat-12',
    name: 'BAT-12',
    short: 'Burnout',
    title: 'Burnout check (BAT-12)',
    icon: '🔥',
    blurb: 'A short, modern check for exhaustion, mental distance, and cognitive or emotional strain.',
    timeframe:
      'The following statements are related to how you feel. Please state how often each statement applies to you.',
    source:
      'Burnout Assessment Tool (BAT-12), general version — Schaufeli, Desart & De Witte (2020); short form Hadžibajramović, Schaufeli & De Witte (2022). Non-proprietary; free to use; items must not be modified. Official site: burnoutassessmenttool.be',
    note:
      'A few items mention work or your job (mental distance), as in the official general BAT. Guidance ranges use published BAT-12 clinical cut-offs from European employed samples (Schaufeli et al., 2023); they are not India-specific norms and are not a diagnosis. The BAT manual notes that a total-score cut-off table for the shortened non-work (general) BAT-12 is not available.',
    options: BAT_1_5,
    scoring: 'mean',
    direction: 'higher_worse',
    questions: [
      // Exhaustion (short form *) — exact English general BAT wording
      { text: 'I feel mentally exhausted', subscale: 'exhaustion' },
      { text: 'At the end of the day, I find it hard to recover my energy', subscale: 'exhaustion' },
      { text: 'I feel physically exhausted', subscale: 'exhaustion' },
      // Mental distance (short form *)
      { text: 'I struggle to find any enthusiasm for my work', subscale: 'mental_distance' },
      { text: 'I feel a strong aversion towards my job', subscale: 'mental_distance' },
      { text: 'I’m cynical about what my work means to others', subscale: 'mental_distance' },
      // Cognitive impairment (short form *)
      { text: 'I have trouble staying focused', subscale: 'cognitive' },
      { text: 'I have trouble concentrating', subscale: 'cognitive' },
      { text: 'I make mistakes because I have my mind on other things', subscale: 'cognitive' },
      // Emotional impairment (short form *)
      { text: 'I feel unable to control my emotions', subscale: 'emotional' },
      { text: 'I do not recognize myself in the way I react emotionally', subscale: 'emotional' },
      { text: 'I may overreact unintentionally', subscale: 'emotional' },
    ],
    // Mean score (1–5). Pooled BAT-12 traffic-light cut-offs (Schaufeli et al., 2023, SJWEH):
    // orange (at risk) ≥ 2.54; red (severe burnout range) ≥ 2.96. Developed on employed samples
    // in NL / Flanders / Finland — provisional elsewhere; not a diagnosis.
    bands: [
      {
        max: 2.53,
        label: 'Lower concern',
        color: '#198754',
        desc: 'Your average is below the published “at risk” cut-off for the BAT-12 in European research samples. This is not a clean bill of health — recovery, sleep, and workload still matter.',
      },
      {
        max: 2.95,
        label: 'Elevated',
        color: '#e67e22',
        desc: 'Your average is at or above the published “at risk” BAT-12 cut-off (and below the higher cut-off) in European research samples. Rest and reducing demands are commonly discussed in burnout care; a counsellor or psychologist can help if this persists or impairs functioning.',
      },
      {
        max: 5,
        label: 'Higher concern',
        color: '#dc3545',
        desc: 'Your average is at or above the published higher BAT-12 cut-off used in European research to flag severe burnout risk. This is not a diagnosis. Clinical guidance recommends professional assessment — especially when exhaustion, detachment, or concentration problems affect daily life, or when depression or anxiety may also be present.',
      },
    ],
    seoTitle: 'Burnout Check Online (BAT-12) | Serenest Mental Health Center',
    seoDescription:
      'Free BAT-12 burnout check on Serenest — exhaustion, mental distance, and cognitive or emotional strain. Educational results, not a diagnosis. Private by default.',
  },
];

/**
 * Human-facing Care experience metadata (Mental Health Center).
 * Keeps validated item banks untouched; enriches discovery, education, and next steps.
 */
const EXPERIENCE_BY_ID = {
  phq9: {
    category: 'mood',
    dimensionId: 'mood',
    humanTitle: 'Check your mood',
    audience: 'Anyone noticing low mood, loss of interest, or changes in sleep, appetite, or energy',
    whatItChecks: 'Common signs of depression over the last two weeks, using the PHQ-9.',
    whatItDoesNotMean: [
      'A diagnosis of depression',
      'That you need medication',
      'That nothing is wrong if your score is low — context still matters',
    ],
    commonSigns: [
      'Low interest or pleasure in usual activities',
      'Feeling down or hopeless',
      'Sleep or appetite changes',
      'Trouble concentrating',
      'Feeling tired or worthless',
    ],
    selfCare: [
      'Keep a simple daily routine for sleep and meals',
      'Gentle movement or time outdoors, if you can',
      'Tell one trusted person how you have been feeling',
      'Reduce alcohol while mood is low',
    ],
    learnLinks: [
      { to: '/online-psychiatrist-for-depression-india', label: 'Depression care online' },
      { to: '/phq-9-depression-screening', label: 'What the PHQ-9 is' },
      { to: '/blog/sleep-mood-stress-loop', label: 'Sleep, mood, and stress' },
      { to: '/academy', label: 'Serenest Academy' },
    ],
    careGuidance: {
      mild: 'Self-care and learning may be enough for now. Consider a counsellor if this lasts more than a few weeks.',
      moderate: 'A psychologist or therapist is often a good next step. A psychiatrist can help if symptoms are intense or long-standing.',
      high: 'Speaking with a psychiatrist soon is reasonable — especially if daily life, work, or safety feels affected.',
    },
  },
  gad7: {
    category: 'anxiety',
    dimensionId: 'anxiety',
    humanTitle: 'Understand your anxiety',
    audience: 'Anyone dealing with worry, restlessness, or feeling on edge',
    whatItChecks: 'Common signs of generalized anxiety over the last two weeks, using the GAD-7.',
    whatItDoesNotMean: [
      'A diagnosis of an anxiety disorder',
      'That anxiety is “all in your head”',
      'That you must start medication',
    ],
    commonSigns: [
      'Trouble controlling worry',
      'Feeling nervous or on edge',
      'Difficulty relaxing',
      'Restlessness or irritability',
      'Fear that something awful will happen',
    ],
    selfCare: [
      'Short breathing or grounding breaks during the day',
      'Limit late-night news and stimulating screens',
      'Caffeine cut-back if it worsens jitters',
      'Write worries down once, then return to one next step',
    ],
    learnLinks: [
      { to: '/anxiety-counselling-online-india', label: 'Anxiety counselling online' },
      { to: '/gad-7-anxiety-screening', label: 'What the GAD-7 is' },
      { to: '/blog/screens-stimulation-and-anxiety', label: 'Screens, stimulation, and anxiety' },
      { to: '/academy', label: 'Serenest Academy' },
    ],
    careGuidance: {
      mild: 'Self-care and psychoeducation often help. Book counselling if worry keeps returning.',
      moderate: 'Talk therapy (for example CBT-informed care) is commonly helpful. A psychiatrist can assess if symptoms are severe.',
      high: 'Consider a psychiatrist or psychologist promptly — especially if panic, avoidance, or sleep loss is escalating.',
    },
  },
  pss10: {
    category: 'stress',
    dimensionId: 'stress',
    humanTitle: 'Understand your stress',
    audience: 'People who feel overloaded, stretched, or unable to catch up',
    whatItChecks: 'How unpredictable, uncontrollable, and overloaded life has felt in the last month (PSS-10).',
    whatItDoesNotMean: [
      'A medical diagnosis',
      'That you are “failing” at life',
      'That stress is only work-related',
    ],
    commonSigns: [
      'Feeling unable to control important things',
      'Nervousness or irritability',
      'Sense that difficulties are piling up',
      'Trouble coping with daily demands',
    ],
    selfCare: [
      'Protect one non-negotiable rest block this week',
      'Say no to one optional demand',
      'Sleep and meal timing before productivity hacks',
      'Talk to someone who will not minimize your load',
    ],
    learnLinks: [
      { to: '/blog/work-stress-without-the-hustle-narrative', label: 'Work stress without hustle culture' },
      { to: '/blog/sleep-mood-stress-loop', label: 'Sleep, mood, and stress' },
    ],
    careGuidance: {
      mild: 'Adjust load and recovery first. Counselling helps if stress is chronic.',
      moderate: 'A counsellor or psychologist can help with coping and boundaries.',
      high: 'If stress comes with low mood, panic, or burnout, professional care is worth prioritizing.',
    },
  },
  who5: {
    category: 'stress',
    dimensionId: 'wellbeing',
    humanTitle: 'Check your wellbeing',
    audience: 'Anyone wanting a short, positive check on how life feels lately',
    whatItChecks: 'General wellbeing over the last two weeks using the WHO-5 (higher scores suggest better wellbeing).',
    whatItDoesNotMean: [
      'A diagnosis',
      'That low wellbeing always means depression',
      'That high wellbeing means you never need support',
    ],
    commonSigns: [
      'Less cheerfulness or calm',
      'Low energy or freshness on waking',
      'Fewer things that feel interesting',
    ],
    selfCare: [
      'One enjoyable activity you have postponed',
      'Daylight and movement early in the day',
      'Protect sleep window for a few nights',
    ],
    learnLinks: [
      { to: '/blog/stigma-and-reaching-out', label: 'Stigma and reaching out' },
      { to: '/guides', label: 'Patient guides' },
    ],
    careGuidance: {
      mild: 'Keep habits that support wellbeing; re-check in two weeks.',
      moderate: 'Consider counselling if low wellbeing lasts or worsens.',
      high: 'Low wellbeing can travel with depression — a clinical conversation is appropriate.',
    },
  },
  auditc: {
    category: 'substance',
    dimensionId: 'substance',
    humanTitle: 'Check alcohol use',
    audience: 'Adults who drink and want a private sense of risk patterns',
    whatItChecks: 'Drinking frequency and intensity using the WHO AUDIT-C.',
    whatItDoesNotMean: [
      'A diagnosis of alcohol dependence',
      'Moral judgment about drinking',
      'That cutting down is impossible without help — though help can make it easier',
    ],
    commonSigns: [
      'Drinking more days than intended',
      'Higher amounts on drinking days',
      'Frequent heavy drinking occasions',
    ],
    selfCare: [
      'Set drink-free days each week',
      'Switch to smaller measures or slower pacing',
      'Avoid drinking to manage sleep or anxiety alone',
    ],
    learnLinks: [
      { to: '/services', label: 'Clinical care on Serenest' },
      { to: '/blog/privacy-first-mental-health', label: 'Privacy-first care' },
    ],
    careGuidance: {
      mild: 'Keep an eye on patterns; cut back if use is creeping up.',
      moderate: 'A professional can help you cut down safely.',
      high: 'Please speak with a clinician — higher-risk patterns deserve structured support.',
    },
  },
  asrs: {
    category: 'attention',
    dimensionId: 'attention',
    humanTitle: 'Check adult attention',
    audience: 'Adults wondering about focus, organization, or restlessness over months',
    whatItChecks: 'WHO ASRS v1.1 Part A — a brief screener for adult ADHD-related patterns.',
    whatItDoesNotMean: [
      'An ADHD diagnosis',
      'That you should start stimulant medication',
      'That childhood history is irrelevant — full assessment still matters',
    ],
    commonSigns: [
      'Trouble finishing details',
      'Disorganization or forgotten obligations',
      'Avoiding tasks that need sustained thought',
      'Fidgeting or feeling driven',
    ],
    selfCare: [
      'Externalize tasks (lists, timers, one priority)',
      'Reduce multitasking during deep work',
      'Sleep and screen hygiene before self-labeling',
    ],
    learnLinks: [
      { to: '/adhd-assessment-online-india', label: 'Adult ADHD assessment' },
      { to: '/blog/prepare-first-online-consultation', label: 'Prepare for a first consultation' },
    ],
    careGuidance: {
      mild: 'If concerns persist, an assessment can still clarify other causes (sleep, anxiety, mood).',
      moderate: 'A structured adult ADHD assessment with a psychiatrist is the right clinical path.',
      high: 'Book a structured assessment — screening alone cannot confirm ADHD.',
    },
  },
  k10: {
    category: 'stress',
    dimensionId: 'distress',
    humanTitle: 'Check emotional distress',
    audience: 'Anyone feeling worn down, nervous, or low across the last month',
    whatItChecks: 'Overall psychological distress in the past 30 days (K10).',
    whatItDoesNotMean: [
      'A specific diagnosis',
      'That distress is permanent',
      'That only “severe” scores deserve care',
    ],
    commonSigns: [
      'Tiredness without clear reason',
      'Nervousness or hopelessness',
      'Restlessness',
      'Feeling that everything is an effort',
    ],
    selfCare: [
      'Reduce unnecessary decisions for a few days',
      'Reach out before isolating',
      'Basic sleep and nutrition before big life changes',
    ],
    learnLinks: [
      { to: '/blog/family-friends-support-without-burnout', label: 'Support without burnout' },
      { to: '/screening', label: 'Mental Health Center' },
    ],
    careGuidance: {
      mild: 'Monitor and use self-care; re-check if things worsen.',
      moderate: 'Counselling or therapy can help unpack load and coping.',
      high: 'Please consider a psychiatrist or psychologist soon.',
    },
  },
  pcl5: {
    category: 'trauma',
    dimensionId: 'trauma',
    humanTitle: 'Check after a stressful event',
    audience: 'Adults with symptoms after a traumatic or highly stressful experience',
    whatItChecks: 'PTSD-related symptom burden in the past month (PCL-5), thinking of one stressful experience.',
    whatItDoesNotMean: [
      'A PTSD diagnosis',
      'That you must recount every detail to get help',
      'That delayed symptoms are “not real”',
    ],
    commonSigns: [
      'Intrusive memories or nightmares',
      'Avoidance of reminders',
      'Negative beliefs or blame',
      'Feeling on guard, jumpy, or cut off',
    ],
    selfCare: [
      'Go slowly — pause this check if it feels overwhelming',
      'Use grounding (5 things you see/hear) if memories surge',
      'Prefer trauma-informed clinicians for next steps',
    ],
    learnLinks: [
      { to: '/emergency-disclaimer', label: 'Crisis and emergency guidance' },
      { to: '/blog/stigma-and-reaching-out', label: 'Reaching out for care' },
    ],
    careGuidance: {
      mild: 'If symptoms still trouble you, trauma-informed therapy can help regardless of score.',
      moderate: 'A trauma-informed psychologist or psychiatrist is appropriate.',
      high: 'Please seek trauma-informed professional care — you do not have to manage this alone.',
    },
  },
  scoff: {
    category: 'eating',
    dimensionId: 'eating',
    humanTitle: 'Check eating patterns',
    audience: 'Anyone worried about control, bingeing, purging, or body image around food',
    whatItChecks: 'Possible eating-disorder patterns using the SCOFF questionnaire.',
    whatItDoesNotMean: [
      'A diagnosis of an eating disorder',
      'That body size alone defines the problem',
      'That you must wait until things are “severe”',
    ],
    commonSigns: [
      'Feeling out of control with eating',
      'Vomiting after fullness',
      'Rapid weight change',
      'Food dominating daily life',
    ],
    selfCare: [
      'Avoid extreme restriction as “discipline”',
      'Eat regular meals where possible',
      'Seek help early — earlier support is easier',
    ],
    learnLinks: [
      { to: '/services', label: 'Clinical care options' },
      { to: '/blog/prepare-first-online-consultation', label: 'Prepare for a consultation' },
    ],
    careGuidance: {
      mild: 'If food or body image still worries you, a professional can help.',
      moderate: 'Please consider a clinical assessment — eating concerns deserve specialist care.',
      high: 'Seek professional assessment promptly.',
    },
  },
  bat12: {
    category: 'stress',
    dimensionId: 'burnout',
    humanTitle: 'Check your burnout',
    minutes: 3,
    audience:
      'Adults who feel exhausted, detached from work or their role, cognitively foggy, or emotionally reactive in the context of sustained overload',
    whatItChecks:
      'Core burnout symptoms using the BAT-12 general version: exhaustion, mental distance, cognitive impairment, and emotional impairment (Schaufeli et al., 2020; Hadžibajramović et al., 2022). Your result is the mean of 12 items scored from 1 (Never) to 5 (Always).',
    whatItDoesNotMean: [
      'A medical diagnosis — WHO classifies burn-out as an occupational phenomenon, not a medical condition (ICD-11)',
      'That you must quit your job or role',
      'That India-specific population norms were used — cut-offs come from European employed samples (Schaufeli et al., 2023)',
      'That a score replaces a clinician’s judgment or a full assessment that may also consider depression, anxiety, or medical causes of fatigue',
    ],
    commonSigns: [
      'Energy depletion or exhaustion',
      'Mental distance, negativism, or cynicism related to work or one’s role',
      'Trouble staying focused or concentrating; mistakes when the mind is elsewhere',
      'Difficulty controlling or recognizing one’s emotional reactions',
    ],
    selfCare: [
      'Prioritize sleep and recovery — sleep quality is linked to burnout recovery in clinical literature',
      'Reduce exposure to ongoing overload where possible; recovery typically requires lowering demand, not adding productivity tactics',
      'Use social support — talk with someone who will not minimize the load',
      'If functioning is impaired, seek a clinical conversation rather than waiting for collapse',
    ],
    learnLinks: [
      { to: '/blog/work-stress-without-the-hustle-narrative', label: 'Work stress without hustle culture' },
      { to: '/blog/sleep-mood-stress-loop', label: 'Sleep, mood, and stress' },
      { to: '/blog/family-friends-support-without-burnout', label: 'Support without burning out' },
      { to: '/screening/tool/pss-10', label: 'Related: stress check (PSS-10)' },
      { to: '/screening/tool/phq-9', label: 'Related: mood check (PHQ-9)' },
      { to: '/screening/tool/who-5', label: 'Related: wellbeing check (WHO-5)' },
    ],
    careGuidance: {
      mild: 'Focus on recovery and workload. Re-check later, or use the stress (PSS-10) and mood (PHQ-9) checks if low mood or overload feel more central.',
      moderate: 'Psychological support (counselling/psychology) is commonly used for recovery, boundaries, and coping. Consider psychiatric assessment if low mood, anxiety, insomnia, or functional decline is severe — burnout and depression can overlap and need clinical differentiation.',
      high: 'Clinical literature recommends professional assessment for severe burnout complaints. Please consider a psychiatrist or psychologist soon — especially if you cannot recover with rest, concentration is collapsing, or depression/anxiety may also be present.',
    },
  },
};

function estimateMinutes(tool) {
  return Math.max(1, Math.round((tool.questions.length * 12) / 60));
}

function enrich(tool) {
  const exp = EXPERIENCE_BY_ID[tool.id] || {};
  return {
    ...tool,
    ...exp,
    minutes: exp.minutes || estimateMinutes(tool),
    humanTitle: exp.humanTitle || tool.title,
  };
}

/** @type {typeof SCREENING_TOOLS} */
export const SCREENING_TOOLS_ENRICHED = SCREENING_TOOLS.map(enrich);

export function getTool(slug) {
  const raw = SCREENING_TOOLS.find((t) => t.slug === slug || t.id === slug);
  return raw ? enrich(raw) : null;
}

export function getAllTools() {
  return SCREENING_TOOLS_ENRICHED;
}

export function toolsForCategory(categoryId) {
  if (!categoryId || categoryId === 'all') return SCREENING_TOOLS_ENRICHED;
  return SCREENING_TOOLS_ENRICHED.filter((t) => t.category === categoryId);
}

/** Map numeric/threshold results to mild | moderate | high for care copy */
export function careTier(tool, result) {
  if (!result?.band) return 'mild';
  if (tool.scoring === 'threshold_count') return result.positive ? 'high' : 'mild';
  const label = result.band.label || '';
  if (/severe|higher risk|higher concern|possible dependence|positive screen|consistent with|very low/i.test(label))
    return 'high';
  if (/moderate|increased|mild distress|low wellbeing|elevated|at risk/i.test(label)) return 'moderate';
  return 'mild';
}

function optsFor(tool, q) {
  return q.options || tool.options || [];
}

/** Maximum possible numeric score (for the progress bar / result scale). */
export function maxScore(tool) {
  if (tool.scoring === 'threshold_count') return tool.questions.length;
  if (tool.scoring === 'mean') {
    const vals = tool.questions.flatMap((q) => optsFor(tool, q).map((o) => o.value));
    return vals.length ? Math.max(...vals) : 5;
  }
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

  if (tool.scoring === 'mean') {
    const score = raw / tool.questions.length;
    const band = tool.bands.find((b) => score <= b.max) || tool.bands[tool.bands.length - 1];
    return { score, band, complete };
  }

  const score = tool.scale ? raw * tool.scale : raw;
  const band = tool.bands.find((b) => score <= b.max) || tool.bands[tool.bands.length - 1];
  return { score, band, complete };
}
