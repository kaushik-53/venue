import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFavorites } from '../api/users'
import VenueCard, { VenueCardSkeleton } from '../components/VenueCard'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Favorites() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    fetchFavorites()
  }, [])

  // Remove venues from the list if they are removed from favorites context
  useEffect(() => {
    if (user?.favorites && favorites.length > 0) {
      setFavorites(prev => prev.filter(v => user.favorites.includes(v._id)))
    }
  }, [user?.favorites])

  const fetchFavorites = async () => {
    try {
      const res = await getFavorites()
      setFavorites(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch favorites')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="layout-wrapper">
        <Navbar />
        <div className="bookings-page page-header-spacing" style={{ minHeight: '80vh' }}>
          <div className="bookings-header">
            <h1>Saved Venues</h1>
            <div className="skeleton" style={{ height: 24, width: '40%', borderRadius: 4 }}></div>
          </div>
          <div className="venues-grid">
            {[1, 2, 3].map(i => <VenueCardSkeleton key={i} />)}
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="layout-wrapper">
        <Navbar />
        <div className="bookings-page page-header-spacing" style={{ minHeight: '80vh' }}>
          <div className="alert-box error">{error}</div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="layout-wrapper">
      <Navbar />
      <div className="bookings-page page-header-spacing page-enter" style={{ minHeight: '80vh' }}>
        <div className="bookings-header">
          <h1>Saved Venues</h1>
          <p>Venues you've favorited for your big day</p>
        </div>

        {favorites.length === 0 ? (
          <div className="no-bookings">
            <div className="no-bookings-icon">❤️</div>
            <h2>No favorites yet</h2>
            <p>You haven't saved any venues to your favorites list.</p>
            <button className="btn btn-primary" onClick={() => navigate('/venues')}>
              Discover Venues
            </button>
          </div>
        ) : (
          <div className="venues-grid">
            {favorites.map((venue) => (
              <VenueCard key={venue._id} venue={venue} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
