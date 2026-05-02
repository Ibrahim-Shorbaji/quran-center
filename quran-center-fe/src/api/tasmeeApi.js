import axiosInstance from './axiosInstance'

export const getAllReports = () => axiosInstance.get('/tasmee')
export const getReportsByStudent = (studentId) => axiosInstance.get(`/tasmee/student/${studentId}`)
export const getReportsBySheikh = (sheikhId) => axiosInstance.get(`/tasmee/sheikh/${sheikhId}`)
export const createReport = (data) => axiosInstance.post('/tasmee', data)
export const deleteReport = (id) => axiosInstance.delete(`/tasmee/${id}`)