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
    tagline: 'The flagship course for psychiatrists, psychologists, therapists & counsellors.',
    body: 'Serenest Academy’s best course for working clinicians — assessment, evidence-based care, telepsychiatry, documentation, and measurement-based practice.',
    overview:
      'Our flagship program for practicing mental health professionals. Build clinical excellence across assessment, formulation, evidence-based interventions, telepsychiatry, documentation, ethics, and measurement-based care — designed for real Indian practice, free for approved Serenest professionals.',
    metrics: [
      { top: '12', sub: 'Weeks' },
      { top: '8', sub: 'Clinical Modules' },
      { top: 'Certificate', sub: 'Included' },
    ],
    highlights: [
      'Flagship for practicing clinicians',
      'Free for Serenest professionals',
      'Case-based + live supervision',
      'Certificate of completion',
    ],
    ctaLabel: 'Start Clinical Excellence',
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
    tagline: 'For Psychology, Psychiatry & Mental Health students.',
    body: 'Foundational and applied training for students entering the mental health field.',
    overview:
      'A foundational, case-based program that bridges the gap between classroom theory and real clinical work. Built for students who want to enter practice confident and job-ready.',
    metrics: [
      { top: '50+', sub: 'Hours Training' },
      { top: 'Case', sub: 'Discussions' },
      { top: 'Certificate', sub: 'Included' },
    ],
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
    iconName: 'people', accent: 'purple',
    title: 'Counselling Skills',
    subtitle: 'Foundational Counselling & Therapeutic Communication',
    tagline: 'Foundational counselling and therapeutic communication.',
    body: 'Practical, case-based skill building in communication, ethics and counsellor competencies.',
    overview:
      'Practical skill-building for effective, ethical counselling — the communication, rapport, and technique foundations every mental health practitioner needs.',
    metrics: [
      { top: '30+', sub: 'Skills Modules' },
      { top: 'Role-play', sub: 'Sessions' },
      { top: 'Practical', sub: 'Tools' },
    ],
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
    iconName: 'certificate', accent: 'amber',
    title: 'Certificate Programs',
    subtitle: 'Short-term Professional Certifications',
    tagline: 'Short-term professional certifications.',
    body: 'Structured, clinically reviewed certificate programs for working professionals and students.',
    overview:
      'Focused, short-term certificate tracks that let working professionals and students build a specific, verifiable skill and earn a certificate of completion.',
    metrics: [
      { top: '10+', sub: 'Certificates' },
      { top: 'Industry', sub: 'Relevant' },
      { top: 'Flexible', sub: 'Learning' },
    ],
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
    tagline: 'Clinical psychiatry, prescribing & telemedicine.',
    body: 'For residents and prescribers: telemedicine norms, prescribing conversations, and SOAP/Rx workflow.',
    overview:
      'For residents and prescribers: a practice-oriented program covering modern telepsychiatry norms, prescribing conversations, documentation, and continuity of care.',
    metrics: [
      { top: '40+', sub: 'Clinical Modules' },
      { top: 'Prescribing', sub: 'Guides' },
      { top: 'Case-based', sub: 'Learning' },
    ],
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
    tagline: 'Telepsychiatry, documentation & remote care.',
    body: 'Modern, remote-care delivery with platform workflows, documentation and continuity of care.',
    overview:
      'Learn to deliver high-quality care remotely — platform workflows, secure documentation, and the practicalities of running safe, effective telepsychiatry.',
    metrics: [
      { top: '25+', sub: 'Workflows' },
      { top: 'Documentation', sub: 'Templates' },
      { top: 'Telehealth', sub: 'Guides' },
    ],
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
    tagline: 'Research methodology and publication support.',
    body: 'Support for case write-ups, literature reviews, and publication-ready clinical writing.',
    overview:
      'Support for clinicians and students who want to publish — from literature reviews and case reports to publication-ready writing, with mentorship along the way.',
    metrics: [
      { top: 'Guided', sub: 'Projects' },
      { top: 'Publication', sub: 'Mentorship' },
      { top: 'Journal', sub: 'Support' },
    ],
    ctaLabel: 'View resources',
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
    tagline: 'Continuous professional development.',
    body: 'Ongoing learning for licensed professionals to stay current and meet CPD requirements.',
    overview:
      'Ongoing, structured learning that helps licensed professionals stay current with evidence, sharpen skills, and meet continuing professional development expectations.',
    metrics: [
      { top: '100+', sub: 'CPD Activities' },
      { top: 'Expert', sub: 'Faculty' },
      { top: 'CPD', sub: 'Credits' },
    ],
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
    tagline: '1:1 supervision and career guidance.',
    body: 'Personalized mentorship and supervision to help you grow with clarity and confidence.',
    overview:
      'Personalised, one-to-one mentorship and clinical supervision — guidance on cases, skills, and career direction from experienced clinicians.',
    metrics: [
      { top: '1:1', sub: 'Mentorship' },
      { top: 'Case', sub: 'Supervision' },
      { top: 'Career', sub: 'Guidance' },
    ],
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
    iconName: 'award', accent: 'purple',
    title: 'Fellowship Programs',
    subtitle: 'Advanced Specialty Tracks',
    tagline: 'Advanced specialty tracks.',
    body: 'In-depth fellowship programs in specialized areas of mental health practice.',
    overview:
      'In-depth, advanced specialty tracks for clinicians ready to go deeper — structured, longer-form programs building real expertise in a focused area.',
    metrics: [
      { top: 'Specialty', sub: 'Tracks' },
      { top: 'Advanced', sub: 'Training' },
      { top: 'Professional', sub: 'Recognition' },
    ],
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
  { label: 'Professional Growth', tagline: 'Grow continuously. Lead the change.' },
];

export const ACADEMY_JOURNEY = [
  { icon: 'cap', title: 'Student', sub: 'Start your learning journey' },
  { icon: 'certificate', title: 'Certificate', sub: 'Build foundational skills' },
  { icon: 'stethoscope', title: 'Clinical Training', sub: 'Gain practical clinical expertise' },
  { icon: 'book', title: 'Research & Publication', sub: 'Contribute to evidence & knowledge' },
  { icon: 'briefcase', title: 'Professional Practice', sub: 'Deliver impact with confidence' },
  { icon: 'award', title: 'CPD & Fellowship', sub: 'Keep learning. Stay ahead.' },
];
