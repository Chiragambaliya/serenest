import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { bookPathFor, relatedOf, specialtyByPath } from '../lib/specialties';
import {
  PageHero, EmergencyCallout, FAQSection, TrustGrid, CTA, RelatedTopics, References,
} from '../components/SeoTopicPage';
import NotFoundPage from './NotFoundPage';

const LANGUAGE = 'Available in English, Hindi, and Gujarati where the treating clinician supports the language. Serenest currently provides adult care across India.';

export default function SpecialtyPage() {
  const { pathname } = useLocation();
  const specialty = specialtyByPath(pathname);
  const active = Boolean(specialty?.owned);
  const seo = active ? (ROUTE_SEO[specialty.path] || {}) : {};
  useSEO({ path: active ? specialty.path : pathname, ...seo });

  if (!active) return <NotFoundPage />;

  const related = relatedOf(specialty).slice(0, 3).map((item) => ({
    to: item.path,
    title: item.name,
    body: item.summary,
  }));

  return (
    <div>
      <PageHero
        kicker={specialty.kicker}
        title={<>{specialty.titleLead} <span className="gradient-text">{specialty.titleEmphasis}</span></>}
        lead={specialty.lead}
        primaryHref={bookPathFor(specialty)}
        primaryLabel="Request an appointment"
        secondaryHref={specialty.screen?.to || '/specialties'}
        secondaryLabel={specialty.screen?.label || 'All specialties'}
        language={LANGUAGE}
      />

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">What people usually describe</div>
            <h2>{specialty.name}</h2>
            <p>{specialty.looksLike}</p>
          </div>
          <TrustGrid items={specialty.points.map((point) => ({ ...point, icon: '' }))} />
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">Scope</div>
            <h2>What online care can and cannot do</h2>
          </div>
          <EmergencyCallout note={specialty.emergencyNote} />
          <div className="grid-2" style={{ marginTop: 24 }}>
            {specialty.limits.map((item) => (
              <article key={item.title} className="tile">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FAQSection title={`${specialty.name} — common questions`} faqs={specialty.faqs} />

      {related.length > 0 ? <RelatedTopics items={related} /> : null}

      <References items={specialty.references} />

      <CTA
        heading={`Request a ${specialty.name.toLowerCase()} appointment`}
        body="Tell us your name and phone. We confirm the clinician and time by phone or WhatsApp. You pay after the slot is locked. This is not an emergency service."
        primaryHref={bookPathFor(specialty)}
        primaryLabel="Request an appointment"
        secondaryHref="/pricing"
        secondaryLabel="See fees"
      />
    </div>
  );
}
