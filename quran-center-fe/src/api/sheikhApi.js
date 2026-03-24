import axiosInstance from './axiosInstance'

export const getAllSheikhs = () => {
    return axiosInstance.get('/sheikhs')
}

export const getSheikhById = (id) => {
    return axiosInstance.get(`/sheikhs/${id}`)
}

export const createSheikh = (data) => {
    return axiosInstance.post('/sheikhs', data)
}

export const updateSheikh = (id, data) => {
    return axiosInstance.put(`/sheikhs/${id}`, data)
}

export const deleteSheikh = (id) => {
    return axiosInstance.delete(`/sheikhs/${id}`)
}