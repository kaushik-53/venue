const cloudinary = require('cloudinary').v2
const multer = require('multer')
const { Readable } = require('stream')

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Use memory storage (buffer) with multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false)
    }
  },
})

/**
 * Upload a buffer to Cloudinary
 * @param {Buffer} buffer - image buffer
 * @param {string} folder - cloudinary folder name
 * @returns {Promise<{url, public_id}>}
 */
const uploadToCloudinary = (buffer, folder = 'wedding-venue-finder') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [
          { width: 1200, height: 800, crop: 'fill', quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) return reject(error)
        resolve({ url: result.secure_url, public_id: result.public_id })
      }
    )
    const readable = new Readable()
    readable.push(buffer)
    readable.push(null)
    readable.pipe(uploadStream)
  })
}

/**
 * Delete an image from Cloudinary
 * @param {string} public_id - cloudinary public_id
 */
const deleteFromCloudinary = async (public_id) => {
  return cloudinary.uploader.destroy(public_id)
}

module.exports = { cloudinary, upload, uploadToCloudinary, deleteFromCloudinary }
