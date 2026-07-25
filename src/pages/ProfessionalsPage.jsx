import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import '../styles/editorial-structures.css';

const HERO_NAV = [
  { label: 'Why Serenest', href: '#why' },
  { label: 'How it works', href: '#onboarding' },
  { label: 'Compliance', href: '#compliance' },
  { label: 'Hub', href: '#hub' },
];

const ROLES = [
  { role: 'Clinical Psychologist', note: 'Priority openings' },
  { role: 'Psychotherapist / CBT', note: 'Priority openings' },
  { role: 'Counsellor', note: 'Accepting applications' },
  { role: 'Psychiatrist (MD)', note: 'Accepting applications' },
];

const PRACTICE = [
  'Set your own rates and availability',
  'SOAP notes and digital prescriptions',
  'PHQ-9 / GAD-7 trends across visits',
  'Privacy-first records under DPDP',
  'Academy access free for approved clinicians',
];

const FEATURES = [
  {
    tag: 'Scheduling',
    title: 'Smart scheduling',
    body: 'Availability, slot visibility, follow-ups, and reminders — built in.',
  },
  {
    tag: 'Documentation',
    title: 'SOAP notes',
    body: 'Structured documentation with post-session locking for auditability.',
  },
  {
    tag: 'Prescriptions',
    title: 'Digital Rx',
    body: 'MCI-aligned prescriptions with registration details on every script.',
  },
  {
    tag: 'Assessments',
    title: 'PHQ-9 / GAD-7',
    body: 'Score trends and mood logs for measurement-based care across visits.',
  },
  {
    tag: 'Privacy',
    title: 'Privacy-first',
    body: 'Least-access design aligned to DPDP. Records visible only to you.',
  },
  {
    tag: 'Payments',
    title: 'Earnings dashboard',
    body: 'Session earnings, payout history, and tax-ready summaries in one place.',
  },
];

const STEPS = [
  ['Apply', 'Submit your details and registration number. Takes about five minutes.'],
  ['Set your rates', 'Configure consultation fee, session length, and preferred languages.'],
  ['Add availability', 'Open the slots that fit your week — mornings, evenings, or weekends.'],
  ['Verification', 'We review your credentials. Usually done within 48 hours.'],
  ['Go live', 'Start accepting bookings. First patients typically arrive within a week.'],
];

const COMPLIANCE = [
  {
    title: 'MCI Telemedicine Practice Guidelines 2020',
    body: 'Consult flow, consent, documentation, and prescription format align with the national telemedicine guidelines.',
  },
  {
    title: 'DPDP Act 2023 — privacy-first',
    body: 'Least-access approach with clear visibility boundaries on patient records and clinician data.',
  },
];

const HUB = [
  {
    tag: 'Academy',
    title: 'Serenest Academy · Free',
    body: 'Approved professionals get Academy programs at no charge — certificates, CPD, and fellowships included.',
    href: '/academy',
    cta: 'Open Academy',
  },
  {
    tag: 'Learning',
    title: 'Learning hub',
    body: 'Clinical framing, pharmacology, and platform training for clinicians and trainees.',
    href: '/professionals/learning',
    cta: 'Explore learning',
  },
  {
    tag: 'Resources',
    title: 'Resources',
    body: 'Handouts, template requests, ops checklists, and partnership decks ready to share.',
    href: '/professionals/resources',
    cta: 'Browse resources',
  },
  {
    tag: 'Guidelines',
    title: 'Guidelines',
    body: 'Telemedicine, privacy, and prescribing — orientation, not legal advice.',
    href: '/professionals/guidelines',
    cta: 'Read guidelines',
  },
];

