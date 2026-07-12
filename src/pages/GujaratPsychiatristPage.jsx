import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO, GUJARAT_FAQS } from '../lib/seo';
import {
  PageHero, EmergencyCallout, FAQSection, TrustGrid, CTA, RelatedTopics, References,
} from '../components/SeoTopicPage';

const PATH = '/online-psychiatrist-gujarat';

export default function GujaratPsychiatristPage() {
  useSEO({ path: PATH, ...ROUTE_SEO[PATH] });

  return (
    <div>
      <PageHero
        kicker="Telepsychiatry for Gujarat"
        title={<>Online psychiatrist in Gujarat — <span className="gradient-text">verified, private, language-aware.</span></>}
        lead={
          <>Online psychiatry consultations for patients across Gujarat — Ahmedabad, Surat, Vadodara, Rajkot, Gandhinagar, North Gujarat and surrounding districts. Sessions in Gujarati alongside English and Hindi, where the treating clinician supports the language.</>
        }
        primaryHref="/book"
        primaryLabel="Book an online psychiatrist"
        secondaryHref="/screening"
        secondaryLabel="Free PHQ-9 / GAD-7 screening"
        language="Language preference can be indicated during booking. The platform will route you to a clinician who can support your preferred language where available."
      />

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">Built for Gujarat patients too</div>
            <h2>Why patients in Gujarat use Serenest</h2>
            <p>
              Mental health services are not evenly distributed in India. Patients in smaller cities and towns often travel long distances for psychiatric care. Online psychiatry brings verified clinicians to your home — no commute, no waiting rooms, full privacy.
            </p>
          </div>
          <TrustGrid items={[
            { icon: '🌐', title: 'Pan-Gujarat access', body: 'Ahmedabad, Surat, Vadodara, Rajkot, Gandhinagar, Bhavnagar, Jamnagar, Junagadh, Anand, Bharuch, Mehsana, Patan, Palanpur, and surrounding districts.' },
            { icon: '🗣️', title: 'Gujarati where supported', body: 'Sessions in Gujarati alongside English and Hindi where the treating clinician supports the language. Indicate your preference during booking.' },
            { icon: '🔒', title: 'Private by design', body: 'Encrypted sessions and privacy-first workflows. No third-party ad trackers on consultation pages.' },
          ]} />
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-head center">
            <div className="section-kicker">What we do — and what we don’t overclaim</div>
            <h2>Honest scope</h2>
            <p>
              Serenest serves patients across India, including Gujarat. We do not claim to be the only or the largest provider; we aim to be a careful, clinically-led option for people who need structured psychiatric care online.
            </p>
          </div>
          <div className="grid-2">
            <article className="tile">
              <h3>What you get</h3>
              <ul style={{ paddingLeft: 20, lineHeight: 1.7 }}>
                <li>Verified Indian psychiatrist, by appointment</li>
                <li>Structured intake and PHQ-9 / GAD-7 screening</li>
                <li>Encrypted video, audio, or chat session</li>
                <li>Digital prescription where clinically appropriate</li>
                <li>Documented summary and follow-up plan</li>
              </ul>
            </article>
            <article className="tile">
              <h3>What we do not promise</h3>
              <ul style={{ paddingLeft: 20, lineHeight: 1.7 }}>
                <li>Same-day in-person Gujarat clinics</li>
                <li>Guaranteed Gujarati-speaking clinician for every slot</li>
                <li>Emergency/crisis services — see the safety notice below</li>
                <li>Diagnosis or cure — these are clinical decisions, not promises</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <EmergencyCallout note={
            <>If you are in Gujarat and in immediate crisis, please call 112 or reach a local hospital with psychiatric services, or call Tele-MANAS at 14416 or 1800-891-4416. Online booking is not appropriate for emergencies.</>
          } />
        </div>
      </section>

      <FAQSection title="Online psychiatrist in Gujarat — common questions" faqs={GUJARAT_FAQS} />

      <RelatedTopics items={[
        { to: '/online-psychiatrist-consultation-india', title: 'Online psychiatrist (all India)', body: 'The general India-wide online psychiatry landing page — full overview and FAQs.' },
        { to: '/online-psychiatrist-for-depression-india', title: 'Online psychiatrist for depression', body: 'Depression-focused online care: screening, therapy, and medication review.' },
        { to: '/anxiety-counselling-online-india', title: 'Anxiety counselling online', body: 'Anxiety care: GAD-7 screening, stepped-care plan, verified clinicians.' },
      ]} />

      <References items={[
        { href: 'https://www.mohfw.gov.in/pdf/Telemedicine.pdf', label: 'Telemedicine Practice Guidelines (2020), Government of India' },
        { href: 'https://nimhans.ac.in/', label: 'NIMHANS, Bengaluru' },
      ]} />

      <CTA
        heading="Ready to book an online psychiatrist for Gujarat?"
        body="Verified Indian psychiatrists, transparent pricing, encrypted sessions — for patients across Gujarat."
        primaryHref="/book"
        primaryLabel="Book a consultation"
      />
    </div>
  );
}
