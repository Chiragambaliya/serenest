import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/useAuth';

/**
 * Gate for Serenest Academy. Requires a logged-in account; otherwise sends
 * the visitor to the Academy login/signup page.
 */
export default function RequireAcademyAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="page">
        <section className="section">
          <div className="container">
            <p className="muted">Loading…</p>
          </div>
        </section>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/academy/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
