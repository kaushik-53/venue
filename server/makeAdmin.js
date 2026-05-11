require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./models/User')

// Get email from command line arguments
const email = process.argv[2]

if (!email) {
  console.log('❌ Please provide an email address!')
  console.log('Usage: node makeAdmin.js <user-email>')
  process.exit(1)
}

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to database.')

    const user = await User.findOne({ email })

    if (!user) {
      console.log(`❌ User with email "${email}" not found!`)
      process.exit(1)
    }

    if (user.role === 'admin') {
      console.log(`⚠️ User "${email}" is already an admin.`)
      process.exit(0)
    }

    user.role = 'admin'
    await user.save()

    console.log(`🎉 Success! User "${email}" is now an admin.`)
    console.log('You can now log in and access the /admin dashboard.')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    mongoose.connection.close()
    process.exit(0)
  }
}

makeAdmin()
