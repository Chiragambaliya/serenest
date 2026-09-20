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
  { question: 'Which service is right for me?', answer: 'If you\'re unsure, start with a private check-in or request a psychiatry appointment — your clinician can help direct you to therapy, addiction support, or both, based on what you actually need. You are not charged when you send the request.' },
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
      'PHQ-9 / GAD-7 check-in',
      'A written plan after the session',
      'Digital prescription if your doctor decides it is appropriate',
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

const STEPS = [
  ['Request a slot', 'Name, phone, and a preferred time. No payment yet.'],
  ['We confirm', 'A team member calls or WhatsApps to lock the clinician and time.'],
  ['Pay after confirm', 'UPI, cards, or net banking once the slot is locked.'],
  ['Join your session', 'Encrypted video, audio, or chat — about 45 minutes.'],
  ['Leave with a plan', 'A summary, and a prescription if your doctor decides it is appropriate.'],
];

const AUDIENCES = [
  ['First-time patients', 'Private care from home — a clear first step, no referral needed.'],
  ['People on medication', 'Follow-ups and refills without repeated clinic visits.'],
  ['Smaller cities & towns', 'Verified specialists when local access is limited.'],
  ['Someone booking for family', 'Request a slot for a parent, partner, or adult child — they stay in control of the session.'],
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
              Psychiatry, therapy, addiction support, or a digital consult.
              If you are not sure where to start, request a slot or take a short check-in —
              you do not pay until we confirm the appointment.
            </p>
            <div className="svd-hero__actions">
              <Link className="btn btn-primary btn-lg" to="/book">Request an appointment</Link>
              <Link className="btn btn-ghost btn-lg" to="/screening">Start a free check</Link>
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
              Each specialty has its own page. If you are unsure, request a slot and we will help you choose.
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
            <span className="ed-head__label">What you can get</span>
            <h2>Care from the first conversation to follow-up</h2>
            <p>A session, a written plan, and — when your doctor decides it is right — a prescription you can use.</p>
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
                    {svc.book && <Link className="ed-link" to="/book">Request a slot</Link>}
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
              A check-in can help you prepare. It does not replace talking to a clinician.
            </p>
          </div>
          <div>
            <header className="ed-head ed-head--wide">
              <h2>A short check-in, then a clear next step</h2>
              <p>
                Start with a private check-in if you want language for how you have been feeling.
                When you are ready, request a psychiatrist or therapist — payment comes after we confirm.
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
                  <h3 className="ed-index__title">Request a consultation</h3>
                  <span className="ed-index__meta">Psychiatry · therapy</span>
                </span>
                <p className="ed-index__body">
                  Choose a preferred time. We confirm by phone or WhatsApp. You pay after the slot is locked.
                </p>
                <span className="ed-index__go" aria-hidden="true">Request a slot →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="svc-section" id="organisations">
        <div className="ed-shell">
          <header className="ed-head ed-head--wide">
            <span className="ed-head__label">Workplaces</span>
            <h2>Looking for care for a team, school, or campus?</h2>
            <p>That lives on a separate page so this one stays about your own appointment.</p>
          </header>
          <p>
            <Link className="btn btn-ghost" to="/corporate">Workplace and campus programmes →</Link>
          </p>
        </div>
      </section>

      <section className="svc-section svc-section--cream" id="how">
        <div className="ed-shell ed-aside">
          <div>
            <p className="ed-aside__label">How it works</p>
            <p className="ed-aside__note">From the first request to your session.</p>
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
            <p className="ed-aside__label">Who this is for</p>
            <p className="ed-aside__note">If any of these is you, request a slot — we will help with the rest.</p>
          </div>
          <div>
            <h2>People we already sit with</h2>
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
          <p>Request a slot, or write to support@serenest.in if you&apos;d rather ask first. You do not pay until we confirm.</p>
          <div className="svd-cta__actions">
            <Link className="btn btn-primary btn-lg" to="/book">Request an appointment</Link>
            <Link className="btn btn-ghost btn-lg" to="/contact">Contact us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
