import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import SiteLayout from './layouts/SiteLayout';

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ProfessionalsPage = lazy(() => import('./pages/ProfessionalsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const BlogIndexPage = lazy(() => import('./pages/BlogIndexPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const ProfessionalOnboardingPage = lazy(() => import('./pages/ProfessionalOnboardingPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const PatientFindProfessionalPage = lazy(() => import('./pages/PatientFindProfessionalPage'));
const ScreeningPage = lazy(() => import('./pages/ScreeningPage'));
const ConsultationPage = lazy(() => import('./pages/ConsultationPage'));

// FIX Bug 5: PageFallback is used per-route so only the content area spins,
// not the entire app (navbar + footer stay visible during lazy-load transitions)
function PageFallback() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="spinner" aria-hidden="true" />
    </div>
  );
}

// Helper: wrap a lazy component so Suspense is scoped to the route, not the whole app
function S({ children }) {
  return <Suspense fallback={<PageFallback />}>{children}</Suspense>;
}

export default function App() {
  return (
    // Outer Suspense catches SiteLayout itself if it were lazy (it isn't, but kept as safety net)
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<SiteLayout />}>
          {/* FIX Bug 5: each route wrapped in its own <S> so layout never unmounts */}
          <Route path="/" element={<S><HomePage /></S>} />
          <Route path="/about" element={<S><AboutPage /></S>} />
          <Route path="/services" element={<S><ServicesPage /></S>} />
          <Route path="/professionals" element={<S><ProfessionalsPage /></S>} />
          <Route path="/professionals/apply" element={<S><ProfessionalOnboardingPage /></S>} />
          <Route path="/book" element={<S><BookingPage /></S>} />
          <Route path="/pricing" element={<S><PricingPage /></S>} />
          <Route path="/faq" element={<S><FAQPage /></S>} />
          <Route path="/blog" element={<S><BlogIndexPage /></S>} />
          <Route path="/blog/:slug" element={<S><BlogPostPage /></S>} />
          <Route path="/privacy" element={<S><PrivacyPolicyPage /></S>} />
          <Route path="/admin" element={<S><AdminPage /></S>} />
          <Route path="/patient/find-professional" element={<S><PatientFindProfessionalPage /></S>} />
          <Route path="/screening" element={<S><ScreeningPage /></S>} />
          <Route path="/consultation/:appointmentId" element={<S><ConsultationPage /></S>} />
          <Route path="*" element={<S><NotFoundPage /></S>} />
        </Route>
      </Routes>
    </Suspense>
  );
}
