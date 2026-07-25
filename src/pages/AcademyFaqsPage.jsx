import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ACADEMY_FAQS } from '../lib/academyFaqs';
import FaqAccordion from '../components/FaqAccordion';
import '../styles/service-detail.css';
import '../styles/editorial-structures.css';

export default function AcademyFaqsPage() {
  useSEO({
    path: '/academy/faqs',
    title: 'Serenest Academy — FAQs',
    description: 'Frequently asked questions about Serenest Academy programs, certificates, and enrolment.',
  });

  return (
    <div className="svd-page">
      <section className="svd-hero ed-pace-open">
        <div className="container">
          <p className="svd-eyebrow">Serenest Academy · FAQs</p>
          <h1 style={{ maxWidth: '13ch' }}>Questions about studying with us</h1>
          <p className="ed-lede" style={{ marginTop: '1.25rem' }}>
            What the programs cover, what a certificate does and doesn&apos;t represent, and how
            enrolment works.
          </p>
        </div>
      </section>

      <section className="svd-section ed-pace">
        <div className="container ed-aside">
          <div>
            <p className="ed-aside__label">Common questions</p>
            <p className="ed-aside__note">
              If yours isn&apos;t here, write to us — we answer every message.
            </p>
          </div>
          <FaqAccordion items={ACADEMY_FAQS} />
        </div>
      </section>

      {/* The scope limitation stated plainly and prominently, not
          buried in small print at the page foot. */}
      <section className="ed-band">
        <div className="container">
          <p className="ed-band__quote">What a certificate does not do</p>
          <p style={{ maxWidth: '46ch', marginTop: '1.25rem', lineHeight: 1.7 }}>
            Serenest Academy programs support professional learning and skill development. They
            do not replace a recognised degree, professional registration, supervised clinical
            requirements, or legal scope of practice.
          </p>
        </div>
      </section>

      <section className="svd-section ed-pace-tight">
        <div className="container ed-aside">
          <div>
            <p className="ed-aside__label">Still stuck?</p>
          </div>
          <p className="ed-measure" style={{ margin: 0, lineHeight: 1.7, color: 'var(--ink-2)' }}>
            <a href="mailto:support@serenest.in?subject=Serenest%20Academy%20Query" className="ed-link">
              Email the Academy team
            </a>{' '}
            and we&apos;ll get back to you. You can also browse{' '}
            <Link to="/academy/programs" className="ed-link">all programs</Link>{' '}
            or the{' '}
            <Link to="/academy/learning-paths" className="ed-link">learning paths</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
