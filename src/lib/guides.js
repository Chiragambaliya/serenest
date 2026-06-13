/** Patient-facing topic guides — keep in sync with App.jsx routes. */
export const GUIDE_CATEGORIES = {
  conditions: 'Conditions',
  screening: 'Screening tools',
  care: 'Getting care',
};

export const PATIENT_GUIDES = [
  {
    category: 'conditions',
    title: 'Depression',
    description:
      'Online assessment, therapy, medication review, and the difference between screening, counselling, and psychiatry.',
    path: '/online-psychiatrist-for-depression-india',
  },
  {
    category: 'conditions',
    title: 'Anxiety',
    description:
      'GAD-7 screening, stepped care, when to see a psychiatrist vs counsellor, and how online therapy works.',
    path: '/anxiety-counselling-online-india',
  },
  {
    category: 'conditions',
    title: 'Adult ADHD',
    description:
      'Structured assessment, validated scales, comorbidity screening, and why prescribing is careful.',
    path: '/adhd-assessment-online-india',
  },
  {
    category: 'conditions',
    title: 'OCD',
    description:
      'Structured assessment, exposure and response prevention (ERP), and medication review where appropriate.',
    path: '/ocd-treatment-online-india',
  },
  {
    category: 'care',
    title: 'Online psychiatric prescriptions',
    description:
      'How digital prescriptions work under India’s Telemedicine Practice Guidelines — and what is not appropriate online.',
    path: '/online-psychiatrist-prescription-india',
  },
  {
    category: 'screening',
    title: 'PHQ-9 depression screening',
    description:
      'What the PHQ-9 measures, how clinicians use it, and why screening is not a diagnosis on its own.',
    path: '/phq-9-depression-screening',
  },
  {
    category: 'screening',
    title: 'GAD-7 anxiety screening',
    description:
      'What the GAD-7 measures, severity bands, and when to book a clinical assessment after screening.',
    path: '/gad-7-anxiety-screening',
  },
];

/** Subset shown on the home page guides strip. */
export const HOME_FEATURED_GUIDES = PATIENT_GUIDES.filter((g) =>
  [
    '/online-psychiatrist-for-depression-india',
    '/anxiety-counselling-online-india',
    '/adhd-assessment-online-india',
    '/ocd-treatment-online-india',
  ].includes(g.path),
);

export function guidesGroupedByCategory() {
  return Object.keys(GUIDE_CATEGORIES).map((key) => ({
    key,
    label: GUIDE_CATEGORIES[key],
    guides: PATIENT_GUIDES.filter((g) => g.category === key),
  }));
}
