import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import '../styles/service-detail.css';

export default function AcademyResourcesPage() {
  useSEO({
    path: '/academy/resources',
    title: 'Serenest Academy — Resources',
    description: 'Clinical guides, reading lists, and practice tools from Serenest Academy.',
  });

  return (
    <div className="svd-page">
      <section className="svd-hero">
        <div className="container">
          <p className="svd-eyebrow">Serenest Academy · Resources</p>
          <h1>Resources for learners and faculty</h1>
          <p className="svd-hero__lead">
            Clinical guides, reading lists, practice tools, and case discussions — organised for
            Academy learners.
          </p>
        </div>
      </section>

      <section className="svd-section">
        <div className="container">
          <div style={{ padding: '2.5rem', border: '1px dashed var(--border-strong, var(--border))', borderRadius: 'var(--r-lg)', textAlign: 'center', maxWidth: '40rem', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '0.75rem' }}>This section is still being built</h2>
            <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
              Academy-specific resources are on their way. In the meantime, our clinician resource
              hub and patient guides are already available.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link className="btn btn-primary" to="/professionals/resources">Clinician resources</Link>
              <Link className="btn btn-ghost" to="/guides">Patient guides</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
