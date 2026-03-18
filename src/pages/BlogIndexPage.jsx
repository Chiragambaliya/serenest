import React from 'react';
import { Link } from 'react-router-dom';

const POSTS = [
  {
    slug: 'privacy-first-mental-health',
    title: 'Privacy-first mental health care: what it means',
    excerpt:
      'How least-access design, locked records, and clear boundaries create a calmer, safer experience for patients and clinicians.',
    date: 'Mar 2026',
    tag: 'Privacy',
  },
  {
    slug: 'phq9-gad7-tracking',
    title: 'PHQ-9 & GAD-7: tracking progress, clinically',
    excerpt:
      'Why measurement-based care matters and how simple trends can help guide follow-ups and treatment decisions.',
    date: 'Mar 2026',
    tag: 'Clinical',
  },
  {
    slug: 'telemedicine-guidelines-india',
    title: 'Telemedicine in India: the basics for patients',
    excerpt:
      'What to expect from an online consultation, documentation, prescriptions, and safety considerations.',
    date: 'Mar 2026',
    tag: 'Guides',
  },
];

export default function BlogIndexPage() {
  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">Blog</p>
            <h1 className="page-title">Clinical clarity, in plain language.</h1>
            <p className="about-subtext">
              Notes on privacy, telemedicine, and measurement-based care — designed for patients and
              professionals.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="blog-grid">
            {POSTS.map((p) => (
              <article key={p.slug} className="tile blog-card">
                <div className="blog-meta">
                  <span className="faq-pill">{p.tag}</span>
                  <span className="blog-date">{p.date}</span>
                </div>
                <h3 className="blog-title">{p.title}</h3>
                <p className="muted">{p.excerpt}</p>
                <div className="blog-actions">
                  <Link className="btn btn-ghost" to={`/blog/${p.slug}`}>
                    Read →
                  </Link>
                  <Link className="btn btn-primary" to="/book">
                    Book
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

