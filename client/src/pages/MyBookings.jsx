import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyBookings } from '../api/bookings'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const res = await getMyBookings()
      setBookings(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-IN', options)
  }

  const formatPrice = (p) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p)

  if (loading) {
    return (
      <div className="layout-wrapper">
        <Navbar />
        <div className="bookings-page page-header-spacing" style={{ minHeight: '80vh' }}>
          <div className="bookings-header">
            <h1>My Bookings</h1>
            <div className="skeleton" style={{ height: 24, width: '40%', borderRadius: 4 }}></div>
          </div>
          <div className="bookings-grid">
            {[1, 2, 3].map(i => (
              <div key={i} className="booking-card">
                <div className="skeleton" style={{ height: 180 }}></div>
                <div className="booking-card-content">
                  <div className="skeleton" style={{ height: 24, width: '70%', marginBottom: 10 }}></div>
                  <div className="skeleton" style={{ height: 60, width: '100%', marginBottom: 10 }}></div>
                </div>
              </div>
            ))}
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
          <div className="alert-box alert-error">{error}</div>
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
          <h1>My Bookings</h1>
          <p>Track the status of your venue booking requests</p>
        </div>

        {bookings.length === 0 ? (
          <div className="no-bookings">
            <div className="no-bookings-icon">📅</div>
            <h2>No bookings yet</h2>
            <p>You haven't made any venue booking requests.</p>
            <button className="btn btn-primary" onClick={() => navigate('/venues')}>
              Explore Venues
            </button>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map((booking) => (
              <div key={booking._id} className="booking-card">
                <img
                  src={booking.venue?.images?.[0]?.url || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80'}
                  alt={booking.venue?.name}
                  className="booking-card-img"
                />
                <div className="booking-card-content">
                  <div className="booking-card-header">
                    <div>
                      <h3 className="booking-venue-name">{booking.venue?.name || 'Unknown Venue'}</h3>
                      <p className="booking-venue-location">📍 {booking.venue?.location?.city || 'Unknown'}</p>
                    </div>
                    <span className={`booking-status status-${booking.status}`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="booking-details">
                    <div className="booking-detail-item">
                      <span className="booking-detail-label">Requested Date</span>
                      <span className="booking-detail-value">{formatDate(booking.date)}</span>
                    </div>
                    <div className="booking-detail-item">
                      <span className="booking-detail-label">Guests</span>
                      <span className="booking-detail-value">{booking.guestCount}</span>
                    </div>
                  </div>

                  <div className="booking-price-row">
                    <span className="booking-price-label">Estimated Total</span>
                    <span className="booking-price-total">{formatPrice(booking.totalPrice)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
