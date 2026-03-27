import axiosInstance from './axiosInstance'

export const getAllHalqas = () => axiosInstance.get('/halqas')
export const getHalqaById = (id) => axiosInstance.get(`/halqas/${id}`)
export const createHalqa = (data) => axiosInstance.post('/halqas', data)
export const updateHalqa = (id, data) => axiosInstance.put(`/halqas/${id}`, data)
export const deleteHalqa = (id) => axiosInstance.delete(`/halqas/${id}`)