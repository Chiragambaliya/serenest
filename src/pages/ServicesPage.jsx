import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';

const HERO_NAV = [
  { label: 'Clinical care', href: '#core-services' },
  { label: 'Serenest Academy', href: '#academy' },
  { label: 'Organisations', href: '#organisations' },
  { label: 'Guides', href: '/guides', route: true },
];

const PILLARS = [
  {
    title: 'Clinical care',
    body: 'Consultations, screening, prescriptions, and records with verified clinicians.',
    href: '#core-services',
  },
  {
    title: 'Serenest Academy',
    body: 'Guides, learning tracks, and literacy partnerships on the same site.',
    href: '#academy',
  },
  {
    title: 'Organisations',
    body: 'Workplace, school, and campus mental health programmes.',
    href: '#organisations',
  },
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

const ACADEMY_SERVICES = [
  {
    tag: 'Guides',
    title: 'Patient guides',
    body: 'Explainers on depression, anxiety, ADHD, OCD, and help-seeking in India.',
    features: ['Topic guides and screening explainers', 'Stigma-aware language', 'Paths to book when ready'],
    href: '/guides',
    cta: 'View all guides',
  },
  {
    tag: 'Pharmacology',
    title: 'Clinician pharmacology',
    body: 'Telemedicine norms, prescribing, and Rx workflow for prescribers and trainees.',
    features: ['Telemedicine guidelines context', 'SOAP and documentation', 'Continuity of care'],
    href: '/professionals/learning#learning-pharmacology',
    cta: 'Pharmacology track',
  },
  {
    tag: 'Psychology',
    title: 'Clinician psychology',
    body: 'Assessment tools, psychoeducation, and carer skills on the learning hub.',
    features: ['PHQ-9 / GAD-7 in practice', 'Psychoeducation modules', 'Stigma-aware communication'],
    href: '/professionals/learning#learning-psychology',
    cta: 'Psychology track',
  },
  {
    tag: 'Partnerships',
    title: 'Schools & workplaces',
    body: 'Literacy talks, workshops, and outreach through Serenest Academy.',
    features: ['Programme design for your audience', 'School, college, workplace', 'Pairs with clinical org plans'],
    href: '/academy#contact',
    cta: 'Collaborate',
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

function ProgrammeCard({ tag, title, body, features, href, cta, external, mailSubject }) {
  const isMail = external || href?.startsWith('mailto:');
  const ctaHref = mailSubject ? `mailto:support@serenest.in?subject=${mailSubject}` : href;

  return (
    <article className="svc-programme">
      <p className="svc-programme__tag">{tag}</p>
      <h3 className="svc-programme__title">{title}</h3>
      <p className="svc-programme__body">{body}</p>
      <ul className="svc-programme__list">
        {features.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {isMail ? (
        <a className="btn btn-ghost btn-sm svc-programme__cta" href={ctaHref}>{cta}</a>
      ) : (
        <Link className="btn btn-ghost btn-sm svc-programme__cta" to={href}>{cta}</Link>
      )}
    </article>
  );
}

function ServiceCard({ tag, badge, title, lead, detail, included, forWho, price, book, link }) {
  const [open, setOpen] = useState(false);
  const expandable = included || forWho;

  return (
    <article className="svc-card">
      <div className="svc-card__head">
        {tag && <span className="svc-card__tag">{tag}</span>}
        {badge && <span className="svc-card__badge">{badge}</span>}
      </div>
      <h3 className="svc-card__title">{title}</h3>
      <p className="svc-card__lead">{lead}</p>
      {detail && <p className="svc-card__detail">{detail}</p>}

      {expandable && (
        <button type="button" className="svc-card__toggle" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          {open ? 'Hide details' : 'What\'s included'}
        </button>
      )}

      {open && expandable && (
        <div className="svc-card__details">
          {included && (
            <ul className="svc-card__list">
              {included.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          {forWho && <p className="svc-card__for">{forWho}</p>}
        </div>
      )}

      {price && <p className="svc-card__price">{price}</p>}

      <div className="svc-card__foot">
        {book && (
          <Link className="btn btn-primary btn-sm" to="/book">Book now</Link>
        )}
        {link && (
          <Link className="btn btn-ghost btn-sm" to={link.to}>{link.label}</Link>
        )}
      </div>
    </article>
  );
}

export default function ServicesPage() {
  useSEO({ path: '/services', ...ROUTE_SEO['/services'] });

  return (
    <div className="services-page">
      <section className="svc-hero">
        <div className="container svc-hero__inner">
          <p className="svc-eyebrow">Serenest · Pan-India</p>
          <h1 className="svc-hero__title">Clinical care, Academy learning, and organisation programmes — together.</h1>
          <p className="svc-hero__lead">
            Telepsychiatry, screening, prescriptions, and records on Serenest. Guides, clinician learning,
            and partnerships through Serenest Academy. One platform, one team.
          </p>
          <div className="svc-hero__actions">
            <Link className="btn btn-primary btn-lg" to="/book">Book an appointment</Link>
            <Link className="btn btn-ghost btn-lg" to="/screening">Self-screening</Link>
          </div>
          <nav className="svc-hero__nav" aria-label="On this page">
            {HERO_NAV.map((item) =>
              item.route ? (
                <Link key={item.label} to={item.href}>{item.label}</Link>
              ) : (
                <a key={item.label} href={item.href}>{item.label}</a>
              ),
            )}
          </nav>
        </div>
      </section>

      <section className="svc-pillars" aria-label="Service areas">
        <div className="container">
          <div className="svc-pillars__grid">
            {PILLARS.map((item) => (
              <a key={item.title} className="svc-pillar" href={item.href}>
                <h2 className="svc-pillar__title">{item.title}</h2>
                <p className="svc-pillar__body">{item.body}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="svc-section" id="core-services">
        <div className="container">
          <header className="svc-section__head">
            <p className="svc-eyebrow">Clinical services</p>
            <h2>Six services for end-to-end care</h2>
            <p>Verified clinicians, structured intake, and continuity — anywhere in India.</p>
          </header>
          <div className="svc-grid">
            {CORE_SERVICES.map((svc) => (
              <ServiceCard key={svc.title} {...svc} />
            ))}
          </div>
        </div>
      </section>

      <section className="svc-section svc-section--cream" id="academy">
        <div className="container">
          <header className="svc-section__head">
            <p className="svc-eyebrow">Serenest Academy</p>
            <h2>Literacy and learning — not a substitute for clinical care</h2>
            <p>
              Serenest Education Pvt Ltd publishes guides, clinician tracks, and partnership programmes
              on the same site as telepsychiatry.
            </p>
          </header>

          <div className="svc-academy__banner">
            <div className="svc-academy__copy">
              <p className="svc-academy__brand">Serenest Academy</p>
              <p>
                Understand symptoms, reduce stigma, and find the right next step. For appointments,
                use Book or Screening — Academy content is educational.
              </p>
              <div className="svc-academy__actions">
                <Link className="btn btn-primary" to="/academy">Explore Academy</Link>
                <Link className="btn btn-ghost" to="/academy#guide">Ask Academy Guide</Link>
              </div>
            </div>
            <ul className="svc-academy__links">
              <li><Link to="/guides">Patient guides</Link></li>
              <li><Link to="/professionals/learning">Clinician learning hub</Link></li>
              <li><Link to="/academy#contact">Partnerships</Link></li>
            </ul>
          </div>

          <div className="svc-programme-grid svc-programme-grid--4">
            {ACADEMY_SERVICES.map((item) => (
              <ProgrammeCard key={item.tag} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="svc-section" id="organisations">
        <div className="container">
          <header className="svc-section__head">
            <p className="svc-eyebrow">Organisations</p>
            <h2>Workplace, school &amp; campus programmes</h2>
            <p>Clinical telepsychiatry and follow-up for teams and communities.</p>
          </header>
          <div className="svc-programme-grid svc-programme-grid--3">
            {ORG_PROGRAMMES.map((prog) => (
              <ProgrammeCard key={prog.tag} {...prog} external mailSubject={prog.mailSubject} />
            ))}
          </div>
          <div className="svc-band-cta">
            <p>Need a custom plan for your organisation?</p>
            <a className="btn btn-primary" href="mailto:support@serenest.in?subject=Organisation%20Partnership">
              Get in touch
            </a>
          </div>
        </div>
      </section>

      <section className="svc-section svc-section--cream" id="how">
        <div className="container">
          <header className="svc-section__head">
            <p className="svc-eyebrow">How it works</p>
            <h2>Book to first session</h2>
          </header>
          <ol className="svc-steps">
            {STEPS.map(([title, desc], i) => (
              <li key={title} className="svc-step">
                <span className="svc-step__num">{i + 1}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="svc-section">
        <div className="container">
          <header className="svc-section__head">
            <p className="svc-eyebrow">Made for</p>
            <h2>Who uses Serenest</h2>
          </header>
          <div className="svc-audience">
            {AUDIENCES.map(([title, desc]) => (
              <article key={title} className="svc-audience__item">
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="svc-section svc-section--cream" id="conditions">
        <div className="container">
          <header className="svc-section__head">
            <p className="svc-eyebrow">Clinical areas</p>
            <h2>Conditions we support</h2>
          </header>
          <div className="svc-conditions">
            <div className="svc-conditions__head">
              <span>Condition</span>
              <span>Common symptoms</span>
            </div>
            {CONDITIONS.map(({ name, symptoms }) => (
              <div key={name} className="svc-conditions__row">
                <span>{name}</span>
                <span>{symptoms}</span>
              </div>
            ))}
          </div>
          <p className="svc-emergency">
            Not for emergencies. If someone is at immediate risk, call{' '}
            <a href="tel:7777936367">7777936367</a> or local emergency services.
          </p>
        </div>
      </section>

      <section className="svc-cta">
        <div className="container svc-cta__inner">
          <div>
            <h2>Ready when you are</h2>
            <p>Book a consultation or reach us at support@serenest.in</p>
          </div>
          <div className="svc-cta__actions">
            <Link className="btn btn-primary btn-lg" to="/book">Book now</Link>
            <Link className="btn btn-ghost btn-lg" to="/academy">Serenest Academy</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