export default function ProfessionalsPage() {
  useSEO({ path: '/professionals', ...ROUTE_SEO['/professionals'] });

  return (
    <div className="pros-page">
      <section className="pros-hero" aria-labelledby="pros-hero-title">
        <div className="container">
          <div className="pros-hero__grid">
            <div className="pros-hero__copy">
              <p className="pros-eyebrow pros-eyebrow--hero">
                <span className="pros-brand">Serenest</span>
                <span className="pros-eyebrow-dot" aria-hidden="true">·</span>
                <span>For mental health professionals</span>
              </p>
              <h1 id="pros-hero-title" className="pros-hero__title">
                Practice on your terms — structured, compliant, focused on care.
              </h1>
              <p className="pros-hero__lead">
                A clinical telepsychiatry workflow for psychiatrists, psychologists, therapists,
                and counsellors — so you spend time with patients, not admin.
              </p>
              <div className="pros-hero__actions">
                <Link className="btn btn-primary btn-lg" to="/professionals/apply">
                  Apply to join
                </Link>
                <Link className="btn btn-ghost btn-lg" to="/professionals/portal">
                  Clinician portal
                </Link>
              </div>
              <nav className="pros-hero__nav" aria-label="On this page">
                {HERO_NAV.map((item) => (
                  <a key={item.label} href={item.href}>{item.label}</a>
                ))}
              </nav>
            </div>

            <aside className="pros-hero__panel" aria-label="What you get on Serenest">
              <p className="pros-hero__panel-label">What you practice with</p>
              <ul className="pros-hero__panel-list">
                {PRACTICE.map((item) => (
                  <li key={item}>
                    <span className="pros-check" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="pros-hero__panel-note">
                Already verified?{' '}
                <Link to="/professionals/login">Sign in</Link>
                {' '}·{' '}
                <Link to="/academy">Academy free</Link>
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="pros-roles" aria-labelledby="pros-roles-title">
        <div className="container">
          <header className="pros-section__head pros-section__head--tight">
            <p className="pros-eyebrow">Open roles</p>
            <h2 id="pros-roles-title">We are expanding the clinical network</h2>
            <p>Patient demand is growing. Qualified clinicians can apply in about five minutes.</p>
          </header>
          <ul className="pros-roles__grid">
            {ROLES.map((r) => (
              <li key={r.role} className="pros-role">
                <strong>{r.role}</strong>
                <span>{r.note}</span>
              </li>
            ))}
          </ul>
          <div className="pros-roles__cta">
            <Link className="btn btn-primary" to="/professionals/apply">
              Apply in 5 minutes
            </Link>
          </div>
        </div>
      </section>

      {/* What the platform provides — a numbered index of capabilities. */}
      <section className="pros-section pros-section--cream ed-pace" id="why">
        <div className="container ed-aside">
          <div>
            <p className="ed-aside__label">Built for practice</p>
            <p className="ed-aside__note">
              Reduce admin load, keep documentation consistent, and support continuity across
              sessions.
            </p>
          </div>
          <div>
            <h2 style={{ fontSize: 'clamp(1.4rem, 2.8vw, 1.9rem)', fontWeight: 600, lineHeight: 1.2, maxWidth: '18ch', marginBottom: '1.5rem' }}>
              Everything you need, end-to-end
            </h2>
            <div className="ed-index">
              {FEATURES.map((item, i) => (
                <div key={item.title} className="ed-index__row">
                  <span className="ed-index__num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <h3 className="ed-index__title">{item.title}</h3>
                    <span className="ed-index__meta">{item.tag}</span>
                  </span>
                  <p className="ed-index__body">{item.body}</p>
                  <span />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Onboarding is genuinely sequential — a timeline. */}
      <section className="pros-section ed-pace" id="onboarding">
        <div className="container">
          <div className="ed-head ed-measure-wide">
            <span className="ed-head__label">Step by step</span>
            <h2>Go live in less than a week</h2>
            <p>Structured, verified onboarding so patients trust who they book with.</p>
          </div>
          <ol className="ed-timeline">
            {STEPS.map(([title, desc], i) => (
              <li key={title}>
                <span className="ed-timeline__stage">{`Step ${i + 1}`}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </li>
            ))}
          </ol>
          <div className="pros-mid-cta" style={{ marginTop: '2.25rem' }}>
            <Link className="btn btn-primary btn-lg" to="/professionals/apply">
              Start your application
            </Link>
          </div>
        </div>
      </section>

      {/* Compliance is reference material — a table. */}
      <section className="pros-section pros-section--cream ed-pace" id="compliance">
        <div className="container">
          <div className="ed-head ed-measure-wide">
            <span className="ed-head__label">Trust &amp; compliance</span>
            <h2>Designed around India&apos;s telemedicine and privacy expectations</h2>
          </div>
          <table className="ed-table ed-measure-wide">
            <thead>
              <tr>
                <th scope="col">Area</th>
                <th scope="col">How Serenest handles it</th>
              </tr>
            </thead>
            <tbody>
              {COMPLIANCE.map((item) => (
                <tr key={item.title}>
                  <th scope="row" style={{ whiteSpace: 'normal', maxWidth: '16rem' }}>{item.title}</th>
                  <td data-label="How Serenest handles it">{item.body}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pros-note" style={{ marginTop: '1.75rem' }}>
            <strong>Note.</strong> Serenest is a clinical platform and does not support
            prescriptions without a consultation. Schedule H regulations are respected and
            restricted to verified MD psychiatrists.
          </div>
        </div>
      </section>

      {/* The hub is a set of destinations — an index of links. */}
      <section className="pros-section ed-pace" id="hub">
        <div className="container ed-aside">
          <div>
            <p className="ed-aside__label">Professional hub</p>
            <p className="ed-aside__note">
              Learning, resources, and guidelines stay with you after you join.
            </p>
          </div>
          <div>
            <h2 style={{ fontSize: 'clamp(1.4rem, 2.8vw, 1.9rem)', fontWeight: 600, lineHeight: 1.2, maxWidth: '18ch', marginBottom: '1.5rem' }}>
              Everything for your ongoing practice
            </h2>
            <div className="ed-index">
              {HUB.map((item) => (
                <Link key={item.title} to={item.href} className="ed-index__row">
                  <span />
                  <span>
                    <h3 className="ed-index__title">{item.title}</h3>
                    <span className="ed-index__meta">{item.tag}</span>
                  </span>
                  <p className="ed-index__body">{item.body}</p>
                  <span className="ed-index__go" aria-hidden="true">{item.cta} →</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pros-cta">
        <div className="container pros-cta__inner">
          <div>
            <p className="pros-cta__brand">Serenest</p>
            <h2>Ready to join?</h2>
            <p>Apply in five minutes. Verified onboarding · Clinical-first · Privacy-first</p>
            <p className="pros-cta__fine">Psychiatrists · Psychologists · Therapists · Counsellors</p>
          </div>
          <div className="pros-cta__actions">
            <Link className="btn btn-primary btn-lg" to="/professionals/apply">
              Apply now
            </Link>
            <a
              className="btn btn-ghost btn-lg"
              href="mailto:support@serenest.in?subject=Professional%20Query"
            >
              Have a question?
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
