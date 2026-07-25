import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { professionals } from '../lib/api';
import { CONSULTATION_MODES } from '../lib/consultationModes';

const ROLES = [
  { id: 'psychiatrist', label: 'Psychiatrist' },
  { id: 'psychologist', label: 'Psychologist' },
  { id: 'therapist', label: 'Therapist' },
  { id: 'counsellor', label: 'Counsellor' },
];

const DURATIONS = ['30', '45', '60'];

export default function ProfessionalOnboardingPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Step 1 — personal + credentials
  const [role, setRole] = useState('psychiatrist');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [socialHandle, setSocialHandle] = useState('');
  const [registration, setRegistration] = useState('');
  const [degree, setDegree] = useState('');

  // Step 2 — practice + setup
  const [city, setCity] = useState('');
  const [languages, setLanguages] = useState('English, Hindi');
  const [specialities, setSpecialities] = useState('');
  const [fee, setFee] = useState('');
  const [duration, setDuration] = useState('45');
  const [modesOffered, setModesOffered] = useState(() => new Set(['video', 'audio', 'chat']));
  const [availability, setAvailability] = useState('');
  const [consent, setConsent] = useState(false);

  const phoneClean = phone.replace(/[^\d]/g, '');
  const isPhoneValid = phoneClean.length === 10 && /^[6-9]/.test(phoneClean);
  const isNameValid = fullName.trim().length >= 2;

  function toggleMode(id) {
    setModesOffered((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size <= 1) return next;
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const [step1Error, setStep1Error] = useState('');
  const [step2Error, setStep2Error] = useState('');

  function tryGoToStep2() {
    if (!isNameValid) {
      setStep1Error('Please enter your full name (minimum 2 characters).');
      return;
    }
    if (!isPhoneValid) {
      setStep1Error('Please enter a valid 10-digit Indian mobile number starting with 6–9.');
      return;
    }
    if (registration.trim().length < 4) {
      setStep1Error('Please enter your registration / license number (minimum 4 characters).');
      return;
    }
    setStep1Error('');
    setStep(2);
  }

  function trySubmit() {
    if (!city.trim()) {
      setStep2Error('Please enter your city.');
      return;
    }
    if (!String(fee).trim()) {
      setStep2Error('Please enter your consultation fee.');
      return;
    }
    if (modesOffered.size === 0) {
      setStep2Error('Select at least one consultation mode.');
      return;
    }
    if (!consent) {
      setStep2Error('Please tick the consent checkbox to submit.');
      return;
    }
    setStep2Error('');
    handleSubmit();
  }

  const roleLabel = useMemo(() => ROLES.find((r) => r.id === role)?.label ?? 'Professional', [role]);
  const progressPct = Math.round((step / 2) * 100);

  const record = {
    role,
    role_label: roleLabel,
    full_name: fullName.trim(),
    phone: phoneClean,
    email: email.trim() || null,
    social_handle: socialHandle.trim() || null,
    registration: registration.trim() || null,
    degree: degree.trim() || null,
    city: city.trim() || null,
    languages: languages.trim() || null,
    specialities: specialities.trim() || null,
    fee_inr: String(fee).trim(),
    duration_min: Number(duration),
    modes: [...modesOffered]
      .map((id) => CONSULTATION_MODES.find((m) => m.id === id)?.label)
      .filter(Boolean)
      .join(', '),
    availability: availability.trim() || null,
    status: 'pending',
  };

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await professionals.apply(record);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message ?? 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="page">
        <section className="section about-hero">
          <div className="container">
            <div className="section-head about-hero-head" style={{ textAlign: 'center', maxWidth: 540, margin: '0 auto', padding: '2rem 1rem' }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'linear-gradient(135deg, #9bb481, #46552f)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.4rem', color: '#fff', marginBottom: '1.25rem',
                boxShadow: '0 8px 24px rgba(70, 85, 47, 0.35)',
              }}>✓</div>
              <h1 className="page-title">Application received!</h1>
              <p className="about-subtext">
                Thank you, <strong>{fullName.trim().split(' ')[0]}</strong>. Our team will verify your credentials
                and reach out on <strong>+91 {phoneClean}</strong>{email ? <> or <strong>{email}</strong></> : ''} within 1–2 business days.
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                <a
                  className="btn btn-primary"
                  href={`https://wa.me/917777936367?text=${encodeURIComponent(`Hi, I just submitted my professional application for the ${roleLabel} role.`)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Chat on WhatsApp
                </a>
                <Link className="btn btn-ghost" to="/">
                  Back to home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">Professional onboarding</p>
            <h1 className="page-title">Join Serenest as a mental health professional.</h1>
            <p className="about-subtext">
              Quick 2-step application. Verification before you go live. Built for clinical workflows.
            </p>
            <p className="muted" style={{ marginTop: 12 }}>
              New here?{' '}
              <Link to="/academy/learn" style={{ fontWeight: 700, color: 'var(--teal-700)' }}>
                Browse the Academy learning hub →
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="booking-shell tile">
            <div className="booking-top">
              <div className="booking-steps" aria-label="Onboarding steps">
                <div className={`step-chip ${step === 1 ? 'is-active' : ''}`}>
                  <span className="step-dot" aria-hidden="true" />
                  About you
                </div>
                <div className={`step-chip ${step === 2 ? 'is-active' : ''}`}>
                  <span className="step-dot" aria-hidden="true" />
                  Your practice
                </div>
              </div>

              <div className="booking-summary" aria-label="Summary">
                <div className="summary-pill">{roleLabel}</div>
                <div className="summary-pill">{city || 'City'}</div>
                <div className="summary-pill">{duration} min</div>
              </div>
            </div>

            <div style={{ padding: '0 24px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: 6 }}>
                <span>Application progress</span>
                <span>{progressPct}%</span>
              </div>
              <div style={{ background: 'var(--bg-subtle, #eef2f7)', height: 8, borderRadius: 999, overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${progressPct}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #9bb481, #46552f)',
                    transition: 'width 0.2s ease',
                  }}
                />
              </div>
            </div>

            {/* Step 1: Personal + Credentials */}
            {step === 1 && (
              <div className="booking-body">
                <div className="section-head" style={{ marginBottom: 14 }}>
                  <p className="section-label">Step 1 of 2</p>
                  <h2>About you</h2>
                  <p className="muted">Basic details and your professional registration.</p>
                </div>

                <div className="form-grid">
                  <div className="field field-wide">
                    <span className="field-label">Role</span>
                    <div className="choice-grid">
                      {ROLES.map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          className={`choice-card ${role === r.id ? 'is-selected' : ''}`}
                          onClick={() => setRole(r.id)}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="field">
                    <span className="field-label">Full name</span>
                    <input
                      className="input"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      autoComplete="name"
                    />
                  </label>

                  <label className="field">
                    <span className="field-label">Phone (India)</span>
                    <div className="input-row">
                      <span className="input-prefix">+91</span>
                      <input
                        className="input"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, '').slice(0, 10))}
                        placeholder="10-digit number"
                        inputMode="numeric"
                        maxLength={10}
                        autoComplete="tel"
                        aria-invalid={phone.length > 0 && !isPhoneValid}
                      />
                    </div>
                    {phone.length > 0 && !isPhoneValid && (
                      <span className="field-hint">Enter a valid 10-digit number starting with 6–9.</span>
                    )}
                  </label>

                  <label className="field">
                    <span className="field-label">Email (optional)</span>
                    <input
                      className="input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </label>

                  <label className="field">
                    <span className="field-label">Instagram / LinkedIn handle (optional)</span>
                    <div className="input-row">
                      <span className="input-prefix">@</span>
                      <input
                        className="input"
                        value={socialHandle}
                        onChange={(e) => setSocialHandle(e.target.value.replace(/^@/, ''))}
                        placeholder="yourhandle"
                        autoComplete="off"
                      />
                    </div>
                    <span className="field-hint">Helps us feature and collaborate with you on our channels.</span>
                  </label>

                  <label className="field field-wide">
                    <span className="field-label">Registration / License number</span>
                    <input
                      className="input"
                      value={registration}
                      onChange={(e) => setRegistration(e.target.value)}
                      placeholder="MCI / SMC / RCI / equivalent"
                    />
                    <span className="field-hint">
                      {role === 'psychiatrist' && 'MCI or State Medical Council number.'}
                      {role === 'psychologist' && 'RCI registration or equivalent.'}
                      {(role === 'therapist' || role === 'counsellor') && 'RCI or recognised counselling body registration.'}
                    </span>
                  </label>

                  <label className="field">
                    <span className="field-label">Highest degree (optional)</span>
                    <input
                      className="input"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      placeholder="MBBS, MD, M.Phil, PsyD…"
                    />
                  </label>
                </div>

                {step1Error && (
                  <div style={{
                    background: '#fdecea', border: '1px solid #f5c2c0',
                    color: '#a02622', borderRadius: 10,
                    padding: '12px 14px', marginTop: 14,
                    fontSize: '0.9rem', fontWeight: 500,
                  }}>
                    {step1Error}
                  </div>
                )}

                <div className="booking-actions">
                  <Link className="btn btn-ghost" to="/professionals">
                    ← Back
                  </Link>
                  <button className="btn btn-primary" type="button" onClick={tryGoToStep2}>
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Practice + Setup */}
            {step === 2 && (
              <div className="booking-body">
                <div className="section-head" style={{ marginBottom: 14 }}>
                  <p className="section-label">Step 2 of 2</p>
                  <h2>Your practice</h2>
                  <p className="muted">Where you work and how you want to offer sessions.</p>
                </div>

                <div className="form-grid">
                  <label className="field">
                    <span className="field-label">City</span>
                    <input className="input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
                  </label>

                  <label className="field">
                    <span className="field-label">Languages</span>
                    <input
                      className="input"
                      value={languages}
                      onChange={(e) => setLanguages(e.target.value)}
                      placeholder="English, Hindi, Gujarati"
                    />
                  </label>

                  <label className="field field-wide">
                    <span className="field-label">Specialities (optional)</span>
                    <input
                      className="input"
                      value={specialities}
                      onChange={(e) => setSpecialities(e.target.value)}
                      placeholder="Anxiety, CBT, de-addiction, etc."
                    />
                  </label>

                  <label className="field">
                    <span className="field-label">Consultation fee (₹)</span>
                    <input
                      className="input"
                      value={fee}
                      onChange={(e) => setFee(e.target.value)}
                      placeholder="e.g. 800"
                      inputMode="numeric"
                    />
                  </label>

                  <label className="field">
                    <span className="field-label">Session duration</span>
                    <select className="input" value={duration} onChange={(e) => setDuration(e.target.value)}>
                      {DURATIONS.map((d) => (
                        <option key={d} value={d}>{d} min</option>
                      ))}
                    </select>
                  </label>

                  <div className="field field-wide">
                    <span className="field-label">Consultation modes</span>
                    <div className="choice-grid choice-grid--modes">
                      {CONSULTATION_MODES.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          className={`choice-card choice-card--stacked ${modesOffered.has(m.id) ? 'is-selected' : ''}`}
                          onClick={() => toggleMode(m.id)}
                          aria-pressed={modesOffered.has(m.id)}
                        >
                          <span className="choice-card-icon" aria-hidden="true">{m.icon}</span>
                          <span className="choice-card-title">{m.label}</span>
                          <span className="choice-card-hint">{m.hint}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="field field-wide">
                    <span className="field-label">Availability (optional)</span>
                    <input
                      className="input"
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      placeholder="e.g. Mon–Sat, 6pm–9pm"
                    />
                  </label>

                  <label className="consent">
                    <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                    <span>I confirm the information is accurate and I consent to credential verification.</span>
                  </label>
                </div>

                {(step2Error || submitError) && (
                  <div style={{
                    background: '#fdecea', border: '1px solid #f5c2c0',
                    color: '#a02622', borderRadius: 10,
                    padding: '12px 14px', marginTop: 14,
                    fontSize: '0.9rem', fontWeight: 500,
                  }}>
                    {step2Error || submitError}
                  </div>
                )}

                <div className="booking-actions">
                  <button className="btn btn-ghost" type="button" onClick={() => { setStep2Error(''); setStep(1); }} disabled={submitting}>
                    ← Back
                  </button>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={trySubmit}
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting…' : 'Submit application →'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
