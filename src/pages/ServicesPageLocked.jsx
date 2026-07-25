import React from 'react';
import { Link } from 'react-router-dom';
import EdIcon from '../components/EdIcon';
import EmergencyNotice from '../components/EmergencyNotice';
import FaqAccordion from '../components/FaqAccordion';
import { ROUTE_SEO } from '../lib/seo';
import { useSEO } from '../lib/useSEO';

const CARE_PATHS = [
  {
    icon: 'stethoscope',
    title: 'Psychiatry',
    body: 'Clinical assessment, diagnosis, medication planning and thoughtful follow-up.',
    bestFor: 'Mood, anxiety, sleep, attention, psychosis and medication concerns',
    to: '/services/psychiatry',
    tone: 'sage',
  },
  {
    icon: 'chat',
    title: 'Therapy & counselling',
    body: 'Structured psychological support for emotions, behaviour and relationships.',
    bestFor: 'Anxiety, low mood, trauma, grief, stress and relationship difficulties',
    to: '/services/therapy',
    tone: 'rose',
  },
  {
    icon: 'heart',
    title: 'Addiction & recovery',
    body: 'Respectful, non-stigmatising assessment and recovery-oriented care.',
    bestFor: 'Alcohol, tobacco, substances, cravings, relapse and family support',
    to: '/services/addiction-care',
    tone: 'ochre',
  },
  {
    icon: 'monitor',
    title: 'Digital consultations',
    body: 'Secure online care with clear clinical, privacy and emergency boundaries.',
    bestFor: 'Consultations and follow-ups when online care is appropriate',
    to: '/services/digital-consultations',
    tone: 'plum',
  },
];

const PRINCIPLES = [
  ['01', 'Listen before labelling', 'Your first conversation is about understanding the whole picture, not rushing to a diagnosis.'],
  ['02', 'Choose care together', 'Your preferences, clinical need and practical context shape the plan.'],
  ['03', 'Keep the thread connected', 'Psychiatry, therapy and follow-up should support one another—not work in isolation.'],
];

const FAQS = [
  {
    question: 'Which service should I choose first?',
    answer: 'If medication, diagnosis, severe symptoms or medical causes are a concern, psychiatry is often a sensible first step. If you mainly want structured emotional or behavioural support, therapy may fit better. When unsure, book a first consultation and the clinician can guide the next step.',
  },
  {
    question: 'Can psychiatry and therapy be used together?',
    answer: 'Yes. Many people benefit from combined care. Medication may reduce symptoms while therapy builds skills, insight and longer-term changes. The right mix depends on your needs and preferences.',
  },
  {
    question: 'Are all Serenest consultations online?',
    answer: 'Most Serenest consultations are offered online. Some situations require in-person examination, urgent assessment or hospital care. Your clinician will explain this clearly when it applies.',
  },
];

