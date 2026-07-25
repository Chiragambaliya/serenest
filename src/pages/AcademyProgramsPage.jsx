import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ACADEMY_PROGRAMS, ACADEMY_CATEGORIES } from '../lib/academyPrograms';
import '../styles/service-detail.css';
import '../styles/editorial-structures.css';

/* The catalogue reads as an index, not a card grid — it is an
   enumerable set, so it is numbered and ruled like contents. */
export default function AcademyProgramsPage() {
  useSEO({
    path: '/academy/programs',
    title: 'Serenest Academy — All Programs',
    description: 'The full Serenest Academy program catalogue for psychology students, counsellors, psychiatrists, and mental health professionals.',
  });

  let n = 0;

  return (
    <div className="svd-page">
      <section className="svd-hero ed-pace">
        <div className="container">
          <p className="svd-eyebrow">Serenest Academy · Programs</p>
          <h1>All programs</h1>
          <p className="ed-lede" style={{ marginTop: '1rem' }}>
            Structured education for every stage of a mental health career — from a first
            certificate to advanced fellowship.
          </p>
        </div>
      </section>

      {ACADEMY_CATEGORIES.map((cat, ci) => (
        <section key={cat.label} className={ci === 0 ? 'svd-section ed-pace' : 'svd-section ed-pace-tight'}>
          <div className="container">
            <div className="ed-aside">
              <div>
                <p className="ed-aside__label">{cat.label}</p>
                <p className="ed-aside__note">{cat.tagline}</p>
              </div>
              <div className="ed-index">
                {ACADEMY_PROGRAMS.filter((p) => p.category === cat.label).map((p) => {
                  n += 1;
                  const duration = p.metrics?.[0];
                  return (
                    <Link key={p.slug} to={`/academy/programs/${p.slug}`} className="ed-index__row">
                      <span className="ed-index__num" aria-hidden="true">
                        {String(n).padStart(2, '0')}
                      </span>
                      <span>
                        <h2 className="ed-index__title">{p.title}</h2>
                        <span className="ed-index__meta">
                          {p.subtitle}
                          {duration ? ` · ${duration.top} ${duration.sub}` : ''}
                        </span>
                      </span>
                      <p className="ed-index__body">{p.body}</p>
                      <span className="ed-index__go" aria-hidden="true">View →</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="ed-band">
        <div className="container">
          <p className="ed-band__quote">
            Education is not just information. It is transformation in practice.
          </p>
          <p className="ed-band__attrib">Serenest Academy</p>
        </div>
      </section>

      <section className="svd-section ed-pace">
        <div className="container">
          <p className="svd-sidelabel">Not sure where to start?</p>
          <h2 className="ed-measure" style={{ marginBottom: '1.5rem' }}>
            Learning paths group these programs by where you are in your career.
          </h2>
          <div className="svd-cta__actions">
            <Link className="btn btn-primary btn-lg" to="/academy/learning-paths">View learning paths</Link>
            <Link className="btn btn-ghost btn-lg" to="/academy">Back to Academy</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
