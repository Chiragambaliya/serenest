import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import '../styles/service-detail.css';

export default function AcademyWorkshopsPage() {
  useSEO({
    path: '/academy/workshops',
    title: 'Serenest Academy — Workshops',
    description: 'Live and recorded workshops from Serenest Academy for mental health professionals.',
  });

  return (
    <div className="svd-page">
      <section className="svd-hero">
        <div className="container">
          <p className="svd-eyebrow">Serenest Academy · Workshops</p>
          <h1>Workshops</h1>
          <p className="svd-hero__lead">
            Live and recorded sessions on focused clinical topics, taught by practising
            professionals.
          </p>
        </div>
      </section>

      <section className="svd-section">
        <div className="container">
          <div style={{ padding: '2.5rem', border: '1px dashed var(--border-strong, var(--border))', borderRadius: 'var(--r-lg)', textAlign: 'center', maxWidth: '36rem', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '0.75rem' }}>No workshops are currently scheduled</h2>
            <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
              Check back soon, or explore our self-paced programs in the meantime.
            </p>
            <Link className="btn btn-primary" to="/academy/programs">Explore Programs</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