export default function ServicesPageLocked() {
  useSEO({ path: '/services', ...ROUTE_SEO['/services'] });

  return (
    <div className="locked-services">
      <section className="ls-hero" aria-labelledby="ls-hero-title">
        <div className="lh-shell ls-hero__grid">
          <div className="ls-hero__copy">
            <p className="lh-eyebrow">Serenest care</p>
            <h1 id="ls-hero-title">The right care begins with being understood.</h1>
            <p>
              Psychiatry, therapy, addiction support and digital care—connected around
              your needs, with clinical responsibility and human attention.
            </p>
            <div className="lh-actions">
              <Link className="lh-btn lh-btn--rust" to="/book">Book a consultation</Link>
              <Link className="lh-btn lh-btn--outline" to="/screening">Start with screening</Link>
            </div>
            <p className="ls-hero__note">Not sure where to begin? A first consultation can help identify the right next step.</p>
          </div>

          <figure className="ls-hero__visual">
            <img
              src="/images/editorial/services-consultation-space-v1.jpg"
              alt="A calm, naturally lit Serenest consultation space"
              width="1536"
              height="1024"
              fetchPriority="high"
            />
            <figcaption>Quiet care. Clear next steps.</figcaption>
          </figure>
        </div>
      </section>

      <section className="ls-section" aria-labelledby="ls-path-title">
        <div className="lh-shell">
          <header className="lh-heading lh-heading--center">
            <p className="lh-eyebrow">Choose a starting point</p>
            <h2 id="ls-path-title">Four paths, one connected standard of care.</h2>
            <p>Each pathway has a clear role. Your clinician can help combine or redirect care when needed.</p>
          </header>
          <div className="ls-care-grid">
            {CARE_PATHS.map((path) => (
              <Link key={path.title} to={path.to} className={`ls-care-card ls-care-card--${path.tone}`}>
                <span className="ls-care-card__icon" aria-hidden="true"><EdIcon name={path.icon} size={26} /></span>
                <div>
                  <h3>{path.title}</h3>
                  <p>{path.body}</p>
                </div>
                <div className="ls-care-card__best">
                  <span>Often useful for</span>
                  <p>{path.bestFor}</p>
                </div>
                <strong>Understand this service <span aria-hidden="true">→</span></strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="ls-section ls-section--soft">
        <div className="lh-shell ls-editorial-split">
          <div className="ls-editorial-split__art">
            <img
              src="/images/editorial/psychiatry-consultation-desk-v1.jpg"
              alt="A clinician's desk prepared for a thoughtful consultation"
              width="1536"
              height="1024"
              loading="lazy"
            />
            <blockquote>
              <p>“Good care does not begin with an answer. It begins with attention.”</p>
              <cite>Serenest clinical approach</cite>
            </blockquote>
          </div>
          <div>
            <header className="lh-heading">
              <p className="lh-eyebrow">Our approach</p>
              <h2>Clinical standards, with room for the person.</h2>
              <p>Care is structured enough to be responsible and human enough to feel personal.</p>
            </header>
            <ol className="ls-principles">
              {PRINCIPLES.map(([number, title, body]) => (
                <li key={title}>
                  <span>{number}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="ls-section" aria-labelledby="ls-process-title">
        <div className="lh-shell">
          <header className="lh-heading lh-heading--center">
            <p className="lh-eyebrow">What to expect</p>
            <h2 id="ls-process-title">From first contact to ongoing care.</h2>
          </header>
          <div className="ls-process">
            <article>
              <span>01</span>
              <h3>Tell us what you need</h3>
              <p>Choose a service directly or begin with screening if you are unsure.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Meet your clinician</h3>
              <p>Discuss symptoms, context, goals and any important medical history.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Build a clear plan</h3>
              <p>Agree on treatment, therapy, monitoring, referral or follow-up.</p>
            </article>
            <article>
              <span>04</span>
              <h3>Continue without starting over</h3>
              <p>Keep the care thread connected across future sessions and services.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="ls-guidance" aria-labelledby="ls-guidance-title">
        <div className="lh-shell ls-guidance__grid">
          <div>
            <p className="lh-eyebrow">Still deciding?</p>
            <h2 id="ls-guidance-title">You do not need to know the perfect service before you ask for help.</h2>
          </div>
          <div>
            <p>
              Start with what feels most relevant. If another professional or level of care
              is more appropriate, we will explain why and help you move toward it.
            </p>
            <div className="lh-actions">
              <Link className="lh-btn lh-btn--rust" to="/book">Book your first conversation</Link>
              <Link className="lh-text-link" to="/contact">Ask a question <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="ls-section ls-section--soft" aria-labelledby="ls-faq-title">
        <div className="lh-shell ls-faq-grid">
          <div>
            <p className="lh-eyebrow">Common questions</p>
            <h2 id="ls-faq-title">Before you begin</h2>
            <p>Clear information helps make the first step feel smaller.</p>
          </div>
          <div>
            <FaqAccordion items={FAQS} />
            <div className="ls-emergency"><EmergencyNotice compact /></div>
          </div>
        </div>
      </section>
    </div>
  );
}
