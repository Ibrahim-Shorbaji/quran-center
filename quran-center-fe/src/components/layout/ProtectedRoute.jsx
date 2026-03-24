import { Navigate } from 'react-router-dom'
import { useAuth } from '../../store/authStore.jsx'

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth()

    // Wait until we check localStorage before deciding
    if (loading) return null

    // Not logged in → send to login page
    if (!isAuthenticated) return <Navigate to="/login" replace />

    // Logged in → show the page
    return children
}

export default ProtectedRoute