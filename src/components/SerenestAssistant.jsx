import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { assistant } from '../lib/api';
import { getVisitorId } from '../lib/visitTracker';

export default function SerenestAssistant() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');
  /** @type {[{ role: 'user' | 'assistant', content: string }]} */
  const [messages, setMessages] = useState([]);
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

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setErrorBanner('');
    const nextThread = [...messages, { role: 'user', content: text }];
    setMessages(nextThread);
    setLoading(true);
    try {
      const data = await assistant.chat(nextThread);
      setMessages([...nextThread, { role: 'assistant', content: data.reply }]);
    } catch (e) {
      const msg =
        e?.status === 503
          ? 'The assistant is not available right now. Try WhatsApp (+91 7777936367), book online, or email support@serenest.fit.'
          : e?.message || 'Something went wrong. Please try again.';
      setErrorBanner(msg);
      setMessages(nextThread);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  return (
    <>
      <button
        type="button"
        className="srn-ai-fab"
        aria-expanded={open}
        aria-controls="srn-ai-panel"
        aria-label={open ? 'Close Serenest Guide' : 'Open Serenest Guide'}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="srn-ai-fab-icon" aria-hidden="true">
          ✨
        </span>
        <span className="srn-ai-fab-label">Guide</span>
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
                  Serenest Guide
                </div>
                <p className="srn-ai-sub">Helps you use this website correctly — step by step. Not medical advice.</p>
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
                <p className="srn-ai-bubble">
                  Hi — tell me what you&apos;re trying to do or where you&apos;re stuck. I&apos;ll point you to the right page and clear steps (booking, screening, services, pricing, professionals). If something looks broken on your device, I&apos;ll suggest quick checks and how to reach our team.
                  For emergencies, use local emergency services (e.g. 112 in India).
                </p>
              </div>
              {messages.map((m, i) => (
                <div
                  key={`${m.role}-${i}`}
                  className={`srn-ai-msg ${m.role === 'user' ? 'srn-ai-msg-user' : 'srn-ai-msg-assistant'}`}
                >
                  <p className="srn-ai-bubble">{m.content}</p>
                </div>
              ))}
              {loading ? (
                <div className="srn-ai-msg srn-ai-msg-assistant" aria-busy="true">
                  <div className="srn-ai-bubble srn-ai-thinking">
                    <span className="spinner" aria-hidden="true" />
                    Thinking…
                  </div>
                </div>
              ) : null}
              <div ref={threadEndRef} />
            </div>

            {errorBanner ? (
              <div className="srn-ai-error" role="alert">
                {errorBanner}
              </div>
            ) : null}

            <div className="srn-ai-compose">
              <textarea
                ref={inputRef}
                className="srn-ai-input"
                rows={2}
                maxLength={2000}
                placeholder="e.g. How do I book? Screening won’t submit… Where’s pricing?"
                value={input}
                disabled={loading}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-primary srn-ai-send"
                disabled={loading || !input.trim()}
                onClick={send}
              >
                Send
              </button>
              <p className="fineprint srn-ai-disclaimer">
                Opening this chat may send your team a quick heads-up that someone is browsing (no message content).
              </p>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
