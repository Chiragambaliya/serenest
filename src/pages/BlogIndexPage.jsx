import React from 'react';
import { Link } from 'react-router-dom';

import { BLOG_POSTS } from '../lib/blogPosts';

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
            {BLOG_POSTS.map((p) => (
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

