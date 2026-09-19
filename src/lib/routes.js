/**
 * Single source of truth for the paths the SPA serves.
 *
 * server.js reads this to decide 200 vs 404 for HTML requests, and
 * scripts/verify-seo.mjs cross-checks it against src/App.jsx. Keeping one list
 * matters because a route that exists in the router but not here is served a
 * hard 404 on direct visits, shared links, and crawls — it only appears to
 * work when reached by in-app navigation.
 */

import { BLOG_POSTS } from './blogPosts.js';
import { ACADEMY_PROGRAMS } from './academyPrograms.js';
import { SCREENING_TOOLS } from './screeningTools.js';
import { listCheckEvidence } from './checkEvidence.js';

/** Strip trailing slashes so "/about/" and "/about" resolve identically. */
export function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
}

/** Fixed paths the router renders, including the ones that redirect in-app. */
export const STATIC_ROUTES = [
  '/',
  '/preview',
  '/about',
  '/team',
  '/contact',

  // Services hub + detail pages
  '/services',
  '/services/psychiatry',
  '/services/therapy',
  '/services/addiction-care',
  '/services/digital-consultations',

  // Professionals
  '/professionals',
  '/professionals/learning',
  '/professionals/resources',
  '/professionals/guidelines',
  '/professionals/apply',
  '/professionals/terms',
  '/professionals/code-of-conduct',
  '/professionals/login',
  '/professionals/portal',

  // Booking & commercial
  '/book',
  '/pricing',
  '/careers',
  '/corporate',
  '/partner',

  // Content
  '/faq',
  '/guides',
  '/blog',
  '/resources', // redirects to /blog
  '/disclaimer', // redirects to /emergency-disclaimer

  // Screening & evidence
  '/screening',
  '/screening/pathway/mood-anxiety',
  '/burnout-check',
  '/evidence',

  // Academy
  '/academy',
  '/academy/login',
  '/academy/programs',
  '/academy/workshops',
  '/academy/learning-paths',
  '/academy/faculty',
  '/academy/resources',
  '/academy/faqs',
  '/academy/learn',
  '/academy/learn/pharmacology',
  '/academy/learn/psychology',

  // Patient & admin
  '/admin',
  '/patient/find-professional',
  '/patient/login',
  '/patient/dashboard',
  '/patient/terms',

  // Legal & policies
  '/privacy',
  '/terms',
  '/consent',
  '/refund-policy',
  '/emergency-disclaimer',
  '/cookie-policy',
  '/grievance-policy',
  '/payment-policy',
  '/data-retention',
  '/intellectual-property',
  '/community-guidelines',
  '/legal',

  // Clinical landing pages
  '/online-psychiatrist-consultation-india',
  '/online-psychiatrist-for-depression-india',
  '/anxiety-counselling-online-india',
  '/adhd-assessment-online-india',
  '/ocd-treatment-online-india',
  '/online-psychiatrist-gujarat',
  '/phq-9-depression-screening',
  '/gad-7-anxiety-screening',
  '/online-psychiatrist-prescription-india',
];

/**
 * Content-driven routes, expanded from the same registries the pages render
 * from. Resolving real slugs means an unknown one gets a true 404 instead of a
 * soft-200 shell that Google has to work out for itself.
 */
export const BLOG_POST_PATHS = BLOG_POSTS.map((p) => `/blog/${p.slug}`);
export const ACADEMY_PROGRAM_PATHS = ACADEMY_PROGRAMS.map((p) => `/academy/programs/${p.slug}`);
export const SCREENING_TOOL_PATHS = SCREENING_TOOLS.map((t) => `/screening/tool/${t.slug}`);
export const EVIDENCE_PATHS = listCheckEvidence().map((e) => `/evidence/${e.evidenceSlug}`);

/** Legacy singular program path — kept as a client-side redirect. */
const LEGACY_ACADEMY_PROGRAM_PATHS = ACADEMY_PROGRAMS.map((p) => `/academy/program/${p.slug}`);
/** /resources/:slug redirects to the matching /blog/:slug. */
const RESOURCE_ALIAS_PATHS = BLOG_POSTS.map((p) => `/resources/${p.slug}`);
/** getTool() accepts a tool's id as well as its slug. */
const SCREENING_TOOL_ID_PATHS = SCREENING_TOOLS.map((t) => `/screening/tool/${t.id}`);

export const VALID_ROUTES = new Set([
  ...STATIC_ROUTES,
  ...BLOG_POST_PATHS,
  ...RESOURCE_ALIAS_PATHS,
  ...ACADEMY_PROGRAM_PATHS,
  ...LEGACY_ACADEMY_PROGRAM_PATHS,
  ...SCREENING_TOOL_PATHS,
  ...SCREENING_TOOL_ID_PATHS,
  ...EVIDENCE_PATHS,
]);

/**
 * Prefixes whose tail cannot be enumerated ahead of time. Consultation rooms
 * are keyed by appointment id, so they stay prefix-matched.
 */
export const VALID_PREFIXES = ['/consultation/'];

export function isValidSpaRoute(pathname) {
  if (VALID_ROUTES.has(normalizePath(pathname))) return true;
  return VALID_PREFIXES.some((p) => pathname.startsWith(p) && pathname.length > p.length);
}
