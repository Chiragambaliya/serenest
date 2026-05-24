import React, { useEffect, useState, useCallback } from 'react';

const CARE_SITE =
  (typeof import.meta.env.VITE_SERENEST_CARE_URL === 'string' &&
    import.meta.env.VITE_SERENEST_CARE_URL.trim()) ||
  'https://serenest.in';

const LEARNING_HUB = `${CARE_SITE.replace(/\/$/, '')}/professionals/learning`;

function LogoMark({ size = 40 }) {
  const gid = React.useId().replace(/:/g, '_');
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={`ed-grad-${gid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8ba8ff" />
          <stop offset="45%" stopColor="#4f6ab8" />
          <stop offset="100%" stopColor="#1e3a5f" />
        </linearGradient>
        <linearGradient id={`ed-gloss-${gid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="42%" stopColor="#fff" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="2.5" y="2.5" width="43" height="43" rx="11.5" fill={`url(#ed-grad-${gid})`} />
      <rect x="2.5" y="2.5" width="43" height="22" rx="11.5" fill={`url(#ed-gloss-${gid})`} />
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

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <div className="ed-root">
      <a className="ed-skip" href="#main">
        Skip to content
      </a>

      <header className="ed-header">
        <div className="ed-container ed-header-inner">
          <a className="ed-brand" href="/" aria-label="Serenest Education — Home">
            <LogoMark size={38} />
            <span className="ed-brand-text">
              <span className="ed-brand-name">Serenest Education</span>
              <span className="ed-brand-tag">Literacy &amp; learning</span>
            </span>
          </a>

            <nav className="ed-nav" aria-label="Primary">
            <a href="#learn">What we publish</a>
            <a href="#tracks">Learning tracks</a>
            <a href="#audiences">Who it&apos;s for</a>
            <a href="#clinical">Clinical care</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className="ed-header-actions">
            <a className="ed-btn ed-btn-ghost ed-hide-mobile" href={CARE_SITE}>
              Serenest clinical →
            </a>
            <button
              type="button"
              className={`ed-menu-btn ${menuOpen ? 'is-open' : ''}`}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="ed-menu-bars" aria-hidden="true" />
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div className="ed-menu-overlay" role="presentation" onClick={closeMenu}>
            <aside className="ed-drawer" onClick={(e) => e.stopPropagation()}>
              <nav className="ed-drawer-links" aria-label="Mobile">
                <a href="#learn" onClick={closeMenu}>
                  What we publish
                </a>
                <a href="#tracks" onClick={closeMenu}>
                  Learning tracks
                </a>
                <a href="#audiences" onClick={closeMenu}>
                  Who it&apos;s for
                </a>
                <a href="#clinical" onClick={closeMenu}>
                  Clinical care (Serenest)
                </a>
                <a href="#contact" onClick={closeMenu}>
                  Contact
                </a>
                <a className="ed-btn ed-btn-primary ed-btn-full" href={CARE_SITE} onClick={closeMenu}>
                  Go to Serenest clinical →
                </a>
              </nav>
            </aside>
          </div>
        ) : null}
      </header>

      <main id="main">
        <section className="ed-hero">
          <div className="ed-container">
            <p className="ed-kicker">Serenest Education Pvt Ltd</p>
            <h1 className="ed-hero-title">
              Mental health education —{' '}
              <span className="ed-gradient">clear, respectful, and independent of a booking flow.</span>
            </h1>
            <p className="ed-hero-lead">
              This site is home to our literacy work: explainers, learning tracks (pharmacology &amp; psychology),
              partnerships, and outreach.
              Telepsychiatry consultations live on{' '}
              <strong>Serenest</strong>, our separate clinical platform — linked below so you always know where
              care begins.
            </p>
            <div className="ed-hero-actions">
              <a className="ed-btn ed-btn-primary ed-btn-lg" href="#learn">
                Explore programmes →
              </a>
              <a className="ed-btn ed-btn-secondary ed-btn-lg" href={CARE_SITE}>
                Need an appointment? Visit Serenest →
              </a>
            </div>
          </div>
        </section>

        <section id="learn" className="ed-section">
          <div className="ed-container">
            <div className="ed-section-head">
              <p className="ed-section-label">What we publish</p>
              <h2>Built for understanding — not as a substitute for assessment</h2>
              <p className="ed-muted">
                Education helps people recognise symptoms, reduce stigma, and take the next step. Diagnosis and
                treatment belong with licensed clinicians on Serenest. For clinicians, structured learning on Serenest
                is split into <strong>pharmacology</strong> and <strong>psychology</strong> tracks.
              </p>
            </div>

            <div id="tracks" className="ed-anchor-target" />

            <div className="ed-grid">
              <article className="ed-card">
                <div className="ed-card-icon" aria-hidden="true">
                  📚
                </div>
                <h3>Articles &amp; guides</h3>
                <p>Plain-language explainers on conditions, coping skills, and help-seeking — aligned with Indian
                  contexts where we work.</p>
              </article>
              <article className="ed-card">
                <div className="ed-card-icon" aria-hidden="true">
                  💊
                </div>
                <h3>Pharmacology learning</h3>
                <p>For prescribers and trainees: telemedicine norms, prescribing conversations, SOAP &amp; Rx workflow,
                  continuity between visits, and safety documentation — on the Serenest learning hub.</p>
                <p className="ed-card-cta">
                  <a className="ed-link-arrow" href={`${LEARNING_HUB}#learning-pharmacology`}>
                    Open pharmacology track →
                  </a>
                </p>
              </article>
              <article className="ed-card">
                <div className="ed-card-icon" aria-hidden="true">
                  🧠
                </div>
                <h3>Psychology learning</h3>
                <p>Assessment tools (e.g. PHQ-9/GAD-7), psychoeducation, behavioural topics, stigma-aware language,
                  and carer skills — curated modules on Serenest.</p>
                <p className="ed-card-cta">
                  <a className="ed-link-arrow" href={`${LEARNING_HUB}#learning-psychology`}>
                    Open psychology track →
                  </a>
                </p>
              </article>
              <article className="ed-card">
                <div className="ed-card-icon" aria-hidden="true">
                  🤝
                </div>
                <h3>Schools &amp; workplaces</h3>
                <p>Talks, workshops, and collaborations that prioritise psychological safety and verified
                  information.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="audiences" className="ed-section ed-section-alt">
          <div className="ed-container">
            <div className="ed-section-head">
              <p className="ed-section-label">Who it&apos;s for</p>
              <h2>Three doors into the same mission</h2>
            </div>
            <ul className="ed-list">
              <li>
                <strong>Public readers</strong> — reduce stigma, learn vocabulary, know when to seek care.
              </li>
              <li>
                <strong>Clinicians &amp; educators</strong> — follow <strong>pharmacology</strong> or{' '}
                <strong>psychology</strong> modules on the Serenest learning hub (same company; clinical domain).
              </li>
              <li>
                <strong>Organisations</strong> — partner with us on stigma-aware programmes tailored to your team.
              </li>
            </ul>
            <p className="ed-muted ed-note">
              Content offerings will expand here over time; clinical workflows intentionally stay on Serenest so
              privacy and regulation stay sharp.
            </p>
          </div>
        </section>

        <section id="clinical" className="ed-section">
          <div className="ed-container">
            <div className="ed-split">
              <div>
                <p className="ed-section-label">Separate website</p>
                <h2>Serenest (clinical telepsychiatry)</h2>
                <p>
                  Bookings, screening, video consultations, and continuity of care run on{' '}
                  <strong>Serenest</strong> — a dedicated clinical product and domain.
                </p>
                <p className="ed-muted">
                  Serenest Education Pvt Ltd is the company behind both properties; splitting the sites keeps
                  education browsing distinct from protected health workflows.
                </p>
                <div className="ed-split-actions">
                  <a className="ed-btn ed-btn-primary" href={CARE_SITE}>
                    Open Serenest →
                  </a>
                  <a className="ed-btn ed-btn-ghost" href={`${CARE_SITE.replace(/\/$/, '')}/screening`}>
                    Self-screening (on Serenest)
                  </a>
                </div>
              </div>
              <div className="ed-callout" aria-label="Reminder">
                <p className="ed-callout-title">Not sure which site you need?</p>
                <p>If you want an appointment or clinical intake, use Serenest. If you want literacy content or a
                  partnership conversation, you&apos;re in the right place.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="ed-section ed-section-alt">
          <div className="ed-container ed-cta">
            <div>
              <h2 className="ed-cta-title">Partner or collaborate</h2>
              <p className="ed-muted">
                Share goals, audience, and timelines — we read every message and reply when there&apos;s a fit.
              </p>
            </div>
            <div className="ed-cta-actions">
              <a
                className="ed-btn ed-btn-primary ed-btn-lg ed-btn-full"
                href="mailto:support@serenest.in?subject=Serenest%20Education%20%E2%80%94%20partnership"
              >
                Email Serenest Education →
              </a>
              <a className="ed-btn ed-btn-secondary ed-btn-lg ed-btn-full" href={CARE_SITE}>
                Clinical enquiries → Serenest
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="ed-footer">
        <div className="ed-container ed-footer-inner">
          <div className="ed-footer-brand">
            <LogoMark size={32} />
            <div>
              <div className="ed-footer-name">Serenest Education</div>
              <div className="ed-footer-note">Serenest Education Pvt Ltd · Literacy &amp; learning</div>
            </div>
          </div>
          <nav className="ed-footer-nav" aria-label="Footer">
            <a href="#learn">Programmes</a>
            <a href={CARE_SITE}>Serenest clinical</a>
            <a href="mailto:support@serenest.in">support@serenest.in</a>
          </nav>
          <p className="ed-footer-legal">
            © {new Date().getFullYear()} Serenest Education Pvt Ltd. Educational content is informational only and
            does not constitute medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
