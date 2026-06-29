import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';

const STATS = [
  { value: '15+',       label: 'Verified clinicians' },
  { value: '500+',      label: 'Sessions completed' },
  { value: '4.9 ★',    label: 'Avg professional rating' },
  { value: '₹800–1500', label: 'Per session fee range' },
];

const ROLES_HIRING = [
  { role: 'Clinical Psychologist', urgency: 'high',   tag: 'Urgently needed' },
  { role: 'Psychotherapist / CBT', urgency: 'high',   tag: 'Urgently needed' },
  { role: 'Counsellor',            urgency: 'medium', tag: 'Open slots' },
  { role: 'Psychiatrist (MD)',     urgency: 'medium', tag: 'Open slots' },
];

const WHY = [
  {
    icon: '💸',
    title: 'You set your fee',
    body: 'Charge ₹800–₹2,000 per session. We never cap what you earn — the higher your rating, the more you keep.',
  },
  {
    icon: '🕐',
    title: 'Fully flexible hours',
    body: 'Morning, evening, weekend — you decide your slots. No minimum session requirement.',
  },
  {
    icon: '⚡',
    title: 'Payments in 48 hrs',
    body: 'Automated payouts after each completed session. No chasing invoices, no delays.',
  },
  {
    icon: '📋',
    title: 'Zero admin load',
    body: 'Scheduling, reminders, intake, consent, and receipts all handled by the platform.',
  },
  {
    icon: '🎓',
    title: 'CPD & CME content',
    body: 'Access pharmacology, psychology, and clinical skills modules to keep your practice sharp.',
  },
  {
    icon: '🛡',
    title: 'Compliance built-in',
    body: 'MCI telemedicine guidelines, DPDP privacy, and Schedule H prescribing — all baked into the workflow.',
  },
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
  ['Apply',           'Submit credentials and registration number. Takes ~5 minutes.'],
  ['Set your rates',  'Configure your consultation fee, session length (30/45/60 min), and preferred languages.'],
  ['Add availability','Set your weekly calendar — mornings, evenings, weekends, whatever suits you.'],
  ['Verification',    'We review your credentials. Usually done within 48 hours.'],
  ['Go live',         'Start accepting bookings. First patients typically arrive within a week.'],
];

const TESTIMONIALS = [
  {
    quote: 'The workflow is genuinely calm. No tab-switching, no messy forms. I see patients, the platform handles the rest.',
    name: 'Dr R.S.',
    role: 'Psychiatrist',
    city: 'Ahmedabad',
  },
  {
    quote: 'I started part-time alongside my clinic. Within two months it was bringing in ₹35,000 extra every month.',
    name: 'Ms P.M.',
    role: 'Clinical Psychologist',
    city: 'Mumbai',
  },
  {
    quote: 'The CPD content is actually useful — not just checkbox modules. Real clinical framing for telepsychiatry.',
    name: 'Mr A.K.',
    role: 'Counsellor',
    city: 'Bengaluru',
  },
];

