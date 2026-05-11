const Message = require('../models/Message')
const User = require('../models/User')

// @desc    Get messages between current user and another user
// @route   GET /api/chat/:otherUserId
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const { otherUserId } = req.params
    const currentUserId = req.user.id

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId },
      ],
    }).sort({ createdAt: 1 })

    res.json({ success: true, data: messages })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// @desc    Get list of unique conversations for current user
// @route   GET /api/chat/conversations
// @access  Private
exports.getConversations = async (req, res) => {
  try {
    const currentUserId = req.user._id.toString()

    // Find messages involving current user
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    }).sort({ createdAt: -1 })

    // Extract unique other users
    const usersMap = new Map()

    for (const msg of messages) {
      if (!msg.sender || !msg.receiver) continue;
      
      const isSender = msg.sender.toString() === currentUserId
      const otherUserId = isSender ? msg.receiver.toString() : msg.sender.toString()

      if (!usersMap.has(otherUserId)) {
        // Fetch user details
        const userDetails = await User.findById(otherUserId).select('name email role')
        if (userDetails) {
          usersMap.set(otherUserId, {
            user: userDetails,
            lastMessage: msg.text,
            lastMessageTime: msg.createdAt,
            unread: msg.receiver.toString() === currentUserId && !msg.isRead,
          })
        }
      }
    }

    const conversations = Array.from(usersMap.values())
    res.json({ success: true, data: conversations })
  } catch (err) {
    console.error('getConversations error:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// @desc    Mark messages as read
// @route   PATCH /api/chat/read/:senderId
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const { senderId } = req.params
    const currentUserId = req.user.id

    await Message.updateMany(
      { sender: senderId, receiver: currentUserId, isRead: false },
      { $set: { isRead: true } }
    )

    res.json({ success: true, message: 'Messages marked as read' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
