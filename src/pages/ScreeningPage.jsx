import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const LS_KEY = 'serenest_screening_responses_v1';

const REASONS = [
  { id: 'focus', label: 'Better focus & clarity' },
  { id: 'stress', label: 'Stress relief & calm' },
  { id: 'connection', label: 'Connection & relationships' },
  { id: 'exploring', label: 'Just exploring' },
];

const CONDITIONS = [
  { id: 'depression', label: 'Depression' },
  { id: 'anxiety', label: 'Anxiety disorders' },
  { id: 'stress', label: 'Stress & burnout' },
  { id: 'trauma', label: 'Trauma & PTSD' },
  { id: 'bipolar', label: 'Bipolar disorder' },
  { id: 'ocd', label: 'OCD' },
  { id: 'panic', label: 'Panic disorder' },
  { id: 'social-anxiety', label: 'Social anxiety' },
  { id: 'phobias', label: 'Phobias' },
  { id: 'adhd', label: 'ADHD' },
  { id: 'insomnia', label: 'Insomnia & sleep disorders' },
  { id: 'grief', label: 'Grief & loss' },
  { id: 'eating', label: 'Eating disorders' },
  { id: 'substance', label: 'Substance use (support)' },
  { id: 'other', label: 'Other / not listed' },
];

const ENGAGEMENT = [
  { id: 'self', label: 'Self-paced, on my own' },
  { id: 'guided', label: 'With a guide or facilitator' },
  { id: 'both', label: 'Both — mix of both' },
];

const FREQUENCY = [
  { id: 'daily', label: 'Daily' },
  { id: 'few', label: 'A few times a week' },
  { id: 'when-needed', label: 'When I need it' },
];

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function loadAll() {
  const data = safeJsonParse(localStorage.getItem(LS_KEY) ?? '[]', []);
  return Array.isArray(data) ? data : [];
}

function persist(record) {
  const existing = loadAll();
  localStorage.setItem(LS_KEY, JSON.stringify([record, ...existing]));
}

