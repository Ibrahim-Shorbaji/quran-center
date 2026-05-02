import axiosInstance from './axiosInstance'

export const getHomeworkByStudent = (studentId) =>
    axiosInstance.get(`/homework/student/${studentId}`)

export const createHomework = (data) =>
    axiosInstance.post('/homework', data)

export const markAsReviewed = (id) =>
    axiosInstance.patch(`/homework/${id}/review`)

export const deleteHomework = (id) =>
    axiosInstance.delete(`/homework/${id}`)