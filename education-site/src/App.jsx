import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ScrollToTop } from './components/ScrollToTop'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { FaqPage } from './pages/FaqPage'
import { ForOrganisationsPage } from './pages/ForOrganisationsPage'
import { ForProfessionalsPage } from './pages/ForProfessionalsPage'
import { HomePage } from './pages/HomePage'
import { ProgrammesPage } from './pages/ProgrammesPage'
import { ClinicalExcellencePage } from './pages/ClinicalExcellencePage'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="programmes" element={<ProgrammesPage />} />
          <Route path="programmes/clinical-excellence" element={<ClinicalExcellencePage />} />
          <Route path="for-professionals" element={<ForProfessionalsPage />} />
          <Route path="for-organisations" element={<ForOrganisationsPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="what-we-do" element={<Navigate to="/programmes" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
