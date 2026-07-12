import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { getTool, scoreTool } from '../lib/screeningTools';
import { saveSnapshotDimension, CRISIS_RESOURCES } from '../lib/mentalHealthCenter';
import { screening } from '../lib/api';
import CrisisSafetyPanel from '../components/screening/CrisisSafetyPanel';
import ScreeningResultPanel from '../components/screening/ScreeningResultPanel';
import '../styles/screening.css';

/**
 * Guided mood + anxiety pathway — human language, shared tool definitions (no duplicate banks).
 */
export default function MoodAnxietyPathwayPage() {
  useSEO({
    path: '/screening/pathway/mood-anxiety',
    title: 'Check Mood & Anxiety (PHQ-9 + GAD-7) | Serenest',
    description:
      'A guided mental health check for mood and anxiety using PHQ-9 and GAD-7. Educational results — not a diagnosis.',
  });

  const phq = getTool('phq9');
  const gad = getTool('gad7');

  // 0 intro, 1 phq, 2 gad, 3 results, optional contact after
  const [step, setStep] = useState(0);
  const [phqAnswers, setPhqAnswers] = useState(() => Array(phq.questions.length).fill(undefined));
  const [gadAnswers, setGadAnswers] = useState(() => Array(gad.questions.length).fill(undefined));
  const [crisisAck, setCrisisAck] = useState(false);
  const [liveCrisis, setLiveCrisis] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [callback, setCallback] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [saved, setSaved] = useState(false);

  const phqResult = useMemo(() => scoreTool(phq, phqAnswers), [phq, phqAnswers]);
  const gadResult = useMemo(() => scoreTool(gad, gadAnswers), [gad, gadAnswers]);
  const crisisFlag = (phqAnswers[phq.crisisItem] ?? 0) >= 1;

  // Safety interruption must be seen, not just rendered off-screen.
  useEffect(() => {
    if (!liveCrisis) return;
    requestAnimationFrame(() => {
      document.querySelector('.mhc-crisis')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }, [liveCrisis]);

  const phoneClean = phone.replace(/[^\d]/g, '');
  const phoneOk = phoneClean.length === 10 && /^[6-9]/.test(phoneClean);

  function pick(toolKey, qi, value) {
    const setter = toolKey === 'phq' ? setPhqAnswers : setGadAnswers;
    const tool = toolKey === 'phq' ? phq : gad;
    setter((prev) => {
      const next = [...prev];
      next[qi] = value;
      return next;
    });
    if (tool.crisisItem === qi && value >= 1) setLiveCrisis(true);
  }

  function renderQuestions(tool, answers, toolKey) {
    return tool.questions.map((q, i) => {
      const opts = q.options || tool.options;
      const done = answers[i] !== undefined && answers[i] !== null;
      return (
        <div key={i} className={`mhc-q${done ? ' is-done' : ''}`}>
          <div className="mhc-q-text">
            <span className="mhc-q-num" aria-hidden>
              {i + 1}
            </span>
            <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.5, fontWeight: 500 }}>{q.text}</p>
          </div>
          <div className="mhc-opts" role="group" aria-label={`${tool.name} question ${i + 1}`}>
            {opts.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className="mhc-opt"
                aria-pressed={answers[i] === opt.value}
                onClick={() => pick(toolKey, i, opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      );
    });
  }

  async function saveOptional() {
    if (!name.trim() || !phoneOk) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      // Privacy-first: only opt-in summary scores/severity leave the browser —
      // never the item-level questionnaire answers.
      await screening.submit({
        name: name.trim(),
        phone: phoneClean,
        email: email.trim() || null,
        phq9_score: phqResult.score,
        phq9_severity: phqResult.band.label,
        gad7_score: gadResult.score,
        gad7_severity: gadResult.band.label,
        wants_callback: callback,
        reason: 'mood-anxiety-pathway',
      });
      setSaved(true);
    } catch (err) {
      setSubmitError(err.message ?? 'Could not save. You can still use your results above.');
    } finally {
      setSubmitting(false);
    }
  }

  function goToResults() {
    saveSnapshotDimension('mood', { toolId: 'phq9', bandLabel: phqResult.band.label, score: phqResult.score });
    saveSnapshotDimension('anxiety', { toolId: 'gad7', bandLabel: gadResult.band.label, score: gadResult.score });
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="mhc">
      <div className="mhc-wrap">
        <Link to="/screening" className="mhc-back">
          ← Mental Health Center
        </Link>
        <p className="mhc-eyebrow">Guided check · PHQ-9 + GAD-7</p>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 1.9rem)', margin: '0 0 0.5rem' }}>Check mood &amp; anxiety</h1>
        <p className="mhc-hero-lead">
          Two short validated checks. You’ll understand each result before any care options. Not a diagnosis.
        </p>

        {liveCrisis && step < 3 ? (
          <CrisisSafetyPanel
            onAcknowledge={() => setLiveCrisis(false)}
            acknowledgeLabel="I understand — continue"
          />
        ) : null}

        {step === 0 && (
          <div className="mhc-edu">
            <h2>What you’ll do</h2>
            <ul>
              <li>Mood check (PHQ-9) — about 2–3 minutes</li>
              <li>Anxiety check (GAD-7) — about 2 minutes</li>
              <li>Educational results for both — then optional follow-up</li>
            </ul>
            <p className="mhc-disclaimer" style={{ marginTop: '1rem' }}>
              In a crisis, call <a href={CRISIS_RESOURCES.emergency.href}>{CRISIS_RESOURCES.emergency.number}</a>. For
              free mental-health support in India, call Tele-MANAS at{' '}
              <a href={CRISIS_RESOURCES.telemanas.href}>{CRISIS_RESOURCES.telemanas.number}</a> or{' '}
              <a href={CRISIS_RESOURCES.telemanasAlt.href}>{CRISIS_RESOURCES.telemanasAlt.number}</a>.
            </p>
            <button type="button" className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setStep(1)}>
              Start with mood →
            </button>
          </div>
        )}

        {step === 1 && (
          <>
            <h2 style={{ fontSize: '1.15rem' }}>{phq.humanTitle}</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{phq.timeframe}</p>
            {renderQuestions(phq, phqAnswers, 'phq')}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: '1rem' }}>
              <button type="button" className="btn btn-ghost" onClick={() => setStep(0)}>
                ← Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={!phqResult.complete}
                onClick={() => setStep(2)}
              >
                Continue to anxiety →
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 style={{ fontSize: '1.15rem' }}>{gad.humanTitle}</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{gad.timeframe}</p>
            {renderQuestions(gad, gadAnswers, 'gad')}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: '1rem' }}>
              <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={!gadResult.complete}
                onClick={goToResults}
              >
                See guidance →
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            {crisisFlag && !crisisAck ? (
              <CrisisSafetyPanel onAcknowledge={() => setCrisisAck(true)} />
            ) : (
              <>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Mood</h2>
                <ScreeningResultPanel
                  tool={phq}
                  result={phqResult}
                  crisisFlag={crisisFlag}
                  crisisAcknowledged={crisisAck}
                  hideCareUntilReady={false}
                  includeCareOptions={false}
                  onRetake={() => {
                    setStep(0);
                    setPhqAnswers(Array(phq.questions.length).fill(undefined));
                    setGadAnswers(Array(gad.questions.length).fill(undefined));
                    setCrisisAck(false);
                    setSaved(false);
                    setShowContact(false);
                  }}
                />
                <h2 style={{ fontSize: '1.2rem', margin: '2rem 0 1rem' }}>Anxiety</h2>
                <ScreeningResultPanel
                  tool={gad}
                  result={gadResult}
                  crisisFlag={false}
                  crisisAcknowledged
                  hideCareUntilReady={false}
                  includeCareOptions={false}
                  onRetake={() => setStep(2)}
                />

                <section className="mhc-care" aria-labelledby="pathway-care">
                  <h2 id="pathway-care">If you want guided help</h2>
                  <p>
                    After reading both results, you can talk with a verified clinician — when you are ready.
                  </p>
                  <div className="mhc-care-actions">
                    <Link className="btn btn-primary" to="/book">
                      Talk to a clinician
                    </Link>
                    <Link className="btn btn-ghost" to="/patient/find-professional">
                      Find a professional
                    </Link>
                  </div>
                </section>

                {!saved ? (
                  <div className="mhc-edu" style={{ marginTop: '1.5rem' }}>
                    <h2>Optional: save a summary for follow-up</h2>
                    <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                      Only if you want Serenest to reach you. Scores and severity labels may be stored — not required
                      to use your results above. Callback is opt-in.
                    </p>
                    {!showContact ? (
                      <button type="button" className="btn btn-ghost" onClick={() => setShowContact(true)}>
                        Share contact for follow-up
                      </button>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                        <label>
                          Name *
                          <input value={name} onChange={(e) => setName(e.target.value)} style={{ display: 'block', width: '100%', marginTop: 4, padding: 8 }} />
                        </label>
                        <label>
                          Phone *
                          <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="numeric" style={{ display: 'block', width: '100%', marginTop: 4, padding: 8 }} />
                        </label>
                        <label>
                          Email (optional)
                          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" style={{ display: 'block', width: '100%', marginTop: 4, padding: 8 }} />
                        </label>
                        <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                          <input type="checkbox" checked={callback} onChange={(e) => setCallback(e.target.checked)} />
                          <span style={{ fontSize: '0.88rem' }}>Please have someone from Serenest reach out about my results</span>
                        </label>
                        {submitError ? <p style={{ color: '#a02622', fontSize: '0.88rem' }}>{submitError}</p> : null}
                        <button
                          type="button"
                          className="btn btn-primary"
                          disabled={!name.trim() || !phoneOk || submitting}
                          onClick={saveOptional}
                        >
                          {submitting ? 'Saving…' : 'Save summary'}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="mhc-disclaimer">Summary saved. Thank you — you can still book or browse when ready.</p>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
