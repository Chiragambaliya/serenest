import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { assistant } from '../lib/api';
import { careWaHref, isIndiaMobile } from '../lib/patientReach';
import { getVisitorId } from '../lib/visitTracker';

const STARTER_PROMPTS = [
  'I have trouble sleeping and constant overthinking',
  'I feel burned out and exhausted from work',
  'Help me choose: psychiatrist or therapist?',
  'How do fees and pay-after-confirmation work?',
];

function formatBubbleText(text = '') {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx}>{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export default function SerenestAssistant() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');
  const [messages, setMessages] = useState([]);
  const [suggestions, setSuggestions] = useState(STARTER_PROMPTS);

  // Inline client-acquisition form inside the AI concierge
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadError, setLeadError] = useState('');
  const [acquiredBooking, setAcquiredBooking] = useState(null);

  const threadEndRef = useRef(null);
  const inputRef = useRef(null);
  const guideOpenPingSent = useRef(false);

  const scrollToBottom = () => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    if (open) {
      scrollToBottom();
      window.setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open, messages, loading, acquiredBooking]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (!open || guideOpenPingSent.current) return;
    guideOpenPingSent.current = true;
    assistant.notifyGuideOpened({
      vid: getVisitorId(),
      path: location.pathname || '/',
    }).catch(() => {});
  }, [open, location.pathname]);

  const sendText = useCallback(async (rawText) => {
    const text = (rawText ?? input).trim();
    if (!text || loading) return;
    setInput('');
    setErrorBanner('');
    const nextThread = [...messages, { role: 'user', content: text }];
    setMessages(nextThread);
    setLoading(true);
    try {
      const data = await assistant.chat(
        nextThread.map(({ role, content }) => ({ role, content })),
        { path: location.pathname || '/' },
      );
      if (data.acquired_booking) {
        setAcquiredBooking(data.acquired_booking);
      }
      setMessages([
        ...nextThread,
        {
          role: 'assistant',
          content: data.reply,
          recommendation: data.recommendation || null,
          acquired_booking: data.acquired_booking || null,
        },
      ]);
      if (Array.isArray(data.suggestions) && data.suggestions.length) {
        setSuggestions(data.suggestions);
      }
    } catch (e) {
      setErrorBanner(
        e?.message || 'Could not reach Serenest Care AI right now. You can book directly at /book or WhatsApp +91 77779 36367.',
      );
      setMessages(nextThread);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, location.pathname]);

  async function handleInlineAcquire(rec) {
    setLeadError('');
    if (!leadName.trim() || leadName.trim().length < 2) {
      setLeadError('Enter your name.');
      return;
    }
    if (!isIndiaMobile(leadPhone)) {
      setLeadError('Enter a valid 10-digit Indian mobile number (starts with 6–9).');
      return;
    }
    setLeadSubmitting(true);
    try {
      const lastUserConcern = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
      const res = await assistant.acquire({
        patient_name: leadName.trim(),
        patient_phone: leadPhone,
        concern: lastUserConcern,
        practitioner_type: rec?.practitioner_type || 'psychiatrist',
        mode: rec?.mode || 'video',
        notes: rec?.structured_note || '',
      });
      if (res?.booking) {
        setAcquiredBooking(res.booking);
      }
    } catch (err) {
      setLeadError(err?.message || 'Could not submit request. Please try again.');
    } finally {
      setLeadSubmitting(false);
    }
  }

  // Latest assistant recommendation for the inline capture card
  const latestRec = [...messages].reverse().find((m) => m.role === 'assistant' && m.recommendation)?.recommendation || {
    practitioner_type: 'psychiatrist',
    practitioner_label: 'Psychiatrist',
    mode: 'video',
    path: '/book',
    label: 'Customize on booking page',
    allow_inline_capture: true,
  };

  if (
    location.pathname.startsWith('/admin')
    || location.pathname.startsWith('/consultation')
  ) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className="srn-ai-fab"
        aria-expanded={open}
        aria-controls="srn-ai-panel"
        aria-label={open ? 'Close Serenest Care AI' : 'Open Serenest Care AI'}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="srn-ai-fab-icon" aria-hidden="true">
          ✦
        </span>
        <span className="srn-ai-fab-label">Care AI</span>
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="srn-ai-backdrop"
            aria-label="Close assistant"
            onClick={() => setOpen(false)}
          />
          <div
            id="srn-ai-panel"
            className="srn-ai-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="srn-ai-title"
          >
            <div className="srn-ai-head">
              <div>
                <div id="srn-ai-title" className="srn-ai-title">
                  <span aria-hidden="true" style={{ marginRight: 6 }}>✦</span>
                  Serenest Care AI
                </div>
                <p className="srn-ai-sub">
                  Matches your care &amp; books your callback right here — non-diagnostic.
                </p>
              </div>
              <button
                type="button"
                className="srn-ai-close"
                aria-label="Close"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="srn-ai-thread" role="log" aria-live="polite">
              <div className="srn-ai-msg srn-ai-msg-assistant">
                <div className="srn-ai-bubble">
                  <p style={{ margin: 0 }}>
                    Hi — tell me what you&apos;re going through. I will match you with the right specialist (<strong>Psychiatrist</strong>, <strong>Psychologist</strong>, <strong>Therapist</strong>, or <strong>Counsellor</strong>) and can <strong>register your appointment callback right here</strong> — you pay nothing until our team confirms your slot.
                  </p>
                  <p style={{ margin: '6px 0 0', fontSize: '12px', opacity: 0.78 }}>
                    Not for emergencies — in urgent danger, call 112 or Tele-MANAS 14416.
                  </p>
                </div>
              </div>

              {messages.map((m, i) => (
                <div
                  key={`${m.role}-${i}`}
                  className={`srn-ai-msg ${m.role === 'user' ? 'srn-ai-msg-user' : 'srn-ai-msg-assistant'}`}
                >
                  <div className="srn-ai-bubble">
                    <div>{formatBubbleText(m.content)}</div>
                    {m.recommendation && (
                      <div className="srn-ai-rec-actions">
                        <Link
                          className="srn-ai-rec-btn srn-ai-rec-btn--primary"
                          to={
                            m.recommendation.structured_note
                              ? `${m.recommendation.path}${m.recommendation.path.includes('?') ? '&' : '?'}note=${encodeURIComponent(m.recommendation.structured_note)}`
                              : m.recommendation.path
                          }
                          onClick={() => setOpen(false)}
                        >
                          {m.recommendation.label} →
                        </Link>
                        {m.recommendation.secondary_path && (
                          <Link
                            className="srn-ai-rec-btn"
                            to={m.recommendation.secondary_path}
                            onClick={() => setOpen(false)}
                          >
                            {m.recommendation.secondary_label}
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Instant AI Client Capture Card right inside the concierge */}
              {acquiredBooking ? (
                <div className="srn-ai-capture srn-ai-capture--done" role="status">
                  <div className="srn-ai-capture__badge">
                    ✓ Request registered · Ref {String(acquiredBooking.id || '').slice(0, 8).toUpperCase()}
                  </div>
                  <p className="srn-ai-capture__copy">
                    Our care team will reach out on <strong>+91 {acquiredBooking.patient_phone}</strong> to confirm your <strong>{acquiredBooking.practitioner_type}</strong> ({acquiredBooking.mode}) slot. No payment until confirmed.
                  </p>
                  <a
                    className="srn-ai-rec-btn srn-ai-rec-btn--primary"
                    href={careWaHref(`Hi, I booked via Serenest Care AI (Ref: ${String(acquiredBooking.id || '').slice(0, 8).toUpperCase()})`)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Message care team on WhatsApp →
                  </a>
                </div>
              ) : (
                <form
                  className="srn-ai-capture"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleInlineAcquire(latestRec);
                  }}
                >
                  <div className="srn-ai-capture__head">
                    <span>✦ Instant AI Callback Request</span>
                    <span className="srn-ai-capture__tag">
                      {latestRec.practitioner_label || 'Psychiatrist'} · ₹499 after confirmation
                    </span>
                  </div>
                  <div className="srn-ai-capture__fields">
                    <input
                      type="text"
                      className="srn-ai-capture__input"
                      placeholder="Your name"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      autoComplete="name"
                    />
                    <input
                      type="tel"
                      className="srn-ai-capture__input"
                      placeholder="10-digit mobile (+91)"
                      inputMode="numeric"
                      maxLength={10}
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      autoComplete="tel-national"
                    />
                  </div>
                  {leadError && <p className="srn-ai-capture__err" role="alert">{leadError}</p>}
                  <button
                    type="submit"
                    className="srn-ai-capture__submit"
                    disabled={leadSubmitting}
                  >
                    {leadSubmitting
                      ? 'Registering request…'
                      : `Let AI book my ${latestRec.practitioner_label || 'care'} callback →`}
                  </button>
                  <p style={{ margin: 0, fontSize: '10.5px', lineHeight: 1.4, color: 'var(--muted)' }}>
                    DPDP Act 2023: 18+ / guardian consent to process contact &amp; intake for care callback.{' '}
                    <Link to="/privacy#dpdp-rights-portal" onClick={() => setOpen(false)}>Rights &amp; withdrawal →</Link>
                  </p>
                </form>
              )}

              {loading ? (
                <div className="srn-ai-msg srn-ai-msg-assistant" aria-busy="true">
                  <div className="srn-ai-bubble srn-ai-thinking">
                    <span className="spinner" aria-hidden="true" />
                    Matching care…
                  </div>
                </div>
              ) : (
                <div className="srn-ai-chips" aria-label="Suggested questions">
                  {suggestions.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      className="srn-ai-chip"
                      onClick={() => sendText(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              <div ref={threadEndRef} />
            </div>

            {errorBanner ? (
              <div className="srn-ai-error" role="alert">
                {errorBanner}
              </div>
            ) : null}

            <div className="srn-ai-compose">
              <div className="srn-ai-compose-row">
                <textarea
                  ref={inputRef}
                  className="srn-ai-input"
                  rows={2}
                  maxLength={2000}
                  placeholder="Describe what you're going through, or reply with your name & 10-digit number…"
                  value={input}
                  disabled={loading}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendText();
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn btn-primary srn-ai-send"
                  disabled={loading || !input.trim()}
                  onClick={() => sendText()}
                >
                  Ask
                </button>
              </div>
              <p className="fineprint srn-ai-disclaimer">
                AI Care Intake · Pay only after our team confirms your slot.
              </p>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
