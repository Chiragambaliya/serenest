import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
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
    if (choice === 'analytics') loadAnalytics();

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
      <div className="privacy-banner__copy">
        <h2 id="privacy-banner-title">Analytics stay off unless you allow them.</h2>
        <p id="privacy-banner-description">
          Essential storage keeps sign-in working. No ad trackers, ever.{' '}
          <Link to="/privacy">Privacy</Link> · <Link to="/privacy#dpdp-rights-portal">DPDP Rights</Link> · <Link to="/cookie-policy">Cookies</Link>
        </p>
      </div>
      <div className="privacy-banner__actions">
        <button className="privacy-choice privacy-choice--essential" type="button" onClick={() => choose('essential')}>
          Essential only
        </button>
        <button className="privacy-choice privacy-choice--allow" type="button" onClick={() => choose('analytics')}>
          Allow analytics
        </button>
      </div>
    </div>
  );
}
