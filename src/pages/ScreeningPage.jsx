import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { screening } from '../lib/api';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { SCREENING_TOOLS } from '../lib/screeningTools';
import { trackEvent } from '../lib/analytics';

// ── Validated clinical screeners ──────────────────────────────────
// PHQ-9 — Patient Health Questionnaire for depression (Kroenke et al.)
const PHQ9_QUESTIONS = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
  'Trouble concentrating on things, such as reading the newspaper or watching television',
  'Moving or speaking so slowly that other people could have noticed. Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual',
  'Thoughts that you would be better off dead, or of hurting yourself in some way',
];

// GAD-7 — Generalized Anxiety Disorder scale (Spitzer et al.)
const GAD7_QUESTIONS = [
  'Feeling nervous, anxious or on edge',
  'Not being able to stop or control worrying',
  'Worrying too much about different things',
  'Trouble relaxing',
  'Being so restless that it is hard to sit still',
  'Becoming easily annoyed or irritable',
  'Feeling afraid as if something awful might happen',
];

const FREQ_OPTIONS = [
  { value: 0, label: 'Not at all',           sub: '0 days' },
  { value: 1, label: 'Several days',         sub: '1–6 days' },
  { value: 2, label: 'More than half the days', sub: '7–11 days' },
  { value: 3, label: 'Nearly every day',     sub: '12–14 days' },
];

function phq9Severity(score) {
  if (score <= 4)  return { label: 'Minimal',     color: '#198754', desc: 'Symptoms are minimal and unlikely to need treatment.' };
  if (score <= 9)  return { label: 'Mild',        color: '#0d6efd', desc: 'Mild symptoms — watchful waiting, lifestyle and follow-up.' };
  if (score <= 14) return { label: 'Moderate',    color: '#e67e22', desc: 'Moderate symptoms — talk therapy is recommended.' };
  if (score <= 19) return { label: 'Moderately Severe', color: '#fd7e14', desc: 'Active treatment recommended — therapy and possibly medication.' };
  return              { label: 'Severe',          color: '#dc3545', desc: 'Severe symptoms — immediate active treatment is recommended.' };
}

function gad7Severity(score) {
  if (score <= 4)  return { label: 'Minimal',  color: '#198754', desc: 'Anxiety is within normal range.' };
  if (score <= 9)  return { label: 'Mild',     color: '#0d6efd', desc: 'Mild anxiety — monitor and consider self-care strategies.' };
  if (score <= 14) return { label: 'Moderate', color: '#e67e22', desc: 'Moderate anxiety — talk therapy can help.' };
  return              { label: 'Severe',       color: '#dc3545', desc: 'Severe anxiety — professional support is strongly recommended.' };
}

