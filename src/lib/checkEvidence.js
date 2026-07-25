/**
 * Mental Health Check evidence registry.
 * Each launched check adds an entry — Evidence Center + result pages read from here.
 * Clinical claims must cite published sources; never invent.
 */

/** @typedef {{ statement: string; source: string; url?: string }} EvidenceClaim */

/** @type {Record<string, object>} */
export const CHECK_EVIDENCE = {
  bat12: {
    toolId: 'bat12',
    evidenceSlug: 'bat-12',
    landingPath: '/burnout-check',
    productTitle: 'Burnout Check',
    officialName: 'Burnout Assessment Tool — short form (BAT-12), general (context-free) version',
    authors: 'Wilmar B. Schaufeli, Steffie Desart, Hans De Witte',
    year: 2020,
    shortFormYear: 2022,
    cutoffYear: 2023,
    primaryPaper: {
      citation:
        'Schaufeli, W. B., Desart, S., & De Witte, H. (2020). Burnout Assessment Tool (BAT)—Development, validity, and reliability. International Journal of Environmental Research and Public Health, 17(24), 9495.',
      doi: '10.3390/ijerph17249495',
      url: 'https://doi.org/10.3390/ijerph17249495',
    },
    shortFormPaper: {
      citation:
        'Hadžibajramović, E., Schaufeli, W., & De Witte, H. (2022). Shortening of the Burnout Assessment Tool (BAT)—from 23 to 12 items using content and Rasch analysis. BMC Public Health, 22, 560.',
      doi: '10.1186/s12889-022-12946-y',
      url: 'https://doi.org/10.1186/s12889-022-12946-y',
    },
    cutoffPaper: {
      citation:
        'Schaufeli, W. B., De Witte, H., Hakanen, J. J., Kaltiainen, J., & Kok, R. (2023). How to assess severe burnout? Cutoff points for the Burnout Assessment Tool (BAT) based on three European samples. Scandinavian Journal of Work, Environment & Health.',
      doi: '10.5271/sjweh.4093',
      url: 'https://doi.org/10.5271/sjweh.4093',
    },
    officialWebsite: 'https://burnoutassessmenttool.be',
    userManual:
      'https://burnoutassessmenttool.be/wp-content/uploads/2020/08/User-Manual-BAT-version-2.0.pdf',
    questionnairePdf: 'https://burnoutassessmenttool.be/wp-content/uploads/2020/08/BAT-English.pdf',
    licensingStatus: 'Non-proprietary. Free to use without requesting permission, provided items are not modified and Schaufeli et al. (2020) is cited.',
    copyrightRestrictions: 'Do not modify item wording. Attribution required.',
    commercialPublicWebAllowed: true,
    permissionRequired: false,
    wordingStatus: 'exact',
    wordingNotes:
      'Serenest reproduces the official English general BAT-12 item stems and 1–5 Never–Always scale without paraphrase. Product titles, band labels, and educational copy are Serenest UI — not instrument adaptations.',
    scoringMethod:
      'Mean of 12 items scored 1 (Never) to 5 (Always). Four subscales (3 items each): exhaustion, mental distance, cognitive impairment, emotional impairment.',
    interpretationBands: [
      { label: 'Lower concern', range: 'mean ≤ 2.53', meaning: 'Below published BAT-12 “at risk” cut-off (pooled European employed samples).' },
      { label: 'Elevated', range: '2.54 – 2.95', meaning: 'At or above “at risk” cut-off; below higher cut-off (Schaufeli et al., 2023).' },
      { label: 'Higher concern', range: 'mean ≥ 2.96', meaning: 'At or above higher cut-off used to flag severe burnout risk in research samples.' },
    ],
    whySelected:
      'BAT-12 is modern, multi-dimensional, free for public web use, and designed for screening. The general version supports people who are not currently in a traditional job. Unlike the Maslach Burnout Inventory, it does not require a paid Mind Garden license that restricts open-web individual feedback.',
    whyNotDiagnosis:
      'WHO classifies burn-out as an occupational phenomenon in ICD-11, not a medical condition. BAT authors treat scores as aids that still require clinical context. Serenest cut-offs come from European employed samples and are not India-specific norms.',
    limitations: [
      'Pooled clinical cut-offs (Schaufeli et al., 2023) were developed on employed samples in the Netherlands, Flanders, and Finland — provisional elsewhere; not validated as India population norms.',
      'The BAT User Manual notes that a total-score cut-off table for the shortened general (non-work) BAT-12 is not available; Serenest discloses use of published BAT-12 employed-sample cut-offs.',
      'Mental distance items retain work/job wording in the official general form.',
      'A questionnaire cannot replace anamnesis, medical evaluation of fatigue, or assessment of depression/anxiety.',
      'No crisis item is built into BAT-12; emergency guidance remains available via Serenest crisis resources.',
    ],
    differentialDiagnosis:
      'Elevated exhaustion and cognitive strain can overlap with depression, anxiety disorders, sleep disorders, medical illness, grief, and adjustment stress. A high BAT score does not distinguish these. Clinical assessment is needed when mood, panic, insomnia, suicidal thinking, or functional collapse are present (WHO ICD-11 burn-out FAQ; clinical burnout literature such as Van Dam, 2021; Schaufeli et al. on discriminating burnout vs depression/distress).',
    clinicalInterpretation:
      'Traffic-light interpretation follows Schaufeli et al. (2023): green / at-risk / higher-risk bands for screening. Authors recommend BAT-12 for screening and BAT-23 when finer individual assessment is required. Serenest uses calm product labels (Lower concern / Elevated / Higher concern) without claiming a clinical burnout diagnosis.',
    /** @type {EvidenceClaim[]} */
    educationalEvidence: [
      {
        statement: 'Burn-out is not classified as a medical condition in ICD-11; it is an occupational phenomenon.',
        source: 'World Health Organization — Burn-out an occupational phenomenon (ICD-11 FAQ)',
        url: 'https://www.who.int/standards/classifications/frequently-asked-questions/burn-out-an-occupational-phenomenon',
      },
      {
        statement: 'BAT core dimensions include exhaustion, mental distance, and cognitive and emotional impairment.',
        source: 'Schaufeli, Desart & De Witte (2020), IJERPH',
        url: 'https://doi.org/10.3390/ijerph17249495',
      },
      {
        statement: 'BAT-12 is a validated short form suitable for screening.',
        source: 'Hadžibajramović, Schaufeli & De Witte (2022), BMC Public Health; Schaufeli et al. (2023)',
        url: 'https://doi.org/10.1186/s12889-022-12946-y',
      },
      {
        statement: 'Published BAT-12 pooled cut-offs: at risk ≥ 2.54; higher/severe-risk flag ≥ 2.96.',
        source: 'Schaufeli et al. (2023), SJWEH',
        url: 'https://doi.org/10.5271/sjweh.4093',
      },
      {
        statement: 'Sleep quality is linked to burnout recovery in clinical literature.',
        source: 'e.g. Sonnenschein et al. (2008); clinical burnout reviews summarizing sleep–burnout coupling',
      },
      {
        statement: 'Recovery from clinical burnout typically requires reducing sustained overload, not only adding productivity tactics.',
        source: 'Van Dam (2021), clinical perspective on burnout; WHO framing of unmanaged chronic workplace stress',
      },
    ],
    references: [
      'Schaufeli, W. B., Desart, S., & De Witte, H. (2020). IJERPH, 17(24), 9495. https://doi.org/10.3390/ijerph17249495',
      'Hadžibajramović, E., Schaufeli, W., & De Witte, H. (2022). BMC Public Health, 22, 560. https://doi.org/10.1186/s12889-022-12946-y',
      'Schaufeli, W. B., et al. (2023). Scand J Work Environ Health. https://doi.org/10.5271/sjweh.4093',
      'World Health Organization. Burn-out an occupational phenomenon (ICD-11). https://www.who.int/standards/classifications/frequently-asked-questions/burn-out-an-occupational-phenomenon',
      'Van Dam, A. (2021). A clinical perspective on burnout. European Journal of Work and Organizational Psychology.',
      'Official BAT materials: https://burnoutassessmenttool.be',
    ],
    faqs: [
      {
        q: 'Is the Serenest Burnout Check a medical diagnosis?',
        a: 'No. It uses the BAT-12 screening questionnaire. WHO does not classify burn-out as a medical condition. Only a qualified clinician can provide a clinical assessment.',
      },
      {
        q: 'Can I use this if I am not currently employed?',
        a: 'Yes. Serenest uses the official general (context-free) BAT-12. A few mental-distance items still mention work or your job, as in the official form.',
      },
      {
        q: 'Do I have to share my phone number to see results?',
        a: 'No. Checks run in your browser. Contact details are optional and only if you later choose follow-up.',
      },
    ],
    lastClinicalReview: null,
    clinicalReviewStatus: 'pending',
    clinicalReviewNotice:
      'Evidence summary based on official instrument sources and peer-reviewed literature. Clinical review pending.',
    reviewer: null,
    privacy: {
      browser:
        'Answers and in-progress drafts stay in this browser session (sessionStorage) unless you clear site data or close the session.',
      stored:
        'Serenest does not require an account or contact details to complete the Burnout Check or see results.',
      whyStored:
        'Optional contact is only collected if you later choose to save a summary for follow-up on a pathway that asks for it — not for this standalone check by default.',
      callback: 'Callback requests are opt-in only when that form is shown; never required to see education.',
      whatsapp:
        'WhatsApp is an optional contact channel for Serenest support. Messaging WhatsApp is separate from completing this check and is never required for results.',
      retention:
        'Session answers are not uploaded by the Burnout Check itself. See /privacy and /data-retention for company-wide policies.',
    },
  },
};

export function getCheckEvidence(toolIdOrSlug) {
  if (!toolIdOrSlug) return null;
  const direct = CHECK_EVIDENCE[toolIdOrSlug];
  if (direct) return direct;
  return (
    Object.values(CHECK_EVIDENCE).find(
      (e) => e.evidenceSlug === toolIdOrSlug || e.landingPath === `/${toolIdOrSlug}` || e.toolId === toolIdOrSlug,
    ) || null
  );
}

export function listCheckEvidence() {
  return Object.values(CHECK_EVIDENCE);
}

export function getLandingPathForTool(toolId) {
  return CHECK_EVIDENCE[toolId]?.landingPath || null;
}
