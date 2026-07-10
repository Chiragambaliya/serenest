import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { HOME_FEATURED_GUIDES } from '../lib/guides';
import { useAuth } from '../lib/useAuth';
import { useReveal } from '../hooks/useReveal';

const PATHS = [
  { title: 'Book a session', body: 'Video, audio, or chat with a verified clinician.', to: '/book' },
  { title: 'Self-screening', body: 'PHQ-9 and GAD-7 before you decide to book.', to: '/screening' },
  { title: 'Find a clinician', body: 'Browse approved professionals by role and language.', to: '/patient/find-professional' },
];

export default function HomePage() {
  useSEO({ path: '/', ...ROUTE_SEO['/'] });
  const { user, loading: authLoading } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const revealRef = useReveal();

  useEffect(() => {
    if (authLoading || user) return;
    if (localStorage.getItem('serenest_portal_seen')) return;
    const t = setTimeout(() => setModalOpen(true), 2800);
    return () => clearTimeout(t);
  }, [authLoading, user]);

  function closeModal() {
    localStorage.setItem('serenest_portal_seen', '1');
    setModalOpen(false);
  }

  return (
    <div className="odd odd-clean" ref={revealRef}>
      {modalOpen ? (
        <div className="odd-modal-bg" onClick={closeModal} role="presentation">
          <div className="odd-modal odd-modal-anim" role="dialog" aria-labelledby="odd-portal-title" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="odd-x" aria-label="Close" onClick={closeModal}>×</button>
            <p className="odd-eyebrow">Patient portal</p>
            <h2 id="odd-portal-title">Your care file</h2>
            <p>Appointments and follow-ups in one place.</p>
            <div className="odd-modal-actions">
              <Link to="/patient/login" state={{ mode: 'signup' }} onClick={closeModal} className="odd-btn odd-btn-dark">
                Create account
              </Link>
              <button type="button" className="odd-textlink" onClick={closeModal}>Continue browsing</button>
            </div>
          </div>
        </div>
      ) : null}

      <section className="odd-hero odd-hero-clean odd-hero-cinematic">
        <div className="odd-hero-bg" aria-hidden="true">
          <picture>
            <source
              type="image/webp"
              srcSet="/serenest-hero-atmosphere-sm.webp 1280w, /serenest-hero-atmosphere.webp 1920w"
              sizes="100vw"
            />
            <img
              src="/serenest-hero-atmosphere.jpg"
              alt=""
              width={1920}
              height={1080}
              decoding="async"
              fetchPriority="high"
              className="odd-hero-img-anim"
            />
          </picture>
          <div className="odd-hero-veil" />
          <div className="odd-hero-glow" />
        </div>

        <div className="odd-hero-stage">
          <p className="odd-hero-brand odd-hero-enter" style={{ '--d': '40ms' }}>
            Serenest
          </p>
          <h1 className="odd-hero-h odd-hero-enter" style={{ '--d': '140ms' }}>
            Clinical mental health care, online across India.
          </h1>
          <p className="odd-hero-sub odd-hero-enter" style={{ '--d': '240ms' }}>
            Verified psychiatrists and psychologists. Private sessions. Care that continues after the first visit.
          </p>
          <div className="odd-hero-row odd-hero-enter" style={{ '--d': '340ms' }}>
            <Link className="odd-btn odd-btn-light odd-btn-lift" to="/book">Book a session</Link>
            <Link className="odd-btn odd-btn-ghost odd-btn-lift" to="/screening">Take a screening</Link>
          </div>
          <p className="odd-hero-warn odd-hero-enter" style={{ '--d': '440ms' }}>
            Not for emergencies. Use local emergency services if you are at immediate risk.
          </p>
        </div>

        <div className="odd-hero-scroll odd-hero-enter" style={{ '--d': '560ms' }} aria-hidden="true">
          <span>Scroll</span>
          <i />
        </div>
      </section>

      <section className="odd-block" data-reveal>
        <div className="odd-wrap">
          <header className="odd-head">
            <p className="odd-eyebrow">Start here</p>
            <h2 className="odd-h2">Three clear paths</h2>
          </header>
          <div className="odd-paths">
            {PATHS.map((p, i) => (
              <Link
                key={p.to}
                to={p.to}
                className="odd-path-card odd-card-lift"
                style={{ '--stagger': `${i * 70}ms` }}
                data-reveal
              >
                <span className="odd-path-n">0{i + 1}</span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="odd-block odd-block-soft" data-reveal>
        <div className="odd-wrap odd-why">
          <header className="odd-head">
            <p className="odd-eyebrow">Why Serenest</p>
            <h2 className="odd-h2">Built like a clinic — not a chat app</h2>
          </header>
          <ul className="odd-why-list">
            <li data-reveal style={{ '--stagger': '0ms' }}>Clinicians are reviewed before they practise here</li>
            <li data-reveal style={{ '--stagger': '60ms' }}>Sessions are private, with careful clinical records</li>
            <li data-reveal style={{ '--stagger': '120ms' }}>Follow-ups stay connected after the first visit</li>
          </ul>
        </div>
      </section>

      <section className="odd-block" data-reveal>
        <div className="odd-wrap">
          <header className="odd-head">
            <p className="odd-eyebrow">Platform</p>
            <h2 className="odd-h2">Care, professionals, and learning</h2>
          </header>
          <div className="odd-links">
            <Link to="/services" className="odd-link-row" data-reveal style={{ '--stagger': '0ms' }}>
              <strong>Clinical care</strong>
              <span>Psychiatry, therapy, counselling</span>
            </Link>
            <Link to="/professionals" className="odd-link-row" data-reveal style={{ '--stagger': '50ms' }}>
              <strong>For professionals</strong>
              <span>Join Serenest and practise online</span>
            </Link>
            <Link to="/academy" className="odd-link-row" data-reveal style={{ '--stagger': '100ms' }}>
              <strong>Academy</strong>
              <span>Learning hub for joined clinicians</span>
            </Link>
            <Link to="/about" className="odd-link-row" data-reveal style={{ '--stagger': '150ms' }}>
              <strong>About</strong>
              <span>Doctor-led care from Serenest Education Pvt Ltd</span>
            </Link>
          </div>
        </div>
      </section>

      {HOME_FEATURED_GUIDES?.length ? (
        <section className="odd-block odd-block-soft" data-reveal>
          <div className="odd-wrap">
            <header className="odd-head">
              <p className="odd-eyebrow">Guides</p>
              <h2 className="odd-h2">Read before you book</h2>
            </header>
            <div className="odd-guides-clean">
              {HOME_FEATURED_GUIDES.slice(0, 3).map((g, i) => (
                <Link
                  key={g.path}
                  to={g.path}
                  className="odd-guide-clean odd-card-lift"
                  data-reveal
                  style={{ '--stagger': `${i * 70}ms` }}
                >
                  <h3>{g.title}</h3>
                  <p>{g.description}</p>
                </Link>
              ))}
            </div>
            <Link className="odd-textlink" to="/blog">All guides →</Link>
          </div>
        </section>
      ) : null}

      <section className="odd-end odd-end-clean" data-reveal>
        <div className="odd-wrap">
          <h2 className="odd-h2 odd-h2-light">Ready when you are</h2>
          <p className="odd-end-copy">Book a verified clinician, or start with a short screening.</p>
          <div className="odd-hero-row">
            <Link className="odd-btn odd-btn-light odd-btn-lift" to="/book">Book now</Link>
            <Link className="odd-btn odd-btn-ghost odd-btn-lift" to="/professionals">Join as a professional</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
