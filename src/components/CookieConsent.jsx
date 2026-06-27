import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const KEY = 'serenest_privacy_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(KEY)) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  function accept() {
    localStorage.setItem(KEY, '1');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Privacy notice"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 2rem)',
        maxWidth: 680,
        background: 'var(--surface, #fff)',
        border: '1px solid var(--border, #e2e8f0)',
        borderRadius: 14,
        boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
        zIndex: 9999,
        animation: 'slideUp 0.3s ease',
      }}
    >
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateX(-50%) translateY(16px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`}</style>
      <p style={{ flex: 1, minWidth: 200, margin: 0, fontSize: '0.84rem', color: 'var(--text-muted, #64748b)', lineHeight: 1.5 }}>
        We use essential cookies to keep your session secure and remember your preferences.
        No advertising trackers.{' '}
        <Link to="/privacy" style={{ color: 'var(--brand-600, #4a5e35)', fontWeight: 600 }}>
          Privacy policy →
        </Link>
      </p>
      <button
        onClick={accept}
        style={{
          flexShrink: 0,
          padding: '0.5rem 1.25rem',
          borderRadius: 99,
          border: 'none',
          background: 'var(--brand-600, #4a5e35)',
          color: '#fff',
          fontWeight: 700,
          fontSize: '0.84rem',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        Got it
      </button>
    </div>
  );
}