// ── Page ───────────────────────────────────────────────────────────
export default function ScreeningPage() {
  useSEO({ path: '/screening', ...ROUTE_SEO['/screening'] });
  // 0 = intro, 1 = PHQ-9, 2 = GAD-7, 3 = contact, 4 = results
  const [step, setStep] = useState(0);

  const [phq, setPhq] = useState(Array(9).fill(null));
  const [gad, setGad] = useState(Array(7).fill(null));

  const [name, setName]       = useState('');
  const [phone, setPhone]     = useState('');
  const [email, setEmail]     = useState('');
  const [callback, setCallback] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [done, setDone]       = useState(false);

  const phqScore = useMemo(() => phq.reduce((s, v) => s + (v ?? 0), 0), [phq]);
  const gadScore = useMemo(() => gad.reduce((s, v) => s + (v ?? 0), 0), [gad]);
  const phqSev = phq9Severity(phqScore);
  const gadSev = gad7Severity(gadScore);

  const phqDone = phq.every((v) => v !== null);
  const gadDone = gad.every((v) => v !== null);

  const phoneClean = phone.replace(/[^\d]/g, '');
  const phoneOk = phoneClean.length === 10 && /^[6-9]/.test(phoneClean);
  const nameOk  = name.trim().length >= 2;
  const contactOk = nameOk && phoneOk;

  // safety alert: question 9 (suicidal ideation) > 0
  const hasSafetyFlag = (phq[8] ?? 0) > 0;

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
      });
      setDone(true);
      setStep(4);
      trackEvent('screening_completed', {
        phq9_severity: phqSev.label,
        gad7_severity: gadSev.label,
        wants_callback: callback,
      });
    } catch (err) {
      setSubmitError(err.message ?? 'Could not save your responses. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // ── progress bar ───────────────────────────────────────────────
  const progress = step === 0 ? 0 : step === 4 ? 100 : Math.round(((step - 1) / 3) * 100 + ((step === 1 ? phq.filter(v => v !== null).length / 9 : step === 2 ? gad.filter(v => v !== null).length / 7 : step === 3 ? (nameOk + phoneOk) / 2 : 0) / 3) * 100);

  return (
    <div className="page" style={{ background: 'linear-gradient(180deg, #f4eee4 0%, #faf7f1 380px)', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 720, padding: '2.5rem 1rem 4rem' }}>

        {/* ── Header ────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--brand-600)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Self-screening</p>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.4rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: 10, letterSpacing: '-0.02em' }}>
            How have you been <span style={{ background: 'linear-gradient(135deg, #7a9a5a, #46552f)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>feeling lately?</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 540, margin: '0 auto', lineHeight: 1.55 }}>
            A confidential 3-minute check-in using clinically validated questionnaires (PHQ-9 + GAD-7). Your answers help us match you with the right support.
          </p>
        </div>

        {/* ── Progress bar ──────────────────────────────────── */}
        {step > 0 && step < 4 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 5, fontWeight: 600 }}>
              <span>Step {step} of 3</span>
              <span>{step === 1 ? 'Mood (PHQ-9)' : step === 2 ? 'Anxiety (GAD-7)' : 'Your details'}</span>
            </div>
            <div style={{ background: '#f1ebe1', height: 8, borderRadius: 99, overflow: 'hidden' }}>
              <div style={{
                background: 'linear-gradient(90deg, #7a9a5a, #46552f)',
                height: '100%', width: `${progress}%`,
                transition: 'width 0.3s ease',
                borderRadius: 99,
              }} />
            </div>
          </div>
        )}

        {/* ── INTRO ─────────────────────────────────────────── */}
        {step === 0 && (
          <Card>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: '1.5rem' }}>
              {[
                { icon: '🧘', title: 'Confidential',   desc: 'Your responses are encrypted & private.' },
                { icon: '⏱',  title: '3 minutes',      desc: 'Quick, focused, well-designed questions.' },
                { icon: '🩺', title: 'Clinically valid', desc: 'Same tools used by psychiatrists worldwide.' },
              ].map((f) => (
                <div key={f.title} style={{ background: '#f4eee4', borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.6rem', marginBottom: 6 }}>{f.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', marginBottom: 2 }}>{f.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{f.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--bg-subtle, #f8f9fa)', borderRadius: 10, padding: '12px 14px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', borderLeft: '3px solid #ffc107' }}>
              ⚠ <strong>Important:</strong> This is a self-screening tool, not a diagnosis. If you're in crisis or need immediate help, please call <a href="tel:7777936367" style={{ color: 'var(--brand-700)', fontWeight: 600 }}>7777936367</a> or your nearest emergency service.
            </div>

            <button onClick={() => setStep(1)} className="btn btn-primary btn-lg btn-full">
              Begin screening →
            </button>

            <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.55 }}>
              Learn more about{' '}
              <Link to="/phq-9-depression-screening" style={{ color: 'var(--brand-700)' }}>the PHQ-9</Link>
              {' '}and{' '}
              <Link to="/gad-7-anxiety-screening" style={{ color: 'var(--brand-700)' }}>the GAD-7</Link>
              , or read about{' '}
              <Link to="/online-psychiatrist-for-depression-india" style={{ color: 'var(--brand-700)' }}>online depression care</Link>
              {' '}and{' '}
              <Link to="/anxiety-counselling-online-india" style={{ color: 'var(--brand-700)' }}>online anxiety care</Link>.
            </p>
          </Card>
        )}

        {/* ── More self-checks ──────────────────────────────── */}
        {step === 0 && (
          <div style={{ marginTop: '1.75rem' }}>
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 4 }}>Other quick self-checks</h2>
              <p className="muted" style={{ fontSize: '0.88rem', margin: 0 }}>Free, confidential, and takes 1–2 minutes each.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
              {SCREENING_TOOLS.filter((t) => t.id !== 'phq9' && t.id !== 'gad7').map((t) => (
                <Link key={t.id} to={`/screening/tool/${t.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 14, padding: '1.1rem 1.25rem', height: '100%', transition: 'box-shadow 0.15s, transform 0.15s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: '1.5rem' }} aria-hidden>{t.icon}</span>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--brand-700)' }}>{t.short}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t.name}</div>
                      </div>
                    </div>
                    <p className="muted" style={{ margin: 0, fontSize: '0.83rem', lineHeight: 1.5 }}>{t.blurb}</p>
                    <div style={{ marginTop: 10, fontSize: '0.82rem', fontWeight: 700, color: 'var(--brand-600)' }}>Take the check →</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── PHQ-9 ─────────────────────────────────────────── */}
        {step === 1 && (
          <QuestionnaireCard
            tool="PHQ-9"
            title="Over the last 2 weeks, how often have you been bothered by…"
            questions={PHQ9_QUESTIONS}
            answers={phq}
            setAnswers={setPhq}
            onBack={() => setStep(0)}
            onNext={() => setStep(2)}
            canNext={phqDone}
          />
        )}

        {/* ── GAD-7 ─────────────────────────────────────────── */}
        {step === 2 && (
          <QuestionnaireCard
            tool="GAD-7"
            title="Over the last 2 weeks, how often have you been bothered by…"
            questions={GAD7_QUESTIONS}
            answers={gad}
            setAnswers={setGad}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
            canNext={gadDone}
          />
        )}

        {/* ── CONTACT ───────────────────────────────────────── */}
        {step === 3 && (
          <Card>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 4 }}>One last step</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Share your details so we can send your personalised results and follow up if you'd like to talk to someone.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
              <FieldInput label="Your name" value={name} onChange={setName} placeholder="Full name" required />

              <div>
                <label style={fieldLabelStyle}>Phone (India) *</label>
                <div style={{ display: 'flex', gap: 6, alignItems: 'stretch' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', padding: '0 10px',
                    background: 'var(--bg-subtle, #f4eee4)', border: '1px solid var(--border)',
                    borderRadius: 8, fontWeight: 600, color: 'var(--text-muted)',
                  }}>+91</span>
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
                  <span style={{ fontSize: '0.78rem', color: '#dc3545', marginTop: 3, display: 'block' }}>Enter a valid 10-digit number starting with 6–9.</span>
                )}
              </div>

              <FieldInput label="Email (optional)" value={email} onChange={setEmail} type="email" placeholder="you@example.com" hint="If provided, we’ll email a copy of your screening summary (not a diagnosis)." />

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.88rem', cursor: 'pointer', padding: '8px 0' }}>
                <input
                  type="checkbox"
                  checked={callback}
                  onChange={(e) => setCallback(e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: 'var(--brand-500, #7a9a5a)', flexShrink: 0, marginTop: 2 }}
                />
                <span>I'd like a Serenest professional to <strong>reach out and discuss my results</strong>.</span>
              </label>
            </div>

            {submitError && (
              <div style={{ background: '#fdecea', border: '1px solid #f5c2c0', color: '#a02622', borderRadius: 10, padding: '12px 14px', marginBottom: '1rem', fontSize: '0.88rem' }}>
                ⚠ {submitError}
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
              <button onClick={() => setStep(2)} className="btn btn-ghost" disabled={submitting}>← Back</button>
              <button onClick={handleSubmit} className="btn btn-primary" disabled={!contactOk || submitting}>
                {submitting ? 'Submitting…' : 'See my results →'}
              </button>
            </div>
          </Card>
        )}

        {/* ── RESULTS ───────────────────────────────────────── */}
        {step === 4 && done && (
          <div>
            {hasSafetyFlag && (
              <div style={{
                background: '#fdecea', border: '2px solid #dc3545',
                borderRadius: 14, padding: '1.25rem',
                marginBottom: '1rem',
              }}>
                <div style={{ fontWeight: 800, color: '#a02622', fontSize: '1rem', marginBottom: 6 }}>⚠ Please reach out for support</div>
                <p style={{ color: '#a02622', fontSize: '0.9rem', margin: 0 }}>
                  You indicated thoughts of self-harm. You are not alone — please call <a href="tel:7777936367" style={{ color: '#a02622', fontWeight: 700 }}>7777936367</a> now, or reach out to <a href="tel:9152987821" style={{ color: '#a02622', fontWeight: 700 }}>iCall (9152987821)</a> — a free helpline.
                </p>
              </div>
            )}

            <Card>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #9bb481, #46552f)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2.2rem', color: '#fff',
                  marginBottom: '1rem',
                  boxShadow: '0 8px 24px rgba(70, 85, 47, 0.35)',
                }}>✓</div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>Your results, {name.split(' ')[0]}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                  Based on your responses to PHQ-9 and GAD-7
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginBottom: '1.5rem' }}>
                <ScoreCard
                  title="Depression (PHQ-9)"
                  score={phqScore}
                  max={27}
                  severity={phqSev}
                />
                <ScoreCard
                  title="Anxiety (GAD-7)"
                  score={gadScore}
                  max={21}
                  severity={gadSev}
                />
              </div>

              {/* Recommendation */}
              <div style={{
                background: '#f4eee4', border: '1px solid var(--brand-300, #9bb481)',
                borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.25rem',
              }}>
                <div style={{ fontWeight: 800, marginBottom: 6, color: 'var(--brand-700, #46552f)' }}>💡 Our recommendation</div>
                <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {(() => {
                    const high = Math.max(phqScore, gadScore);
                    if (phqScore >= 15 || gadScore >= 15) return 'Your scores suggest moderately severe to severe symptoms. Speaking with a psychiatrist within the next few days is strongly recommended.';
                    if (phqScore >= 10 || gadScore >= 10) return 'Your scores suggest moderate symptoms. Talking with a psychologist or therapist would likely help. Consider booking within the next 1–2 weeks.';
                    if (high >= 5)                       return 'You\'re in the mild range. Self-care, regular check-ins with a counsellor, and lifestyle work are great places to start.';
                    return 'You\'re in the minimal range — that\'s great. Many people use therapy proactively for growth, not just symptoms.';
                  })()}
                </p>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link to="/book" className="btn btn-primary">Book a session →</Link>
                <Link to="/patient/find-professional" className="btn btn-ghost">Browse professionals</Link>
                <a href={`https://wa.me/917777936367?text=${encodeURIComponent(`Hi, I just took the self-screening (PHQ-9: ${phqScore}, GAD-7: ${gadScore}). I'd like to talk to someone.`)}`} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ background: '#25D366', color: '#fff', borderColor: '#25D366' }}>💬 WhatsApp us</a>
              </div>

              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1.25rem', lineHeight: 1.5 }}>
                These tools are screeners, not a diagnosis. A licensed professional can give you a complete assessment.{' '}
                <Link to="/services">
                  Learn about online psychiatrist consultations in India
                </Link>.
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────
function Card({ children }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      padding: '1.75rem',
      boxShadow: '0 8px 24px rgba(70, 85, 47, 0.08)',
      border: '1px solid var(--border)',
    }}>{children}</div>
  );
}

function QuestionnaireCard({ tool, title, questions, answers, setAnswers, onBack, onNext, canNext }) {
  return (
    <Card>
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'inline-block', background: '#f4eee4', color: 'var(--brand-700, #46552f)', padding: '3px 10px', borderRadius: 99, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.04em', marginBottom: 8 }}>
          {tool}
        </div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.4 }}>{title}</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {questions.map((q, i) => (
          <div key={i} style={{
            background: answers[i] !== null ? '#f4eee4' : 'var(--bg-subtle, #fafafa)',
            border: `1px solid ${answers[i] !== null ? 'var(--brand-300, #9bb481)' : 'var(--border)'}`,
            borderRadius: 12,
            padding: '12px 14px',
            transition: 'all 0.15s',
          }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <span style={{
                background: 'var(--brand-500, #7a9a5a)', color: '#fff',
                width: 22, height: 22, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.72rem', fontWeight: 800, flexShrink: 0,
              }}>{i + 1}</span>
              <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.5, fontWeight: 500 }}>{q}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 6 }}>
              {FREQ_OPTIONS.map((opt) => {
                const selected = answers[i] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      const next = [...answers];
                      next[i] = opt.value;
                      setAnswers(next);
                    }}
                    style={{
                      padding: '7px 8px',
                      borderRadius: 8,
                      border: selected ? '2px solid var(--brand-500, #7a9a5a)' : '1px solid var(--border)',
                      background: selected ? 'var(--brand-500, #7a9a5a)' : '#fff',
                      color: selected ? '#fff' : 'var(--text)',
                      fontSize: '0.8rem',
                      fontWeight: selected ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.12s',
                      lineHeight: 1.2,
                    }}
                  >
                    <div>{opt.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: '1.5rem' }}>
        <button onClick={onBack} className="btn btn-ghost">← Back</button>
        <button onClick={onNext} className="btn btn-primary" disabled={!canNext}>
          {canNext ? 'Continue →' : `Answer all ${questions.length} questions`}
        </button>
      </div>
    </Card>
  );
}

