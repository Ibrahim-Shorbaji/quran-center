import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/layout/ProtectedRoute'
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import AppLayout from './components/layout/AppLayout'
import SheikhsPage from './pages/sheikhs/SheikhsPage'
import HalqasPage from './pages/halqas/HalqasPage'
import StudentsPage from './pages/students/StudentsPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="sheikhs" element={<SheikhsPage />} />
        <Route path="halqas" element={<HalqasPage />} />
        <Route path="students" element={<StudentsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App