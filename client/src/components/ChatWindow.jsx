import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'
import { getMessages, markAsRead } from '../api/chat'

export default function ChatWindow({ receiver, venueId }) {
  const { user } = useAuth()
  const socket = useSocket()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (receiver?._id) {
      setLoading(true)
      getMessages(receiver._id)
        .then((res) => {
          setMessages(res.data.data)
          markAsRead(receiver._id)
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false))
    }
  }, [receiver?._id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (socket) {
      const handleReceive = (msg) => {
        if (msg.sender === receiver?._id || msg.sender === user?._id) {
          setMessages((prev) => [...prev, msg])
          if (msg.sender === receiver?._id) {
            markAsRead(receiver._id)
          }
        }
      }

      socket.on('receive_message', handleReceive)
      socket.on('message_sent', handleReceive)

      return () => {
        socket.off('receive_message', handleReceive)
        socket.off('message_sent', handleReceive)
      }
    }
  }, [socket, receiver?._id, user?._id])

  const handleSend = (e) => {
    e.preventDefault()
    if (!text.trim() || !socket) return

    const messageData = {
      sender: user._id,
      receiver: receiver._id,
      text: text.trim(),
      venueId: venueId || null,
    }

    socket.emit('send_message', messageData)
    setText('')
  }

  if (!receiver) {
    return (
      <div className="chat-empty">
        <span style={{ fontSize: '4rem' }}>💬</span>
        <h3>Select a conversation</h3>
        <p>Choose a contact from the list to start chatting.</p>
      </div>
    )
  }

  return (
    <div className="chat-main">
      <div className="chat-header">
        <div className="conv-avatar">{receiver.name.charAt(0)}</div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{receiver.name}</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            {receiver.role === 'admin' ? 'Venue Manager' : 'Client'}
          </span>
        </div>
      </div>

      <div className="message-list">
        {loading ? (
          <div className="chat-empty">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="chat-empty">No messages yet. Say hello!</div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={msg._id || i}
              className={`message-bubble ${
                msg.sender === user._id ? 'message-sent' : 'message-received'
              }`}
            >
              {msg.text}
              <span className="message-time">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <form onSubmit={handleSend} className="chat-input-form">
          <input
            type="text"
            className="chat-input"
            placeholder="Type your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={!text.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
