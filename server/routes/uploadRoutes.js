const express = require('express')
const router = express.Router()
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { protect, adminOnly } = require('../middleware/authMiddleware')

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Configure Multer
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' })
    }

    // Convert buffer to base64 for Cloudinary upload
    const b64 = Buffer.from(req.file.buffer).toString('base64')
    let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'wedding-venues',
    })

    res.json({ url: result.secure_url })
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    res.status(500).json({ message: 'Failed to upload image' })
  }
})

module.exports = router
