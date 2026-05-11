import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ChatWindow from '../components/ChatWindow'
import { getConversations } from '../api/chat'
import { getUserById } from '../api/users' // Need to make sure this exists or use a fallback

export default function Messages() {
  const [conversations, setConversations] = useState([])
  const [selectedReceiver, setSelectedReceiver] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const targetId = queryParams.get('user')

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (targetId) {
      const existing = conversations.find(c => c.user?._id === targetId)
      if (existing) {
        setSelectedReceiver(existing.user)
      } else if (!selectedReceiver || selectedReceiver._id !== targetId) {
        // If not in existing conversations, fetch user details to start a new one
        getUserById(targetId).then(res => {
          setSelectedReceiver(res.data)
        }).catch(err => console.error('Error fetching target user', err))
      }
    }
  }, [targetId, conversations, selectedReceiver])

  const fetchConversations = async () => {
    try {
      const res = await getConversations()
      setConversations(res.data.data)
    } catch (err) {
      console.error('Error fetching conversations', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="chat-page page-enter">
        <aside className="chat-sidebar">
          <div className="chat-sidebar-header">
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Messages</h2>
          </div>
          
          <div className="chat-list">
            {loading ? (
              <div style={{ padding: 20 }}>Loading...</div>
            ) : conversations.length === 0 ? (
              <div className="empty-state">
                <p>No conversations yet.</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div 
                  key={conv.user._id} 
                  className={`conversation-item ${selectedReceiver?._id === conv.user._id ? 'active' : ''}`}
                  onClick={() => setSelectedReceiver(conv.user)}
                >
                  <div className="conv-avatar">{conv.user.name.charAt(0)}</div>
                  <div className="conv-info">
                    <span className="conv-name">{conv.user.name}</span>
                    <p className="conv-last-msg">{conv.lastMessage}</p>
                  </div>
                  {conv.unread && <div style={{ width: 8, height: 8, background: 'var(--color-accent)', borderRadius: '50%' }} />}
                </div>
              ))
            )}
          </div>
        </aside>

        <main className="chat-main">
          <ChatWindow receiver={selectedReceiver} />
        </main>
      </div>
    </>
  )
}
