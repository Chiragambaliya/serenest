import React from 'react';
import { useSEO } from '../lib/useSEO';
import EdIcon from '../components/EdIcon';
import '../styles/academy.css';
import '../styles/service-detail.css';

const INSTRUCTOR_MAILTO =
  'mailto:support@serenest.in?subject=Serenest%20Academy%20%E2%80%94%20Become%20an%20Instructor';

export default function AcademyFacultyPage() {
  useSEO({
    path: '/academy/faculty',
    title: 'Serenest Academy — Faculty',
    description: 'Meet the clinicians teaching Serenest Academy programs.',
  });

  return (
    <div className="svd-page">
      <section className="svd-hero">
        <div className="container">
          <p className="svd-eyebrow">Serenest Academy · Faculty</p>
          <h1>Learn from practising clinicians</h1>
        </div>
      </section>

      <section className="svd-section">
        <div className="container">
          <div className="eda-faculty-grid">
            <div className="eda-faculty-card">
              <div className="eda-faculty-avatar" aria-hidden="true">
                <EdIcon name="stethoscope" size={28} />
              </div>
              <h3 className="eda-faculty-name">Dr. Chirag Aambalia</h3>
              <p className="eda-faculty-role">Psychiatrist &amp; Founder</p>
            </div>
            <div className="eda-faculty-card eda-faculty-join">
              <div className="eda-faculty-avatar" aria-hidden="true"><EdIcon name="cap" size={28} /></div>
              <h3 className="eda-faculty-name">Faculty roster is growing</h3>
              <p className="eda-faculty-role">
                We're adding clinician faculty as programs expand. If you'd like to teach at
                Serenest Academy, we'd like to hear from you.
              </p>
              <a href={INSTRUCTOR_MAILTO} className="eda-btn eda-btn-primary" style={{ marginTop: '1rem' }}>
                Apply to teach →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
