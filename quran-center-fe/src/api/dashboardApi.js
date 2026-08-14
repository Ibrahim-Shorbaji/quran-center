import axiosInstance from './axiosInstance'

export const getAdminDashboard = () => axiosInstance.get('/dashboard/admin')
export const getSheikhDashboard = () => axiosInstance.get('/dashboard/sheikh')
export const getStudentDashboard = () => axiosInstance.get('/dashboard/student')