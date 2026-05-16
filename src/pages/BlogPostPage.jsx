import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';

import { BLOG_POSTS } from '../lib/blogPosts';

export default function BlogPostPage() {
  const { slug } = useParams();

  const post = useMemo(() => BLOG_POSTS.find((p) => p.slug === slug) ?? null, [slug]);

  if (!post) {
    return (
      <div className="page">
        <section className="section about-hero">
          <div className="container">
            <div className="section-head about-hero-head">
              <p className="kicker">Blog</p>
              <h1 className="page-title">Post not found.</h1>
              <p className="about-subtext">Try the blog index.</p>
              <div className="hero-actions" style={{ marginTop: 14 }}>
                <Link className="btn btn-primary" to="/blog">
                  Back to blog
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">Blog</p>
            <h1 className="page-title">{post.title}</h1>
            <div className="blog-meta" style={{ marginTop: 10 }}>
              <span className="faq-pill">{post.tag}</span>
              <span className="blog-date">{post.date}</span>
            </div>
            <div className="hero-actions" style={{ marginTop: 14 }}>
              <Link className="btn btn-ghost" to="/blog">
                ← Back
              </Link>
              <Link className="btn btn-primary" to="/book">
                Book
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <article className="tile blog-post">
            {post.body.map((para, i) => (
              <p key={`${post.slug}-${i}`} className="blog-p">
                {para}
              </p>
            ))}
          </article>

          <div className="cta about-cta" style={{ marginTop: 16 }}>
            <div>
              <h2 className="h2" style={{ margin: 0 }}>
                Want help choosing the right care?
              </h2>
              <p className="muted" style={{ margin: '6px 0 0' }}>
                Book a consultation or email support.
              </p>
            </div>
            <div className="stack about-cta-actions">
              <Link className="btn btn-primary btn-full" to="/book">
                Book now →
              </Link>
              <a className="btn btn-ghost btn-full" href="mailto:support@serenest.fit?subject=Blog%20Question">
                Email support
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

