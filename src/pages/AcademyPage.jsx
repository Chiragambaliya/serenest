import React, { useId } from 'react';
import { Link } from 'react-router-dom';

// Logo used in Academy hero — inherits the main Serenest brand so the merged
// shell looks coherent (the standalone education-site used a separate indigo
// gradient; here we share the teal brand mark with the rest of the app).
function AcademyLogoMark({ size = 40 }) {
  const uid = useId().replace(/:/g, '_');
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`acad-grad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7fe8d8" />
          <stop offset="38%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#0d6d63" />
        </linearGradient>
        <linearGradient id={`acad-gloss-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="42%" stopColor="#fff" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="2.5" y="2.5" width="43" height="43" rx="11.5" fill={`url(#acad-grad-${uid})`} />
      <rect x="2.5" y="2.5" width="43" height="22" rx="11.5" fill={`url(#acad-gloss-${uid})`} />
      <text
        x="24"
        y="24"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#fff"
        fontFamily="DM Sans, ui-sans-serif, system-ui, sans-serif"
        fontSize="26.5"
        fontWeight="800"
        letterSpacing="-0.05em"
      >
        S
      </text>
    </svg>
  );
}

export default function AcademyPage() {
  return (
    <div className="ed-page">
      <section className="ed-hero">
        <div className="container">
          <div className="ed-hero-brandline">
            <AcademyLogoMark size={44} />
            <div className="ed-hero-brandstack">
              <span className="ed-brand-name">Serenest Academy</span>
              <span className="ed-brand-tag">Literacy &amp; learning · part of Serenest</span>
            </div>
          </div>

          <p className="ed-kicker">Serenest Academy · Serenest Education Pvt Ltd</p>
          <h1 className="ed-hero-title">
            Mental health learning —{' '}
            <span className="ed-gradient">clear, respectful, and grounded in care.</span>
          </h1>
          <p className="ed-hero-lead">
            Serenest Academy is the literacy &amp; learning side of Serenest: explainers, learning tracks
            (pharmacology &amp; psychology), partnerships, and outreach. It lives alongside our clinical
            telepsychiatry — so understanding and care are one click apart, not one website apart.
          </p>
          <div className="ed-hero-actions">
            <a className="btn btn-primary btn-lg" href="#learn">
              Explore programmes →
            </a>
            <Link className="btn btn-ghost btn-lg" to="/book">
              Need an appointment? Book a consultation →
            </Link>
          </div>
        </div>
      </section>

      <section id="learn" className="ed-section">
        <div className="container">
          <div className="ed-section-head">
            <p className="ed-section-label">What we publish</p>
            <h2>Built for understanding — not as a substitute for assessment</h2>
            <p className="ed-muted">
              Serenest Academy helps people recognise symptoms, reduce stigma, and take the next step.
              Diagnosis and treatment belong with licensed clinicians on Serenest. For clinicians,
              structured learning is split into <strong>pharmacology</strong> and <strong>psychology</strong>{' '}
              tracks.
            </p>
          </div>

          <div id="tracks" className="ed-anchor-target" />

          <div className="ed-grid">
            <article className="ed-card">
              <div className="ed-card-icon" aria-hidden="true">📚</div>
              <h3>Articles &amp; guides</h3>
              <p>
                Plain-language explainers on conditions, coping skills, and help-seeking — aligned with
                Indian contexts where we work.
              </p>
              <p className="ed-card-cta">
                <Link className="ed-link-arrow" to="/blog">
                  Read the blog →
                </Link>
              </p>
            </article>

            <article className="ed-card">
              <div className="ed-card-icon" aria-hidden="true">💊</div>
              <h3>Pharmacology learning</h3>
              <p>
                For prescribers and trainees: telemedicine norms, prescribing conversations, SOAP &amp; Rx
                workflow, continuity between visits, and safety documentation.
              </p>
              <p className="ed-card-cta">
                <Link
                  className="ed-link-arrow"
                  to="/professionals/learning#learning-pharmacology"
                >
                  Open pharmacology track →
                </Link>
              </p>
            </article>

            <article className="ed-card">
              <div className="ed-card-icon" aria-hidden="true">🧠</div>
              <h3>Psychology learning</h3>
              <p>
                Assessment tools (e.g. PHQ-9 / GAD-7), psychoeducation, behavioural topics, stigma-aware
                language, and carer skills — curated modules on the learning hub.
              </p>
              <p className="ed-card-cta">
                <Link
                  className="ed-link-arrow"
                  to="/professionals/learning#learning-psychology"
                >
                  Open psychology track →
                </Link>
              </p>
            </article>

            <article className="ed-card">
              <div className="ed-card-icon" aria-hidden="true">🤝</div>
              <h3>Schools &amp; workplaces</h3>
              <p>
                Talks, workshops, and collaborations that prioritise psychological safety and verified
                information.
              </p>
              <p className="ed-card-cta">
                <a
                  className="ed-link-arrow"
                  href="mailto:support@serenest.fit?subject=Serenest%20Academy%20%E2%80%94%20partnership"
                >
                  Start a conversation →
                </a>
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="audiences" className="ed-section ed-section-alt">
        <div className="container">
          <div className="ed-section-head">
            <p className="ed-section-label">Who it&apos;s for</p>
            <h2>Three doors into the same mission</h2>
          </div>
          <ul className="ed-list">
            <li>
              <strong>Public readers</strong> — reduce stigma, learn vocabulary, know when to seek care.
            </li>
            <li>
              <strong>Clinicians &amp; educators</strong> — follow{' '}
              <Link to="/professionals/learning#learning-pharmacology">pharmacology</Link> or{' '}
              <Link to="/professionals/learning#learning-psychology">psychology</Link> tracks on the
              clinician learning hub.
            </li>
            <li>
              <strong>Organisations</strong> — partner with us on stigma-aware programmes tailored to your
              team.
            </li>
          </ul>
          <p className="ed-muted ed-note">
            Content offerings will expand here over time. Clinical workflows (booking, screening, video
            consultations) live under the same Serenest roof — privacy and regulation stay sharp because
            those routes are protected, not because they&apos;re on a different domain.
          </p>
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
                Academy and clinical share the same brand, the same team, and now the same site.
              </p>
              <p className="ed-muted">
                Serenest Education Pvt Ltd publishes Serenest Academy and operates Serenest clinical;
                merging the sites keeps the journey from learning → screening → booking unbroken.
              </p>
              <div className="ed-split-actions">
                <Link className="btn btn-primary" to="/book">
                  Book an appointment →
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
              href="mailto:support@serenest.fit?subject=Serenest%20Academy%20%E2%80%94%20partnership"
            >
              Email Serenest Academy →
            </a>
            <Link className="btn btn-ghost btn-lg btn-full" to="/professionals">
              Clinical / professional enquiries →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
