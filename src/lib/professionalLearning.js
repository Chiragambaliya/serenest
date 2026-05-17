/**
 * Curated learning paths for mental health professionals on Serenest.
 * Extend with new rows as you publish guides, videos, or in-app walkthroughs.
 *
 * kind:
 *  - blog   → internal React route in `to`
 *  - link   → external URL in `href`
 *  - pdf    → file URL in `href` (opens/downloads; replace with Supabase Storage in production)
 *  - video  → watch URL in `href` (e.g. YouTube)
 *  - email  → mailto with optional `emailSubject`
 *  - soon   → no link yet; shows “Coming soon”
 */

/** @typedef {'blog' | 'link' | 'pdf' | 'video' | 'email' | 'soon'} ProfessionalLearningKind */

/**
 * @typedef {{
 *   id: string;
 *   title: string;
 *   summary: string;
 *   pill: string;
 *   kind: ProfessionalLearningKind;
 *   icon?: string;
 *   to?: string;
 *   href?: string;
 *   emailSubject?: string;
 * }} ProfessionalLearningModule
 */

/** @type {ProfessionalLearningModule[]} */
export const PROFESSIONAL_LEARNING_MODULES = [
  {
    id: 'telemedicine-india',
    icon: '📡',
    title: 'Telemedicine in India: what your patients should know',
    summary:
      'Plain-language basics on online consults, consent, and documentation — useful when onboarding patients and aligning with MCI-aligned practice.',
    pill: 'Compliance',
    kind: 'blog',
    to: '/blog/telemedicine-guidelines-india',
  },
  {
    id: 'phq9-gad7',
    icon: '📊',
    title: 'PHQ-9 & GAD-7 in measurement-based care',
    summary:
      'Why trendlines beat single scores and how brief tools support follow-ups and shared decisions in ongoing care.',
    pill: 'Clinical',
    kind: 'blog',
    to: '/blog/phq9-gad7-tracking',
  },
  {
    id: 'privacy-clinical',
    icon: '🔒',
    title: 'Privacy-first mental health care',
    summary:
      'How least-access design, locked records, and clear roles reduce risk and build trust — aligned with DPDP-aware expectations.',
    pill: 'Privacy',
    kind: 'blog',
    to: '/blog/privacy-first-mental-health',
  },
  {
    id: 'patients-first-visit',
    icon: '📋',
    title: 'Helping patients prepare for a first online visit',
    summary:
      'Checklist you can share: environment, timeline of symptoms, medications, and goals for the session.',
    pill: 'Patient education',
    kind: 'blog',
    to: '/blog/prepare-first-online-consultation',
  },
  {
    id: 'therapy-medication',
    icon: '🧠',
    title: 'Therapy, medication, or both',
    summary:
      'A neutral framing for discussions with patients about combined approaches — not a substitute for individualised advice.',
    pill: 'Clinical',
    kind: 'blog',
    to: '/blog/therapy-medication-both',
  },
  {
    id: 'serenest-docs',
    icon: '📝',
    title: 'SOAP notes & session workflow on Serenest',
    summary:
      'Platform-specific walkthrough: templates, locking, and continuity between visits. We can add short videos or PDFs here as they ship.',
    pill: 'Platform',
    kind: 'soon',
  },
  {
    id: 'training-request',
    icon: '🎓',
    title: 'Request a live or group orientation',
    summary:
      'Ask for a walkthrough for your clinic or team — scheduling, assessments, Rx workflow, and admin essentials.',
    pill: 'Training',
    kind: 'email',
    emailSubject: 'Professional%20learning%20%2F%20orientation%20request',
  },
  {
    id: 'sleep-mood-loop',
    icon: '🌙',
    title: 'Sleep, mood, and stress loops',
    summary:
      'Discussing how sleep loss and stress interact — useful language for psychoeducation and treatment planning.',
    pill: 'Clinical',
    kind: 'blog',
    to: '/blog/sleep-mood-stress-loop',
  },
  {
    id: 'work-stress',
    icon: '💼',
    title: 'Work stress that will not “grindset” away',
    summary:
      'Framing occupational overload for high-functioning patients — boundaries, signals, and when to escalate care.',
    pill: 'Clinical',
    kind: 'blog',
    to: '/blog/work-stress-without-the-hustle-narrative',
  },
  {
    id: 'screens-anxiety',
    icon: '📱',
    title: 'Screens, stimulation, and anxiety',
    summary:
      'Evidence-informed habits to suggest when digital overload shows up in session.',
    pill: 'Lifestyle',
    kind: 'blog',
    to: '/blog/screens-stimulation-and-anxiety',
  },
  {
    id: 'stigma-privacy',
    icon: '🤝',
    title: 'Stigma, privacy, and reaching out',
    summary:
      'How confidentiality and telehealth can lower barriers — helpful when patients fear disclosure.',
    pill: 'Privacy',
    kind: 'blog',
    to: '/blog/stigma-and-reaching-out',
  },
  {
    id: 'family-support',
    icon: '👨‍👩‍👧',
    title: 'Supporting someone who is struggling — without burnout',
    summary:
      'Boundaries and language for carers; when to recommend professional care.',
    pill: 'Psychoeducation',
    kind: 'blog',
    to: '/blog/family-friends-support-without-burnout',
  },
  {
    id: 'changing-provider',
    icon: '🔄',
    title: 'Changing therapist or psychiatrist',
    summary:
      'Normalising fit and handoffs — reduces shame when patients consider switching.',
    pill: 'Practice',
    kind: 'blog',
    to: '/blog/changing-your-mental-health-provider',
  },
  {
    id: 'continuity-handoffs',
    icon: '🔗',
    title: 'Continuity between telepsychiatry sessions',
    summary:
      'Lightweight handoff habits: what to capture in the plan, how to phrase follow-ups, and when to schedule touchpoints.',
    pill: 'Clinical',
    kind: 'blog',
    to: '/blog/continuity-telepsychiatry-handoffs',
  },
  {
    id: 'risk-safety-documentation',
    icon: '⚠️',
    title: 'Documenting risk & safety in telepsychiatry (orientation)',
    summary:
      'Framing documentation for escalation pathways, collateral contacts, and after-hours expectations — not a protocol for your jurisdiction.',
    pill: 'Clinical',
    kind: 'blog',
    to: '/blog/documenting-risk-safety-telehealth',
  },
  {
    id: 'sample-pdf-checklist',
    icon: '📎',
    title: 'Sample PDF checklist (demo file)',
    summary:
      'Demonstrates PDF links from the hub. Replace this URL with a file in Supabase Storage or your CDN when your real checklist is ready.',
    pill: 'PDF',
    kind: 'pdf',
    href: 'https://www.w3.org/WAI/WCAG21/working-examples/pdf-note/note.pdf',
  },
  {
    id: 'intro-measurement-video',
    icon: '▶️',
    title: 'Video: measurement-based care (external lecture)',
    summary:
      'Placeholder: swap `href` for your own Loom, YouTube unlisted recording, or Vimeo. Useful pattern for “watch first” modules.',
    pill: 'Video',
    kind: 'video',
    href: 'https://www.youtube.com/watch?v=KWvU3NaiaGs',
  },
];

/** @param {{ kind: string }} m */
export function isProLearningProgressTrackable(m) {
  return m.kind === 'blog' || m.kind === 'link' || m.kind === 'pdf' || m.kind === 'video';
}
