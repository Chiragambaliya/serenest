import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const PRACTITIONER_TYPES = [
  { id: 'psychiatrist', label: 'Psychiatrist' },
  { id: 'psychologist', label: 'Psychologist' },
  { id: 'therapist', label: 'Therapist' },
  { id: 'counsellor', label: 'Counsellor' },
];

const MODES = [
  { id: 'video', label: 'Video' },
  { id: 'audio', label: 'Audio' },
  { id: 'chat', label: 'Chat' },
];

function pad2(n) {
  return String(n).padStart(2, '0');
}

function makeSlots() {
  const now = new Date();
  const day0 = new Date(now);
  day0.setHours(0, 0, 0, 0);

  const days = [];
  for (let d = 0; d < 7; d += 1) {
    const dt = new Date(day0);
    dt.setDate(day0.getDate() + d);
    const label = dt.toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short' });
    days.push({ key: dt.toISOString().slice(0, 10), label, date: dt });
  }

  const times = ['10:00', '11:30', '13:00', '15:30', '17:00', '19:00'];
  return { days, times };
}

export default function BookingPage() {
  const { days, times } = useMemo(() => makeSlots(), []);
  const [step, setStep] = useState(1);

  const [practitionerType, setPractitionerType] = useState('psychiatrist');
  const [mode, setMode] = useState('video');
  const [dayKey, setDayKey] = useState(days[0]?.key ?? '');
  const [time, setTime] = useState(times[0] ?? '');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState('English');
  const [note, setNote] = useState('');
  const [consent, setConsent] = useState(false);

  const dayLabel = useMemo(() => days.find((d) => d.key === dayKey)?.label ?? '', [days, dayKey]);
  const selectedTypeLabel = useMemo(
    () => PRACTITIONER_TYPES.find((t) => t.id === practitionerType)?.label ?? 'Practitioner',
    [practitionerType],
  );
  const selectedModeLabel = useMemo(() => MODES.find((m) => m.id === mode)?.label ?? 'Video', [mode]);

  const phoneClean = phone.replace(/[^\d]/g, '');
  const isPhoneValid = phoneClean.length === 10 && /^[6-9]/.test(phoneClean);
  const isNameValid = name.trim().length >= 2;
  const canContinueStep3 = isNameValid && isPhoneValid && consent;

  const subject = encodeURIComponent('Appointment Request');
  const body = encodeURIComponent(
    [
      `Name: ${name || '-'}`,
      `Phone: +91 ${phoneClean || '-'}`,
      `Email: ${email || '-'}`,
      `Language: ${language || '-'}`,
      `Practitioner type: ${selectedTypeLabel}`,
      `Mode: ${selectedModeLabel}`,
      `Preferred slot: ${dayLabel} ${time || '-'}`,
      '',
      `Notes:`,
      note || '-',
    ].join('\n'),
  );

  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">Booking</p>
            <h1 className="page-title">Book an appointment in minutes.</h1>
            <p className="about-subtext">
              Choose your practitioner type and consultation mode, pick a slot, and share your details.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="booking-shell tile">
            <div className="booking-top">
              <div className="booking-steps" aria-label="Booking steps">
                <div className={`step-chip ${step === 1 ? 'is-active' : ''}`}>
                  <span className="step-dot" aria-hidden="true" />
                  Choose
                </div>
                <div className={`step-chip ${step === 2 ? 'is-active' : ''}`}>
                  <span className="step-dot" aria-hidden="true" />
                  Slot
                </div>
                <div className={`step-chip ${step === 3 ? 'is-active' : ''}`}>
                  <span className="step-dot" aria-hidden="true" />
                  Details
                </div>
                <div className={`step-chip ${step === 4 ? 'is-active' : ''}`}>
                  <span className="step-dot" aria-hidden="true" />
                  Confirm
                </div>
              </div>

              <div className="booking-summary" aria-label="Selection summary">
                <div className="summary-pill">{selectedTypeLabel}</div>
                <div className="summary-pill">{selectedModeLabel}</div>
                <div className="summary-pill">
                  {dayLabel} · {time}
                </div>
              </div>
            </div>

            {step === 1 && (
              <div className="booking-body">
                <div className="section-head" style={{ marginBottom: 10 }}>
                  <p className="section-label">Step 1</p>
                  <h2>Choose your care type.</h2>
                </div>

                <div className="form-grid">
                  <div>
                    <div className="field-label">Practitioner</div>
                    <div className="choice-grid">
                      {PRACTITIONER_TYPES.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          className={`choice-card ${practitionerType === t.id ? 'is-selected' : ''}`}
                          onClick={() => setPractitionerType(t.id)}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="field-label">Consultation mode</div>
                    <div className="choice-grid">
                      {MODES.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          className={`choice-card ${mode === m.id ? 'is-selected' : ''}`}
                          onClick={() => setMode(m.id)}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="booking-actions">
                  <Link className="btn btn-ghost" to="/services">
                    View services
                  </Link>
                  <button className="btn btn-primary" type="button" onClick={() => setStep(2)}>
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="booking-body">
                <div className="section-head" style={{ marginBottom: 10 }}>
                  <p className="section-label">Step 2</p>
                  <h2>Pick a preferred slot.</h2>
                  <p>These are sample slots for now (we’ll connect real availability next).</p>
                </div>

                <div className="slot-grid">
                  <div className="slot-days">
                    {days.map((d) => (
                      <button
                        key={d.key}
                        type="button"
                        className={`slot-chip ${dayKey === d.key ? 'is-selected' : ''}`}
                        onClick={() => setDayKey(d.key)}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>

                  <div className="slot-times">
                    {times.map((t) => (
                      <button
                        key={t}
                        type="button"
                        className={`slot-chip ${time === t ? 'is-selected' : ''}`}
                        onClick={() => setTime(t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="booking-actions">
                  <button className="btn btn-ghost" type="button" onClick={() => setStep(1)}>
                    ← Back
                  </button>
                  <button className="btn btn-primary" type="button" onClick={() => setStep(3)}>
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="booking-body">
                <div className="section-head" style={{ marginBottom: 10 }}>
                  <p className="section-label">Step 3</p>
                  <h2>Your details.</h2>
                </div>

                <div className="form-grid">
                  <label className="field">
                    <span className="field-label">Full name</span>
                    <input
                      className="input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
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
                    <span className="field-label">Preferred language</span>
                    <select className="input" value={language} onChange={(e) => setLanguage(e.target.value)}>
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Gujarati</option>
                    </select>
                  </label>

                  <label className="field field-wide">
                    <span className="field-label">Brief reason / notes (optional)</span>
                    <textarea
                      className="input textarea"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="What would you like help with?"
                      rows={4}
                    />
                  </label>

                  <label className="consent">
                    <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                    <span>
                      I consent to being contacted about this appointment and acknowledge this is not for emergencies.
                    </span>
                  </label>
                </div>

                <div className="booking-actions">
                  <button className="btn btn-ghost" type="button" onClick={() => setStep(2)}>
                    ← Back
                  </button>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => setStep(4)}
                    disabled={!canContinueStep3}
                  >
                    Review →
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="booking-body">
                <div className="section-head" style={{ marginBottom: 10 }}>
                  <p className="section-label">Step 4</p>
                  <h2>Confirm your request.</h2>
                </div>

                <div className="confirm-grid">
                  <div className="confirm-card">
                    <div className="confirm-row">
                      <span className="confirm-k">Practitioner</span>
                      <span className="confirm-v">{selectedTypeLabel}</span>
                    </div>
                    <div className="confirm-row">
                      <span className="confirm-k">Mode</span>
                      <span className="confirm-v">{selectedModeLabel}</span>
                    </div>
                    <div className="confirm-row">
                      <span className="confirm-k">Slot</span>
                      <span className="confirm-v">
                        {dayLabel} {time}
                      </span>
                    </div>
                  </div>

                  <div className="confirm-card">
                    <div className="confirm-row">
                      <span className="confirm-k">Name</span>
                      <span className="confirm-v">{name}</span>
                    </div>
                    <div className="confirm-row">
                      <span className="confirm-k">Phone</span>
                      <span className="confirm-v">+91 {phoneClean}</span>
                    </div>
                    <div className="confirm-row">
                      <span className="confirm-k">Email</span>
                      <span className="confirm-v">{email || '—'}</span>
                    </div>
                    <div className="confirm-row">
                      <span className="confirm-k">Language</span>
                      <span className="confirm-v">{language}</span>
                    </div>
                  </div>
                </div>

                {note && (
                  <div className="callout">
                    <div className="callout-title">Your note</div>
                    <p className="muted" style={{ margin: 0 }}>
                      {note}
                    </p>
                  </div>
                )}

                <div className="booking-actions">
                  <button className="btn btn-ghost" type="button" onClick={() => setStep(3)}>
                    ← Back
                  </button>
                  <a className="btn btn-primary" href={`mailto:support@serenest.fit?subject=${subject}&body=${body}`}>
                    Submit request →
                  </a>
                </div>

                <p className="fineprint" style={{ marginTop: 12 }}>
                  We’ll reply with the next available verified practitioner and payment steps.
                  {' '}
                  If urgent or in danger, contact emergency services.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