const FAQS = [
  {
    q: 'Do I need to quit my current job or clinic?',
    a: 'No. Most of our professionals start part-time alongside their existing practice. You set your own hours.',
  },
  {
    q: 'How much can I realistically earn?',
    a: 'At ₹1,200/session, 5 sessions/week = ₹24,000/month extra. 10 sessions/week = ₹48,000/month. Many clinicians do more.',
  },
  {
    q: 'How are payments handled?',
    a: 'Sessions are paid upfront by patients. After the consultation is marked complete, we transfer your share within 48 hours via bank transfer.',
  },
  {
    q: 'What credentials do I need?',
    a: 'Psychiatrists need MCI/SMC registration. Psychologists need RCI registration (M.Phil or Ph.D). Counsellors & therapists need a recognised Masters degree (MA Psychology, MSW, or equivalent).',
  },
  {
    q: 'Who handles cancellations and no-shows?',
    a: 'Our platform manages reminders and rescheduling. For no-shows within 24 hrs, a cancellation fee is charged to the patient — you are protected.',
  },
  {
    q: 'Can I prescribe medicines on Serenest?',
    a: 'Yes, if you are a verified MD Psychiatrist. Prescription tools are built into the consultation flow with Schedule H compliance baked in.',
  },
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
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="pros-page">

      {/* ── Hero ── */}
      <section className="pros-hero" style={{ background: 'linear-gradient(135deg, #0f1f3d 0%, #1a3355 100%)', padding: '5rem 1.5rem 4rem' }}>
        <div className="container" style={{ maxWidth: 780, textAlign: 'center' }}>
          <span style={{ display: 'inline-block', background: 'rgba(99,179,237,0.15)', color: '#90cdf4', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '5px 14px', borderRadius: 99, marginBottom: 20, border: '1px solid rgba(144,205,244,0.25)' }}>
            For Mental Health Professionals
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 20 }}>
            Practice on your terms.<br />
            <span style={{ color: '#90cdf4' }}>Earn ₹40,000–1,20,000/month.</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, maxWidth: 580, margin: '0 auto 2.5rem' }}>
            Serenest gives psychiatrists, psychologists, therapists, and counsellors a structured, compliant telepsychiatry workflow — so you focus on patients, not admin.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <Link className="btn btn-primary btn-lg" to="/professionals/apply">Apply to join →</Link>
            <Link className="btn btn-ghost btn-lg" to="/professionals/learning" style={{ border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}>Learning hub</Link>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}>
            Psychiatrist · Clinical Psychologist · Psychotherapist · Counsellor
          </p>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section style={{ background: '#f0f7ff', borderBottom: '1px solid #dbeafe', padding: '2rem 1.5rem' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 20, textAlign: 'center' }}>
            {STATS.map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e3a5f', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.8rem', color: '#5a7fa8', marginTop: 5, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── We're hiring ── */}
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

      {/* ── Why join ── */}
      <section style={{ padding: '5rem 1.5rem', background: 'linear-gradient(135deg, #f8faff, #f0f7ff)' }}>
        <div className="container" style={{ maxWidth: 960 }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.9rem', fontWeight: 800, marginBottom: 8 }}>Why professionals choose Serenest</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: 520, margin: '0 auto' }}>
              Built specifically for mental health practitioners. Not a generic telehealth app adapted after the fact.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 18 }}>
            {WHY.map((w) => (
              <div key={w.title} style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: 10 }}>{w.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 6 }}>{w.title}</div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Income calculator ── */}
      <section style={{ padding: '5rem 1.5rem', background: '#0f1f3d' }}>
        <div className="container" style={{ maxWidth: 680, textAlign: 'center' }}>
          <h2 style={{ color: '#fff', fontSize: '1.9rem', fontWeight: 800, marginBottom: 8 }}>Your earnings potential</h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: '2.5rem' }}>Based on current session rates on the platform</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            {[
              { sessions: 5,  weekly: '₹6,000', monthly: '₹24,000' },
              { sessions: 10, weekly: '₹12,000', monthly: '₹48,000' },
              { sessions: 20, weekly: '₹24,000', monthly: '₹96,000' },
            ].map((tier) => (
              <div key={tier.sessions} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: '1.5rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#90cdf4', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{tier.sessions} sessions/week</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{tier.monthly}</div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>per month</div>
                <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', marginTop: 6 }}>{tier.weekly}/week</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: '1.5rem' }}>
            Based on ₹1,200/session avg. Actual earnings depend on your fee setting.
          </p>
          <Link className="btn btn-primary btn-lg" to="/professionals/apply" style={{ marginTop: '2rem', display: 'inline-block' }}>
            Start earning →
          </Link>
        </div>
      </section>

      {/* ── Platform features ── */}
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

      {/* ── Onboarding steps ── */}
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

      {/* ── Testimonials ── */}
      <section style={{ padding: '5rem 1.5rem', background: 'linear-gradient(135deg, #f8faff, #f0f7ff)' }}>
        <div className="container" style={{ maxWidth: 960 }}>
          <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 800, marginBottom: '2.5rem' }}>What our professionals say</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', border: '1px solid var(--border)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '1.4rem', color: '#f59e0b', marginBottom: 10 }}>★★★★★</div>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--text)', marginBottom: 16, fontStyle: 'italic' }}>"{t.quote}"</p>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)' }}>{t.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.role} · {t.city}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '5rem 1.5rem', background: '#fff' }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 800, marginBottom: '2.5rem' }}>Common questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%', padding: '1rem 1.25rem', background: 'none', border: 'none',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    fontWeight: 700, fontSize: '0.95rem', textAlign: 'left', cursor: 'pointer', color: 'var(--text)',
                  }}
                >
                  <span>{faq.q}</span>
                  <span style={{ fontSize: '1.2rem', flexShrink: 0, marginLeft: 12, color: 'var(--text-muted)', transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 1.25rem 1rem', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.65, borderTop: '1px solid var(--border)' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Compliance ── */}
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

      {/* ── Hub cards ── */}
      <section className="pros-section" id="hub">
        <div className="container">
          <header className="pros-section__head">
            <p className="pros-eyebrow">Professional hub</p>
            <h2>Everything for your ongoing practice</h2>
          </header>
          <div className="pros-hub">
            {[
              { tag: 'Learning',   title: 'Learning hub',  body: 'Clinical framing, pharmacology, and platform training for clinicians and trainees.', href: '/professionals/learning', cta: 'Explore learning' },
              { tag: 'Resources',  title: 'Resources',     body: 'Handouts, template requests, ops checklists, and partnership decks ready to share.',  href: '/professionals/resources', cta: 'Browse resources' },
              { tag: 'Guidelines', title: 'Guidelines',    body: 'Telemedicine, privacy, and prescribing — orientation, not legal advice.',              href: '/professionals/guidelines', cta: 'Read guidelines' },
              { tag: 'Apply',      title: 'Apply to join', body: 'Credentials, fees, modes, and verification before you go live.',                       href: '/professionals/apply', cta: 'Start application' },
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

      {/* ── Final CTA ── */}
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
