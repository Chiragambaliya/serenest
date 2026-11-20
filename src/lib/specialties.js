/**
 * Care specialties Serenest can book. Mental-health roles keep their existing
 * ids. Medical specialties use the same practitioner_type field.
 * Care only — this list is clinical practice, not an academy catalog.
 */

export const SPECIALTY_GROUPS = [
  {
    id: 'mental-health',
    label: 'Mental health',
    specialties: [
      { id: 'psychiatrist', label: 'Psychiatrist', color: '#6f42c1', license: 'Medical council registration (NMC or state medical council).' },
      { id: 'psychologist', label: 'Psychologist', color: '#0d6efd', license: 'RCI registration or an equivalent psychology credential.' },
      { id: 'therapist', label: 'Therapist', color: '#198754', license: 'RCI or a recognised counselling-body registration.' },
      { id: 'counsellor', label: 'Counsellor', color: '#e67e22', license: 'RCI or a recognised counselling-body registration.' },
    ],
  },
  {
    id: 'medicine',
    label: 'Medicine and surgery',
    specialties: [
      { id: 'general-physician', label: 'General physician', color: '#0f766e', license: 'Medical council registration (NMC or state medical council).' },
      { id: 'cardiologist', label: 'Cardiologist', color: '#be123c', license: 'Medical council registration (NMC or state medical council).' },
      { id: 'dermatologist', label: 'Dermatologist', color: '#c026d3', license: 'Medical council registration (NMC or state medical council).' },
      { id: 'endocrinologist', label: 'Endocrinologist', color: '#a16207', license: 'Medical council registration (NMC or state medical council).' },
      { id: 'gastroenterologist', label: 'Gastroenterologist', color: '#b45309', license: 'Medical council registration (NMC or state medical council).' },
      { id: 'neurologist', label: 'Neurologist', color: '#4338ca', license: 'Medical council registration (NMC or state medical council).' },
      { id: 'pulmonologist', label: 'Pulmonologist', color: '#0369a1', license: 'Medical council registration (NMC or state medical council).' },
      { id: 'nephrologist', label: 'Nephrologist', color: '#0e7490', license: 'Medical council registration (NMC or state medical council).' },
      { id: 'rheumatologist', label: 'Rheumatologist', color: '#9a3412', license: 'Medical council registration (NMC or state medical council).' },
      { id: 'oncologist', label: 'Oncologist', color: '#7f1d1d', license: 'Medical council registration (NMC or state medical council).' },
      { id: 'paediatrician', label: 'Paediatrician', color: '#db2777', license: 'Medical council registration (NMC or state medical council).' },
      { id: 'gynaecologist', label: 'Gynaecologist', color: '#be185d', license: 'Medical council registration (NMC or state medical council).' },
      { id: 'ent', label: 'ENT specialist', color: '#047857', license: 'Medical council registration (NMC or state medical council).' },
      { id: 'ophthalmologist', label: 'Ophthalmologist', color: '#1d4ed8', license: 'Medical council registration (NMC or state medical council).' },
      { id: 'orthopaedic', label: 'Orthopaedic surgeon', color: '#44403c', license: 'Medical council registration (NMC or state medical council).' },
      { id: 'urologist', label: 'Urologist', color: '#155e75', license: 'Medical council registration (NMC or state medical council).' },
      { id: 'general-surgeon', label: 'General surgeon', color: '#3f6212', license: 'Medical council registration (NMC or state medical council).' },
      { id: 'dentist', label: 'Dentist', color: '#0f766e', license: 'Dental council registration.' },
    ],
  },
];

export const SPECIALTIES = SPECIALTY_GROUPS.flatMap((group) => group.specialties);

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
