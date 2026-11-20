import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { useAuth } from '../lib/useAuth';
import { SPECIALTY_GROUPS } from './specialties';

const PATHS = [
  ['01', 'Request a specialist', 'Name, number, specialty, and a preferred time. We confirm before you pay.', '/book', 'Book'],
  ['02', 'Choose a clinician', 'Browse verified clinicians by specialty, city, and fee.', '/patient/find-professional', 'Browse'],
  ['03', 'Start with a private check', 'Mood, anxiety, and stress checks stay on this device. They are not a diagnosis.', '/screening', 'Screen'],
];

const MENU = [
  { to: '/services', label: 'Services' },
  { to: '/patient/find-professional', label: 'Clinicians' },
  { to: '/screening', label: 'Screening' },
  { to: '/pricing', label: 'Fees' },
  { to: '/book', label: 'Book an appointment' },
];

function Leaf({ className }) {
  return (
    <svg className={className} viewBox="0 0 86 46" aria-hidden="true">
      <path d="M4 30c18 6 34-16 78-22-22 8-28 28-74 26Z" fill="currentColor" />
      <path d="M12 30c18-2 36-12 62-16" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.55" />
    </svg>
  );
}

export default function HomePage() {
  useSEO({ path: '/', ...ROUTE_SEO['/'] });
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const account = user ? '/patient/dashboard' : '/patient/login';

  useEffect(() => {
    if (!open) return undefined;
    function onKey(event) {
      if (event.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <section className="care-stage" aria-labelledby="care-hero-title">
        <div className="care-stage__bar">
          <button
            type="button"
            className="care-orb"
            aria-expanded={open}
            aria-controls="home-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="care-orb__icon" aria-hidden="true" />
            <span>Menu</span>
          </button>
          <Link className="care-stage__contact" to="/contact">Contact</Link>
        </div>
        {open && (
          <nav className="care-stage__menu" id="home-menu" aria-label="Care">
            {MENU.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setOpen(false)}>{item.label}</Link>
            ))}
            <Link to={account} onClick={() => setOpen(false)}>{user ? 'Account' : 'Sign in'}</Link>
          </nav>
        )}

        <div className="care-stage__lockup">
          <span className="care-stage__mark" aria-hidden="true">S</span>
          <h1 id="care-hero-title">
            <span>Every</span>
            <span>Specialist</span>
          </h1>
          <img
            className="care-stage__object"
            src="/images/care-focal-stethoscope.png"
            alt=""
          />
          <Leaf className="care-leaf care-leaf--right" />
          <Leaf className="care-leaf care-leaf--left" />
        </div>

        <p className="care-stage__facts">
          <span>Verified clinicians</span>
          <span>Every specialty</span>
          <span>Pay after confirm</span>
        </p>
        <a className="care-discover" href="#start">Discover</a>
        <Leaf className="care-leaf care-leaf--fore" />
      </section>

      <div className="care-shell">
        <nav className="care-pagenav" aria-label="On this page">
          <a href="#start">How to start</a>
          <a href="#specialists">Specialists</a>
          <a href="#fees">Fees</a>
        </nav>

        <section className="care-section" id="start">
          <p className="care-kicker">Begin</p>
          <h2>Three ways into care.</h2>
          <p className="care-lede">
            Book a physician, surgeon, psychiatrist, or therapist. Serenest confirms the clinician and the time before you pay.
          </p>
          <div className="care-index">
            {PATHS.map(([num, title, body, href, cta]) => (
              <Link key={num} to={href}>
                <span className="care-index__num">{num}</span>
                <h3>{title}</h3>
                <p>{body}</p>
                <span className="care-index__go">{cta} →</span>
              </Link>
            ))}
          </div>
          <p className="care-note">Not for emergencies. If someone is at immediate risk, contact local emergency services.</p>
        </section>

        <section className="care-section" id="specialists">
          <p className="care-kicker">Specialists</p>
          <h2>Not psychiatry alone.</h2>
          <p>Mental health stays. Medicine and surgery are part of the same booking list.</p>
          {SPECIALTY_GROUPS.map((group) => (
            <div key={group.id}>
              <p className="care-kicker">{group.label}</p>
              <div className="care-index">
                {group.specialties.slice(0, group.id === 'medicine' ? 6 : 4).map((item, i) => (
                  <Link key={item.id} to={`/book?prole=${item.id}`}>
                    <span className="care-index__num">{String(i + 1).padStart(2, '0')}</span>
                    <h3>{item.label}</h3>
                    <p>Request a {item.label.toLowerCase()} consultation.</p>
                    <span className="care-index__go">Book →</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="care-actions">
            <Link className="care-btn care-btn--ghost" to="/services">All specialties</Link>
          </div>
        </section>

        <section className="care-section" id="fees">
          <p className="care-kicker">Fees</p>
          <h2>You pay after we confirm.</h2>
          <p>Session fees are set by the clinician. A request does not charge you.</p>
          <div className="care-actions">
            <Link className="care-btn care-btn--primary" to="/pricing">See fees</Link>
            <Link className="care-btn care-btn--ghost" to="/screening">Private check-in</Link>
          </div>
        </section>
      </div>
    </>
  );
}
