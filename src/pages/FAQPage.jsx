import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';

const FAQS = [
  {
    category: 'General',
    q: 'What is Serenest?',
    a: 'Serenest is a privacy-first mental health platform designed around clinical workflows: intake, assessments, consults, records, and continuity.',
  },
  {
    category: 'Prescriptions',
    q: 'Are prescriptions valid at pharmacies?',
    a: 'Prescriptions issued after a consultation include the practitioner’s registration details and are designed to be verifiable and clinically documented.',
  },
  {
    category: 'Prescriptions',
    q: 'Can I get Schedule H drugs prescribed online?',
    a: 'Controlled medications follow applicable regulations and are restricted to verified clinicians, and only after a proper consultation.',
  },
  {
    category: 'Privacy',
    q: 'Is my session recorded?',
    a: 'By default, sessions are not intended to be recorded. We design for privacy-first workflows and least-access. If recording is ever introduced, it would be explicit and consent-based.',
  },
  {
    category: 'Privacy',
    q: 'Who can see my data?',
    a: 'You, your treating practitioner(s), and authorized administrators as required for operations and compliance, following least-access principles.',
  },
  {
    category: 'Payments',
    q: 'What payment methods are supported?',
    a: 'We are building for UPI, cards, and net banking via Razorpay. If a payment option is not available in your flow yet, contact support and we’ll help.',
  },
  {
    category: 'Technical',
    q: 'What if my internet drops mid-session?',
    a: 'Rejoin the session when your connection returns. If you cannot rejoin, contact support to help reschedule or complete the session.',
  },
  {
    category: 'Payments',
    q: 'Can I get a refund if I miss my appointment?',
    a: 'Refund rules depend on booking status and timing. Email support and we’ll assist based on your case.',
  },
];

const CATEGORIES = ['All', 'General', 'Prescriptions', 'Privacy', 'Payments', 'Technical'];

export default function FAQPage() {
  useSEO({ path: '/faq', ...ROUTE_SEO['/faq'] });
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.filter((f) => {
      const inCat = cat === 'All' ? true : f.category === cat;
      const inQuery = q.length === 0 ? true : `${f.q} ${f.a}`.toLowerCase().includes(q);
      return inCat && inQuery;
    });
  }, [query, cat]);

  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">FAQ</p>
            <h1 className="page-title">Answers to common questions.</h1>
            <p className="about-subtext">
              Search and filter by topic. If you don’t find what you need, contact support.
              For service-specific questions, see our{' '}
              <Link to="/services">services overview</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="faq-toolbar tile">
            <label className="field" style={{ margin: 0 }}>
              <span className="field-label">Search</span>
              <input
                className="input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search privacy, prescriptions, refunds…"
              />
            </label>

            <div className="faq-tabs" role="tablist" aria-label="FAQ categories">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  role="tab"
                  aria-selected={cat === c}
                  className={`slot-chip ${cat === c ? 'is-selected' : ''}`}
                  onClick={() => setCat(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="faq-list" style={{ marginTop: 14 }}>
            {filtered.length === 0 ? (
              <div className="callout">
                <div className="callout-title">No results</div>
                <p className="muted" style={{ margin: 0 }}>
                  Try a different search or category, or email{' '}
                  <a href="mailto:support@serenest.in">support@serenest.in</a>.
                </p>
              </div>
            ) : (
              filtered.map((f) => (
                <details key={`${f.category}:${f.q}`} className="faq-item">
                  <summary className="faq-q">
                    <span className="faq-pill">{f.category}</span>
                    <span>{f.q}</span>
                  </summary>
                  <div className="faq-a muted">{f.a}</div>
                </details>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">Topic-specific guides</div>
            <h2>Detailed pages for common questions</h2>
          </div>
          <div className="grid-3">
            <article className="tile">
              <h3><Link to="/online-psychiatrist-prescription-india">Online prescription validity (India)</Link></h3>
              <p>How psychiatric prescriptions work online under India&apos;s telemedicine guidelines.</p>
            </article>
            <article className="tile">
              <h3><Link to="/online-psychiatrist-for-depression-india">Depression — online care</Link></h3>
              <p>Screening, therapy, medication review, and the difference between counselling and psychiatry.</p>
            </article>
            <article className="tile">
              <h3><Link to="/anxiety-counselling-online-india">Anxiety — online care</Link></h3>
              <p>GAD-7, stepped care, regulated medication categories, and how online therapy works.</p>
            </article>
            <article className="tile">
              <h3><Link to="/adhd-assessment-online-india">Adult ADHD — assessment online</Link></h3>
              <p>Structured assessment process, validated scales, and why prescribing is careful.</p>
            </article>
            <article className="tile">
              <h3><Link to="/ocd-treatment-online-india">OCD — online treatment</Link></h3>
              <p>Structured assessment, ERP-focused therapy, and medication review where clinically appropriate.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="cta about-cta">
            <div>
              <h2 className="h2" style={{ margin: 0 }}>
                Still have questions?
              </h2>
              <p className="muted" style={{ margin: '6px 0 0' }}>
                Email support or book a consultation.
              </p>
            </div>
            <div className="stack about-cta-actions">
              <a className="btn btn-primary btn-full" href="mailto:support@serenest.in?subject=FAQ%20Question">
                Contact support →
              </a>
              <Link className="btn btn-ghost btn-full" to="/book">
                Book now
              </Link>
              <Link className="btn btn-ghost btn-full" to="/privacy">
                Privacy policy
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

