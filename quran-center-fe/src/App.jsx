import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/layout/ProtectedRoute'
import RoleProtectedRoute from './components/layout/RoleProtectedRoute'
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import AppLayout from './components/layout/AppLayout'
import SheikhsPage from './pages/sheikhs/SheikhsPage'
import HalqasPage from './pages/halqas/HalqasPage'
import StudentsPage from './pages/students/StudentsPage'
import HalqaDetailPage from './pages/halqas/HalqaDetailPage'
import StudentProfilePage from './pages/students/StudentProfilePage'
import AttendancePage from './pages/attendance/AttendancePage'
import StudentPortalPage from './pages/portal/StudentPortalPage'


function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* All roles */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Admin only */}
        <Route path="/sheikhs" element={
          <RoleProtectedRoute roles={['ADMIN']}>
            <SheikhsPage />
          </RoleProtectedRoute>
        } />

        <Route path="/students" element={
          <RoleProtectedRoute roles={['ADMIN']}>
            <StudentsPage />
          </RoleProtectedRoute>
        } />

        {/* Admin + Sheikh */}
        <Route path="/halqas" element={
          <RoleProtectedRoute roles={['ADMIN', 'SHEIKH']}>
            <HalqasPage />
          </RoleProtectedRoute>
        } />

        {/* Student only — placeholder for now */}
        <Route path="/my-profile" element={
          <RoleProtectedRoute roles={['STUDENT']}>
            <StudentPortalPage />
          </RoleProtectedRoute>
        } />

        <Route path="/halqas/:id" element={
          <RoleProtectedRoute roles={['ADMIN', 'SHEIKH']}>
            <HalqaDetailPage />
          </RoleProtectedRoute>
        } />

        <Route path="/students/:id" element={
          <RoleProtectedRoute roles={['ADMIN', 'SHEIKH']}>
            <StudentProfilePage />
          </RoleProtectedRoute>
        } />

        <Route path="/attendance" element={
          <RoleProtectedRoute roles={['ADMIN', 'SHEIKH']}>
            <AttendancePage />
          </RoleProtectedRoute>
        } />

      </Route>

      {/* Unknown URL → dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App