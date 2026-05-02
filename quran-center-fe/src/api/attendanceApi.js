import axiosInstance from './axiosInstance'

export const recordAttendance = (data) =>
    axiosInstance.post('/attendance', data)

export const getAttendanceByStudent = (studentId) =>
    axiosInstance.get(`/attendance/student/${studentId}`)