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

function PageFallback() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="spinner" aria-hidden="true" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/professionals" element={<ProfessionalsPage />} />
          <Route path="/professionals/apply" element={<ProfessionalOnboardingPage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/blog" element={<BlogIndexPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/patient/find-professional" element={<PatientFindProfessionalPage />} />
          <Route path="/screening" element={<ScreeningPage />} />
          <Route path="/consultation/:appointmentId" element={<ConsultationPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

