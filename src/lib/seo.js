import { TEAM_MEMBERS } from './team.js';
import { SCREENING_TOOLS } from './screeningTools.js';

// Production canonical host. Matches the live www-redirect target.
export const SITE_ORIGIN = 'https://www.serenest.in';

export function canonicalUrl(path = '/') {
  const clean = path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}`;
  return clean === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${clean}`;
}

// Per-route SEO metadata for indexable pages.
export const ROUTE_SEO = {
  '/': {
    title: 'Online Psychiatry, Therapy & Wellness in India | Serenest',
    description:
      "Serenest is India's mental health ecosystem: online psychiatry, therapy, counselling, screening, and de-addiction support with verified professionals.",
    ogTitle: "Serenest | India's Mental Health Ecosystem",
    ogDescription:
      'Online psychiatry, therapy, screening, de-addiction support, and clinician education — verified, private care across India.',
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
  '/guides': {
    title: 'Mental Health Guides India | Depression, Anxiety, ADHD & More | Serenest',
    description:
      'Patient guides on depression, anxiety, ADHD, online psychiatry in India, PHQ-9 and GAD-7 screening, and telemedicine prescriptions.',
    ogTitle: 'Mental Health Guides | Serenest India',
    ogDescription:
      'Clear, clinical guides on common mental health topics and online care in India.',
  },
  '/academy': {
    title: 'Serenest Academy | Mental Health Literacy & Learning India',
    description:
      'Flagship Clinical Excellence course for practicing professionals, plus certificates and fellowships. Free for approved Serenest professionals.',
    ogTitle: 'Serenest Academy | Clinical Excellence Flagship Course',
    ogDescription:
      'Best course for mental health professionals — assessment, telepsychiatry, documentation, and measurement-based care. Free for Serenest pros.',
  },
  '/professionals': {
    title: 'For Mental Health Professionals | Join Serenest | India',
    description:
      'Join Serenest as a verified clinician. Practice tools, learning resources, and free Serenest Academy access for approved professionals.',
    ogTitle: 'For Mental Health Professionals | Serenest India',
    ogDescription:
      'Join Serenest as a verified clinician. Clinical learning, resources, and free Academy access for approved professionals.',
  },
  '/professionals/learning': {
    title: 'Clinical Learning Hub | Psychiatry & Psychology CPD | Serenest',
    description:
      'Continuing professional development for psychiatrists, psychologists, and counsellors. Pharmacology, psychology, and clinical practice modules from Serenest.',
    ogTitle: 'Clinical Learning Hub | Serenest Professionals',
    ogDescription:
      'CPD-oriented learning modules in pharmacology, psychology, and clinical practice for mental health professionals.',
  },
  '/professionals/resources': {
    title: 'Clinical Resources for Mental Health Professionals | Serenest',
    description:
      'Tools, templates, and clinical reference materials for psychiatrists, psychologists, and counsellors working with Serenest.',
    ogTitle: 'Clinical Resources | Serenest Professionals',
    ogDescription:
      'Clinical reference materials, tools, and templates for verified mental health professionals.',
  },
  '/professionals/guidelines': {
    title: 'Clinical Practice Guidelines | Serenest Professionals',
    description:
      'Evidence-informed practice guidelines for clinical documentation, telehealth, prescribing, and continuity of care at Serenest.',
    ogTitle: 'Practice Guidelines | Serenest Professionals',
    ogDescription:
      'Practice guidelines for clinical documentation, telehealth, and continuity of care at Serenest.',
  },
  '/blog': {
    title: 'Mental Health Blog | Clinical Insights & Patient Guides | Serenest',
    description:
      'Read the Serenest blog for clinical insights, patient guides, and mental health updates — covering depression, anxiety, ADHD, telepsychiatry, and more.',
    ogTitle: 'Serenest Blog | Mental Health Clinical Insights',
    ogDescription:
      'Clinical insights, patient guides, and mental health updates from the Serenest team.',
  },
  '/privacy': {
    title: 'Privacy Policy | Serenest Mental Health Platform India',
    description:
      'Learn what data Serenest collects, how consultation information is protected, and how privacy-first care workflows are designed.',
    ogTitle: 'Privacy Policy | Serenest',
    ogDescription:
      'How Serenest collects, protects, and processes consultation and personal data.',
  },
  '/online-psychiatrist-for-depression-india': {
    title: 'Online Psychiatrist for Depression in India | Serenest',
    description:
      'Consult an online psychiatrist for depression in India. PHQ-9 screening, structured assessment, therapy or medication review by a verified psychiatrist. Not a diagnosis; not an emergency service.',
    ogTitle: 'Online Psychiatrist for Depression in India | Serenest',
    ogDescription:
      'Verified Indian psychiatrists for depression care online — screening, assessment, therapy, and medication review where clinically appropriate.',
  },
  '/anxiety-counselling-online-india': {
    title: 'Anxiety Counselling Online in India | Online Psychiatrist for Anxiety | Serenest',
    description:
      'Anxiety counselling online in India with verified psychiatrists and psychologists. GAD-7 screening, structured assessment, and stepped care. Screening is not a diagnosis; not an emergency service.',
    ogTitle: 'Anxiety Counselling Online in India | Serenest',
    ogDescription:
      'Online psychiatrist and counsellor support for anxiety in India. GAD-7 screening, structured care, and follow-up.',
  },
  '/adhd-assessment-online-india': {
    title: 'ADHD Assessment Online in India | Adult ADHD Psychiatrist | Serenest',
    description:
      'Structured adult ADHD assessment online in India with verified psychiatrists. Detailed history, validated rating scales, and clinically led prescribing decisions. Not a same-day prescription service.',
    ogTitle: 'ADHD Assessment Online in India | Serenest',
    ogDescription:
      'Structured adult ADHD assessment online with verified Indian psychiatrists. Validated scales, careful prescribing, ongoing follow-up.',
  },
  '/ocd-treatment-online-india': {
    title: 'OCD Treatment Online in India | ERP & Psychiatry | Serenest',
    description:
      'OCD treatment online in India with verified psychiatrists and psychologists. Structured assessment, exposure and response prevention (ERP), and medication review where clinically appropriate. Not an emergency service.',
    ogTitle: 'OCD Treatment Online in India | Serenest',
    ogDescription:
      'Evidence-based online OCD care in India — structured assessment, ERP-focused therapy, and psychiatric follow-up.',
  },
  '/online-psychiatrist-gujarat': {
    title: 'Online Psychiatrist in Gujarat | Gujarati-Speaking Telepsychiatry | Serenest',
    description:
      'Online psychiatrist consultation for Gujarat — Ahmedabad, Surat, Vadodara, Rajkot, North Gujarat and beyond. Gujarati-, Hindi-, and English-language sessions where the clinician supports them.',
    ogTitle: 'Online Psychiatrist in Gujarat | Serenest',
    ogDescription:
      'Verified online psychiatrists for patients in Gujarat. Secure consultations, structured assessment, follow-up — in Gujarati where supported.',
  },
  '/phq-9-depression-screening': {
    title: 'PHQ-9 Depression Screening Online (India) | Serenest',
    description:
      'Take a free PHQ-9 depression screening online from India. A validated 9-item self-check used by clinicians. PHQ-9 is a screening tool, not a diagnosis — only a clinician can diagnose depression.',
    ogTitle: 'PHQ-9 Depression Screening Online | Serenest',
    ogDescription:
      'Free, confidential PHQ-9 depression self-screening for India. PHQ-9 is a screening tool and is not a diagnosis.',
  },
  '/gad-7-anxiety-screening': {
    title: 'GAD-7 Anxiety Screening Online (India) | Serenest',
    description:
      'Take a free GAD-7 anxiety screening online from India. A validated 7-item self-check used by clinicians. GAD-7 is a screening tool, not a diagnosis — only a clinician can diagnose an anxiety disorder.',
    ogTitle: 'GAD-7 Anxiety Screening Online | Serenest',
    ogDescription:
      'Free, confidential GAD-7 anxiety self-screening for India. GAD-7 is a screening tool and is not a diagnosis.',
  },
  '/online-psychiatrist-prescription-india': {
    title: 'Online Psychiatrist Prescription in India | Valid Under Telemedicine Guidelines | Serenest',
    description:
      'How online psychiatrist prescriptions work in India under the Telemedicine Practice Guidelines, 2020. Categories of medicines, Schedule X limits, validity at pharmacies, and clinician judgment explained.',
    ogTitle: 'Online Psychiatrist Prescription in India | Serenest',
    ogDescription:
      'A clear, India-specific explainer on online psychiatric prescriptions: validity, regulations, limitations, and clinician judgment.',
  },
  '/legal': {
    title: 'Legal & Policies | Serenest',
    description:
      "All of Serenest's legal documents, policies, and guidelines — terms, privacy, refunds, consent, and more — in one place.",
    ogTitle: 'Legal & Policies | Serenest',
    ogDescription: "Serenest's terms, policies, and guidelines for patients, professionals, and visitors.",
  },
  '/terms': {
    title: 'Terms & Conditions | Serenest',
    description:
      'The general terms governing your use of the Serenest platform, including account rules, service scope, and liability.',
    ogTitle: 'Terms & Conditions | Serenest',
    ogDescription: 'Terms governing use of the Serenest mental health platform.',
  },
  '/patient/terms': {
    title: 'Patient Terms of Use | Serenest',
    description:
      "Your rights and responsibilities as a patient on Serenest, including booking, cancellation, and consultation conduct.",
    ogTitle: 'Patient Terms of Use | Serenest',
    ogDescription: 'Terms of use for patients booking consultations on Serenest.',
  },
  '/consent': {
    title: 'Teleconsultation Consent | Serenest',
    description:
      'What you consent to when you attend an online consultation on Serenest, under the MCI Telemedicine Practice Guidelines 2020.',
    ogTitle: 'Teleconsultation Consent | Serenest',
    ogDescription: 'Informed consent for online psychiatry and counselling consultations in India.',
  },
  '/refund-policy': {
    title: 'Refund & Cancellation Policy | Serenest',
    description:
      'When and how refunds are issued for cancelled, rescheduled, or disrupted sessions on Serenest.',
    ogTitle: 'Refund & Cancellation Policy | Serenest',
    ogDescription: 'How Serenest handles refunds and cancellations for online consultations.',
  },
  '/emergency-disclaimer': {
    title: 'Emergency Disclaimer | Serenest',
    description:
      'Serenest is not an emergency service. Read our emergency disclaimer and find crisis helplines available across India.',
    ogTitle: 'Emergency Disclaimer | Serenest',
    ogDescription: 'Serenest is not an emergency or crisis service. Crisis helpline numbers for India.',
  },
  '/cookie-policy': {
    title: 'Cookie Policy | Serenest',
    description: 'What cookies Serenest uses, why we use them, and how you can control them.',
    ogTitle: 'Cookie Policy | Serenest',
    ogDescription: 'How Serenest uses cookies and how to manage your preferences.',
  },
  '/grievance-policy': {
    title: 'Grievance Policy | Serenest',
    description:
      'How to raise a complaint with Serenest and our process for acknowledging and resolving grievances.',
    ogTitle: 'Grievance Policy | Serenest',
    ogDescription: 'How to file and track a grievance with Serenest.',
  },
  '/payment-policy': {
    title: 'Payment & Billing Policy | Serenest',
    description:
      'Accepted payment methods, session fees, GST, professional payouts, and how billing disputes are handled on Serenest.',
    ogTitle: 'Payment & Billing Policy | Serenest',
    ogDescription: 'Payments, billing, and payout policy for the Serenest platform.',
  },
  '/data-retention': {
    title: 'Data Retention Policy | Serenest',
    description:
      'How long Serenest retains account, session, and payment data, and how to request deletion under the DPDP Act 2023.',
    ogTitle: 'Data Retention Policy | Serenest',
    ogDescription: "Serenest's data retention schedule and deletion rights under India's DPDP Act.",
  },
  '/intellectual-property': {
    title: 'Copyright & Intellectual Property Policy | Serenest',
    description:
      "Ownership of Serenest's platform content, permitted use, and how to report a copyright or trademark infringement.",
    ogTitle: 'Copyright & IP Policy | Serenest',
    ogDescription: "Serenest's copyright, trademark, and IP infringement reporting policy.",
  },
  '/community-guidelines': {
    title: 'Community Guidelines | Serenest',
    description:
      'Conduct standards for everyone on Serenest — patients, professionals, and visitors — including safe messaging guidance.',
    ogTitle: 'Community Guidelines | Serenest',
    ogDescription: 'Conduct and safety standards for the Serenest community.',
  },
  '/professionals/terms': {
    title: 'Professional Terms & Conditions | Serenest',
    description:
      'Terms for independent psychiatrists, psychologists, and other professionals listing services on Serenest.',
    ogTitle: 'Professional Terms & Conditions | Serenest',
    ogDescription: 'Terms for professionals offering consultations through Serenest.',
  },
  '/professionals/code-of-conduct': {
    title: 'Professional Code of Conduct | Serenest',
    description:
      'Clinical ethics, patient safety, and conduct standards required of every professional on Serenest.',
    ogTitle: 'Professional Code of Conduct | Serenest',
    ogDescription: 'Ethics and conduct standards for clinicians on the Serenest platform.',
  },
};

// Interactive self-screening tool pages (/screening/tool/<slug>) — each
// validated instrument that carries seoTitle/seoDescription gets its own
// indexable entry. PHQ-9 / GAD-7 tool pages stay unlisted here: their
// dedicated landing pages (/phq-9-depression-screening etc.) own that intent.
for (const t of SCREENING_TOOLS) {
  if (!t.seoTitle) continue;
  if (t.status === 'paused') continue; // paused instruments are withdrawn from public navigation
  ROUTE_SEO[`/screening/tool/${t.slug}`] = {
    title: t.seoTitle,
    description: t.seoDescription,
    ogTitle: t.seoTitle,
    ogDescription: t.seoDescription,
  };
}

// Routes that redirect (301) to a canonical route. Used by server.js.
// Useful for keyword variants of the same landing page so internal links and
// inbound links consolidate onto one URL.
export const ROUTE_ALIASES = {
  '/online-psychiatry-consultation-india': '/services',
  '/psychiatry-online-consultation': '/services',
  '/online-mental-health-consultation': '/services',
  '/consult-psychiatrist-online-india': '/services',
  '/online-psychiatry-india': '/services',
  '/online-psychiatrist-consultation-india': '/services',

  // Depression keyword variants → canonical depression landing
  '/depression-treatment-online-india': '/online-psychiatrist-for-depression-india',
  '/online-depression-counselling-india': '/online-psychiatrist-for-depression-india',
  '/depression-counselling-online-india': '/online-psychiatrist-for-depression-india',
  '/online-psychiatrist-depression-india': '/online-psychiatrist-for-depression-india',

  // Anxiety keyword variants → canonical anxiety landing
  '/online-psychiatrist-for-anxiety-india': '/anxiety-counselling-online-india',
  '/anxiety-treatment-online-india': '/anxiety-counselling-online-india',
  '/online-anxiety-counselling-india': '/anxiety-counselling-online-india',

  // ADHD keyword variants → canonical ADHD landing
  '/online-adhd-consultation-india': '/adhd-assessment-online-india',
  '/adult-adhd-psychiatrist-online-india': '/adhd-assessment-online-india',
  '/adhd-psychiatrist-online-india': '/adhd-assessment-online-india',

  // OCD keyword variants → canonical OCD landing
  '/online-ocd-treatment-india': '/ocd-treatment-online-india',
  '/ocd-counselling-online-india': '/ocd-treatment-online-india',
  '/obsessive-compulsive-disorder-online-india': '/ocd-treatment-online-india',
  '/online-psychiatrist-for-ocd-india': '/ocd-treatment-online-india',

  // Gujarat keyword variants → pan-India landing
  '/online-psychiatrist-gujarat': '/services',
  '/psychiatrist-online-gujarat': '/services',
  '/online-psychiatrist-ahmedabad': '/services',
  '/gujarati-speaking-psychiatrist-online': '/services',

  // PHQ-9 keyword variants
  '/phq-9-test-online-india': '/phq-9-depression-screening',
  '/phq9-screening': '/phq-9-depression-screening',

  // GAD-7 keyword variants
  '/gad-7-test-online-india': '/gad-7-anxiety-screening',
  '/gad7-screening': '/gad-7-anxiety-screening',

  // Prescription keyword variants
  '/online-psychiatry-prescription-india': '/online-psychiatrist-prescription-india',
  '/is-online-psychiatric-prescription-valid-in-india': '/online-psychiatrist-prescription-india',
  '/online-psychiatric-prescription-india': '/online-psychiatrist-prescription-india',
};

// Routes that the SPA renders but should NOT be indexed (utility/internal pages).
export const NOINDEX_ROUTES = new Set([
  '/admin',
  '/professionals/apply',
  '/patient/find-professional',
  '/patient/login',
  '/patient/dashboard',
  '/professionals/login',
  '/professionals/portal',
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


// ── Topic page JSON-LD builders ─────────────────────────────────────────────
//
// All clinical topic pages share a consistent shape: MedicalWebPage + FAQPage
// + BreadcrumbList + the Organization/WebSite/MedicalBusiness graph. Building
// them through helpers keeps copy auditable and avoids subtle drift between
// pages.

function breadcrumbs(path, name, intermediate = []) {
  const items = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` },
  ];
  let i = 2;
  for (const { name: n, item } of intermediate) {
    items.push({ '@type': 'ListItem', position: i++, name: n, item });
  }
  items.push({ '@type': 'ListItem', position: i, name, item: `${SITE_ORIGIN}${path}` });
  return {
    '@type': 'BreadcrumbList',
    '@id': `${SITE_ORIGIN}${path}#breadcrumbs`,
    itemListElement: items,
  };
}

function faqGraph(path, qa) {
  return {
    '@type': 'FAQPage',
    '@id': `${SITE_ORIGIN}${path}#faq`,
    url: `${SITE_ORIGIN}${path}`,
    mainEntity: qa.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

function medicalWebPage(path, { name, description, about = [], lastReviewed = '2026-05-24' }) {
  return {
    '@type': 'MedicalWebPage',
    '@id': `${SITE_ORIGIN}${path}#webpage`,
    url: `${SITE_ORIGIN}${path}`,
    name,
    description,
    inLanguage: 'en-IN',
    isAccessibleForFree: true,
    audience: { '@type': 'PeopleAudience', geographicArea: { '@type': 'Country', name: 'India' } },
    about: about.map((c) => (typeof c === 'string' ? { '@type': 'MedicalCondition', name: c } : c)),
    medicalAudience: 'Patient',
    lastReviewed,
    publisher: { '@id': `${SITE_ORIGIN}/#organization` },
  };
}

// ── Topic-specific FAQ entries (used both for page rendering and JSON-LD) ─

export const DEPRESSION_FAQS = [
  {
    q: 'Can I see an online psychiatrist for depression in India?',
    a: 'Yes. Verified Indian psychiatrists can assess depression via secure online consultation, including detailed history, mental status review, and PHQ-9 self-screening. Whether a diagnosis is made, and whether therapy, medication, or both are recommended, is a clinical decision by the treating psychiatrist.',
  },
  {
    q: 'How is depression diagnosed online?',
    a: 'A psychiatrist takes a structured history, reviews symptoms over time, and uses validated tools such as PHQ-9 to gauge severity. A diagnosis is not made from a screening score alone — it requires clinical evaluation by a qualified clinician.',
  },
  {
    q: 'Is online depression counselling effective?',
    a: 'For mild-to-moderate depression, evidence supports that online counselling and psychotherapy (including CBT-based approaches) can be a useful option, especially when paired with structured assessment and follow-up. For severe or complex presentations your clinician may recommend in-person care.',
  },
  {
    q: 'Will I be prescribed antidepressants in my first online session?',
    a: 'Not automatically. Medication is a clinical decision based on history, severity, prior treatments, and safety considerations. The psychiatrist will discuss options and risks with you and decide what is appropriate under India\'s Telemedicine Practice Guidelines, 2020.',
  },
  {
    q: 'What is the difference between screening, counselling, and psychiatry for depression?',
    a: 'Screening (e.g., PHQ-9) is a self-check that flags possible severity. Counselling and therapy focus on talking-based treatment delivered by a counsellor, psychologist, or psychotherapist. Psychiatry is medical care delivered by a psychiatrist — a medical doctor who can assess, diagnose, and prescribe where appropriate. Many people use a combination.',
  },
  {
    q: 'I am having thoughts of suicide. What should I do?',
    a: 'Please do not use an online booking flow in an emergency. Contact a local emergency number, go to your nearest hospital, or call 112, or call Tele-MANAS at 14416 or 1800-891-4416 for free mental-health support in India. Serenest is not an emergency service.',
  },
  {
    q: 'Do I need a referral to consult a psychiatrist for depression?',
    a: 'No referral is required. You can book directly. Bring any past prescriptions, investigations, or notes — they help the psychiatrist understand your history.',
  },
];

export const ANXIETY_FAQS = [
  {
    q: 'Can I get anxiety counselling online in India?',
    a: 'Yes. Verified Indian psychologists, counsellors, and psychiatrists offer online anxiety counselling. A clinician will review history and severity, often using GAD-7 as a screening tool, and discuss therapy, lifestyle support, or medication review where clinically appropriate.',
  },
  {
    q: 'What is the GAD-7 and how is it used?',
    a: 'GAD-7 is a 7-item self-report scale widely used to screen for generalized anxiety. It is a screening tool, not a diagnosis. Your clinician uses it together with history and clinical assessment.',
  },
  {
    q: 'When should I see a psychiatrist instead of only a counsellor for anxiety?',
    a: 'If anxiety significantly affects daily life, sleep, or function; if there are co-existing conditions (depression, OCD, panic disorder); if you have been on psychiatric medication; or if a clinician advises medical review — a psychiatrist evaluation is appropriate. Otherwise, counselling/therapy with a psychologist may be a reasonable starting point.',
  },
  {
    q: 'Will an online psychiatrist prescribe anxiety medication?',
    a: 'Some anxiety medications can be considered, depending on severity, history, and safety. Benzodiazepines and other controlled substances have specific limits under India\'s Telemedicine Practice Guidelines, 2020 — and certain categories cannot be prescribed online. The clinician will tell you what is appropriate.',
  },
  {
    q: 'How effective is online therapy for anxiety?',
    a: 'For many people with anxiety, evidence supports therapy approaches such as CBT delivered online as a useful option, particularly when paired with structured assessment and follow-up. Severe presentations may need in-person care.',
  },
  {
    q: 'What if I have panic attacks during a session?',
    a: 'Sessions can be paused. Your clinician is trained to help you ground and stabilize. If you experience severe distress, end the session and call 112, or call Tele-MANAS at 14416 or 1800-891-4416. Serenest is not an emergency service.',
  },
];

export const ADHD_FAQS = [
  {
    q: 'Can adult ADHD be assessed online in India?',
    a: 'Yes. A structured adult ADHD assessment involves a detailed developmental and current-symptom history, validated rating scales (such as ASRS), screening for common comorbidities (anxiety, depression, sleep, substance use), and clinical interview. Assessment can take multiple sessions.',
  },
  {
    q: 'Will I get an ADHD prescription in my first online consultation?',
    a: 'No. Same-day ADHD stimulant prescriptions are not promised. ADHD prescribing — particularly of controlled medications — requires a careful structured assessment and may require additional in-person evaluation. The psychiatrist will explain the appropriate pathway for your case.',
  },
  {
    q: 'How long does an ADHD assessment take?',
    a: 'Adult ADHD assessment typically spans one to two longer sessions, plus structured questionnaires you complete between appointments. The clinician reviews schooling, work, relationships, sleep, and any co-existing concerns.',
  },
  {
    q: 'Are ADHD stimulants like methylphenidate or amphetamines available online in India?',
    a: 'Certain ADHD medications are tightly regulated in India and have specific limits under the Telemedicine Practice Guidelines, 2020 and applicable narcotic/controlled-substance rules. Many situations require in-person evaluation or specific safeguards. The clinician decides what is appropriate.',
  },
  {
    q: 'I think I have ADHD — what is the first step?',
    a: 'Take a short self-screening, then book an adult ADHD assessment. Bring school or work history, prior reports, and a list of current concerns. Be prepared to schedule more than one session.',
  },
  {
    q: 'Can children be assessed for ADHD via Serenest?',
    a: 'Serenest currently focuses on adult care. For paediatric ADHD assessment, the family clinician will be able to refer to an appropriate child and adolescent psychiatrist or paediatric specialist.',
  },
];

export const OCD_FAQS = [
  {
    q: 'Can OCD be treated online in India?',
    a: 'Yes. Verified Indian psychiatrists and psychologists can assess and treat OCD online through secure video, audio, or chat. Structured assessment, exposure and response prevention (ERP), and medication review where clinically appropriate are all possible in a telemedicine setting when the presentation is suitable.',
  },
  {
    q: 'What is ERP and is it available online?',
    a: 'Exposure and response prevention (ERP) is a specialised form of cognitive behavioural therapy and a first-line treatment for OCD. It involves gradually facing feared situations while resisting compulsions, with therapist guidance. ERP can be delivered effectively online when sessions are regular and homework is practised between appointments.',
  },
  {
    q: 'Will an online psychiatrist prescribe medication for OCD?',
    a: 'SSRIs are commonly used for OCD and may be considered after assessment, depending on severity, history, and safety. Prescribing follows India\'s Telemedicine Practice Guidelines, 2020 and the psychiatrist\'s clinical judgment. Serenest does not guarantee medication on request.',
  },
  {
    q: 'How is OCD diagnosed online?',
    a: 'Diagnosis requires a detailed clinical interview — symptom history, time course, impact on daily life, and differentiation from other conditions (generalised anxiety, depression, tic disorders, personality patterns). Clinicians may use validated scales such as Y-BOCS. PHQ-9 and GAD-7 on Serenest screen for co-existing depression and anxiety, not OCD itself.',
  },
  {
    q: 'I have harm-related intrusive thoughts — is that OCD?',
    a: 'Unwanted harm-related obsessions are a common OCD presentation and are usually ego-dystonic (deeply distressing and inconsistent with the person\'s values). A clinician assesses whether this is OCD, another anxiety disorder, or a situation requiring urgent in-person evaluation. If you feel unable to stay safe, contact emergency services immediately.',
  },
  {
    q: 'How long does OCD treatment take?',
    a: 'Timelines vary. Some people notice improvement within several weeks of consistent ERP; others need longer courses of therapy, medication, or both. OCD often benefits from follow-up rather than a single session. Your clinician will discuss a realistic plan for your situation.',
  },
];

export const GUJARAT_FAQS = [
  {
    q: 'Can I consult an online psychiatrist in Gujarat?',
    a: 'Yes. Patients across Gujarat — Ahmedabad, Surat, Vadodara, Rajkot, Gandhinagar, Bhavnagar, Jamnagar, Junagadh, Anand, Bharuch, Mehsana, Patan, Palanpur, and surrounding districts — can consult verified psychiatrists online over secure video, audio, or chat.',
  },
  {
    q: 'Is a Gujarati-speaking psychiatrist available online?',
    a: 'Where the treating clinician supports the language, sessions are available in Gujarati alongside English and Hindi. Language preference can be indicated during booking; the platform will route you to a clinician who can support it where available.',
  },
  {
    q: 'I live in a smaller town in North Gujarat — is online psychiatry an option?',
    a: 'Yes. Online psychiatry is particularly useful for patients in towns and districts where local psychiatric services are limited. All you need is a stable internet connection and a private space.',
  },
  {
    q: 'Are prescriptions from an online psychiatrist accepted at Gujarat pharmacies?',
    a: 'A digital prescription issued under India\'s Telemedicine Practice Guidelines, 2020 carries the prescribing clinician\'s registration details and is designed to be verifiable. Acceptance at any individual pharmacy is the pharmacy\'s decision; certain categories of medication have additional restrictions.',
  },
  {
    q: 'How private is an online psychiatry session in Gujarat?',
    a: 'Sessions are conducted on encrypted infrastructure. Serenest follows privacy-first workflows with least-access principles. Find a private, quiet space at home so that the session is comfortable and confidential.',
  },
];

export const PHQ9_FAQS = [
  {
    q: 'What is the PHQ-9?',
    a: 'The PHQ-9 (Patient Health Questionnaire-9) is a 9-item self-report tool widely used in clinical practice and research to screen for depression and to track severity over time. It was developed by Drs. Spitzer, Williams, and Kroenke and is in the public domain.',
  },
  {
    q: 'Is the PHQ-9 a diagnosis of depression?',
    a: 'No. The PHQ-9 is a screening and severity-monitoring tool. It is not a diagnostic test. A diagnosis of depression requires a clinical assessment by a qualified clinician who considers history, context, duration, and other conditions.',
  },
  {
    q: 'What do PHQ-9 scores mean?',
    a: 'Higher scores indicate more depressive symptoms. Commonly used bands are 0–4 minimal, 5–9 mild, 10–14 moderate, 15–19 moderately severe, and 20–27 severe. Even a high score on its own is not a diagnosis — a clinician must evaluate.',
  },
  {
    q: 'Is the PHQ-9 free to take online?',
    a: 'Yes. Serenest provides a confidential PHQ-9 self-screening online at no cost. Your responses are private and not a substitute for clinical advice.',
  },
  {
    q: 'I scored high on the PHQ-9 — what should I do next?',
    a: 'A higher score suggests it may be useful to speak with a clinician. You can book an online psychiatry consultation or counselling session. If the PHQ-9 item on self-harm thoughts is positive — and especially in an emergency — call 112 or go to the nearest emergency department, or call Tele-MANAS at 14416 or 1800-891-4416.',
  },
  {
    q: 'How often should I retake the PHQ-9?',
    a: 'Clinicians often re-administer PHQ-9 every 2–4 weeks to track change. Self-monitoring is fine, but interpretation should be done with your clinician.',
  },
];

export const GAD7_FAQS = [
  {
    q: 'What is the GAD-7?',
    a: 'The GAD-7 (Generalized Anxiety Disorder-7) is a 7-item self-report scale developed by Spitzer and colleagues to screen for generalized anxiety and to monitor severity. It is widely used in primary care and mental health settings.',
  },
  {
    q: 'Does a GAD-7 score diagnose an anxiety disorder?',
    a: 'No. GAD-7 is a screening tool, not a diagnostic test. Diagnosis of a specific anxiety disorder requires evaluation by a qualified clinician who considers duration, impairment, and other possibilities.',
  },
  {
    q: 'What do GAD-7 scores mean?',
    a: 'Higher scores indicate more severe anxiety symptoms. Common bands are 0–4 minimal, 5–9 mild, 10–14 moderate, and 15–21 severe. Scores guide conversation but do not stand in for clinical assessment.',
  },
  {
    q: 'Is the GAD-7 free to take online from India?',
    a: 'Yes. Serenest provides a confidential GAD-7 self-screening at no cost. Results are private and not a substitute for clinical advice.',
  },
  {
    q: 'I scored high on the GAD-7 — what next?',
    a: 'A higher score suggests it may be helpful to talk with a clinician — a psychologist, counsellor, or psychiatrist. Book a consultation when you are ready. In an emergency, call 112, or call Tele-MANAS at 14416 or 1800-891-4416.',
  },
];

export const PRESCRIPTION_FAQS = [
  {
    q: 'Is an online psychiatric prescription valid in India?',
    a: 'Yes. Registered medical practitioners can issue digital prescriptions during telemedicine consultations under India\'s Telemedicine Practice Guidelines, 2020 (issued under the Indian Medical Council Act and adopted by the National Medical Commission). The prescription carries the doctor\'s registration details and clinical documentation.',
  },
  {
    q: 'Which medicines can a psychiatrist prescribe online in India?',
    a: 'The Telemedicine Practice Guidelines define categories of medicines that may be prescribed during a telemedicine consultation. In general, common over-the-counter and many prescription (Schedule H/H1) medicines can be considered, while a separate category — narcotic and psychotropic substances listed under Schedule X / the NDPS Act — has strict limits and typically cannot be prescribed in a first online consultation. The treating clinician applies these rules to your case.',
  },
  {
    q: 'Can I be prescribed benzodiazepines or ADHD stimulants online?',
    a: 'Certain anxiety and ADHD medications are controlled substances and have additional regulatory limits. The Telemedicine Practice Guidelines restrict some categories of medicines in a telemedicine setting. Your clinician will explain what can be considered, what may require in-person evaluation, and what is not appropriate online.',
  },
  {
    q: 'Will pharmacies accept an online psychiatry prescription?',
    a: 'A valid prescription issued under the Telemedicine Practice Guidelines carries the clinician\'s registration details and clinical documentation. Acceptance is ultimately the pharmacy\'s decision; controlled substances may have additional verification requirements. We recommend retaining a digital and printed copy.',
  },
  {
    q: 'Do I need a video consultation or is audio/chat enough for a prescription?',
    a: 'The mode (video, audio, or chat) and what may be prescribed in that mode are governed by the Telemedicine Practice Guidelines and clinical judgment. For many psychiatric assessments, video is preferred. The clinician decides whether they have enough information to prescribe safely.',
  },
  {
    q: 'Can a psychiatrist refuse to prescribe in a teleconsultation?',
    a: 'Yes. A clinician can decline to prescribe if they assess that telemedicine is not appropriate for your situation — for example, if in-person evaluation is required, if more information is needed, or if a particular medicine is restricted. This is consistent with the Telemedicine Practice Guidelines and good clinical practice.',
  },
  {
    q: 'How long is an online prescription valid?',
    a: 'Validity depends on the medicine, the clinician\'s instructions, and the pharmacy\'s policies. Follow the duration and refill instructions on your prescription, and book a follow-up before it expires.',
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
  '/academy': {
    '@context': 'https://schema.org',
    '@graph': [
      ORG_SCHEMA,
      WEBSITE_SCHEMA,
      {
        '@type': 'EducationalOrganization',
        '@id': `${SITE_ORIGIN}/academy#educationalorg`,
        name: 'Serenest Academy',
        url: `${SITE_ORIGIN}/academy`,
        description:
          'Serenest Academy provides clinician-led mental health education programs in India, including certificate programs, fellowships, CPD, and mentorship.',
        parentOrganization: { '@id': `${SITE_ORIGIN}/#organization` },
        areaServed: { '@type': 'Country', name: 'India' },
        knowsAbout: ['Psychiatry', 'Clinical Psychology', 'Counselling', 'Mental Health Education'],
      },
      {
        '@type': 'WebPage',
        '@id': `${SITE_ORIGIN}/academy#webpage`,
        url: `${SITE_ORIGIN}/academy`,
        name: 'Serenest Academy | Mental Health Education India',
        description:
          'Clinician-led mental health education: certificate programs, fellowships, CPD, and mentorship for India\'s mental health workforce.',
        inLanguage: 'en-IN',
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        about: ['Mental health literacy', 'Health education', 'Psychiatry education'],
      },
      breadcrumbs('/academy', 'Serenest Academy'),
    ],
  },
  '/professionals': {
    '@context': 'https://schema.org',
    '@graph': [
      ORG_SCHEMA,
      WEBSITE_SCHEMA,
      {
        '@type': 'WebPage',
        '@id': `${SITE_ORIGIN}/professionals#webpage`,
        url: `${SITE_ORIGIN}/professionals`,
        name: 'For Mental Health Professionals | Serenest',
        description:
          'How verified psychiatrists, psychologists, and counsellors work with Serenest — join the clinical team, access CPD, and grow your practice.',
        inLanguage: 'en-IN',
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
      },
      breadcrumbs('/professionals', 'For Professionals'),
    ],
  },
  '/blog': {
    '@context': 'https://schema.org',
    '@graph': [
      ORG_SCHEMA,
      WEBSITE_SCHEMA,
      {
        '@type': 'Blog',
        '@id': `${SITE_ORIGIN}/blog#blog`,
        url: `${SITE_ORIGIN}/blog`,
        name: 'Serenest Blog',
        description:
          'Clinical insights, patient guides, and mental health updates from the Serenest team.',
        inLanguage: 'en-IN',
        publisher: { '@id': `${SITE_ORIGIN}/#organization` },
      },
      breadcrumbs('/blog', 'Blog'),
    ],
  },

  // ── Topic cluster: Depression ─────────────────────────────────────────────
  '/online-psychiatrist-for-depression-india': {
    '@context': 'https://schema.org',
    '@graph': [
      ORG_SCHEMA,
      WEBSITE_SCHEMA,
      medicalWebPage('/online-psychiatrist-for-depression-india', {
        name: 'Online Psychiatrist for Depression in India',
        description:
          'Consult an online psychiatrist for depression in India. PHQ-9 screening, structured clinical assessment, therapy or medication review by a verified psychiatrist. Screening is not a diagnosis; not an emergency service.',
        about: ['Depression', 'Major Depressive Disorder', 'Persistent Depressive Disorder'],
      }),
      faqGraph('/online-psychiatrist-for-depression-india', DEPRESSION_FAQS),
      breadcrumbs(
        '/online-psychiatrist-for-depression-india',
        'Online Psychiatrist for Depression in India',
        [{ name: 'Services', item: `${SITE_ORIGIN}/services` }],
      ),
    ],
  },

  // ── Topic cluster: Anxiety ────────────────────────────────────────────────
  '/anxiety-counselling-online-india': {
    '@context': 'https://schema.org',
    '@graph': [
      ORG_SCHEMA,
      WEBSITE_SCHEMA,
      medicalWebPage('/anxiety-counselling-online-india', {
        name: 'Anxiety Counselling Online in India',
        description:
          'Online anxiety counselling and psychiatrist support in India. GAD-7 screening, structured assessment, and stepped care. Screening is not a diagnosis; not an emergency service.',
        about: ['Generalized Anxiety Disorder', 'Panic Disorder', 'Social Anxiety Disorder', 'Anxiety Disorders'],
      }),
      faqGraph('/anxiety-counselling-online-india', ANXIETY_FAQS),
      breadcrumbs(
        '/anxiety-counselling-online-india',
        'Anxiety Counselling Online in India',
        [{ name: 'Services', item: `${SITE_ORIGIN}/services` }],
      ),
    ],
  },

  // ── Topic cluster: ADHD ───────────────────────────────────────────────────
  '/adhd-assessment-online-india': {
    '@context': 'https://schema.org',
    '@graph': [
      ORG_SCHEMA,
      WEBSITE_SCHEMA,
      medicalWebPage('/adhd-assessment-online-india', {
        name: 'ADHD Assessment Online in India',
        description:
          'Structured adult ADHD assessment online in India with verified psychiatrists. Detailed history, validated rating scales, and clinically led prescribing decisions. Not a same-day prescription service.',
        about: ['Attention Deficit Hyperactivity Disorder', 'Adult ADHD'],
      }),
      faqGraph('/adhd-assessment-online-india', ADHD_FAQS),
      breadcrumbs(
        '/adhd-assessment-online-india',
        'ADHD Assessment Online in India',
        [{ name: 'Services', item: `${SITE_ORIGIN}/services` }],
      ),
    ],
  },

  // ── Topic cluster: OCD ──────────────────────────────────────────────────────
  '/ocd-treatment-online-india': {
    '@context': 'https://schema.org',
    '@graph': [
      ORG_SCHEMA,
      WEBSITE_SCHEMA,
      medicalWebPage('/ocd-treatment-online-india', {
        name: 'OCD Treatment Online in India',
        description:
          'OCD treatment online in India with verified psychiatrists and psychologists. Structured assessment, exposure and response prevention (ERP), and medication review where clinically appropriate.',
        about: ['Obsessive-Compulsive Disorder', 'OCD'],
      }),
      faqGraph('/ocd-treatment-online-india', OCD_FAQS),
      breadcrumbs(
        '/ocd-treatment-online-india',
        'OCD Treatment Online in India',
        [{ name: 'Services', item: `${SITE_ORIGIN}/services` }],
      ),
    ],
  },

  // ── Geo cluster: Gujarat ──────────────────────────────────────────────────
  '/online-psychiatrist-gujarat': {
    '@context': 'https://schema.org',
    '@graph': [
      ORG_SCHEMA,
      WEBSITE_SCHEMA,
      {
        ...MEDICAL_BUSINESS_SCHEMA,
        '@id': `${SITE_ORIGIN}/online-psychiatrist-gujarat#medicalbusiness`,
        url: `${SITE_ORIGIN}/online-psychiatrist-gujarat`,
        areaServed: [
          { '@type': 'AdministrativeArea', name: 'Gujarat', address: { '@type': 'PostalAddress', addressRegion: 'Gujarat', addressCountry: 'IN' } },
          { '@type': 'Country', name: 'India' },
        ],
      },
      medicalWebPage('/online-psychiatrist-gujarat', {
        name: 'Online Psychiatrist in Gujarat',
        description:
          'Online psychiatrist consultation for Gujarat — Ahmedabad, Surat, Vadodara, Rajkot, North Gujarat and beyond. Sessions in Gujarati, Hindi, and English where the clinician supports them.',
        about: ['Depression', 'Anxiety Disorders', 'Sleep Disorders', 'Adult ADHD'],
      }),
      faqGraph('/online-psychiatrist-gujarat', GUJARAT_FAQS),
      breadcrumbs(
        '/online-psychiatrist-gujarat',
        'Online Psychiatrist in Gujarat',
        [{ name: 'Services', item: `${SITE_ORIGIN}/services` }],
      ),
    ],
  },

  // ── Screening tool: PHQ-9 ────────────────────────────────────────────────
  '/phq-9-depression-screening': {
    '@context': 'https://schema.org',
    '@graph': [
      ORG_SCHEMA,
      WEBSITE_SCHEMA,
      medicalWebPage('/phq-9-depression-screening', {
        name: 'PHQ-9 Depression Screening Online (India)',
        description:
          'Take a free PHQ-9 depression self-screening online from India. PHQ-9 is a validated screening tool, not a diagnosis — only a clinician can diagnose depression.',
        about: ['Depression', 'PHQ-9', 'Mental Health Screening'],
      }),
      faqGraph('/phq-9-depression-screening', PHQ9_FAQS),
      breadcrumbs(
        '/phq-9-depression-screening',
        'PHQ-9 Depression Screening',
        [{ name: 'Screening', item: `${SITE_ORIGIN}/screening` }],
      ),
    ],
  },

  // ── Screening tool: GAD-7 ────────────────────────────────────────────────
  '/gad-7-anxiety-screening': {
    '@context': 'https://schema.org',
    '@graph': [
      ORG_SCHEMA,
      WEBSITE_SCHEMA,
      medicalWebPage('/gad-7-anxiety-screening', {
        name: 'GAD-7 Anxiety Screening Online (India)',
        description:
          'Take a free GAD-7 anxiety self-screening online from India. GAD-7 is a validated screening tool, not a diagnosis — only a clinician can diagnose an anxiety disorder.',
        about: ['Generalized Anxiety Disorder', 'GAD-7', 'Mental Health Screening'],
      }),
      faqGraph('/gad-7-anxiety-screening', GAD7_FAQS),
      breadcrumbs(
        '/gad-7-anxiety-screening',
        'GAD-7 Anxiety Screening',
        [{ name: 'Screening', item: `${SITE_ORIGIN}/screening` }],
      ),
    ],
  },

  // ── Regulatory explainer: Online prescriptions ───────────────────────────
  '/online-psychiatrist-prescription-india': {
    '@context': 'https://schema.org',
    '@graph': [
      ORG_SCHEMA,
      WEBSITE_SCHEMA,
      {
        '@type': 'Article',
        '@id': `${SITE_ORIGIN}/online-psychiatrist-prescription-india#article`,
        url: `${SITE_ORIGIN}/online-psychiatrist-prescription-india`,
        headline: 'Online psychiatrist prescription in India — validity under Telemedicine Practice Guidelines',
        description:
          'A clear, India-specific explainer on online psychiatric prescriptions: validity under the Telemedicine Practice Guidelines, 2020, categories of medicines, Schedule X limits, and clinician judgment.',
        inLanguage: 'en-IN',
        publisher: { '@id': `${SITE_ORIGIN}/#organization` },
        mainEntityOfPage: `${SITE_ORIGIN}/online-psychiatrist-prescription-india`,
        about: ['Telemedicine Practice Guidelines, 2020', 'Online prescription', 'Psychiatry'],
        datePublished: '2026-05-24',
        dateModified: '2026-05-24',
      },
      faqGraph('/online-psychiatrist-prescription-india', PRESCRIPTION_FAQS),
      breadcrumbs(
        '/online-psychiatrist-prescription-india',
        'Online Psychiatrist Prescription in India',
        [{ name: 'FAQ', item: `${SITE_ORIGIN}/faq` }],
      ),
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
