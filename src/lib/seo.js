// Production canonical host. Matches the live www-redirect target.
export const SITE_ORIGIN = 'https://www.serenest.in';

export function canonicalUrl(path = '/') {
  const clean = path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}`;
  return clean === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${clean}`;
}

// Per-route SEO metadata for indexable pages.
export const ROUTE_SEO = {
  '/': {
    title: 'Online Psychiatrist & Mental Health Care in India | Serenest',
    description:
      'Book secure online psychiatry, counselling, self-screening, and follow-up care with verified mental health professionals across India.',
    ogTitle: 'Serenest | Online Mental Health Care in India',
    ogDescription:
      'Secure online psychiatry, counselling, screening, and follow-up care for people across India.',
  },
  '/services': {
    title: 'Online Psychiatrist Consultation in India | Video, Audio & Chat',
    description:
      'Consult a verified psychiatrist or psychologist online from anywhere in India with encrypted video, audio, or chat sessions.',
    ogTitle: 'Online Psychiatrist Consultation in India | Serenest',
    ogDescription:
      'Secure video, audio, or chat consultations with verified clinicians across India.',
  },
  '/pricing': {
    title: 'Online Psychiatrist Fees & Therapy Pricing in India | Serenest',
    description:
      'Transparent pay-per-session pricing for psychiatry, therapy, psychological assessment, and institutional mental health plans.',
    ogTitle: 'Serenest Pricing | Online Psychiatry & Therapy in India',
    ogDescription:
      'Transparent per-session pricing for online psychiatry, therapy, and assessments.',
  },
  '/book': {
    title: 'Book an Online Psychiatrist Appointment in India | Serenest',
    description:
      'Choose your care type, consultation mode, and appointment slot for a confidential online mental health consultation with Serenest.',
    ogTitle: 'Book an Online Psychiatrist | Serenest',
    ogDescription:
      'Book a confidential online psychiatry or counselling appointment in minutes.',
  },
  '/screening': {
    title: 'Free PHQ-9 & GAD-7 Mental Health Screening | Serenest',
    description:
      'Take a confidential 3-minute self-screening check-in using PHQ-9 and GAD-7 tools. Screening is not a diagnosis.',
    ogTitle: 'Free PHQ-9 & GAD-7 Self-Screening | Serenest',
    ogDescription:
      'A confidential 3-minute mental health check-in. Screening is not a diagnosis.',
  },
  '/team': {
    title: 'Verified Psychiatrists & Mental Health Professionals | Serenest',
    description:
      'Meet Serenest’s psychiatrist-led team and learn about clinical credentials, documentation, and continuity of care.',
    ogTitle: 'Serenest Team | Verified Mental Health Professionals',
    ogDescription:
      'Psychiatrist-led team focused on structured intake, documentation, and continuity of care.',
  },
  '/about': {
    title: 'About Serenest | Psychiatrist-Built Mental Health Platform',
    description:
      'Learn why Serenest was built to make psychiatric care accessible, private, and clinically structured across India.',
    ogTitle: 'About Serenest | Psychiatrist-Built Mental Health Platform',
    ogDescription:
      'A psychiatrist-built telepsychiatry platform focused on access, privacy, and structured care.',
  },
  '/faq': {
    title: 'Online Psychiatry FAQ India | Prescriptions, Privacy & Payments',
    description:
      'Answers to common questions about online psychiatric consultations, prescriptions, privacy, payments, and technical support.',
    ogTitle: 'Online Psychiatry FAQ | Serenest',
    ogDescription:
      'Common questions on online psychiatry, prescriptions, privacy, and payments — answered.',
  },
  '/privacy': {
    title: 'Privacy Policy | Serenest Mental Health Platform India',
    description:
      'Learn what data Serenest collects, how consultation information is protected, and how privacy-first care workflows are designed.',
    ogTitle: 'Privacy Policy | Serenest',
    ogDescription:
      'How Serenest collects, protects, and processes consultation and personal data.',
  },
};

// Routes that the SPA renders but should NOT be indexed (utility/internal pages).
export const NOINDEX_ROUTES = new Set([
  '/admin',
  '/professionals/apply',
  '/patient/find-professional',
]);

export function shouldNoindex(pathname) {
  if (!pathname) return false;
  if (pathname.startsWith('/consultation')) return true;
  for (const p of NOINDEX_ROUTES) {
    if (pathname === p || pathname.startsWith(`${p}/`)) return true;
  }
  return false;
}
