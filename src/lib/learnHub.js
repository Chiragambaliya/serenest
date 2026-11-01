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
    intro: 'Practical psychiatry references and teaching for psychiatrists, residents and MBBS students, written for Indian practice.',
    items: [
      {
        id: 'drug-guides',
        title: 'Drug Guides',
        summary: 'Mechanism, dosing, adverse effects, monitoring and India practice notes for commonly prescribed psychiatric drugs.',
        status: 'live',
        to: '/professionals/drug-guides',
        meta: '10 drugs',
      },
      {
        id: 'psychiatry-essentials',
        title: 'Serenest Psychiatry Essentials',
        summary: 'Narrated lecture series covering core psychiatry topics for MBBS and PG students.',
        status: 'soon',
        meta: 'Video lectures',
      },
      {
        id: 'rating-scales',
        title: 'Rating scales library',
        summary: 'Common scales — PHQ-9, GAD-7, YMRS, HAM-D, CIWA-Ar, COWS — with scoring and interpretation.',
        status: 'soon',
      },
      {
        id: 'quick-references',
        title: 'Clinical quick references',
        summary: 'One-page approaches to emergencies and high-stakes decisions: lithium toxicity, serotonin syndrome vs NMS, catatonia, alcohol withdrawal.',
        status: 'soon',
      },
      {
        id: 'addiction-course',
        title: 'Addiction psychiatry certificate course',
        summary: 'Case-based course for practising doctors on assessment and treatment of substance use disorders.',
        status: 'soon',
        meta: 'Certificate',
      },
      {
        id: 'case-of-the-month',
        title: 'Case of the month',
        summary: 'A short clinical case with discussion and teaching points.',
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
        summary: 'Simple explanations of common psychiatric medicines in English, Gujarati and Hindi.',
        status: 'soon',
      },
    ],
  },
];
