import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import VenueManager from '../components/admin/VenueManager'
import BookingManager from '../components/admin/BookingManager'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('venues')
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar />
      
      <div className="admin-container">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <h2 className="admin-sidebar-title">Admin Panel</h2>
          <nav className="admin-nav">
            <button 
              className={`btn ${activeTab === 'venues' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('venues')}
            >
              🏢 Manage Venues
            </button>
            <button 
              className={`btn ${activeTab === 'bookings' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('bookings')}
            >
              📅 Manage Bookings
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="admin-content">
          {activeTab === 'venues' && <VenueManager />}
          {activeTab === 'bookings' && <BookingManager />}
        </main>
      </div>

      <Footer />
    </div>
  )
}
