import React from 'react';
import { useSEO } from '../lib/useSEO';
import { ACADEMY_FAQS } from '../lib/academyFaqs';
import FaqAccordion from '../components/FaqAccordion';
import '../styles/service-detail.css';

export default function AcademyFaqsPage() {
  useSEO({
    path: '/academy/faqs',
    title: 'Serenest Academy — FAQs',
    description: 'Frequently asked questions about Serenest Academy programs, certificates, and enrolment.',
  });

  return (
    <div className="svd-page">
      <section className="svd-hero">
        <div className="container">
          <p className="svd-eyebrow">Serenest Academy · FAQs</p>
          <h1>Frequently asked questions</h1>
        </div>
      </section>
      <section className="svd-section">
        <div className="container">
          <FaqAccordion items={ACADEMY_FAQS} />
        </div>
      </section>
    </div>
  );
}
