/**
 * Serenest Academy programs. Each renders a dedicated page at
 * /academy/program/:slug via AcademyProgramPage, and a rich card on the
 * Academy landing page.
 */

export const ACADEMY_PROGRAMS = [
  {
    slug: 'clinical-excellence',
    category: 'Clinical Practice',
    iconName: 'award', accent: 'teal', popular: true, featured: true,
    title: 'Clinical Excellence',
    subtitle: 'Flagship Course for Practicing Mental Health Professionals',
    tagline: 'The definitive course for psychiatrists, psychologists, therapists & counsellors.',
    body: 'Assessment, evidence-based care, telepsychiatry, documentation, and measurement-based practice — built for real Indian clinical work.',
    overview:
      'Our flagship program for practicing mental health professionals. Build clinical excellence across assessment, formulation, evidence-based interventions, telepsychiatry, documentation, ethics, and measurement-based care — designed for real Indian practice, free for approved Serenest professionals.',
    metrics: [
      { top: '12', sub: 'Weeks' },
      { top: '8', sub: 'Modules' },
      { top: 'Live', sub: 'Case rounds' },
      { top: 'Cert', sub: 'Included' },
    ],
    highlights: [
      'Built for practicing clinicians',
      'Case-based + live supervision',
      'Free for Serenest professionals',
      'Certificate of completion',
    ],
    ctaLabel: 'Explore Clinical Excellence',
    learn: [
      'Structured psychiatric & psychological assessment for common presentations',
      'Case formulation and treatment planning you can use the same week',
      'Evidence-based approaches for depression, anxiety, ADHD, OCD, and sleep',
      'Measurement-based care with PHQ-9, GAD-7, and outcome tracking',
      'Telepsychiatry excellence: consent, rapport, safety, and continuity online',
      'SOAP notes, clinical documentation, and prescription-ready workflows',
      'Risk assessment, escalation, and crisis boundaries in remote care',
      'Ethics, confidentiality, DPDP-aware practice, and professional conduct',
      'Peer case discussions and optional 1:1 clinical supervision',
    ],
    modules: [
      {
        week: '01–02',
        title: 'Assessment & Formulation',
        outcomes: [
          'Structured history and mental status examination',
          'Differential thinking without over-pathologising',
          'Case formulation you can act on the same week',
        ],
      },
      {
        week: '03–04',
        title: 'Evidence-Based Care',
        outcomes: [
          'Depression, anxiety, ADHD, OCD, and sleep pathways',
          'Stepped care and when to escalate',
          'Integrating therapy and medication conversations',
        ],
      },
      {
        week: '05–06',
        title: 'Measurement-Based Practice',
        outcomes: [
          'PHQ-9, GAD-7, and outcome tracking in routine care',
          'Using scores to guide (not replace) clinical judgment',
          'Review cadence and shared decision-making',
        ],
      },
      {
        week: '07–08',
        title: 'Telepsychiatry Done Right',
        outcomes: [
          'Consent, identity, privacy, and setting',
          'Rapport and safety over video',
          'Continuity between visits',
        ],
      },
      {
        week: '09–10',
        title: 'Documentation & Workflows',
        outcomes: [
          'SOAP notes and prescription-ready records',
          'Clear plans patients can follow',
          'Handoffs and multidisciplinary notes',
        ],
      },
      {
        week: '11–12',
        title: 'Risk, Ethics & Indian Context',
        outcomes: [
          'Risk assessment and crisis boundaries',
          'Confidentiality and DPDP-aware practice',
          'Telemedicine norms for India',
        ],
      },
    ],
    forWho: [
      'Psychiatrists and psychiatry residents',
      'Clinical psychologists and psychotherapists',
      'Counsellors and therapists in active practice',
      'Approved Serenest professionals (included free)',
    ],
    format: 'Online · 12 weeks · Self-paced modules + live case rounds · Certificate on completion',
  },
  {
    slug: 'student-training',
    category: 'Career Entry',
    iconName: 'cap', accent: 'green',
    title: 'Student Training',
    subtitle: 'For Psychology, Psychiatry & Mental Health Students',
    tagline: 'Bridge classroom theory and real clinical work.',
    body: 'Foundational, case-based training for students entering the mental health field.',
    overview:
      'A foundational, case-based program that bridges the gap between classroom theory and real clinical work. Built for students who want to enter practice confident and job-ready.',
    metrics: [
      { top: '50+', sub: 'Hours' },
      { top: 'Case', sub: 'Discussions' },
      { top: 'Cert', sub: 'Included' },
    ],
    highlights: ['Placement-ready skills', 'Validated screening tools', 'Ethics foundations'],
    ctaLabel: 'Explore student track',
    learn: [
      'Core concepts in clinical psychology and assessment',
      'Structured history-taking and case formulation',
      'Using PHQ-9, GAD-7 and other validated tools',
      'Ethics, confidentiality, and professional conduct',
      'Internship and placement readiness',
    ],
    forWho: ['Undergraduate & postgraduate psychology students', 'Fresh graduates entering practice'],
    format: 'Online · Self-paced with live case discussions',
  },
  {
    slug: 'counselling-skills',
    category: 'Career Entry',
    iconName: 'people', accent: 'amber',
    title: 'Counselling Skills',
    subtitle: 'Foundational Counselling & Therapeutic Communication',
    tagline: 'Communication, rapport, and ethical technique.',
    body: 'Practical skill-building in therapeutic communication, ethics, and counsellor competencies.',
    overview:
      'Practical skill-building for effective, ethical counselling — the communication, rapport, and technique foundations every mental health practitioner needs.',
    metrics: [
      { top: '30+', sub: 'Modules' },
      { top: 'Role-play', sub: 'Sessions' },
      { top: 'Tools', sub: 'Practical' },
    ],
    highlights: ['Active listening labs', 'CBT basics', 'Boundary clarity'],
    ctaLabel: 'Open counselling track',
    learn: [
      'Active listening and therapeutic communication',
      'Building rapport and a safe space',
      'Basics of CBT and supportive techniques',
      'Ethical boundaries and referral',
      'Supervision and reflective practice',
    ],
    forWho: ['Aspiring and practicing counsellors', 'Psychology students', 'Allied helpers and educators'],
    format: 'Online · Practical, exercise-led',
  },
  {
    slug: 'certificate-programs',
    category: 'Career Entry',
    iconName: 'certificate', accent: 'green',
    title: 'Certificate Programs',
    subtitle: 'Short-term Professional Certifications',
    tagline: 'Focused credentials you can finish around work.',
    body: 'Structured, clinically reviewed certificate tracks for working professionals and students.',
    overview:
      'Focused, short-term certificate tracks that let working professionals and students build a specific, verifiable skill and earn a certificate of completion.',
    metrics: [
      { top: '4–8', sub: 'Weeks' },
      { top: 'Role', sub: 'Relevant' },
      { top: 'Flex', sub: 'Schedule' },
    ],
    highlights: ['Shareable credential', 'Case-based modules', 'Clear completion criteria'],
    ctaLabel: 'Explore certificates',
    learn: [
      'Targeted, role-relevant clinical skills',
      'Applied, case-based modules',
      'Assessment and completion criteria',
      'A shareable certificate of completion',
    ],
    forWho: ['Working mental health professionals', 'Students adding a credential', 'Career switchers'],
    format: 'Online · Short-term, certificate on completion',
  },
  {
    slug: 'psychiatry-training',
    category: 'Clinical Practice',
    iconName: 'shield', accent: 'blue',
    title: 'Psychiatry Training',
    subtitle: 'Clinical Psychiatry, Prescribing & Telemedicine',
    tagline: 'Prescribing conversations, SOAP/Rx, and telemedicine norms.',
    body: 'For residents and prescribers: telemedicine norms, prescribing conversations, and documentation workflows.',
    overview:
      'For residents and prescribers: a practice-oriented program covering modern telepsychiatry norms, prescribing conversations, documentation, and continuity of care.',
    metrics: [
      { top: '40+', sub: 'Modules' },
      { top: 'Rx', sub: 'Guides' },
      { top: 'Case', sub: 'Based' },
    ],
    highlights: ['Telemedicine consent', 'Safety-first prescribing', 'Continuity of care'],
    ctaLabel: 'Open psychiatry track',
    learn: [
      'Telemedicine practice norms and consent',
      'Prescribing conversations and safety',
      'SOAP notes and Rx documentation workflow',
      'Risk assessment and escalation',
      'Continuity of care between visits',
    ],
    forWho: ['Psychiatry residents', 'Prescribing clinicians', 'MBBS doctors moving into mental health'],
    format: 'Online · Clinician-led, case-based',
  },
  {
    slug: 'digital-mental-health',
    category: 'Clinical Practice',
    iconName: 'monitor', accent: 'teal',
    title: 'Digital Mental Health',
    subtitle: 'Telepsychiatry, Documentation & Remote Care',
    tagline: 'High-quality care over video, audio, and chat.',
    body: 'Platform workflows, secure documentation, and safe remote-care delivery.',
    overview:
      'Learn to deliver high-quality care remotely — platform workflows, secure documentation, and the practicalities of running safe, effective telepsychiatry.',
    metrics: [
      { top: '25+', sub: 'Workflows' },
      { top: 'Docs', sub: 'Templates' },
      { top: 'Tele', sub: 'Guides' },
    ],
    highlights: ['Remote rapport', 'Privacy & consent', 'Follow-up systems'],
    ctaLabel: 'Learn telepsychiatry',
    learn: [
      'Setting up and running a teleconsultation',
      'Secure documentation and records',
      'Building rapport over video and audio',
      'Privacy, consent, and regulation',
      'Continuity and follow-up in remote care',
    ],
    forWho: ['Clinicians moving to online practice', 'Psychiatrists and psychologists', 'Digital health teams'],
    format: 'Online · Practical, tools-led',
  },
  {
    slug: 'research-publications',
    category: 'Clinical Practice',
    iconName: 'microscope', accent: 'coral',
    title: 'Research & Publications',
    subtitle: 'Research Methodology & Publication Support',
    tagline: 'From literature review to submission-ready writing.',
    body: 'Support for case write-ups, literature reviews, and publication-ready clinical writing.',
    overview:
      'Support for clinicians and students who want to publish — from literature reviews and case reports to publication-ready writing, with mentorship along the way.',
    metrics: [
      { top: 'Guided', sub: 'Projects' },
      { top: 'Mentor', sub: 'Support' },
      { top: 'Journal', sub: 'Ready' },
    ],
    highlights: ['Case reports', 'Lit reviews', 'Submission structure'],
    ctaLabel: 'View research track',
    learn: [
      'Research methodology basics',
      'Conducting a focused literature review',
      'Writing case reports and clinical papers',
      'Structuring and submitting for publication',
      'Working with a publication mentor',
    ],
    forWho: ['Postgraduate students', 'Residents and early-career clinicians', 'Researchers in mental health'],
    format: 'Online · Mentor-supported',
  },
  {
    slug: 'cpd-programs',
    category: 'Professional Growth',
    iconName: 'target', accent: 'green',
    title: 'CPD Programs',
    subtitle: 'Continuous Professional Development',
    tagline: 'Stay current without pausing your practice.',
    body: 'Ongoing learning for licensed professionals to stay current and sharpen skills.',
    overview:
      'Ongoing, structured learning that helps licensed professionals stay current with evidence, sharpen skills, and meet continuing professional development expectations.',
    metrics: [
      { top: 'Modular', sub: 'Activities' },
      { top: 'Expert', sub: 'Faculty' },
      { top: 'Flex', sub: 'Pace' },
    ],
    highlights: ['Evidence updates', 'Skill refreshers', 'Reflective practice'],
    ctaLabel: 'Open CPD track',
    learn: [
      'Current, evidence-based updates',
      'Refreshers on assessment and treatment',
      'New modalities and best practice',
      'Reflective practice and self-audit',
    ],
    forWho: ['Licensed psychologists and psychiatrists', 'Practicing counsellors', 'Any clinician maintaining CPD'],
    format: 'Online · Ongoing, flexible',
  },
  {
    slug: 'mentorship',
    category: 'Professional Growth',
    iconName: 'people', accent: 'amber',
    title: 'Mentorship',
    subtitle: '1:1 Supervision & Career Guidance',
    tagline: 'Personalised supervision from experienced clinicians.',
    body: 'One-to-one mentorship and clinical supervision for clarity and confidence.',
    overview:
      'Personalised, one-to-one mentorship and clinical supervision — guidance on cases, skills, and career direction from experienced clinicians.',
    metrics: [
      { top: '1:1', sub: 'Sessions' },
      { top: 'Case', sub: 'Supervision' },
      { top: 'Career', sub: 'Guidance' },
    ],
    highlights: ['Real-case review', 'Career direction', 'Reflective practice'],
    ctaLabel: 'Find a mentor',
    learn: [
      '1:1 clinical supervision on real cases',
      'Personalised skill and career guidance',
      'Reflective practice support',
      'Direction for specialisation',
    ],
    forWho: ['Early-career clinicians', 'Students seeking guidance', 'Professionals wanting supervision'],
    format: 'Online · Scheduled 1:1 sessions',
  },
  {
    slug: 'fellowship-programs',
    category: 'Professional Growth',
    iconName: 'award', accent: 'blue',
    title: 'Fellowship Programs',
    subtitle: 'Advanced Specialty Tracks',
    tagline: 'Go deeper in a focused clinical specialty.',
    body: 'Longer-form specialty tracks for clinicians ready for advanced depth.',
    overview:
      'In-depth, advanced specialty tracks for clinicians ready to go deeper — structured, longer-form programs building real expertise in a focused area.',
    metrics: [
      { top: '3–6', sub: 'Months' },
      { top: 'Specialty', sub: 'Depth' },
      { top: 'Advanced', sub: 'Credential' },
    ],
    highlights: ['Supervised depth', 'Research component', 'Specialty focus'],
    ctaLabel: 'Explore fellowships',
    learn: [
      'Advanced, specialty-focused curriculum',
      'Supervised clinical depth',
      'Research and applied components',
      'A recognised fellowship credential',
    ],
    forWho: ['Experienced clinicians', 'Specialists-in-training', 'Professionals deepening expertise'],
    format: 'Online · Longer-form, advanced',
  },
];

