import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Login } from './pages/Login'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { CurrentPatients } from './pages/CurrentPatients'
import { WaitingPatients } from './pages/WaitingPatients'
import { PatientRequests } from './pages/PatientRequests'
import { PatientDetail } from './pages/PatientDetail'
import { RiskAlerts } from './pages/RiskAlerts'
import { Appointments } from './pages/Appointments'
import { Messages } from './pages/Messages'
import { Analytics } from './pages/Analytics'
import { mockSpecialist } from './data/mockData'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />
  }

  return (
    <BrowserRouter>
      <Layout specialist={mockSpecialist}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/current-patients" element={<CurrentPatients />} />
          <Route path="/waiting-patients" element={<WaitingPatients />} />
          <Route path="/patient-requests" element={<PatientRequests />} />
          <Route path="/patients/:id" element={<PatientDetail />} />
          {/* Legacy redirect */}
          <Route path="/patients" element={<Navigate to="/current-patients" replace />} />
          <Route path="/alerts" element={<RiskAlerts />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
