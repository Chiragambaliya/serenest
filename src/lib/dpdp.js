/**
 * Digital Personal Data Protection Act, 2023 (DPDP Act / DPDPA) — India
 * Shared compliance constants, Section 5 itemized notice metadata, and
 * Data Principal rights request validator (Sections 5, 6, 8, 9, 11, 12, 13, 14).
 */

export const DPDP_NOTICE_VERSION = 'DPDP-2026.1';

export const DPDP_FIDUCIARY = {
  name: 'Serenest Education Pvt Ltd',
  role: 'Data Fiduciary (under Section 2(i) of the DPDP Act, 2023)',
  grievanceOfficer: 'Dr. Chirag Aambalia',
  designation: 'Grievance Officer & Data Protection Contact',
  email: 'support@serenest.in',
  phone: '+91 77779 36367',
  address: 'Rajkot, Gujarat, India',
  escalationBody: 'Data Protection Board of India (established under Section 18 of the DPDP Act, 2023)',
  acknowledgementSla: 'Within 24 hours (business days)',
  resolutionSla: 'Within 7 working days (and always within statutory DPDP timelines)',
};

export const DPDP_REQUEST_TYPES = [
  {
    id: 'withdraw_consent',
    section: 'Section 6(4)',
    label: 'Withdraw Consent',
    shortDesc: 'Stop pending appointment callbacks, marketing emails, or optional analytics processing.',
    sla: 'Processed within 24 hours; browser analytics/session storage cleared immediately.',
  },
  {
    id: 'access_summary',
    section: 'Section 11',
    label: 'Access Data Summary & Processors',
    shortDesc: 'Obtain a summary of personal data held by Serenest and the identities of Data Processors.',
    sla: 'Delivered within 7 working days after identity verification.',
  },
  {
    id: 'correction',
    section: 'Section 12(1)',
    label: 'Correct or Update Personal Data',
    shortDesc: 'Correct inaccurate or incomplete contact details, language preferences, or intake notes.',
    sla: 'Updated within 72 hours of verification.',
  },
  {
    id: 'erasure',
    section: 'Section 12(3)',
    label: 'Request Erasure / Deletion',
    shortDesc: 'Delete personal data no longer needed for its specified purpose (subject to 7-year NMC medical record laws for completed consultations).',
    sla: 'Completed within 7–30 days with written confirmation.',
  },
  {
    id: 'nomination',
    section: 'Section 14',
    label: 'Register a Nominee',
    shortDesc: 'Nominate a trusted individual to exercise your Data Principal rights in the event of death or incapacity.',
    sla: 'Recorded immediately with a nomination reference ID.',
  },
  {
    id: 'grievance',
    section: 'Section 13',
    label: 'Raise a Privacy Grievance',
    shortDesc: 'File a formal data protection complaint with Serenest’s Grievance Officer before approaching the Data Protection Board of India.',
    sla: 'Acknowledged within 24 hours; resolved within 7 working days.',
  },
];

export const DPDP_ITEMIZED_NOTICE = {
  version: DPDP_NOTICE_VERSION,
  items: [
    {
      category: 'Identity & Contact Data',
      examples: 'Full name, 10-digit Indian mobile number, optional email address, preferred language.',
      purpose: 'Confirming your appointment slot via phone/WhatsApp, sending booking confirmations, and verifying your identity.',
    },
    {
      category: 'Voluntary Care Intake & Self-Screening Data',
      examples: 'Symptoms or concerns shared in AI intake, PHQ-9 / GAD-7 / BAT-12 responses, preferred specialist type and mode.',
      purpose: 'Non-diagnostic specialist matching, preparing a structured intake brief for your treating clinician, and continuity of care.',
    },
    {
      category: 'Consultation & Prescription Records',
      examples: 'Session notes and digital prescriptions issued by your treating clinician.',
      purpose: 'Delivering clinical care and complying with the 7-year record retention mandate under India’s Telemedicine Practice Guidelines, 2020.',
    },
    {
      category: 'Device & Optional Analytics Data',
      examples: 'Essential security logs; optional page-view analytics (off by default unless you click "Allow analytics").',
      purpose: 'Platform security, rate-limiting, and — only with explicit opt-in consent — aggregate site improvement.',
    },
  ],
};

const VALID_TYPE_IDS = new Set(DPDP_REQUEST_TYPES.map((t) => t.id));

export function validateDpdpRequest(raw = {}) {
  const requestType = String(raw.request_type || '').trim();
  if (!VALID_TYPE_IDS.has(requestType)) {
    return { valid: false, error: 'Please select a valid DPDP request type.' };
  }

  const name = String(raw.name || '').trim();
  if (name.length < 2 || name.length > 120) {
    return { valid: false, error: 'Please enter your full name (at least 2 characters).' };
  }

  const phoneClean = String(raw.phone || '').replace(/\D/g, '').slice(-10);
  const email = String(raw.email || '').trim();
  const phoneOk = phoneClean.length === 10 && /^[6-9]/.test(phoneClean);
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!phoneOk && !emailOk) {
    return {
      valid: false,
      error: 'Please provide your 10-digit Indian mobile number or email address so we can locate your records.',
    };
  }

  const nomineeName = String(raw.nominee_name || '').trim().slice(0, 120);
  const nomineeRelation = String(raw.nominee_relation || '').trim().slice(0, 80);
  const nomineeContact = String(raw.nominee_contact || '').trim().slice(0, 120);

  if (requestType === 'nomination' && nomineeName.length < 2) {
    return {
      valid: false,
      error: 'Please enter the full name of the person you wish to nominate under Section 14.',
    };
  }

  const details = String(raw.details || '').trim().slice(0, 2000);
  const typeMeta = DPDP_REQUEST_TYPES.find((t) => t.id === requestType);

  return {
    valid: true,
    error: null,
    sanitized: {
      request_type: requestType,
      request_label: typeMeta.label,
      dpdp_section: typeMeta.section,
      name,
      phone: phoneOk ? phoneClean : null,
      email: emailOk ? email : null,
      details: details || null,
      nominee_name: requestType === 'nomination' ? nomineeName : null,
      nominee_relation: requestType === 'nomination' ? (nomineeRelation || null) : null,
      nominee_contact: requestType === 'nomination' ? (nomineeContact || null) : null,
      notice_version: DPDP_NOTICE_VERSION,
    },
  };
}
