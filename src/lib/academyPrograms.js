/**
 * Serenest Academy programs. Each renders a dedicated page at
 * /academy/program/:slug via AcademyProgramPage.
 */

export const ACADEMY_PROGRAMS = [
  {
    slug: 'student-training',
    icon: '🎓',
    category: 'Career Entry',
    title: 'Psychology Student Training',
    tagline: 'For Psychology, Psychiatry & Mental Health students.',
    overview:
      'A foundational, case-based program that bridges the gap between classroom theory and real clinical work. Built for students who want to enter practice confident and job-ready.',
    learn: [
      'Core concepts in clinical psychology and assessment',
      'Structured history-taking and case formulation',
      'Using PHQ-9, GAD-7 and other validated tools',
      'Ethics, confidentiality, and professional conduct',
      'Internship and placement readiness',
    ],
    forWho: ['Undergraduate & postgraduate psychology students', 'Fresh graduates entering practice'],
    highlights: ['50+ hours training', 'Case discussions', 'Certificate included'],
    format: 'Online · Self-paced with live case discussions',
  },
  {
    slug: 'counselling-skills',
    icon: '🧠',
    category: 'Career Entry',
    title: 'Counselling Skills Development',
    tagline: 'Foundational counselling and therapeutic communication.',
    overview:
      'Practical skill-building for effective, ethical counselling — the communication, rapport, and technique foundations every mental health practitioner needs.',
    learn: [
      'Active listening and therapeutic communication',
      'Building rapport and a safe space',
      'Basics of CBT and supportive techniques',
      'Ethical boundaries and referral',
      'Supervision and reflective practice',
    ],
    forWho: ['Aspiring and practicing counsellors', 'Psychology students', 'Allied helpers and educators'],
    highlights: ['Communication drills', 'Role-play practice', 'Ethics grounding'],
    format: 'Online · Practical, exercise-led',
  },
  {
    slug: 'certificate-programs',
    icon: '📜',
    category: 'Career Entry',
    title: 'Professional Certificate Programs',
    tagline: 'Short-term professional certifications.',
    overview:
      'Focused, short-term certificate tracks that let working professionals and students build a specific, verifiable skill and earn a certificate of completion.',
    learn: [
      'Targeted, role-relevant clinical skills',
      'Applied, case-based modules',
      'Assessment and completion criteria',
      'A shareable certificate of completion',
    ],
    forWho: ['Working mental health professionals', 'Students adding a credential', 'Career switchers'],
    highlights: ['Short duration', 'Certificate included', 'Flexible online'],
    format: 'Online · Short-term, certificate on completion',
  },
  {
    slug: 'psychiatry-training',
    icon: '⚕️',
    category: 'Clinical Practice',
    title: 'Psychiatry Clinical Training',
    tagline: 'Clinical psychiatry, prescribing & telemedicine.',
    overview:
      'For residents and prescribers: a practice-oriented program covering modern telepsychiatry norms, prescribing conversations, documentation, and continuity of care.',
    learn: [
      'Telemedicine practice norms and consent',
      'Prescribing conversations and safety',
      'SOAP notes and Rx documentation workflow',
      'Risk assessment and escalation',
      'Continuity of care between visits',
    ],
    forWho: ['Psychiatry residents', 'Prescribing clinicians', 'MBBS doctors moving into mental health'],
    highlights: ['Telemedicine norms', 'Prescribing conversations', 'SOAP / Rx workflow'],
    format: 'Online · Clinician-led, case-based',
  },
  {
    slug: 'digital-mental-health',
    icon: '💻',
    category: 'Clinical Practice',
    title: 'Digital Mental Health & Telepsychiatry',
    tagline: 'Telepsychiatry, documentation & remote care.',
    overview:
      'Learn to deliver high-quality care remotely — platform workflows, secure documentation, and the practicalities of running safe, effective telepsychiatry.',
    learn: [
      'Setting up and running a teleconsultation',
      'Secure documentation and records',
      'Building rapport over video and audio',
      'Privacy, consent, and regulation',
      'Continuity and follow-up in remote care',
    ],
    forWho: ['Clinicians moving to online practice', 'Psychiatrists and psychologists', 'Digital health teams'],
    highlights: ['Platform workflows', 'Documentation', 'Remote-care safety'],
    format: 'Online · Practical, tools-led',
  },
  {
    slug: 'research-publications',
    icon: '🔬',
    category: 'Clinical Practice',
    title: 'Research & Publication Guidance',
    tagline: 'Research methodology and publication support.',
    overview:
      'Support for clinicians and students who want to publish — from literature reviews and case reports to publication-ready writing, with mentorship along the way.',
    learn: [
      'Research methodology basics',
      'Conducting a focused literature review',
      'Writing case reports and clinical papers',
      'Structuring and submitting for publication',
      'Working with a publication mentor',
    ],
    forWho: ['Postgraduate students', 'Residents and early-career clinicians', 'Researchers in mental health'],
    highlights: ['Literature reviews', 'Case reports', 'Publication mentorship'],
    format: 'Online · Mentor-supported',
  },
  {
    slug: 'cpd-programs',
    icon: '🎯',
    category: 'Professional Growth',
    title: 'Continuing Professional Development (CPD)',
    tagline: 'Continuous professional development.',
    overview:
      'Ongoing, structured learning that helps licensed professionals stay current with evidence, sharpen skills, and meet continuing professional development expectations.',
    learn: [
      'Current, evidence-based updates',
      'Refreshers on assessment and treatment',
      'New modalities and best practice',
      'Reflective practice and self-audit',
    ],
    forWho: ['Licensed psychologists and psychiatrists', 'Practicing counsellors', 'Any clinician maintaining CPD'],
    highlights: ['Ongoing modules', 'Evidence-based', 'Flexible online'],
    format: 'Online · Ongoing, flexible',
  },
  {
    slug: 'mentorship',
    icon: '👨‍🏫',
    category: 'Professional Growth',
    title: 'Mentorship & Supervision',
    tagline: '1:1 supervision and career guidance.',
    overview:
      'Personalised, one-to-one mentorship and clinical supervision — guidance on cases, skills, and career direction from experienced clinicians.',
    learn: [
      '1:1 clinical supervision on real cases',
      'Personalised skill and career guidance',
      'Reflective practice support',
      'Direction for specialisation',
    ],
    forWho: ['Early-career clinicians', 'Students seeking guidance', 'Professionals wanting supervision'],
    highlights: ['1:1 supervision', 'Career guidance', 'Experienced clinicians'],
    format: 'Online · Scheduled 1:1 sessions',
  },
  {
    slug: 'fellowship-programs',
    icon: '🏆',
    category: 'Professional Growth',
    title: 'Fellowship Programs',
    tagline: 'Advanced specialty tracks.',
    overview:
      'In-depth, advanced specialty tracks for clinicians ready to go deeper — structured, longer-form programs building real expertise in a focused area.',
    learn: [
      'Advanced, specialty-focused curriculum',
      'Supervised clinical depth',
      'Research and applied components',
      'A recognised fellowship credential',
    ],
    forWho: ['Experienced clinicians', 'Specialists-in-training', 'Professionals deepening expertise'],
    highlights: ['Advanced specialty', 'Supervised depth', 'Fellowship credential'],
    format: 'Online · Longer-form, advanced',
  },
];

export const PROGRAMS_BY_SLUG = Object.fromEntries(ACADEMY_PROGRAMS.map((p) => [p.slug, p]));
