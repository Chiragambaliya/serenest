import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles.css';

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

