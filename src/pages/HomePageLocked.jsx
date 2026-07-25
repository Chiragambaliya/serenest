import React from 'react';
import { Link } from 'react-router-dom';
import EdIcon from '../components/EdIcon';
import EmailCapture from '../components/EmailCapture';
import { BLOG_POSTS } from '../lib/blogPosts';
import { ROUTE_SEO } from '../lib/seo';
import { useSEO } from '../lib/useSEO';

const TRUST = [
  { icon: 'stethoscope', title: 'Doctor-led', body: 'Psychiatrists and therapists you can trust' },
  { icon: 'target', title: 'Evidence-based', body: 'Guided by science, grounded in empathy' },
  { icon: 'shield', title: 'Private & secure', body: 'Your privacy is our highest priority' },
  { icon: 'monitor', title: 'Teleconsultation', body: 'Accessible care, wherever you are' },
  { icon: 'heart', title: 'For individuals', body: 'Care tailored to your needs' },
  { icon: 'people', title: 'For professionals', body: 'Resources, training and community' },
];

const PATHS = [
  {
    icon: 'heart',
    title: 'Individuals',
    body: 'Find the right support for your mind and emotional wellbeing.',
    cta: 'Explore care options',
    to: '/services',
    tone: 'sage',
  },
  {
    icon: 'briefcase',
    title: 'Professionals',
    body: 'Grow your practice with resources, supervision and community.',
    cta: 'Explore for professionals',
    to: '/professionals',
    tone: 'clay',
  },
  {
    icon: 'cap',
    title: 'Students & learners',
    body: 'Learn, upskill and advance your career in mental health.',
    cta: 'Explore Academy',
    to: '/academy',
    tone: 'plum',
  },
];

const SERVICES = [
  { icon: 'stethoscope', title: 'Psychiatry consultation', body: 'Expert assessment and medication care', to: '/services/psychiatry' },
  { icon: 'chat', title: 'Therapy & counselling', body: 'Talk therapy for healing and growth', to: '/services/therapy' },
  { icon: 'heart', title: 'Addiction support', body: 'Evidence-based care for lasting recovery', to: '/services/addiction-care' },
  { icon: 'person', title: 'Digital consultations', body: 'Responsible online mental-health care', to: '/services/digital-consultations' },
  { icon: 'people', title: 'Couples & family support', body: 'Build healthier relationships', to: '/services/therapy' },
  { icon: 'leaf', title: 'Mental wellness programs', body: 'Programs for everyday wellbeing', to: '/corporate' },
];

const STEPS = [
  { icon: 'calendar', title: 'Book', body: 'Choose a convenient time that works for you.' },
  { icon: 'monitor', title: 'Connect', body: 'Consult securely with your doctor or therapist.' },
  { icon: 'clipboard', title: 'Care plan', body: 'Receive a personalised plan tailored to your needs.' },
  { icon: 'heart', title: 'Follow-up', body: 'Continue with thoughtful, connected support.' },
];

const STORY_IMAGES = [
  '/images/editorial/psychiatry-followup-notes-v1.jpg',
  '/images/editorial/therapy-conversation-room-v1.jpg',
  '/images/editorial/addiction-recovery-path-v1.jpg',
  '/images/editorial/serenest-academy-books.jpg',
];

