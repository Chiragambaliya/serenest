import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { PROGRAMS_BY_SLUG, ACADEMY_PROGRAMS } from '../lib/academyPrograms';
import { useAuth } from '../lib/useAuth';
import { useSEO } from '../lib/useSEO';

export default function AcademyProgramPage() {
  const { slug } = useParams();
  const program = PROGRAMS_BY_SLUG[slug];
  const { user } = useAuth();

  useSEO({
    path: `/academy/program/${slug}`,
    title: program ? `${program.title} | Serenest Academy` : 'Serenest Academy',
    description: program?.tagline,
  });

  if (!program) return <Navigate to="/academy" replace />;

  const related = ACADEMY_PROGRAMS.filter((p) => p.slug !== program.slug).slice(0, 3);
  const enquiry = `mailto:support@serenest.in?subject=${encodeURIComponent(`Serenest Academy — ${program.title}`)}`;

  return (
    <div className="ed-page">
      <section className="ed-hero">
        <div className="container">
          <p className="ed-kicker">
            <Link to="/academy" style={{ color: 'var(--ed-muted)' }}>Serenest Academy</Link> · {program.category}
          </p>
          <div className="ed-hero-brandline" style={{ marginBottom: 14 }}>
            <span style={{ fontSize: '2.4rem', lineHeight: 1 }} aria-hidden="true">{program.icon}</span>
          </div>
          <h1 className="ed-hero-title">{program.title}</h1>
          <p className="ed-hero-lead">{program.overview}</p>
          <div className="ed-hero-actions">
            {user ? (
              <a className="btn btn-primary btn-lg" href={enquiry}>Enroll — request a seat</a>
            ) : (
              <Link className="btn btn-primary btn-lg" to="/academy/login">Log in to enroll</Link>
            )}
            <a className="btn btn-ghost btn-lg" href={enquiry}>Ask a question</a>
          </div>

          {program.highlights?.length > 0 && (
            <ul className="ed-stats" aria-label="Program highlights">
              {program.highlights.map((h) => (
                <li key={h}><span className="ed-stat-value" style={{ fontSize: '1.1rem' }}>✓</span><span className="ed-stat-label">{h}</span></li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="ed-section">
        <div className="container">
          <div className="ed-split">
            <div>
              <p className="ed-section-label">What you&apos;ll learn</p>
              <h2>Built for real-world practice</h2>
              <ul className="ed-list">
                {program.learn.map((l) => <li key={l}>{l}</li>)}
              </ul>
            </div>
            <div className="ed-callout" aria-label="Program details">
              <p className="ed-callout-title">Who it&apos;s for</p>
              <ul className="ed-list" style={{ marginBottom: 16 }}>
                {program.forWho.map((w) => <li key={w}>{w}</li>)}
              </ul>
              <p className="ed-callout-title">Format</p>
              <p style={{ margin: 0 }}>{program.format}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="ed-section ed-section-alt">
        <div className="container">
          <div className="ed-section-head">
            <p className="ed-section-label">Explore more</p>
            <h2>Other programs</h2>
          </div>
          <div className="ed-grid ed-grid--3">
            {related.map((p) => (
              <article key={p.slug} className="ed-card">
                <div className="ed-card-icon" aria-hidden="true">{p.icon}</div>
                <h3>{p.title}</h3>
                <p>{p.tagline}</p>
                <p className="ed-card-cta">
                  <Link className="ed-link" to={`/academy/program/${p.slug}`}>View program →</Link>
                </p>
              </article>
            ))}
          </div>
          <div style={{ marginTop: 24 }}>
            <Link className="btn btn-ghost" to="/academy">← All Academy programs</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
