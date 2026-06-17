import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { useAuth, signOut } from '../lib/useAuth';
import {
  ACADEMY_PROGRAMS, ACADEMY_CATEGORIES, ACADEMY_JOURNEY, ACADEMY_STATS,
} from '../lib/academyPrograms';
import EdIcon from '../components/EdIcon';

import AcademyGuide from '../components/AcademyGuide';

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
            {ACADEMY_JOURNEY.map((step, i) => (
              <li key={step.title} className="ed-journey-item">
                <span className="ed-journey-ico"><EdIcon name={step.icon} size={26} /></span>
                <span className="ed-journey-title">{step.title}</span>
                <span className="ed-journey-sub">{step.sub}</span>
                {i < ACADEMY_JOURNEY.length - 1 && <span className="ed-journey-arrow" aria-hidden="true">›</span>}
              </li>
            ))}
          </ol>

          {/* Grouped programme rows */}
          {ACADEMY_CATEGORIES.map((cat, ci) => (
            <div key={cat.label} className="ed-row">
              <div className="ed-row-head">
                <span className="ed-row-num">{ci + 1}</span>
                <span className="ed-row-label">{cat.label}</span>
                <span className="ed-row-tagline">{cat.tagline}</span>
              </div>
              <div className="ed-grid ed-grid--3">
                {ACADEMY_PROGRAMS.filter((p) => p.category === cat.label).map((p) => (
                  <article key={p.slug} className={`ed-pcard ed-acc-${p.accent}`}>
                    {p.popular && <span className="ed-pcard-badge">POPULAR</span>}
                    <div className="ed-pcard-top">
                      <span className="ed-pcard-ico"><EdIcon name={p.iconName} size={24} /></span>
                      <div>
                        <h3>{p.title}</h3>
                        <p className="ed-pcard-sub">{p.subtitle}</p>
                      </div>
                    </div>
                    <p className="ed-pcard-body">{p.body}</p>
                    <div className="ed-pcard-metrics">
                      {p.metrics.map((m) => (
                        <div key={m.sub}>
                          <span className="ed-metric-top">{m.top}</span>
                          <span className="ed-metric-sub">{m.sub}</span>
                        </div>
                      ))}
                    </div>
                    <Link className="ed-pcard-cta" to={`/academy/program/${p.slug}`}>
                      {p.ctaLabel} →
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          ))}

          {/* Workforce vision banner */}
          <div className="ed-workforce">
            <div className="ed-workforce-main">
              <h3>Building India&apos;s Mental Health Workforce for 2047</h3>
              <p>
                Training psychologists, counsellors, psychiatrists, researchers, and digital mental
                health professionals through structured education pathways.
              </p>
              <ul className="ed-workforce-stats">
                {ACADEMY_STATS.map((s) => (
                  <li key={s.label}>
                    <span className="ed-wf-value">{s.value}</span>
                    <span className="ed-wf-label">{s.label}</span>
                  </li>
                ))}
              </ul>
            </div>
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
