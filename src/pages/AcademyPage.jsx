import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { useAuth, signOut } from '../lib/useAuth';

import AcademyGuide from '../components/AcademyGuide';

const JOURNEY = [
  'Student',
  'Certificate Program',
  'Clinical Training',
  'Research & Publication',
  'Professional Practice',
  'CPD & Fellowship',
];

const PROGRAMME_ROWS = [
  {
    label: 'Career Entry',
    items: [
      {
        icon: '🎓', title: 'Student Training', slug: 'student-training',
        body: 'For Psychology, Psychiatry & Mental Health students.',
        cta: 'View program',
        featured: true, highlights: ['50+ hours training', 'Case discussions', 'Certificates included'],
      },
      {
        icon: '🧠', title: 'Counselling Skills', slug: 'counselling-skills',
        body: 'Foundational counselling and therapeutic communication.',
        cta: 'View program',
      },
      {
        icon: '📜', title: 'Certificate Programs', slug: 'certificate-programs',
        body: 'Short-term professional certifications.',
        cta: 'View program',
      },
    ],
  },
  {
    label: 'Clinical Practice',
    items: [
      {
        icon: '⚕️', title: 'Psychiatry Training', slug: 'psychiatry-training',
        body: 'Clinical psychiatry, prescribing & telemedicine.',
        cta: 'View program',
        featured: true, highlights: ['Telemedicine norms', 'Prescribing conversations', 'SOAP / Rx workflow'],
      },
      {
        icon: '💻', title: 'Digital Mental Health', slug: 'digital-mental-health',
        body: 'Telepsychiatry, documentation & remote care.',
        cta: 'View program',
      },
      {
        icon: '🔬', title: 'Research & Publications', slug: 'research-publications',
        body: 'Research methodology and publication support.',
        cta: 'View program',
        featured: true, highlights: ['Literature reviews', 'Case reports', 'Publication mentorship'],
      },
    ],
  },
  {
    label: 'Professional Growth',
    items: [
      {
        icon: '🎯', title: 'CPD Programs', slug: 'cpd-programs',
        body: 'Continuous professional development.',
        cta: 'View program',
      },
      {
        icon: '👨‍🏫', title: 'Mentorship', slug: 'mentorship',
        body: '1:1 supervision and career guidance.',
        cta: 'View program',
      },
      {
        icon: '🏆', title: 'Fellowship Programs', slug: 'fellowship-programs',
        body: 'Advanced specialty tracks.',
        cta: 'View program',
      },
    ],
  },
];

const AUDIENCE = [
  'Psychology students',
  'Fresh graduates',
  'Practicing counsellors',
  'Psychiatry residents',
  'Mental health professionals',
  'Researchers',
];

const WHY_SERENEST = [
  'Clinician-led education',
  'Practical case discussions',
  'Industry-relevant skills',
  'Flexible online learning',
  'Certificates of completion',
  'Community and mentorship',
];

const STATS = [
  { value: '50+', label: 'Hours of learning' },
  { value: 'Expert', label: 'Clinician faculty' },
  { value: 'Case-based', label: 'Practical training' },
  { value: 'Certified', label: 'On completion' },
];

const INSTRUCTOR_MAILTO =
  'mailto:support@serenest.in?subject=Serenest%20Academy%20%E2%80%94%20Become%20an%20Instructor';