export default function ScreeningPage() {
  // Steps: 1 reason, 2 conditions, 3 engagement, 4 frequency, 5 result
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState(null);
  const [conditions, setConditions] = useState(() => new Set());
  const [engagement, setEngagement] = useState(null);
  const [frequency, setFrequency] = useState(null);

  const reasonLabel = useMemo(() => REASONS.find((r) => r.id === reason)?.label ?? null, [reason]);
  const selectedConditionLabels = useMemo(
    () => CONDITIONS.filter((c) => conditions.has(c.id)).map((c) => c.label),
    [conditions],
  );

  const canGoNext = useMemo(() => {
    if (step === 1) return Boolean(reason);
    if (step === 2) return conditions.size > 0;
    if (step === 3) return Boolean(engagement);
    if (step === 4) return Boolean(frequency);
    return false;
  }, [step, reason, conditions, engagement, frequency]);

  function toggleCondition(id) {
    setConditions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function onSubmit(e) {
    e.preventDefault();

    const record = {
      id: `${Date.now()}`,
      created_at: new Date().toISOString(),
      reason: reason ?? null,
      conditions: selectedConditionLabels,
      engagement: engagement ?? null,
      frequency: frequency ?? null,
      status: 'submitted',
    };

    persist(record);
    setStep(5);
  }

  const totalSteps = 5;

  return (
    <div className="page">
      <section className="section about-hero">
        <div className="container">
          <div className="section-head about-hero-head">
            <p className="kicker">Quick screening</p>
            <h1 className="page-title">Answer a few questions to get directed support.</h1>
            <p className="about-subtext">Takes about 2 minutes. Your answers will be saved on this device.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="booking-shell tile screening-shell">
            <div className="booking-top">
              <div className="booking-steps" aria-label="Screening steps">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className={`step-chip ${step === s ? 'is-active' : ''}`}>
                    <span className="step-dot" aria-hidden="true" />
                    Step {s}
                  </div>
                ))}
              </div>

              <div className="booking-summary" aria-label="Summary">
                <div className="summary-pill">{reasonLabel ?? 'Quick screening'}</div>
                <div className="summary-pill">{conditions.size ? `${conditions.size} selected` : 'Pick conditions'}</div>
              </div>
            </div>

            <div className="booking-body">
              {step !== 5 && (
                <form onSubmit={onSubmit}>
                  {step === 1 && (
                    <div className="screening-block">
                      <p className="section-label" style={{ marginBottom: 8 }}>
                        Step 1
                      </p>
                      <h2 style={{ marginBottom: 10 }}>What brings you here today?</h2>
                      <div className="choice-grid" role="group" aria-label="Reason">
                        {REASONS.map((r) => (
                          <button
                            key={r.id}
                            type="button"
                            className={`choice-card ${reason === r.id ? 'is-selected' : ''}`}
                            aria-pressed={reason === r.id}
                            onClick={() => setReason(r.id)}
                          >
                            {r.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="screening-block">
                      <p className="section-label" style={{ marginBottom: 8 }}>
                        Step 2
                      </p>
                      <h2 style={{ marginBottom: 10 }}>Which conditions or areas are relevant to you?</h2>
                      <p className="muted" style={{ margin: 0, fontWeight: 700, marginBottom: 10 }}>
                        Select all that apply.
                      </p>
                      <div className="screening-options" role="group" aria-label="Conditions">
                        {CONDITIONS.map((c) => {
                          const selected = conditions.has(c.id);
                          return (
                            <button
                              key={c.id}
                              type="button"
                              className={`choice-card ${selected ? 'is-selected' : ''}`}
                              aria-pressed={selected}
                              onClick={() => toggleCondition(c.id)}
                            >
                              {c.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="screening-block">
                      <p className="section-label" style={{ marginBottom: 8 }}>
                        Step 3
                      </p>
                      <h2 style={{ marginBottom: 10 }}>How would you like to engage?</h2>
                      <div className="choice-grid" role="group" aria-label="Engagement">
                        {ENGAGEMENT.map((x) => (
                          <button
                            key={x.id}
                            type="button"
                            className={`choice-card ${engagement === x.id ? 'is-selected' : ''}`}
                            aria-pressed={engagement === x.id}
                            onClick={() => setEngagement(x.id)}
                          >
                            {x.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="screening-block">
                      <p className="section-label" style={{ marginBottom: 8 }}>
                        Step 4
                      </p>
                      <h2 style={{ marginBottom: 10 }}>How often do you want to practice?</h2>
                      <div className="choice-grid" role="group" aria-label="Frequency">
                        {FREQUENCY.map((x) => (
                          <button
                            key={x.id}
                            type="button"
                            className={`choice-card ${frequency === x.id ? 'is-selected' : ''}`}
                            aria-pressed={frequency === x.id}
                            onClick={() => setFrequency(x.id)}
                          >
                            {x.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="booking-actions">
                    {step > 1 ? (
                      <button className="btn btn-ghost" type="button" onClick={() => setStep((s) => Math.max(1, s - 1))}>
                        ← Back
                      </button>
                    ) : (
                      <span />
                    )}

                    {step < totalSteps - 1 ? (
                      <button className="btn btn-primary" type="button" disabled={!canGoNext} onClick={() => setStep((s) => s + 1)}>
                        Continue →
                      </button>
                    ) : (
                      <button className="btn btn-primary" type="submit" disabled={!canGoNext}>
                        Submit screening →
                      </button>
                    )}
                  </div>
                </form>
              )}

              {step === 5 && (
                <div className="screening-result">
                  <p className="section-label" style={{ marginBottom: 8 }}>
                    Result
                  </p>
                  <h2 style={{ marginBottom: 10 }}>Thank you</h2>
                  <p className="muted" style={{ marginBottom: 14, fontWeight: 700 }}>
                    We noted your answers. When we launch real screening matching, we’ll tailor suggestions to what you shared.
                  </p>

                  <div className="screening-summary">
                    <div className="muted" style={{ fontWeight: 900, marginBottom: 6 }}>Summary</div>
                    <div className="screening-summary-line">
                      <span className="muted" style={{ fontWeight: 800 }}>Reason:</span> {reasonLabel ?? '—'}
                    </div>
                    <div className="screening-summary-line">
                      <span className="muted" style={{ fontWeight: 800 }}>Conditions:</span>{' '}
                      {selectedConditionLabels.length ? selectedConditionLabels.join(', ') : '—'}
                    </div>
                    <div className="screening-summary-line">
                      <span className="muted" style={{ fontWeight: 800 }}>Engagement:</span>{' '}
                      {ENGAGEMENT.find((x) => x.id === engagement)?.label ?? '—'}
                    </div>
                    <div className="screening-summary-line">
                      <span className="muted" style={{ fontWeight: 800 }}>Frequency:</span>{' '}
                      {FREQUENCY.find((x) => x.id === frequency)?.label ?? '—'}
                    </div>
                  </div>

                  <div className="booking-actions" style={{ marginTop: 16 }}>
                    <Link className="btn btn-ghost" to="/services">
                      ← Back to services
                    </Link>
                    <Link className="btn btn-primary" to="/book">
                      Book a consultation →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

