import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { CHECK_CATEGORIES, GUIDED_PATHWAYS, CRISIS_RESOURCES } from '../lib/mentalHealthCenter';
import { toolsForCategory } from '../lib/screeningTools';
import { assistant } from '../lib/api';
import { careWaHref, isIndiaMobile } from '../lib/patientReach';
import CheckCard from '../components/screening/CheckCard';
import MentalHealthSnapshot from '../components/screening/MentalHealthSnapshot';
import '../styles/screening.css';

const SYMPTOM_CHIPS = [
  'Trouble falling or staying asleep',
  'Constant worry or overthinking',
  'Low mood or feeling emotionally numb',
  'Work burnout & mental distance',
  'Difficulty focusing or restlessness',
  'Sudden panic or racing heart',
  'Low energy or daily exhaustion',
  'Relationship or family strain',
];

const LEVEL_OPTIONS = [
  { id: 'steady', label: 'Steady' },
  { id: 'strained', label: 'Strained' },
  { id: 'heavy', label: 'Heavy' },
];

/**
 * Mental Health Center — Care front door with AI Mental Health Analysis + Lead Capture.
 */
export default function ScreeningPage() {
  useSEO({ path: '/screening', ...ROUTE_SEO['/screening'] });
  const [category, setCategory] = useState('all');
  const tools = useMemo(() => toolsForCategory(category), [category]);
  const pathway = GUIDED_PATHWAYS[0];

  // Interactive AI Mental Health Analyzer state
  const [selectedSymptoms, setSelectedSymptoms] = useState([
    'Trouble falling or staying asleep',
    'Constant worry or overthinking',
  ]);
  const [sleepState, setSleepState] = useState('strained');
  const [energyState, setEnergyState] = useState('strained');
  const [stressState, setStressState] = useState('heavy');
  const [freeNote, setFreeNote] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [analysisError, setAnalysisError] = useState('');

  // Lead capture inside AI Analysis
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadError, setLeadError] = useState('');
  const [capturedBooking, setCapturedBooking] = useState(null);

  function toggleSymptom(sym) {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym],
    );
  }

  async function handleRunAiAnalysis() {
    setAnalysisError('');
    setLeadError('');
    setCapturedBooking(null);
    setAnalyzing(true);
    try {
      const res = await assistant.analyze({
        symptoms: selectedSymptoms,
        sleepState,
        energyState,
        stressState,
        concern: freeNote.trim(),
      });
      if (res?.analysis) {
        setAnalysis(res.analysis);
      }
    } catch (err) {
      setAnalysisError(err?.message || 'Could not run AI analysis right now. Please try one of the checks below.');
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleSaveAnalysisLead(e) {
    e.preventDefault();
    setLeadError('');
    if (!leadName.trim() || leadName.trim().length < 2) {
      setLeadError('Please enter your name.');
      return;
    }
    if (!isIndiaMobile(leadPhone)) {
      setLeadError('Please enter a valid 10-digit Indian mobile number (starts with 6–9).');
      return;
    }
    setLeadSubmitting(true);
    try {
      const spec = analysis?.recommended_specialist;
      const res = await assistant.acquire({
        patient_name: leadName.trim(),
        patient_phone: leadPhone,
        concern: [
          ...selectedSymptoms,
          `Sleep: ${sleepState}, Energy: ${energyState}, Stress: ${stressState}`,
          freeNote.trim(),
        ]
          .filter(Boolean)
          .join(' · '),
        practitioner_type: spec?.type || 'psychiatrist',
        mode: spec?.mode || 'video',
        notes: analysis?.clinician_brief || '',
        screening_meta: {
          reason: 'ai-symptom-analysis',
          band_label: analysis?.headline || 'AI Symptom Analysis',
          conditions: selectedSymptoms,
        },
      });
      if (res?.booking) {
        setCapturedBooking(res.booking);
      }
    } catch (err) {
      setLeadError(err?.message || 'Could not register your request. Please try again.');
    } finally {
      setLeadSubmitting(false);
    }
  }

  return (
    <div className="mhc">
      <div className="mhc-wrap">
        <header className="mhc-hero">
          <p className="mhc-eyebrow">AI-Enabled Mental Health Analysis · Not a diagnosis</p>
          <h1>Understand how you’ve been feeling</h1>
          <p className="mhc-hero-lead">
            Run an instant AI pattern analysis across your sleep, energy, and stress — or take a validated clinical scale (PHQ-9, GAD-7, BAT-12). Get a clear action plan and connect with the right specialist in one step.
          </p>

          <Link to={pathway.href} className="mhc-pathway mhc-pathway-hero">
            <h2>{pathway.title}</h2>
            <p>{pathway.blurb}</p>
            <span className="mhc-card-cta">Start here · {pathway.minutes} →</span>
          </Link>

          <p className="mhc-disclaimer">
            <strong>Private by default · not a diagnosis.</strong> Checks run in your browser. Contact details are
            optional and only used when you ask our care team to reach out. If you are in immediate danger, call{' '}
            <a href={CRISIS_RESOURCES.emergency.href}>{CRISIS_RESOURCES.emergency.number}</a>
            {' '}or see our{' '}
            <Link to={CRISIS_RESOURCES.emergencyPage}>emergency guidance</Link>.
          </p>
        </header>

        {/* ── Interactive AI Mental Health & Symptom Analyzer ──────── */}
        <section className="mhc-section" aria-labelledby="ai-analyzer-title">
          <div className="ai-triage-card">
            <div className="ai-triage-head">
              <div className="ai-triage-head__copy">
                <span className="ai-triage-eyebrow">
                  <span className="ai-triage-spark" aria-hidden="true">✦</span>
                  Serenest Care AI · Interactive Mental Health Analyzer
                </span>
                <h2 id="ai-analyzer-title" className="ai-triage-title">
                  Get a personalized AI mental health analysis in 30 seconds
                </h2>
                <p className="ai-triage-sub">
                  Select what you have been noticing over the past 2 weeks. Our clinical engine maps your key drivers, builds a 3-step action plan, and matches the right specialist for a callback.
                </p>
              </div>
            </div>

            <div className="ai-triage-body">
              <div>
                <div className="ai-analysis-box__label" style={{ marginBottom: 8 }}>
                  1. What have you been experiencing recently? (select all that apply)
                </div>
                <div className="ai-triage-prompts" role="group" aria-label="Symptom signals">
                  {SYMPTOM_CHIPS.map((sym) => {
                    const active = selectedSymptoms.includes(sym);
                    return (
                      <button
                        key={sym}
                        type="button"
                        className={`ai-prompt-chip ${active ? 'is-active' : ''}`}
                        aria-pressed={active}
                        onClick={() => toggleSymptom(sym)}
                      >
                        {active ? `✓ ${sym}` : sym}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="ai-dimension-toggles">
                <div className="ai-dim-group">
                  <span className="ai-dim-label">Sleep rhythm</span>
                  <div className="ai-dim-pills" role="group" aria-label="Sleep rhythm">
                    {LEVEL_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        className={`ai-dim-pill ${sleepState === opt.id ? 'is-active' : ''}`}
                        onClick={() => setSleepState(opt.id)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="ai-dim-group">
                  <span className="ai-dim-label">Daily energy</span>
                  <div className="ai-dim-pills" role="group" aria-label="Daily energy">
                    {LEVEL_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        className={`ai-dim-pill ${energyState === opt.id ? 'is-active' : ''}`}
                        onClick={() => setEnergyState(opt.id)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="ai-dim-group">
                  <span className="ai-dim-label">Stress / worry load</span>
                  <div className="ai-dim-pills" role="group" aria-label="Stress or worry load">
                    {LEVEL_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        className={`ai-dim-pill ${stressState === opt.id ? 'is-active' : ''}`}
                        onClick={() => setStressState(opt.id)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="ai-triage-bar">
                <input
                  type="text"
                  className="input ai-home-input"
                  value={freeNote}
                  onChange={(e) => setFreeNote(e.target.value)}
                  placeholder="Optional: anything else on your mind? (e.g. wondering about medication, exam/work pressure…)"
                />
                <button
                  type="button"
                  className="btn btn-primary ai-match-btn"
                  disabled={analyzing || (selectedSymptoms.length === 0 && !freeNote.trim())}
                  onClick={handleRunAiAnalysis}
                >
                  {analyzing ? 'Analyzing pattern…' : '✦ Run AI Mental Health Analysis'}
                </button>
              </div>

              {analysisError && <p className="ai-triage-error" role="alert">{analysisError}</p>}

              {analysis && (
                <div className="ai-triage-result" role="region" aria-label="AI mental health analysis report">
                  {analysis.crisis && analysis.crisis_notice && (
                    <div className="ai-crisis-banner" role="alert">
                      <strong>Immediate support first:</strong> {analysis.crisis_notice}
                    </div>
                  )}

                  <div className="ai-triage-result__top">
                    <div>
                      <div className="ai-triage-badges">
                        <span className="ai-badge ai-badge--primary">
                          ✦ {analysis.headline}
                        </span>
                        <span className="ai-badge">
                          Matched: {analysis.recommended_specialist?.label} ({analysis.recommended_specialist?.badge})
                        </span>
                      </div>
                      <p className="ai-triage-rationale">{analysis.pattern_reading}</p>
                    </div>
                    {analysis.suggested_check && (
                      <Link className="btn btn-ghost" to={analysis.suggested_check.path}>
                        Take {analysis.suggested_check.label} →
                      </Link>
                    )}
                  </div>

                  <div className="ai-analysis-cols">
                    <div className="ai-analysis-box">
                      <div className="ai-analysis-box__label">Key drivers identified</div>
                      <ul className="ai-analysis-list">
                        {analysis.key_drivers?.map((d, idx) => (
                          <li key={idx}>{d}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="ai-analysis-box">
                      <div className="ai-analysis-box__label">Recommended 3-step action plan</div>
                      <ol className="ai-analysis-list">
                        {analysis.action_plan?.map((stepText, idx) => (
                          <li key={idx}>{stepText}</li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {capturedBooking ? (
                    <div className="srn-ai-capture srn-ai-capture--done" role="status">
                      <div className="srn-ai-capture__badge">
                        ✓ AI Analysis Saved &amp; Callback Registered · Ref {String(capturedBooking.id || '').slice(0, 8).toUpperCase()}
                      </div>
                      <p className="srn-ai-capture__copy">
                        Thank you, <strong>{capturedBooking.patient_name}</strong>. We have attached your AI analysis report and registered your callback request for a <strong>{analysis.recommended_specialist?.label}</strong> on <strong>+91 {capturedBooking.patient_phone}</strong>. You do not pay until your slot is confirmed.
                      </p>
                      <a
                        className="btn btn-primary"
                        href={careWaHref(`Hi, I completed my AI Mental Health Analysis on Serenest (Ref: ${String(capturedBooking.id || '').slice(0, 8).toUpperCase()})`)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Confirm on WhatsApp →
                      </a>
                    </div>
                  ) : (
                    <form className="ai-fast-acquire" onSubmit={handleSaveAnalysisLead}>
                      <div className="ai-fast-acquire__head">
                        <strong>
                          ✦ Save this AI analysis &amp; book your {analysis.recommended_specialist?.label} callback
                        </strong>
                        <span>
                          Next slot: {analysis.next_slot?.label || 'Today / Tomorrow'} · ₹{analysis.recommended_specialist?.starting_fee_inr || 499} only after confirmation
                        </span>
                      </div>
                      <div className="ai-fast-acquire__row">
                        <input
                          type="text"
                          className="input"
                          placeholder="Your full name"
                          value={leadName}
                          onChange={(e) => setLeadName(e.target.value)}
                          autoComplete="name"
                        />
                        <input
                          type="tel"
                          className="input"
                          placeholder="10-digit mobile (+91)"
                          inputMode="numeric"
                          maxLength={10}
                          value={leadPhone}
                          onChange={(e) => setLeadPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          autoComplete="tel-national"
                        />
                        <button type="submit" className="btn btn-primary" disabled={leadSubmitting}>
                          {leadSubmitting
                            ? 'Saving…'
                            : `Save analysis & request ${analysis.recommended_specialist?.label} callback →`}
                        </button>
                      </div>
                      {leadError && <p className="ai-triage-error" role="alert">{leadError}</p>}
                    </form>
                  )}

                  <p className="ai-triage-disclaimer">{analysis.disclaimer}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mhc-section" aria-labelledby="snap-title">
          <div className="mhc-section-head">
            <h2 id="snap-title">Your mental health snapshot</h2>
            <p>
              Explore one dimension at a time. Session results stay on this device unless you later choose to share
              them.
            </p>
          </div>
          <MentalHealthSnapshot />
        </section>

        <section className="mhc-section" aria-labelledby="browse-title">
          <div className="mhc-section-head">
            <h2 id="browse-title">Or choose a specific check</h2>
            <p>Each uses a validated scale. Pick what matches what you’re wondering about.</p>
          </div>

          <ul className="mhc-cats" aria-label="Filter by concern">
            {CHECK_CATEGORIES.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className={`mhc-cat${category === c.id ? ' is-active' : ''}`}
                  aria-pressed={category === c.id}
                  onClick={() => setCategory(c.id)}
                >
                  {c.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="mhc-grid">
            {tools.map((t) => (
              <CheckCard key={t.id} tool={t} />
            ))}
          </div>
        </section>

        <section className="mhc-section" aria-labelledby="how-title">
          <div className="mhc-section-head">
            <h2 id="how-title">What you’ll leave with</h2>
            <p>Every check is designed to answer four questions — never to push you into booking.</p>
          </div>
          <ul className="mhc-four" aria-label="What this center helps you answer">
            <li>
              <strong>What am I experiencing?</strong>
              <span>Name patterns in mood, worry, stress, and more</span>
            </li>
            <li>
              <strong>Why might this be happening?</strong>
              <span>Calm context — not labels that define you</span>
            </li>
            <li>
              <strong>What can I do next?</strong>
              <span>Self-care, learning, and clear options</span>
            </li>
            <li>
              <strong>Where can I get help?</strong>
              <span>Crisis resources or verified clinicians when needed</span>
            </li>
          </ul>
        </section>

        <section className="mhc-section" aria-labelledby="eco-title">
          <div className="mhc-section-head">
            <h2 id="eco-title">What to do next</h2>
            <p>Understanding connects to guides and care — nothing here is meant to stand alone.</p>
          </div>
          <div className="mhc-grid">
            <Link to="/evidence" className="mhc-card">
              <h3 className="mhc-card-title">Evidence Center</h3>
              <p className="mhc-card-blurb">Instruments, validation papers, licensing, and limitations for every launched check.</p>
              <span className="mhc-card-cta">Open evidence →</span>
            </Link>
            <Link to="/guides" className="mhc-card">
              <h3 className="mhc-card-title">Guides</h3>
              <p className="mhc-card-blurb">Plain-language guides on mood, anxiety, sleep, and seeking help.</p>
              <span className="mhc-card-cta">Browse guides →</span>
            </Link>
            <Link to="/book" className="mhc-card">
              <h3 className="mhc-card-title">Professional care</h3>
              <p className="mhc-card-blurb">Verified psychiatrists and psychologists when you want guided help.</p>
              <span className="mhc-card-cta">Request an appointment →</span>
            </Link>
            <div className="mhc-card mhc-card-muted">
              <h3 className="mhc-card-title">Community &amp; Research</h3>
              <p className="mhc-card-blurb">Peer support and research participation — coming as Serenest grows.</p>
              <span className="mhc-card-cta">Planned</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
