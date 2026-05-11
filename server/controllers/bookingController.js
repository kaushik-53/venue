const Booking = require('../models/Booking')
const Venue = require('../models/Venue')
const User = require('../models/User')
const sendEmail = require('../utils/sendEmail')

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const { venue: venueId, date, guestCount, specialRequests } = req.body

    if (!venueId || !date || !guestCount) {
      return res.status(400).json({ message: 'Please provide venue, date, and guest count' })
    }

    // Check if venue exists
    const venueExists = await Venue.findById(venueId)
    if (!venueExists) {
      return res.status(404).json({ message: 'Venue not found' })
    }

    // Check if already booked for this date
    const existingBooking = await Booking.findOne({
      venue: venueId,
      date: new Date(date),
      status: { $in: ['pending', 'approved'] }
    })

    if (existingBooking) {
      return res.status(400).json({ message: 'This venue is already booked or pending on the selected date.' })
    }

    const booking = await Booking.create({
      user: req.user._id,
      venue: venueId,
      date,
      guestCount,
      specialRequests,
      totalPrice: venueExists.price,
    })

    // 1. Send confirmation email to user
    try {
      await sendEmail({
        email: req.user.email,
        subject: 'Booking Request Received - RoyalAisle',
        message: `Your booking request for ${venueExists.name} on ${new Date(date).toDateString()} has been received and is pending approval.`,
        html: `
          <div style="font-family: sans-serif; color: #333;">
            <h2 style="color: #C8A97E;">Booking Request Received! 💍</h2>
            <p>Hello ${req.user.name},</p>
            <p>Thank you for choosing <strong>RoyalAisle</strong>. We have received your booking request for <strong>${venueExists.name}</strong>.</p>
            <div style="background: #F8F5F2; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Venue:</strong> ${venueExists.name}</p>
              <p><strong>Date:</strong> ${new Date(date).toDateString()}</p>
              <p><strong>Guests:</strong> ${guestCount}</p>
              <p><strong>Status:</strong> <span style="color: #FFA500;">Pending Approval</span></p>
            </div>
            <p>You will receive another email once the admin has reviewed your request.</p>
            <p>Best regards,<br/>The RoyalAisle Team</p>
          </div>
        `
      })
    } catch (err) {
      console.error('Email confirmation error:', err)
    }

    // 2. Emit socket event to admin room
    const io = req.app.get('io')
    io.to('admin').emit('newBooking', {
      message: `New booking request from ${req.user.name} for ${venueExists.name}`,
      bookingId: booking._id
    })

    res.status(201).json(booking)
  } catch (error) {
    next(error)
  }
}

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('venue', 'name location images category price')
      .sort({ createdAt: -1 })
    
    res.json(bookings)
  } catch (error) {
    next(error)
  }
}

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('venue', 'name')
      .sort({ createdAt: -1 })
    
    res.json(bookings)
  } catch (error) {
    next(error)
  }
}

// @desc    Update booking status (admin)
// @route   PATCH /api/bookings/:id
// @access  Private/Admin
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('venue', 'name')
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' })
    }

    booking.status = status
    await booking.save()

    // 1. Send status update email to user
    try {
      const statusColor = status === 'approved' ? '#4CAF50' : '#F44336'
      await sendEmail({
        email: booking.user.email,
        subject: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)} - RoyalAisle`,
        message: `Your booking for ${booking.venue.name} has been ${status}.`,
        html: `
          <div style="font-family: sans-serif; color: #333;">
            <h2 style="color: ${statusColor};">Booking ${status.charAt(0).toUpperCase() + status.slice(1)}! 🏛️</h2>
            <p>Hello ${booking.user.name},</p>
            <p>The status of your booking for <strong>${booking.venue.name}</strong> has been updated.</p>
            <div style="background: #F8F5F2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 5px solid ${statusColor};">
              <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${status.toUpperCase()}</span></p>
              <p><strong>Date:</strong> ${new Date(booking.date).toDateString()}</p>
            </div>
            <p>You can view more details in your <a href="${process.env.CLIENT_URL}/my-bookings" style="color: #C8A97E;">My Bookings</a> dashboard.</p>
            <p>Best regards,<br/>The RoyalAisle Team</p>
          </div>
        `
      })
    } catch (err) {
      console.error('Status email error:', err)
    }

    // 2. Emit socket event to user
    const io = req.app.get('io')
    io.to(booking.user._id.toString()).emit('bookingStatusUpdate', {
      message: `Your booking for ${booking.venue.name} has been ${status}`,
      status,
      bookingId: booking._id
    })

    res.json(booking)
  } catch (error) {
    next(error)
  }
}

// @desc    Get all booked dates for a specific venue
// @route   GET /api/bookings/venue/:venueId
// @access  Public
exports.getVenueBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ 
      venue: req.params.venueId,
      status: { $in: ['pending', 'approved'] } 
    }).select('date -_id')
    
    // Return just the array of dates
    const dates = bookings.map(b => b.date)
    res.json(dates)
  } catch (error) {
    next(error)
  }
}

