import React, { useEffect, useState, useRef } from 'react';
import CallbackForm from './CallbackForm';

const SESSION_KEY = 'serenest_exit_shown';
const STORAGE_KEY = 'serenest_exit_ts';
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function shouldShow() {
  if (sessionStorage.getItem(SESSION_KEY)) return false;
  const last = localStorage.getItem(STORAGE_KEY);
  if (last && Date.now() - Number(last) < COOLDOWN_MS) return false;
  return true;
}

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const fired = useRef(false);

  function open() {
    if (fired.current || !shouldShow()) return;
    fired.current = true;
    setVisible(true);
    sessionStorage.setItem(SESSION_KEY, '1');
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  }

  function close() {
    setVisible(false);
  }

  useEffect(() => {
    if (!shouldShow()) return;

    // Desktop only: mouse leaving toward browser chrome.
    // Do NOT auto-open on a mobile idle timer — that covers CTAs and feels broken.
    const coarse = window.matchMedia?.('(pointer: coarse)').matches;
    if (coarse) return undefined;

    function onMouseLeave(e) {
      if (e.clientY <= 8) open();
    }
    document.addEventListener('mouseleave', onMouseLeave);
    return () => document.removeEventListener('mouseleave', onMouseLeave);
  }, []);

  if (!visible) return null;

  return (
    <div className="eip-backdrop" role="dialog" aria-modal="true" aria-label="Before you go" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="eip-card">
        <button className="eip-close" onClick={close} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>

        <p className="eip-eyebrow">Before you go</p>
        <CallbackForm
          source="exit_intent"
          variant="embed"
          heading="Leave your number — we will call you."
          sub="A request, not a charge. You pay after we confirm the slot."
          cta="Call me back"
        />
        <button className="eip-skip" onClick={close}>No thanks, I&apos;ll skip</button>
      </div>
    </div>
  );
}
