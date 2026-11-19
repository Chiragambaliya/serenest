import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  analyticsAllowed,
  getPrivacyChoice,
  loadAnalytics,
  OPEN_PRIVACY_EVENT,
  setPrivacyChoice,
} from '../lib/privacyConsent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    const choice = getPrivacyChoice();
    if (analyticsAllowed(choice)) loadAnalytics();

    let timer;
    if (!choice) {
      timer = window.setTimeout(() => setVisible(true), 700);
    }

    const open = () => setVisible(true);
    window.addEventListener(OPEN_PRIVACY_EVENT, open);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(OPEN_PRIVACY_EVENT, open);
    };
  }, []);

  useEffect(() => {
    if (visible) dialogRef.current?.focus();
  }, [visible]);

  function choose(choice) {
    setPrivacyChoice(choice);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      ref={dialogRef}
      className="privacy-banner"
      role="dialog"
      aria-labelledby="privacy-banner-title"
      aria-describedby="privacy-banner-description"
      aria-live="polite"
      tabIndex="-1"
    >
      <div className="privacy-banner__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M12 3 5.5 5.7v5.2c0 4.5 2.7 8.1 6.5 10.1 3.8-2 6.5-5.6 6.5-10.1V5.7L12 3Z" />
          <path d="m9.3 12 1.8 1.8 3.9-4.1" />
        </svg>
      </div>
      <div className="privacy-banner__copy">
        <p className="privacy-banner__eyebrow">Your privacy, your choice</p>
        <h2 id="privacy-banner-title">Analytics are on.</h2>
        <p id="privacy-banner-description">
          We measure which pages help people find care. Advertising trackers stay off, and these
          measurements do not include clinical answers. Choose essential storage only if you want analytics off.
        </p>
        <div className="privacy-banner__links">
          <Link to="/privacy">Privacy policy</Link>
          <Link to="/cookie-policy">Cookie details</Link>
        </div>
      </div>
      <div className="privacy-banner__actions">
        <button className="privacy-choice privacy-choice--essential" type="button" onClick={() => choose('essential')}>
          Essential only
        </button>
        <button className="privacy-choice privacy-choice--allow" type="button" onClick={() => choose('analytics')}>
          Keep analytics on
        </button>
      </div>
    </div>
  );
}
