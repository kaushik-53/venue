import API from './axios'

export const toggleFavorite = (venueId) => API.post(`/users/favorites/${venueId}`)
export const getFavorites = () => API.get('/users/favorites')
export const getUserById = (userId) => API.get(`/users/${userId}`)
export const requestDeletionOTP = () => API.post('/users/request-deletion')
export const confirmDeletion = (otp) => API.delete('/users/confirm-deletion', { data: { otp } })
