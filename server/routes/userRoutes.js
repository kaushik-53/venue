const express = require('express')
const router = express.Router()
const { 
  toggleFavorite, 
  getFavorites, 
  getUserById,
  requestDeletionOTP,
  confirmDeletion
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.get('/favorites', protect, getFavorites)
router.post('/favorites/:venueId', protect, toggleFavorite)
router.get('/:id', protect, getUserById)

// Account Deletion
router.post('/request-deletion', protect, requestDeletionOTP)
router.delete('/confirm-deletion', protect, confirmDeletion)

module.exports = router
