/**
 * Learn hub — sections and cards shown at /learn.
 *
 * status: 'live' renders a link; 'soon' renders a muted "Coming soon" card.
 * When something ships, set status to 'live' and add `to` (internal) or `href` (external).
 */

/** @typedef {{ id: string; title: string; summary: string; status: 'live' | 'soon'; to?: string; href?: string; meta?: string }} LearnItem */
/** @typedef {{ id: string; kicker: string; title: string; intro: string; items: LearnItem[] }} LearnSection */

/** @type {LearnSection[]} */
export const LEARN_SECTIONS = [
  {
    id: 'clinicians',
    kicker: 'For doctors & students',
    title: 'Clinical learning',
    intro: 'Practical references and teaching for doctors, postgraduate trainees and MBBS students across specialties, written for Indian practice.',
    items: [
      {
        id: 'drug-guides',
        title: 'Drug Guides',
        summary: 'Mechanism, dosing, adverse effects, monitoring and India practice notes, organised by specialty.',
        status: 'live',
        to: '/professionals/drug-guides',
        meta: 'All specialties',
      },
      {
        id: 'lecture-series',
        title: 'Lecture series',
        summary: 'Narrated teaching series by specialty for MBBS and PG students, starting with Serenest Psychiatry Essentials.',
        status: 'soon',
        meta: 'Video lectures',
      },
      {
        id: 'rating-scales',
        title: 'Clinical scales & calculators',
        summary: 'Validated scores with interpretation — from PHQ-9 and CIWA-Ar to CHA₂DS₂-VASc, CURB-65, GCS and eGFR.',
        status: 'soon',
      },
      {
        id: 'quick-references',
        title: 'Clinical quick references',
        summary: 'One-page approaches to emergencies and high-stakes decisions across specialties — DKA, anaphylaxis, status epilepticus, lithium toxicity, alcohol withdrawal.',
        status: 'soon',
      },
      {
        id: 'certificate-courses',
        title: 'Certificate courses',
        summary: 'Case-based courses for practising doctors, beginning with addiction psychiatry.',
        status: 'soon',
        meta: 'Certificate',
      },
      {
        id: 'case-of-the-month',
        title: 'Case of the month',
        summary: 'A short clinical case from a different specialty each month, with discussion and teaching points.',
        status: 'soon',
      },
    ],
  },
  {
    id: 'patients',
    kicker: 'For patients & families',
    title: 'Understand your care',
    intro: 'Plain-language reading on mental health, treatment and what to expect from an online consultation.',
    items: [
      {
        id: 'guides',
        title: 'Patient guides',
        summary: 'Depression, anxiety, ADHD, screening and online prescriptions — explained simply.',
        status: 'live',
        to: '/guides',
      },
      {
        id: 'blog',
        title: 'Blog',
        summary: 'Articles and explainers from the Serenest clinical team.',
        status: 'live',
        to: '/blog',
      },
      {
        id: 'screening',
        title: 'Private check-ins',
        summary: 'Short, confidential questionnaires for mood, anxiety and burnout. Not a diagnosis.',
        status: 'live',
        to: '/screening',
      },
      {
        id: 'faq',
        title: 'FAQ',
        summary: 'Prescriptions, privacy, payments and how online care works.',
        status: 'live',
        to: '/faq',
      },
      {
        id: 'medicine-leaflets',
        title: 'Medicine leaflets',
        summary: 'Simple explanations of common medicines — what they are for and what to watch for — in English, Gujarati and Hindi.',
        status: 'soon',
      },
    ],
  },
];
