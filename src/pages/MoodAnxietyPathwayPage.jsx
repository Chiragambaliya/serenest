import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { getTool, scoreTool } from '../lib/screeningTools';
import { saveSnapshotDimension, CRISIS_RESOURCES } from '../lib/mentalHealthCenter';
import { assistant } from '../lib/api';
import { buildBookPath, suggestRoleFromScreening } from '../lib/bookingHandoff';
import { careWaHref } from '../lib/patientReach';
import CrisisSafetyPanel from '../components/screening/CrisisSafetyPanel';
import ScreeningResultPanel from '../components/screening/ScreeningResultPanel';
import DpdpConsentNotice from '../components/DpdpConsentNotice';
import '../styles/screening.css';

/**
 * Guided mood + anxiety pathway — human language, shared tool definitions (no duplicate banks).
 */
export default function MoodAnxietyPathwayPage() {
  useSEO({ path: '/screening/pathway/mood-anxiety', ...ROUTE_SEO['/screening/pathway/mood-anxiety'] });

  const phq = getTool('phq9');
  const gad = getTool('gad7');

  // 0 intro, 1 phq, 2 gad, 3 results + AI combined lead capture
  const [step, setStep] = useState(0);
  const [phqAnswers, setPhqAnswers] = useState(() => Array(phq.questions.length).fill(undefined));
  const [gadAnswers, setGadAnswers] = useState(() => Array(gad.questions.length).fill(undefined));
  const [crisisAck, setCrisisAck] = useState(false);
  const [liveCrisis, setLiveCrisis] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [savedBooking, setSavedBooking] = useState(null);

  const phqResult = useMemo(() => scoreTool(phq, phqAnswers), [phq, phqAnswers]);
  const gadResult = useMemo(() => scoreTool(gad, gadAnswers), [gad, gadAnswers]);
  const crisisFlag = (phqAnswers[phq.crisisItem] ?? 0) >= 1;

  const phoneClean = phone.replace(/[^\d]/g, '').slice(0, 10);
  const phoneOk = phoneClean.length === 10 && /^[6-9]/.test(phoneClean);
  const matchedRole = suggestRoleFromScreening(phqResult.score, gadResult.score);

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

  async function handleSavePathwayLead(e) {
    e.preventDefault();
    if (!name.trim() || !phoneOk) {
      setSubmitError('Please enter your name and a valid 10-digit Indian mobile number.');
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await assistant.acquire({
        patient_name: name.trim(),
        patient_phone: phoneClean,
        patient_email: email.trim() || undefined,
        concern: `Combined PHQ-9 (${phqResult.score}/27 · ${phqResult.band.label}) and GAD-7 (${gadResult.score}/21 · ${gadResult.band.label}) pathway.`,
        practitioner_type: matchedRole,
        mode: 'video',
        notes: `[AI Mood & Anxiety Pathway]\nPHQ-9: ${phqResult.score}/27 (${phqResult.band.label})\nGAD-7: ${gadResult.score}/21 (${gadResult.band.label})`,
        screening_meta: {
          reason: 'mood-anxiety-pathway',
          phq9_answers: phqAnswers,
          phq9_score: phqResult.score,
          phq9_severity: phqResult.band.label,
          gad7_answers: gadAnswers,
          gad7_score: gadResult.score,
          gad7_severity: gadResult.band.label,
          conditions: ['PHQ-9', 'GAD-7'],
        },
      });
      setSavedBooking(res?.booking || { id: 'SAVED', patient_name: name.trim(), patient_phone: phoneClean });
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

  const deepBookHref = buildBookPath({
    phq: phqResult.score,
    phqsev: phqResult.band.label,
    gad: gadResult.score,
    gadsev: gadResult.band.label,
    prole: matchedRole,
  });

  return (
    <div className="mhc">
      <div className="mhc-wrap">
        <Link to="/screening" className="mhc-back">
          ← Mental Health Center
        </Link>
        <p className="mhc-eyebrow">Guided check · PHQ-9 + GAD-7</p>
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 1.9rem)', margin: '0 0 0.5rem' }}>Check mood &amp; anxiety</h1>
        <p className="mhc-hero-lead">
          Two short validated checks with AI pattern analysis and optional clinician callback. Not a diagnosis.
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
              <li>Personalized AI pattern analysis for both — then optional clinician callback</li>
            </ul>
            <p className="mhc-disclaimer" style={{ marginTop: '1rem' }}>
              In a crisis, call <a href={CRISIS_RESOURCES.emergency.href}>{CRISIS_RESOURCES.emergency.number}</a> or{' '}
              <a href={CRISIS_RESOURCES.icall.href}>{CRISIS_RESOURCES.icall.label}</a>.
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
                See AI analysis &amp; guidance →
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
                <section className="ai-triage-card" style={{ marginBottom: '1.5rem' }} aria-labelledby="pathway-ai-lead-title">
                  <div className="ai-triage-head">
                    <div className="ai-triage-head__copy">
                      <span className="ai-triage-eyebrow">
                        <span className="ai-triage-spark" aria-hidden="true">✦</span>
                        Serenest Care AI · Combined Mood &amp; Anxiety Brief
                      </span>
                      <h2 id="pathway-ai-lead-title" className="ai-triage-title">
                        PHQ-9 ({phqResult.score}/27 · {phqResult.band.label}) + GAD-7 ({gadResult.score}/21 · {gadResult.band.label})
                      </h2>
                      <p className="ai-triage-sub">
                        Based on your combined mood and anxiety scores, our AI recommends starting with a <strong>{matchedRole.charAt(0).toUpperCase() + matchedRole.slice(1)}</strong>. Save your combined analysis below to have our care team arrange a callback.
                      </p>
                    </div>
                  </div>

                  <div className="ai-triage-body">
                    {savedBooking ? (
                      <div className="srn-ai-capture srn-ai-capture--done" role="status">
                        <div className="srn-ai-capture__badge">
                          ✓ Combined Analysis Saved &amp; Callback Registered · Ref {String(savedBooking.id || '').slice(0, 8).toUpperCase()}
                        </div>
                        <p className="srn-ai-capture__copy">
                          Thank you, <strong>{savedBooking.patient_name}</strong>. Our care team will reach out on <strong>+91 {savedBooking.patient_phone}</strong> to confirm your session. You do not pay until your slot is locked.
                        </p>
                        <a
                          className="btn btn-primary"
                          href={careWaHref(`Hi, I completed the PHQ-9 + GAD-7 pathway on Serenest (Ref: ${String(savedBooking.id || '').slice(0, 8).toUpperCase()})`)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Confirm on WhatsApp →
                        </a>
                      </div>
                    ) : (
                      <form className="ai-fast-acquire" onSubmit={handleSavePathwayLead}>
                        <div className="ai-fast-acquire__head">
                          <strong>✦ Save combined PHQ-9 + GAD-7 analysis &amp; request callback</strong>
                          <span>Pay ₹499 only after our care team confirms your slot</span>
                        </div>
                        <div className="ai-fast-acquire__row">
                          <input
                            type="text"
                            className="input"
                            placeholder="Your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="name"
                          />
                          <input
                            type="tel"
                            className="input"
                            placeholder="10-digit mobile (+91)"
                            inputMode="numeric"
                            maxLength={10}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            autoComplete="tel-national"
                          />
                          <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Saving…' : 'Save analysis & request callback →'}
                          </button>
                        </div>
                        <DpdpConsentNotice compact />
                        {submitError ? <p className="ai-triage-error" role="alert">{submitError}</p> : null}
                      </form>
                    )}
                  </div>
                </section>

                <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Mood (PHQ-9)</h2>
                <ScreeningResultPanel
                  tool={phq}
                  result={phqResult}
                  answers={phqAnswers}
                  crisisFlag={crisisFlag}
                  crisisAcknowledged={crisisAck}
                  hideCareUntilReady={false}
                  includeCareOptions={false}
                  onRetake={() => {
                    setStep(0);
                    setPhqAnswers(Array(phq.questions.length).fill(undefined));
                    setGadAnswers(Array(gad.questions.length).fill(undefined));
                    setCrisisAck(false);
                    setSavedBooking(null);
                  }}
                />
                <h2 style={{ fontSize: '1.2rem', margin: '2rem 0 1rem' }}>Anxiety (GAD-7)</h2>
                <ScreeningResultPanel
                  tool={gad}
                  result={gadResult}
                  answers={gadAnswers}
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
                    <Link className="btn btn-primary" to={deepBookHref}>
                      Book with combined AI analysis →
                    </Link>
                    <Link className="btn btn-ghost" to="/patient/find-professional">
                      Find a professional
                    </Link>
                  </div>
                </section>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
