import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { PROGRAMS_BY_SLUG, ACADEMY_PROGRAMS } from '../lib/academyPrograms';
import { useProfessionalAccess } from '../lib/useProfessionalAccess';
import { useSEO } from '../lib/useSEO';
import EdIcon from '../components/EdIcon';
import '../styles/academy.css';

export default function AcademyProgramPage() {
  const { slug } = useParams();
  const program = PROGRAMS_BY_SLUG[slug];
  const { user, isProfessional } = useProfessionalAccess();

  useSEO({
    path: `/academy/program/${slug}`,
    title: program ? `${program.title} | Serenest Academy` : 'Serenest Academy',
    description: program?.tagline || program?.overview,
  });

  if (!program) return <Navigate to="/academy" replace />;

  const related = ACADEMY_PROGRAMS.filter((p) => p.slug !== program.slug).slice(0, 3);
  const enquirySubject = isProfessional
    ? `Serenest Academy FREE seat — ${program.title}`
    : `Serenest Academy — ${program.title}`;
  const enquiry = `mailto:support@serenest.in?subject=${encodeURIComponent(enquirySubject)}`;
  const enrollLabel = isProfessional ? 'Claim free seat' : 'Request a seat';
  const modules = program.modules || [];

  return (
    <div className="eda-page eda-program-page">
      <section className="eda-prog-hero">
        <div className="container">
          <nav className="eda-prog-topbar" aria-label="Academy header">
            <Link to="/academy" className="eda-brand">
              <span className="eda-brand-mark" aria-hidden="true" />
              <span className="eda-brand-name">Serenest Academy</span>
            </Link>
            <div className="eda-hero-auth">
              <Link className="eda-btn eda-btn-ghost" to="/">Serenest care</Link>
              {user ? null : (
                <Link className="eda-btn eda-btn-ghost" to="/academy/login">Log in</Link>
              )}
            </div>
          </nav>

          <p className="eda-prog-crumb">
            <Link to="/academy">Serenest Academy</Link>
            <span aria-hidden="true"> · </span>
            <span>{program.category}</span>
            {program.featured ? (
              <>
                <span aria-hidden="true"> · </span>
                <span className="eda-prog-flag">Flagship</span>
              </>
            ) : null}
          </p>

          <div className="eda-prog-hero__row">
            <div className="eda-prog-hero__copy">
              <div className="eda-prog-icon" aria-hidden="true">
                <EdIcon name={program.iconName} size={28} />
              </div>
              <h1 className="eda-prog-title">{program.title}</h1>
              <p className="eda-prog-lead">{program.overview}</p>
              {isProfessional ? (
                <p className="eda-pro-free-banner" role="status">
                  <strong>Included free</strong> with your Serenest professional account — no program fee.
                </p>
              ) : null}
              <div className="eda-hero-actions">
                {user ? (
                  <a className="eda-btn eda-btn-primary eda-btn-lg" href={enquiry}>{enrollLabel}</a>
                ) : (
                  <Link className="eda-btn eda-btn-primary eda-btn-lg" to="/academy/login">
                    Log in to enroll
                  </Link>
                )}
                <a className="eda-btn eda-btn-outline eda-btn-lg" href={enquiry}>Ask a question</a>
              </div>
            </div>

            <aside className="eda-prog-side" aria-label="Program details">
              <p className="eda-prog-side__label">Format</p>
              <p className="eda-prog-side__text">{program.format}</p>
              {program.metrics?.length > 0 && (
                <div className="eda-prog-metrics">
                  {program.metrics.map((m) => (
                    <div key={m.sub} className="eda-prog-metric">
                      <strong>{m.top}</strong>
                      <span>{m.sub}</span>
                    </div>
                  ))}
                </div>
              )}
              <p className="eda-prog-side__label">Who it&apos;s for</p>
              <ul className="eda-prog-list">
                {program.forWho.map((w) => <li key={w}>{w}</li>)}
              </ul>
              {user ? (
                <a className="eda-btn eda-btn-primary" href={enquiry} style={{ width: '100%', justifyContent: 'center' }}>
                  {enrollLabel}
                </a>
              ) : (
                <Link className="eda-btn eda-btn-primary" to="/academy/login" style={{ width: '100%', justifyContent: 'center' }}>
                  Log in to enroll
                </Link>
              )}
            </aside>
          </div>

          {program.highlights?.length > 0 && (
            <ul className="eda-prog-highlights" aria-label="Program highlights">
              {program.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {modules.length > 0 && (
        <section className="eda-section eda-section-alt">
          <div className="container">
            <div className="eda-section-head">
              <p className="eda-section-kicker">Curriculum</p>
              <h2 className="eda-section-h2">What you will learn</h2>
              <p className="eda-section-sub">
                {program.featured
                  ? 'A 12-week arc from assessment to ethics — modules you can apply in clinic the same week.'
                  : 'Structured modules designed for real practice — not just theory.'}
              </p>
            </div>
            <ol className="eda-module-grid">
              {modules.map((mod) => (
                <li key={mod.title} className="eda-module">
                  <span className="eda-module__week">Weeks {mod.week}</span>
                  <h3 className="eda-module__title">{mod.title}</h3>
                  <ul>
                    {mod.outcomes.map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section className="eda-section">
        <div className="container">
          <div className="eda-prog-learn">
            <div>
              <p className="eda-section-kicker" style={{ textAlign: 'left' }}>Outcomes</p>
              <h2 className="eda-section-h2" style={{ textAlign: 'left', marginBottom: 16 }}>
                Built for real-world practice
              </h2>
              <ul className="eda-prog-list eda-prog-list--check">
                {program.learn.map((l) => <li key={l}>{l}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="eda-section eda-section-alt">
        <div className="container">
          <div className="eda-section-head">
            <p className="eda-section-kicker">Explore more</p>
            <h2 className="eda-section-h2">Other programmes</h2>
          </div>
          <div className="eda-pcard-grid eda-pcard-grid--3">
            {related.map((p) => (
              <article key={p.slug} className={`eda-pcard eda-pcard--${p.accent}`}>
                <div className="eda-pcard-header">
                  <div className="eda-pcard-ico">
                    <EdIcon name={p.iconName} size={22} />
                  </div>
                  <div>
                    <h3 className="eda-pcard-title">{p.title}</h3>
                    <p className="eda-pcard-sub">{p.tagline}</p>
                  </div>
                </div>
                <Link className="eda-pcard-cta" to={`/academy/program/${p.slug}`}>
                  View programme <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
          <div style={{ marginTop: 28 }}>
            <Link className="eda-btn eda-btn-ghost" to="/academy">← All Academy programmes</Link>
          </div>
        </div>
      </section>

      <section className="eda-section eda-section-cta">
        <div className="container">
          <div className="eda-cta-block">
            <div>
              <h2 className="eda-cta-h2">Claim your place in {program.title}</h2>
              <p className="eda-cta-sub">
                Tell us your role and preferred cohort. We confirm seats and next steps.
              </p>
            </div>
            <div className="eda-cta-actions">
              {user ? (
                <a className="eda-btn eda-btn-primary eda-btn-lg" href={enquiry}>{enrollLabel} →</a>
              ) : (
                <Link className="eda-btn eda-btn-primary eda-btn-lg" to="/academy/login">
                  Log in to enroll →
                </Link>
              )}
              <Link className="eda-btn eda-btn-outline eda-btn-lg" to="/academy">
                Back to Academy
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
