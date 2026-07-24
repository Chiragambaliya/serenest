import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ACADEMY_PROGRAMS } from '../lib/academyPrograms';
import '../styles/service-detail.css';

function byslug(...slugs) {
  return slugs
    .map((s) => ACADEMY_PROGRAMS.find((p) => p.slug === s))
    .filter(Boolean);
}

const PATHS = [
  {
    persona: 'Psychiatry residents and doctors',
    programs: byslug('psychiatry-training', 'clinical-excellence', 'digital-mental-health', 'fellowship-programs'),
  },
  {
    persona: 'Psychologists',
    programs: byslug('counselling-skills', 'clinical-excellence', 'research-publications', 'cpd-programs'),
  },
  {
    persona: 'Counsellors',
    programs: byslug('counselling-skills', 'clinical-excellence', 'cpd-programs'),
  },
  {
    persona: 'Addiction professionals',
    programs: [],
    note: 'A dedicated addiction-focused pathway is in development.',
  },
  {
    persona: 'Students and early-career professionals',
    programs: byslug('student-training', 'certificate-programs', 'mentorship'),
  },
];

export default function AcademyLearningPathsPage() {
  useSEO({
    path: '/academy/learning-paths',
    title: 'Serenest Academy — Learning Paths',
    description: 'Suggested Serenest Academy program sequences for different mental health career stages.',
  });

  return (
    <div className="svd-page">
      <section className="svd-hero">
        <div className="container">
          <p className="svd-eyebrow">Serenest Academy · Learning Paths</p>
          <h1>Find your path</h1>
          <p className="svd-hero__lead">
            Suggested program sequences depending on where you are in your career. Full
            stage-by-stage pathways (foundation through mentorship) are still being built out —
            this is a starting point, not a rigid track.
          </p>
        </div>
      </section>

      {PATHS.map((path, i) => (
        <section key={path.persona} className={`svd-section${i % 2 ? ' svd-section--soft' : ''}`}>
          <div className="container">
            <h2>{path.persona}</h2>
            {path.programs.length > 0 ? (
              <ul className="svd-list">
                {path.programs.map((p) => (
                  <li key={p.slug}>
                    <strong>{p.title}</strong>
                    <span>{p.subtitle}</span>
                    <div style={{ marginTop: '0.75rem' }}>
                      <Link className="hp-text-link" to={`/academy/programs/${p.slug}`}>View program</Link>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="svd-section-lead">{path.note}</p>
            )}
          </div>
        </section>
      ))}

      <section className="svd-cta">
        <div className="container">
          <h2>Not sure where to start?</h2>
          <p>Browse the full program catalogue.</p>
          <div className="svd-cta__actions">
            <Link className="btn btn-primary btn-lg" to="/academy/programs">View all programs</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
