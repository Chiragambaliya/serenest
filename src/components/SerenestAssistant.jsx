import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { assistant } from '../lib/api';
import { getVisitorId } from '../lib/visitTracker';

const STARTER_PROMPTS = [
  'Help me choose: psychiatrist or therapist?',
  'I have trouble sleeping and constant overthinking',
  'I feel burned out and exhausted from work',
  'How do fees and pay-after-confirmation work?',
];

function formatBubbleText(text = '') {
  // Simple bold (**...**) formatter without dangerouslySetInnerHTML
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
  }, [open, messages, loading]);

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
      setMessages([
        ...nextThread,
        {
          role: 'assistant',
          content: data.reply,
          recommendation: data.recommendation || null,
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

  // Hide inside live consultation rooms or admin console
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
                  Clinical intake match &amp; care navigation — non-diagnostic.
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
                    Hi — share what you&apos;re going through or ask a question. I can match you to the right specialist (<strong>Psychiatrist</strong>, <strong>Psychologist</strong>, <strong>Therapist</strong>, or <strong>Counsellor</strong>), pre-fill your booking note, or point you to a private check-in.
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
                  placeholder="Describe what you're experiencing or ask about booking, fees, prescriptions…"
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
                Private intake navigation · Not a medical diagnosis.
              </p>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
