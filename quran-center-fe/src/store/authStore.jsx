import { useState, useEffect, createContext, useContext } from 'react'
import { setSessionExpiredHandler } from '../api/axiosInstance'

const AuthContext = createContext(null)

// Read the `exp` claim without verifying the signature — the backend is still
// the authority. This only stops us from trusting a session we know is dead.
// Returns the expiry in ms, or null if the token is unreadable.
const getTokenExpiry = (token) => {
    try {
        const payload = JSON.parse(
            atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
        )
        return payload.exp ? payload.exp * 1000 : null
    } catch {
        return null
    }
}

const isTokenExpired = (token) => {
    const expiry = getTokenExpiry(token)
    return expiry === null || expiry <= Date.now()
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    // When app starts → restore the session only if the token is still valid
    useEffect(() => {
        const savedToken = localStorage.getItem('token')
        const savedUser = localStorage.getItem('user')

        if (savedToken && savedUser && !isTokenExpired(savedToken)) {
            setToken(savedToken)
            setUser(JSON.parse(savedUser))
        } else if (savedToken || savedUser) {
            // Expired or half-written session → clear it out
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        }
        setLoading(false)
    }, [])

    // A 401 from any API call drops us back to a logged-out state
    useEffect(() => {
        setSessionExpiredHandler(logout)
        return () => setSessionExpiredHandler(null)
    }, [])

    // Log out the moment the token expires, even if the user is idle on a page
    // that makes no API calls — otherwise they'd sit in a dead session.
    useEffect(() => {
        if (!token) return

        const expiry = getTokenExpiry(token)
        if (expiry === null) {
            logout()
            return
        }

        const timer = setTimeout(logout, Math.max(0, expiry - Date.now()))
        return () => clearTimeout(timer)
    }, [token])

    const login = (userData, jwtToken) => {
        setUser(userData)
        setToken(jwtToken)
        localStorage.setItem('token', jwtToken)
        localStorage.setItem('user', JSON.stringify(userData))
    }

    const isAuthenticated = !!token

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook — any component can call useAuth() to get user info
export const useAuth = () => useContext(AuthContext)
