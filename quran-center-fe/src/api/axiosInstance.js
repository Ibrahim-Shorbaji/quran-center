import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

// AuthProvider registers its logout here so an expired session clears React
// state too — ProtectedRoute then sends the user to /login on its own.
let onSessionExpired = null
export const setSessionExpiredHandler = (handler) => {
    onSessionExpired = handler
}

// Before every request → attach the token if it exists
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Any 401 on an authenticated call means the session is gone → log out.
// Login itself also answers 401 on bad credentials, so it is exempt —
// otherwise a typo would wipe the page before the error could be shown.
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const isLoginRequest = error.config?.url?.includes('/auth/login')

        if (error.response?.status === 401 && !isLoginRequest) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            if (onSessionExpired) onSessionExpired()
        }
        return Promise.reject(error)
    }
)

export default axiosInstance
