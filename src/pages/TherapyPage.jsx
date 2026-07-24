import React from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import FaqAccordion from '../components/FaqAccordion';
import ImagePlaceholder from '../components/ImagePlaceholder';
import '../styles/service-detail.css';

const HELPS_WITH = [
  { title: 'Anxiety and worry', body: 'Persistent worry, panic, or social anxiety.' },
  { title: 'Low mood and depression', body: 'Working through low mood alongside psychiatric care where needed.' },
  { title: 'Relationship and family strain', body: 'Communication, conflict, and relationship patterns.' },
  { title: 'Stress and burnout', body: 'Work pressure, exhaustion, and coping.' },
  { title: 'Grief and life transitions', body: 'Loss, change, and adjustment.' },
  { title: 'Trauma-related distress', body: 'Processing past experiences at a manageable pace.' },
];

const APPROACHES = [
  { title: 'CBT', body: 'Cognitive behavioural therapy — working with thought and behaviour patterns.' },
  { title: 'Supportive counselling', body: 'A structured space to process what you\'re going through.' },
  { title: 'Couples and family sessions', body: 'For relationship or family-focused concerns.' },
  { title: 'Trauma-informed approaches', body: 'Paced, safety-focused work for trauma-related concerns.' },
];

const FAQS = [
  { question: 'How is therapy different from a psychiatry consultation?', answer: 'A psychiatrist can diagnose and prescribe medication; a therapist works with you through structured conversation and techniques like CBT. Many people use both together — your psychiatrist or therapist can tell you if that combination makes sense for you.' },
  { question: 'How do I know which therapist is right for me?', answer: 'When you book, tell us what you\'re looking for and we\'ll suggest a therapist whose approach and experience fit your situation. Not every therapist on Serenest offers every technique — we\'ll be upfront about who does what.' },
  { question: 'Is what I say in therapy confidential?', answer: 'Yes, within the standard clinical and legal boundaries of confidentiality — for example, a therapist is obligated to act if there is a risk of serious harm to you or someone else. Your therapist will explain these boundaries clearly.' },
  { question: 'What does a session actually look like?', answer: 'Sessions run over secure video, audio, or chat, typically 45 minutes. Your therapist will explain their way of working in the first session so you know what to expect going forward.' },
];

export default function TherapyPage() {
  useSEO({
    path: '/services/therapy',
    title: 'Online Therapy & Counselling | Serenest',
    description: 'Structured talk therapy and counselling for individuals, couples, and families — secure video, audio, or chat sessions.',
  });

  return (
    <div className="svd-page">
      <section className="svd-hero">
        <div className="container">
          <p className="svd-eyebrow">Services · Therapy and Counselling</p>
          <h1>Structured talk therapy, from wherever you are</h1>
          <p className="svd-hero__lead">
            Individual, couples, and family therapy with a professional matched to what you're
            working through — not a one-size-fits-all chat.
          </p>
          <div className="svd-hero__actions">
            <Link className="btn btn-primary btn-lg" to="/book">Book an Appointment</Link>
            <Link className="btn btn-ghost btn-lg" to="/patient/find-professional">Find a therapist</Link>
          </div>
        </div>
      </section>

      {/* Topics — label opposite description, an editorial index. */}
      <section className="svd-section">
        <div className="container">
          <p className="svd-sidelabel">What people bring</p>
          <h2>What therapy can help with</h2>
          <ul className="svd-list svd-list--split">
            {HELPS_WITH.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.body}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Process — a statement carries this section, image anchors it. */}
      <section className="svd-section svd-section--soft">
        <div className="container svd-split">
          <div>
            <p className="svd-sidelabel">How it works</p>
            <h2>The therapy process</h2>
            <p className="svd-section-lead">
              The first session is mostly about understanding your situation and what you want out
              of therapy. From there, your therapist will suggest a way of working and a rough sense
              of how many sessions might help — this can change as things progress.
            </p>
            <p className="svd-statement">
              Not every therapist uses every approach — we match you to someone whose experience
              fits what you're working through.
            </p>
          </div>
          <div className="svd-split__media">
            <ImagePlaceholder
              asset="therapy-two-chairs.jpg"
              direction="Two empty armchairs angled toward each other in a calm, softly lit room. No people, no clinical equipment."
            />
          </div>
        </div>
      </section>

      {/* Approaches — quiet full-width reference list. */}
      <section className="svd-section">
        <div className="container">
          <p className="svd-sidelabel">Modalities</p>
          <h2>Approaches used on Serenest</h2>
          <ul className="svd-list svd-list--split">
            {APPROACHES.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.body}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Choosing + confidentiality — narrow, unhurried column. */}
      <section className="svd-section svd-section--soft">
        <div className="container svd-split svd-split--aside">
          <div>
            <p className="svd-sidelabel">Finding a fit</p>
          </div>
          <div>
            <h2>Choosing a therapist</h2>
            <p className="svd-section-lead">
              Tell us what's bringing you to therapy and we'll suggest someone suited to it. If it
              doesn't feel like the right fit after a session or two, you can ask to be matched
              with someone else.
            </p>
            <h3 style={{ marginTop: '2rem', marginBottom: '0.6rem' }}>Confidentiality and boundaries</h3>
            <p className="svd-section-lead" style={{ margin: 0 }}>
              What you share in therapy is confidential, within the standard clinical and legal
              limits your therapist will explain — most importantly, when there's a risk of serious
              harm to you or someone else.
            </p>
          </div>
        </div>
      </section>

      <section className="svd-section">
        <div className="container">
          <p className="svd-sidelabel">Questions</p>
          <h2>Frequently asked questions</h2>
          <FaqAccordion items={FAQS} />
        </div>
      </section>

      <section className="svd-cta">
        <div className="container">
          <h2>Ready to start therapy?</h2>
          <p>Tell us what you're looking for and we'll match you with the right therapist.</p>
          <div className="svd-cta__actions">
            <Link className="btn btn-primary btn-lg" to="/book">Book an Appointment</Link>
            <Link className="btn btn-ghost btn-lg" to="/services">Compare services</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
