import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { careTier, maxScore, getAllTools } from '../../lib/screeningTools';
import { getCheckEvidence, getLandingPathForTool } from '../../lib/checkEvidence';
import { assistant } from '../../lib/api';
import { careWaHref, isIndiaMobile } from '../../lib/patientReach';
import ScribaInsight from './ScribaInsight';
import CheckPrivacyPanel from './CheckPrivacyPanel';
import CheckEvidencePanel from './CheckEvidencePanel';
import DpdpConsentNotice from '../DpdpConsentNotice';
import { buildScribaInsight } from '../../lib/mentalHealthCenter';

function BandScale({ tool, value, max, band }) {
  if (!tool.bands || tool.bands.length < 2) {
    const pct = Math.round((value / max) * 100);
    return (
      <div style={{ height: 8, background: 'rgba(148,166,132,0.25)', borderRadius: 99, overflow: 'hidden', margin: '12px auto', maxWidth: 340 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: band.color, borderRadius: 99 }} />
      </div>
    );
  }
  const markerPct = Math.min(100, Math.max(0, (value / max) * 100));
  let prev = 0;
  const segments = tool.bands.map((b) => {
    const width = ((b.max - prev) / max) * 100;
    prev = b.max;
    return { ...b, width };
  });
  return (
    <div style={{ margin: '16px auto 4px', maxWidth: 360 }}>
      <div style={{ position: 'relative', paddingTop: 10 }}>
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            left: `${markerPct}%`,
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: `8px solid ${band.color}`,
          }}
        />
        <div style={{ display: 'flex', height: 10, borderRadius: 99, overflow: 'hidden' }} role="img" aria-label={`Score ${value} of ${max}, ${band.label}`}>
          {segments.map((s) => (
            <div key={s.label} title={s.label} style={{ width: `${s.width}%`, background: s.color, opacity: s.label === band.label ? 1 : 0.32 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Education-first result + AI Pattern Analysis & Instant Lead/Callback Capture.
 */
export default function ScreeningResultPanel({
  tool,
  result,
  answers = [],
  crisisFlag,
  crisisAcknowledged,
  onRetake,
  hideCareUntilReady = false,
  includeCareOptions = true,
}) {
  const { band } = result;
  const isCount = tool.scoring === 'threshold_count';
  const max = isCount ? tool.questions.length : maxScore(tool);
  const value = isCount ? result.count : result.score;
  const tier = careTier(tool, result);
  const careText = tool.careGuidance?.[tier] || band.desc;
  const insight = buildScribaInsight(tool, { ...result, crisisFlag });
  const showCare = includeCareOptions && (!hideCareUntilReady || !crisisFlag || crisisAcknowledged);
  const showSelfCare = tier !== 'high' && !crisisFlag && tool.selfCare?.length;
  const evidence = getCheckEvidence(tool.id);
  const differential = evidence?.differentialDiagnosis || tool.differentialNote;
  const relatedChecks = getAllTools()
    .filter((t) => t.id !== tool.id)
    .slice(0, 4);

  // Extract highest-rated question texts for AI pattern analysis
  const highItems = useMemo(() => {
    if (!Array.isArray(answers) || !tool?.questions?.length) return [];
    const pairs = tool.questions
      .map((q, idx) => ({ text: q.text, val: Number(answers[idx] ?? 0) }))
      .filter((p) => Number.isFinite(p.val) && p.val >= 2)
      .sort((a, b) => b.val - a.val);
    return pairs.slice(0, 3).map((p) => p.text);
  }, [answers, tool]);

  // Live AI Analysis state
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Inline Lead + Callback Capture state
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadError, setLeadError] = useState('');
  const [capturedBooking, setCapturedBooking] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setAiLoading(true);
    assistant
      .analyze({
        toolId: tool.id,
        toolName: tool.name,
        humanTitle: tool.humanTitle,
        score: isCount ? result.count : (tool.scoring === 'mean' ? Number(value).toFixed(2) : value),
        maxScore: tool.scoring === 'mean' ? Number(max).toFixed(1) : max,
        bandLabel: band.label,
        bandDesc: band.desc,
        highItems,
        crisisFlag: Boolean(crisisFlag),
      })
      .then((res) => {
        if (!cancelled && res?.analysis) {
          setAiAnalysis(res.analysis);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setAiLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tool.id, tool.name, tool.humanTitle, tool.scoring, isCount, result.count, value, max, band.label, band.desc, highItems, crisisFlag]);

  async function handleCaptureAnalysisLead(e) {
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
      const specialist = aiAnalysis?.recommended_specialist;
      const res = await assistant.acquire({
        patient_name: leadName.trim(),
        patient_phone: leadPhone,
        patient_email: leadEmail.trim() || undefined,
        concern: `${tool.name} (${band.label}): ${highItems.join('; ') || band.desc}`,
        practitioner_type: specialist?.type || 'psychiatrist',
        mode: specialist?.mode || 'video',
        notes:
          aiAnalysis?.clinician_brief
          || `[Screening Result · ${tool.name}: ${value}/${max} (${band.label})]\n${band.desc}`,
        screening_meta: {
          reason: `screening-${tool.id}`,
          band_label: band.label,
          conditions: [tool.name, band.label],
          ...(tool.id === 'phq9'
            ? { phq9_answers: answers, phq9_score: value, phq9_severity: band.label }
            : {}),
          ...(tool.id === 'gad7'
            ? { gad7_answers: answers, gad7_score: value, gad7_severity: band.label }
            : {}),
        },
      });
      if (res?.booking) {
        setCapturedBooking(res.booking);
      }
    } catch (err) {
      setLeadError(err?.message || 'Could not save your request right now. Please try again.');
    } finally {
      setLeadSubmitting(false);
    }
  }

  const deepBookHref = aiAnalysis?.book_path
    || `/book?tool=${encodeURIComponent(tool.name)}&score=${encodeURIComponent(String(value))}&band=${encodeURIComponent(band.label)}`;

  return (
    <div>
      <div className="mhc-result-score" style={{ '--band': band.color }}>
        <p className="mhc-eyebrow" style={{ marginBottom: 6 }}>Your result · not a diagnosis</p>
        {!isCount ? (
          <>
            <div className="mhc-score-num">
              {tool.scoring === 'mean' ? Number(value).toFixed(2) : value}
              <span style={{ fontSize: '1.1rem', color: 'var(--muted)', fontWeight: 600 }}>
                {' '}
                / {tool.scoring === 'mean' ? Number(max).toFixed(1) : max}
              </span>
            </div>
            <BandScale tool={tool} value={value} max={max} band={band} />
          </>
        ) : (
          <div className="mhc-score-num" style={{ fontSize: '1.35rem' }}>
            {result.count} of {tool.questions.length} key items
          </div>
        )}
        <div className="mhc-band-pill">{band.label}</div>
        <p style={{ margin: '12px auto 0', maxWidth: 440, fontSize: '0.92rem', lineHeight: 1.55, color: 'var(--muted)' }}>
          {band.desc}
        </p>
      </div>

      {/* ── AI Pattern Analysis & Instant Lead Capture Card ───────── */}
      <section className="ai-triage-card" style={{ marginTop: '1.25rem' }} aria-labelledby="ai-result-analysis-title">
        <div className="ai-triage-head">
          <div className="ai-triage-head__copy">
            <span className="ai-triage-eyebrow">
              <span className="ai-triage-spark" aria-hidden="true">✦</span>
              Serenest Care AI · Personalized Pattern Analysis
            </span>
            <h2 id="ai-result-analysis-title" className="ai-triage-title">
              {aiAnalysis?.headline || `${tool.name} Pattern Reading: ${band.label}`}
            </h2>
            <p className="ai-triage-sub">
              {aiLoading
                ? 'Analyzing your response pattern…'
                : (aiAnalysis?.pattern_reading || insight?.body)}
            </p>
          </div>
        </div>

        <div className="ai-triage-body">
          {aiAnalysis?.key_drivers?.length > 0 && (
            <div className="ai-analysis-cols">
              <div className="ai-analysis-box">
                <div className="ai-analysis-box__label">Key drivers in your responses</div>
                <ul className="ai-analysis-list">
                  {aiAnalysis.key_drivers.map((d, idx) => (
                    <li key={idx}>{d}</li>
                  ))}
                </ul>
              </div>
              <div className="ai-analysis-box">
                <div className="ai-analysis-box__label">Recommended 3-step action plan</div>
                <ol className="ai-analysis-list">
                  {aiAnalysis.action_plan.map((stepText, idx) => (
                    <li key={idx}>{stepText}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {showCare && (
            <div className="ai-triage-result">
              <div className="ai-triage-result__top">
                <div>
                  <div className="ai-triage-badges">
                    <span className="ai-badge ai-badge--primary">
                      ✦ Matched Specialist: {aiAnalysis?.recommended_specialist?.label || 'Psychiatrist'}
                    </span>
                    <span className="ai-badge">
                      {aiAnalysis?.recommended_specialist?.badge || 'Clinical evaluation'}
                    </span>
                    <span className="ai-badge">
                      Starts at ₹{aiAnalysis?.recommended_specialist?.starting_fee_inr || 499} (pay after confirmation)
                    </span>
                  </div>
                  <p className="ai-triage-rationale">
                    {aiAnalysis?.recommended_specialist?.rationale || careText}
                  </p>
                </div>
                <Link className="btn btn-ghost" to={deepBookHref}>
                  Customize slot →
                </Link>
              </div>

              {capturedBooking ? (
                <div className="srn-ai-capture srn-ai-capture--done" role="status">
                  <div className="srn-ai-capture__badge">
                    ✓ Analysis Saved &amp; Callback Registered · Ref {String(capturedBooking.id || '').slice(0, 8).toUpperCase()}
                  </div>
                  <p className="srn-ai-capture__copy">
                    Thank you, <strong>{capturedBooking.patient_name}</strong>. Your {tool.name} analysis has been attached to your intake brief, and our care team will reach out on <strong>+91 {capturedBooking.patient_phone}</strong> to confirm your <strong>{aiAnalysis?.recommended_specialist?.label || 'clinician'}</strong> session.
                  </p>
                  <a
                    className="btn btn-primary"
                    href={careWaHref(`Hi, I completed the ${tool.name} analysis on Serenest (Ref: ${String(capturedBooking.id || '').slice(0, 8).toUpperCase()})`)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Confirm on WhatsApp →
                  </a>
                </div>
              ) : (
                <form className="ai-fast-acquire" onSubmit={handleCaptureAnalysisLead}>
                  <div className="ai-fast-acquire__head">
                    <strong>✦ Save this AI analysis &amp; get a clinician callback</strong>
                    <span>We send your {tool.name} brief to your clinician · Pay ₹499 only after confirmation</span>
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
                        : `Send analysis & request ${aiAnalysis?.recommended_specialist?.label || 'clinician'} callback →`}
                    </button>
                  </div>
                  <DpdpConsentNotice compact />
                  {leadError && <p className="ai-triage-error" role="alert">{leadError}</p>}
                </form>
              )}
            </div>
          )}
        </div>
      </section>

      <ScribaInsight insight={insight} />

      <section className="mhc-edu" aria-labelledby="suggests-title">
        <h2 id="suggests-title">What this suggests</h2>
        <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--muted)' }}>
          {tool.whatItChecks} Your responses fall in the “{band.label}” range for this validated check ({tool.name}).
        </p>
      </section>

      <section className="mhc-edu" aria-labelledby="not-mean-title">
        <h2 id="not-mean-title">What this does not mean</h2>
        <ul>
          {(tool.whatItDoesNotMean || ['A medical diagnosis', 'A replacement for clinical judgment']).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {tool.commonSigns?.length ? (
        <section className="mhc-edu" aria-labelledby="signs-title">
          <h2 id="signs-title">Experiences people often notice</h2>
          <ul>
            {tool.commonSigns.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {differential ? (
        <section className="mhc-edu" aria-labelledby="diff-title">
          <h2 id="diff-title">What else might be going on</h2>
          <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--muted)' }}>{differential}</p>
        </section>
      ) : null}

      {showSelfCare ? (
        <section className="mhc-edu" aria-labelledby="care-title">
          <h2 id="care-title">Practical steps you can try</h2>
          <ul>
            {tool.selfCare.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {tool.learnLinks?.length ? (
        <section className="mhc-edu" aria-labelledby="learn-title">
          <h2 id="learn-title">Learn more on Serenest</h2>
          <ul>
            {tool.learnLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {relatedChecks.length ? (
        <section className="mhc-edu" aria-labelledby="related-checks-title">
          <h2 id="related-checks-title">Related Mental Health Checks</h2>
          <ul>
            {relatedChecks.map((t) => (
              <li key={t.id}>
                <Link to={getLandingPathForTool(t.id) || `/screening/tool/${t.slug}`}>{t.humanTitle}</Link>
                <span style={{ color: 'var(--muted)' }}> · {t.name}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mhc-edu" aria-labelledby="when-help-title">
        <h2 id="when-help-title">When professional help is worth considering</h2>
        <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--muted)' }}>{careText}</p>
      </section>

      <CheckEvidencePanel toolId={tool.id} />
      <CheckPrivacyPanel toolId={tool.id} />

      {showCare ? (
        <section className="mhc-care" aria-labelledby="next-care-title">
          <h2 id="next-care-title">If you want guided help</h2>
          <p>
            Talk with a clinician — when you are ready. Understanding yourself comes first.
          </p>
          <div className="mhc-care-actions">
            <Link className="btn btn-primary" to={deepBookHref}>
              Book with this AI analysis →
            </Link>
            <Link className="btn btn-ghost" to="/patient/find-professional">
              Find a professional
            </Link>
            <button type="button" className="btn btn-ghost" onClick={onRetake}>
              Retake this check
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
