import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../store/authStore.jsx'

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth()
    const location = useLocation()

    // Wait until we check localStorage before deciding
    if (loading) return null

    // Not logged in → send to login, remembering where they were headed
    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />
    }

    // Logged in → show the page
    return children
}

export default ProtectedRoute
