import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';

const ROLES_HIRING = [
  { role: 'Clinical Psychologist', urgency: 'high',   tag: 'Urgently needed' },
  { role: 'Psychotherapist / CBT', urgency: 'high',   tag: 'Urgently needed' },
  { role: 'Counsellor',            urgency: 'medium', tag: 'Open slots' },
  { role: 'Psychiatrist (MD)',     urgency: 'medium', tag: 'Open slots' },
];

const FEATURES = [
  { tag: 'Scheduling',      title: 'Smart scheduling',   body: 'Availability, slot visibility, follow-ups, and reminders — built in.' },
  { tag: 'Documentation',   title: 'SOAP notes',         body: 'Structured documentation with post-session locking for auditability.' },
  { tag: 'Prescriptions',   title: 'Digital Rx',         body: 'MCI-aligned prescriptions with doctor registration details on every script.' },
  { tag: 'Assessments',     title: 'PHQ-9 / GAD-7',      body: 'Score trends and mood logs for measurement-based care across visits.' },
  { tag: 'Privacy',         title: 'Privacy-first',      body: 'Least-access design aligned to DPDP expectations. Records visible only to you.' },
  { tag: 'Payments',        title: 'Earnings dashboard', body: 'Session earnings, payout history, and tax-ready summaries in one place.' },
];

