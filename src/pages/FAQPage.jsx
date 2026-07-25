import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import '../styles/service-detail.css';

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
    <div className="svd-page faq-editorial-page">
      <section className="svd-hero faq-editorial-hero">
        <div className="ed-shell ed-facing ed-facing--narrow-wide">
          <p className="ed-mono">FAQ</p>
          <div>
            <h1>Answers to common questions.</h1>
            <p className="svd-hero__lead">
              Search and filter by topic. If you don&apos;t find what you need, contact support.
              For service-specific questions, see our{' '}
              <Link className="ed-link" to="/services">services overview</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="svd-section">
        <div className="ed-shell ed-aside">
          <div>
            <p className="ed-aside__label">Find an answer</p>
            <p className="ed-aside__note">
              Use a keyword or narrow the list by category.
            </p>
          </div>
          <div>
            <label className="faq-editorial-search">
              <span className="ed-mono">Search</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search privacy, prescriptions, refunds…"
              />
            </label>

            <div className="faq-category-tabs" role="tablist" aria-label="FAQ categories">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  role="tab"
                  aria-selected={cat === c}
                  className={`faq-category-tab ed-mono${cat === c ? ' is-selected' : ''}`}
                  onClick={() => setCat(c)}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="faq-editorial-list">
              {filtered.length === 0 ? (
                <div className="faq-editorial-empty">
                  <h2>No results</h2>
                  <p>
                    Try a different search or category, or email{' '}
                    <a className="ed-link" href="mailto:support@serenest.in">support@serenest.in</a>.
                  </p>
                </div>
              ) : (
                filtered.map((f) => (
                  <details key={`${f.category}:${f.q}`} className="faq-editorial-item">
                    <summary>
                      <span className="ed-mono">{f.category}</span>
                      <span>{f.q}</span>
                    </summary>
                    <p>{f.a}</p>
                  </details>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="svd-section svd-section--soft">
        <div className="ed-shell ed-aside">
          <div>
            <p className="ed-aside__label">Topic-specific guides</p>
            <p className="ed-aside__note">Detailed pages for common questions.</p>
          </div>
          <div>
            <h2>Detailed pages for common questions</h2>
            <div className="ed-index">
              <Link className="ed-index__row" to="/online-psychiatrist-prescription-india">
                <span className="ed-index__num">01</span>
                <span><h3 className="ed-index__title">Online prescription validity (India)</h3></span>
                <p className="ed-index__body">How psychiatric prescriptions work online under India&apos;s telemedicine guidelines.</p>
                <span className="ed-index__go" aria-hidden="true">Read →</span>
              </Link>
              <Link className="ed-index__row" to="/online-psychiatrist-for-depression-india">
                <span className="ed-index__num">02</span>
                <span><h3 className="ed-index__title">Depression — online care</h3></span>
                <p className="ed-index__body">Screening, therapy, medication review, and the difference between counselling and psychiatry.</p>
                <span className="ed-index__go" aria-hidden="true">Read →</span>
              </Link>
              <Link className="ed-index__row" to="/anxiety-counselling-online-india">
                <span className="ed-index__num">03</span>
                <span><h3 className="ed-index__title">Anxiety — online care</h3></span>
                <p className="ed-index__body">GAD-7, stepped care, regulated medication categories, and how online therapy works.</p>
                <span className="ed-index__go" aria-hidden="true">Read →</span>
              </Link>
              <Link className="ed-index__row" to="/adhd-assessment-online-india">
                <span className="ed-index__num">04</span>
                <span><h3 className="ed-index__title">Adult ADHD — assessment online</h3></span>
                <p className="ed-index__body">Structured assessment process, validated scales, and why prescribing is careful.</p>
                <span className="ed-index__go" aria-hidden="true">Read →</span>
              </Link>
              <Link className="ed-index__row" to="/ocd-treatment-online-india">
                <span className="ed-index__num">05</span>
                <span><h3 className="ed-index__title">OCD — online treatment</h3></span>
                <p className="ed-index__body">Structured assessment, ERP-focused therapy, and medication review where clinically appropriate.</p>
                <span className="ed-index__go" aria-hidden="true">Read →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="svd-cta">
        <div className="ed-shell">
          <div className="ed-facing">
            <div>
              <p className="ed-mono">Still have questions?</p>
              <h2>Email support or book a consultation.</h2>
            </div>
            <div className="faq-editorial-actions">
              <a className="btn btn-primary" href="mailto:support@serenest.in?subject=FAQ%20Question">
                Contact support →
              </a>
              <Link className="btn btn-ghost" to="/book">Book now</Link>
              <Link className="btn btn-ghost" to="/privacy">Privacy policy</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

