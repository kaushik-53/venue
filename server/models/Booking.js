const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Booking date is required'],
    },
    guestCount: {
      type: Number,
      required: [true, 'Guest count is required'],
      min: 1,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    specialRequests: {
      type: String,
      default: '',
    },
    totalPrice: {
      type: Number,
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
    },
    razorpayOrderId: {
      type: String,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Booking', bookingSchema)
