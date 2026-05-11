require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./utils/connectDB')

const http = require('http')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  }
})

// Attach io to app to use in controllers
app.set('io', io)

// Connect to MongoDB
connectDB()

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Wedding Venue Finder API is running 🎉' })
})

app.use('/api/auth',     require('./routes/authRoutes'))
app.use('/api/venues',   require('./routes/venueRoutes'))
app.use('/api/bookings', require('./routes/bookingRoutes'))
app.use('/api/users',    require('./routes/userRoutes'))
app.use('/api/upload',   require('./routes/uploadRoutes'))
app.use('/api/chat',     require('./routes/chatRoutes'))

// Socket.io logic
const Message = require('./models/Message')

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('join', (userId) => {
    socket.join(userId)
    console.log(`User ${userId} joined their personal room`)
  })

  // Handle incoming message
  socket.on('send_message', async (data) => {
    try {
      const { sender, receiver, text, venueId } = data
      
      // 1. Save to database
      const newMessage = await Message.create({
        sender,
        receiver,
        text,
        venueId
      })

      // 2. Emit to receiver
      io.to(receiver).emit('receive_message', newMessage)
      
      // 3. Emit back to sender (for multi-device sync or just confirmation)
      socket.emit('message_sent', newMessage)

    } catch (err) {
      console.error('Socket message error:', err)
    }
  })

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
