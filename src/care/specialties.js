/** Care specialties. Mental-health ids stay compatible with older bookings. */

export const SPECIALTY_GROUPS = [
  {
    id: 'mental-health',
    label: 'Mental health',
    specialties: [
      { id: 'psychiatrist', label: 'Psychiatrist' },
      { id: 'psychologist', label: 'Psychologist' },
      { id: 'therapist', label: 'Therapist' },
      { id: 'counsellor', label: 'Counsellor' },
    ],
  },
  {
    id: 'medicine',
    label: 'Medicine and surgery',
    specialties: [
      { id: 'general-physician', label: 'General physician' },
      { id: 'cardiologist', label: 'Cardiologist' },
      { id: 'dermatologist', label: 'Dermatologist' },
      { id: 'endocrinologist', label: 'Endocrinologist' },
      { id: 'gastroenterologist', label: 'Gastroenterologist' },
      { id: 'neurologist', label: 'Neurologist' },
      { id: 'pulmonologist', label: 'Pulmonologist' },
      { id: 'nephrologist', label: 'Nephrologist' },
      { id: 'rheumatologist', label: 'Rheumatologist' },
      { id: 'oncologist', label: 'Oncologist' },
      { id: 'paediatrician', label: 'Paediatrician' },
      { id: 'gynaecologist', label: 'Gynaecologist' },
      { id: 'ent', label: 'ENT specialist' },
      { id: 'ophthalmologist', label: 'Ophthalmologist' },
      { id: 'orthopaedic', label: 'Orthopaedic surgeon' },
      { id: 'urologist', label: 'Urologist' },
      { id: 'general-surgeon', label: 'General surgeon' },
      { id: 'dentist', label: 'Dentist' },
    ],
  },
];

export const SPECIALTIES = SPECIALTY_GROUPS.flatMap((group) => group.specialties);
const BY_ID = new Map(SPECIALTIES.map((item) => [item.id, item]));
export const SPECIALTY_IDS = SPECIALTIES.map((item) => item.id);

export function isSpecialty(id) {
  return BY_ID.has(String(id || ''));
}

export function specialtyLabel(id) {
  return BY_ID.get(String(id || ''))?.label || 'Specialist';
}
