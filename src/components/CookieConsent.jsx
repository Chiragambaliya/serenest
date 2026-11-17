import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  loadAnalytics,
  OPEN_PRIVACY_EVENT,
  setPrivacyChoice,
} from '../lib/privacyConsent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    // Analytics is always active on Serenest Care.
    setPrivacyChoice('analytics');
    loadAnalytics();

    const open = () => setVisible(true);
    window.addEventListener(OPEN_PRIVACY_EVENT, open);
    return () => {
      window.removeEventListener(OPEN_PRIVACY_EVENT, open);
    };
  }, []);

  useEffect(() => {
    if (visible) dialogRef.current?.focus();
  }, [visible]);

  function acknowledge() {
    setPrivacyChoice('analytics');
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
      <div className="privacy-banner__copy">
        <h2 id="privacy-banner-title">Privacy-safe analytics &amp; essential storage are active.</h2>
        <p id="privacy-banner-description">
          We use essential storage and first-party analytics to keep sign-in working and improve care navigation. No ad trackers, ever.{' '}
          <Link to="/privacy">Privacy</Link> · <Link to="/privacy#dpdp-rights-portal">DPDP Rights</Link> · <Link to="/cookie-policy">Cookies</Link>
        </p>
      </div>
      <div className="privacy-banner__actions">
        <button className="privacy-choice privacy-choice--allow" type="button" onClick={acknowledge}>
          Got it
        </button>
      </div>
    </div>
  );
}
