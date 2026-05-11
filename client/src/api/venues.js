import API from './axios'

export const getVenues      = (params) => API.get('/venues', { params })
export const getVenueById   = (id)     => API.get(`/venues/${id}`)
export const getVenueStats  = ()       => API.get('/venues/stats')
export const createVenue    = (data)   => API.post('/venues', data)
export const updateVenue    = (id, data) => API.put(`/venues/${id}`, data)
export const deleteVenue    = (id)     => API.delete(`/venues/${id}`)
export const addReview      = (id, data) => API.post(`/venues/${id}/reviews`, data)
