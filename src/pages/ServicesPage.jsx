import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import FaqAccordion from '../components/FaqAccordion';
import EmergencyNotice from '../components/EmergencyNotice';
import ImagePlaceholder from '../components/ImagePlaceholder';
import '../styles/service-detail.css';

const SPECIALTIES = [
  { title: 'Psychiatry', body: 'Assessment, diagnosis, and medication management from a licensed psychiatrist.', href: '/services/psychiatry' },
  { title: 'Therapy and Counselling', body: 'Structured talk therapy for individuals, couples, and families.', href: '/services/therapy' },
  { title: 'Addiction and Recovery', body: 'Assessment, counselling, and relapse-prevention support for substance use.', href: '/services/addiction-care' },
  { title: 'Digital Consultations', body: 'How teleconsultation works, and what it can and can\'t do.', href: '/services/digital-consultations' },
];

const SERVICES_FAQ = [
  { question: 'Which service is right for me?', answer: 'If you\'re unsure, start with self-screening or book a psychiatry consultation — your clinician can help direct you to therapy, addiction support, or a combination, based on what you actually need.' },
  { question: 'Can I switch between services?', answer: 'Yes. Many people use more than one — for example, psychiatry for medication management alongside ongoing therapy. Your clinicians can coordinate care between them.' },
  { question: 'Do all consultations happen online?', answer: 'Most care on Serenest happens over secure video, audio, or chat. Some situations need in-person assessment — your clinician will tell you clearly if that applies to you.' },
];

const CORE_SERVICES = [
  {
    tag: 'Consultation',
    badge: 'Most popular',
    title: 'Online consultation',
    lead: 'Video, audio, or chat with a verified psychiatrist or psychologist.',
    detail: 'Encrypted sessions with assessment, treatment plan, and follow-up guidance.',
    included: [
      '45-minute encrypted session',
      'PHQ-9 / GAD-7 assessment',
      'SOAP notes and treatment plan',
      'Digital prescription if clinically appropriate',
    ],
    forWho: 'Anxiety, depression, OCD, PTSD, ADHD, sleep, stress, medication review',
    price: 'From ₹800 per session',
    book: true,
  },
  {
    tag: 'Prescription',
    title: 'Digital prescription',
    lead: 'Issued by a registered doctor when clinically appropriate.',
    detail: 'Follows India telemedicine guidelines. Some cases need in-person review.',
    included: ['Signed PDF with dose and duration', 'Registered medical practitioner', 'Subject to telemedicine rules'],
  },
  {
    tag: 'Assessment',
    title: 'Mental health assessments',
    lead: 'PHQ-9 and GAD-7 tracked over time and shared with your clinician.',
    included: ['Depression and anxiety scales', 'Score history and trends'],
    price: 'Included with consultation',
  },
  {
    tag: 'Screening',
    title: 'Self-screening',
    lead: 'A quick check-in before you book — not a diagnosis on its own.',
    link: { to: '/screening', label: 'Start screening' },
  },
  {
    tag: 'Medication',
    title: 'Medication management',
    lead: 'Prescriptions, schedules, and reminders between sessions.',
    included: ['Dosage schedule and refill alerts', 'Full medication history', 'Only your doctor can change Rx'],
  },
  {
    tag: 'Records',
    title: 'Session history & records',
    lead: 'Summaries, notes, and prescriptions — secure and downloadable.',
    included: ['Complete session history', 'PHQ-9 / GAD-7 history', 'Locked clinical records'],
  },
];