export const PROGRAMS_BY_SLUG = Object.fromEntries(ACADEMY_PROGRAMS.map((p) => [p.slug, p]));

/** Flagship course(s) featured above the category grid. */
export const FEATURED_PROGRAMS = ACADEMY_PROGRAMS.filter((p) => p.featured);

export const ACADEMY_CATEGORIES = [
  { label: 'Career Entry', tagline: 'Start strong. Build your foundation.' },
  { label: 'Clinical Practice', tagline: 'Learn. Practice. Deliver impact.' },
  { label: 'Professional Growth', tagline: 'Grow continuously. Lead with clarity.' },
];

export const ACADEMY_PATHS = [
  {
    title: 'For clinicians',
    body: 'Flagship Clinical Excellence, telepractice, documentation, and CPD that fit real schedules.',
    href: '/academy/program/clinical-excellence',
    cta: 'Open Clinical Excellence',
  },
  {
    title: 'For students & early career',
    body: 'Student training, counselling skills, and certificates that bridge classroom and clinic.',
    href: '#programs',
    cta: 'Browse career-entry tracks',
  },
  {
    title: 'For organisations',
    body: 'Workplace and campus literacy programmes with clear boundaries — education, not diagnosis.',
    href: '/corporate',
    cta: 'Plan a workshop',
  },
];

