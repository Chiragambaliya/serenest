/**
 * Clinical specialties covered by Serenest learning content.
 *
 * `groups` is the display order of drug groups within the specialty on the
 * Drug Guides index. A specialty appears as "live" on /learn as soon as at
 * least one drug guide is tagged with its slug.
 *
 * @typedef {{ slug: string; name: string; groups?: string[] }} Specialty
 */

/** @type {Specialty[]} */
export const SPECIALTIES = [
  { slug: 'psychiatry', name: 'Psychiatry', groups: ['Antidepressants', 'Antipsychotics', 'Mood stabilisers', 'Anxiolytics & hypnotics'] },
  { slug: 'general-medicine', name: 'General Medicine' },
  { slug: 'cardiology', name: 'Cardiology' },
  { slug: 'endocrinology', name: 'Endocrinology & Diabetes' },
  { slug: 'neurology', name: 'Neurology' },
  { slug: 'pulmonology', name: 'Pulmonology' },
  { slug: 'gastroenterology', name: 'Gastroenterology & Hepatology' },
  { slug: 'nephrology', name: 'Nephrology' },
  { slug: 'infectious-diseases', name: 'Infectious Diseases' },
  { slug: 'rheumatology', name: 'Rheumatology' },
  { slug: 'dermatology', name: 'Dermatology' },
  { slug: 'obstetrics-gynaecology', name: 'Obstetrics & Gynaecology' },
  { slug: 'paediatrics', name: 'Paediatrics' },
  { slug: 'oncology', name: 'Oncology' },
  { slug: 'haematology', name: 'Haematology' },
  { slug: 'urology', name: 'Urology' },
  { slug: 'orthopaedics', name: 'Orthopaedics' },
  { slug: 'ent', name: 'ENT' },
  { slug: 'ophthalmology', name: 'Ophthalmology' },
  { slug: 'general-surgery', name: 'General Surgery' },
  { slug: 'anaesthesiology', name: 'Anaesthesiology & Pain' },
  { slug: 'emergency-medicine', name: 'Emergency Medicine' },
];

export function getSpecialty(slug) {
  return SPECIALTIES.find((s) => s.slug === slug) || null;
}
