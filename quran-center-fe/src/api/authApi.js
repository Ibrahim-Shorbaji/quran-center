import axiosInstance from './axiosInstance'

export const loginApi = (credentials) => {
    return axiosInstance.post('/auth/login', credentials)
}

export const getCurrentUser = () => axiosInstance.get('/auth/me')

export const getMyProfile = () => axiosInstance.get('/auth/my-profile')