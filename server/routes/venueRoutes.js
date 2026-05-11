const express = require('express')
const router  = express.Router()
const { getVenues, getVenueById, createVenue, updateVenue, deleteVenue, getStats, addVenueReview } = require('../controllers/venueController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

// Public
router.get('/stats', getStats)
router.get('/',      getVenues)
router.get('/:id',   getVenueById)
router.post('/:id/reviews', protect, addVenueReview)

// Admin only
router.post('/',       protect, adminOnly, createVenue)
router.put('/:id',     protect, adminOnly, updateVenue)
router.delete('/:id',  protect, adminOnly, deleteVenue)

module.exports = router
