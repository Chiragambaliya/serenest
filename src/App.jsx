import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SiteLayout from './layouts/SiteLayout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ProfessionalsPage from './pages/ProfessionalsPage';
import NotFoundPage from './pages/NotFoundPage';
import BookingPage from './pages/BookingPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import PricingPage from './pages/PricingPage';
import FAQPage from './pages/FAQPage';
import BlogIndexPage from './pages/BlogIndexPage';
import BlogPostPage from './pages/BlogPostPage';
import ProfessionalOnboardingPage from './pages/ProfessionalOnboardingPage';
import AdminPage from './pages/AdminPage';
import PatientFindProfessionalPage from './pages/PatientFindProfessionalPage';
import ScreeningPage from './pages/ScreeningPage';
import ConsultationPage from './pages/ConsultationPage';

export default function App() {
  return (
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
  );
}

