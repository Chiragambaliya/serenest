import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { listCheckEvidence } from '../lib/checkEvidence';
import '../styles/screening.css';

/** Evidence Center — clinical transparency for every launched Mental Health Check. */
export default function EvidenceCenterPage() {
  useSEO({
    path: '/evidence',
    title: 'Evidence Center — Mental Health Checks | Serenest',
    description:
      'Instruments, validation papers, licensing, and limitations for Serenest Mental Health Checks. Clinical integrity before conversion.',
    ogTitle: 'Serenest Evidence Center',
    ogDescription: 'Why each Mental Health Check exists — and what it is not.',
  });

  const items = listCheckEvidence();

  return (
    <div className="mhc">
      <div className="mhc-wrap">
        <header className="mhc-hero">
          <p className="mhc-eyebrow">Serenest · Clinical integrity</p>
          <h1>Evidence Center</h1>
          <p className="mhc-hero-lead">
            Every Mental Health Check is a product launch with published instruments, licensing clarity, and stated
            limitations. Education before treatment. Trust before conversion.
          </p>
          <p className="mhc-disclaimer">
            Screening aids are not diagnoses. Only a qualified clinician can provide a clinical assessment.
          </p>
        </header>

        <section className="mhc-section" aria-labelledby="checks-ev">
          <div className="mhc-section-head">
            <h2 id="checks-ev">Launched checks</h2>
            <p>Instrument overview, validation, licensing, and review metadata.</p>
          </div>
          <div className="mhc-grid">
            {items.map((e) => (
              <Link key={e.toolId} to={`/evidence/${e.evidenceSlug}`} className="mhc-card">
                <h3 className="mhc-card-title">{e.productTitle}</h3>
                <p className="mhc-card-scale">{e.officialName}</p>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.45 }}>
                  {e.clinicalReviewNotice ||
                    'Evidence summary based on official instrument sources and peer-reviewed literature. Clinical review pending.'}
                </p>
                <span className="mhc-card-cta">Open evidence report →</span>
              </Link>
            ))}
          </div>
        </section>

        <p style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
          <Link to="/screening">← Mental Health Center</Link>
        </p>
      </div>
    </div>
  );
}