const ORG_PROGRAMMES = [
  {
    tag: 'Corporate',
    title: 'Workplace mental health',
    body: 'Confidential telepsychiatry and counselling for employees.',
    features: ['1-on-1 employee sessions', 'Manager training', 'Team wellbeing assessments', 'Dedicated psychiatry hours'],
    mailSubject: 'Corporate%20Enquiry',
    cta: 'Enquire for your company',
  },
  {
    tag: 'Schools',
    title: 'Student & staff wellbeing',
    body: 'Age-appropriate care for students and support for teaching staff.',
    features: ['Child & adolescent specialists', 'Parent guidance', 'ADHD assessments', 'Staff wellness'],
    mailSubject: 'School%20Enquiry',
    cta: 'Enquire for your school',
  },
  {
    tag: 'Colleges',
    title: 'Campus mental health',
    body: 'On-demand student consultations and structured follow-up.',
    features: ['Student appointments', 'Anxiety, depression & substance support', 'Referral pathways', 'Pulse surveys'],
    mailSubject: 'College%20Enquiry',
    cta: 'Enquire for your institution',
  },
];

const STEPS = [
  ['Register', 'Phone sign-up and brief intake.'],
  ['Choose a clinician', 'Pick language, fee, and slot from verified professionals.'],
  ['Pay & confirm', 'UPI, cards, or net banking — instant confirmation.'],
  ['Join your session', 'Encrypted video, audio, or chat (~45 minutes).'],
  ['Care plan', 'Summary and prescription where clinically appropriate.'],
];

const AUDIENCES = [
  ['First-time patients', 'Private care from home — a clear first step.'],
  ['Long-term medication', 'Follow-ups and refills without repeated clinic visits.'],
  ['Smaller cities & towns', 'Verified specialists when local access is limited.'],
  ['Clinicians on Serenest', 'Scheduling, notes, sessions, and payments in one place.'],
];

const CONDITIONS = [
  { name: 'Depression', symptoms: 'Low mood, fatigue, loss of interest' },
  { name: 'Anxiety', symptoms: 'Worry, panic, social anxiety' },
  { name: 'OCD', symptoms: 'Intrusive thoughts, compulsions' },
  { name: 'Bipolar disorder', symptoms: 'Mood swings, mania, depression' },
  { name: 'PTSD', symptoms: 'Flashbacks, trauma-related distress' },
  { name: 'ADHD (adults)', symptoms: 'Inattention, impulsivity' },
  { name: 'Sleep disorders', symptoms: 'Insomnia, disrupted sleep' },
  { name: 'Stress & burnout', symptoms: 'Exhaustion, work-related stress' },
];

