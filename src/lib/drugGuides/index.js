/**
 * Serenest Drug Guides — clinician-facing psychopharmacology reference.
 *
 * One file per drug. Content is original, written from primary sources
 * (prescribing information, trials, guidelines) with an Indian practice layer.
 *
 * `reviewed: false` keeps a guide visible with a "pending clinical review"
 * banner and out of search engines (noindex, not in the sitemap). Flip it to
 * `true` once a psychiatrist has signed the content off.
 *
 * @typedef {'approved' | 'regional' | 'offlabel' | 'notrecommended'} IndicationStatus
 *
 * @typedef {{
 *   name: string;
 *   status: IndicationStatus;
 *   detail?: string;
 *   dosing?: string[];
 * }} DrugIndication
 *
 * @typedef {{
 *   slug: string;
 *   name: string;
 *   drugClass: string;
 *   group: string;
 *   reviewed: boolean;
 *   updated: string;
 *   nutshell: string;
 *   pros: string[];
 *   cons: string[];
 *   whenToUse: string[];
 *   preferAlternatives: string[];
 *   pharmacodynamics: string[];
 *   pharmacokinetics: [string, string][];
 *   interactions: string[];
 *   indications: DrugIndication[];
 *   commonEffects: string[];
 *   seriousEffects: string[];
 *   boxedWarning?: string;
 *   monitoring: string[];
 *   special: [string, string][];
 *   discontinuation?: string;
 *   india: { telepsychiatry: string; regulatory: string; brands: string[]; notes?: string };
 *   pearls: string[];
 *   references: string[];
 * }} DrugGuide
 */

import escitalopram from './escitalopram.js';
import sertraline from './sertraline.js';
import fluoxetine from './fluoxetine.js';
import olanzapine from './olanzapine.js';
import quetiapine from './quetiapine.js';
import risperidone from './risperidone.js';
import aripiprazole from './aripiprazole.js';
import lithium from './lithium.js';
import valproate from './valproate.js';
import clonazepam from './clonazepam.js';

/** Display order of groups on the index page. */
export const DRUG_GROUPS = ['Antidepressants', 'Antipsychotics', 'Mood stabilisers', 'Anxiolytics & hypnotics'];

/** @type {DrugGuide[]} */
export const DRUG_GUIDES = [
  escitalopram,
  sertraline,
  fluoxetine,
  olanzapine,
  quetiapine,
  risperidone,
  aripiprazole,
  lithium,
  valproate,
  clonazepam,
];

export const DRUG_GUIDES_BASE = '/professionals/drug-guides';

export function drugGuidePath(slug) {
  return `${DRUG_GUIDES_BASE}/${slug}`;
}

export function getDrugGuide(slug) {
  return DRUG_GUIDES.find((d) => d.slug === slug) || null;
}

export const INDICATION_STATUS_LABEL = {
  approved: 'Approved',
  regional: 'Approved in some countries',
  offlabel: 'Off-label',
  notrecommended: 'Not recommended',
};
