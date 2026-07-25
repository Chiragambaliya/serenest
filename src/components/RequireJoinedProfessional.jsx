import React, { useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/useAuth';
import { professionals } from '../lib/api';

/**
 * Gate for Academy clinician content (learning hub). Requires an Academy
 * login AND an approved professional application matching the account email.
 */
export default function RequireJoinedProfessional({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  // null = checking, true/false = resolved
  const [joined, setJoined] = useState(null);

  useEffect(() => {
    if (loading || !user?.email) return undefined;
    let active = true;
    professionals
      .verify(user.email)
      .then((res) => {
        if (active) setJoined(Boolean(res.joined));
      })
      .catch(() => {
        if (active) setJoined(false);
      });
    return () => {
      active = false;
    };
  }, [loading, user?.email]);

  if (loading || (user && joined === null)) {
    return (
      <div className="page">
        <section className="section">
          <div className="container">
            <p className="muted">Checking access…</p>
          </div>
        </section>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/academy/login" replace state={{ from: location.pathname }} />;
  }

  if (!joined) {
    return (
      <div className="page">
        <section className="section about-hero">
          <div className="container">
            <div className="section-head about-hero-head">
              <p className="kicker">Serenest Academy</p>
              <h1 className="page-title">The learning hub is for joined clinicians</h1>
              <p className="about-subtext">
                Pharmacology and psychology tracks open once your professional application is approved.
                If you have applied, access unlocks automatically after approval — make sure your Academy
                account uses the same email as your application ({user.email}).
              </p>
              <div className="hero-actions" style={{ marginTop: 20, flexWrap: 'wrap' }}>
                <Link className="btn btn-primary" to="/professionals/apply">Apply to join →</Link>
                <Link className="btn btn-ghost" to="/academy">← Academy home</Link>
                <a className="btn btn-ghost" href="mailto:support@serenest.in?subject=Academy%20learning%20hub%20access">
                  Contact support
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return children;
}
