import { TEAM_MEMBERS } from './team.js';

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
  '/online-psychiatrist-consultation-india': {
    title: 'Online Psychiatrist Consultation in India | Serenest',
    description:
      'Book an online psychiatrist consultation in India with verified psychiatrists. Secure video, audio, or chat sessions, PHQ-9/GAD-7 screening, and follow-up care. Pan-India access, including Gujarat.',
    ogTitle: 'Online Psychiatrist Consultation in India | Serenest',
    ogDescription:
      'Verified Indian psychiatrists. Secure online consultations with structured assessment, prescriptions where appropriate, and continuity of care.',
  },
};

// Routes that redirect (301) to a canonical route. Used by server.js.
// Useful for keyword variants of the same landing page so internal links and
// inbound links consolidate onto one URL.
export const ROUTE_ALIASES = {
  '/online-psychiatry-consultation-india': '/online-psychiatrist-consultation-india',
  '/psychiatry-online-consultation': '/online-psychiatrist-consultation-india',
  '/online-mental-health-consultation': '/online-psychiatrist-consultation-india',
  '/consult-psychiatrist-online-india': '/online-psychiatrist-consultation-india',
  '/online-psychiatry-india': '/online-psychiatrist-consultation-india',
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

// ── JSON-LD blocks per route (used both server-side in index.html injection
//    and client-side via useSEO for hydration parity) ─────────────────────────
const ORG_SCHEMA = {
  '@type': 'Organization',
  '@id': `${SITE_ORIGIN}/#organization`,
  name: 'Serenest',
  legalName: 'Serenest Education Pvt Ltd',
  url: `${SITE_ORIGIN}/`,
  email: 'support@serenest.in',
  areaServed: { '@type': 'Country', name: 'India' },
  description:
    'Serenest is a clinical telepsychiatry platform for India offering secure video, audio, and chat consultations with structured intake, assessments, and continuity of care.',
};

const WEBSITE_SCHEMA = {
  '@type': 'WebSite',
  '@id': `${SITE_ORIGIN}/#website`,
  url: `${SITE_ORIGIN}/`,
  name: 'Serenest',
  publisher: { '@id': `${SITE_ORIGIN}/#organization` },
  inLanguage: 'en-IN',
};

const MEDICAL_BUSINESS_SCHEMA = {
  '@type': 'MedicalBusiness',
  '@id': `${SITE_ORIGIN}/#medicalbusiness`,
  name: 'Serenest',
  url: `${SITE_ORIGIN}/`,
  email: 'support@serenest.in',
  medicalSpecialty: ['Psychiatry', 'Psychology', 'MentalHealth'],
  areaServed: { '@type': 'Country', name: 'India' },
  availableService: [
    {
      '@type': 'MedicalTherapy',
      name: 'Online psychiatry consultation',
      description:
        'Secure online consultation with a psychiatrist, including structured intake, clinical assessment, and follow-up care where appropriate.',
    },
    {
      '@type': 'MedicalTherapy',
      name: 'Online counselling consultation',
      description:
        'Secure online counselling support with structured intake and continuity of care.',
    },
    {
      '@type': 'MedicalTest',
      name: 'Mental health self-screening',
      description:
        'Evidence-based self-screening tools such as PHQ-9 and GAD-7 to help users understand when professional support may be useful.',
    },
  ],
};

const FAQ_ENTRIES = [
  {
    q: 'What is Serenest?',
    a: 'Serenest is a privacy-first mental health platform designed around clinical workflows: intake, assessments, consults, records, and continuity.',
  },
  {
    q: 'Are prescriptions valid at pharmacies?',
    a: 'Prescriptions issued after a consultation include the practitioner’s registration details and are designed to be verifiable and clinically documented.',
  },
  {
    q: 'Can I get Schedule H drugs prescribed online?',
    a: 'Controlled medications follow applicable regulations and are restricted to verified clinicians, and only after a proper consultation.',
  },
  {
    q: 'Is my session recorded?',
    a: 'By default, sessions are not intended to be recorded. We design for privacy-first workflows and least-access. If recording is ever introduced, it would be explicit and consent-based.',
  },
  {
    q: 'Who can see my data?',
    a: 'You, your treating practitioner(s), and authorized administrators as required for operations and compliance, following least-access principles.',
  },
  {
    q: 'What payment methods are supported?',
    a: 'We are building for UPI, cards, and net banking via Razorpay. If a payment option is not available in your flow yet, contact support and we’ll help.',
  },
  {
    q: 'What if my internet drops mid-session?',
    a: 'Rejoin the session when your connection returns. If you cannot rejoin, contact support to help reschedule or complete the session.',
  },
  {
    q: 'Can I get a refund if I miss my appointment?',
    a: 'Refund rules depend on booking status and timing. Email support and we’ll assist based on your case.',
  },
];

export const ROUTE_JSONLD = {
  '/': { '@context': 'https://schema.org', '@graph': [ORG_SCHEMA, WEBSITE_SCHEMA, MEDICAL_BUSINESS_SCHEMA] },
  '/services': {
    '@context': 'https://schema.org',
    '@graph': [
      ORG_SCHEMA,
      WEBSITE_SCHEMA,
      { ...MEDICAL_BUSINESS_SCHEMA, '@id': `${SITE_ORIGIN}/services#medicalbusiness`, url: `${SITE_ORIGIN}/services` },
    ],
  },
  '/pricing': { '@context': 'https://schema.org', '@graph': [ORG_SCHEMA, WEBSITE_SCHEMA] },
  '/book': { '@context': 'https://schema.org', '@graph': [ORG_SCHEMA, WEBSITE_SCHEMA] },
  '/screening': {
    '@context': 'https://schema.org',
    '@graph': [
      ORG_SCHEMA,
      WEBSITE_SCHEMA,
      {
        '@type': 'MedicalWebPage',
        '@id': `${SITE_ORIGIN}/screening#webpage`,
        url: `${SITE_ORIGIN}/screening`,
        name: 'Free PHQ-9 & GAD-7 Mental Health Screening',
        description:
          'A confidential 3-minute self-screening check-in using PHQ-9 and GAD-7. This screening is not a diagnosis and does not replace evaluation by a qualified clinician.',
        inLanguage: 'en-IN',
        isAccessibleForFree: true,
        audience: { '@type': 'PeopleAudience', geographicArea: { '@type': 'Country', name: 'India' } },
        about: [
          { '@type': 'MedicalCondition', name: 'Depression' },
          { '@type': 'MedicalCondition', name: 'Anxiety' },
        ],
        medicalAudience: 'Patient',
      },
    ],
  },
  '/team': {
    '@context': 'https://schema.org',
    '@graph': [
      ORG_SCHEMA,
      WEBSITE_SCHEMA,
      ...TEAM_MEMBERS.map((m, i) => ({
        '@type': 'Person',
        '@id': `${SITE_ORIGIN}/team#person-${i + 1}`,
        name: m.name,
        jobTitle: m.role || undefined,
        description: Array.isArray(m.bio) ? m.bio.join(' ') : m.bio,
        worksFor: { '@id': `${SITE_ORIGIN}/#organization` },
        knowsAbout: ['Psychiatry', 'Mental Health'],
        affiliation: m.subtitle ? { '@type': 'Organization', name: m.subtitle } : undefined,
        hasCredential: (m.credentials || []).map((c) => ({
          '@type': 'EducationalOccupationalCredential',
          name: c,
        })),
      })),
    ],
  },
  '/about': { '@context': 'https://schema.org', '@graph': [ORG_SCHEMA, WEBSITE_SCHEMA] },
  '/faq': {
    '@context': 'https://schema.org',
    '@graph': [
      ORG_SCHEMA,
      WEBSITE_SCHEMA,
      {
        '@type': 'FAQPage',
        '@id': `${SITE_ORIGIN}/faq#faq`,
        url: `${SITE_ORIGIN}/faq`,
        mainEntity: FAQ_ENTRIES.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  },
  '/privacy': {
    '@context': 'https://schema.org',
    '@graph': [
      ORG_SCHEMA,
      WEBSITE_SCHEMA,
      {
        '@type': 'WebPage',
        '@id': `${SITE_ORIGIN}/privacy#webpage`,
        url: `${SITE_ORIGIN}/privacy`,
        name: 'Privacy Policy',
        description:
          'Learn what data Serenest collects, how consultation information is protected, and how privacy-first care workflows are designed.',
        inLanguage: 'en-IN',
      },
    ],
  },
  '/online-psychiatrist-consultation-india': {
    '@context': 'https://schema.org',
    '@graph': [
      ORG_SCHEMA,
      WEBSITE_SCHEMA,
      {
        ...MEDICAL_BUSINESS_SCHEMA,
        '@id': `${SITE_ORIGIN}/online-psychiatrist-consultation-india#medicalbusiness`,
        url: `${SITE_ORIGIN}/online-psychiatrist-consultation-india`,
      },
      {
        '@type': 'MedicalWebPage',
        '@id': `${SITE_ORIGIN}/online-psychiatrist-consultation-india#webpage`,
        url: `${SITE_ORIGIN}/online-psychiatrist-consultation-india`,
        name: 'Online Psychiatrist Consultation in India',
        description:
          'Book an online psychiatrist consultation with verified Indian psychiatrists. Secure video, audio, or chat sessions, PHQ-9/GAD-7 screening, and follow-up care. Pan-India access including Gujarat.',
        inLanguage: 'en-IN',
        isAccessibleForFree: true,
        audience: { '@type': 'PeopleAudience', geographicArea: { '@type': 'Country', name: 'India' } },
        about: [
          { '@type': 'MedicalCondition', name: 'Depression' },
          { '@type': 'MedicalCondition', name: 'Anxiety Disorders' },
          { '@type': 'MedicalCondition', name: 'Obsessive-Compulsive Disorder' },
          { '@type': 'MedicalCondition', name: 'Bipolar Disorder' },
          { '@type': 'MedicalCondition', name: 'Post-Traumatic Stress Disorder' },
          { '@type': 'MedicalCondition', name: 'Sleep Disorders' },
        ],
        medicalAudience: 'Patient',
        lastReviewed: '2026-05-24',
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_ORIGIN}/online-psychiatrist-consultation-india#faq`,
        url: `${SITE_ORIGIN}/online-psychiatrist-consultation-india`,
        mainEntity: [
          {
            q: 'How do I get an online psychiatrist consultation in India?',
            a: 'Pick a slot on the Serenest booking page, complete a short intake (including PHQ-9 and GAD-7 self-screening if relevant), and join your appointment over secure video, audio, or chat. Sessions are typically 45 minutes with a verified psychiatrist.',
          },
          {
            q: 'Is online psychiatry consultation legal in India?',
            a: 'Yes. Registered medical practitioners can provide telepsychiatry consultations in India under the Telemedicine Practice Guidelines (2020) issued jointly by the Ministry of Health and the National Medical Commission. Clinicians follow these guidelines, including on prescribing.',
          },
          {
            q: 'Can a psychiatrist prescribe medication online in India?',
            a: 'In many cases, yes — a registered psychiatrist may issue a digital prescription after an appropriate consultation, following India’s Telemedicine Practice Guidelines. Some categories of medication (for example, controlled substances under Schedule X) or certain clinical situations may require in-person evaluation. The treating clinician decides what is appropriate based on your history and assessment.',
          },
          {
            q: 'How much does an online psychiatry consultation cost on Serenest?',
            a: 'Psychiatry consultations start at ₹499 per session. Final fees depend on the clinician you book with. Transparent, per-session pricing is shown before payment — see the Pricing page for current rates.',
          },
          {
            q: 'Can I consult a psychiatrist from Gujarat (Ahmedabad, Surat, Vadodara, Rajkot, Deesa) online?',
            a: 'Yes. Serenest is built for patients across India, including Gujarat. You can consult verified psychiatrists from any city or town with a stable internet connection. Sessions are available in English, Hindi, and Gujarati where the clinician supports the language.',
          },
          {
            q: 'What conditions can be addressed in an online psychiatry consultation?',
            a: 'Common areas include depression, anxiety disorders, OCD, PTSD, bipolar disorder, ADHD in adults, sleep difficulties, stress and burnout, and medication review or follow-up care. Severe or emergency presentations are not appropriate for telepsychiatry — see the emergency notice on this page.',
          },
          {
            q: 'Is online psychiatry as effective as in-person care?',
            a: 'For many common conditions, evidence supports telepsychiatry as a clinically useful option, especially for follow-up care, medication review, counselling, and continuity. Your clinician will tell you if in-person evaluation is recommended.',
          },
          {
            q: 'Is my consultation private and confidential?',
            a: 'Sessions are conducted over encrypted video and stored within Serenest’s privacy-first workflows on least-access principles. By default sessions are not recorded. See our Privacy Policy for details on what is collected and how it is protected.',
          },
        ].map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_ORIGIN}/online-psychiatrist-consultation-india#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_ORIGIN}/services` },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Online Psychiatrist Consultation in India',
            item: `${SITE_ORIGIN}/online-psychiatrist-consultation-india`,
          },
        ],
      },
    ],
  },
};

