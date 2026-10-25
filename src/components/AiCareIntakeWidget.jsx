import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { assistant } from '../lib/api';
import { careWaHref, isIndiaMobile } from '../lib/patientReach';
import DpdpConsentNotice from './DpdpConsentNotice';

const DEFAULT_PROMPTS = [
  {
    label: 'Sleep trouble or medication check',
    text: 'I have been having trouble sleeping for the past few weeks with racing thoughts, and I want to know if medication or therapy would help.',
  },
  {
    label: 'Work burnout & exhaustion',
    text: 'I feel completely drained, detached from my work, and overwhelmed by daily tasks. I need a structured space to recover and cope.',
  },
  {
    label: 'Persistent anxiety or panic',
    text: 'I experience constant worry, overthinking, and moments where my heart races. I want practical tools to manage anxiety.',
  },
  {
    label: 'Low mood & loss of energy',
    text: 'My mood has been persistently low for weeks, with very little energy or motivation to get through the day.',
  },
  {
    label: 'ADHD / focus or OCD patterns',
    text: 'I struggle with attention, restlessness, or repetitive intrusive thoughts and want a proper clinical evaluation.',
  },
  {
    label: 'Relationships, family, or grief',
    text: 'I am going through relationship and family stress and want a private space for ongoing talk therapy.',
  },
];

/**
 * Reusable AI Clinical Analysis + Specialist Matcher + 1-Step Lead Capture widget.
 * Used on /patient/find-professional, /services, and condition/topic pages.
 */
