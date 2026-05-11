const User = require('../models/User')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const sendEmail = require('../utils/sendEmail')

// Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  })
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' })
    }

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' })
    }

    const user = await User.create({ name, email, password })

    const token = generateToken(user._id)

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        _id:   user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
        favorites: user.favorites || [],
      },
    })
  } catch (err) {
    console.error('Register error details:', err)
    res.status(500).json({ 
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    })
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' })
    }

    // Select password explicitly (select: false in schema)
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = generateToken(user._id)

    res.json({
      message: 'Logged in successfully',
      token,
      user: {
        _id:   user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
        favorites: user.favorites || [],
      },
    })
  } catch (err) {
    console.error('Login error:', err.message)
    res.status(500).json({ message: 'Server error during login' })
  }
}

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
      favorites: user.favorites || [],
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return res.status(404).json({ message: 'There is no user with that email' })
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken()

  await user.save({ validateBeforeSave: false })

  // Create reset URL
  const resetUrl = `${req.get('origin')}/reset-password/${resetToken}`

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
      html: `
        <h3>Password Reset Request</h3>
        <p>You are receiving this email because you (or someone else) has requested the reset of a password.</p>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetUrl}" style="background: #C8A97E; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
      `
    })

    res.status(200).json({ message: 'Email sent' })
  } catch (err) {
    console.error('Email send error:', err)
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save({ validateBeforeSave: false })

    return res.status(500).json({ message: 'Email could not be sent' })
  }
}

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
const resetPassword = async (req, res) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex')

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  })

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired token' })
  }

  // Set new password
  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined
  await user.save()

  // Send new token
  const token = generateToken(user._id)

  res.status(200).json({
    message: 'Password reset successful',
    token,
    user: {
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
      favorites: user.favorites || [],
    },
  })
}

module.exports = { register, login, getMe, forgotPassword, resetPassword }