// ── HTML helpers for server-side injection ───────────────────────────────────
function escapeHtmlAttr(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeJsonLd(s) {
  // Inside <script type="application/ld+json"> only `</script` is dangerous.
  // Also break `<!--` to avoid HTML comment confusion.
  return String(s).replace(/<\/(script)/gi, '<\\/$1').replace(/<!--/g, '<\\!--');
}

/**
 * Build the SEO head HTML for a given route path. Returns the inner HTML that
 * sits between <!--SEO_HEAD_START--> and <!--SEO_HEAD_END--> sentinels.
 */
export function renderSeoHead(pathname, { noindex = false } = {}) {
  const seo = ROUTE_SEO[pathname] || ROUTE_SEO['/'];
  const canonical = canonicalUrl(pathname);
  const ogType = pathname === '/' ? 'website' : 'article';
  const jsonLd = ROUTE_JSONLD[pathname] || ROUTE_JSONLD['/'];

  const parts = [
    `<title>${escapeHtmlAttr(seo.title)}</title>`,
    `<meta name="description" content="${escapeHtmlAttr(seo.description)}" />`,
    `<link rel="canonical" href="${escapeHtmlAttr(canonical)}" />`,
    `<meta property="og:title" content="${escapeHtmlAttr(seo.ogTitle || seo.title)}" />`,
    `<meta property="og:description" content="${escapeHtmlAttr(seo.ogDescription || seo.description)}" />`,
    `<meta property="og:url" content="${escapeHtmlAttr(canonical)}" />`,
    `<meta property="og:type" content="${ogType}" />`,
    `<meta property="og:site_name" content="Serenest" />`,
  ];

  if (noindex) {
    parts.push(`<meta name="robots" content="noindex, nofollow" />`);
  }

  parts.push(
    `<script type="application/ld+json">${escapeJsonLd(JSON.stringify(jsonLd))}</script>`,
  );

  return parts.join('\n    ');
}
