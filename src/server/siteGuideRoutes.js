import { SPECIALTIES, SPECIALTY_INDEX_PATH } from '../lib/specialties.js';

/**

 * Public routes Serenest Guide may recommend.

 * Keep aligned with src/App.jsx and server.js VALID_ROUTES.

 */

export const SITE_GUIDE_ROUTES = [

  { path: '/', label: 'Home — overview and main CTAs' },

  { path: '/book', label: 'Book an online psychiatry or counselling appointment' },

  { path: '/screening', label: 'Mental Health Center — mood, anxiety, burnout & other checks (not a diagnosis)' },
  { path: '/screening/pathway/mood-anxiety', label: 'Guided mood & anxiety check (PHQ-9 + GAD-7)' },
  { path: '/burnout-check', label: 'Burnout Check product page (BAT-12) — education before care' },
  { path: '/screening/tool/burnout-bat-12', label: 'Burnout check assessment (BAT-12) — not a diagnosis' },
  { path: '/evidence', label: 'Evidence Center — instruments, licensing, limitations' },
  { path: '/evidence/bat-12', label: 'BAT-12 Burnout Check evidence report' },

  { path: '/patient/find-professional', label: 'Find a verified professional' },

  { path: '/services', label: 'Services and conditions we support' },

  { path: '/pricing', label: 'Fees and session pricing' },

  { path: '/faq', label: 'FAQ — prescriptions, privacy, payments' },

  { path: '/guides', label: 'Patient guides — depression, anxiety, ADHD, screening, prescriptions' },

  { path: '/about', label: 'About Serenest and our mission' },

  { path: '/team', label: 'Clinical team and credentials' },

  { path: '/blog', label: 'Articles and explainers' },

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

  { path: SPECIALTY_INDEX_PATH, label: 'Every adult mental-health specialty' },
  ...SPECIALTIES.map((item) => ({ path: item.path, label: item.name })),

];



export function formatSiteGuideForPrompt() {
  const seen = new Set();
  return SITE_GUIDE_ROUTES.filter((route) => {
    if (seen.has(route.path)) return false;
    seen.add(route.path);
    return true;
  }).map((route) => `- **${route.path}** — ${route.label}`).join('\n');
}

