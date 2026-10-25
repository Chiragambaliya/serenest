import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { useSectionReveal } from '../hooks/useReveal';
import ImagePlaceholder from '../components/ImagePlaceholder';
import { assistant } from '../lib/api';
import {
  CARE_PHONE_DISPLAY,
  CARE_TEL_HREF,
  TRUST_POINTS,
  careWaHref,
  isIndiaMobile,
} from '../lib/patientReach';

const HOME_AI_PROMPTS = [
  {
    label: 'Sleep trouble or medication check',
    text: 'I have been having trouble sleeping for the past few weeks with racing thoughts, and I want to know if medication or therapy would help.',
  },
  {
    label: 'Work burnout & exhaustion',
    text: 'I feel completely drained, detached from my work, and overwhelmed by daily tasks. I need a structured space to recover and cope.',
  },
  {
    label: 'Persistent anxiety or panic',
    text: 'I experience constant worry, overthinking, and moments where my heart races. I want practical tools to manage anxiety.',
  },
  {
    label: 'Low mood & loss of energy',
    text: 'My mood has been persistently low for weeks, with very little energy or motivation to get through the day.',
  },
  {
    label: 'ADHD / focus or OCD patterns',
    text: 'I struggle with attention, restlessness, or repetitive intrusive thoughts and want a proper clinical evaluation.',
  },
  {
    label: 'Relationships, family, or grief',
    text: 'I am going through relationship and family stress and want a private space for ongoing talk therapy.',
  },
];

const OUR_SERVICES = [
  {
    title: 'Psychiatry',
    meta: 'Assessment · medication',
    body: 'Assessment, diagnosis, and medication management from a licensed psychiatrist.',
    href: '/services/psychiatry',
  },
  {
    title: 'Therapy and Counselling',
    meta: 'Talk therapy',
    body: 'Structured talk therapy for individuals, couples, and families.',
    href: '/services/therapy',
  },
  {
    title: 'Addiction and Recovery',
    meta: 'Substance use',
    body: 'Assessment, counselling, and relapse-prevention support for substance use.',
    href: '/services/addiction-care',
  },
  {
    title: 'Digital Mental Health',
    meta: 'Teleconsultation',
    body: 'See a clinician on video, audio, or chat from anywhere in India — no clinic wait.',
    href: '/services/digital-consultations',
  },
];

const ARRIVE_PATHS = [
  {
    num: '01',
    title: 'I need to talk to someone',
    body: 'Request a psychiatrist or therapist slot. We confirm by phone or WhatsApp — you pay after the time is locked.',
    href: '/book',
    cta: 'Request an appointment',
  },
  {
    num: '02',
    title: 'I want a private check-in first',
    body: 'Free mood, anxiety, and stress checks. Results stay on your device and are not a diagnosis.',
    href: '/screening',
    cta: 'Start a free check',
  },
  {
    num: '03',
    title: 'I want to choose who I see',
    body: 'Browse verified clinicians by language, city, and fee, then request a slot.',
    href: '/patient/find-professional',
    cta: 'Browse clinicians',
  },
];

function HpBtn({ to, variant = 'solid', children, arrow = true }) {
  return (
    <Link className={`hp-btn hp-btn--${variant}`} to={to}>
      <span className="hp-btn__label">{children}</span>
      {arrow ? <span className="hp-btn__arrow" aria-hidden="true">→</span> : null}
    </Link>
  );
}