export default function HomePageLocked() {
  useSEO({ path: '/', ...ROUTE_SEO['/'] });
  const stories = BLOG_POSTS.slice(0, 4);

  return (
    <div className="locked-home">
      <section className="lh-hero" aria-labelledby="lh-hero-title">
        <div className="lh-shell lh-hero__grid">
          <div className="lh-hero__copy">
            <p className="lh-eyebrow">Doctor-led mental healthcare</p>
            <h1 id="lh-hero-title">
              Mental healthcare,
              <br />
              <em>thoughtfully</em>
              <br />
              connected.
            </h1>
            <p className="lh-hero__support">
              Care for your mind. Support for your journey.
              <br />
              Better practice for professionals.
            </p>
            <span className="lh-accent-line" aria-hidden="true" />
            <p className="lh-hero__body">
              Mental health is not one conversation. It is many moments, questions,
              setbacks and small steps forward.
            </p>
            <div className="lh-actions">
              <Link className="lh-btn lh-btn--rust" to="/services">Find your starting point</Link>
              <Link className="lh-btn lh-btn--outline" to="/academy">Explore Serenest Academy</Link>
            </div>
          </div>

          <div className="lh-hero__art">
            <picture>
              <source srcSet="/images/editorial/serenest-hero-editorial.webp" type="image/webp" />
              <img
                src="/images/editorial/serenest-hero-editorial.jpg"
                alt="Editorial illustration of a calm figure among botanical and abstract forms"
                width="1600"
                height="1067"
                fetchPriority="high"
              />
            </picture>
          </div>
        </div>
      </section>

      <section className="lh-trust" aria-label="Why Serenest">
        <div className="lh-shell lh-trust__grid">
          {TRUST.map((item) => (
            <article key={item.title} className="lh-trust__item">
              <span className="lh-icon" aria-hidden="true"><EdIcon name={item.icon} size={23} /></span>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="lh-section" aria-labelledby="lh-paths-title">
        <div className="lh-shell">
          <header className="lh-heading lh-heading--center">
            <p className="lh-eyebrow">Start where you are</p>
            <h2 id="lh-paths-title">Choose your path</h2>
            <p>We are here for every step of your mental health and professional growth.</p>
          </header>
          <div className="lh-paths">
            {PATHS.map((path) => (
              <Link key={path.title} to={path.to} className={`lh-path lh-path--${path.tone}`}>
                <span className="lh-path__icon" aria-hidden="true"><EdIcon name={path.icon} size={25} /></span>
                <div>
                  <h3>{path.title}</h3>
                  <p>{path.body}</p>
                </div>
                <strong>{path.cta} <span aria-hidden="true">→</span></strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="lh-section lh-section--compact">
        <div className="lh-shell lh-care-grid">
          <div>
            <header className="lh-heading">
              <p className="lh-eyebrow">Care</p>
              <h2>Our services</h2>
              <p>Comprehensive mental-health support, online and offline.</p>
            </header>
            <div className="lh-services">
              {SERVICES.map((service) => (
                <Link key={service.title} to={service.to} className="lh-service">
                  <span className="lh-icon lh-icon--small" aria-hidden="true">
                    <EdIcon name={service.icon} size={18} />
                  </span>
                  <span>
                    <strong>{service.title}</strong>
                    <small>{service.body}</small>
                  </span>
                </Link>
              ))}
            </div>
            <Link className="lh-text-link" to="/services">View all services <span aria-hidden="true">→</span></Link>
          </div>

          <aside className="lh-academy" aria-labelledby="lh-academy-title">
            <div className="lh-academy__copy">
              <p className="lh-eyebrow">Serenest Academy</p>
              <h2 id="lh-academy-title">Learning that strengthens practice.</h2>
              <p>Education that empowers professionals and strengthens mental healthcare.</p>
              <ul>
                <li>Clinical psychiatry and psychopharmacology</li>
                <li>Major psychotherapy schools and techniques</li>
                <li>Case discussions and masterclasses</li>
                <li>Supervision, mentorship and ethical practice</li>
              </ul>
              <Link className="lh-btn lh-btn--green" to="/academy">Explore Serenest Academy</Link>
            </div>
            <picture className="lh-academy__art">
              <source srcSet="/images/editorial/serenest-academy-books.webp" type="image/webp" />
              <img src="/images/editorial/serenest-academy-books.jpg" alt="" width="720" height="720" loading="lazy" />
            </picture>
          </aside>
        </div>
      </section>

      <section className="lh-section lh-section--soft" aria-labelledby="lh-steps-title">
        <div className="lh-shell">
          <header className="lh-heading lh-heading--center">
            <p className="lh-eyebrow">Your care journey</p>
            <h2 id="lh-steps-title">How care works</h2>
            <p>Simple, respectful and designed around you.</p>
          </header>
          <ol className="lh-steps">
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <span className="lh-step__icon" aria-hidden="true"><EdIcon name={step.icon} size={24} /></span>
                <strong>{index + 1}. {step.title}</strong>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="lh-section" aria-labelledby="lh-stories-title">
        <div className="lh-shell">
          <header className="lh-heading lh-heading--row">
            <div>
              <p className="lh-eyebrow">From Serenest</p>
              <h2 id="lh-stories-title">Stories & insights</h2>
              <p>Thoughts, guidance and real conversations.</p>
            </div>
            <Link className="lh-text-link" to="/blog">Visit all articles <span aria-hidden="true">→</span></Link>
          </header>
          <div className="lh-stories">
            {stories.map((story, index) => (
              <Link key={story.slug} to={`/blog/${story.slug}`} className="lh-story">
                <img src={STORY_IMAGES[index]} alt="" width="600" height="360" loading="lazy" />
                <div>
                  <span>{story.tag}</span>
                  <h3>{story.title}</h3>
                  <p>{story.date} · 5 min read</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="lh-cta" aria-labelledby="lh-cta-title">
        <div className="lh-cta__art" aria-hidden="true">
          <picture>
            <source srcSet="/images/editorial/serenest-cta-branch.webp" type="image/webp" />
            <img src="/images/editorial/serenest-cta-branch.jpg" alt="" width="1400" height="788" loading="lazy" />
          </picture>
        </div>
        <div className="lh-shell lh-cta__content">
          <div>
            <h2 id="lh-cta-title">You don’t have to navigate this alone.</h2>
            <p>We’re here to walk alongside you.</p>
          </div>
          <div className="lh-cta__actions">
            <Link className="lh-btn lh-btn--rust" to="/book">Book a consultation</Link>
            <a
              className="lh-text-link"
              href="https://wa.me/917777936367?text=Hi%2C%20I%27d%20like%20to%20book%20a%20session%20with%20Serenest"
              target="_blank"
              rel="noreferrer"
            >
              Talk to our team on WhatsApp <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      <section className="lh-newsletter" aria-labelledby="lh-newsletter-title">
        <div className="lh-shell lh-newsletter__grid">
          <div>
            <p className="lh-eyebrow">Stay in the loop</p>
            <h2 id="lh-newsletter-title">Useful updates, not noise.</h2>
            <p>Occasional mental-health and Academy updates. No spam.</p>
          </div>
          <EmailCapture source="homepage_newsletter" variant="light" />
        </div>
      </section>
    </div>
  );
}
