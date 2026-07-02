import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles.css';
import './styles/home.css';
import './styles/guides.css';
import './styles/services.css';
import './styles/about.css';
import './styles/team.css';
import './styles/pricing.css';
import './styles/professionals.css';
import './styles/admin.css';
import './styles/prescription.css';

// Must match Vite `base` so routes and assets resolve when deployed under a subpath.
const basename = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '') || undefined;

class RootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      const e = this.state.error;
      return (
        <div style={{ padding: 24, fontFamily: 'system-ui,sans-serif', maxWidth: 560 }}>
          <h1 style={{ marginTop: 0 }}>Something went wrong</h1>
          <p style={{ color: '#444' }}>{String(e?.message || e)}</p>
          <p style={{ fontSize: 14, color: '#666' }}>Check the browser console for details.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Missing #root element in index.html');
}

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </RootErrorBoundary>
  </React.StrictMode>,
);

// ── Progressive Web App ────────────────────────────────────────────────
// Register the service worker so Serenest is installable and boots offline.
// Production only: in dev a SW would cache Vite's HMR modules and cause stale
// reloads. The worker itself never caches /api/* so health data stays live.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        // When a new worker has installed and there's already a controller,
        // an update is ready — activate it so the next navigation is fresh.
        registration.addEventListener('updatefound', () => {
          const installing = registration.installing;
          if (!installing) return;
          installing.addEventListener('statechange', () => {
            if (installing.state === 'installed' && navigator.serviceWorker.controller) {
              installing.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        });
      })
      .catch(() => {
        // A failed SW registration must never break the app.
      });

    // Reload once when a new worker takes control, so users get the update.
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  });
}

