import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import SiteLayout from './layouts/SiteLayout';
import { trackVisit } from './lib/visitTracker';

const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const TeamPage = lazy(() => import('./pages/TeamPage'));
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
const ProfessionalLearningPage = lazy(() => import('./pages/ProfessionalLearningPage'));
const ProfessionalResourcesPage = lazy(() => import('./pages/ProfessionalResourcesPage'));
const ProfessionalGuidelinesPage = lazy(() => import('./pages/ProfessionalGuidelinesPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const PatientFindProfessionalPage = lazy(() => import('./pages/PatientFindProfessionalPage'));
const ScreeningPage = lazy(() => import('./pages/ScreeningPage'));
const ConsultationPage = lazy(() => import('./pages/ConsultationPage'));
const OnlinePsychiatristIndiaPage = lazy(() => import('./pages/OnlinePsychiatristIndiaPage'));

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

function VisitTracker() {
  const location = useLocation();
  useEffect(() => {
    // Don't track admin or consultation pages — those are internal/private routes.
    if (location.pathname.startsWith('/admin')) return;
    if (location.pathname.startsWith('/consultation')) return;
    trackVisit(location.pathname);
  }, [location.pathname]);
  return null;
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <VisitTracker />
      {/*
        Use an explicit layout route at "/" with relative child paths. Pathless layout + Outlet
        can fail to match in React Router v7 in some setups (blank main content).
      */}
      <Routes>
        <Route path="/" element={<SiteLayout />}>
          <Route index element={<S><HomePage /></S>} />
          <Route path="about" element={<S><AboutPage /></S>} />
          <Route path="team" element={<S><TeamPage /></S>} />
          <Route path="services" element={<S><ServicesPage /></S>} />
          <Route path="professionals" element={<S><ProfessionalsPage /></S>} />
          <Route path="professionals/learning" element={<S><ProfessionalLearningPage /></S>} />
          <Route path="professionals/resources" element={<S><ProfessionalResourcesPage /></S>} />
          <Route path="professionals/guidelines" element={<S><ProfessionalGuidelinesPage /></S>} />
          <Route path="professionals/apply" element={<S><ProfessionalOnboardingPage /></S>} />
          <Route path="book" element={<S><BookingPage /></S>} />
          <Route path="pricing" element={<S><PricingPage /></S>} />
          <Route path="faq" element={<S><FAQPage /></S>} />
          <Route path="blog" element={<S><BlogIndexPage /></S>} />
          <Route path="blog/:slug" element={<S><BlogPostPage /></S>} />
          <Route path="privacy" element={<S><PrivacyPolicyPage /></S>} />
          <Route path="admin" element={<S><AdminPage /></S>} />
          <Route path="patient/find-professional" element={<S><PatientFindProfessionalPage /></S>} />
          <Route path="screening" element={<S><ScreeningPage /></S>} />
          <Route path="consultation/:appointmentId" element={<S><ConsultationPage /></S>} />
          <Route path="online-psychiatrist-consultation-india" element={<S><OnlinePsychiatristIndiaPage /></S>} />
          <Route path="*" element={<S><NotFoundPage /></S>} />
        </Route>
      </Routes>
    </Suspense>
  );
}
