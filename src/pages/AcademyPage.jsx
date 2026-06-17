import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { useAuth, signOut } from '../lib/useAuth';

import AcademyGuide from '../components/AcademyGuide';

const PROGRAMMES = [
  {
    label: '🧠 Certificates',
    title: 'Professional Certificate Programs',
    body: 'Structured, clinically reviewed certificate tracks for working professionals and students.',
    href: '/professionals/learning',
    cta: 'Explore certificates',
  },
  {
    label: '🎓 Students',
    title: 'Psychology Student Training',
    body: 'Foundational and applied training for psychology students entering clinical practice.',
    href: '/professionals/learning#learning-psychology',
    cta: 'Open student track',
  },
  {
    label: '👥 Counselling',
    title: 'Counselling Skills Development',
    body: 'Practical, case-based skill-building for counsellors — communication, ethics, and technique.',
    href: '/professionals/learning#learning-psychology',
    cta: 'Open counselling track',
  },
  {
    label: '🏥 Psychiatry',
    title: 'Psychiatry Clinical Training',
    body: 'For residents and prescribers: telemedicine norms, prescribing conversations, and SOAP/Rx workflow.',
    href: '/professionals/learning#learning-pharmacology',
    cta: 'Open psychiatry track',
  },
  {
    label: '📚 Research',
    title: 'Research & Publication Guidance',
    body: 'Support for case write-ups, literature reviews, and publication-ready clinical writing.',
    href: '/professionals/resources',
    cta: 'View resources',
  },
  {
    label: '💻 Telepsychiatry',
    title: 'Digital Mental Health & Telepsychiatry',
    body: 'Modern, remote-care delivery — platform workflows, documentation, and continuity of care.',
    href: '/professionals/learning',
    cta: 'Learn telepsychiatry',
  },
  {
    label: '🎯 CPD',
    title: 'Continuing Professional Development (CPD)',
    body: 'Ongoing learning for licensed professionals to stay current and meet CPD requirements.',
    href: '/professionals/learning',
    cta: 'Open CPD track',
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

const LEARNING_PATHS = [
  {
    icon: '🧠',
    title: 'Psychology Student Path',
    steps: ['Foundations', 'Assessment', 'Case formulation', 'Internship readiness'],
  },
  {
    icon: '💬',
    title: 'Counsellor Path',
    steps: ['Communication', 'Ethics', 'CBT basics', 'Supervision'],
  },
  {
    icon: '🏥',
    title: 'Psychiatry Path',
    steps: ['Telepsychiatry', 'Documentation', 'Prescribing', 'Practice management'],
  },
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
            <p className="ed-section-label">What We Offer</p>
            <h2>From classroom to clinical practice.</h2>
            <p className="ed-muted">
              Diagnosis and treatment belong with licensed clinicians on Serenest. Academy is where that
              workforce is trained — structured tracks across certificates, students, counselling,
              psychiatry, research, telepsychiatry, and CPD.
            </p>
          </div>

          <div id="tracks" className="ed-anchor-target" />

          <div className="ed-grid">
            {PROGRAMMES.map((item) => (
              <article key={item.title} className="ed-card">
                <p className="ed-card-label">{item.label}</p>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <p className="ed-card-cta">
                  {item.external ? (
                    <a className="ed-link" href={item.href}>
                      {item.cta}
                    </a>
                  ) : (
                    <Link className="ed-link" to={item.href}>
                      {item.cta}
                    </Link>
                  )}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="paths" className="ed-section ed-section-alt">
        <div className="container">
          <div className="ed-section-head">
            <p className="ed-section-label">Learning Paths</p>
            <h2>Built around careers, not just courses.</h2>
            <p className="ed-muted">
              Follow a structured path from foundations to practice-ready, mapped to where you are in
              your journey.
            </p>
          </div>

          <div className="ed-paths">
            {LEARNING_PATHS.map((p) => (
              <article key={p.title} className="ed-path">
                <div className="ed-path-head">
                  <span className="ed-path-icon" aria-hidden="true">{p.icon}</span>
                  <h3>{p.title}</h3>
                </div>
                <ol className="ed-path-steps">
                  {p.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </article>
            ))}
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
