const Venue = require('../models/Venue')

// @desc    Get all venues with optional filters
// @route   GET /api/venues
// @access  Public
const getVenues = async (req, res) => {
  try {
    const { city, minPrice, maxPrice, capacity, category, featured, amenities, sort, page = 1, limit = 12 } = req.query

    const filter = {}

    if (city)     filter['location.city'] = { $regex: city, $options: 'i' }
    if (category) filter.category         = category
    if (featured === 'true') filter.featured = true

    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }

    if (capacity) filter.capacity = { $gte: Number(capacity) }

    // Amenity filters
    if (amenities) {
      amenities.split(',').forEach((a) => {
        filter[`amenities.${a.trim()}`] = true
      })
    }

    // Sort
    let sortOption = { createdAt: -1 }
    if (sort === 'price_asc')    sortOption = { price: 1 }
    if (sort === 'price_desc')   sortOption = { price: -1 }
    if (sort === 'rating')       sortOption = { 'rating.average': -1 }

    const skip  = (Number(page) - 1) * Number(limit)
    const total = await Venue.countDocuments(filter)
    const venues = await Venue.find(filter).sort(sortOption).skip(skip).limit(Number(limit))

    res.json({
      venues,
      pagination: {
        total,
        page:  Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    })
  } catch (err) {
    console.error('getVenues error:', err.message)
    res.status(500).json({ message: 'Server error fetching venues' })
  }
}

// @desc    Get single venue by ID
// @route   GET /api/venues/:id
// @access  Public
const getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id)
    if (!venue) return res.status(404).json({ message: 'Venue not found' })
    res.json(venue)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Create a venue
// @route   POST /api/venues
// @access  Admin
const createVenue = async (req, res) => {
  try {
    const data = { ...req.body, createdBy: req.user._id }
    
    // Sync locationPoint if coordinates exist
    if (data.location?.coordinates?.lat && data.location?.coordinates?.lng) {
      data.location.locationPoint = {
        type: 'Point',
        coordinates: [Number(data.location.coordinates.lng), Number(data.location.coordinates.lat)]
      }
    }

    const venue = await Venue.create(data)
    res.status(201).json(venue)
  } catch (err) {
    console.error('createVenue error:', err.message)
    res.status(400).json({ message: err.message })
  }
}

// @desc    Update a venue
// @route   PUT /api/venues/:id
// @access  Admin
const updateVenue = async (req, res) => {
  try {
    const data = { ...req.body }
    
    // Sync locationPoint if coordinates are being updated
    if (data.location?.coordinates?.lat && data.location?.coordinates?.lng) {
      data.location.locationPoint = {
        type: 'Point',
        coordinates: [Number(data.location.coordinates.lng), Number(data.location.coordinates.lat)]
      }
    }

    const venue = await Venue.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true })
    if (!venue) return res.status(404).json({ message: 'Venue not found' })
    res.json(venue)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}


// @desc    Delete a venue
// @route   DELETE /api/venues/:id
// @access  Admin
const deleteVenue = async (req, res) => {
  try {
    const venue = await Venue.findByIdAndDelete(req.params.id)
    if (!venue) return res.status(404).json({ message: 'Venue not found' })
    res.json({ message: 'Venue deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get summary stats for home page
// @route   GET /api/venues/stats
// @access  Public
const getStats = async (req, res) => {
  try {
    const totalVenues = await Venue.countDocuments()
    const cities      = await Venue.distinct('location.city')
    res.json({ totalVenues, totalCities: cities.length })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Add a review to a venue
// @route   POST /api/venues/:id/reviews
// @access  Private
const addVenueReview = async (req, res) => {
  try {
    const { rating, comment } = req.body
    
    if (!rating || !comment) {
      return res.status(400).json({ message: 'Please provide a rating and comment' })
    }

    const venue = await Venue.findById(req.params.id)

    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' })
    }

    // Check if user already reviewed
    const alreadyReviewed = venue.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Venue already reviewed' })
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    venue.reviews.push(review)
    venue.rating.count = venue.reviews.length
    venue.rating.average =
      venue.reviews.reduce((acc, item) => item.rating + acc, 0) /
      venue.reviews.length

    await venue.save()
    res.status(201).json({ message: 'Review added' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getVenues, getVenueById, createVenue, updateVenue, deleteVenue, getStats, addVenueReview }
