import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ACADEMY_PROGRAMS, ACADEMY_CATEGORIES } from '../lib/academyPrograms';
import EdIcon from '../components/EdIcon';
import '../styles/academy.css';
import '../styles/service-detail.css';

export default function AcademyProgramsPage() {
  useSEO({
    path: '/academy/programs',
    title: 'Serenest Academy — All Programs',
    description: 'The full Serenest Academy program catalogue for psychology students, counsellors, psychiatrists, and mental health professionals.',
  });

  return (
    <div className="svd-page">
      <section className="svd-hero">
        <div className="container">
          <p className="svd-eyebrow">Serenest Academy · Programs</p>
          <h1>All programs</h1>
          <p className="svd-hero__lead">
            Structured education for every stage of a mental health career — from first
            certificate to advanced fellowship.
          </p>
        </div>
      </section>

      {ACADEMY_CATEGORIES.map((cat, ci) => (
        <section key={cat.label} className={`svd-section${ci % 2 ? ' svd-section--soft' : ''}`}>
          <div className="container">
            <h2>{cat.label}</h2>
            <p className="svd-section-lead">{cat.tagline}</p>
            <div className="eda-pcard-grid">
              {ACADEMY_PROGRAMS.filter((p) => p.category === cat.label).map((p) => (
                <article key={p.slug} className={`eda-pcard eda-pcard--${p.accent}`}>
                  {p.popular && <span className="eda-pcard-badge">POPULAR</span>}
                  <div className="eda-pcard-header">
                    <div className="eda-pcard-ico">
                      <EdIcon name={p.iconName} size={22} />
                    </div>
                    <div>
                      <h3 className="eda-pcard-title">{p.title}</h3>
                      <p className="eda-pcard-sub">{p.subtitle}</p>
                    </div>
                  </div>
                  <p className="eda-pcard-body">{p.body}</p>
                  <div className="eda-pcard-metrics" aria-label="Program metrics">
                    {p.metrics.map((m) => (
                      <div key={m.sub} className="eda-metric">
                        <span className="eda-metric-val">{m.top}</span>
                        <span className="eda-metric-lbl">{m.sub}</span>
                      </div>
                    ))}
                  </div>
                  <Link className="eda-pcard-cta" to={`/academy/programs/${p.slug}`}>
                    {p.ctaLabel} <span aria-hidden="true">→</span>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
