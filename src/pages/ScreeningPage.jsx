import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

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
  { id: 'both', label: 'Both - mix of both' },
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

async function persistScreening(record) {
  if (supabase) {
    const payload = {
      reason: record.reason ?? null,
      conditions: record.conditions ?? [],
      format: record.engagement ?? null,
      frequency: record.frequency ?? null,
    };
    const { error } = await supabase.from('screening_responses').insert([payload]);
    if (error) throw error;
  } else {
    const existing = safeJsonParse(localStorage.getItem(LS_KEY) ?? '[]', []);
    localStorage.setItem(LS_KEY, JSON.stringify([record, ...(Array.isArray(existing) ? existing : [])]));
  }
}

export default function ScreeningPage() {
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState(null);
  const [conditions, setConditions] = useState(() => new Set());
  const [engagement, setEngagement] = useState(null);
  const [frequency, setFrequency] = useState(null);
  const [submitError, setSubmitError] = useState(null);

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

  async function onSubmit(e) {
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
    try {
      await persistScreening(record);
      setSubmitError(null);
    } catch (err) {
      setSubmitError(err.message ?? 'Could not save response.');
    }
    setStep(5);
  }

  const totalSteps = 5;

  return (
    <div className="page">
      <main className="container" style={{ maxWidth: 560, paddingBlock: '3rem' }}>
        <p className="label">Quick screening</p>
        <h1>Answer a few questions to get directed support.</h1>
        <p>Takes about 2 minutes. Your answers are saved securely.</p>

        <div className="steps-nav">
          {[1, 2, 3, 4].map((s) => (
            <span key={s} className={`step-tab${step === s ? ' active' : ''}`}>
              Step {s}
            </span>
          ))}
        </div>

        {step !== 5 && (
          <form onSubmit={onSubmit}>
            {step === 1 && (
              <section className="card">
                <p className="label">Step 1</p>
                <h2>What brings you here today?</h2>
                <div className="chip-grid">
                  {REASONS.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      className={`chip${reason === r.id ? ' active' : ''}`}
                      onClick={() => setReason(r.id)}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </section>
            )}
            {step === 2 && (
              <section className="card">
                <p className="label">Step 2</p>
                <h2>Which conditions or areas are relevant to you?</h2>
                <p>Select all that apply.</p>
                <div className="chip-grid">
                  {CONDITIONS.map((c) => {
                    const selected = conditions.has(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        className={`chip${selected ? ' active' : ''}`}
                        onClick={() => toggleCondition(c.id)}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </section>
            )}
            {step === 3 && (
              <section className="card">
                <p className="label">Step 3</p>
                <h2>How would you like to engage?</h2>
                <div className="chip-grid">
                  {ENGAGEMENT.map((x) => (
                    <button
                      key={x.id}
                      type="button"
                      className={`chip${engagement === x.id ? ' active' : ''}`}
                      onClick={() => setEngagement(x.id)}
                    >
                      {x.label}
                    </button>
                  ))}
                </div>
              </section>
            )}
            {step === 4 && (
              <section className="card">
                <p className="label">Step 4</p>
                <h2>How often do you want to practice?</h2>
                <div className="chip-grid">
                  {FREQUENCY.map((x) => (
                    <button
                      key={x.id}
                      type="button"
                      className={`chip${frequency === x.id ? ' active' : ''}`}
                      onClick={() => setFrequency(x.id)}
                    >
                      {x.label}
                    </button>
                  ))}
                </div>
              </section>
            )}
            <div className="btn-row">
              {step > 1 ? (
                <button type="button" className="btn btn-ghost" onClick={() => setStep((s) => Math.max(1, s - 1))}>
                  Back
                </button>
              ) : (
                <span />
              )}
              {step < totalSteps - 1 ? (
                <button type="button" className="btn" onClick={() => setStep((s) => s + 1)} disabled={!canGoNext}>
                  Continue
                </button>
              ) : (
                <button type="submit" className="btn" disabled={!canGoNext}>
                  Submit screening
                </button>
              )}
            </div>
          </form>
        )}

        {step === 5 && (
          <section className="card">
            <p className="label">Result</p>
            <h2>Thank you</h2>
            {submitError ? (
              <p className="error">Your answers could not be saved: {submitError}</p>
            ) : (
              <p>
                We noted your answers. When we launch real screening matching, we'll tailor suggestions to what you
                shared.
              </p>
            )}
            <div className="summary">
              <p>
                <strong>Reason:</strong> {reasonLabel ?? '-'}
              </p>
              <p>
                <strong>Conditions:</strong> {selectedConditionLabels.length ? selectedConditionLabels.join(', ') : '-'}
              </p>
              <p>
                <strong>Engagement:</strong> {ENGAGEMENT.find((x) => x.id === engagement)?.label ?? '-'}
              </p>
              <p>
                <strong>Frequency:</strong> {FREQUENCY.find((x) => x.id === frequency)?.label ?? '-'}
              </p>
            </div>
            <div className="btn-row">
              <Link to="/services" className="btn btn-ghost">
                Back to services
              </Link>
              <Link to="/book" className="btn">
                Book a consultation
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
