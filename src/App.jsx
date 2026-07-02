import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SiteLayout from './layouts/SiteLayout';
import RequireAcademyAuth from './components/RequireAcademyAuth';
import { trackVisit } from './lib/visitTracker';
import { captureUtm } from './lib/utm';
import CookieConsent from './components/CookieConsent';
import ExitIntentPopup from './components/ExitIntentPopup';

captureUtm();

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
const PrescriptionPage = lazy(() => import('./pages/PrescriptionPage'));
const AcademyAuthPage = lazy(() => import('./pages/AcademyAuthPage'));
const AcademyProgramPage = lazy(() => import('./pages/AcademyProgramPage'));
const DepressionPage = lazy(() => import('./pages/DepressionPage'));
const AnxietyPage = lazy(() => import('./pages/AnxietyPage'));
const AdhdPage = lazy(() => import('./pages/AdhdPage'));
const OcdPage = lazy(() => import('./pages/OcdPage'));
const Phq9Page = lazy(() => import('./pages/Phq9Page'));
const Gad7Page = lazy(() => import('./pages/Gad7Page'));
const OnlinePrescriptionPage = lazy(() => import('./pages/OnlinePrescriptionPage'));
const GuidesPage = lazy(() => import('./pages/GuidesPage'));
const AcademyPage = lazy(() => import('./pages/AcademyPage'));
const PatientAuthPage = lazy(() => import('./pages/PatientAuthPage'));
const PatientDashboardPage = lazy(() => import('./pages/PatientDashboardPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const CorporatePage = lazy(() => import('./pages/CorporatePage'));
const PartnerPage = lazy(() => import('./pages/PartnerPage'));

// Legal pages
const TermsPage = lazy(() => import('./pages/TermsPage'));
const ProfessionalTermsPage = lazy(() => import('./pages/ProfessionalTermsPage'));
const PatientTermsPage = lazy(() => import('./pages/PatientTermsPage'));
const ConsentPage = lazy(() => import('./pages/ConsentPage'));
const RefundPolicyPage = lazy(() => import('./pages/RefundPolicyPage'));
const EmergencyDisclaimerPage = lazy(() => import('./pages/EmergencyDisclaimerPage'));
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage'));
const ProfessionalCodeOfConductPage = lazy(() => import('./pages/ProfessionalCodeOfConductPage'));
const GrievancePolicyPage = lazy(() => import('./pages/GrievancePolicyPage'));
const PaymentPolicyPage = lazy(() => import('./pages/PaymentPolicyPage'));
const DataRetentionPage = lazy(() => import('./pages/DataRetentionPage'));
const IntellectualPropertyPage = lazy(() => import('./pages/IntellectualPropertyPage'));
const CommunityGuidelinesPage = lazy(() => import('./pages/CommunityGuidelinesPage'));
const LegalPage = lazy(() => import('./pages/LegalPage'));

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
      <CookieConsent />
      <ExitIntentPopup />
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
          <Route path="guides" element={<S><GuidesPage /></S>} />
          <Route path="blog" element={<S><BlogIndexPage /></S>} />
          <Route path="blog/:slug" element={<S><BlogPostPage /></S>} />
          <Route path="privacy" element={<S><PrivacyPolicyPage /></S>} />
          <Route path="terms" element={<S><TermsPage /></S>} />
          <Route path="patient/terms" element={<S><PatientTermsPage /></S>} />
          <Route path="consent" element={<S><ConsentPage /></S>} />
          <Route path="refund-policy" element={<S><RefundPolicyPage /></S>} />
          <Route path="emergency-disclaimer" element={<S><EmergencyDisclaimerPage /></S>} />
          <Route path="cookie-policy" element={<S><CookiePolicyPage /></S>} />
          <Route path="grievance-policy" element={<S><GrievancePolicyPage /></S>} />
          <Route path="payment-policy" element={<S><PaymentPolicyPage /></S>} />
          <Route path="data-retention" element={<S><DataRetentionPage /></S>} />
          <Route path="intellectual-property" element={<S><IntellectualPropertyPage /></S>} />
          <Route path="community-guidelines" element={<S><CommunityGuidelinesPage /></S>} />
          <Route path="legal" element={<S><LegalPage /></S>} />
          <Route path="professionals/terms" element={<S><ProfessionalTermsPage /></S>} />
          <Route path="professionals/code-of-conduct" element={<S><ProfessionalCodeOfConductPage /></S>} />
          <Route path="patient/find-professional" element={<S><PatientFindProfessionalPage /></S>} />
          <Route path="careers" element={<S><CareersPage /></S>} />
          <Route path="corporate" element={<S><CorporatePage /></S>} />
          <Route path="partner" element={<S><PartnerPage /></S>} />
          <Route path="patient/login"            element={<S><PatientAuthPage /></S>} />
          <Route path="patient/dashboard"        element={<S><PatientDashboardPage /></S>} />
          <Route path="screening" element={<S><ScreeningPage /></S>} />
          <Route path="consultation/:appointmentId" element={<S><ConsultationPage /></S>} />
          <Route path="consultation/:appointmentId/prescription" element={<S><PrescriptionPage /></S>} />
          <Route path="online-psychiatrist-consultation-india" element={<Navigate to="/services" replace />} />
          <Route path="online-psychiatrist-for-depression-india" element={<S><DepressionPage /></S>} />
          <Route path="anxiety-counselling-online-india" element={<S><AnxietyPage /></S>} />
          <Route path="adhd-assessment-online-india" element={<S><AdhdPage /></S>} />
          <Route path="ocd-treatment-online-india" element={<S><OcdPage /></S>} />
          <Route path="online-psychiatrist-gujarat" element={<Navigate to="/services" replace />} />
          <Route path="phq-9-depression-screening" element={<S><Phq9Page /></S>} />
          <Route path="gad-7-anxiety-screening" element={<S><Gad7Page /></S>} />
          <Route path="online-psychiatrist-prescription-india" element={<S><OnlinePrescriptionPage /></S>} />

          {/* Serenest Academy — literacy/learning surface, merged in from the
              former standalone education-site. /academy/learn redirects to the
              clinician learning hub so old Academy deep-links keep working. */}
          <Route path="academy" element={<S><RequireAcademyAuth><AcademyPage /></RequireAcademyAuth></S>} />
          <Route path="academy/login" element={<S><AcademyAuthPage /></S>} />
          <Route path="academy/program/:slug" element={<S><RequireAcademyAuth><AcademyProgramPage /></RequireAcademyAuth></S>} />
          <Route
            path="academy/learn"
            element={<Navigate to="/professionals/learning" replace />}
          />
          <Route
            path="academy/learn/pharmacology"
            element={<Navigate to="/professionals/learning#learning-pharmacology" replace />}
          />
          <Route
            path="academy/learn/psychology"
            element={<Navigate to="/professionals/learning#learning-psychology" replace />}
          />


          <Route path="*" element={<S><NotFoundPage /></S>} />
        </Route>

        {/* Admin dashboard is intentionally NOT nested under SiteLayout —
            it has its own sidebar/topbar and must not be wrapped by the
            public site header, mobile nav, and footer. */}
        <Route path="admin" element={<S><AdminPage /></S>} />
      </Routes>
    </Suspense>
  );
}
