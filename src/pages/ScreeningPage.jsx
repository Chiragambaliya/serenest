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
  WHO5_QUESTIONS,
  WHO5_OPTIONS,
  STOPBANG_QUESTIONS,
  FREQ_OPTIONS,
  buildFlow,
  phq9Severity,
  gad7Severity,
  isiSeverity,
  auditCSeverity,
  scoffResult,
  ptsdScreenResult,
  who5Severity,
  stopBangResult,
  flowStepLabel,
} from '../lib/screeningTools';

export default function ScreeningPage() {
  const [modules, setModules] = useState({
    sleep: false,
    osa: false,
    alcohol: false,
    eating: false,
    trauma: false,
    wellbeing: false,
  });

  const [flow, setFlow] = useState(() =>
    buildFlow({ sleep: false, osa: false, alcohol: false, eating: false, trauma: false, wellbeing: false }),
  );
  const [flowIndex, setFlowIndex] = useState(0);

  const [phq, setPhq] = useState(Array(9).fill(null));
  const [gad, setGad] = useState(Array(7).fill(null));
  const [isi, setIsi] = useState(Array(7).fill(null));
  const [audit, setAudit] = useState(Array(3).fill(null));
  const [scoff, setScoff] = useState(Array(5).fill(null));
  const [ptsdEvent, setPtsdEvent] = useState(null);
  const [ptsdSymptoms, setPtsdSymptoms] = useState(Array(5).fill(null));
  const [who5, setWho5] = useState(Array(5).fill(null));
  const [stopbang, setStopbang] = useState(Array(8).fill(null));

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
  const who5Score = useMemo(() => who5.reduce((s, v) => s + (v ?? 0), 0), [who5]);
  const who5Index = who5Score * 4;
  const stopbangYes = useMemo(() => stopbang.filter((v) => v === true).length, [stopbang]);

  const phqSev = phq9Severity(phqScore);
  const gadSev = gad7Severity(gadScore);
  const isiSev = isiSeverity(isiScore);
  const auditSev = auditCSeverity(auditScore);
  const scoffRes = scoffResult(scoffYes);
  const ptsdRes = ptsdScreenResult(ptsdEvent === true, ptsdSymYes);
  const who5Sev = who5Severity(who5Score);
  const stopBangRes = stopBangResult(stopbangYes);

  const phqDone = phq.every((v) => v !== null);
  const gadDone = gad.every((v) => v !== null);
  const isiDone = isi.every((v) => v !== null);
  const auditDone = audit.every((v) => v !== null);
  const scoffDone = scoff.every((v) => v !== null);
  const ptsdDone =
    ptsdEvent === false || (ptsdEvent === true && ptsdSymptoms.every((v) => v !== null));
  const canNextPtsd = ptsdEvent !== null && ptsdDone;
  const who5Done = who5.every((v) => v !== null);
  const stopbangDone = stopbang.every((v) => v !== null);

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
    setWho5(Array(5).fill(null));
    setStopbang(Array(8).fill(null));
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
    if (modules.wellbeing) o.who5 = { answers: who5, raw: who5Score, index: who5Index, severity: who5Sev.label };
    if (modules.osa)
      o.stop_bang = {
        answers: stopbang,
        yes_count: stopbangYes,
        severity: stopBangRes.label,
        elevated: stopBangRes.elevated,
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
    who5,
    who5Score,
    who5Index,
    who5Sev.label,
    stopbang,
    stopbangYes,
    stopBangRes.label,
    stopBangRes.elevated,
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
    if (id === 'stopbang') return `STOP-BANG · ${stopbang.filter((v) => v !== null).length}/8`;
    if (id === 'who5') return `WHO-5 · ${who5.filter((v) => v !== null).length}/5`;
    if (id === 'contact') return 'Contact';
    return '';
  }, [flowIndex, flow, done, phq, gad, isi, audit, scoff, stopbang, who5]);

  const moduleExtra =
    (modules.sleep ? 1 : 0) +
    (modules.osa ? 1 : 0) +
    (modules.alcohol ? 1 : 0) +
    (modules.eating ? 1 : 0) +
    (modules.trauma ? 1 : 0) +
    (modules.wellbeing ? 1 : 0);
  const estMin = 3 + moduleExtra * 1.5;

  if (done) {
    return (
      <div className="screening-page screening-page--done page">
        <div className="container screening-container">
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

            <div className="screening-results-grid">
              <ScoreCard title="Depression (PHQ-9)" score={phqScore} max={27} severity={phqSev} />
              <ScoreCard title="Anxiety (GAD-7)" score={gadScore} max={21} severity={gadSev} />
              {modules.sleep && <ScoreCard title="Sleep (ISI)" score={isiScore} max={28} severity={isiSev} />}
              {modules.osa && (
                <ScoreCard
                  title="Sleep apnoea risk (STOP-BANG)"
                  primaryText={`${stopbangYes} of 8 factors (Yes)`}
                  severity={stopBangRes}
                  hideBar
                />
              )}
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
              {modules.wellbeing && (
                <ScoreCard
                  title="Wellbeing (WHO-5)"
                  primaryText={`${who5Score}/25 · wellbeing index ${who5Index}/100`}
                  severity={who5Sev}
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
    if (modules.wellbeing && who5Index <= 28) {
      parts.push('Your wellbeing score is in a range that often prompts a fuller mood discussion with a professional.');
    }
    if (modules.osa && stopbangYes >= 3) {
      parts.push('Your STOP-BANG pattern suggests discussing sleep apnoea risk with a clinician, especially if you snore or feel very sleepy in the day.');
    }

    return parts.join(' ');
  }

  function waMessage() {
    let t = `Hi, I completed self-screening — PHQ-9: ${phqScore} (${phqSev.label}), GAD-7: ${gadScore} (${gadSev.label})`;
    if (modules.sleep) t += `, ISI: ${isiScore}`;
    if (modules.alcohol) t += `, AUDIT-C: ${auditScore}`;
    if (modules.eating) t += `, SCOFF yes: ${scoffYes}/5`;
    if (modules.trauma && ptsdEvent) t += `, trauma screen: ${ptsdSymYes}/5 yes`;
    if (modules.wellbeing) t += `, WHO-5 index: ${who5Index}/100`;
    if (modules.osa) t += `, STOP-BANG: ${stopbangYes}/8 yes`;
    t += `. I'd like to talk to someone.`;
    return t;
  }

  const toggle = (key) => () => setModules((m) => ({ ...m, [key]: !m[key] }));

  return (
    <div className="screening-page page">
      <div className="container screening-container">
        <header className="screening-hero">
          <p className="screening-hero-kicker">Self-screening</p>
          <h1 className="screening-hero-title">
            How have you been{' '}
            <span className="screening-hero-accent">feeling lately?</span>
          </h1>
          <p className="screening-hero-lead">
            Confidential check-in using validated tools: <strong>PHQ-9</strong> and <strong>GAD-7</strong> first. Add optional screens —{' '}
            <strong>sleep</strong>, <strong>sleep apnoea risk</strong>, <strong>alcohol</strong>, <strong>eating</strong>, <strong>trauma stress</strong>,{' '}
            <strong>wellbeing</strong>. About {estMin.toFixed(0)}–10 min if you select several add-ons.
          </p>
        </header>

        {flowIndex > 0 && (
          <div className="screening-progress" aria-hidden={false}>
            <div className="screening-progress-meta">
              <span>
                Step {flowIndex} of {flow.length - 1}
              </span>
              <span>
                {flowStepLabel(stepId)}
                {progressDetail ? ` · ${progressDetail}` : ''}
              </span>
            </div>
            <div className="screening-progress-track">
              <div className="screening-progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        )}

        {stepId === 'intro' && (
          <Card>
            <div className="screening-intro-features">
              {[
                { icon: '🧘', title: 'Confidential', desc: 'Your responses are sent securely to our care team.' },
                { icon: '🩺', title: 'Validated tools', desc: 'Screeners commonly used in clinical practice.' },
                { icon: '➕', title: 'Pick your add-ons', desc: 'Only complete the extra questionnaires you choose.' },
              ].map((f) => (
                <div key={f.title} className="screening-intro-feature">
                  <div className="screening-intro-feature-icon" aria-hidden>
                    {f.icon}
                  </div>
                  <div className="screening-intro-feature-title">{f.title}</div>
                  <div className="screening-intro-feature-desc">{f.desc}</div>
                </div>
              ))}
            </div>

            <h2 className="screening-module-heading">Optional — add screens by concern</h2>
            <p className="screening-module-sub">
              PHQ-9 and GAD-7 always run first. Tap a card to include that tool (not a diagnosis).
            </p>
            <div className="screening-module-grid">
              {[
                { key: 'sleep', icon: '🌙', label: 'Insomnia / sleep quality', sub: 'ISI' },
                { key: 'osa', icon: '😮‍💨', label: 'Sleep apnoea risk', sub: 'STOP-BANG' },
                { key: 'alcohol', icon: '🍷', label: 'Alcohol use', sub: 'AUDIT-C' },
                { key: 'eating', icon: '🍽', label: 'Eating / weight', sub: 'SCOFF' },
                { key: 'trauma', icon: '🛡', label: 'Trauma & stress', sub: '5-item screen' },
                { key: 'wellbeing', icon: '☀️', label: 'General wellbeing', sub: 'WHO-5' },
              ].map((x) => (
                <button
                  key={x.key}
                  type="button"
                  onClick={toggle(x.key)}
                  className={`screening-module-tile${modules[x.key] ? ' is-selected' : ''}`}
                >
                  <span className="screening-module-tile-icon" aria-hidden>
                    {x.icon}
                  </span>
                  <span className="screening-module-tile-label">{x.label}</span>
                  <span className="screening-module-tile-sub">{x.sub}</span>
                </button>
              ))}
            </div>

            <div className="screening-disclaimer">
              ⚠ <strong>Important:</strong> This is self-screening, not a diagnosis. If you&apos;re in crisis, call{' '}
              <a href="tel:7777936367">7777936367</a> or emergency services.
            </div>

            <button type="button" onClick={beginFlow} className="btn btn-primary btn-lg btn-full screening-begin-btn">
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

        {stepId === 'stopbang' && (
          <YesNoCard
            tool="STOP-BANG"
            title="Answer yes or no. This estimates risk for obstructive sleep apnoea — it does not replace a sleep study."
            questions={STOPBANG_QUESTIONS}
            answers={stopbang}
            setAnswers={setStopbang}
            onBack={goBack}
            onNext={goNext}
            canNext={stopbangDone}
          />
        )}

        {stepId === 'who5' && (
          <QuestionnaireCard
            tool="WHO-5"
            title="Over the last two weeks — for each statement, how often have you felt this way?"
            questions={WHO5_QUESTIONS}
            answers={who5}
            setAnswers={setWho5}
            options={WHO5_OPTIONS}
            onBack={goBack}
            onNext={goNext}
            canNext={who5Done}
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
  return <div className="screening-card">{children}</div>;
}

function QuestionnaireCard({ tool, title, questions, answers, setAnswers, options, onBack, onNext, canNext }) {
  return (
    <Card>
      <div className="screening-q-header">
        <div className="screening-tool-badge">{tool}</div>
        <h2 className="screening-q-title">{title}</h2>
      </div>

      <div className="screening-q-list">
        {questions.map((q, i) => (
          <div key={i} className={`screening-q-item${answers[i] !== null ? ' is-answered' : ''}`}>
            <div className="screening-q-item-top">
              <span className="screening-q-num">{i + 1}</span>
              <p className="screening-q-text">{q}</p>
            </div>
            <div className="screening-scale-grid">
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
                    className={`screening-scale-btn${selected ? ' is-selected' : ''}`}
                  >
                    <div>{opt.label}</div>
                    {opt.sub && <div className="screening-scale-sub">{opt.sub}</div>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="screening-nav-buttons">
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
