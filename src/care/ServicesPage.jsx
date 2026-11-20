import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { SPECIALTY_GROUPS } from './specialties';

export default function ServicesPage() {
  useSEO({ path: '/services', ...ROUTE_SEO['/services'] });
  return (
    <div className="care-shell">
      <section className="care-hero">
        <div>
          <p className="care-kicker">Services</p>
          <h1>Every listed specialist, one way to book.</h1>
          <p className="care-lede">
            Choose the specialty. We match a verified clinician and confirm the time before you pay. Screening and follow-up stay available when you need them.
          </p>
          <div className="care-actions">
            <Link className="care-btn care-btn--primary" to="/book">Book an appointment</Link>
            <Link className="care-btn care-btn--ghost" to="/screening">Start a check</Link>
          </div>
        </div>
        <figure className="care-figure">
          <img src="/images/editorial/services-consultation-space-v1.jpg" alt="A calm consultation room in daylight" />
          <figcaption>Care, not a course catalogue</figcaption>
        </figure>
      </section>
      {SPECIALTY_GROUPS.map((group) => (
        <section className="care-section" key={group.id} aria-labelledby={group.id}>
          <h2 id={group.id}>{group.label}</h2>
          <div className="care-index">
            {group.specialties.map((item, i) => (
              <Link key={item.id} to={`/book?prole=${item.id}`}>
                <span className="care-index__num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{item.label}</h3>
                <p>Video, audio, or chat. Confirmed before payment.</p>
                <span className="care-index__go">Request →</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
