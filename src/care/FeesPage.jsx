import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';

const FEES = [
  ['Counsellor', '₹800', '₹800–₹1,200', 'Supportive counselling, 45–60 min.'],
  ['Therapist', '₹900', '₹900–₹1,500', 'Structured therapy, notes included.'],
  ['Psychologist', '₹1,000', '₹1,000–₹1,800', 'Assessment and evidence-based therapy.'],
  ['Psychiatrist', '₹1,200', '₹1,200–₹2,500', 'Diagnosis and medication review when appropriate.'],
];

export default function FeesPage() {
  useSEO({ path: '/pricing', ...ROUTE_SEO['/pricing'] });
  return (
    <div className="care-shell">
      <section className="care-section">
        <p className="care-kicker">Fees</p>
        <h2>Pay per session, after we confirm.</h2>
        <p>Sending a request is free. Other medical specialists set their own fee, and we tell you the amount before you pay.</p>
      </section>
      <section className="care-grid care-grid--fees">
        {FEES.map(([name, price, range, note]) => (
          <article className="care-card" key={name}>
            <p className="care-kicker">{name}</p>
            <p className="care-price">{price}</p>
            <p>{range} per session.</p>
            <p>{note}</p>
          </article>
        ))}
      </section>
      <div className="care-actions">
        <Link className="care-btn care-btn--primary" to="/book">Book an appointment</Link>
        <Link className="care-btn care-btn--ghost" to="/patient/find-professional">See clinician fees</Link>
      </div>
    </div>
  );
}
