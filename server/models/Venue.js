const mongoose = require('mongoose')

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Venue name is required'],
      trim: true,
    },
    location: {
      city: { type: String, required: true },
      address: { type: String },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
      plusCode: { type: String },
      // GeoJSON Point for $near queries
      locationPoint: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
      }
    },

    price: {
      type: Number,
      required: [true, 'Price per day is required'],
      min: 0,
    },
    capacity: {
      type: Number,
      required: [true, 'Max capacity is required'],
      min: 1,
    },
    description: {
      type: String,
      default: '',
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String }, // Cloudinary public_id for deletion
      },
    ],
    panoramaUrl: { type: String }, // For 360 degree panoramic view

    amenities: {
      ac: { type: Boolean, default: false },
      parking: { type: Boolean, default: false },
      catering: { type: Boolean, default: false },
      indoor: { type: Boolean, default: false },
      outdoor: { type: Boolean, default: false },
      pool: { type: Boolean, default: false },
      dj: { type: Boolean, default: false },
    },
    category: {
      type: String,
      enum: ['Banquet Hall', 'Garden', 'Poolside', 'Resort', 'Farmhouse', 'Hotel'],
      default: 'Banquet Hall',
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
)

// Text index for search
venueSchema.index({ name: 'text', 'location.city': 'text', description: 'text' })

// 2dsphere index for Geo-location queries
venueSchema.index({ 'location.locationPoint': '2dsphere' })

module.exports = mongoose.model('Venue', venueSchema)

