import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { screening } from '../lib/api';
import {
  PHQ9_QUESTIONS,
  GAD7_QUESTIONS,
  ISI_QUESTIONS,
  ISI_OPTIONS,
  AUDIT_QUESTIONS,
  SCOFF_QUESTIONS,
  PTSD_EVENT_QUESTION,
  PTSD_SYMPTOM_QUESTIONS,
  FREQ_OPTIONS,
  buildFlow,
  phq9Severity,
  gad7Severity,
  isiSeverity,
  auditCSeverity,
  scoffResult,
  ptsdScreenResult,
  flowStepLabel,
} from '../lib/screeningTools';

export default function ScreeningPage() {
  const [modules, setModules] = useState({
  sleep: false,
  alcohol: false,
  eating: false,
  trauma: false,
  });

  const [flow, setFlow] = useState(() => buildFlow({ sleep: false, alcohol: false, eating: false, trauma: false }));
  const [flowIndex, setFlowIndex] = useState(0);

  const [phq, setPhq] = useState(Array(9).fill(null));
  const [gad, setGad] = useState(Array(7).fill(null));
  const [isi, setIsi] = useState(Array(7).fill(null));
  const [audit, setAudit] = useState(Array(3).fill(null));
  const [scoff, setScoff] = useState(Array(5).fill(null));
  const [ptsdEvent, setPtsdEvent] = useState(null);
  const [ptsdSymptoms, setPtsdSymptoms] = useState(Array(5).fill(null));

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [callback, setCallback] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [done, setDone] = useState(false);

  const stepId = flow[flowIndex] ?? 'intro';

  const phqScore = useMemo(() => phq.reduce((s, v) => s + (v ?? 0), 0), [phq]);
  const gadScore = useMemo(() => gad.reduce((s, v) => s + (v ?? 0), 0), [gad]);
  const isiScore = useMemo(() => isi.reduce((s, v) => s + (v ?? 0), 0), [isi]);
  const auditScore = useMemo(() => audit.reduce((s, v) => s + (v ?? 0), 0), [audit]);
  const scoffYes = useMemo(() => scoff.filter((v) => v === true).length, [scoff]);
  const ptsdSymYes = useMemo(() => ptsdSymptoms.filter((v) => v === true).length, [ptsdSymptoms]);

  const phqSev = phq9Severity(phqScore);
  const gadSev = gad7Severity(gadScore);
  const isiSev = isiSeverity(isiScore);
  const auditSev = auditCSeverity(auditScore);
  const scoffRes = scoffResult(scoffYes);
  const ptsdRes = ptsdScreenResult(ptsdEvent === true, ptsdSymYes);

  const phqDone = phq.every((v) => v !== null);
  const gadDone = gad.every((v) => v !== null);
  const isiDone = isi.every((v) => v !== null);
  const auditDone = audit.every((v) => v !== null);
  const scoffDone = scoff.every((v) => v !== null);
  const ptsdDone =
    ptsdEvent === false || (ptsdEvent === true && ptsdSymptoms.every((v) => v !== null));
  const canNextPtsd = ptsdEvent !== null && ptsdDone;

  const phoneClean = phone.replace(/[^\d]/g, '');
  const phoneOk = phoneClean.length === 10 && /^[6-9]/.test(phoneClean);
  const nameOk = name.trim().length >= 2;
  const contactOk = nameOk && phoneOk;

  const hasSafetyFlag = (phq[8] ?? 0) > 0;

  function beginFlow() {
    const f = buildFlow(modules);
    setFlow(f);
    setFlowIndex(1);
    setIsi(Array(7).fill(null));
    setAudit(Array(3).fill(null));
    setScoff(Array(5).fill(null));
    setPtsdEvent(null);
    setPtsdSymptoms(Array(5).fill(null));
  }

  function goNext() {
    if (flowIndex < flow.length - 1) setFlowIndex((i) => i + 1);
  }
  function goBack() {
    if (flowIndex > 0) setFlowIndex((i) => i - 1);
  }

  const optionalPayload = useMemo(() => {
    const o = {};
    if (modules.sleep) o.isi = { answers: isi, score: isiScore, severity: isiSev.label };
    if (modules.alcohol) o.audit_c = { answers: audit, score: auditScore, severity: auditSev.label, elevated: auditScore >= 4 };
    if (modules.eating) o.scoff = { answers: scoff, yes_count: scoffYes, positive: scoffRes.positive };
    if (modules.trauma)
      o.ptsd_screen = {
        event: ptsdEvent,
        symptoms: ptsdSymptoms,
        symptom_yes_count: ptsdEvent ? ptsdSymYes : null,
        positive: ptsdRes.positive,
      };
    return Object.keys(o).length ? o : null;
  }, [
    modules,
    isi,
    isiScore,
    isiSev.label,
    audit,
    auditScore,
    auditSev.label,
    scoff,
    scoffYes,
    scoffRes.positive,
    ptsdEvent,
    ptsdSymptoms,
    ptsdSymYes,
    ptsdRes.positive,
  ]);

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await screening.submit({
        name: name.trim(),
        phone: phoneClean,
        email: email.trim() || null,
        phq9_answers: phq,
        phq9_score: phqScore,
        phq9_severity: phqSev.label,
        gad7_answers: gad,
        gad7_score: gadScore,
        gad7_severity: gadSev.label,
        wants_callback: callback,
        reason: 'self-screening',
        optional_screenings: optionalPayload,
      });
      setDone(true);
    } catch (err) {
      setSubmitError(err.message ?? 'Could not save your responses. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const progressPct =
    flowIndex <= 0 || done ? 0 : Math.round((flowIndex / (flow.length - 1)) * 100);
  const progressDetail = useMemo(() => {
    if (flowIndex <= 0 || done) return '';
    const id = flow[flowIndex];
    if (id === 'phq9') return `PHQ-9 · ${phq.filter((v) => v !== null).length}/9`;
    if (id === 'gad7') return `GAD-7 · ${gad.filter((v) => v !== null).length}/7`;
    if (id === 'isi') return `ISI · ${isi.filter((v) => v !== null).length}/7`;
    if (id === 'audit') return `AUDIT-C · ${audit.filter((v) => v !== null).length}/3`;
    if (id === 'scoff') return `SCOFF · ${scoff.filter((v) => v !== null).length}/5`;
    if (id === 'ptsd') return 'Trauma-related screen';
    if (id === 'contact') return 'Contact';
    return '';
  }, [flowIndex, flow, done, phq, gad, isi, audit, scoff]);

  const moduleExtra =
    (modules.sleep ? 1 : 0) +
    (modules.alcohol ? 1 : 0) +
    (modules.eating ? 1 : 0) +
    (modules.trauma ? 1 : 0);
  const estMin = 3 + moduleExtra * 1.5;

  if (done) {
    return (
      <div className="page" style={{ background: 'linear-gradient(180deg, #f0fdfa 0%, #ffffff 380px)', minHeight: '100vh' }}>
        <div className="container" style={{ maxWidth: 720, padding: '2.5rem 1rem 4rem' }}>
          {hasSafetyFlag && (
            <div
              style={{
                background: '#fdecea',
                border: '2px solid #dc3545',
                borderRadius: 14,
                padding: '1.25rem',
                marginBottom: '1rem',
              }}
            >
              <div style={{ fontWeight: 800, color: '#a02622', fontSize: '1rem', marginBottom: 6 }}>⚠ Please reach out for support</div>
              <p style={{ color: '#a02622', fontSize: '0.9rem', margin: 0 }}>
                You indicated thoughts of self-harm. You are not alone — please call{' '}
                <a href="tel:7777936367" style={{ color: '#a02622', fontWeight: 700 }}>
                  7777936367
                </a>{' '}
                now, or reach out to{' '}
                <a href="tel:9152987821" style={{ color: '#a02622', fontWeight: 700 }}>
                  iCall (9152987821)
                </a>
                .
              </p>
            </div>
          )}

          <Card>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2dd4bf, #0f766e)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.2rem',
                  color: '#fff',
                  marginBottom: '1rem',
                  boxShadow: '0 8px 24px rgba(15, 118, 110, 0.35)',
                }}
              >
                ✓
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>Your results, {name.split(' ')[0]}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                PHQ-9 (mood) and GAD-7 (anxiety)
                {moduleExtra ? ' · plus optional screens you chose' : ''}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginBottom: '1.5rem' }}>
              <ScoreCard title="Depression (PHQ-9)" score={phqScore} max={27} severity={phqSev} />
              <ScoreCard title="Anxiety (GAD-7)" score={gadScore} max={21} severity={gadSev} />
              {modules.sleep && <ScoreCard title="Sleep (ISI)" score={isiScore} max={28} severity={isiSev} />}
              {modules.alcohol && (
                <ScoreCard title="Alcohol (AUDIT-C)" score={auditScore} max={12} severity={auditSev} />
              )}
              {modules.eating && (
                <ScoreCard
                  title="Eating (SCOFF)"
                  primaryText={`${scoffYes} of 5 “Yes”`}
                  severity={scoffRes}
                  hideBar
                />
              )}
              {modules.trauma && (
                <ScoreCard
                  title="Trauma-related (screen)"
                  primaryText={
                    ptsdEvent === false
                      ? 'No trauma endorsement'
                      : `${ptsdSymYes} of 5 symptoms · ${ptsdRes.positive ? 'Further assessment suggested' : 'Below typical cut-off'}`
                  }
                  severity={ptsdRes}
                  hideBar
                />
              )}
            </div>

            <div
              style={{
                background: '#f0fdfa',
                border: '1px solid var(--brand-300, #5eead4)',
                borderRadius: 12,
                padding: '1rem 1.25rem',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ fontWeight: 800, marginBottom: 6, color: 'var(--brand-700, #0f766e)' }}>💡 Our recommendation</div>
              <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.6 }}>{combinedRecommendation()}</p>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link to="/book" className="btn btn-primary">
                Book a session →
              </Link>
              <Link to="/patient/find-professional" className="btn btn-ghost">
                Browse professionals
              </Link>
              <a
                href={`https://wa.me/917777936367?text=${encodeURIComponent(waMessage())}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost"
                style={{ background: '#25D366', color: '#fff', borderColor: '#25D366' }}
              >
                💬 WhatsApp us
              </a>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1.25rem', lineHeight: 1.5 }}>
              These tools are screeners, not a diagnosis. A licensed professional can give you a complete assessment.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  function combinedRecommendation() {
    const parts = [];
    const modMood = phqScore >= 10 || gadScore >= 10;

    if (phqScore >= 15 || gadScore >= 15) {
      parts.push('Your depression/anxiety scores suggest moderately severe or severe symptoms — speaking with a psychiatrist soon is strongly recommended.');
    } else if (modMood) {
      parts.push('Your mood and anxiety scores are in a moderate range — a psychologist or therapist can help; consider booking within 1–2 weeks.');
    } else if (Math.max(phqScore, gadScore) >= 5) {
      parts.push('Mild mood/anxiety scores — self-care, counselling, and follow-up are reasonable next steps.');
    } else {
      parts.push('Mood and anxiety scores are minimal — great baseline.');
    }

    if (modules.sleep && isiScore >= 15) {
      parts.push('Your sleep score suggests clinically significant insomnia — worth discussing with a clinician.');
    }
    if (modules.alcohol && auditScore >= 4) {
      parts.push('Your alcohol screen is elevated — discuss drinking patterns with a professional.');
    }
    if (modules.eating && scoffRes.positive) {
      parts.push('Your eating screen suggests further evaluation may help — if food or body image is a struggle, reach out.');
    }
    if (modules.trauma && ptsdRes.positive) {
      parts.push('Your trauma-related answers suggest a trauma-informed assessment could be useful.');
    }

    return parts.join(' ');
  }

  function waMessage() {
    let t = `Hi, I completed self-screening — PHQ-9: ${phqScore} (${phqSev.label}), GAD-7: ${gadScore} (${gadSev.label})`;
    if (modules.sleep) t += `, ISI: ${isiScore}`;
    if (modules.alcohol) t += `, AUDIT-C: ${auditScore}`;
    if (modules.eating) t += `, SCOFF yes: ${scoffYes}/5`;
    if (modules.trauma && ptsdEvent) t += `, trauma screen: ${ptsdSymYes}/5 yes`;
    t += `. I'd like to talk to someone.`;
    return t;
  }

  const toggle = (key) => () => setModules((m) => ({ ...m, [key]: !m[key] }));

  return (
    <div className="page" style={{ background: 'linear-gradient(180deg, #f0fdfa 0%, #ffffff 380px)', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 720, padding: '2.5rem 1rem 4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <p
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'var(--brand-600)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 8,
            }}
          >
            Self-screening
          </p>
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.4rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: 10,
              letterSpacing: '-0.02em',
            }}
          >
            How have you been{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #14b8a6, #0f766e)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              feeling lately?
            </span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 560, margin: '0 auto', lineHeight: 1.55 }}>
            Confidential check-in using validated tools: <strong>PHQ-9</strong> (depression) and <strong>GAD-7</strong> (anxiety). You can add optional screens for{' '}
            <strong>sleep</strong>, <strong>alcohol</strong>, <strong>eating</strong>, or <strong>trauma-related stress</strong>. ~{estMin.toFixed(0)}–8 min.
          </p>
        </div>

        {flowIndex > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                marginBottom: 5,
                fontWeight: 600,
              }}
            >
              <span>
                Step {flowIndex} of {flow.length - 1}
              </span>
              <span>
                {flowStepLabel(stepId)} {progressDetail ? `· ${progressDetail}` : ''}
              </span>
            </div>
            <div style={{ background: '#e6fffa', height: 8, borderRadius: 99, overflow: 'hidden' }}>
              <div
                style={{
                  background: 'linear-gradient(90deg, #14b8a6, #0f766e)',
                  height: '100%',
                  width: `${progressPct}%`,
                  transition: 'width 0.3s ease',
                  borderRadius: 99,
                }}
              />
            </div>
          </div>
        )}

        {stepId === 'intro' && (
          <Card>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: '1.25rem' }}>
              {[
                { icon: '🧘', title: 'Confidential', desc: 'Your responses are sent securely to our care team.' },
                { icon: '🩺', title: 'Validated tools', desc: 'Same screeners used in clinics worldwide.' },
                { icon: '➕', title: 'Optional add-ons', desc: 'Pick extra screens that match your concerns.' },
              ].map((f) => (
                <div key={f.title} style={{ background: '#f0fdfa', borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.6rem', marginBottom: 6 }}>{f.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', marginBottom: 2 }}>{f.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{f.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ fontWeight: 800, fontSize: '0.92rem', marginBottom: 10, color: 'var(--text)' }}>
              Optional — screen for a specific concern
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5 }}>
              PHQ-9 and GAD-7 always run first. Tap any area below to add an extra questionnaire (not a diagnosis).
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginBottom: '1.25rem' }}>
              {[
                { key: 'sleep', icon: '🌙', label: 'Sleep / insomnia', sub: 'ISI' },
                { key: 'alcohol', icon: '🍷', label: 'Alcohol use', sub: 'AUDIT-C' },
                { key: 'eating', icon: '🍽', label: 'Eating / weight', sub: 'SCOFF' },
                { key: 'trauma', icon: '🛡', label: 'Trauma / PTSD-type stress', sub: '5-item screen' },
              ].map((x) => (
                <button
                  key={x.key}
                  type="button"
                  onClick={toggle(x.key)}
                  style={{
                    textAlign: 'left',
                    padding: '12px 14px',
                    borderRadius: 12,
                    border: modules[x.key] ? '2px solid var(--brand-500, #14b8a6)' : '1px solid var(--border)',
                    background: modules[x.key] ? '#e6fffa' : '#fff',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>{x.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>{x.label}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{x.sub}</div>
                </button>
              ))}
            </div>

            <div
              style={{
                background: 'var(--bg-subtle, #f8f9fa)',
                borderRadius: 10,
                padding: '12px 14px',
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                marginBottom: '1.5rem',
                borderLeft: '3px solid #ffc107',
              }}
            >
              ⚠ <strong>Important:</strong> This is self-screening, not a diagnosis. If you&apos;re in crisis, call{' '}
              <a href="tel:7777936367" style={{ color: 'var(--brand-700)', fontWeight: 600 }}>
                7777936367
              </a>{' '}
              or emergency services.
            </div>

            <button type="button" onClick={beginFlow} className="btn btn-primary btn-lg btn-full">
              Begin screening →
            </button>
          </Card>
        )}

        {stepId === 'phq9' && (
          <QuestionnaireCard
            tool="PHQ-9"
            title="Over the last 2 weeks, how often have you been bothered by…"
            questions={PHQ9_QUESTIONS}
            answers={phq}
            setAnswers={setPhq}
            options={FREQ_OPTIONS}
            onBack={goBack}
            onNext={goNext}
            canNext={phqDone}
          />
        )}

        {stepId === 'gad7' && (
          <QuestionnaireCard
            tool="GAD-7"
            title="Over the last 2 weeks, how often have you been bothered by…"
            questions={GAD7_QUESTIONS}
            answers={gad}
            setAnswers={setGad}
            options={FREQ_OPTIONS}
            onBack={goBack}
            onNext={goNext}
            canNext={gadDone}
          />
        )}

        {stepId === 'isi' && (
          <QuestionnaireCard
            tool="ISI"
            title="For each item, pick the answer that best describes your sleep in the last 2 weeks."
            questions={ISI_QUESTIONS}
            answers={isi}
            setAnswers={setIsi}
            options={ISI_OPTIONS}
            onBack={goBack}
            onNext={goNext}
            canNext={isiDone}
          />
        )}

        {stepId === 'audit' && <AuditCard answers={audit} setAnswers={setAudit} onBack={goBack} onNext={goNext} canNext={auditDone} />}

        {stepId === 'scoff' && (
          <YesNoCard
            tool="SCOFF"
            title="Answer yes or no — there are no wrong answers."
            questions={SCOFF_QUESTIONS}
            answers={scoff}
            setAnswers={setScoff}
            onBack={goBack}
            onNext={goNext}
            canNext={scoffDone}
          />
        )}

        {stepId === 'ptsd' && (
          <PtsdCard
            eventQuestion={PTSD_EVENT_QUESTION}
            symptomQuestions={PTSD_SYMPTOM_QUESTIONS}
            eventYes={ptsdEvent}
            setEventYes={setPtsdEvent}
            symptoms={ptsdSymptoms}
            setSymptoms={setPtsdSymptoms}
            onBack={goBack}
            onNext={goNext}
            canNext={canNextPtsd}
          />
        )}

        {stepId === 'contact' && (
          <Card>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 4 }}>One last step</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Share your details so we can send your personalised results and follow up if you&apos;d like to talk to someone.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
              <FieldInput label="Your name" value={name} onChange={setName} placeholder="Full name" required />

              <div>
                <label style={fieldLabelStyle}>Phone (India) *</label>
                <div style={{ display: 'flex', gap: 6, alignItems: 'stretch' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '0 10px',
                      background: 'var(--bg-subtle, #f0fdfa)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                    }}
                  >
                    +91
                  </span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit number"
                    inputMode="numeric"
                    style={{
                      ...inputStyle,
                      borderColor: phone && !phoneOk ? '#dc3545' : 'var(--border)',
                    }}
                  />
                </div>
                {phone && !phoneOk && (
                  <span style={{ fontSize: '0.78rem', color: '#dc3545', marginTop: 3, display: 'block' }}>
                    Enter a valid 10-digit number starting with 6–9.
                  </span>
                )}
              </div>

              <FieldInput label="Email (optional)" value={email} onChange={setEmail} type="email" placeholder="you@example.com" />

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.88rem', cursor: 'pointer', padding: '8px 0' }}>
                <input
                  type="checkbox"
                  checked={callback}
                  onChange={(e) => setCallback(e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: 'var(--brand-500, #14b8a6)', flexShrink: 0, marginTop: 2 }}
                />
                <span>
                  I&apos;d like a Serenest professional to <strong>reach out and discuss my results</strong>.
                </span>
              </label>
            </div>

            {submitError && (
              <div
                style={{
                  background: '#fdecea',
                  border: '1px solid #f5c2c0',
                  color: '#a02622',
                  borderRadius: 10,
                  padding: '12px 14px',
                  marginBottom: '1rem',
                  fontSize: '0.88rem',
                }}
              >
                ⚠ {submitError}
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
              <button type="button" onClick={goBack} className="btn btn-ghost" disabled={submitting}>
                ← Back
              </button>
              <button type="button" onClick={handleSubmit} className="btn btn-primary" disabled={!contactOk || submitting}>
                {submitting ? 'Submitting…' : 'See my results →'}
              </button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function Card({ children }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 16,
        padding: '1.75rem',
        boxShadow: '0 8px 24px rgba(15, 118, 110, 0.08)',
        border: '1px solid var(--border)',
      }}
    >
      {children}
    </div>
  );
}

function QuestionnaireCard({ tool, title, questions, answers, setAnswers, options, onBack, onNext, canNext }) {
  return (
    <Card>
      <div style={{ marginBottom: '1.25rem' }}>
        <div
          style={{
            display: 'inline-block',
            background: '#f0fdfa',
            color: 'var(--brand-700, #0f766e)',
            padding: '3px 10px',
            borderRadius: 99,
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            marginBottom: 8,
          }}
        >
          {tool}
        </div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.4 }}>{title}</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {questions.map((q, i) => (
          <div
            key={i}
            style={{
              background: answers[i] !== null ? '#f0fdfa' : 'var(--bg-subtle, #fafafa)',
              border: `1px solid ${answers[i] !== null ? 'var(--brand-300, #5eead4)' : 'var(--border)'}`,
              borderRadius: 12,
              padding: '12px 14px',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <span
                style={{
                  background: 'var(--brand-500, #14b8a6)',
                  color: '#fff',
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.5, fontWeight: 500 }}>{q}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 6 }}>
              {options.map((opt) => {
                const selected = answers[i] === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      const next = [...answers];
                      next[i] = opt.value;
                      setAnswers(next);
                    }}
                    style={{
                      padding: '7px 8px',
                      borderRadius: 8,
                      border: selected ? '2px solid var(--brand-500, #14b8a6)' : '1px solid var(--border)',
                      background: selected ? 'var(--brand-500, #14b8a6)' : '#fff',
                      color: selected ? '#fff' : 'var(--text)',
                      fontSize: '0.75rem',
                      fontWeight: selected ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.12s',
                      lineHeight: 1.2,
                    }}
                  >
                    <div>{opt.label}</div>
                    {opt.sub && <div style={{ fontSize: '0.65rem', opacity: 0.85 }}>{opt.sub}</div>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: '1.5rem' }}>
        <button type="button" onClick={onBack} className="btn btn-ghost">
          ← Back
        </button>
        <button type="button" onClick={onNext} className="btn btn-primary" disabled={!canNext}>
          {canNext ? 'Continue →' : `Answer all ${questions.length} questions`}
        </button>
      </div>
    </Card>
  );
}

function AuditCard({ answers, setAnswers, onBack, onNext, canNext }) {
  return (
    <Card>
      <div style={{ marginBottom: '1.25rem' }}>
        <div
          style={{
            display: 'inline-block',
            background: '#f0fdfa',
            color: 'var(--brand-700, #0f766e)',
            padding: '3px 10px',
            borderRadius: 99,
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            marginBottom: 8,
          }}
        >
          AUDIT-C
        </div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.4 }}>Alcohol — three quick questions</h2>
      </div>
      {AUDIT_QUESTIONS.map((block, i) => (
        <div
          key={i}
          style={{
            background: answers[i] !== null ? '#f0fdfa' : 'var(--bg-subtle, #fafafa)',
            border: `1px solid ${answers[i] !== null ? 'var(--brand-300, #5eead4)' : 'var(--border)'}`,
            borderRadius: 12,
            padding: '12px 14px',
            marginBottom: 10,
          }}
        >
          <p style={{ margin: '0 0 10px', fontSize: '0.92rem', fontWeight: 600 }}>{block.text}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {block.options.map((opt) => {
              const selected = answers[i] === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    const next = [...answers];
                    next[i] = opt.value;
                    setAnswers(next);
                  }}
                  style={{
                    textAlign: 'left',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: selected ? '2px solid var(--brand-500, #14b8a6)' : '1px solid var(--border)',
                    background: selected ? '#e6fffa' : '#fff',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '0.88rem',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: '1.5rem' }}>
        <button type="button" onClick={onBack} className="btn btn-ghost">
          ← Back
        </button>
        <button type="button" onClick={onNext} className="btn btn-primary" disabled={!canNext}>
          {canNext ? 'Continue →' : 'Answer all 3 questions'}
        </button>
      </div>
    </Card>
  );
}

function YesNoCard({ tool, title, questions, answers, setAnswers, onBack, onNext, canNext }) {
  return (
    <Card>
      <div style={{ marginBottom: '1.25rem' }}>
        <div
          style={{
            display: 'inline-block',
            background: '#f0fdfa',
            color: 'var(--brand-700, #0f766e)',
            padding: '3px 10px',
            borderRadius: 99,
            fontSize: '0.72rem',
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          {tool}
        </div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.4 }}>{title}</h2>
      </div>
      {questions.map((q, i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          <p style={{ fontSize: '0.88rem', marginBottom: 8, fontWeight: 600 }}>{q}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {[false, true].map((val) => {
              const selected = answers[i] === val;
              return (
                <button
                  key={String(val)}
                  type="button"
                  onClick={() => {
                    const next = [...answers];
                    next[i] = val;
                    setAnswers(next);
                  }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 8,
                    border: selected ? '2px solid var(--brand-500, #14b8a6)' : '1px solid var(--border)',
                    background: selected ? 'var(--brand-500, #14b8a6)' : '#fff',
                    color: selected ? '#fff' : 'var(--text)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {val ? 'Yes' : 'No'}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: '1.5rem' }}>
        <button type="button" onClick={onBack} className="btn btn-ghost">
          ← Back
        </button>
        <button type="button" onClick={onNext} className="btn btn-primary" disabled={!canNext}>
          {canNext ? 'Continue →' : `Answer all ${questions.length}`}
        </button>
      </div>
    </Card>
  );
}

function PtsdCard({ eventQuestion, symptomQuestions, eventYes, setEventYes, symptoms, setSymptoms, onBack, onNext, canNext }) {
  const showSymptoms = eventYes === true;
  return (
    <Card>
      <div style={{ marginBottom: '1.25rem' }}>
        <div
          style={{
            display: 'inline-block',
            background: '#f0fdfa',
            color: 'var(--brand-700, #0f766e)',
            padding: '3px 10px',
            borderRadius: 99,
            fontSize: '0.72rem',
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Trauma-related screen
        </div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.4 }}>A few questions about stress after difficult events</h2>
      </div>

      <p style={{ fontSize: '0.92rem', fontWeight: 600, marginBottom: 8 }}>{eventQuestion}</p>
      <div style={{ display: 'flex', gap: 8, marginBottom: showSymptoms ? '1.25rem' : '1.5rem' }}>
        {[false, true].map((val) => {
          const selected = eventYes === val;
          return (
            <button
              key={String(val)}
              type="button"
              onClick={() => {
                setEventYes(val);
                if (!val) setSymptoms(Array(5).fill(null));
              }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 8,
                border: selected ? '2px solid var(--brand-500, #14b8a6)' : '1px solid var(--border)',
                background: selected ? 'var(--brand-500, #14b8a6)' : '#fff',
                color: selected ? '#fff' : 'var(--text)',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {val ? 'Yes' : 'No'}
            </button>
          );
        })}
      </div>

      {showSymptoms && (
        <>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: 12 }}>In the past month:</p>
          {symptomQuestions.map((q, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <p style={{ fontSize: '0.88rem', marginBottom: 8, fontWeight: 600 }}>{q}</p>
              <div style={{ display: 'flex', gap: 8 }}>
                {[false, true].map((val) => {
                  const selected = symptoms[i] === val;
                  return (
                    <button
                      key={String(val)}
                      type="button"
                      onClick={() => {
                        const next = [...symptoms];
                        next[i] = val;
                        setSymptoms(next);
                      }}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: 8,
                        border: selected ? '2px solid var(--brand-500, #14b8a6)' : '1px solid var(--border)',
                        background: selected ? 'var(--brand-500, #14b8a6)' : '#fff',
                        color: selected ? '#fff' : 'var(--text)',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      {val ? 'Yes' : 'No'}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: '1.5rem' }}>
        <button type="button" onClick={onBack} className="btn btn-ghost">
          ← Back
        </button>
        <button type="button" onClick={onNext} className="btn btn-primary" disabled={!canNext}>
          {canNext ? 'Continue →' : 'Complete the questions above'}
        </button>
      </div>
    </Card>
  );
}

function ScoreCard({ title, score, max, severity, primaryText, hideBar = false }) {
  const pct = max > 0 ? (score / max) * 100 : 0;
  const useText = primaryText != null;
  return (
    <div
      style={{
        background: '#fff',
        border: `2px solid ${severity.color}`,
        borderRadius: 12,
        padding: '1rem 1.25rem',
      }}
    >
      <div
        style={{
          fontSize: '0.78rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      {useText ? (
        <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)', marginBottom: 8, lineHeight: 1.35 }}>{primaryText}</div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: '2.2rem', fontWeight: 800, color: severity.color, lineHeight: 1 }}>{score}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/ {max}</span>
        </div>
      )}
      {!hideBar && !useText && (
        <div style={{ background: 'var(--bg-subtle, #f0fdfa)', height: 6, borderRadius: 99, overflow: 'hidden', marginBottom: 8 }}>
          <div style={{ background: severity.color, height: '100%', width: `${Math.min(pct, 100)}%`, borderRadius: 99 }} />
        </div>
      )}
      <div
        style={{
          display: 'inline-block',
          background: `${severity.color}18`,
          color: severity.color,
          padding: '2px 10px',
          borderRadius: 99,
          fontSize: '0.78rem',
          fontWeight: 700,
        }}
      >
        {severity.label}
      </div>
      <p style={{ margin: '8px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>{severity.desc}</p>
    </div>
  );
}

function FieldInput({ label, value, onChange, placeholder, type = 'text', required = false }) {
  return (
    <div>
      <label style={fieldLabelStyle}>
        {label}
        {required ? ' *' : ''}
      </label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={inputStyle} />
    </div>
  );
}

const fieldLabelStyle = {
  display: 'block',
  fontSize: '0.78rem',
  fontWeight: 700,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  marginBottom: 4,
};

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  fontSize: '0.95rem',
  border: '1px solid var(--border)',
  borderRadius: 8,
  background: '#fff',
  color: 'var(--text)',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};
