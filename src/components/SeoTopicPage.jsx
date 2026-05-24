import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Shared layout primitives for SEO topic pages. Keeps copy, structure, and
 * disclaimers consistent across the depression/anxiety/ADHD/Gujarat/PHQ-9/
 * GAD-7/prescription pages without forcing a single monolithic component.
 */

export function PageHero({ kicker, title, lead, primaryHref, primaryLabel, secondaryHref, secondaryLabel, language }) {
  return (
    <section className="page-hero">
      <div className="page-hero-bg" aria-hidden="true" />
      <div className="container">
        <div className="page-hero-inner">
          {kicker ? <div className="section-kicker">{kicker}</div> : null}
          <h1 className="page-hero-title">{title}</h1>
          {lead ? <p className="page-hero-lead">{lead}</p> : null}
          <div className="page-hero-actions">
            {primaryHref ? (
              <Link className="btn btn-primary btn-lg" to={primaryHref}>
                {primaryLabel} →
              </Link>
            ) : null}
            {secondaryHref ? (
              <Link className="btn btn-ghost btn-lg" to={secondaryHref}>
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
          {language ? (
            <p style={{ marginTop: 16, fontSize: 13, color: 'rgba(11,36,32,0.65)' }}>{language}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function EmergencyCallout({ note }) {
  return (
    <div className="callout-box" style={{ marginTop: 8 }}>
      <span className="callout-box-icon">⚠️</span>
      <div>
        <div className="callout-box-title">Not for psychiatric emergencies</div>
        <p className="callout-box-text">
          Serenest is not an emergency service. If you, or someone you know, is in immediate danger
          — including thoughts of self-harm or suicide — please contact a local emergency
          number, go to your nearest hospital, or call iCall:{' '}
          <a href="tel:7777936367" style={{ fontWeight: 700 }}>7777936367</a>. In India, you can
          also reach iCall at icallhelp.in or AASRA at +91-9820466726.
          {note ? <><br /><br />{note}</> : null}
        </p>
      </div>
    </div>
  );
}

export function FAQSection({ id = 'faq', title = 'Frequently asked questions', faqs }) {
  return (
    <section className="section alt" id={id}>
      <div className="container">
        <div className="section-head center">
          <div className="section-kicker">FAQ</div>
          <h2>{title}</h2>
        </div>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          {faqs.map(({ q, a }) => (
            <details key={q} className="faq-item" style={{ marginBottom: 12 }}>
              <summary><strong>{q}</strong></summary>
              <p style={{ marginTop: 8 }}>{a}</p>
            </details>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link to="/faq">See the full FAQ →</Link>
        </div>
      </div>
    </section>
  );
}

export function TrustGrid({ items }) {
  return (
    <div className="grid-3">
      {items.map(({ icon, title, body }) => (
        <article key={title} className="tile">
          {icon ? <div className="tile-icon">{icon}</div> : null}
          <h3>{title}</h3>
          <p>{body}</p>
        </article>
      ))}
    </div>
  );
}

export function CTA({ heading, body, primaryHref = '/book', primaryLabel = 'Book a consultation', secondaryHref = '/pricing', secondaryLabel = 'See pricing' }) {
  return (
    <section className="section">
      <div className="container">
        <div className="cta-banner">
          <div className="cta-banner-body">
            <h2>{heading}</h2>
            {body ? <p>{body}</p> : null}
          </div>
          <div className="cta-banner-actions">
            <Link className="btn btn-primary btn-lg" to={primaryHref}>
              {primaryLabel} →
            </Link>
            {secondaryHref ? (
              <Link className="btn btn-outline btn-lg" to={secondaryHref}>
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export function RelatedTopics({ items }) {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head center">
          <div className="section-kicker">Related topics</div>
          <h2>Explore related online mental health pages</h2>
        </div>
        <div className="grid-3">
          {items.map(({ to, title, body }) => (
            <article key={to} className="tile">
              <h3><Link to={to}>{title}</Link></h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function References({ items }) {
  if (!items?.length) return null;
  return (
    <section className="section alt">
      <div className="container" style={{ maxWidth: 820 }}>
        <div className="section-head" style={{ textAlign: 'left' }}>
          <div className="section-kicker">References &amp; further reading</div>
          <h2 style={{ fontSize: 22 }}>Authoritative sources</h2>
        </div>
        <ul style={{ lineHeight: 1.7, paddingLeft: 20 }}>
          {items.map(({ href, label, note }) => (
            <li key={href}>
              <a href={href} target="_blank" rel="noopener noreferrer">{label}</a>
              {note ? <> — <span style={{ color: 'rgba(11,36,32,0.7)' }}>{note}</span></> : null}
            </li>
          ))}
        </ul>
        <p style={{ marginTop: 16, fontSize: 12.5, color: 'rgba(11,36,32,0.6)' }}>
          Content on this page is for general informational purposes and does not constitute
          medical advice, diagnosis, or treatment. Please consult a qualified clinician for advice
          about your situation.
        </p>
      </div>
    </section>
  );
}
