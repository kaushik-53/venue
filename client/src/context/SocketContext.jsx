import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext()

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    const socketInstance = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      withCredentials: true,
    })

    setSocket(socketInstance)

    return () => socketInstance.close()
  }, [])

  useEffect(() => {
    if (socket && user) {
      // Join personal room for private notifications
      socket.emit('join', user._id)

      // If admin, join admin room
      if (user.role === 'admin') {
        socket.emit('join', 'admin')
      }
    }
  }, [socket, user])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}
