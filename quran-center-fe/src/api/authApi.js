import axiosInstance from './axiosInstance'

export const loginApi = (credentials) => {
    return axiosInstance.post('/auth/login', credentials)
}