export default function ServicesPage() {
  useSEO({ path: '/services', ...ROUTE_SEO['/services'] });

  return (
    <div className="services-page">
      <section className="svd-hero">
        <div className="container svd-split">
          <div>
            <h1>Find the care that fits what you&apos;re going through.</h1>
            <p className="svd-hero__lead">
              Four kinds of clinical support, one team. If you&apos;re not sure where to start,
              begin with a short self-screening or book a consultation and let your clinician
              help direct you.
            </p>
            <div className="svd-hero__actions">
              <Link className="btn btn-primary btn-lg" to="/book">Book an Appointment</Link>
              <Link className="btn btn-ghost btn-lg" to="/screening">Start with screening</Link>
            </div>
          </div>
          <div className="svd-split__media">
            <ImagePlaceholder
              asset="services-hero-clinic-daylight.jpg"
              direction="A calm, uncluttered consulting space in natural daylight — a chair, a side table, a window. No people, no stock-clinic sterility."
              src="/images/editorial/services-consultation-space-v1.jpg"
              alt="A calm consultation office with two guest chairs in natural daylight"
              loading="eager"
            />
          </div>
        </div>
      </section>

      <section className="svd-section" id="specialties" aria-label="Service comparison">
        <div className="ed-shell ed-aside">
          <div>
            <p className="ed-aside__label">Choose a starting point</p>
            <p className="ed-aside__note">
              Each specialty has its own page with clinical scope and limits.
            </p>
          </div>
          <div>
            <div className="ed-head">
              <h2>Which service is right for you?</h2>
            </div>
            <div className="ed-index">
              {SPECIALTIES.map((item, i) => (
                <Link key={item.title} className="ed-index__row" to={item.href}>
                  <span className="ed-index__num">{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <h3 className="ed-index__title">{item.title}</h3>
                    <span className="ed-index__meta">Specialty</span>
                  </span>
                  <p className="ed-index__body">{item.body}</p>
                  <span className="ed-index__go" aria-hidden="true">Learn more →</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="svc-section" id="core-services">
        <div className="ed-shell">
          <header className="ed-head ed-head--wide">
            <span className="ed-head__label">Clinical services</span>
            <h2>Six services for end-to-end care</h2>
            <p>Verified clinicians, structured intake, and continuity — anywhere in India.</p>
          </header>

          <table className="ed-table svc-core-table">
            <thead>
              <tr>
                <th scope="col">Service</th>
                <th scope="col">Type</th>
                <th scope="col">Price / status</th>
                <th scope="col">Clinical use</th>
                <th scope="col">Next step</th>
              </tr>
            </thead>
            <tbody>
              {CORE_SERVICES.map((svc) => (
                <tr key={svc.title} className={svc.badge ? 'svc-core-table__featured' : undefined}>
                  <th scope="row">
                    {svc.title}
                    {svc.badge && <span className="ed-index__meta">{svc.badge}</span>}
                  </th>
                  <td data-label="Type">{svc.tag}</td>
                  <td data-label="Price / status">{svc.price || '—'}</td>
                  <td data-label="Clinical use">{svc.lead}</td>
                  <td data-label="Next step">
                    {svc.book && <Link className="ed-link" to="/book">Book now</Link>}
                    {svc.link && <Link className="ed-link" to={svc.link.to}>{svc.link.label}</Link>}
                    {!svc.book && !svc.link && <span>—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="svc-detail-index">
            <p className="ed-mono">What is included</p>
            <div className="ed-index">
              {CORE_SERVICES.map((svc, i) => (
                <article key={svc.title} className="ed-index__row">
                  <span className="ed-index__num">{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <h3 className="ed-index__title">{svc.title}</h3>
                    <span className="ed-index__meta">{svc.tag}</span>
                  </span>
                  <div className="ed-index__body">
                    {svc.detail && <p>{svc.detail}</p>}
                    {svc.included && <p>{svc.included.join(' · ')}</p>}
                    {svc.forWho && <p>{svc.forWho}</p>}
                  </div>
                  <span className="ed-index__go" aria-hidden="true">{svc.price || ''}</span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="svc-section svc-section--cream" id="start">
        <div className="ed-shell ed-aside">
          <div>
            <p className="ed-aside__label">If you are unsure</p>
            <p className="ed-aside__note">
              Screening and guides help you prepare. They do not replace a clinical assessment.
            </p>
          </div>
          <div>
            <header className="ed-head ed-head--wide">
              <h2>A short check-in, then a clear next step</h2>
              <p>
                Start with a validated screening or a patient guide. When you are ready,
                book a psychiatrist or therapist.
              </p>
            </header>
            <div className="ed-index">
              <Link className="ed-index__row" to="/screening">
                <span className="ed-index__num">01</span>
                <span>
                  <h3 className="ed-index__title">Self-screening</h3>
                  <span className="ed-index__meta">PHQ-9 · GAD-7 · more</span>
                </span>
                <p className="ed-index__body">
                  Educational results, private by default — not a diagnosis.
                </p>
                <span className="ed-index__go" aria-hidden="true">Start a check →</span>
              </Link>
              <Link className="ed-index__row" to="/guides">
                <span className="ed-index__num">02</span>
                <span>
                  <h3 className="ed-index__title">Patient guides</h3>
                  <span className="ed-index__meta">Depression · anxiety · ADHD</span>
                </span>
                <p className="ed-index__body">
                  Stigma-aware explainers on common presentations and seeking help in India.
                </p>
                <span className="ed-index__go" aria-hidden="true">View guides →</span>
              </Link>
              <Link className="ed-index__row" to="/book">
                <span className="ed-index__num">03</span>
                <span>
                  <h3 className="ed-index__title">Book a consultation</h3>
                  <span className="ed-index__meta">Psychiatry · therapy</span>
                </span>
                <p className="ed-index__body">
                  Choose a clinician, mode, and slot. We confirm by phone or WhatsApp.
                </p>
                <span className="ed-index__go" aria-hidden="true">Book now →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="svc-section" id="organisations">
        <div className="ed-shell ed-aside">
          <div>
            <p className="ed-aside__label">Organisations</p>
            <p className="ed-aside__note">
              Clinical telepsychiatry and follow-up for teams and communities.
            </p>
          </div>
          <div>
            <header className="ed-head">
              <h2>Workplace, school &amp; campus programmes</h2>
              <p>Request a quote for your organisation and we will route it to support.</p>
            </header>
            <div className="ed-index">
              {ORG_PROGRAMMES.map((prog, i) => (
                <a
                  key={prog.tag}
                  className="ed-index__row"
                  href={`mailto:support@serenest.in?subject=${prog.mailSubject}`}
                >
                  <span className="ed-index__num">{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <h3 className="ed-index__title">{prog.title}</h3>
                    <span className="ed-index__meta">{prog.tag}</span>
                  </span>
                  <p className="ed-index__body">
                    {prog.body} {prog.features.join(' · ')}
                  </p>
                  <span className="ed-index__go" aria-hidden="true">{prog.cta} →</span>
                </a>
              ))}
            </div>
            <div className="svc-band-cta">
              <p>Need a custom plan for your organisation?</p>
              <a className="btn btn-primary" href="mailto:support@serenest.in?subject=Organisation%20Partnership">
                Get in touch
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="svc-section svc-section--cream" id="how">
        <div className="ed-shell ed-aside">
          <div>
            <p className="ed-aside__label">How it works</p>
            <p className="ed-aside__note">From booking to care plan.</p>
          </div>
          <div>
            <h2>Book to first session</h2>
            <ol className="ed-timeline">
              {STEPS.map(([title, desc], i) => (
                <li key={title}>
                  <span className="ed-timeline__stage">Stage {String(i + 1).padStart(2, '0')}</span>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="svc-section">
        <div className="ed-shell ed-aside">
          <div>
            <p className="ed-aside__label">Made for</p>
            <p className="ed-aside__note">The platform supports several different care contexts.</p>
          </div>
          <div>
            <h2>Who uses Serenest</h2>
            <div className="ed-index">
              {AUDIENCES.map(([title, desc], i) => (
                <article key={title} className="ed-index__row">
                  <span className="ed-index__num">{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <h3 className="ed-index__title">{title}</h3>
                  </span>
                  <p className="ed-index__body">{desc}</p>
                  <span />
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="svc-section svc-section--cream" id="conditions">
        <div className="ed-shell ed-aside">
          <div>
            <p className="ed-aside__label">Clinical areas</p>
            <p className="ed-aside__note">
              Common presentations supported through assessment and care planning.
            </p>
          </div>
          <div>
            <h2>Conditions we support</h2>
            <table className="ed-table ed-measure-wide">
              <thead>
                <tr>
                  <th scope="col">Condition</th>
                  <th scope="col">Common symptoms</th>
                </tr>
              </thead>
              <tbody>
                {CONDITIONS.map(({ name, symptoms }) => (
                  <tr key={name}>
                    <th scope="row">{name}</th>
                    <td data-label="Common symptoms">{symptoms}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="svc-emergency-wrap">
              <EmergencyNotice />
            </div>
          </div>
        </div>
      </section>

      <section className="svd-section">
        <div className="container">
          <p className="svd-sidelabel">Questions</p>
          <h2>Common questions about choosing a service</h2>
          <FaqAccordion items={SERVICES_FAQ} />
        </div>
      </section>

      <section className="svd-cta">
        <div className="container">
          <h2>Ready when you are</h2>
          <p>Book a consultation, or reach us at support@serenest.in if you&apos;d rather ask first.</p>
          <div className="svd-cta__actions">
            <Link className="btn btn-primary btn-lg" to="/book">Book an Appointment</Link>
            <Link className="btn btn-ghost btn-lg" to="/contact">Contact us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
