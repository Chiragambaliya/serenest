import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { SPECIALTY_GROUPS } from './specialties';

const PATHS = [
  ['01', 'Request a specialist', 'Name, number, specialty, and a preferred time. We confirm before you pay.', '/book', 'Book'],
  ['02', 'Choose a clinician', 'Browse verified clinicians by specialty, city, and fee.', '/patient/find-professional', 'Browse'],
  ['03', 'Start with a private check', 'Mood, anxiety, and stress checks stay on this device. They are not a diagnosis.', '/screening', 'Screen'],
];

export default function HomePage() {
  useSEO({ path: '/', ...ROUTE_SEO['/'] });
  return (
    <div className="care-shell">
      <section className="care-hero" aria-labelledby="care-hero-title">
        <div>
          <p className="care-kicker">Clinical care · Every specialist</p>
          <h1 id="care-hero-title">Care from the specialist you need.</h1>
          <p className="care-lede">
            Book a physician, surgeon, psychiatrist, or therapist. Serenest confirms the clinician and the time. You pay after the appointment is locked.
          </p>
          <div className="care-actions">
            <Link className="care-btn care-btn--primary" to="/book">Book an appointment</Link>
            <Link className="care-btn care-btn--ghost" to="/services">See services</Link>
          </div>
          <p className="care-note">Not for emergencies. If someone is at immediate risk, contact local emergency services.</p>
        </div>
        <figure className="care-figure">
          <img src="/images/editorial/home-consultation-room-v1.jpg" alt="A quiet consulting room in warm daylight" />
          <figcaption>Consulting room · no people</figcaption>
        </figure>
      </section>

      <nav className="care-pagenav" aria-label="On this page">
        <a href="#start">How to start</a>
        <a href="#specialists">Specialists</a>
        <a href="#fees">Fees</a>
      </nav>

      <section className="care-section" id="start">
        <p className="care-kicker">Begin</p>
        <h2>Three ways into care.</h2>
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
      </section>

      <section className="care-section care-section--soft" id="specialists">
        <div className="care-shell">
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
  );
}
