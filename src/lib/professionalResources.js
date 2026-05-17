/**
 * Downloadables, checklists, and shareables for practice — extend as files ship.
 *
 * kind: blog | link | pdf | video | email | soon
 */

/** @typedef {'blog' | 'link' | 'pdf' | 'video' | 'email' | 'soon'} ResourceKind */

/**
 * @typedef {{
 *   id: string;
 *   title: string;
 *   summary: string;
 *   pill: string;
 *   kind: ResourceKind;
 *   icon?: string;
 *   to?: string;
 *   href?: string;
 *   emailSubject?: string;
 * }} ProfessionalResource
 */

/** @type {ProfessionalResource[]} */
export const PROFESSIONAL_RESOURCES = [
  {
    id: 'patient-handout-first-visit',
    icon: '📄',
    title: 'Patient handout: first online visit',
    summary:
      'Blog article you can share as a link or basis for your own one-pager: room setup, medications list, and goals for the session.',
    pill: 'Patient-facing',
    kind: 'blog',
    to: '/blog/prepare-first-online-consultation',
  },
  {
    id: 'assessment-explainer',
    icon: '📊',
    title: 'Explaining PHQ-9 / GAD-7 to patients',
    summary:
      'Short clinical explainer suitable for framing why you track scores over time rather than relying on a single snapshot.',
    pill: 'Clinical',
    kind: 'blog',
    to: '/blog/phq9-gad7-tracking',
  },
  {
    id: 'consent-language',
    icon: '✍️',
    title: 'Consent & telemedicine documentation prompts',
    summary:
      'Checklist-style language bank for consent, identity verification, and note headers aligned with telemedicine practice patterns.',
    pill: 'Templates',
    kind: 'soon',
  },
  {
    id: 'fee-receipt',
    icon: '🧾',
    title: 'Fee transparency & receipt wording',
    summary:
      'Suggested phrasing for fee display, refunds, and receipts when you use integrated billing — tailored for Indian practice norms.',
    pill: 'Operations',
    kind: 'soon',
  },
  {
    id: 'clinic-website-blurb',
    icon: '🏷️',
    title: '“Book on Serenest” copy for your website',
    summary:
      'Request approved short blurbs and logo usage for your clinic or hospital profile page.',
    pill: 'Brand',
    kind: 'email',
    emailSubject: 'Professional%20resources%3A%20website%20blurb%20request',
  },
  {
    id: 'org-programmes',
    icon: '🏢',
    title: 'Corporate & school programme deck',
    summary:
      'Overview PDF for employers and institutions — we can email the latest version on request.',
    pill: 'Partnerships',
    kind: 'email',
    emailSubject: 'Professional%20resources%3A%20organisations%20deck',
  },
  {
    id: 'pdf-brand-asset-sheet',
    icon: '📎',
    title: 'Brand one-pager (sample PDF link)',
    summary:
      'Same mechanism as the learning hub: host your real PDF in Storage, then point `href` here.',
    pill: 'PDF',
    kind: 'pdf',
    href: 'https://www.w3.org/WAI/WCAG21/working-examples/pdf-note/note.pdf',
  },
];
