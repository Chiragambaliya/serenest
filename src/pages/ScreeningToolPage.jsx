import React, { useMemo, useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { getTool, getAllTools, scoreTool } from '../lib/screeningTools';
import { saveSnapshotDimension, CRISIS_RESOURCES } from '../lib/mentalHealthCenter';
import { getCheckEvidence, getLandingPathForTool } from '../lib/checkEvidence';
import { loadCheckDraft, saveCheckDraft, clearCheckDraft } from '../lib/checkSession';
import CrisisSafetyPanel from '../components/screening/CrisisSafetyPanel';
import ScreeningResultPanel from '../components/screening/ScreeningResultPanel';
import CheckPrivacyPanel from '../components/screening/CheckPrivacyPanel';
import '../styles/screening.css';

export default function ScreeningToolPage() {
  const { toolId } = useParams();
  const tool = getTool(toolId);
  const evidence = tool ? getCheckEvidence(tool.id) : null;
  const landingPath = tool ? getLandingPathForTool(tool.id) : null;

  const seoEntry = tool ? ROUTE_SEO[`/screening/tool/${tool.slug}`] : null;
  useSEO({
    path: tool ? `/screening/tool/${tool.slug}` : `/screening/tool/${toolId}`,
    title: seoEntry?.title ?? (tool ? `${tool.humanTitle} (${tool.name}) | Serenest` : 'Mental health check | Serenest'),
    description:
      seoEntry?.description ??
      (tool
        ? `${tool.whatItChecks} About ${tool.minutes} minutes. A screening aid — not a diagnosis.`
        : undefined),
    noindex: !seoEntry && tool?.id !== 'phq9' && tool?.id !== 'gad7',
  });

  const [answers, setAnswers] = useState(() => {
    if (!tool) return [];
    const draft = loadCheckDraft(tool.id);
    if (draft?.answers?.length === tool.questions.length) return draft.answers;
    return Array(tool.questions.length).fill(undefined);
  });
  const [submitted, setSubmitted] = useState(() => {
    if (!tool) return false;
    const draft = loadCheckDraft(tool.id);
    return Boolean(draft?.submitted && draft?.answers?.length === tool.questions.length);
  });
  const [crisisAck, setCrisisAck] = useState(false);
  const [liveCrisis, setLiveCrisis] = useState(false);

  useEffect(() => {
    if (!tool) return;
    const draft = loadCheckDraft(tool.id);
    if (draft?.answers?.length === tool.questions.length) {
      setAnswers(draft.answers);
      setSubmitted(Boolean(draft.submitted));
    } else {
      setAnswers(Array(tool.questions.length).fill(undefined));
      setSubmitted(false);
    }
    setCrisisAck(false);
    setLiveCrisis(false);
  }, [tool?.id]);

  useEffect(() => {
    if (!tool) return;
    saveCheckDraft(tool.id, { answers, submitted });
  }, [tool?.id, answers, submitted]);

  const result = useMemo(() => (tool ? scoreTool(tool, answers) : null), [tool, answers]);

  if (!tool) {
    return (
      <div className="mhc">
        <div className="mhc-wrap" style={{ textAlign: 'center' }}>
          <h1>Check not found</h1>
          <p className="mhc-hero-lead" style={{ margin: '0 auto 1.25rem' }}>
            That mental health check doesn’t exist or has moved.
          </p>
          <Link to="/screening" className="btn btn-primary">
            Back to Mental Health Center
          </Link>
        </div>
      </div>
    );
  }

  const answered = answers.filter((a) => a !== undefined && a !== null).length;
  const total = tool.questions.length;
  const canSubmit = result?.complete;
  const crisisFlag =
    tool.crisisItem !== undefined && (answers[tool.crisisItem] ?? 0) >= 1;

  function pick(qi, value) {
    setAnswers((prev) => {
      const next = [...prev];
      next[qi] = value;
      if (tool.crisisItem === qi && value >= 1) {
        setLiveCrisis(true);
      }
      if (typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const nextIdx = next.findIndex((a, j) => j > qi && (a === undefined || a === null));
        if (nextIdx !== -1) {
          requestAnimationFrame(() => {
            document.querySelector(`[data-q="${nextIdx}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          });
        }
      }
      return next;
    });
  }

  function finish() {
    setSubmitted(true);
    if (tool.dimensionId) {
      saveSnapshotDimension(tool.dimensionId, {
        toolId: tool.id,
        bandLabel: result?.band?.label,
        score: result?.score ?? result?.count,
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function retake() {
    clearCheckDraft(tool.id);
    setAnswers(Array(tool.questions.length).fill(undefined));
    setSubmitted(false);
    setCrisisAck(false);
    setLiveCrisis(false);
  }

  const others = getAllTools().filter((t) => t.id !== tool.id).slice(0, 6);

  return (
    <div className="mhc">
      <div className="mhc-wrap">
        <div className="mhc-tool-head">
          <Link to="/screening" className="mhc-back">
            ← Mental Health Center
          </Link>
          <p className="mhc-eyebrow">{tool.name} · validated check</p>
          <h1 style={{ fontSize: 'clamp(1.45rem, 3vw, 1.85rem)', margin: '0 0 0.5rem' }}>{tool.humanTitle}</h1>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.5, maxWidth: '42ch' }}>
            {tool.whatItChecks}
          </p>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.82rem', color: 'var(--muted)' }}>
            ~{tool.minutes} min · {total} questions · {tool.audience}
          </p>
          {(landingPath || evidence) && (
            <p style={{ margin: '0.65rem 0 0', fontSize: '0.82rem' }}>
              {landingPath ? (
                <>
                  <Link to={landingPath}>About this check</Link>
                  {' · '}
                </>
              ) : null}
              {evidence ? <Link to={`/evidence/${evidence.evidenceSlug}`}>Evidence</Link> : null}
            </p>
          )}
        </div>

        {liveCrisis && !submitted ? (
          <CrisisSafetyPanel
            onAcknowledge={() => setLiveCrisis(false)}
            acknowledgeLabel="I understand — continue answering"
          />
        ) : null}

        {!submitted ? (
          <>
            <div className="mhc-disclaimer" style={{ marginTop: 0, marginBottom: '1rem' }}>
              <strong>Not a diagnosis.</strong> {tool.timeframe}
              {tool.note ? ` ${tool.note}` : ''} Progress is saved in this browser session only.
            </div>

            <CheckPrivacyPanel toolId={tool.id} />

            <div className="mhc-progress" aria-hidden={false}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--muted)',
                  marginBottom: 4,
                }}
              >
                <span>
                  {answered} of {total} answered
                </span>
                <span>{Math.round((answered / total) * 100)}%</span>
              </div>
              <div
                className="mhc-progress-bar"
                role="progressbar"
                aria-valuenow={answered}
                aria-valuemin={0}
                aria-valuemax={total}
                aria-label="Progress"
              >
                <div className="mhc-progress-fill" style={{ width: `${(answered / total) * 100}%` }} />
              </div>
            </div>

            <div role="list">
              {tool.questions.map((q, i) => {
                const opts = q.options || tool.options;
                const done = answers[i] !== undefined && answers[i] !== null;
                return (
                  <div key={i} data-q={i} className={`mhc-q${done ? ' is-done' : ''}`} role="listitem">
                    <div className="mhc-q-text">
                      <span className="mhc-q-num" aria-hidden>
                        {i + 1}
                      </span>
                      <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.5, fontWeight: 500 }}>{q.text}</p>
                    </div>
                    <div className="mhc-opts" role="group" aria-label={`Question ${i + 1}`}>
                      {opts.map((opt) => {
                        const selected = answers[i] === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            className="mhc-opt"
                            aria-pressed={selected}
                            onClick={() => pick(i, opt.value)}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mhc-sticky-cta">
              <button type="button" className="btn btn-primary btn-full" disabled={!canSubmit} onClick={finish}>
                {canSubmit ? 'See my result & guidance' : `Answer all questions (${answered}/${total})`}
              </button>
            </div>
          </>
        ) : (
          <>
            {crisisFlag && !crisisAck ? (
              <CrisisSafetyPanel onAcknowledge={() => setCrisisAck(true)} />
            ) : null}

            {(!crisisFlag || crisisAck) && (
              <ScreeningResultPanel
                tool={tool}
                result={result}
                crisisFlag={crisisFlag}
                crisisAcknowledged={crisisAck}
                hideCareUntilReady={crisisFlag}
                onRetake={retake}
              />
            )}
          </>
        )}

        <p
          style={{
            fontSize: '0.78rem',
            textAlign: 'center',
            marginTop: '2rem',
            color: 'var(--muted)',
            lineHeight: 1.5,
          }}
        >
          In a crisis, call <strong>{CRISIS_RESOURCES.emergency.number}</strong> or{' '}
          <Link to={CRISIS_RESOURCES.emergencyPage}>see emergency guidance</Link>. Results are screening aids — not
          diagnoses.
        </p>

        {submitted && (!crisisFlag || crisisAck) ? (
          <div style={{ marginTop: '1.5rem' }}>
            <p className="mhc-eyebrow">Other checks</p>
            <div className="mhc-grid">
              {others.map((t) => {
                const href = getLandingPathForTool(t.id) || `/screening/tool/${t.slug}`;
                return (
                  <Link key={t.id} to={href} className="mhc-card" style={{ minHeight: 0 }}>
                    <h3 className="mhc-card-title" style={{ fontSize: '0.95rem' }}>
                      {t.humanTitle}
                    </h3>
                    <p className="mhc-card-scale">{t.name}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
