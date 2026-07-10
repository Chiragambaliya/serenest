/**

 * Public routes Serenest Guide may recommend.

 * Keep aligned with src/App.jsx and server.js VALID_ROUTES.

 */

export const SITE_GUIDE_ROUTES = [

  { path: '/', label: 'Home — overview and main CTAs' },

  { path: '/book', label: 'Book an online psychiatry or counselling appointment' },

  { path: '/screening', label: 'Self-screening (PHQ-9 & GAD-7) — not a diagnosis' },

  { path: '/patient/find-professional', label: 'Find a verified professional' },

  { path: '/services', label: 'Services and conditions we support' },

  { path: '/pricing', label: 'Fees and session pricing' },

  { path: '/faq', label: 'FAQ — prescriptions, privacy, payments' },

  { path: '/guides', label: 'Patient guides — depression, anxiety, ADHD, screening, prescriptions' },

  { path: '/about', label: 'About Serenest and our mission' },

  { path: '/team', label: 'Clinical team and credentials' },

  { path: '/blog', label: 'Articles and explainers' },

  { path: '/academy', label: 'Serenest Academy — literacy, learning, partnerships' },

  { path: '/academy/program/clinical-excellence', label: 'Clinical Excellence — flagship course for practicing mental health professionals (free for Serenest pros)' },

  { path: '/academy#tracks', label: 'Academy programmes (pharmacology & psychology overview)' },

  { path: '/academy/learn', label: 'Academy learning hub (clinician tracks)' },

  { path: '/academy/learn#learning-pharmacology', label: 'Pharmacology learning track' },

  { path: '/academy/learn#learning-psychology', label: 'Psychology learning track' },

  { path: '/professionals', label: 'For clinicians — join or partner' },

  { path: '/professionals/resources', label: 'Professional resources and downloads' },

  { path: '/professionals/guidelines', label: 'Clinical guidelines for professionals' },

  { path: '/professionals/apply', label: 'Apply to join as a professional' },

  { path: '/privacy', label: 'Privacy policy' },

  { path: '/online-psychiatrist-for-depression-india', label: 'Online psychiatrist for depression' },

  { path: '/anxiety-counselling-online-india', label: 'Anxiety counselling online' },

  { path: '/adhd-assessment-online-india', label: 'Adult ADHD assessment online' },
  { path: '/ocd-treatment-online-india', label: 'OCD treatment online' },

  { path: '/phq-9-depression-screening', label: 'PHQ-9 depression screening info' },

  { path: '/gad-7-anxiety-screening', label: 'GAD-7 anxiety screening info' },

  { path: '/online-psychiatrist-prescription-india', label: 'Online psychiatric prescriptions in India (info)' },

];



export function formatSiteGuideForPrompt() {

  return SITE_GUIDE_ROUTES.map((r) => `- **${r.path}** — ${r.label}`).join('\n');

}

