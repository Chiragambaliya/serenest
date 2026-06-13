import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { assistant, health } from '../lib/api';

const QUICK_PROMPTS = [
  'What can I learn at Serenest Academy?',
  'Explain the pharmacology vs psychology tracks',
  'How do I partner with Academy for my school or workplace?',
  'When should I book a psychiatrist instead of reading here?',
];

export default function AcademyGuide() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [guideOnline, setGuideOnline] = useState(null);
  const [errorBanner, setErrorBanner] = useState('');
  const [messages, setMessages] = useState([]);
  const threadEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    health()
      .then((d) => setGuideOnline(d.assistant === 'configured'))
      .catch(() => setGuideOnline(false));
  }, []);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, loading]);

  const sendText = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || loading || guideOnline === false) return;

      setInput('');
      setErrorBanner('');
      const nextThread = [...messages, { role: 'user', content: trimmed }];
      setMessages(nextThread);
      setLoading(true);

      try {
        const data = await assistant.academyChat(nextThread);
        setMessages([...nextThread, { role: 'assistant', content: data.reply }]);
      } catch (e) {
        const msg =
          e?.status === 503
            ? 'Academy Guide is not available right now. Browse the programmes below, email support@serenest.in, or book clinical care at /book.'
            : e?.message || 'Something went wrong. Please try again.';
        setErrorBanner(msg);
        setMessages(nextThread);
      } finally {
        setLoading(false);
      }
    },
    [loading, messages, guideOnline],
  );

  const send = useCallback(() => sendText(input), [input, sendText]);

  return (
    <section id="guide" className="ed-section ed-guide-section">
      <div className="container">
        <div className="ed-guide-layout">
          <div className="ed-guide-intro">
            <p className="ed-section-label">Academy Guide · AI</p>
            <h2>Ask about literacy, learning tracks &amp; partnerships</h2>
            <p className="ed-muted">
              Serenest Academy Guide helps you find the right programme, learning track, or next step —
              in plain language. It explains what Academy publishes and when clinical care on Serenest is
              more appropriate. It does <strong>not</strong> diagnose or prescribe.
            </p>
            <ul className="ed-guide-points">
              <li>Articles, blog, and public mental health literacy</li>
              <li>Clinician pharmacology &amp; psychology learning paths</li>
              <li>School, college &amp; workplace partnership conversations</li>
            </ul>
            {guideOnline === false ? (
              <p className="ed-guide-offline">
                Live AI replies are off — use the programme cards below or{' '}
                <a href="mailto:support@serenest.in?subject=Serenest%20Academy%20%E2%80%94%20question">
                  email Academy
                </a>
                .
              </p>
            ) : null}
          </div>

          <div className="ed-guide-panel" aria-labelledby="ed-guide-title">
            <div className="ed-guide-head">
              <div>
                <div id="ed-guide-title" className="ed-guide-title">
                  Serenest Academy Guide
                </div>
                <p className="ed-guide-sub">Literacy &amp; learning — not medical advice</p>
              </div>
            </div>

            <div className="ed-guide-chips" aria-label="Suggested questions">
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="ed-guide-chip"
                  disabled={loading || guideOnline === false}
                  onClick={() => sendText(q)}
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="ed-guide-thread" role="log" aria-live="polite">
              <div className="ed-guide-msg ed-guide-msg-assistant">
                <p className="ed-guide-bubble">
                  Ask me about Academy programmes, clinician learning tracks, or how to collaborate with
                  Serenest. For an appointment or screening, I&apos;ll point you to{' '}
                  <Link to="/book">Book</Link> or <Link to="/screening">Screening</Link>. Emergencies:
                  call <strong>112</strong> or <strong>108</strong> in India.
                </p>
              </div>
              {messages.map((m, i) => (
                <div
                  key={`${m.role}-${i}`}
                  className={`ed-guide-msg ${
                    m.role === 'user' ? 'ed-guide-msg-user' : 'ed-guide-msg-assistant'
                  }`}
                >
                  <p className="ed-guide-bubble">{m.content}</p>
                </div>
              ))}
              {loading ? (
                <div className="ed-guide-msg ed-guide-msg-assistant" aria-busy="true">
                  <div className="ed-guide-bubble ed-guide-thinking">
                    <span className="spinner" aria-hidden="true" />
                    Thinking…
                  </div>
                </div>
              ) : null}
              <div ref={threadEndRef} />
            </div>

            {errorBanner ? (
              <div className="ed-guide-error" role="alert">
                {errorBanner}
              </div>
            ) : null}

            <div className="ed-guide-compose">
              <textarea
                ref={inputRef}
                className="ed-guide-input"
                rows={3}
                maxLength={2000}
                placeholder="e.g. What’s the difference between Academy and booking a psychiatrist?"
                value={input}
                disabled={loading || guideOnline === false}
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
                className="btn btn-primary ed-guide-send"
                disabled={loading || !input.trim() || guideOnline === false}
                onClick={send}
              >
                Ask Academy Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
