import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import EditorialHero from '../components/EditorialHero';
import SectionHeading from '../components/SectionHeading';
import ServiceCard from '../components/ServiceCard';
import ImageTextSection from '../components/ImageTextSection';
import AcademyPreview from '../components/AcademyPreview';
import BookingCTA from '../components/BookingCTA';

const IMG = {
  hero: {
    webp: '/images/serenest-hero-editorial.webp',
    jpg: '/images/serenest-hero-editorial.jpg',
    alt: 'Editorial illustration for Serenest — botanical forms and a calm profile path',
    width: 960,
    height: 1080,
  },
  why: {
    webp: '/images/editorial/serenest-academy-books.webp',
    jpg: '/images/editorial/serenest-academy-books.jpg',
    alt: 'Stack of clinical books on a wooden surface in soft natural light',
    width: 900,
    height: 900,
  },
  pros: {
    webp: '/images/editorial/serenest-academy-books.webp',
    jpg: '/images/editorial/serenest-academy-books.jpg',
    alt: 'Quiet study setting suggesting professional learning',
    width: 900,
    height: 900,
  },
  cta: {
    webp: '/images/editorial/serenest-cta-branch.webp',
    jpg: '/images/editorial/serenest-cta-branch.jpg',
    width: 1400,
    height: 788,
  },
};

const SERVICES = [
  {
    title: 'Psychiatry',
    body: 'Clinical assessment, treatment planning and ongoing psychiatric care.',
    to: '/services#psychiatry',
    icon: 'stethoscope',
  },
  {
    title: 'Therapy and Counselling',
    body: 'Structured psychological support for emotional, behavioural and relationship concerns.',
    to: '/services#therapy',
    icon: 'chat',
  },
  {
    title: 'Addiction and Recovery',
    body: 'Assessment, counselling, relapse prevention and recovery-oriented care.',
    to: '/services#addiction',
    icon: 'pill',
  },
  {
    title: 'Digital Mental Health',
    body: 'Responsible online consultations and digitally supported mental-health care.',
    to: '/services#digital',
    icon: 'monitor',
  },
];

const WHY_POINTS = [
  'Doctor-led clinical oversight',
  'Ethical and confidential care',
  'Coordinated psychiatry and therapy',
  'Responsible addiction support',
  'Clear professional boundaries',
  'Thoughtful digital experience',
];

const ACADEMY_AREAS = [
  { title: 'Clinical Psychiatry', to: '/academy', icon: 'stethoscope' },
  { title: 'Psychopharmacology', to: '/academy', icon: 'pill' },
  { title: 'Psychotherapy', to: '/academy', icon: 'chat' },
  { title: 'Addiction and Recovery', to: '/academy', icon: 'heart' },
];

/**
 * Serenest 2.0 editorial homepage — test route only (/preview).
 * Live `/` remains the current HomePage.
 */
export default function HomePreviewPage() {
  useSEO({
    path: '/preview',
    title: 'Homepage preview (test) | Serenest',
    description: 'Internal test preview of the editorial Serenest homepage. Not the live site.',
    noindex: true,
  });

  return (
    <div className="home-preview">
      <EditorialHero
        eyebrow="Doctor-led mental healthcare"
        title="Care for the mind, grounded in clinical practice."
        description="Psychiatry, therapy, addiction support and professional mental-health education—brought together with clinical responsibility and human understanding."
        primary={{ label: 'Explore Services', to: '/services' }}
        secondary={{ label: 'Book an Appointment', to: '/book' }}
        image={IMG.hero}
      />

      <section className="ed-section" aria-labelledby="ed-services-title">
        <div className="ds-shell ds-shell--wide">
          <SectionHeading
            eyebrow="Care"
            title="Services"
            description="Clinical pathways for individuals and families — introduced clearly, without noise."
            titleId="ed-services-title"
          />
          <div className="ed-services">
            {SERVICES.map((s) => (
              <ServiceCard key={s.title} {...s} />
            ))}
          </div>
        </div>
      </section>

      <ImageTextSection
        eyebrow="Why Serenest"
        title="Clinical care with human understanding."
        titleId="ed-why-title"
        description="Serenest is built as a complete mental-health platform — not a directory, and not education alone. Care, learning and digital tools stay connected under clear clinical responsibility."
        points={WHY_POINTS}
        image={IMG.why}
        imagePosition="right"
        tone="soft"
      />

      <ImageTextSection
        eyebrow="For professionals"
        title="Learning and resources for people shaping mental healthcare."
        titleId="ed-pros-title"
        description="Serenest Academy, clinical learning, professional collaboration, and research-minded educational resources — designed to strengthen practice without marketing noise."
        points={[
          'Serenest Academy',
          'Clinical learning',
          'Professional collaboration',
          'Research and educational resources',
        ]}
        actions={[{ label: 'Explore For Professionals', to: '/professionals' }]}
        image={IMG.pros}
        imagePosition="left"
      />

      <AcademyPreview
        areas={ACADEMY_AREAS}
        primary={{ label: 'Explore Academy', to: '/academy' }}
        secondary={{ label: 'View Programs', to: '/academy' }}
      />

      <section className="ed-section ed-section--compact" aria-label="Quick links">
        <div className="ds-shell">
          <p className="ed-note">
            Prefer to talk first?{' '}
            <a className="ds-link" href="mailto:support@serenest.in">Email support@serenest.in</a>
            {' '}or{' '}
            <Link className="ds-link" to="/faq">visit the help centre</Link>.
          </p>
        </div>
      </section>

      <BookingCTA
        title="Start with the kind of support you need."
        primary={{ label: 'Explore Services', to: '/services' }}
        secondary={{ label: 'Book an Appointment', to: '/book' }}
        image={IMG.cta}
      />
    </div>
  );
}
