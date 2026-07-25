import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ACADEMY_PROGRAMS } from '../lib/academyPrograms';
import '../styles/service-detail.css';
import '../styles/editorial-structures.css';

function byslug(...slugs) {
  return slugs
    .map((s) => ACADEMY_PROGRAMS.find((p) => p.slug === s))
    .filter(Boolean);
}

/* Each path is a sequence, so it is presented as one — a timeline of
   stages, not a grid of equal cards. */
const PATHS = [
  {
    persona: 'Psychiatry residents and doctors',
    note: 'Prescribing-focused, building toward specialty depth.',
    programs: byslug('psychiatry-training', 'clinical-excellence', 'digital-mental-health', 'fellowship-programs'),
  },
  {
    persona: 'Psychologists',
    note: 'Assessment and therapy practice, with research literacy.',
    programs: byslug('counselling-skills', 'clinical-excellence', 'research-publications', 'cpd-programs'),
  },
  {
    persona: 'Counsellors',
    note: 'Core skills first, then continuing development.',
    programs: byslug('counselling-skills', 'clinical-excellence', 'cpd-programs'),
  },
  {
    persona: 'Students and early-career professionals',
    note: 'Foundations, then supervised application.',
    programs: byslug('student-training', 'certificate-programs', 'mentorship'),
  },
  {
    persona: 'Addiction professionals',
    note: 'A dedicated addiction-focused pathway is in development.',
    programs: [],
  },
];

const STAGE_LABELS = ['Foundation', 'Core practice', 'Applied skills', 'Advanced'];

export default function AcademyLearningPathsPage() {
  useSEO({
    path: '/academy/learning-paths',
    title: 'Serenest Academy — Learning Paths',
    description: 'Suggested Serenest Academy program sequences for different mental health career stages.',
  });

  return (
    <div className="svd-page">
      <section className="svd-hero ed-pace-open">
        <div className="container">
          <p className="svd-eyebrow">Serenest Academy · Learning Paths</p>
          <h1 style={{ maxWidth: '14ch' }}>Find your path</h1>
          <p className="ed-lede" style={{ marginTop: '1.25rem' }}>
            Suggested program sequences depending on where you are in your career — a starting
            point, not a rigid track.
          </p>
        </div>
      </section>

      {PATHS.map((path, i) => (
        <section
          key={path.persona}
          className={`svd-section ${i % 2 ? 'svd-section--soft' : ''} ${i === 0 ? 'ed-pace' : 'ed-pace-tight'}`}
        >
          <div className="container ed-aside">
            <div>
              <p className="ed-aside__label">{`Path ${String(i + 1).padStart(2, '0')}`}</p>
              <p className="ed-aside__note">{path.note}</p>
            </div>
            <div>
              <h2
                style={{
                  fontSize: 'clamp(1.35rem, 2.6vw, 1.85rem)',
                  fontWeight: 600,
                  lineHeight: 1.2,
                  marginBottom: path.programs.length ? '1.75rem' : '0.75rem',
                  maxWidth: '20ch',
                }}
              >
                {path.persona}
              </h2>
              {path.programs.length > 0 ? (
                <ol className="ed-timeline">
                  {path.programs.map((p, si) => (
                    <li key={p.slug}>
                      <span className="ed-timeline__stage">
                        {STAGE_LABELS[si] || 'Continuing'}
                      </span>
                      <h3>
                        <Link to={`/academy/programs/${p.slug}`} className="ed-link">
                          {p.title}
                        </Link>
                      </h3>
                      <p>{p.subtitle}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="ed-measure" style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.7 }}>
                  We&apos;re building this pathway. In the meantime, the{' '}
                  <Link to="/academy/programs" className="ed-link">full catalogue</Link>{' '}
                  lists every program currently offered.
                </p>
              )}
            </div>
          </div>
        </section>
      ))}

      <section className="svd-cta">
        <div className="container">
          <h2>Not sure which path fits?</h2>
          <p>Browse the full catalogue, or write to us and we&apos;ll point you somewhere sensible.</p>
          <div className="svd-cta__actions">
            <Link className="btn btn-primary btn-lg" to="/academy/programs">View all programs</Link>
            <a className="btn btn-ghost btn-lg" href="mailto:support@serenest.in?subject=Serenest%20Academy%20%E2%80%94%20Learning%20path">
              Ask us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
