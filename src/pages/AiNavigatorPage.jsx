import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/useSEO';
import { ROUTE_SEO } from '../lib/seo';
import { assistant, health } from '../lib/api';
import { getVisitorId } from '../lib/visitTracker';
import '../styles/ai-navigator.css';

const STARTERS = [
  {
    label: 'I feel anxious and do not know where to start',
    prompt: 'I feel anxious and do not know where to start on Serenest. What should I do first?',
  },
  {
    label: 'Help me book the right clinician',
    prompt: 'Help me book the right kind of clinician on Serenest — psychiatrist, psychologist, therapist, or counsellor.',
  },
  {
    label: 'Explain PHQ-9 and GAD-7 screening',
    prompt: 'Explain PHQ-9 and GAD-7 screening on Serenest in plain language, and when I should take them.',
  },
  {
    label: 'I want learning, not a consultation',
    prompt: 'I want mental health learning or Academy programmes, not a clinical consultation. Where should I go?',
  },
];

const PATHS = [
  {
    to: '/book',
    title: 'Book care',
    body: 'Video, audio, or chat with a verified clinician.',
  },
  {
    to: '/screening',
    title: 'Self-screen',
    body: 'PHQ-9 & GAD-7 in a few minutes. Not a diagnosis.',
  },
  {
    to: '/patient/find-professional',
    title: 'Find a professional',
    body: 'Browse verified psychiatrists and psychologists.',
  },
  {
    to: '/academy/login',
    title: 'Academy',
    body: 'Literacy, learning tracks, and programmes.',
  },
];

