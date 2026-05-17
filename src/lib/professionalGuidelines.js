/**
 * Compliance-oriented summaries for Indian telepsychiatry practice.
 * Not legal advice; clinicians remain responsible for their own registrations and local rules.
 */

/** @typedef {{ id: string; title: string; bullets: string[]; pill: string; to?: string; href?: string; linkLabel?: string }} GuidelineTopic */

/** @type {GuidelineTopic[]} */
export const PROFESSIONAL_GUIDELINE_TOPICS = [
  {
    id: 'tele-2020',
    pill: 'National guidance',
    title: 'Telemedicine Practice Guidelines (India)',
    bullets: [
      'Consultation modes, consent, identity, documentation, and prescription expectations follow national telemedicine practice guidelines.',
      'Serenest’s flows are designed for clinically grounded consults — prescriptions only after eligible consultation with a registered practitioner.',
      'Always keep your SMC/MCI (or equivalent) registration current and issue prescriptions only where legally permitted.',
    ],
    to: '/blog/telemedicine-guidelines-india',
    linkLabel: 'Patient-facing summary on our blog →',
  },
  {
    id: 'dpdp',
    pill: 'Privacy',
    title: 'DPDP Act 2023 & health data',
    bullets: [
      'Use least-access habits: share record access only with people who need it for care or lawful operations.',
      'Document purpose and retention in line with your organisation’s policies and applicable law.',
      'Our platform posture emphasises locked notes and role boundaries — your clinic policies should complement this.',
    ],
    to: '/blog/privacy-first-mental-health',
    linkLabel: 'Privacy-first care explainer →',
  },
  {
    id: 'schedule-h',
    pill: 'Prescribing',
    title: 'Psychotropic & Schedule expectations',
    bullets: [
      'Schedule H and related drug rules apply to how certain medicines may be prescribed and documented.',
      'Serenest does not bypass regulatory requirements; restricted prescribing remains limited to authorised prescribers after consult.',
      'When in doubt, refer to current Gazette notifications and your professional society guidance.',
    ],
  },
  {
    id: 'continuity',
    pill: 'Clinical quality',
    title: 'Continuity of care & follow-up',
    bullets: [
      'Measurement-based care (e.g. PHQ-9 / GAD-7 trends) supports better triage of follow-up timing.',
      'Clear handoffs — including summaries patients can understand — reduce drop-out and medico-legal ambiguity.',
    ],
    to: '/blog/phq9-gad7-tracking',
    linkLabel: 'Tracking progress, clinically →',
  },
];