export default function HomePage() {
  useSEO({ path: '/', ...ROUTE_SEO['/'] });
  const rootRef = useSectionReveal();

  const [aiConcern, setAiConcern] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState('');

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [acquiring, setAcquiring] = useState(false);
  const [acquireError, setAcquireError] = useState('');
  const [acquiredBooking, setAcquiredBooking] = useState(null);

  async function runHomeAiTriage(customText) {
    const text = (customText ?? aiConcern).trim();
    if (!text) {
      setAiError('Tap a concern above or describe what you are experiencing.');
      return;
    }
    setAiError('');
    setAcquireError('');
    setAiLoading(true);
    try {
      const res = await assistant.triage({ concern: text });
      if (res?.triage) {
        setAiResult(res.triage);
      }
    } catch (err) {
      setAiError(err?.message || 'Could not match right now. You can book directly at /book.');
    } finally {
      setAiLoading(false);
    }
  }

  async function handleHomeAiAcquire(e) {
    e.preventDefault();
    setAcquireError('');
    if (!clientName.trim() || clientName.trim().length < 2) {
      setAcquireError('Please enter your name.');
      return;
    }
    if (!isIndiaMobile(clientPhone)) {
      setAcquireError('Please enter a valid 10-digit Indian mobile number (starts with 6–9).');
      return;
    }
    setAcquiring(true);
    try {
      const res = await assistant.acquire({
        patient_name: clientName.trim(),
        patient_phone: clientPhone,
        concern: aiConcern,
        practitioner_type: aiResult?.practitioner_type,
        mode: aiResult?.mode,
        notes: aiResult?.structured_note
          ? `[AI Home Intake · ${aiResult.practitioner_label}]\n${aiResult.structured_note}`
          : '',
      });
      if (res?.booking) {
        setAcquiredBooking(res.booking);
      }
    } catch (err) {
      setAcquireError(err?.message || 'Could not register request. Please try again.');
    } finally {
      setAcquiring(false);
    }
  }

  return (
    <div className="home home--lean" ref={rootRef}>
      <section className="hp-hero hp-hero--bleed" aria-labelledby="home-hero-title">
        <div className="hp-hero__media" aria-hidden="true">
          <ImagePlaceholder
            asset="home-hero-patient-consultation.jpg"
            direction="Quiet consulting room in warm daylight — empty chairs, a side table, a window. No people."
            src="/images/editorial/home-consultation-room-v1.jpg"
            alt=""
            loading="eager"
          />
        </div>
        <div className="hp-hero__veil" aria-hidden="true" />
        <div className="hp-hero__content">
          <p className="hp-hero__brand">Serenest</p>
          <h1 id="home-hero-title" className="hp-hero__title">
            Talk to a psychiatrist or therapist — privately, from home.
          </h1>
          <p className="hp-hero__body">
            Describe what you are going through and let Serenest Care AI match your specialist and lock in a callback.
            You pay after the appointment is confirmed, not when you ask.
          </p>
          <div className="hp-hero__actions">
            <HpBtn to="/book" variant="solid-light">Request an appointment</HpBtn>
            <HpBtn to="/screening" variant="ghost-dark">Start a free check</HpBtn>
          </div>
          <p className="hp-hero__reach">
            <a href={CARE_TEL_HREF}>Call {CARE_PHONE_DISPLAY}</a>
            <span aria-hidden="true">·</span>
            <a href={careWaHref()} target="_blank" rel="noreferrer">WhatsApp us</a>
          </p>
        </div>
        <p className="hp-hero__note">
          Not for emergencies. If you or someone else is at immediate risk, contact local
          emergency services or a crisis helpline.
        </p>
      </section>

      <section className="hp-trust" aria-label="How Serenest care works">
        <ul className="hp-trust__list">
          {TRUST_POINTS.map((point) => (
            <li key={point.id} className="hp-trust__item">
              <span className="hp-trust__mark" aria-hidden="true" />
              {point.label}
            </li>
          ))}
        </ul>
      </section>

      {/* ── AI Care Intake & Instant Client Acquisition Band ───── */}
      <section className="ed-pace hp-ai-intake" aria-labelledby="home-ai-title">
        <div className="ed-shell">
          <div className="ai-triage-card">
            <div className="ai-triage-head">
              <div className="ai-triage-head__copy">
                <span className="ai-triage-eyebrow">
                  <span className="ai-triage-spark" aria-hidden="true">✦</span>
                  Serenest Care AI · Guided Client Intake
                </span>
                <h2 id="home-ai-title" className="ai-triage-title">
                  Tell AI what you are going through — we will match your specialist and book your callback.
                </h2>
                <p className="ai-triage-sub">
                  Pick a concern below or describe it in your own words. Our intake AI recommends the right clinician (Psychiatrist, Psychologist, Therapist, or Counsellor) and registers your request in one step.
                </p>
              </div>
            </div>

            <div className="ai-triage-body">
              <div className="ai-triage-prompts" role="group" aria-label="Common care concerns">
                {HOME_AI_PROMPTS.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    className={`ai-prompt-chip ${aiConcern === item.text ? 'is-active' : ''}`}
                    onClick={() => {
                      setAiConcern(item.text);
                      setAcquiredBooking(null);
                      runHomeAiTriage(item.text);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="ai-triage-controls">
                <div className="ai-triage-bar">
                  <input
                    type="text"
                    className="input ai-home-input"
                    value={aiConcern}
                    onChange={(e) => setAiConcern(e.target.value)}
                    placeholder="Or describe in your own words — e.g. trouble sleeping for 3 weeks, work stress, wondering about medication…"
                  />
                  <button
                    type="button"
                    className="btn btn-primary ai-match-btn"
                    disabled={aiLoading || !aiConcern.trim()}
                    onClick={() => runHomeAiTriage()}
                  >
                    {aiLoading ? 'Matching care…' : '✦ Match my care'}
                  </button>
                </div>
              </div>

              {aiError && <p className="ai-triage-error" role="alert">{aiError}</p>}

              {aiResult && (
                <div className="ai-triage-result" role="region" aria-label="AI care match result">
                  {aiResult.crisis && aiResult.crisis_notice && (
                    <div className="ai-crisis-banner" role="alert">
                      <strong>Immediate support first:</strong> {aiResult.crisis_notice}
                    </div>
                  )}

                  <div className="ai-triage-result__top">
                    <div>
                      <div className="ai-triage-badges">
                        <span className="ai-badge ai-badge--primary">
                          ✦ Matched Specialist: {aiResult.practitioner_label}
                        </span>
                        <span className="ai-badge">{aiResult.practitioner_badge}</span>
                        <span className="ai-badge">Starts at ₹{aiResult.starting_fee_inr || 499} (pay after confirmation)</span>
                      </div>
                      <p className="ai-triage-rationale">{aiResult.rationale}</p>
                    </div>
                    <Link
                      className="btn btn-ghost"
                      to={`${aiResult.book_path}&note=${encodeURIComponent(aiResult.structured_note)}`}
                    >
                      Customize slot →
                    </Link>
                  </div>

                  {acquiredBooking ? (
                    <div className="srn-ai-capture srn-ai-capture--done" role="status">
                      <div className="srn-ai-capture__badge">
                        ✓ Appointment Request Registered · Ref {String(acquiredBooking.id || '').slice(0, 8).toUpperCase()}
                      </div>
                      <p className="srn-ai-capture__copy">
                        Thank you, <strong>{acquiredBooking.patient_name}</strong>. Our care team will reach out on <strong>+91 {acquiredBooking.patient_phone}</strong> via WhatsApp or phone to confirm your <strong>{aiResult.practitioner_label}</strong> session. You do not pay until your slot is locked.
                      </p>
                      <a
                        className="btn btn-primary"
                        href={careWaHref(`Hi, I just booked a ${aiResult.practitioner_label} session via Serenest Care AI (Ref: ${String(acquiredBooking.id || '').slice(0, 8).toUpperCase()})`)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Confirm on WhatsApp →
                      </a>
                    </div>
                  ) : (
                    <form className="ai-fast-acquire" onSubmit={handleHomeAiAcquire}>
                      <div className="ai-fast-acquire__head">
                        <strong>✦ Book this {aiResult.practitioner_label} recommendation in 1 step</strong>
                        <span>Next open slot: {aiResult.next_slot?.label || 'Today / Tomorrow'} · Pay ₹{aiResult.starting_fee_inr || 499} only after confirmation</span>
                      </div>
                      <div className="ai-fast-acquire__row">
                        <input
                          type="text"
                          className="input"
                          placeholder="Your full name"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          autoComplete="name"
                        />
                        <input
                          type="tel"
                          className="input"
                          placeholder="10-digit mobile (+91)"
                          inputMode="numeric"
                          maxLength={10}
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          autoComplete="tel-national"
                        />
                        <button type="submit" className="btn btn-primary" disabled={acquiring}>
                          {acquiring ? 'Registering…' : `Request ${aiResult.practitioner_label} callback →`}
                        </button>
                      </div>
                      {acquireError && <p className="ai-triage-error" role="alert">{acquireError}</p>}
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="ed-pace hp-arrive" aria-labelledby="home-arrive-title">
        <div className="ed-shell">
          <header className="ed-head hp-arrive__head">
            <span className="ed-head__label">Begin</span>
            <h2 id="home-arrive-title">How can we help today?</h2>
            <p>Start with a conversation, a private check-in, or a clinician you choose.</p>
          </header>
          <div className="hp-arrive__paths" role="list">
            {ARRIVE_PATHS.map((path) => (
              <Link
                key={path.num}
                to={path.href}
                className="hp-arrive__path"
                role="listitem"
              >
                <span className="hp-arrive__num ed-mono">{path.num}</span>
                <span className="hp-arrive__copy">
                  <span className="hp-arrive__title">{path.title}</span>
                  <span className="hp-arrive__body">{path.body}</span>
                </span>
                <span className="hp-arrive__cta">
                  {path.cta}
                  <span aria-hidden="true"> →</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="ed-pace hp-care" aria-labelledby="home-services-title">
        <div className="ed-shell">
          <header className="ed-head">
            <span className="ed-head__label">Care</span>
            <h2 id="home-services-title">Start with what you are going through.</h2>
            <p>Psychiatry, therapy, addiction support, or a digital consult — your clinician can redirect if another fit is better.</p>
          </header>
          <div className="ed-index hp-index">
            {OUR_SERVICES.map((item, i) => (
              <Link key={item.title} to={item.href} className="ed-index__row">
                <span className="ed-index__num">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <h3 className="ed-index__title">{item.title}</h3>
                  <span className="ed-index__meta">{item.meta}</span>
                </span>
                <p className="ed-index__body">{item.body}</p>
                <span className="ed-index__go">
                  <span>View</span>
                  <span className="hp-index__arrow" aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="ed-pace ed-band-soft hp-checkin" aria-labelledby="home-check-title">
        <div className="ed-shell hp-checkin__grid">
          <header className="ed-head" style={{ marginBottom: 0 }}>
            <span className="ed-head__label">Check in</span>
            <h2 id="home-check-title">Not sure if you need an appointment yet?</h2>
            <p>
              A short, private check-in for mood, anxiety, stress, or burnout.
              Results stay on this device and are not a diagnosis.
            </p>
            <div className="hp-checkin__actions">
              <HpBtn to="/screening" variant="solid">Start a free check</HpBtn>
              <Link className="hp-text-link" to="/book">
                Skip this — request a slot
                <span aria-hidden="true"> →</span>
              </Link>
            </div>
          </header>
          <aside className="hp-checkin__aside">
            <figure className="hp-checkin__visual">
              <ImagePlaceholder
                asset="home-screening-desk.jpg"
                direction="Quiet desk in warm daylight — notebook, window, empty chair. No people."
                src="/images/editorial/psychiatry-consultation-desk-v1.jpg"
                alt="A quiet consultation desk in warm daylight"
                loading="lazy"
              />
            </figure>
            <blockquote className="ed-pull hp-pull">
              <p>“A short check-in can make the next conversation with a clinician clearer.”</p>
              <cite>Serenest Care</cite>
            </blockquote>
          </aside>
        </div>
      </section>

      <section className="ed-band hp-close" aria-labelledby="home-cta-title">
        <div className="ed-shell">
          <h2 id="home-cta-title" style={{ maxWidth: '22ch' }}>
            When you are ready, request a slot. We will take it from there.
          </h2>
          <p className="hp-cta__contact">
            <a href="mailto:support@serenest.in">support@serenest.in</a>
            <span aria-hidden="true"> · </span>
            <a href={CARE_TEL_HREF}>{CARE_PHONE_DISPLAY}</a>
            <span aria-hidden="true"> · </span>
            <a href={careWaHref()} target="_blank" rel="noreferrer">WhatsApp</a>
          </p>
          <div className="hp-hero__actions hp-close__actions">
            <HpBtn to="/book" variant="solid-light">Request an appointment</HpBtn>
            <HpBtn to="/screening" variant="ghost-dark">Start a free check</HpBtn>
          </div>
        </div>
      </section>
    </div>
  );
}
