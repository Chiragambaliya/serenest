/**
 * Mental Health Check evidence registry.
 * Every live check must have an entry — Evidence Center + result pages read from here.
 * Clinical claims must cite published sources; never invent. Where a licensing or
 * permission status could not be independently verified, say so explicitly
 * (licensingStatus + permissionVerified: false) instead of guessing.
 */

/** @typedef {{ statement: string; source: string; url?: string }} EvidenceClaim */

/** Shown on every evidence surface until a formal clinical review is recorded. */
export const PENDING_REVIEW_NOTICE =
  'Evidence summary prepared from published and official instrument sources. Formal Serenest clinical review pending.';

/** @type {Record<string, object>} */
export const CHECK_EVIDENCE = {
  phq9: {
    toolId: 'phq9',
    evidenceSlug: 'phq-9',
    productTitle: 'Depression Check',
    officialName: 'Patient Health Questionnaire-9 (PHQ-9)',
    authors: 'Kurt Kroenke, Robert L. Spitzer, Janet B. W. Williams (PHQ developed with an educational grant from Pfizer Inc.)',
    year: 2001,
    primaryPaper: {
      citation:
        'Kroenke, K., Spitzer, R. L., & Williams, J. B. W. (2001). The PHQ-9: validity of a brief depression severity measure. Journal of General Internal Medicine, 16(9), 606–613.',
      doi: '10.1046/j.1525-1497.2001.016009606.x',
      url: 'https://doi.org/10.1046/j.1525-1497.2001.016009606.x',
    },
    licensingStatus:
      'The PHQ family of measures is free to use; per the official PHQ screener materials, no permission is required to reproduce, translate, display, or distribute.',
    permissionRequired: false,
    permissionVerified: true,
    wordingStatus: 'exact',
    scoringMethod:
      'Sum of 9 items, each scored 0 (Not at all) to 3 (Nearly every day). Total range 0–27.',
    thresholdSource:
      'Severity bands 0–4 minimal, 5–9 mild, 10–14 moderate, 15–19 moderately severe, 20–27 severe (Kroenke et al., 2001).',
    ageGroup: 'Adults (18+). A separate adolescent adaptation (PHQ-A) exists and is not used here.',
    indianNorms:
      'No India-specific norms are used; severity bands come from international primary-care samples. PHQ-9 has been used in Indian studies, but Serenest has not adopted India-specific cut-offs.',
    limitations: [
      'A screening and severity-tracking tool, not a diagnostic test — diagnosis requires clinical interview.',
      'Somatic items (sleep, energy, appetite) can be elevated by physical illness.',
      'Item 9 flags self-harm thoughts but does not assess risk; any positive answer needs human follow-up.',
      'A low score does not rule out depression or other mental-health concerns.',
    ],
    whyNotDiagnosis:
      'The PHQ-9 screens for symptoms of depression; only a qualified clinician can diagnose depression after a full clinical evaluation.',
    lastClinicalReview: null,
    reviewer: null,
    clinicalReviewStatus: 'pending',
    clinicalReviewNotice: PENDING_REVIEW_NOTICE,
  },

  gad7: {
    toolId: 'gad7',
    evidenceSlug: 'gad-7',
    productTitle: 'Anxiety Check',
    officialName: 'Generalized Anxiety Disorder 7-item scale (GAD-7)',
    authors: 'Robert L. Spitzer, Kurt Kroenke, Janet B. W. Williams, Bernd Löwe (developed with an educational grant from Pfizer Inc.)',
    year: 2006,
    primaryPaper: {
      citation:
        'Spitzer, R. L., Kroenke, K., Williams, J. B. W., & Löwe, B. (2006). A brief measure for assessing generalized anxiety disorder: the GAD-7. Archives of Internal Medicine, 166(10), 1092–1097.',
      doi: '10.1001/archinte.166.10.1092',
      url: 'https://doi.org/10.1001/archinte.166.10.1092',
    },
    licensingStatus:
      'Free to use; per the official PHQ/GAD screener materials, no permission is required to reproduce, translate, display, or distribute.',
    permissionRequired: false,
    permissionVerified: true,
    wordingStatus: 'exact',
    scoringMethod:
      'Sum of 7 items, each scored 0 (Not at all) to 3 (Nearly every day). Total range 0–21.',
    thresholdSource:
      'Severity bands 0–4 minimal, 5–9 mild, 10–14 moderate, 15–21 severe (Spitzer et al., 2006).',
    ageGroup: 'Adults (18+).',
    indianNorms:
      'No India-specific norms are used; bands come from international primary-care samples.',
    limitations: [
      'Screens for generalized anxiety symptoms; less sensitive to panic, social anxiety, OCD, or PTSD presentations.',
      'A low score does not rule out an anxiety disorder or other concerns.',
      'Diagnosis requires a structured clinical assessment.',
    ],
    whyNotDiagnosis:
      'The GAD-7 estimates anxiety symptom severity; it cannot distinguish anxiety disorders from each other or from medical causes. Only a clinician can diagnose.',
    lastClinicalReview: null,
    reviewer: null,
    clinicalReviewStatus: 'pending',
    clinicalReviewNotice: PENDING_REVIEW_NOTICE,
  },

  who5: {
    toolId: 'who5',
    evidenceSlug: 'who-5',
    productTitle: 'Wellbeing Check',
    officialName: 'WHO-5 Well-Being Index (1998 version)',
    authors: 'World Health Organization Regional Office for Europe; maintained by the Psychiatric Research Unit, Mental Health Centre North Zealand, Denmark',
    year: 1998,
    primaryPaper: {
      citation:
        'Topp, C. W., Østergaard, S. D., Søndergaard, S., & Bech, P. (2015). The WHO-5 Well-Being Index: a systematic review of the literature. Psychotherapy and Psychosomatics, 84(3), 167–176.',
      doi: '10.1159/000376585',
      url: 'https://doi.org/10.1159/000376585',
    },
    licensingStatus:
      'Free to use. Per the official WHO-5 distribution materials, the questionnaire may be used without permission provided the source is acknowledged.',
    permissionRequired: false,
    permissionVerified: true,
    wordingStatus: 'exact',
    scoringMethod:
      'Sum of 5 items, each scored 0 (At no time) to 5 (All of the time); raw 0–25 multiplied by 4 to give a 0–100 percentage score. Higher is better.',
    thresholdSource:
      'A score of ≤ 50 suggests reduced wellbeing and ≤ 28 suggests possible depression, warranting further assessment (Topp et al., 2015). Serenest bands follow these published guides.',
    ageGroup: 'Adults; the WHO-5 has also been used in research with adolescents aged 9+.',
    indianNorms: 'No India-specific norms are used.',
    limitations: [
      'A wellbeing measure, not a depression scale — low scores are a prompt for further assessment, not a diagnosis.',
      'Five items cannot capture the full picture of mental health.',
      'A high score does not rule out difficulties in areas the scale does not cover.',
    ],
    whyNotDiagnosis:
      'WHO-5 measures subjective wellbeing over two weeks. Low wellbeing can accompany many conditions or none; only clinical assessment can determine what it means.',
    lastClinicalReview: null,
    reviewer: null,
    clinicalReviewStatus: 'pending',
    clinicalReviewNotice: PENDING_REVIEW_NOTICE,
  },

  auditc: {
    toolId: 'auditc',
    evidenceSlug: 'audit-c',
    productTitle: 'Alcohol Use Check',
    officialName: 'Alcohol Use Disorders Identification Test — Consumption (AUDIT-C), derived from the WHO AUDIT',
    authors: 'AUDIT: World Health Organization (Babor et al.). AUDIT-C: Kristen Bush et al., Ambulatory Care Quality Improvement Project (ACQUIP).',
    year: 1998,
    primaryPaper: {
      citation:
        'Bush, K., Kivlahan, D. R., McDonell, M. B., Fihn, S. D., & Bradley, K. A. (1998). The AUDIT alcohol consumption questions (AUDIT-C): an effective brief screening test for problem drinking. Archives of Internal Medicine, 158(16), 1789–1795.',
      doi: '10.1001/archinte.158.16.1789',
      url: 'https://doi.org/10.1001/archinte.158.16.1789',
    },
    licensingStatus:
      'The WHO AUDIT is distributed by WHO for screening use, and the three AUDIT-C items are reproduced widely in public health practice. Serenest has not independently verified a formal WHO permission statement for commercial public-web reproduction — flagged for review.',
    permissionRequired: false,
    permissionVerified: false,
    wordingStatus: 'exact',
    scoringMethod:
      'Sum of 3 items, each scored 0–4. Total range 0–12.',
    thresholdSource:
      'Commonly used screening thresholds: ≥ 4 for men and ≥ 3 for women suggests hazardous drinking (Bush et al., 1998; US VA guidance). Serenest bands are a plain-language presentation of these published guides.',
    ageGroup: 'Adults (18+).',
    indianNorms:
      'No India-specific norms are used. Standard-drink sizes differ by country; the note below the check approximates an Indian standard measure.',
    limitations: [
      'Screens consumption patterns only; it does not assess dependence, withdrawal, or harm.',
      'Self-reported drinking is often under-estimated.',
      'Thresholds differ by sex and population; a single banding cannot capture that fully.',
    ],
    whyNotDiagnosis:
      'AUDIT-C flags potentially risky drinking patterns. Diagnosis of an alcohol use disorder requires clinical assessment.',
    lastClinicalReview: null,
    reviewer: null,
    clinicalReviewStatus: 'pending',
    clinicalReviewNotice: PENDING_REVIEW_NOTICE,
  },

  asrs: {
    toolId: 'asrs',
    evidenceSlug: 'asrs-v1-1',
    productTitle: 'Adult ADHD Screen',
    officialName: 'Adult ADHD Self-Report Scale (ASRS-v1.1) Symptom Checklist — Part A (6-item screener)',
    authors:
      'Developed with the World Health Organization and the Workgroup on Adult ADHD (Ronald C. Kessler, Lenard Adler, and colleagues).',
    year: 2005,
    primaryPaper: {
      citation:
        'Kessler, R. C., Adler, L., Ames, M., Demler, O., Faraone, S., Hiripi, E., Howes, M. J., Jin, R., Secnik, K., Spencer, T., Ustun, T. B., & Walters, E. E. (2005). The World Health Organization Adult ADHD Self-Report Scale (ASRS): a short screening scale for use in the general population. Psychological Medicine, 35(2), 245–256.',
      doi: '10.1017/S0033291704002892',
      url: 'https://doi.org/10.1017/S0033291704002892',
    },
    copyrightNotice:
      '© World Health Organization. The ASRS-v1.1 Symptom Checklist is reproduced without modification of the official question wording or scoring thresholds.',
    licensingStatus:
      'The ASRS-v1.1 Symptom Checklist is copyrighted by the World Health Organization and distributed free of charge for clinical and research screening use. Serenest has not independently verified permission for commercial public-web reproduction — flagged for review.',
    permissionRequired: null,
    permissionVerified: false,
    wordingStatus: 'exact',
    scoringMethod:
      'Part A: 6 items rated Never / Rarely / Sometimes / Often / Very often. Each item has an official shaded-response threshold; the screen is positive when 4 or more of the 6 responses fall in the shaded range.',
    thresholdSource:
      'Official ASRS-v1.1 Part A shaded-box scoring (Kessler et al., 2005; WHO ASRS-v1.1 Symptom Checklist instructions).',
    ageGroup: 'Adults aged 18 years and above.',
    indianNorms: 'No India-specific norms are used.',
    limitations: [
      'A positive screen is not an ADHD diagnosis.',
      'A full assessment should consider childhood history, daily functioning, sleep, anxiety, mood, substance use and other possible explanations.',
      'Part A alone is a screener; the full ASRS Symptom Checklist has 18 items.',
    ],
    whyNotDiagnosis:
      'ADHD diagnosis requires a structured clinical assessment including developmental history; a six-question screen cannot establish it.',
    lastClinicalReview: null,
    reviewer: null,
    clinicalReviewStatus: 'pending',
    clinicalReviewNotice: PENDING_REVIEW_NOTICE,
  },

  k10: {
    toolId: 'k10',
    evidenceSlug: 'k10',
    productTitle: 'Psychological Distress Check',
    officialName: 'Kessler Psychological Distress Scale (K10)',
    authors: 'Ronald C. Kessler and colleagues',
    year: 2002,
    primaryPaper: {
      citation:
        'Kessler, R. C., Andrews, G., Colpe, L. J., Hiripi, E., Mroczek, D. K., Normand, S.-L. T., Walters, E. E., & Zaslavsky, A. M. (2002). Short screening scales to monitor population prevalences and trends in non-specific psychological distress. Psychological Medicine, 32(6), 959–976.',
      doi: '10.1017/S0033291702006074',
      url: 'https://doi.org/10.1017/S0033291702006074',
    },
    licensingStatus:
      'The K10 is distributed free of charge and is widely reproduced in population health surveys. Serenest has not independently verified a formal permission statement for commercial public-web reproduction — flagged for review.',
    permissionRequired: null,
    permissionVerified: false,
    wordingStatus: 'exact',
    scoringMethod:
      'Sum of 10 items, each scored 1 (None of the time) to 5 (All of the time). Total range 10–50.',
    thresholdSource:
      'Bands 10–19, 20–24, 25–29, 30–50 follow the commonly used Australian (Andrews & Slade, 2001; Victorian Population Health Survey) K10 groupings. Multiple scoring conventions exist for the K10.',
    ageGroup: 'Adults (18+).',
    indianNorms: 'No India-specific norms are used; bands come from Australian population survey conventions.',
    limitations: [
      'Measures non-specific distress; it cannot say which condition, if any, is present.',
      'Several banding conventions exist; the one used here is a common but not universal choice.',
      'A low score does not rule out a mental-health concern.',
    ],
    whyNotDiagnosis:
      'K10 measures overall distress in the past 30 days. Distress can come from many sources; only clinical assessment can determine cause and diagnosis.',
    lastClinicalReview: null,
    reviewer: null,
    clinicalReviewStatus: 'pending',
    clinicalReviewNotice: PENDING_REVIEW_NOTICE,
  },

  pcl5: {
    toolId: 'pcl5',
    evidenceSlug: 'pcl-5',
    productTitle: 'Post-Traumatic Stress Check',
    officialName: 'PTSD Checklist for DSM-5 (PCL-5), standard 20-item version without Criterion A assessment',
    authors:
      'Frank W. Weathers, Brett T. Litz, Terence M. Keane, Patrick A. Palmieri, Brian P. Marx, Paula P. Schnurr — U.S. National Center for PTSD',
    year: 2013,
    primaryPaper: {
      citation:
        'Weathers, F. W., Litz, B. T., Keane, T. M., Palmieri, P. A., Marx, B. P., & Schnurr, P. P. (2013). The PTSD Checklist for DSM-5 (PCL-5). U.S. National Center for PTSD. Blevins, C. A., et al. (2015). The Posttraumatic Stress Disorder Checklist for DSM-5 (PCL-5): development and initial psychometric evaluation. Journal of Traumatic Stress, 28(6), 489–498.',
      doi: '10.1002/jts.22059',
      url: 'https://doi.org/10.1002/jts.22059',
    },
    licensingStatus:
      'Developed by staff of the U.S. National Center for PTSD; available free of charge from ptsd.va.gov and in the public domain as a U.S. government work.',
    permissionRequired: false,
    permissionVerified: true,
    wordingStatus: 'exact',
    scoringMethod:
      'Sum of 20 items, each scored 0 (Not at all) to 4 (Extremely). Total range 0–80.',
    thresholdSource:
      'The U.S. National Center for PTSD notes that scores in the 31–33 range or higher suggest probable PTSD and that optimal cut-points vary by population and setting. This page uses 31+ as a provisional screening threshold.',
    ageGroup: 'Adults (18+).',
    indianNorms:
      'No India-specific norms are used; cut-point research comes mainly from U.S. veteran and civilian samples.',
    limitations: [
      'A structured clinical interview is required for diagnosis. The most suitable threshold may vary according to the population and purpose of screening.',
      'This page does not assess Criterion A (the nature of the traumatic event), which the DSM-5 diagnosis requires.',
      'Symptoms overlap with depression, anxiety, and other conditions.',
    ],
    whyNotDiagnosis:
      'A score above a screening threshold indicates symptom burden, not PTSD. Diagnosis requires a trauma-informed structured clinical interview.',
    lastClinicalReview: null,
    reviewer: null,
    clinicalReviewStatus: 'pending',
    clinicalReviewNotice: PENDING_REVIEW_NOTICE,
  },

  scoff: {
    toolId: 'scoff',
    evidenceSlug: 'scoff',
    productTitle: 'Eating Patterns Check',
    officialName: 'SCOFF questionnaire (5 items)',
    authors: 'John F. Morgan, Fiona Reid, J. Hubert Lacey (St George’s Hospital Medical School, London)',
    year: 1999,
    primaryPaper: {
      citation:
        'Morgan, J. F., Reid, F., & Lacey, J. H. (1999). The SCOFF questionnaire: assessment of a new screening tool for eating disorders. BMJ, 319(7223), 1467–1468.',
      doi: '10.1136/bmj.319.7223.1467',
      url: 'https://doi.org/10.1136/bmj.319.7223.1467',
    },
    licensingStatus:
      'Published in the BMJ and widely reproduced in clinical screening practice. Serenest has not independently verified a formal permission statement for commercial public-web reproduction — flagged for review.',
    permissionRequired: null,
    permissionVerified: false,
    wordingStatus: 'adapted',
    wordingNotes:
      'Items follow the published SCOFF; the weight-loss item uses a metric approximation ("more than 6 kg in a three-month period") of the original "one stone" wording.',
    scoringMethod:
      'Five yes/no items; each "yes" scores 1 point. Total range 0–5.',
    thresholdSource:
      'Two or more "yes" answers indicate a positive screen warranting further assessment (Morgan, Reid & Lacey, 1999). The original UK item references "one stone" (6.35 kg); this page uses the common metric adaptation of more than 6 kg.',
    ageGroup: 'Adults; also studied in older adolescents.',
    indianNorms: 'No India-specific norms are used.',
    limitations: [
      'A brief screen — it cannot distinguish between eating disorders or assess severity.',
      'The weight-loss item uses a metric approximation of the original "one stone" wording.',
      'A negative screen does not rule out an eating concern.',
    ],
    whyNotDiagnosis:
      'SCOFF flags possible eating-disorder patterns. Diagnosis requires specialist clinical assessment.',
    lastClinicalReview: null,
    reviewer: null,
    clinicalReviewStatus: 'pending',
    clinicalReviewNotice: PENDING_REVIEW_NOTICE,
  },

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
    permissionVerified: true,
    thresholdSource:
      'Pooled BAT-12 cut-offs — at risk ≥ 2.54, higher/severe-risk flag ≥ 2.96 — from Schaufeli et al. (2023), Scandinavian Journal of Work, Environment & Health.',
    ageGroup: 'Working-age adults (18+).',
    indianNorms:
      'No India-specific norms are available; cut-offs come from employed samples in the Netherlands, Flanders, and Finland.',
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
    clinicalReviewNotice: PENDING_REVIEW_NOTICE,
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
