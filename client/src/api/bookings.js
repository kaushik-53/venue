import API from './axios'

export const createBooking = (data) => API.post('/bookings', data)
export const getMyBookings = () => API.get('/bookings/my')
export const getVenueBookings = (venueId) => API.get(`/bookings/venue/${venueId}`)

// Admin
export const getAllBookings = () => API.get('/bookings')
export const updateBookingStatus = (id, status) => API.patch(`/bookings/${id}`, { status })