export default function AiCareIntakeWidget({
  eyebrow = 'Serenest Care AI · Instant Care Analysis & Match',
  title = 'Describe what you are experiencing — AI will analyze your pattern & match your clinician.',
  subtext = 'Select a concern or type in your own words. Get key drivers, a 3-step plan, and request a callback in one step — you pay only after our team confirms your slot.',
  sourceTag = 'ai-widget',
  onRoleMatched,
}) {
  const [concern, setConcern] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [leadError, setLeadError] = useState('');
  const [capturedBooking, setCapturedBooking] = useState(null);

  async function runAnalysis(customText) {
    const text = (customText ?? concern).trim();
    if (!text) {
      setError('Pick a concern chip above or describe what you would like help with.');
      return;
    }
    setError('');
    setLeadError('');
    setCapturedBooking(null);
    setLoading(true);
    try {
      const res = await assistant.analyze({
        concern: text,
        symptoms: [text],
      });
      if (res?.analysis) {
        setAnalysis(res.analysis);
        if (typeof onRoleMatched === 'function' && res.analysis.recommended_specialist?.type) {
          onRoleMatched(res.analysis.recommended_specialist.type);
        }
      }
    } catch (err) {
      setError(err?.message || 'Could not run AI analysis right now. You can still book at /book.');
    } finally {
      setLoading(false);
    }
  }

  async function handleAcquire(e) {
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
    setSubmitting(true);
    try {
      const spec = analysis?.recommended_specialist;
      const res = await assistant.acquire({
        patient_name: leadName.trim(),
        patient_phone: leadPhone,
        concern,
        practitioner_type: spec?.type || 'psychiatrist',
        mode: spec?.mode || 'video',
        notes: analysis?.clinician_brief || `[AI Intake · ${sourceTag}]\n${concern}`,
        screening_meta: {
          reason: sourceTag,
          band_label: analysis?.headline || 'AI Care Analysis',
          conditions: analysis?.key_drivers || [concern],
        },
      });
      if (res?.booking) {
        setCapturedBooking(res.booking);
      }
    } catch (err) {
      setLeadError(err?.message || 'Could not register your request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="ai-triage-card" aria-label={eyebrow}>
      <div className="ai-triage-head">
        <div className="ai-triage-head__copy">
          <span className="ai-triage-eyebrow">
            <span className="ai-triage-spark" aria-hidden="true">✦</span>
            {eyebrow}
          </span>
          <h2 className="ai-triage-title">{title}</h2>
          <p className="ai-triage-sub">{subtext}</p>
        </div>
      </div>

      <div className="ai-triage-body">
        <div className="ai-triage-prompts" role="group" aria-label="Common care concerns">
          {DEFAULT_PROMPTS.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`ai-prompt-chip ${concern === item.text ? 'is-active' : ''}`}
              onClick={() => {
                setConcern(item.text);
                runAnalysis(item.text);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="ai-triage-bar">
          <input
            type="text"
            className="input ai-home-input"
            value={concern}
            onChange={(e) => setConcern(e.target.value)}
            placeholder="Or describe in your own words — e.g. trouble sleeping, constant worry, ADHD evaluation, Hindi/Gujarati preference…"
          />
          <button
            type="button"
            className="btn btn-primary ai-match-btn"
            disabled={loading || !concern.trim()}
            onClick={() => runAnalysis()}
          >
            {loading ? 'Analyzing…' : '✦ Analyze & Match Clinician'}
          </button>
        </div>

        {error && <p className="ai-triage-error" role="alert">{error}</p>}

        {analysis && (
          <div className="ai-triage-result" role="region" aria-label="AI care analysis">
            {analysis.crisis && analysis.crisis_notice && (
              <div className="ai-crisis-banner" role="alert">
                <strong>Immediate support first:</strong> {analysis.crisis_notice}
              </div>
            )}

            <div className="ai-triage-result__top">
              <div>
                <div className="ai-triage-badges">
                  <span className="ai-badge ai-badge--primary">
                    ✦ Matched Specialist: {analysis.recommended_specialist?.label}
                  </span>
                  <span className="ai-badge">{analysis.recommended_specialist?.badge}</span>
                  <span className="ai-badge">
                    Starts at ₹{analysis.recommended_specialist?.starting_fee_inr || 499} (pay after confirmation)
                  </span>
                </div>
                <p className="ai-triage-rationale">{analysis.pattern_reading}</p>
              </div>
              <Link className="btn btn-ghost" to={analysis.book_path || '/book'}>
                Customize slot →
              </Link>
            </div>

            {analysis.key_drivers?.length > 0 && (
              <div className="ai-analysis-cols">
                <div className="ai-analysis-box">
                  <div className="ai-analysis-box__label">Key drivers identified</div>
                  <ul className="ai-analysis-list">
                    {analysis.key_drivers.map((d, idx) => (
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
            )}

            {capturedBooking ? (
              <div className="srn-ai-capture srn-ai-capture--done" role="status">
                <div className="srn-ai-capture__badge">
                  ✓ AI Analysis Saved &amp; Callback Registered · Ref {String(capturedBooking.id || '').slice(0, 8).toUpperCase()}
                </div>
                <p className="srn-ai-capture__copy">
                  Thank you, <strong>{capturedBooking.patient_name}</strong>. Our care team will reach out on <strong>+91 {capturedBooking.patient_phone}</strong> to confirm your <strong>{analysis.recommended_specialist?.label}</strong> session. You do not pay until your slot is locked.
                </p>
                <a
                  className="btn btn-primary"
                  href={careWaHref(`Hi, I just completed an AI Care Analysis on Serenest (Ref: ${String(capturedBooking.id || '').slice(0, 8).toUpperCase()})`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Confirm on WhatsApp →
                </a>
              </div>
            ) : (
              <form className="ai-fast-acquire" onSubmit={handleAcquire}>
                <div className="ai-fast-acquire__head">
                  <strong>
                    ✦ Save this AI analysis &amp; book your {analysis.recommended_specialist?.label} callback in 1 step
                  </strong>
                  <span>
                    Next slot: {analysis.next_slot?.label || 'Today / Tomorrow'} · ₹{analysis.recommended_specialist?.starting_fee_inr || 499} after confirmation
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
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting
                      ? 'Registering…'
                      : `Request ${analysis.recommended_specialist?.label} callback →`}
                  </button>
                </div>
                <DpdpConsentNotice compact />
                {leadError && <p className="ai-triage-error" role="alert">{leadError}</p>}
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
