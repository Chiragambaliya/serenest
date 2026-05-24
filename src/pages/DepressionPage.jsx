import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO, DEPRESSION_FAQS } from '../lib/seo';
import {
  PageHero, EmergencyCallout, FAQSection, TrustGrid, CTA, RelatedTopics, References,
} from '../components/SeoTopicPage';

const PATH = '/online-psychiatrist-for-depression-india';

export default function DepressionPage() {
  useSEO({ path: PATH, ...ROUTE_SEO[PATH] });

  return (
    <div>
      <PageHero
        kicker="Online psychiatrist for depression"
        title={<>Online psychiatrist for depression in India — <span className="gradient-text">structured care, not a chatbot.</span></>}
        lead={
          <>Consult a verified Indian psychiatrist online for low mood, loss of interest, and depression-related concerns. A structured assessment, PHQ-9 screening, and an individualized care plan — therapy, medication review, or both, based on clinical judgment.</>
        }
        primaryHref="/book"
        primaryLabel="Book a depression consultation"
        secondaryHref="/phq-9-depression-screening"
        secondaryLabel="Take the PHQ-9 screening"
        language="Available in English, Hindi, and Gujarati where the treating clinician supports the language. Pan-India access."
      />

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">What depression looks like</div>
            <h2>You don’t need a diagnosis to seek help</h2>
            <p>
              Depression can show up as persistent sadness, loss of interest in things you usually enjoy, low energy, changes in sleep or appetite, difficulty concentrating, irritability, hopelessness, or thoughts that life is not worth living. If these have lasted more than two weeks and are affecting your daily life, it is reasonable to speak to a clinician.
            </p>
          </div>
          <TrustGrid items={[
            { icon: '🧠', title: 'Structured clinical assessment', body: 'Detailed history, mental status review, and validated tools — your clinician forms an impression based on the full picture, not a self-rating score alone.' },
            { icon: '📊', title: 'PHQ-9 screening, properly used', body: 'The PHQ-9 is a screening tool to gauge severity over time. It is not a diagnosis. Your clinician uses it alongside clinical judgment.' },
            { icon: '💬', title: 'Therapy, medication, or both', body: 'For many people, evidence supports talking therapy (such as CBT), medication, or a combination. The decision is individualized and made with you.' },
          ]} />
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">Screening vs. therapy vs. psychiatry</div>
            <h2>How online depression care actually works</h2>
            <p>It helps to know the difference between these three roles — they often work together.</p>
          </div>
          <div className="grid-3">
            <article className="tile">
              <h3>1. Screening</h3>
              <p>
                A confidential self-check using a validated scale such as <Link to="/phq-9-depression-screening">PHQ-9</Link>. Helpful to gauge severity and to share with your clinician. <strong>Not a diagnosis.</strong>
              </p>
            </article>
            <article className="tile">
              <h3>2. Therapy / counselling</h3>
              <p>
                Structured talking treatment with a psychologist, counsellor, or psychotherapist — for example, cognitive-behavioural therapy (CBT) for depression. Useful for mild-to-moderate depression and as part of stepped care.
              </p>
            </article>
            <article className="tile">
              <h3>3. Psychiatry</h3>
              <p>
                Medical evaluation by a psychiatrist (a medical doctor). Includes diagnosis, prescription review or initiation where clinically indicated under the Telemedicine Practice Guidelines, 2020, and follow-up.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">Important safety information</div>
            <h2>What online psychiatry can — and cannot — do for depression</h2>
          </div>
          <EmergencyCallout note={
            <>If you have current thoughts of suicide, self-harm, or you cannot keep yourself safe, please reach out to local emergency services or a crisis line right away. Do not wait for an online appointment.</>
          } />
          <div className="grid-2" style={{ marginTop: 24 }}>
            <article className="tile">
              <h3>Decisions are clinical, not algorithmic</h3>
              <p>Whether you receive a diagnosis, what kind of treatment is recommended, and whether antidepressants are appropriate is a clinical decision by the treating psychiatrist after a proper consultation.</p>
            </article>
            <article className="tile">
              <h3>Some situations need in-person care</h3>
              <p>Severe depression with safety risk, psychosis, complex co-existing conditions, or certain controlled medications may require in-person evaluation. Your clinician will tell you if this is the case.</p>
            </article>
            <article className="tile">
              <h3>Medication is one option, not the only one</h3>
              <p>Many people benefit from therapy alone, lifestyle changes, social support, or a combination of approaches — not everyone needs medication.</p>
            </article>
            <article className="tile">
              <h3>No guaranteed outcomes</h3>
              <p>Serenest does not promise a cure or any specific outcome. Care quality is grounded in structured assessment, documentation, and continuity — not promises.</p>
            </article>
          </div>
        </div>
      </section>

      <FAQSection title="Online psychiatrist for depression — common questions" faqs={DEPRESSION_FAQS} />

      <RelatedTopics items={[
        { to: '/phq-9-depression-screening', title: 'PHQ-9 depression screening', body: 'Confidential 9-item self-screening for depression severity. PHQ-9 is a screening tool — not a diagnosis.' },
        { to: '/anxiety-counselling-online-india', title: 'Anxiety counselling online', body: 'Anxiety often co-occurs with depression. Read about online anxiety care, GAD-7 screening, and stepped care.' },
        { to: '/online-psychiatrist-prescription-india', title: 'Online psychiatry prescription validity', body: 'How psychiatric prescriptions work online in India under the Telemedicine Practice Guidelines, 2020.' },
      ]} />

      <References items={[
        { href: 'https://www.mohfw.gov.in/pdf/Telemedicine.pdf', label: 'Telemedicine Practice Guidelines (2020), Government of India', note: 'Framework for telemedicine consultations and digital prescriptions in India.' },
        { href: 'https://www.who.int/news-room/fact-sheets/detail/depression', label: 'WHO — Depression fact sheet', note: 'Background information on depression as a global health concern.' },
        { href: 'https://nimhans.ac.in/', label: 'NIMHANS, Bengaluru', note: 'India\'s apex centre for mental health.' },
      ]} />

      <CTA
        heading="Ready to consult an online psychiatrist for depression?"
        body="Take 3 minutes of PHQ-9 screening, or go straight to booking with a verified Indian psychiatrist."
        primaryHref="/book"
        primaryLabel="Book a consultation"
        secondaryHref="/pricing"
        secondaryLabel="See pricing"
      />
    </div>
  );
}
