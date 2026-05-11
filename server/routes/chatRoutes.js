const express = require('express')
const router = express.Router()
const { getMessages, getConversations, markAsRead } = require('../controllers/chatController')
const { protect } = require('../middleware/authMiddleware')

router.get('/conversations', protect, getConversations)
router.get('/:otherUserId', protect, getMessages)
router.patch('/read/:senderId', protect, markAsRead)

module.exports = router
