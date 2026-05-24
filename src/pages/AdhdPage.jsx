import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO, ADHD_FAQS } from '../lib/seo';
import {
  PageHero, EmergencyCallout, FAQSection, TrustGrid, CTA, RelatedTopics, References,
} from '../components/SeoTopicPage';

const PATH = '/adhd-assessment-online-india';

export default function AdhdPage() {
  useSEO({ path: PATH, ...ROUTE_SEO[PATH] });

  return (
    <div>
      <PageHero
        kicker="Adult ADHD assessment online"
        title={<>Adult ADHD assessment online in India — <span className="gradient-text">structured, careful, clinician-led.</span></>}
        lead={
          <>A structured adult ADHD evaluation by a verified Indian psychiatrist. Detailed developmental and current-symptom history, validated rating scales, and a clinical decision on next steps. We do not offer same-day ADHD prescriptions.</>
        }
        primaryHref="/book"
        primaryLabel="Book an ADHD assessment"
        secondaryHref="/services"
        secondaryLabel="How online care works"
        language="Available across India. Sessions in English, Hindi, and Gujarati where the treating clinician supports the language."
      />

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">What adult ADHD looks like</div>
            <h2>Beyond “easily distracted”</h2>
            <p>
              Adult ADHD can include persistent difficulty with attention, organization, time management, follow-through, restlessness, impulsivity, emotional regulation, and sleep — usually with traces back to childhood. Many adults also struggle with co-existing anxiety, depression, or substance use. Assessment is careful precisely because ADHD overlaps with many other conditions.
            </p>
          </div>
          <TrustGrid items={[
            { icon: '🧩', title: 'Structured assessment', body: 'Detailed history, developmental review, current symptoms, function across settings, and screening for comorbidities — anxiety, depression, sleep, substance use.' },
            { icon: '📋', title: 'Validated rating scales', body: 'Scales such as the Adult ADHD Self-Report Scale (ASRS) inform the picture. Scales are screening tools, not a diagnosis.' },
            { icon: '🩺', title: 'Multi-session evaluation', body: 'A proper adult ADHD assessment usually spans more than one appointment, plus structured questionnaires you complete in between.' },
          ]} />
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">Prescribing boundaries — important</div>
            <h2>Why we do not offer same-day ADHD prescriptions</h2>
            <p>
              ADHD medications — particularly stimulants — are tightly regulated in India and have specific limits under the Telemedicine Practice Guidelines, 2020 and applicable narcotic/controlled-substance rules. Same-day stimulant prescriptions from a first online session are not appropriate. A careful diagnosis, comorbidity screen, and risk review come first.
            </p>
          </div>
          <div className="grid-2">
            <article className="tile">
              <h3>What the assessment includes</h3>
              <ul style={{ paddingLeft: 20, lineHeight: 1.7 }}>
                <li>Detailed history — developmental, school/work, relationships</li>
                <li>Current symptoms across settings (home, work, study)</li>
                <li>Validated rating scales (e.g., ASRS)</li>
                <li>Screening for anxiety, depression, sleep, substance use, mood</li>
                <li>Risk and safety review</li>
                <li>Discussion of management options</li>
              </ul>
            </article>
            <article className="tile">
              <h3>What the assessment does not promise</h3>
              <ul style={{ paddingLeft: 20, lineHeight: 1.7 }}>
                <li>A diagnosis in a single session</li>
                <li>A specific prescription, on-demand</li>
                <li>Controlled substances over chat or audio</li>
                <li>Outcomes — every clinical decision is individualized</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">Safety and limitations</div>
            <h2>What online ADHD care can — and cannot — do</h2>
          </div>
          <EmergencyCallout />
          <div className="grid-2" style={{ marginTop: 24 }}>
            <article className="tile">
              <h3>In-person evaluation may be needed</h3>
              <p>Some clinical situations — including controlled-substance prescribing — may require in-person evaluation. Your clinician will tell you if this applies.</p>
            </article>
            <article className="tile">
              <h3>Non-medication treatment matters</h3>
              <p>Coaching, CBT for ADHD, structured routines, sleep, and exercise all play important roles. Medication is one option, not the only one.</p>
            </article>
            <article className="tile">
              <h3>Children and adolescents</h3>
              <p>Serenest currently focuses on adult care. For paediatric ADHD assessment, the family clinician will be able to refer you to an appropriate specialist.</p>
            </article>
            <article className="tile">
              <h3>No guaranteed outcomes</h3>
              <p>We do not promise a diagnosis or a specific outcome. Care quality is grounded in structured assessment, documentation, and continuity.</p>
            </article>
          </div>
        </div>
      </section>

      <FAQSection title="Adult ADHD assessment online — common questions" faqs={ADHD_FAQS} />

      <RelatedTopics items={[
        { to: '/anxiety-counselling-online-india', title: 'Anxiety counselling online', body: 'Anxiety frequently co-occurs with ADHD and is screened during assessment.' },
        { to: '/online-psychiatrist-for-depression-india', title: 'Online psychiatrist for depression', body: 'Depression often coexists with adult ADHD. Read about online depression care.' },
        { to: '/online-psychiatrist-prescription-india', title: 'Online psychiatry prescription validity', body: 'Why some ADHD medications are restricted under the Telemedicine Practice Guidelines, 2020.' },
      ]} />

      <References items={[
        { href: 'https://www.mohfw.gov.in/pdf/Telemedicine.pdf', label: 'Telemedicine Practice Guidelines (2020), Government of India' },
        { href: 'https://nimhans.ac.in/', label: 'NIMHANS, Bengaluru' },
      ]} />

      <CTA
        heading="Ready for a structured adult ADHD assessment?"
        body="Book with a verified Indian psychiatrist. Bring school/work history and any past reports."
        primaryHref="/book"
        primaryLabel="Book an ADHD assessment"
      />
    </div>
  );
}