function linkifyPaths(text) {
  const parts = text.split(/(\/[a-z0-9][a-z0-9\-/#]*)/gi);
  return parts.map((part, i) => {
    if (/^\/[a-z0-9][a-z0-9\-/#]*$/i.test(part)) {
      const to = part.split('#')[0] || '/';
      return (
        <Link key={`${part}-${i}`} to={to} className="ai-nav__path-link">
          {part}
        </Link>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

export default function AiNavigatorPage() {
  useSEO({ path: '/ai', ...ROUTE_SEO['/ai'] });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [online, setOnline] = useState(null);
  const [errorBanner, setErrorBanner] = useState('');
  const [messages, setMessages] = useState([]);
  const threadEndRef = useRef(null);
  const inputRef = useRef(null);
  const pingSent = useRef(false);

  useEffect(() => {
    health()
      .then((d) => setOnline(d.assistant === 'configured'))
      .catch(() => setOnline(false));
  }, []);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, loading]);

  useEffect(() => {
    if (pingSent.current) return;
    pingSent.current = true;
    assistant
      .notifyGuideOpened({ vid: getVisitorId(), path: '/ai' })
      .catch(() => {});
  }, []);

  const sendText = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;
      setInput('');
      setErrorBanner('');
      const nextThread = [...messages, { role: 'user', content: trimmed }];
      setMessages(nextThread);
      setLoading(true);
      try {
        const data = await assistant.navigatorChat(nextThread);
        setMessages([...nextThread, { role: 'assistant', content: data.reply }]);
      } catch (e) {
        const msg =
          e?.status === 503
            ? 'Serenest AI is offline right now. Book at /book, take screening at /screening, or WhatsApp +91 7777936367.'
            : e?.message || 'Something went wrong. Please try again.';
        setErrorBanner(msg);
        setMessages(nextThread);
      } finally {
        setLoading(false);
        window.setTimeout(() => inputRef.current?.focus(), 60);
      }
    },
    [loading, messages],
  );

  return (
    <div className="ai-nav">
      <div className="ai-nav__glow" aria-hidden="true" />
      <div className="ai-nav__grid" aria-hidden="true" />

      <section className="ai-nav__hero" aria-labelledby="ai-nav-title">
        <div className="ai-nav__shell">
          <div className="ai-nav__brand-row">
            <span className="ai-nav__core" aria-hidden="true">
              <span className="ai-nav__core-ring" />
              <span className="ai-nav__core-ring ai-nav__core-ring--2" />
              <span className="ai-nav__core-dot" />
            </span>
            <p className="ai-nav__eyebrow">
              <span>Serenest AI</span>
              <span className="ai-nav__eyebrow-dot" aria-hidden="true">·</span>
              <span>Nuclear-powered clarity</span>
            </p>
          </div>
          <h1 id="ai-nav-title" className="ai-nav__title">
            Care Navigator
          </h1>
          <p className="ai-nav__lead">
            Tell us what you need. Get a clear next step — book, screen, find a clinician, or learn —
            without the maze. Not medical advice. Clinician-backed when care is needed.
          </p>
          <p className="ai-nav__status" role="status">
            {online === null
              ? 'Checking AI status…'
              : online
                ? 'Live · AI online'
                : 'AI offline · use Book, Screening, or WhatsApp'}
          </p>
        </div>
      </section>

      <section className="ai-nav__main" aria-label="AI Care Navigator chat">
        <div className="ai-nav__shell ai-nav__layout">
          <div className="ai-nav__chat">
            <div className="ai-nav__thread" role="log" aria-live="polite">
              <div className="ai-nav__msg ai-nav__msg--assistant">
                <p className="ai-nav__bubble">
                  Hi — I am Serenest AI, your Care Navigator. Share what you are looking for
                  (anxiety, booking, screening, Academy, pricing) and I will point you to the
                  right page with clear steps. For emergencies in India, dial <strong>112</strong> or{' '}
                  <strong>108</strong>.
                </p>
              </div>

              {online === false ? (
                <div className="ai-nav__banner" role="status">
                  Live AI replies are off. You can still use{' '}
                  <Link to="/book">/book</Link>, <Link to="/screening">/screening</Link>, or WhatsApp
                  +91 7777936367.
                </div>
              ) : null}

              {messages.map((m, i) => (
                <div
                  key={`${m.role}-${i}`}
                  className={`ai-nav__msg ${m.role === 'user' ? 'ai-nav__msg--user' : 'ai-nav__msg--assistant'}`}
                >
                  <p className="ai-nav__bubble">
                    {m.role === 'assistant' ? linkifyPaths(m.content) : m.content}
                  </p>
                </div>
              ))}

              {loading ? (
                <div className="ai-nav__msg ai-nav__msg--assistant" aria-busy="true">
                  <div className="ai-nav__bubble ai-nav__thinking">
                    <span className="ai-nav__pulse" aria-hidden="true" />
                    Thinking…
                  </div>
                </div>
              ) : null}
              <div ref={threadEndRef} />
            </div>

            {errorBanner ? (
              <div className="ai-nav__banner ai-nav__banner--error" role="alert">
                {errorBanner}
              </div>
            ) : null}

            {messages.length === 0 && online !== false ? (
              <div className="ai-nav__starters" aria-label="Suggested prompts">
                {STARTERS.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    className="ai-nav__starter"
                    disabled={loading}
                    onClick={() => sendText(s.prompt)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            ) : null}

            <form
              className="ai-nav__compose"
              onSubmit={(e) => {
                e.preventDefault();
                sendText(input);
              }}
            >
              <label className="sr-only" htmlFor="ai-nav-input">
                Message Serenest AI
              </label>
              <textarea
                id="ai-nav-input"
                ref={inputRef}
                className="ai-nav__input"
                rows={2}
                maxLength={2000}
                placeholder="e.g. I want help with sleep and stress — where do I start?"
                value={input}
                disabled={loading || online === false}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendText(input);
                  }
                }}
              />
              <button
                type="submit"
                className="btn btn-primary ai-nav__send"
                disabled={loading || !input.trim() || online === false}
              >
                Ask AI
              </button>
            </form>
            <p className="ai-nav__disclaimer">
              Serenest AI helps you navigate this website. It does not diagnose, prescribe, or replace
              a clinician. Opening this page may notify the team that someone is browsing (no message
              content).
            </p>
          </div>

          <aside className="ai-nav__aside" aria-label="Direct care paths">
            <p className="ai-nav__aside-label">Skip the chat</p>
            <h2 className="ai-nav__aside-title">Go straight to care</h2>
            <ul className="ai-nav__paths">
              {PATHS.map((p) => (
                <li key={p.to}>
                  <Link className="ai-nav__path" to={p.to}>
                    <strong>{p.title}</strong>
                    <span>{p.body}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <a
              className="ai-nav__wa"
              href="https://wa.me/917777936367?text=Hi%2C%20I%20need%20help%20choosing%20care%20on%20Serenest"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp a human · +91 77779 36367
            </a>
          </aside>
        </div>
      </section>
    </div>
  );
}