export const ACADEMY_JOURNEY = [
  { icon: 'cap', title: 'Student', sub: 'Start your learning journey' },
  { icon: 'certificate', title: 'Certificate', sub: 'Build foundational skills' },
  { icon: 'stethoscope', title: 'Clinical Training', sub: 'Gain practical clinical expertise' },
  { icon: 'book', title: 'Research', sub: 'Contribute to evidence' },
  { icon: 'briefcase', title: 'Practice', sub: 'Deliver impact with confidence' },
  { icon: 'award', title: 'CPD & Fellowship', sub: 'Keep learning. Stay ahead.' },
];

export const ACADEMY_WHY = [
  {
    title: 'Clinician-led',
    desc: 'Every programme is designed by practicing mental health professionals — not generic content farms.',
  },
  {
    title: 'Case-based',
    desc: 'Learn from real clinical scenarios you can apply the same week, not only textbooks.',
  },
  {
    title: 'India-ready',
    desc: 'Aligned with Indian telemedicine norms, documentation practice, and regulatory context.',
  },
  {
    title: 'Free for Serenest pros',
    desc: 'Approved Serenest professionals get full Academy access at no program fee.',
  },
];

export const ACADEMY_FAQ = [
  {
    q: 'Who are Serenest Academy courses designed for?',
    a: 'Psychology students, fresh graduates, practicing counsellors, psychiatry residents, and licensed professionals seeking continuous development.',
  },
  {
    q: 'What is the best Academy course for practicing professionals?',
    a: 'Clinical Excellence is our flagship course — assessment, evidence-based care, telepsychiatry, documentation, and measurement-based practice. Approved Serenest professionals get it free.',
  },
  {
    q: 'Is Academy free for Serenest professionals?',
    a: 'Yes. Approved Serenest professionals get full Academy access at no charge — sign in with your professional email and enroll without a program fee.',
  },
  {
    q: 'Are the certificates recognized?',
    a: 'Certificates are issued by Serenest Education Pvt Ltd and recognized by peers, employers, and professional networks across India’s mental health sector.',
  },
  {
    q: 'How are the courses delivered?',
    a: 'Online — self-paced modules with live case discussion sessions. Learn at your own pace while engaging with peers and faculty.',
  },
  {
    q: 'Do Academy programmes diagnose or treat patients?',
    a: 'No. Academy is educational. Clinical care happens on Serenest’s clinical platform with verified professionals — never through a course alone.',
  },
  {
    q: 'How do I enrol?',
    a: 'Create a Serenest Academy account, choose your program, and follow the enrollment steps. Some programs list specific entry requirements on their detail page.',
  },
];
