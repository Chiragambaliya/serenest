import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO, PRESCRIPTION_FAQS } from '../lib/seo';
import {
  PageHero, EmergencyCallout, FAQSection, CTA, RelatedTopics, References,
} from '../components/SeoTopicPage';

const PATH = '/online-psychiatrist-prescription-india';

export default function OnlinePrescriptionPage() {
  useSEO({ path: PATH, ...ROUTE_SEO[PATH] });

  return (
    <div>
      <PageHero
        kicker="Telemedicine Practice Guidelines, 2020"
        title={<>Online psychiatrist prescription in India — <span className="gradient-text">how it actually works.</span></>}
        lead={
          <>A clear, India-specific explainer on online psychiatric prescriptions: when they are valid, what categories of medicines may be prescribed online, what is restricted, and why clinical judgment ultimately decides what is appropriate for your case.</>
        }
        primaryHref="/book"
        primaryLabel="Book a consultation"
        secondaryHref="/faq"
        secondaryLabel="See full FAQ"
      />

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">Is an online psychiatric prescription valid in India?</div>
            <h2>Short answer: yes — under the Telemedicine Practice Guidelines, 2020</h2>
            <p>
              Registered medical practitioners can issue digital prescriptions during a telemedicine consultation under India’s <a href="https://www.mohfw.gov.in/pdf/Telemedicine.pdf" target="_blank" rel="noopener noreferrer">Telemedicine Practice Guidelines, 2020</a>. These guidelines were notified by the Ministry of Health &amp; Family Welfare with the (then) Board of Governors in suppression of the Medical Council of India, and are followed under the National Medical Commission. They form the legal and clinical framework for tele-consultations and digital prescribing in India.
            </p>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">Medicine categories under the Guidelines</div>
            <h2>What can — and cannot — be prescribed online</h2>
            <p>
              The Telemedicine Practice Guidelines define lists of medicines that may be prescribed during a telemedicine consultation. The exact list is in the official document; in summary:
            </p>
          </div>
          <div className="grid-2">
            <article className="tile">
              <h3>Generally permitted (subject to clinical judgment)</h3>
              <ul style={{ paddingLeft: 20, lineHeight: 1.7 }}>
                <li>Common over-the-counter medicines</li>
                <li>Many Schedule H / H1 prescription medicines used in psychiatry — for example, several antidepressants and other commonly-used medicines — when the consultation supports their use</li>
                <li>Refill of continuing medication after appropriate review (subject to conditions in the guidelines)</li>
              </ul>
            </article>
            <article className="tile">
              <h3>Restricted or not permitted online</h3>
              <ul style={{ paddingLeft: 20, lineHeight: 1.7 }}>
                <li>Schedule X / NDPS-listed narcotic and psychotropic substances — generally not appropriate for a first telemedicine prescription, and subject to additional regulatory requirements</li>
                <li>Certain controlled medications used in anxiety (e.g., benzodiazepines) and ADHD (e.g., stimulants) may have specific limits in telemedicine settings</li>
                <li>Situations where the clinician judges that in-person evaluation is required</li>
              </ul>
            </article>
          </div>
          <p style={{ marginTop: 16, fontSize: 13, color: 'rgba(11,36,32,0.65)', maxWidth: 820, marginLeft: 'auto', marginRight: 'auto' }}>
            This is a plain-English summary, not legal advice. The official categorization, conditions, and any updates are in the Telemedicine Practice Guidelines, 2020 and the Narcotic Drugs and Psychotropic Substances Act, 1985 (with rules) — both of which prevail over this page.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">What a Serenest prescription looks like</div>
            <h2>Designed to be verifiable and clinically documented</h2>
          </div>
          <div className="grid-3">
            <article className="tile">
              <h3>Practitioner identity</h3>
              <p>The prescribing clinician’s name, qualification, and council registration number are on every prescription, in line with the Telemedicine Practice Guidelines.</p>
            </article>
            <article className="tile">
              <h3>Consultation context</h3>
              <p>Date, time, and mode of consultation (video / audio / chat) are recorded. The clinician retains a clinical note (SOAP-style) for continuity of care.</p>
            </article>
            <article className="tile">
              <h3>Clear instructions</h3>
              <p>Medicine name, strength, dose, duration, frequency, and any cautions are explicitly written. Refill terms and the date of next review are clear.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">Pharmacy and validity</div>
            <h2>Will pharmacies accept it?</h2>
            <p>
              A valid digital prescription that meets the Telemedicine Practice Guidelines is designed to be verifiable. Acceptance at any individual pharmacy is the pharmacy’s decision and can vary by state, drug class, and store policy. For controlled substances, additional verification requirements may apply. Keep both a digital and printed copy where possible.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">Safety</div>
            <h2>Important safety information</h2>
          </div>
          <EmergencyCallout note={
            <>This page is informational and does not constitute legal or medical advice. For your case, a treating clinician decides what is appropriate based on assessment, history, and the applicable regulations.</>
          } />
        </div>
      </section>

      <FAQSection title="Online psychiatric prescription — common questions" faqs={PRESCRIPTION_FAQS} />

      <RelatedTopics items={[
        { to: '/online-psychiatrist-consultation-india', title: 'Online psychiatrist consultation (India)', body: 'How to book, what to expect, and how prescriptions are issued where clinically appropriate.' },
        { to: '/online-psychiatrist-for-depression-india', title: 'Online psychiatrist for depression', body: 'Depression-focused online care — therapy, medication review, follow-up.' },
        { to: '/adhd-assessment-online-india', title: 'ADHD assessment online', body: 'Why ADHD prescribing online is careful — and what an assessment looks like.' },
      ]} />

      <References items={[
        { href: 'https://www.mohfw.gov.in/pdf/Telemedicine.pdf', label: 'Telemedicine Practice Guidelines (2020), Government of India', note: 'Primary reference for telemedicine consultations and digital prescribing in India.' },
        { href: 'https://www.nmc.org.in/', label: 'National Medical Commission (NMC)', note: 'Successor to the Medical Council of India, regulator of registered medical practitioners.' },
        { href: 'https://cdsco.gov.in/', label: 'Central Drugs Standard Control Organization (CDSCO)', note: 'India’s national drug regulator. Drug schedules and rules are governed under the Drugs and Cosmetics Act and Rules.' },
      ]} />

      <CTA
        heading="Need a structured online psychiatric consultation?"
        body="Book a verified Indian psychiatrist. Prescriptions are issued where clinically appropriate under the Telemedicine Practice Guidelines, 2020."
        primaryHref="/book"
        primaryLabel="Book a consultation"
      />
    </div>
  );
}
