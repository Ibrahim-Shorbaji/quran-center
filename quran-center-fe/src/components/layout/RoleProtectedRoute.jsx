import { Navigate } from 'react-router-dom'
import { useAuth } from '../../store/authStore.jsx'

const RoleProtectedRoute = ({ children, roles }) => {
    const { user } = useAuth()

    // If user's role is not in allowed roles → redirect to dashboard
    if (!roles.includes(user?.role)) {
        return <Navigate to="/dashboard" replace />
    }

    return children
}

export default RoleProtectedRoute