export default function AcademyPage() {
  useSEO({ path: '/academy', ...ROUTE_SEO['/academy'] });
  const { user } = useAuth();
  const firstName = (user?.user_metadata?.full_name || user?.email || '').split(/[\s@]/)[0];

  return (
    <div className="ed-page">
      <section className="ed-hero">
        <div className="container">
          <div className="ed-hero-brandline" style={{ justifyContent: 'space-between', width: '100%' }}>
            <div className="ed-hero-brandstack">
              <span className="ed-brand-name">Serenest Academy</span>
              <span className="ed-brand-tag">Literacy &amp; learning · part of Serenest</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {user ? (
                <>
                  <span className="ed-muted" style={{ fontSize: '0.9rem' }}>Hi, {firstName}</span>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => signOut()}>Log out</button>
                </>
              ) : (
                <Link className="btn btn-ghost btn-sm" to="/academy/login">Log in / Sign up</Link>
              )}
            </div>
          </div>

          <p className="ed-kicker">Learn. Practice. Grow.</p>
          <h1 className="ed-hero-title">
            Training the next generation of psychologists, counsellors, and psychiatrists.
          </h1>
          <p className="ed-hero-lead">
            Professional certificates · Clinical skills · Research · Digital mental healthcare —
            clinician-led education that takes you from classroom to clinical practice.
          </p>
          <div className="ed-hero-actions">
            <a className="btn btn-primary btn-lg" href="#offer">
              Explore programs
            </a>
            <a className="btn btn-ghost btn-lg" href={INSTRUCTOR_MAILTO}>
              Become an instructor
            </a>
          </div>

          <ul className="ed-stats" aria-label="Academy at a glance">
            {STATS.map((s) => (
              <li key={s.label}>
                <span className="ed-stat-value">{s.value}</span>
                <span className="ed-stat-label">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <AcademyGuide />

      <section id="offer" className="ed-section">
        <div className="container">
          <div className="ed-section-head">
            <p className="ed-section-label">Career Pathways</p>
            <h2>Build your mental health career journey</h2>
            <p className="ed-muted">
              From student to licensed professional — learn, practice, publish, and grow with
              Serenest Academy.
            </p>
          </div>

          <div id="tracks" className="ed-anchor-target" />

          {/* Journey flow */}
          <ol className="ed-journey" aria-label="Learning journey">
            {JOURNEY.map((step, i) => (
              <li key={step}>
                <span className="ed-journey-step">{step}</span>
                {i < JOURNEY.length - 1 && <span className="ed-journey-arrow" aria-hidden="true">→</span>}
              </li>
            ))}
          </ol>

          {/* Grouped programme rows */}
          {PROGRAMME_ROWS.map((row) => (
            <div key={row.label} className="ed-row">
              <div className="ed-row-label">{row.label}</div>
              <div className="ed-grid ed-grid--3">
                {row.items.map((item) => (
                  <article key={item.title} className={`ed-card ${item.featured ? 'ed-card--featured' : ''}`}>
                    {item.featured && <span className="ed-card-badge">★ Featured</span>}
                    <div className="ed-card-icon" aria-hidden="true">{item.icon}</div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                    {item.highlights && (
                      <ul className="ed-card-highlights">
                        {item.highlights.map((h) => <li key={h}>{h}</li>)}
                      </ul>
                    )}
                    <p className="ed-card-cta">
                      <Link className="ed-link" to={`/academy/program/${item.slug}`}>{item.cta} →</Link>
                    </p>
                  </article>
                ))}
              </div>
            </div>
          ))}

          {/* Workforce vision banner */}
          <div className="ed-workforce">
            <h3>Building India&apos;s Mental Health Workforce for 2047</h3>
            <p>
              Training psychologists, counsellors, psychiatrists, researchers, and digital mental
              health professionals through structured education pathways.
            </p>
          </div>
        </div>
      </section>

      <section id="audiences" className="ed-section">
        <div className="container">
          <div className="ed-split">
            <div>
              <p className="ed-section-label">Who Should Join?</p>
              <h2>Designed for everyone building a career in mental health</h2>
              <ul className="ed-list">
                {AUDIENCE.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
            <div className="ed-callout" aria-label="Why Serenest Academy">
              <p className="ed-callout-title">Why Serenest Academy?</p>
              <ul className="ed-list">
                {WHY_SERENEST.map((w) => (
                  <li key={w}>✅ {w}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="ed-muted ed-note">
            Clinical workflows (booking, screening, video consultations) live under the same Serenest roof.
            Privacy and regulation stay sharp because those routes are protected — not because they are on
            a different domain.
          </p>
        </div>
      </section>

      <section id="vision" className="ed-section">
        <div className="container">
          <div className="ed-split">
            <div>
              <p className="ed-section-label">Our Vision</p>
              <h2>A skilled, ethically grounded mental health workforce</h2>
              <p>
                To create a skilled and ethically grounded mental health workforce that contributes to
                India&apos;s vision of becoming a developed nation by 2047.
              </p>
              <div className="ed-split-actions">
                <a className="btn btn-primary" href="#offer">
                  Explore Courses
                </a>
              </div>
            </div>
            <div className="ed-callout" aria-label="Call to action">
              <p className="ed-callout-title">Learn. Practice. Impact Lives.</p>
              <p>
                Serenest Academy turns clinical knowledge into real-world skill — case-based learning,
                ethical practice, and modern mental healthcare, taught by clinicians.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="clinical" className="ed-section">
        <div className="container">
          <div className="ed-split">
            <div>
              <p className="ed-section-label">Clinical care</p>
              <h2>Same Serenest — bookings, screening &amp; consultations</h2>
              <p>
                Bookings, screening, video consultations, and continuity of care all run inside Serenest.
                Academy and clinical share the same brand, the same team, and the same site.
              </p>
              <p className="ed-muted">
                Serenest Education Pvt Ltd publishes Serenest Academy and operates Serenest clinical care
                at serenest.in.
              </p>
              <div className="ed-split-actions">
                <Link className="btn btn-primary" to="/book">
                  Book an appointment
                </Link>
                <Link className="btn btn-ghost" to="/screening">
                  Self-screening (PHQ-9 / GAD-7)
                </Link>
              </div>
            </div>
            <div className="ed-callout" aria-label="Reminder">
              <p className="ed-callout-title">Not sure where to start?</p>
              <p>
                If you want an appointment or clinical intake, head to{' '}
                <Link to="/book">Book</Link> or{' '}
                <Link to="/patient/find-professional">Find a professional</Link>. If you want literacy
                content or to talk about a partnership, you&apos;re in the right place.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="ed-section ed-section-alt">
        <div className="container ed-cta">
          <div>
            <h2 className="ed-cta-title">Partner or collaborate</h2>
            <p className="ed-muted">
              Share goals, audience, and timelines — we read every message and reply when there&apos;s a
              fit.
            </p>
          </div>
          <div className="ed-cta-actions">
            <a
              className="btn btn-primary btn-lg btn-full"
              href="mailto:support@serenest.in?subject=Serenest%20Academy%20%E2%80%94%20partnership"
            >
              Email Serenest Academy
            </a>
            <Link className="btn btn-ghost btn-lg btn-full" to="/professionals">
              Clinical / professional enquiries
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
