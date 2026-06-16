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

  const [role, setRole] = useState('psychiatrist');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [registration, setRegistration] = useState('');
  const [degree, setDegree] = useState('');
  const [year, setYear] = useState('');
  const [council, setCouncil] = useState('');

  const [clinic, setClinic] = useState('');
  const [city, setCity] = useState('');
  const [languages, setLanguages] = useState('English, Hindi');
  const [specialities, setSpecialities] = useState('');

  const [fee, setFee] = useState('');
  const [duration, setDuration] = useState('45');
  const [modesOffered, setModesOffered] = useState(() => new Set(['video', 'audio', 'chat']));
  const [availability, setAvailability] = useState('Mon–Sat, 6pm–9pm');
  const [consent, setConsent] = useState(false);

  const phoneClean = phone.replace(/[^\d]/g, '');
  const isPhoneValid = phoneClean.length === 10 && /^[6-9]/.test(phoneClean);
  const isNameValid = fullName.trim().length >= 2;
  const hasPracticeBasics = city.trim().length >= 2 && languages.trim().length >= 2;
  const isStep4Valid = String(fee).trim().length > 0 && modesOffered.size > 0 && consent;

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
  const [step3Error, setStep3Error] = useState('');

  function tryGoToStep2() {
    if (!isNameValid) {
      setStep1Error('Please enter your full name (minimum 2 characters).');
      return;
    }
    if (!isPhoneValid) {
      setStep1Error('Please enter a valid 10-digit Indian mobile number starting with 6-9.');
      return;
    }
    setStep1Error('');
    setStep(2);
  }

  function credentialRegistrationError(forRole, regTrim) {
    if (regTrim.length >= 4) return '';
    switch (forRole) {
      case 'psychiatrist':
        return 'MCI/SMC registration number is required for psychiatrists (min 4 characters).';
      case 'psychologist':
        return 'RCI / professional registration is required for psychologists (min 4 characters).';
      case 'therapist':
      case 'counsellor':
        return 'Professional registration (e.g. RCI or equivalent) is required (min 4 characters).';
      default:
        return '';
    }
  }

  function tryGoToStep3() {
    const regErr = credentialRegistrationError(role, registration.trim());
    if (regErr) {
      setStep2Error(regErr);
      return;
    }
    setStep2Error('');
    setStep(3);
  }

  function tryGoToStep4() {
    if (!hasPracticeBasics) {
      setStep3Error('Please enter at least city and languages to continue.');
      return;
    }
    setStep3Error('');
    setStep(4);
  }

  const [step4Error, setStep4Error] = useState('');
  function trySubmit() {
    if (!String(fee).trim()) {
      setStep4Error('Please enter your consultation fee.');
      return;
    }
    if (modesOffered.size === 0) {
      setStep4Error('Select at least one consultation mode (video, audio, or chat).');
      return;
    }
    if (!consent) {
      setStep4Error('Please tick the consent checkbox to submit.');
      return;
    }
    setStep4Error('');
    handleSubmit();
  }

  const roleLabel = useMemo(() => ROLES.find((r) => r.id === role)?.label ?? 'Professional', [role]);
  const progressPct = Math.round((step / 4) * 100);

  const record = {
    role,
    role_label: roleLabel,
    full_name: fullName.trim(),
    phone: phoneClean,
    email: email.trim() || null,
    registration: registration.trim() || null,
    degree: degree.trim() || null,
    year: year.trim() || null,
    council: council.trim() || null,
    clinic: clinic.trim() || null,
    city: city.trim() || null,
    languages: languages.trim() || null,
    specialities: specialities.trim() || null,
    fee_inr: String(fee).trim(),
    duration_min: Number(duration),
    modes: [...modesOffered]
      .map((id) => CONSULTATION_MODES.find((m) => m.id === id)?.label)
      .filter(Boolean)
      .join(', '),
    availability: availability.trim(),
    status: 'pending',
  };

  async function handleSubmit(e) {
    if (e?.preventDefault) e.preventDefault();
    if (!isStep4Valid) return;
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
                and reach out to you on <strong>+91 {phoneClean}</strong>{email ? <> or <strong>{email}</strong></> : ''} within 1–2 business days.
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                <a
                  className="btn btn-primary"
                  href={`https://wa.me/917777936367?text=${encodeURIComponent(`Hi, I just submitted my professional application for ${roleLabel} role.`)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  💬 Chat on WhatsApp
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
              A structured application flow. Verification before going live. Built for clinical workflows.
            </p>
            <p className="muted" style={{ marginTop: 12 }}>
              New here?{' '}
              <Link to="/professionals/learning" style={{ fontWeight: 700, color: 'var(--teal-700)' }}>
                Browse the clinician learning hub →
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
                  Personal
                </div>
                <div className={`step-chip ${step === 2 ? 'is-active' : ''}`}>
                  <span className="step-dot" aria-hidden="true" />
                  Credentials
                </div>
                <div className={`step-chip ${step === 3 ? 'is-active' : ''}`}>
                  <span className="step-dot" aria-hidden="true" />
                  Practice
                </div>
                <div className={`step-chip ${step === 4 ? 'is-active' : ''}`}>
                  <span className="step-dot" aria-hidden="true" />
                  Setup
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

            {step === 1 && (
              <div className="booking-body">
                <div className="section-head" style={{ marginBottom: 14 }}>
                  <p className="section-label">Step 1</p>
                  <h2>Personal details</h2>
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

                  <label className="field field-wide">
                    <span className="field-label">Email (optional)</span>
                    <input
                      className="input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
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
                    ⚠ {step1Error}
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

            {step === 2 && (
              <div className="booking-body">
                <div className="section-head" style={{ marginBottom: 14 }}>
                  <p className="section-label">Step 2</p>
                  <h2>Credentials</h2>
                  <p className="muted">We verify credentials before you go live.</p>
                </div>

                <div className="form-grid">
                  <label className="field field-wide">
                    <span className="field-label">Registration / License number</span>
                    <input
                      className="input"
                      value={registration}
                      onChange={(e) => setRegistration(e.target.value)}
                      placeholder="MCI/SMC/RCI/etc."
                    />
                    {role === 'psychiatrist' && (
                      <span className="field-hint">Required: MCI/SMC registration.</span>
                    )}
                    {role === 'psychologist' && (
                      <span className="field-hint">Required: RCI or recognised professional registration.</span>
                    )}
                    {(role === 'therapist' || role === 'counsellor') && (
                      <span className="field-hint">Required: registration with RCI / relevant counselling body.</span>
                    )}
                  </label>

                  <label className="field">
                    <span className="field-label">Highest degree</span>
                    <input
                      className="input"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      placeholder="MBBS, MD, M.Phil, PsyD…"
                    />
                  </label>

                  <label className="field">
                    <span className="field-label">Year of passing</span>
                    <input
                      className="input"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="e.g. 2018"
                      inputMode="numeric"
                    />
                  </label>

                  <label className="field field-wide">
                    <span className="field-label">Council / Authority</span>
                    <input
                      className="input"
                      value={council}
                      onChange={(e) => setCouncil(e.target.value)}
                      placeholder="State Medical Council / RCI / etc."
                    />
                  </label>
                </div>

                {step2Error && (
                  <div style={{
                    background: '#fdecea', border: '1px solid #f5c2c0',
                    color: '#a02622', borderRadius: 10,
                    padding: '12px 14px', marginTop: 14,
                    fontSize: '0.9rem', fontWeight: 500,
                  }}>
                    ⚠ {step2Error}
                  </div>
                )}

                <div className="booking-actions">
                  <button className="btn btn-ghost" type="button" onClick={() => { setStep1Error(''); setStep2Error(''); setStep(1); }}>
                    ← Back
                  </button>
                  <button className="btn btn-primary" type="button" onClick={tryGoToStep3}>
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="booking-body">
                <div className="section-head" style={{ marginBottom: 14 }}>
                  <p className="section-label">Step 3</p>
                  <h2>Practice details</h2>
                </div>

                <div className="form-grid">
                  <label className="field">
                    <span className="field-label">Clinic / organisation</span>
                    <input
                      className="input"
                      value={clinic}
                      onChange={(e) => setClinic(e.target.value)}
                      placeholder="Clinic / hospital / private practice"
                    />
                  </label>

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

                  <label className="field">
                    <span className="field-label">Specialities (optional)</span>
                    <input
                      className="input"
                      value={specialities}
                      onChange={(e) => setSpecialities(e.target.value)}
                      placeholder="Anxiety, CBT, de-addiction, etc."
                    />
                  </label>
                </div>

                {step3Error && (
                  <div style={{
                    background: '#fdecea', border: '1px solid #f5c2c0',
                    color: '#a02622', borderRadius: 10,
                    padding: '12px 14px', marginTop: 14,
                    fontSize: '0.9rem', fontWeight: 500,
                  }}>
                    ⚠ {step3Error}
                  </div>
                )}

                <div className="booking-actions">
                  <button className="btn btn-ghost" type="button" onClick={() => { setStep3Error(''); setStep(2); }}>
                    ← Back
                  </button>
                  <button className="btn btn-primary" type="button" onClick={tryGoToStep4}>
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="booking-body">
                <div className="section-head" style={{ marginBottom: 14 }}>
                  <p className="section-label">Step 4</p>
                  <h2>Consultation setup</h2>
                </div>

                <div className="form-grid">
                  <label className="field">
                    <span className="field-label">Fee (₹)</span>
                    <input
                      className="input"
                      value={fee}
                      onChange={(e) => setFee(e.target.value)}
                      placeholder="e.g. 799"
                      inputMode="numeric"
                    />
                  </label>

                  <label className="field">
                    <span className="field-label">Session duration</span>
                    <select className="input" value={duration} onChange={(e) => setDuration(e.target.value)}>
                      {DURATIONS.map((d) => (
                        <option key={d} value={d}>
                          {d} min
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="field field-wide">
                    <span className="field-label">Consultation modes offered</span>
                    <p className="muted" style={{ margin: '0 0 8px', fontSize: 13 }}>
                      Select every channel you can deliver sessions on (same choices patients see when booking).
                    </p>
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

                  <label className="field">
                    <span className="field-label">Availability (summary)</span>
                    <input
                      className="input"
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      placeholder="Mon–Sat, 6pm–9pm"
                    />
                  </label>

                  <label className="consent">
                    <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                    <span>I confirm the information is accurate and I consent to verification checks.</span>
                  </label>
                </div>

                {(step4Error || submitError) && (
                  <div style={{
                    background: '#fdecea', border: '1px solid #f5c2c0',
                    color: '#a02622', borderRadius: 10,
                    padding: '12px 14px', marginTop: 14,
                    fontSize: '0.9rem', fontWeight: 500,
                  }}>
                    ⚠ {step4Error || submitError}
                  </div>
                )}

                <div className="booking-actions">
                  <button className="btn btn-ghost" type="button" onClick={() => { setStep4Error(''); setStep(3); }} disabled={submitting}>
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