function ScoreCard({ title, score, max, severity }) {
  const pct = (score / max) * 100;
  return (
    <div style={{
      background: '#fff',
      border: `2px solid ${severity.color}`,
      borderRadius: 12,
      padding: '1rem 1.25rem',
    }}>
      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
        <span style={{ fontSize: '2.2rem', fontWeight: 800, color: severity.color, lineHeight: 1 }}>{score}</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/ {max}</span>
      </div>
      <div style={{ background: 'var(--bg-subtle, #f4eee4)', height: 6, borderRadius: 99, overflow: 'hidden', marginBottom: 8 }}>
        <div style={{ background: severity.color, height: '100%', width: `${pct}%`, borderRadius: 99 }} />
      </div>
      <div style={{
        display: 'inline-block',
        background: severity.color + '18', color: severity.color,
        padding: '2px 10px', borderRadius: 99,
        fontSize: '0.78rem', fontWeight: 700,
      }}>{severity.label}</div>
      <p style={{ margin: '8px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>{severity.desc}</p>
    </div>
  );
}

function FieldInput({ label, value, onChange, placeholder, type = 'text', required = false, hint }) {
  return (
    <div>
      <label style={fieldLabelStyle}>{label}{required ? ' *' : ''}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
      {hint ? (
        <p style={{ margin: '6px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>{hint}</p>
      ) : null}
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