const STEPS = [
  ['Apply',           'Submit your details and registration number. Takes ~5 minutes.'],
  ['Set your rates',  'Configure your consultation fee, session length (30/45/60 min), and preferred languages.'],
  ['Add availability','Set your weekly calendar — mornings, evenings, weekends, whatever suits you.'],
  ['Verification',    'We review your credentials. Usually done within 48 hours.'],
  ['Go live',         'Start accepting bookings. First patients typically arrive within a week.'],
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

export default function ProfessionalsPage() {
  useSEO({ path: '/professionals', ...ROUTE_SEO['/professionals'] });

  return (
    <div className="pros-page">

      {/* Hero */}
      <section className="pros-hero" style={{ background: 'linear-gradient(135deg, #0f1f3d 0%, #1a3355 100%)', padding: '5rem 1.5rem 4rem' }}>
        <div className="container" style={{ maxWidth: 780, textAlign: 'center' }}>
          <span style={{ display: 'inline-block', background: 'rgba(99,179,237,0.15)', color: '#90cdf4', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '5px 14px', borderRadius: 99, marginBottom: 20, border: '1px solid rgba(144,205,244,0.25)' }}>
            For Mental Health Professionals
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 20 }}>
            Practice on your terms.<br />
            <span style={{ color: '#90cdf4' }}>Structured. Compliant. Focused on care.</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, maxWidth: 580, margin: '0 auto 2.5rem' }}>
            Serenest gives psychiatrists, psychologists, therapists, and counsellors a compliant telepsychiatry workflow — so you focus on patients, not admin.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <Link className="btn btn-primary btn-lg" to="/professionals/apply">Apply to join →</Link>
            <Link className="btn btn-ghost btn-lg" to="/academy" style={{ border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}>Academy · Free</Link>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}>
            Psychiatrist · Clinical Psychologist · Psychotherapist · Counsellor
          </p>
        </div>
      </section>

      {/* Actively hiring */}
      <section style={{ padding: '4rem 1.5rem', background: '#fff' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ display: 'inline-block', background: '#fef3c7', color: '#92400e', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 12px', borderRadius: 99, marginBottom: 12 }}>
              Actively hiring
            </span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>Roles we need right now</h2>
            <p style={{ color: 'var(--text-muted)' }}>Patient demand is outpacing supply. We need qualified clinicians immediately.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            {ROLES_HIRING.map((r) => (
              <div key={r.role} style={{
                border: r.urgency === 'high' ? '2px solid #ef4444' : '1px solid var(--border)',
                borderRadius: 14, padding: '1.25rem',
                background: r.urgency === 'high' ? '#fff5f5' : '#fafafa',
              }}>
                <span style={{
                  display: 'inline-block',
                  background: r.urgency === 'high' ? '#ef4444' : '#6b7280',
                  color: '#fff', fontSize: '0.68rem', fontWeight: 700,
                  padding: '2px 8px', borderRadius: 99, marginBottom: 8,
                }}>{r.tag}</span>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{r.role}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link className="btn btn-primary" to="/professionals/apply" style={{ padding: '12px 28px' }}>Apply in 5 minutes →</Link>
          </div>
        </div>
      </section>

      {/* Platform features */}
      <section className="pros-section pros-section--cream" id="why">
        <div className="container">
          <header className="pros-section__head">
            <p className="pros-eyebrow">Built for clinical practice</p>
            <h2>Everything you need, end-to-end</h2>
            <p>Reduce admin load, keep documentation consistent, support continuity across sessions.</p>
          </header>
          <div className="pros-features">
            {FEATURES.map((item) => (
              <article key={item.title} className="pros-feature">
                <span className="pros-feature__tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Onboarding steps */}
      <section className="pros-section" id="onboarding">
        <div className="container">
          <header className="pros-section__head">
            <p className="pros-eyebrow">Step by step</p>
            <h2>Go live in less than a week</h2>
            <p>Structured, verified onboarding so patients trust who they book with.</p>
          </header>
          <ol className="pros-steps">
            {STEPS.map(([title, desc], i) => (
              <li key={title} className="pros-step">
                <span className="pros-step__num">{i + 1}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{desc}</p>
                </div>
              </li>
            ))}
          </ol>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link className="btn btn-primary btn-lg" to="/professionals/apply">Start your application →</Link>
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="pros-section pros-section--cream" id="compliance">
        <div className="container">
          <header className="pros-section__head">
            <p className="pros-eyebrow">Trust &amp; compliance</p>
            <h2>Designed around India&apos;s telemedicine and privacy expectations</h2>
          </header>
          <div className="pros-compliance">
            {COMPLIANCE.map((item) => (
              <article key={item.title} className="pros-compliance__item">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
          <div className="pros-note">
            <strong>Note.</strong> Serenest is a clinical platform and does not support
            prescriptions without a consultation. Schedule H regulations are respected and
            restricted to verified MD psychiatrists.
          </div>
        </div>
      </section>

      {/* Hub cards */}
      <section className="pros-section" id="hub">
        <div className="container">
          <header className="pros-section__head">
            <p className="pros-eyebrow">Professional hub</p>
            <h2>Everything for your ongoing practice</h2>
          </header>
          <div className="pros-hub">
            {[
              { tag: 'Academy',    title: 'Serenest Academy · Free', body: 'Approved professionals get Academy programs at no charge — certificates, CPD, and fellowships included.', href: '/academy', cta: 'Open Academy free' },
              { tag: 'Learning',   title: 'Learning hub',  body: 'Clinical framing, pharmacology, and platform training for clinicians and trainees.', href: '/professionals/learning', cta: 'Explore learning' },
              { tag: 'Resources',  title: 'Resources',     body: 'Handouts, template requests, ops checklists, and partnership decks ready to share.',  href: '/professionals/resources', cta: 'Browse resources' },
              { tag: 'Guidelines', title: 'Guidelines',    body: 'Telemedicine, privacy, and prescribing — orientation, not legal advice.',              href: '/professionals/guidelines', cta: 'Read guidelines' },
            ].map((item) => (
              <Link key={item.title} to={item.href} className="pros-hub__card">
                <span className="pros-hub__tag">{item.tag}</span>
                <h3 className="pros-hub__title">{item.title}</h3>
                <p className="pros-hub__body">{item.body}</p>
                <span className="pros-hub__cta">{item.cta}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pros-cta">
        <div className="container pros-cta__inner">
          <div>
            <h2>Ready to join Serenest?</h2>
            <p>Apply in 5 minutes. Verified onboarding · Clinical-first · Privacy-first</p>
            <p className="pros-cta__fine">Psychiatrists · Psychologists · Therapists · Counsellors</p>
          </div>
          <div className="pros-cta__actions">
            <Link className="btn btn-primary btn-lg" to="/professionals/apply">Apply now →</Link>
            <a className="btn btn-ghost btn-lg" href="mailto:support@serenest.in?subject=Professional%20Query">Have a question?</a>
          </div>
        </div>
      </section>
    </div>
  );
}
