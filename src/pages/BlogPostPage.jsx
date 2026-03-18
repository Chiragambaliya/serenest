import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';

const POSTS = [
  {
    slug: 'privacy-first-mental-health',
    title: 'Privacy-first mental health care: what it means',
    date: 'Mar 2026',
    tag: 'Privacy',
    body: [
      'Privacy-first means we design the product so fewer people need to see your sensitive information to deliver care.',
      'In practice, that includes least-access controls, clear boundaries, and clinical records that are locked after consultation.',
      'For patients, this reduces anxiety around data exposure. For clinicians, it supports documentation that is auditable and medico-legally sound.',
    ],
  },
  {
    slug: 'phq9-gad7-tracking',
    title: 'PHQ-9 & GAD-7: tracking progress, clinically',
    date: 'Mar 2026',
    tag: 'Clinical',
    body: [
      'Measurement-based care helps clinicians make better decisions with less guesswork.',
      'Short assessments like PHQ-9 and GAD-7 create a simple trendline over time — which can be more informative than a single score.',
      'Used well, tracking supports follow-up planning and shared understanding between patient and practitioner.',
    ],
  },
  {
    slug: 'telemedicine-guidelines-india',
    title: 'Telemedicine in India: the basics for patients',
    date: 'Mar 2026',
    tag: 'Guides',
    body: [
      'Telemedicine is designed to make care more accessible — especially when distance, stigma, and long wait times block in-person visits.',
      'A good tele-consultation still includes consent, clinical documentation, and (where applicable) a verifiable prescription.',
      'If you are in immediate danger, online services are not a substitute for emergency care.',
    ],
  },
];

export default function BlogPostPage() {
  const { slug } = useParams();

  const post = useMemo(() => POSTS.find((p) => p.slug === slug) ?? null, [slug]);

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
            {post.body.map((para) => (
              <p key={para} className="blog-p">
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

