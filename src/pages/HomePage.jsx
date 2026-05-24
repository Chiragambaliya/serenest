import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';

/* ── Inline styles for elements that need minor one-off tweaks ─ */
const s = {
  sectionTwoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '48px',
    alignItems: 'center',
  },
  featureList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'grid',
    gap: '14px',
  },
  featureItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    fontSize: '15px',
  },
  featureCheck: {
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #14b8a6, #0f766e)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 900,
    flexShrink: 0,
    marginTop: '1px',
  },
  featureText: {
    color: 'rgba(11,36,32,0.75)',
    lineHeight: 1.6,
  },
};

export default function HomePage() {
  useSEO({ path: '/', ...ROUTE_SEO['/'] });
  return (
    <>
      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section className="hero">
        {/* Layered background */}
        <div className="hero-blobs" aria-hidden="true">
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <div className="hero-blob hero-blob-3" />
        </div>

        {/* Subtle dot grid overlay */}
        <div className="hero-grid-overlay" aria-hidden="true" />

        <div className="container">
          <div className="hero-two-col">

            {/* ── LEFT: Copy ───────────────────────────────── */}
            <div className="hero-copy-col">

              {/* Live badge */}
              <div className="hero-badge">
                <span className="hero-badge-dot" />
                Clinical mental health · India
                <span className="hero-badge-sep" aria-hidden="true">·</span>
                <span className="hero-badge-new">Private by design</span>
              </div>

              {/* Headline */}
              <h1 className="hero-title">
                Mental health care that feels{' '}
                <span className="hero-title-highlight">
                  <span className="gradient-text">calm</span>
                  <svg className="hero-underline-svg" viewBox="0 0 220 12" fill="none" aria-hidden="true">
                    <path d="M2 9 C 50 3, 140 14, 218 6" stroke="url(#ugrad)" strokeWidth="3.5" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="ugrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#2dd4bf"/>
                        <stop offset="100%" stopColor="#0f766e"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                {', '}private &amp; clinical&#8209;grade.
              </h1>

              {/* Sub-copy */}
              <p className="hero-lead">
                Secure video, audio, or chat consultations with licensed
                psychiatrists and psychologists — structured intake,
                validated assessments, and continuity of care. All from home.{' '}
                <Link to="/online-psychiatrist-consultation-india" style={{ color: 'inherit', textDecoration: 'underline' }}>
                  Online psychiatrist consultation in India
                </Link>
                {' '}— learn how it works.
              </p>

              {/* CTAs */}
              <div className="hero-actions">
                <Link className="btn btn-primary btn-lg" to="/book">
                  Book an appointment
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <Link className="btn btn-ghost btn-lg" to="/screening">
                  Self-screening quiz
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TRUST STRIP
      ══════════════════════════════════════════════════ */}
      <div className="container">
        <div className="stats-row">
          <div className="stat-item">
            <div className="stat-value" style={{ fontSize: 22 }}>✔︎</div>
            <div className="stat-label">Verified clinical professionals</div>
          </div>
          <div className="stat-divider" aria-hidden="true" />
          <div className="stat-item">
            <div className="stat-value" style={{ fontSize: 22 }}>📋</div>
            <div className="stat-label">Structured intake and follow-up</div>
          </div>
          <div className="stat-divider" aria-hidden="true" />
          <div className="stat-item">
            <div className="stat-value" style={{ fontSize: 22 }}>🔒</div>
            <div className="stat-label">Private video, audio, and chat care</div>
          </div>
        </div>
        <p
          className="muted"
          style={{
            textAlign: 'center',
            marginTop: 18,
            fontSize: 13,
            maxWidth: 640,
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.6,
          }}
        >
          What you can verify before booking: clinician profile and qualification,
          consultation mode and exact fee before confirmation, plain-language privacy
          policy, and a clear follow-up pathway after your first session.
        </p>
        <p
          className="muted"
          style={{
            textAlign: 'center',
            marginTop: 10,
            fontSize: 12.5,
            maxWidth: 640,
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.55,
            fontStyle: 'italic',
          }}
        >
          Serenest is not an emergency service. If you or someone else is at immediate
          risk, contact local emergency services or a crisis helpline right away.
        </p>
      </div>

      {/* ══════════════════════════════════════════════════
          SERVICES
      ══════════════════════════════════════════════════ */}
      <section className="section" id="services">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">What we offer</div>
            <h2>Care formats built for you</h2>
            <p>
              Choose the consultation mode that fits your life. Everything is
              clinically grounded and built for continuity.
            </p>
          </div>

          <div className="grid-3">
            <article className="tile">
              <div className="tile-icon">🎥</div>
              <h3>Video Consultations</h3>
              <p>
                Face-to-face sessions with a psychiatrist or psychologist
                from home. Secure, private, and fully clinical.
              </p>
            </article>

            <article className="tile">
              <div className="tile-icon">🎙️</div>
              <h3>Audio Sessions</h3>
              <p>
                Voice-only calls for those who prefer it. Same clinical
                quality, with added privacy and comfort.
              </p>
            </article>

            <article className="tile">
              <div className="tile-icon">💬</div>
              <h3>Chat Consultations</h3>
              <p>
                Typed consultations ideal for those who find writing easier
                than speaking. Structured and asynchronous-friendly.
              </p>
            </article>

            <article className="tile">
              <div className="tile-icon">📋</div>
              <h3>Clinical Assessments</h3>
              <p>
                PHQ-9, GAD-7, intake forms, and custom assessments that
                guide care planning and track your progress over time.
              </p>
            </article>

            <article className="tile">
              <div className="tile-icon">🔁</div>
              <h3>Follow-up &amp; Continuity</h3>
              <p>
                Care plans, prescription follow-ups, and easy re-booking
                so your mental health care never lapses.
              </p>
            </article>

            <article className="tile">
              <div className="tile-icon">🧪</div>
              <h3>Self-Screening</h3>
              <p>
                Not sure where to start? Take a quick, evidence-based
                screening to find the right path forward.
              </p>
              <Link
                to="/screening"
                style={{ display: 'inline-flex', marginTop: 14, fontSize: 13, fontWeight: 700, color: 'var(--teal-700)' }}
              >
                Start screening →
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOR ORGANISATIONS
      ══════════════════════════════════════════════════ */}
      <section className="section alt" id="organisations">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">Beyond individual care</div>
            <h2>Mental health programmes for organisations</h2>
            <p>
              We partner with corporates, schools, and colleges to bring
              structured, stigma-free mental health support to entire communities.
            </p>
          </div>

          <div className="org-cards">

            {/* Corporate */}
            <div className="org-card org-card-corporate">
              <div className="org-card-top">
                <div className="org-icon">🏢</div>
                <div className="org-tag">Corporate</div>
              </div>
              <h3>Workplace Mental Health</h3>
              <p>
                Burnout, anxiety, and stress cost organisations billions each
                year. We offer confidential telepsychiatry, EAP-style
                counselling, and group wellness workshops tailored to your
                workforce.
              </p>
              <ul className="org-features">
                <li>Confidential 1-on-1 sessions for employees</li>
                <li>Manager mental health training</li>
                <li>Anonymous team wellbeing assessments</li>
                <li>Dedicated psychiatry hours per month</li>
              </ul>
              <a className="btn btn-ghost btn-sm org-cta" href="mailto:support@serenest.in?subject=Corporate%20Enquiry">
                Enquire for your company →
              </a>
            </div>

            {/* Schools */}
            <div className="org-card org-card-school">
              <div className="org-card-top">
                <div className="org-icon">🏫</div>
                <div className="org-tag">Schools</div>
              </div>
              <h3>Student &amp; Staff Wellbeing</h3>
              <p>
                Young students face academic pressure, social anxiety, and
                developmental challenges. Our school programme provides
                accessible, age-appropriate psychiatric care for students
                and counselling for teaching staff.
              </p>
              <ul className="org-features">
                <li>Child &amp; adolescent psychiatry specialists</li>
                <li>Parental guidance sessions</li>
                <li>Learning disability &amp; ADHD assessments</li>
                <li>Staff mental wellness support</li>
              </ul>
              <a className="btn btn-ghost btn-sm org-cta" href="mailto:support@serenest.in?subject=School%20Enquiry">
                Enquire for your school →
              </a>
            </div>

            {/* Colleges */}
            <div className="org-card org-card-college">
              <div className="org-card-top">
                <div className="org-icon">🎓</div>
                <div className="org-tag">Colleges &amp; Universities</div>
              </div>
              <h3>Campus Mental Health</h3>
              <p>
                College is when many mental health conditions first emerge.
                We embed telepsychiatry into campus life — providing students
                with on-demand consultations and structured follow-ups,
                without waitlists.
              </p>
              <ul className="org-features">
                <li>On-demand appointments for students</li>
                <li>Depression, anxiety &amp; substance use support</li>
                <li>Crisis triage &amp; referral pathways</li>
                <li>Anonymous mental health pulse surveys</li>
              </ul>
              <a className="btn btn-ghost btn-sm org-cta" href="mailto:support@serenest.in?subject=College%20Enquiry">
                Enquire for your institution →
              </a>
            </div>

          </div>

          {/* Bottom CTA */}
          <div className="org-bottom-cta">
            <p>
              Want a custom programme? Every organisation is different — we'll
              build a plan that fits your size, budget, and goals.
            </p>
            <a className="btn btn-primary" href="mailto:support@serenest.in?subject=Organisation%20Partnership">
              Request a partnership consultation →
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════ */}
      <section className="section alt" id="how">
        <div className="container">
          <div style={s.sectionTwoCol}>
            <div className="section-head" style={{ marginBottom: 0 }}>
              <div className="section-kicker">Simple process</div>
              <h2>From first step to follow-up</h2>
              <p>
                We removed the complexity from getting mental health care. It
                takes just minutes to go from sign-up to your first session.
              </p>
              <div style={{ marginTop: 28 }}>
                <Link className="btn btn-primary" to="/book">
                  Get started today →
                </Link>
              </div>
            </div>

            <ol className="steps" aria-label="How it works">
              <li className="step">
                <div className="step-num" aria-hidden="true">1</div>
                <div className="step-body">
                  <strong>Screen yourself</strong>
                  <p>
                    Answer a few quick questions to understand your needs and
                    find the right kind of care.
                  </p>
                </div>
              </li>

              <li className="step">
                <div className="step-num" aria-hidden="true">2</div>
                <div className="step-body">
                  <strong>Book an appointment</strong>
                  <p>
                    Browse verified psychiatrists and psychologists,
                    choose a slot that works for you, and confirm in seconds.
                  </p>
                </div>
              </li>

              <li className="step">
                <div className="step-num" aria-hidden="true">3</div>
                <div className="step-body">
                  <strong>Consult your doctor</strong>
                  <p>
                    Join your video, audio, or chat session. Your doctor
                    takes structured notes throughout.
                  </p>
                </div>
              </li>

              <li className="step">
                <div className="step-num" aria-hidden="true">4</div>
                <div className="step-body">
                  <strong>Stay consistent</strong>
                  <p>
                    Track symptoms, manage follow-ups, and maintain the
                    continuity of care that produces real outcomes.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TRUST & PRIVACY
      ══════════════════════════════════════════════════ */}
      <section className="section" id="trust">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">Safety first</div>
            <h2>Privacy and security you can trust</h2>
            <p>
              Mental health data is the most sensitive kind. We built
              Serenest from the ground up to protect it.
            </p>
          </div>

          <div className="trust-grid">
            <div className="trust-card">
              <div className="trust-icon">🔐</div>
              <div>
                <h3>End-to-end secure sessions</h3>
                <p>
                  All consultation sessions are encrypted. Only you and your
                  doctor can access the content of your sessions.
                </p>
              </div>
            </div>

            <div className="trust-card">
              <div className="trust-icon">🛡️</div>
              <div>
                <h3>Minimal data access</h3>
                <p>
                  We follow a least-access principle. Your records are
                  visible only to your direct care team and authorized
                  admins per policy.
                </p>
              </div>
            </div>

            <div className="trust-card">
              <div className="trust-icon">📄</div>
              <div>
                <h3>Transparent privacy policy</h3>
                <p>
                  Plain-language policies — no legalese. You always know
                  exactly what data we hold and why.
                </p>
              </div>
            </div>

            <div className="trust-card">
              <div className="trust-icon">🏛️</div>
              <div>
                <h3>Compliant with Indian standards</h3>
                <p>
                  We align with India's telemedicine guidelines and follow
                  international data protection best practices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOR PROFESSIONALS
      ══════════════════════════════════════════════════ */}
      <section className="section alt">
        <div className="container">
          <div style={{ ...s.sectionTwoCol, gap: '56px' }}>
            <div>
              <div className="section-kicker">For professionals</div>
              <h2 style={{ marginBottom: 16 }}>
                A clinician-first platform
              </h2>
              <p className="about-body" style={{ marginBottom: 28 }}>
                Serenest isn&apos;t a generic telehealth tool. It&apos;s designed
                for psychiatrists and psychologists alike — structured intake,
                clinical note-taking, assessments, and follow-up management.
              </p>

              <ul style={s.featureList}>
                {[
                  'Structured patient intake and history',
                  'Integrated PHQ-9, GAD-7 and custom assessments',
                  'Session notes tied directly to patient records',
                  'Easy re-scheduling and follow-up management',
                  'Flexible schedule — work when you want',
                  'Timely, transparent compensation',
                ].map((text) => (
                  <li key={text} style={s.featureItem}>
                    <span style={s.featureCheck}>✓</span>
                    <span style={s.featureText}>{text}</span>
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
                <Link className="btn btn-primary" to="/professionals/apply">
                  Apply as a professional →
                </Link>
                <Link className="btn btn-ghost" to="/professionals">
                  Learn more
                </Link>
              </div>
            </div>

            <div
              style={{
                background: 'linear-gradient(160deg, var(--teal-700), var(--teal-900))',
                borderRadius: 'var(--r-xl)',
                padding: '40px 36px',
                color: '#fff',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 16 }}>🧠</div>
              <h3 style={{ color: '#fff', fontSize: 22, marginBottom: 12 }}>
                Clinical tools that respect your time
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 15, lineHeight: 1.7 }}>
                Fewer admin tasks. More time with patients. Serenest handles
                scheduling, intake, documentation and billing so you can
                focus entirely on clinical care.
              </p>
              <div
                style={{
                  marginTop: 28,
                  padding: '16px',
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: 'var(--r-md)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.85)',
                  lineHeight: 1.65,
                  fontStyle: 'italic',
                }}
              >
                "A clean flow from intake to follow-up. It feels structured,
                not like a generic chat app."
                <div style={{ marginTop: 10, fontStyle: 'normal', fontWeight: 700, color: 'var(--teal-300)', fontSize: 12 }}>
                  — Psychologist, Mumbai
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════ */}
      <section className="section" aria-label="Testimonials">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">What people say</div>
            <h2>Designed for real clinical practice</h2>
          </div>

          <div className="grid-3">
            <div className="quote">
              <div className="quote-mark" aria-hidden="true">"</div>
              <p className="quote-text">
                A clean flow from intake to follow-up. It feels structured,
                not like a chat app. This is how telepsychiatry should work — and therapy too.
              </p>
              <div className="quote-by">Clinical psychologist · India</div>
            </div>

            <div className="quote">
              <div className="quote-mark" aria-hidden="true">"</div>
              <p className="quote-text">
                The experience is calm. Less friction, more clarity. That
                matters so much when you're already dealing with anxiety.
              </p>
              <div className="quote-by">Patient · Bangalore</div>
            </div>

            <div className="quote">
              <div className="quote-mark" aria-hidden="true">"</div>
              <p className="quote-text">
                Assessments, notes, and continuity in one place — built
                with the right intent. Finally, a platform that understands
                clinical workflows.
              </p>
              <div className="quote-by">Clinic administrator</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════════ */}
      <section className="section alt" id="contact">
        <div className="container">
          <div className="cta-banner">
            <div className="cta-banner-body">
              <h2>Ready to start your care journey?</h2>
              <p>
                Book your first appointment today — same-day slots are often
                available. Questions first? We're here to help.
              </p>
              <p style={{ marginTop: 8, fontSize: 14, color: 'rgba(255,255,255,0.60)' }}>
                Email:{' '}
                <a
                  href="mailto:support@serenest.in"
                  style={{ color: 'rgba(255,255,255,0.80)', textDecoration: 'underline' }}
                >
                  support@serenest.in
                </a>
              </p>
            </div>

            <div className="cta-banner-actions">
              <Link className="btn btn-primary btn-lg" to="/book">
                Book an appointment →
              </Link>
              <a
                className="btn btn-outline btn-lg"
                href="mailto:support@serenest.in"
              >
                Email us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
