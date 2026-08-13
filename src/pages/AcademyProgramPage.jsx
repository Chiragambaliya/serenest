import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { PROGRAMS_BY_SLUG, ACADEMY_PROGRAMS } from '../lib/academyPrograms';
import { useProfessionalAccess } from '../lib/useProfessionalAccess';
import { useSEO } from '../lib/useSEO';
import EdIcon from '../components/EdIcon';
import '../styles/service-detail.css';
import '../styles/editorial-structures.css';

export default function AcademyProgramPage() {
  const { slug } = useParams();
  const program = PROGRAMS_BY_SLUG[slug];
  const { user, isProfessional } = useProfessionalAccess();

  useSEO({
    path: `/academy/programs/${slug}`,
    title: program ? `${program.title} | Serenest Academy` : 'Serenest Academy',
    description: program?.tagline,
  });

  if (!program) return <Navigate to="/academy" replace />;

  const related = (() => {
    const studentSlugs = new Set([
      'student-training',
      'student-assessment-skills',
      'student-case-formulation',
      'student-internship-prep',
      'student-ethics-practice',
      'counselling-skills',
      'certificate-programs',
      'mentorship',
    ]);
    const isStudentTrack = studentSlugs.has(program.slug);
    const pool = ACADEMY_PROGRAMS.filter((p) => p.slug !== program.slug);
    const preferred = isStudentTrack
      ? pool.filter((p) => studentSlugs.has(p.slug))
      : pool.filter((p) => p.category === program.category);
    const rest = pool.filter((p) => !preferred.includes(p));
    return [...preferred, ...rest].slice(0, 6);
  })();
  const enquirySubject = isProfessional
    ? `Serenest Academy FREE seat — ${program.title}`
    : `Serenest Academy — ${program.title}`;
  const enquiry = `mailto:support@serenest.in?subject=${encodeURIComponent(enquirySubject)}`;
  const enrollLabel = isProfessional ? 'Claim free seat' : 'Enroll — request a seat';

  return (
    <div className="svd-page">
      {/* Opener: category breadcrumb, title, overview, actions. The
          program's facts sit opposite as a specification table rather
          than a row of stat chips. */}
      <section className="svd-hero ed-pace">
        <div className="container svd-split">
          <div>
            <p className="svd-eyebrow">
              <Link to="/academy/programs" className="ed-link">Serenest Academy</Link>
              {' · '}{program.category}
            </p>
            <h1>{program.title}</h1>
            <p className="ed-lede" style={{ marginTop: '1rem' }}>{program.tagline}</p>
            <p className="ed-measure" style={{ marginTop: '1.25rem', lineHeight: 1.75, color: 'var(--ink-2)' }}>
              {program.overview}
            </p>

            {isProfessional && (
              <p className="ed-measure" style={{ marginTop: '1.25rem', color: 'var(--teal-600)', fontWeight: 600 }}>
                Included free with your Serenest professional account — no program fee.
              </p>
            )}

            <div className="svd-hero__actions" style={{ marginTop: '1.75rem' }}>
              {user ? (
                <a className="btn btn-primary btn-lg" href={enquiry}>{enrollLabel}</a>
              ) : (
                <Link className="btn btn-primary btn-lg" to="/academy/login">Log in to enroll</Link>
              )}
              <a className="btn btn-ghost btn-lg" href={enquiry}>Ask a question</a>
            </div>
          </div>

          <div>
            <table className="ed-table">
              <caption>Program at a glance</caption>
              <tbody>
                {program.metrics?.map((m) => (
                  <tr key={m.sub}>
                    <th scope="row" style={{ whiteSpace: 'normal' }}>{m.sub}</th>
                    <td className="ed-table__num" data-label={m.sub}>{m.top}</td>
                  </tr>
                ))}
                <tr>
                  <th scope="row" style={{ whiteSpace: 'normal' }}>Format</th>
                  <td data-label="Format">{program.format}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Curriculum as a numbered index — it is an enumerable syllabus. */}
      <section className="svd-section ed-pace">
        <div className="container ed-aside">
          <div>
            <p className="ed-aside__label">Synopsis</p>
            <p className="ed-aside__note">
              Full curriculum synopsis — what the program covers, in teaching order.
            </p>
          </div>
          <div>
            <h2 style={{ fontSize: 'clamp(1.4rem, 2.8vw, 1.9rem)', fontWeight: 600, marginBottom: '1.5rem', maxWidth: '20ch' }}>
              What you&apos;ll learn
            </h2>
            <div className="ed-index">
              {program.learn.map((l, i) => (
                <div key={l} className="ed-index__row">
                  <span className="ed-index__num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="ed-index__body" style={{ gridColumn: 'span 2', color: 'var(--ink-2)' }}>{l}</p>
                  <span />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {Array.isArray(program.modules) && program.modules.length > 0 && (
        <section className="svd-section svd-section--soft ed-pace">
          <div className="container ed-aside">
            <div>
              <p className="ed-aside__label">Modules</p>
              <p className="ed-aside__note">
                Week-by-week structure inside this program.
              </p>
            </div>
            <div>
              <h2 style={{ fontSize: 'clamp(1.4rem, 2.8vw, 1.9rem)', fontWeight: 600, marginBottom: '1.5rem', maxWidth: '20ch' }}>
                Module outline
              </h2>
              <ol className="ed-timeline">
                {program.modules.map((m, i) => (
                  <li key={m.title}>
                    <span className="ed-timeline__stage">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3>{m.title}</h3>
                    <p>{m.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      )}

      {/* Who it's for — a marginal note beside a plain list. */}
      <section className="svd-section svd-section--soft ed-pace">
        <div className="container ed-aside">
          <div>
            <p className="ed-aside__label">Audience</p>
          </div>
          <div>
            <h2 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)', fontWeight: 600, marginBottom: '1.25rem' }}>
              Who this is for
            </h2>
            <ul className="svd-list ed-measure-wide">
              {program.forWho.map((w) => (
                <li key={w}><strong style={{ fontWeight: 400, fontFamily: 'var(--font-body)', fontSize: '0.98rem' }}>{w}</strong></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Scope limitation stated on every program page, not just the
          Academy home — this is where someone decides to enrol. */}
      <section className="svd-section ed-pace-tight">
        <div className="container ed-aside">
          <div>
            <p className="ed-aside__label">Please note</p>
          </div>
          <p className="ed-measure" style={{ margin: 0, lineHeight: 1.7, color: 'var(--ink-2)' }}>
            Serenest Academy programs support professional learning and skill development. They
            do not replace a recognised degree, professional registration, supervised clinical
            requirements, or legal scope of practice.
          </p>
        </div>
      </section>

      {/* Related programs as index rows, not cards. */}
      <section className="svd-section ed-pace">
        <div className="container">
          <div className="ed-head ed-measure-wide">
            <span className="ed-head__label">Explore more</span>
            <h2>Other programs</h2>
          </div>
          <div className="ed-index">
            {related.map((p) => (
              <Link key={p.slug} to={`/academy/programs/${p.slug}`} className="ed-index__row">
                <span className="ed-index__num" aria-hidden="true">
                  <EdIcon name={p.iconName} size={18} />
                </span>
                <span>
                  <h3 className="ed-index__title">{p.title}</h3>
                  <span className="ed-index__meta">{p.category}</span>
                </span>
                <p className="ed-index__body">{p.tagline}</p>
                <span className="ed-index__go" aria-hidden="true">View →</span>
              </Link>
            ))}
          </div>
          <p style={{ marginTop: '1.75rem' }}>
            <Link className="btn btn-ghost" to="/academy/programs">All Academy programs</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
