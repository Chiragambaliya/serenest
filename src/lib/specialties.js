/**
 * Clinical branches a patient can request on Serenest.
 * Mental-health ids stay stable so existing bookings and screening handoff keep working.
 * Medical and surgical ids share the same practitioner_type field.
 */

const MEDICAL_LICENSE = 'Medical council registration (NMC or a state medical council).';
const COUNSELLING_LICENSE = 'RCI registration or a recognised counselling-body credential.';

function branch(entry) {
  return {
    license: MEDICAL_LICENSE,
    ...entry,
  };
}

export const SPECIALTY_GROUPS = [
  {
    id: 'mental-health',
    label: 'Mental health',
    blurb: 'Assessment, talking therapy, and medication follow-up from home.',
    specialties: [
      branch({
        id: 'psychiatrist',
        label: 'Psychiatrist',
        color: '#6f42c1',
        summary: 'Online psychiatry for mood, anxiety, sleep, ADHD, OCD, and medication review with a licensed psychiatrist.',
        online: [
          'A structured history and risk check',
          'Follow-up of an existing medicine plan',
          'A written plan after the session, when the clinician records one',
        ],
        inPerson: [
          'Emergencies, including active suicidal crisis',
          'Some first prescriptions that telemedicine rules keep for an in-person visit',
        ],
      }),
      branch({
        id: 'psychologist',
        label: 'Psychologist',
        color: '#0d6efd',
        license: 'RCI registration or an equivalent psychology credential.',
        summary: 'Online psychological assessment and therapy for stress, mood, anxiety, and behaviour change.',
        online: [
          'Therapy sessions over video, audio, or chat',
          'Discussion of screening scores such as PHQ-9 or GAD-7',
          'A plan for the next few sessions',
        ],
        inPerson: [
          'Testing that needs in-room materials or observation',
          'Situations that need a medical doctor, including most prescriptions',
        ],
      }),
      branch({
        id: 'therapist',
        label: 'Therapist',
        color: '#198754',
        license: COUNSELLING_LICENSE,
        summary: 'Structured talk therapy online for individuals, couples, and families.',
        online: [
          'Regular therapy appointments',
          'Coping skills for stress, relationships, and grief',
          'Follow-up between psychiatry visits',
        ],
        inPerson: [
          'Crisis care when someone is at immediate risk',
          'Work that needs a medical examination or a prescription',
        ],
      }),
      branch({
        id: 'counsellor',
        label: 'Counsellor',
        color: '#e67e22',
        license: COUNSELLING_LICENSE,
        summary: 'Confidential online counselling for everyday stress, relationships, and early mental-health concerns.',
        online: [
          'A first conversation when you are unsure where to start',
          'Support for work stress, family strain, and habit change',
          'Guidance on whether a psychiatrist or psychologist is the next step',
        ],
        inPerson: [
          'Emergencies',
          'Diagnosis and medication, which stay with a medical doctor',
        ],
      }),
    ],
  },
  {
    id: 'medicine',
    label: 'Medicine',
    blurb: 'History, report review, and follow-up with a physician. Hands-on examination stays in clinic.',
    specialties: [
      branch({
        id: 'general-physician',
        label: 'General physician',
        color: '#0f766e',
        summary: 'Online general-physician consults for new symptoms, report review, and follow-up of stable problems.',
        online: [
          'History of fever, pain, fatigue, or a new symptom',
          'Review of blood tests and discharge summaries',
          'Follow-up of a stable long-term condition',
        ],
        inPerson: [
          'Chest pain, severe breathlessness, or any emergency',
          'A physical examination, injection, or procedure',
        ],
      }),
      branch({
        id: 'cardiologist',
        label: 'Cardiologist',
        color: '#be123c',
        summary: 'Online cardiology opinion for blood pressure, cholesterol, ECG reports, and follow-up after a clinic visit.',
        online: [
          'Review of blood pressure logs, lipid reports, and ECGs you already have',
          'Follow-up of a stable heart plan',
          'Questions before or after a clinic visit',
        ],
        inPerson: [
          'Chest pain, fainting, or sudden breathlessness — use emergency care',
          'Echo, stress testing, and any procedure',
        ],
      }),
      branch({
        id: 'dermatologist',
        label: 'Dermatologist',
        color: '#c026d3',
        summary: 'Online dermatology for rashes, acne, hair loss, and follow-up, using photos you share during the consult.',
        online: [
          'History and photo review of a skin, hair, or nail concern',
          'Follow-up of acne, eczema, or a known skin condition',
          'Advice on whether a clinic visit is needed',
        ],
        inPerson: [
          'Biopsy, procedures, and lesions that cannot be judged on a photo',
          'Emergencies such as rapidly spreading infection',
        ],
      }),
      branch({
        id: 'endocrinologist',
        label: 'Endocrinologist',
        color: '#a16207',
        summary: 'Online endocrinology for diabetes, thyroid, and hormone follow-up using recent lab reports.',
        online: [
          'Review of sugar logs, HbA1c, and thyroid reports',
          'Follow-up of a stable hormone plan',
          'Questions about diet, monitoring, and when to retest',
        ],
        inPerson: [
          'Very high or very low sugars with illness — use urgent care',
          'Examination and tests that must be done in clinic',
        ],
      }),
      branch({
        id: 'gastroenterologist',
        label: 'Gastroenterologist',
        color: '#b45309',
        summary: 'Online gastroenterology for acidity, bowel changes, and follow-up of reports you already have.',
        online: [
          'History of acidity, bloating, or bowel habit change',
          'Review of ultrasound, endoscopy, or lab reports',
          'Follow-up after a clinic visit',
        ],
        inPerson: [
          'Vomiting blood, black stools, or severe abdominal pain — use emergency care',
          'Endoscopy and any procedure',
        ],
      }),
      branch({
        id: 'neurologist',
        label: 'Neurologist',
        color: '#4338ca',
        summary: 'Online neurology opinion for headache, seizure follow-up, and review of MRI or EEG reports.',
        online: [
          'History of headache, dizziness, or numbness',
          'Review of MRI, CT, or EEG reports you upload or describe',
          'Follow-up of a stable neurology plan',
        ],
        inPerson: [
          'Sudden weakness, seizure in progress, or stroke symptoms — use emergency care',
          'A hands-on neurological examination',
        ],
      }),
      branch({
        id: 'pulmonologist',
        label: 'Pulmonologist',
        color: '#0369a1',
        summary: 'Online pulmonology for cough, asthma follow-up, and review of chest imaging or spirometry.',
        online: [
          'History of cough, wheeze, or breathlessness that is not an emergency',
          'Review of X-ray, CT, or spirometry reports',
          'Follow-up of asthma or a stable lung plan',
        ],
        inPerson: [
          'Severe breathlessness, blue lips, or coughing blood — use emergency care',
          'Listening to the chest and any procedure',
        ],
      }),
      branch({
        id: 'nephrologist',
        label: 'Nephrologist',
        color: '#0e7490',
        summary: 'Online nephrology follow-up for kidney reports, blood pressure, and stable chronic kidney care.',
        online: [
          'Review of creatinine, urine, and ultrasound reports',
          'Follow-up of a stable kidney plan',
          'Questions about diet, fluids, and monitoring',
        ],
        inPerson: [
          'Sudden swelling, no urine, or severe illness — use urgent care',
          'Dialysis and procedures',
        ],
      }),
      branch({
        id: 'rheumatologist',
        label: 'Rheumatologist',
        color: '#9a3412',
        summary: 'Online rheumatology for joint pain history, report review, and follow-up of a known arthritis plan.',
        online: [
          'History of joint pain, stiffness, or swelling',
          'Review of blood tests and imaging you already have',
          'Follow-up of a stable arthritis or autoimmune plan',
        ],
        inPerson: [
          'A swollen joint that needs to be examined or aspirated',
          'Infusions and procedures',
        ],
      }),
      branch({
        id: 'oncologist',
        label: 'Oncologist',
        color: '#7f1d1d',
        summary: 'Online oncology opinion and follow-up to discuss reports, side effects, and the next clinic step.',
        online: [
          'Discussion of a pathology or imaging report you already have',
          'Follow-up of side effects between clinic visits',
          'Questions about the next test or appointment',
        ],
        inPerson: [
          'Starting chemotherapy, radiation, or surgery',
          'Emergencies such as fever during treatment — contact the treating team or emergency care',
        ],
      }),
      branch({
        id: 'paediatrician',
        label: 'Paediatrician',
        color: '#db2777',
        summary: 'Online paediatric consults for a child’s symptoms, growth questions, and follow-up with a parent present.',
        online: [
          'History from a parent or guardian, with the child present when possible',
          'Review of reports and vaccine questions',
          'Follow-up of a stable childhood condition',
        ],
        inPerson: [
          'A very young, lethargic, or breathing-difficulty child — use emergency care',
          'Examination, vaccines, and procedures',
        ],
      }),
      branch({
        id: 'gynaecologist',
        label: 'Gynaecologist',
        color: '#be185d',
        summary: 'Online gynaecology for menstrual concerns, report review, and follow-up. Examination stays in clinic.',
        online: [
          'History of period problems, discharge, or fertility questions',
          'Review of ultrasound and lab reports',
          'Follow-up of a plan already started in clinic',
        ],
        inPerson: [
          'Pregnancy bleeding, severe pain, or any emergency',
          'Internal examination, scans done in person, and procedures',
        ],
      }),
    ],
  },
  {
    id: 'surgery',
    label: 'Surgery and procedure care',
    blurb: 'Opinion and follow-up online. The operation or procedure itself happens in a clinic or hospital.',
    specialties: [
      branch({
        id: 'ent',
        label: 'ENT specialist',
        color: '#047857',
        summary: 'Online ENT opinion for ear, nose, and throat symptoms, and follow-up after a clinic visit.',
        online: [
          'History of ear pain, sinus trouble, sore throat, or hearing concerns',
          'Review of reports you already have',
          'Follow-up after an ENT visit',
        ],
        inPerson: [
          'Looking inside the ear, nose, or throat',
          'Procedures, and breathing difficulty — use emergency care',
        ],
      }),
      branch({
        id: 'ophthalmologist',
        label: 'Ophthalmologist',
        color: '#1d4ed8',
        summary: 'Online eye consults to discuss symptoms and reports. Vision testing and procedures stay in clinic.',
        online: [
          'History of redness, irritation, or a change you can describe',
          'Review of a prescription or report from a recent eye exam',
          'Advice on whether you need an in-person eye test',
        ],
        inPerson: [
          'Sudden vision loss, injury, or severe eye pain — use emergency care',
          'Vision testing, dilation, and any procedure',
        ],
      }),
      branch({
        id: 'orthopaedic',
        label: 'Orthopaedic surgeon',
        color: '#44403c',
        summary: 'Online orthopaedic opinion for joint and back pain, X-ray review, and follow-up after injury care.',
        online: [
          'History of joint, back, or sports pain',
          'Review of X-rays or MRI reports you already have',
          'Follow-up of a stable recovery plan',
        ],
        inPerson: [
          'A new fracture, open wound, or limb that you cannot feel or move — use emergency care',
          'Casting, injections, and surgery',
        ],
      }),
      branch({
        id: 'urologist',
        label: 'Urologist',
        color: '#155e75',
        summary: 'Online urology for urinary symptoms, report review, and follow-up. Examination stays in clinic.',
        online: [
          'History of burning, frequency, or kidney-stone symptoms that are not an emergency',
          'Review of urine tests and ultrasound reports',
          'Follow-up after a urology visit',
        ],
        inPerson: [
          'Inability to pass urine, heavy bleeding, or severe pain — use emergency care',
          'Examination and procedures',
        ],
      }),
      branch({
        id: 'general-surgeon',
        label: 'General surgeon',
        color: '#3f6212',
        summary: 'Online surgical opinion to discuss a lump, a report, or recovery after an operation.',
        online: [
          'History and report review before you decide on a clinic visit',
          'Questions about recovery after surgery',
          'A clear recommendation on what must be seen in person',
        ],
        inPerson: [
          'Severe abdominal pain, vomiting blood, or a hard acute abdomen — use emergency care',
          'The operation and any wound procedure',
        ],
      }),
      branch({
        id: 'dentist',
        label: 'Dentist',
        color: '#0f766e',
        license: 'Dental council registration.',
        summary: 'Online dental opinion for tooth pain advice and follow-up. Drilling, extraction, and X-rays stay in clinic.',
        online: [
          'Advice on tooth pain, swelling, or a broken tooth until you can reach a clinic',
          'Review of a photo or a dental report you already have',
          'Follow-up questions after a dental visit',
        ],
        inPerson: [
          'Swelling with fever, or bleeding that will not stop — use urgent care',
          'Fillings, extraction, cleaning, and dental X-rays',
        ],
      }),
    ],
  },
];

export const SPECIALTIES = SPECIALTY_GROUPS.flatMap((group) =>
  group.specialties.map((specialty) => ({ ...specialty, groupId: group.id, groupLabel: group.label })),
);

const BY_ID = new Map(SPECIALTIES.map((specialty) => [specialty.id, specialty]));

export const SPECIALTY_IDS = SPECIALTIES.map((specialty) => specialty.id);

export function isSpecialty(id) {
  return BY_ID.has(String(id || ''));
}

export function specialtyById(id) {
  return BY_ID.get(String(id || '')) || null;
}

export function specialtyLabel(id) {
  return specialtyById(id)?.label || 'Specialist';
}

export function specialtyColor(id) {
  return specialtyById(id)?.color || '#0f766e';
}

export function specialtyLicenseHint(id) {
  return specialtyById(id)?.license || 'A current professional registration for this specialty.';
}

export function specialtyPath(id) {
  return `/specialties/${id}`;
}
