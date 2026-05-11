const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: [true, 'Message text is required'],
    },
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

// Index for faster fetching of conversation history
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 })
messageSchema.index({ receiver: 1, sender: 1, createdAt: -1 })

module.exports = mongoose.model('Message', messageSchema)
