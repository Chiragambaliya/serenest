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
  const [availability, setAvailability] = useState('Mon-Sat, 6pm-9pm');
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
      const { error } = await supabase
        .from('professionals')
        .insert([record]);
      if (error) throw error;
    } else {
      // Fallback: localStorage
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
        <main className="container" style={{ maxWidth: 560, paddingBlock: '4rem', textAlign: 'center' }}>
          <h1>Application submitted!</h1>
          <p>Thank you, {fullName.trim()}. We will verify your credentials and get back to you at {email || phone}.</p>
          <Link to="/" className="btn">Back to home</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <main className="container" style={{ maxWidth: 560, paddingBlock: '3rem' }}>
        <p className="label">Professional onboarding</p>
        <h1>Join Serenest as a mental health professional.</h1>
        <p>A structured application flow. Verification before going live. Built for clinical workflows.</p>

        <div className="steps-nav">
          {['Personal', 'Credentials', 'Practice', 'Setup'].map((s, i) => (
            <span key={s} className={`step-tab${step === i + 1 ? ' active' : ''}`}>{s}</span>
          ))}
        </div>

        {step === 1 && (
          <section className="card">
            <p className="label">Step 1</p>
            <h2>Personal details</h2>
            <label>Role
              <div className="role-grid">
                {ROLES.map((r) => (
                  <button key={r.id} type="button" className={`chip${role === r.id ? ' active' : ''}`} onClick={() => setRole(r.id)}>{r.label}</button>
                ))}
              </div>
            </label>
            <label>Full name
              <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" autoComplete="name" />
            </label>
            <label>Phone (India)
              <div className="phone-row"><span className="phone-prefix">+91</span>
                <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit number" inputMode="numeric" autoComplete="tel" aria-invalid={phone.length > 0 && !isPhoneValid} />
              </div>
              {phone.length > 0 && !isPhoneValid && <p className="error">Enter a valid 10-digit number starting with 6-9.</p>}
            </label>
            <label>Email (optional)
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
            </label>
            <div className="btn-row">
              <Link to="/professionals" className="btn btn-ghost">Back</Link>
              <button className="btn" onClick={() => setStep(2)} disabled={!isStep1Valid}>Continue</button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="card">
            <p className="label">Step 2</p>
            <h2>Credentials</h2>
            <label>Registration / License number
              <input className="input" value={registration} onChange={(e) => setRegistration(e.target.value)} placeholder="MCI/SMC/RCI/etc." />
              {role === 'psychiatrist' && <p className="hint">Required for psychiatrists.</p>}
            </label>
            <label>Highest degree
              <input className="input" value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="MBBS, MD, M.Phil, PsyD..." />
            </label>
            <label>Year of passing
              <input className="input" value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g. 2018" inputMode="numeric" />
            </label>
            <label>Council / Authority
              <input className="input" value={council} onChange={(e) => setCouncil(e.target.value)} placeholder="State Medical Council / RCI / etc." />
            </label>
            <div className="btn-row">
              <button className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>
              <button className="btn" onClick={() => setStep(3)} disabled={!isStep2Valid}>Continue</button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="card">
            <p className="label">Step 3</p>
            <h2>Practice details</h2>
            <label>Clinic / organisation
              <input className="input" value={clinic} onChange={(e) => setClinic(e.target.value)} placeholder="Clinic / hospital / private practice" />
            </label>
            <label>City
              <input className="input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
            </label>
            <label>Languages
              <input className="input" value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="English, Hindi, Gujarati" />
            </label>
            <label>Specialities (optional)
              <input className="input" value={specialities} onChange={(e) => setSpecialities(e.target.value)} placeholder="Anxiety, CBT, de-addiction, etc." />
            </label>
            <div className="btn-row">
              <button className="btn btn-ghost" onClick={() => setStep(2)}>Back</button>
              <button className="btn" onClick={() => setStep(4)}>Continue</button>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="card">
            <p className="label">Step 4</p>
            <h2>Consultation setup</h2>
            <label>Fee (Rs.)
              <input className="input" value={fee} onChange={(e) => setFee(e.target.value)} placeholder="e.g. 799" inputMode="numeric" />
            </label>
            <label>Session duration
              <select className="input" value={duration} onChange={(e) => setDuration(e.target.value)}>
                {DURATIONS.map((d) => <option key={d} value={d}>{d} min</option>)}
              </select>
            </label>
            <label>Modes offered
              <input className="input" value={mode} onChange={(e) => setMode(e.target.value)} placeholder="Video / Audio / Chat" />
            </label>
            <label>Availability
              <input className="input" value={availability} onChange={(e) => setAvailability(e.target.value)} placeholder="Mon-Sat, 6pm-9pm" />
            </label>
            <label className="checkbox-row">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
              I confirm the information is accurate and I consent to verification checks.
            </label>
            {submitError && <p className="error">{submitError}</p>}
            <div className="btn-row">
              <button className="btn btn-ghost" onClick={() => setStep(3)}>Back</button>
              <button className="btn" onClick={handleSubmit} disabled={!isStep4Valid || submitting}>
                {submitting ? 'Submitting...' : 'Submit application'}
              </button>
            </div>
            {!isStep4Valid && <p className="hint">Please add a fee and confirm consent to submit.</p>}
          </section>
        )}
      </main>
    </div>
  );
}
