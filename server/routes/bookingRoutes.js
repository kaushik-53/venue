const express = require('express')
const router = express.Router()
const { 
  createBooking, 
  getMyBookings, 
  getAllBookings, 
  updateBookingStatus,
  getVenueBookings 
} = require('../controllers/bookingController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.post('/', protect, createBooking)
router.get('/my', protect, getMyBookings)
router.get('/venue/:venueId', getVenueBookings) // Publicly accessible to see availability

// Admin routes
router.get('/', protect, adminOnly, getAllBookings)
router.patch('/:id', protect, adminOnly, updateBookingStatus)

module.exports = router

