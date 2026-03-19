import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const ROLES = [
  { id: 'psychiatrist', label: 'Psychiatrist' },
  { id: 'psychologist', label: 'Psychologist' },
  { id: 'therapist', label: 'Therapist' },
  { id: 'counsellor', label: 'Counsellor' },
];

const DURATIONS = ['30', '45', '60'];

const LS_KEY = 'serenest_professional_applications_v1';

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

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
  const [mode, setMode] = useState('Video / Audio / Chat');
  const [availability, setAvailability] = useState('Mon–Sat, 6pm–9pm');
  const [consent, setConsent] = useState(false);

  const phoneClean = phone.replace(/[^\d]/g, '');
  const isPhoneValid = phoneClean.length === 10 && /^[6-9]/.test(phoneClean);
  const isNameValid = fullName.trim().length >= 2;

  const isStep1Valid = isNameValid && isPhoneValid;
  const isStep2Valid = registration.trim().length >= 4 || role !== 'psychiatrist';
  const isStep4Valid = String(fee).trim().length > 0 && consent;

  const roleLabel = useMemo(() => ROLES.find((r) => r.id === role)?.label ?? 'Professional', [role]);

  const record = {
    role,
    role_label: roleLabel,
    full_name: fullName.trim(),
    phone: `+91${phoneClean}`,
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
    modes: mode.trim(),
    availability: availability.trim(),
    status: 'pending',
  };

  async function persistApplication() {
    if (supabase) {
      const { error } = await supabase.from('professional_applications').insert([record]);
      if (error) throw error;
    } else {
      const now = new Date();
      const lsRecord = { id: `${now.getTime()}`, created_at: now.toISOString(), ...record };
      const existing = safeJsonParse(localStorage.getItem(LS_KEY) ?? '[]', []);
      const next = Array.isArray(existing) ? [lsRecord, ...existing] : [lsRecord];
      localStorage.setItem(LS_KEY, JSON.stringify(next));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isStep4Valid) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await persistApplication();
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
            <div className="section-head about-hero-head" style={{ textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
              <p className="kicker">Application submitted</p>
              <h1 className="page-title">Thank you, {fullName.trim()}.</h1>
              <p className="about-subtext">
                We will verify your credentials and get back to you at {email || phone}.
              </p>
              <Link className="btn btn-primary" to="/">
                Back to home
              </Link>
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
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="10-digit number"
                        inputMode="numeric"
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

                <div className="booking-actions">
                  <Link className="btn btn-ghost" to="/professionals">
                    ← Back
                  </Link>
                  <button className="btn btn-primary" type="button" onClick={() => setStep(2)} disabled={!isStep1Valid}>
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
                      <span className="field-hint">Required for psychiatrists.</span>
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

                <div className="booking-actions">
                  <button className="btn btn-ghost" type="button" onClick={() => setStep(1)}>
                    ← Back
                  </button>
                  <button className="btn btn-primary" type="button" onClick={() => setStep(3)} disabled={!isStep2Valid}>
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

                <div className="booking-actions">
                  <button className="btn btn-ghost" type="button" onClick={() => setStep(2)}>
                    ← Back
                  </button>
                  <button className="btn btn-primary" type="button" onClick={() => setStep(4)}>
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

                  <label className="field">
                    <span className="field-label">Modes offered</span>
                    <input
                      className="input"
                      value={mode}
                      onChange={(e) => setMode(e.target.value)}
                      placeholder="Video / Audio / Chat"
                    />
                  </label>

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

                {submitError && (
                  <p className="field-hint" style={{ marginTop: 14, color: 'rgba(160,60,60,0.9)' }}>
                    {submitError}
                  </p>
                )}

                <div className="booking-actions">
                  <button className="btn btn-ghost" type="button" onClick={() => setStep(3)}>
                    ← Back
                  </button>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleSubmit}
                    disabled={!isStep4Valid || submitting}
                  >
                    {submitting ? 'Submitting…' : 'Submit application →'}
                  </button>
                </div>

                {!isStep4Valid && (
                  <p className="fineprint" style={{ marginTop: 12 }}>
                    Please add a fee and confirm consent to submit.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
