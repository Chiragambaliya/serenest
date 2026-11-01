/**
 * Clinical specialties offered by Serenest — the single source for specialty
 * pages (/specialties), booking, doctor onboarding and Learn.
 *
 * - `groups`: display order of drug groups on the Drug Guides index.
 * - `summary` / `conditions`: patient-facing copy on /specialties/:slug.
 * - `practitioners`: who a patient can book within the specialty. Specialties
 *   without their own list use DEFAULT_PRACTITIONERS (a specialist doctor).
 * - `servicePages`: existing detailed service pages to link from the specialty page.
 *
 * Online consultations suit follow-up, review of reports, second opinions and
 * many first visits; every specialty page says when an in-person visit is needed.
 *
 * @typedef {{ id: string; label: string; council?: string }} Practitioner
 * @typedef {{
 *   slug: string;
 *   name: string;
 *   summary: string;
 *   conditions: string[];
 *   groups?: string[];
 *   practitioners?: Practitioner[];
 *   servicePages?: { to: string; label: string }[];
 * }} Specialty
 */

export const DEFAULT_PRACTITIONERS = [
  { id: 'doctor', label: 'Specialist doctor', council: 'NMC or State Medical Council registration number.' },
];

/** @type {Specialty[]} */
export const SPECIALTIES = [
  {
    slug: 'psychiatry',
    name: 'Psychiatry & Mental Health',
    summary: 'Assessment, medication and therapy for mental health conditions, from psychiatrists, psychologists and counsellors.',
    conditions: ['Depression', 'Anxiety and panic', 'Bipolar disorder', 'OCD', 'Adult ADHD', 'Sleep problems', 'Alcohol and substance use', 'Stress and burnout'],
    groups: ['Antidepressants', 'Antipsychotics', 'Mood stabilisers', 'Anxiolytics & hypnotics'],
    practitioners: [
      { id: 'psychiatrist', label: 'Psychiatrist', council: 'NMC or State Medical Council registration number.' },
      { id: 'psychologist', label: 'Psychologist', council: 'RCI registration or equivalent.' },
      { id: 'therapist', label: 'Therapist', council: 'RCI or recognised counselling body registration.' },
      { id: 'counsellor', label: 'Counsellor', council: 'RCI or recognised counselling body registration.' },
    ],
    servicePages: [
      { to: '/services/psychiatry', label: 'Psychiatry' },
      { to: '/services/therapy', label: 'Therapy & counselling' },
      { to: '/services/addiction-care', label: 'Addiction care' },
    ],
  },
  {
    slug: 'general-medicine',
    name: 'General Medicine',
    summary: 'A physician for everyday illness, long-term conditions and knowing what to do next.',
    conditions: ['Fever and infections', 'High blood pressure', 'Diabetes follow-up', 'Thyroid problems', 'Fatigue and weakness', 'Review of blood reports'],
  },
  {
    slug: 'cardiology',
    name: 'Cardiology',
    summary: 'Heart and blood-pressure care, including review of ECGs, echo reports and medicines.',
    conditions: ['High blood pressure', 'Chest discomfort (non-emergency)', 'Palpitations', 'High cholesterol', 'Heart failure follow-up', 'After angioplasty or bypass'],
  },
  {
    slug: 'endocrinology',
    name: 'Endocrinology & Diabetes',
    summary: 'Diabetes, thyroid and hormone conditions, with medicine and lifestyle plans.',
    conditions: ['Type 1 and type 2 diabetes', 'Thyroid disorders', 'PCOS', 'Obesity and weight management', 'Osteoporosis', 'Adrenal and pituitary disorders'],
  },
  {
    slug: 'neurology',
    name: 'Neurology',
    summary: 'Conditions of the brain, nerves and muscles.',
    conditions: ['Headache and migraine', 'Epilepsy', 'Stroke follow-up', "Parkinson's disease", 'Numbness and tingling', 'Memory problems'],
  },
  {
    slug: 'pulmonology',
    name: 'Pulmonology',
    summary: 'Breathing, lung and sleep-related breathing conditions.',
    conditions: ['Asthma', 'COPD', 'Chronic cough', 'Post-TB lung problems', 'Sleep apnoea', 'Review of chest X-rays and lung tests'],
  },
  {
    slug: 'gastroenterology',
    name: 'Gastroenterology & Hepatology',
    summary: 'Digestive and liver conditions.',
    conditions: ['Acidity and GERD', 'Irritable bowel syndrome', 'Constipation and diarrhoea', 'Fatty liver', 'Hepatitis B and C', 'Review of endoscopy reports'],
  },
  {
    slug: 'nephrology',
    name: 'Nephrology',
    summary: 'Kidney health, from early disease to dialysis and transplant follow-up.',
    conditions: ['Chronic kidney disease', 'Kidney stones (medical care)', 'Protein in urine', 'High blood pressure with kidney disease', 'Dialysis follow-up', 'Transplant follow-up'],
  },
  {
    slug: 'infectious-diseases',
    name: 'Infectious Diseases',
    summary: 'Complex or recurring infections and travel-related illness.',
    conditions: ['Recurrent infections', 'Tuberculosis', 'HIV care', 'Prolonged fever', 'Travel medicine', 'Antibiotic advice'],
  },
  {
    slug: 'rheumatology',
    name: 'Rheumatology',
    summary: 'Joint, muscle and autoimmune conditions.',
    conditions: ['Rheumatoid arthritis', 'Gout', 'Lupus', 'Ankylosing spondylitis', 'Osteoarthritis', 'Fibromyalgia'],
  },
  {
    slug: 'dermatology',
    name: 'Dermatology',
    summary: 'Skin, hair and nail conditions — well suited to video and photo consultations.',
    conditions: ['Acne', 'Eczema and dermatitis', 'Psoriasis', 'Fungal infections', 'Hair loss', 'Pigmentation'],
  },
  {
    slug: 'obstetrics-gynaecology',
    name: 'Obstetrics & Gynaecology',
    summary: "Women's health, pregnancy planning and pregnancy follow-up.",
    conditions: ['Irregular periods', 'PCOS', 'Pregnancy planning', 'Antenatal follow-up', 'Menopause', 'Contraception'],
  },
  {
    slug: 'paediatrics',
    name: 'Paediatrics',
    summary: 'Care for babies, children and adolescents, and guidance for parents.',
    conditions: ['Fever and common illness', 'Growth and nutrition', 'Vaccination advice', 'Allergies', 'Developmental concerns', 'Behaviour and sleep'],
  },
  {
    slug: 'oncology',
    name: 'Oncology',
    summary: 'Cancer care opinions, treatment planning and follow-up.',
    conditions: ['Second opinions', 'Treatment planning', 'Managing side effects of treatment', 'Follow-up after treatment', 'Screening advice', 'Palliative care support'],
  },
  {
    slug: 'haematology',
    name: 'Haematology',
    summary: 'Blood disorders and abnormal blood counts.',
    conditions: ['Anaemia', 'Low platelets', 'Thalassaemia', 'Clotting disorders', 'Abnormal blood counts', 'Blood thinner management'],
  },
  {
    slug: 'urology',
    name: 'Urology',
    summary: 'Kidney, bladder and prostate conditions, and male reproductive health.',
    conditions: ['Urinary symptoms', 'Prostate enlargement', 'Kidney stones', 'Recurrent urinary infections', 'Erectile dysfunction', 'Male infertility'],
  },
  {
    slug: 'orthopaedics',
    name: 'Orthopaedics',
    summary: 'Bone, joint and spine problems, and recovery after injury or surgery.',
    conditions: ['Back and neck pain', 'Knee and joint pain', 'Sports injuries', 'Fracture follow-up', 'Frozen shoulder', 'Review of X-rays and MRI'],
  },
  {
    slug: 'ent',
    name: 'ENT',
    summary: 'Ear, nose and throat conditions.',
    conditions: ['Sinusitis', 'Ear pain and discharge', 'Hearing loss', 'Tinnitus', 'Sore throat and tonsils', 'Vertigo'],
  },
  {
    slug: 'ophthalmology',
    name: 'Ophthalmology',
    summary: 'Eye conditions and vision concerns.',
    conditions: ['Red or irritated eyes', 'Dry eyes', 'Diabetic eye check advice', 'Glaucoma follow-up', 'Cataract advice', 'Vision changes'],
  },
  {
    slug: 'general-surgery',
    name: 'General Surgery',
    summary: 'Surgical opinions and care before and after an operation.',
    conditions: ['Hernia', 'Gallstones', 'Piles and fissures', 'Lumps and swellings', 'Second opinion before surgery', 'Post-operative follow-up'],
  },
  {
    slug: 'anaesthesiology',
    name: 'Anaesthesiology & Pain',
    summary: 'Long-term pain management and pre-operative advice.',
    conditions: ['Chronic back pain', 'Nerve pain', 'Cancer pain', 'Headache syndromes', 'Pre-surgery fitness advice', 'Pain medicine review'],
  },
  {
    slug: 'emergency-medicine',
    name: 'Emergency Medicine',
    summary: 'Urgent advice on whether you need to go to hospital — not a replacement for emergency care.',
    conditions: ['Minor injuries', 'Burns and wounds advice', 'Fever in adults', 'Allergic reactions (mild)', 'Deciding whether to go to hospital', 'Follow-up after an emergency visit'],
  },
];

export function getSpecialty(slug) {
  return SPECIALTIES.find((s) => s.slug === slug) || null;
}

export function practitionersFor(slug) {
  const sp = getSpecialty(slug);
  return (sp && sp.practitioners) || DEFAULT_PRACTITIONERS;
}

/** Every bookable practitioner id across specialties (used for validation). */
export const ALL_PRACTITIONER_IDS = [
  ...new Set(SPECIALTIES.flatMap((s) => (s.practitioners || DEFAULT_PRACTITIONERS).map((p) => p.id))),
];

export function specialtyPath(slug) {
  return `/specialties/${slug}`;
}
