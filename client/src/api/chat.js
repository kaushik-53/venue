import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const API = axios.create({ baseURL: `${API_URL}/api/chat` })

// Add token to each request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token')
  if (token) {
    req.headers.Authorization = `Bearer ${token}`
  }
  return req
})

export const getMessages = (otherUserId) => API.get(`/${otherUserId}`)
export const getConversations = () => API.get('/conversations')
export const markAsRead = (senderId) => API.patch(`/read/${senderId}`)
