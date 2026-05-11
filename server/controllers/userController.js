const User = require('../models/User')
const Booking = require('../models/Booking')
const Message = require('../models/Message')
const Venue = require('../models/Venue')
const sendEmail = require('../utils/sendEmail')

// @desc    Toggle favorite venue
// @route   POST /api/users/favorites/:venueId
// @access  Private
exports.toggleFavorite = async (req, res, next) => {
  try {
    const { venueId } = req.params
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Check if venue is already in favorites
    const isFavorited = user.favorites.includes(venueId)

    if (isFavorited) {
      // Remove from favorites
      user.favorites = user.favorites.filter((id) => id.toString() !== venueId)
    } else {
      // Add to favorites
      user.favorites.push(venueId)
    }

    await user.save()

    res.json({
      message: isFavorited ? 'Removed from favorites' : 'Added to favorites',
      favorites: user.favorites,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get user's favorite venues
// @route   GET /api/users/favorites
// @access  Private
exports.getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites')
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user.favorites)
  } catch (error) {
    next(error)
  }
}

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('name email role')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (error) {
    next(error)
  }
}

// @desc    Request account deletion OTP
// @route   POST /api/users/request-deletion
// @access  Private
exports.requestDeletionOTP = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    user.deletionOTP = otp
    user.deletionOTPExpire = Date.now() + 10 * 60 * 1000 // 10 mins
    await user.save()

    const emailMessage = `Your account deletion OTP is: ${otp}. It will expire in 10 minutes. If you did not request this, please ignore this email.`

    try {
      await sendEmail({
        email: user.email,
        subject: 'Account Deletion OTP — RoyalAisle',
        message: emailMessage,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #d32f2f;">Account Deletion Request</h2>
            <p>You requested to delete your RoyalAisle account. Please use the following OTP to confirm:</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 10px; background: #f9f9f9; text-align: center; margin: 20px 0;">
              ${otp}
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p style="color: #888; font-size: 12px;">If you didn't request this, your account is still safe. No action is required.</p>
          </div>
        `,
      })

      res.json({ message: 'OTP sent to your email' })
    } catch (err) {
      user.deletionOTP = undefined
      user.deletionOTPExpire = undefined
      await user.save()
      return res.status(500).json({ message: 'Email could not be sent' })
    }
  } catch (error) {
    next(error)
  }
}

// @desc    Confirm account deletion
// @route   DELETE /api/users/confirm-deletion
// @access  Private
exports.confirmDeletion = async (req, res, next) => {
  try {
    const { otp } = req.body
    if (!otp) return res.status(400).json({ message: 'Please provide OTP' })

    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    // Verify OTP
    if (user.deletionOTP !== otp || user.deletionOTPExpire < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' })
    }

    // Dynamic Data Erase
    // 1. Delete all bookings
    await Booking.deleteMany({ user: user._id })
    
    // 2. Delete all messages (as sender or receiver)
    await Message.deleteMany({
      $or: [{ sender: user._id }, { receiver: user._id }]
    })

    // 3. Remove user's reviews from all venues
    await Venue.updateMany(
      { "reviews.user": user._id },
      { $pull: { reviews: { user: user._id } } }
    )

    // 4. Delete user
    await user.deleteOne()

    res.json({ message: 'Account and all associated data deleted successfully' })
  } catch (error) {
    next(error)
  }
}
