import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getVenueById, addReview } from '../api/venues'
import { createBooking } from '../api/bookings'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Stars, formatPrice } from '../components/VenueCard'
import { useAuth } from '../context/AuthContext'
import { toggleFavorite } from '../api/users'
import VenueMap from '../components/VenueMap'
import VenueAvailabilityCalendar from '../components/VenueAvailabilityCalendar'
import Venue360Viewer from '../components/Venue360Viewer'
import { generateBrochure } from '../utils/generateBrochure'

export default function VenueDetails() {
  const { id } = useParams()
  
  const [venue, setVenue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const { user, updateFavorites } = useAuth()
  const navigate = useNavigate()
  
  const [mainImage, setMainImage] = useState('')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [bookingForm, setBookingForm] = useState({ date: '', guestCount: '' })
  const [bookingStatus, setBookingStatus] = useState(null)
  const [bookingMsg, setBookingMsg] = useState('')

  // Review state
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [reviewLoading, setReviewLoading] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [reviewSuccess, setReviewSuccess] = useState('')

  useEffect(() => {
    getVenueById(id)
      .then(res => {
        setVenue(res.data)
        if (res.data.images && res.data.images.length > 0) {
          setMainImage(res.data.images[0].url)
        }
      })
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false))
  }, [id])

  // Auto-slideshow for multiple images
  useEffect(() => {
    if (venue?.images && venue.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => {
          const nextIndex = (prev + 1) % venue.images.length
          setMainImage(venue.images[nextIndex].url)
          return nextIndex
        })
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [venue?.images])

  const handleBookingChange = (e) => {
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value })
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    setBookingStatus('loading')
    setBookingMsg('')

    try {
      await createBooking({
        venue: id,
        date: bookingForm.date,
        guestCount: Number(bookingForm.guestCount)
      })
      setBookingStatus('success')
      setBookingMsg('Booking request sent! You will receive a mail shortly regarding your booking.')
      setBookingForm({ date: '', guestCount: '' })
    } catch (err) {
      setBookingStatus('error')
      setBookingMsg(err.response?.data?.message || 'Please Login First.')
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    
    setReviewLoading(true)
    setReviewError('')
    setReviewSuccess('')

    try {
      await addReview(id, reviewForm)
      setReviewSuccess('Thank you for your feedback!')
      setReviewForm({ rating: 5, comment: '' })
      // Refresh venue data to show new review
      const res = await getVenueById(id)
      setVenue(res.data)
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to add review.')
    } finally {
      setReviewLoading(false)
    }
  }

  if (loading) return (
    <><Navbar/><div className="container" style={{padding:'100px 0', textAlign:'center'}}>Loading Venue...</div><Footer/></>
  )
  
  if (error) return (
    <><Navbar/><div className="container" style={{padding:'100px 0', textAlign:'center', color:'red'}}>{error}</div><Footer/></>
  )

  if (!venue) return null

  const amenityIcons = { ac: '❄️', parking: '🅿️', catering: '🍽️', indoor: '🏠', outdoor: '🌳', pool: '🏊', dj: '🎵' }
  const fallbackImg = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80'

  const isFavorite = user?.favorites?.includes(venue._id)

  const handleFavoriteClick = async () => {
    if (!user) return navigate('/login')
    try {
      const res = await toggleFavorite(venue._id)
      updateFavorites(res.data.favorites)
    } catch (err) {
      console.error('Failed to toggle favorite', err)
    }
  }

  return (
    <>
      <Navbar />
      <div className="container venue-details-layout">
        
        {/* Left Column: Details */}
        <div className="venue-details-main">
          
          {/* Gallery */}
          <div className="venue-gallery">
            <div className="gallery-main">
              <img 
                key={mainImage} // Key helps trigger transition animations
                src={mainImage || fallbackImg} 
                alt={venue.name} 
                className="gallery-image-animate"
                onError={(e) => e.target.src = fallbackImg} 
              />
            </div>
            <div className="gallery-thumbnails">
              {venue.images?.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`thumbnail ${mainImage === img.url ? 'active' : ''}`}
                  onClick={() => setMainImage(img.url)}
                >
                  <img src={img.url} alt={`Thumbnail ${idx + 1}`} onError={(e) => e.target.src = fallbackImg} />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="venue-info-section">
            <div className="venue-header-row">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                  <h1 className="venue-title" style={{ margin: 0 }}>{venue.name}</h1>
                  <button 
                    className="btn btn-outline btn-sm" 
                    onClick={handleFavoriteClick}
                    style={{ borderRadius: '50%', width: 40, height: 40, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', border: 'none', background: isFavorite ? '#fff0f0' : '#f5f5f5' }}
                  >
                    {isFavorite ? '❤️' : '🤍'}
                  </button>
                </div>
                <p className="venue-location" style={{ marginTop: 5 }}>📍 {venue.location?.address ? venue.location.address + ', ' : ''}{venue.location?.city}</p>
              </div>
              <div className="venue-rating-badge">
                <Stars count={Math.round(venue.rating?.average || 0)} />
                <span>({venue.rating?.count || 0} reviews)</span>
              </div>
            </div>
            
            <div className="venue-description">
              <h3>About this venue</h3>
              <p>{venue.description || 'No description provided.'}</p>
            </div>

            {/* Map Section */}
            <div className="venue-location-section" style={{ marginTop: '40px' }}>
              <h3 style={{ marginBottom: '15px' }}>Location & Directions</h3>
              <VenueMap venue={venue} />
            </div>

            {/* 360 View Section */}
            {venue.panoramaUrl && (
              <Venue360Viewer url={venue.panoramaUrl} title={venue.name} />
            )}

            <div className="venue-amenities-section">
              <h3>Amenities</h3>
              <div className="amenities-grid">
                {Object.entries(venue.amenities || {}).filter(([, v]) => v).map(([k]) => (
                  <div key={k} className="amenity-item">
                    <span>{amenityIcons[k] || '✨'}</span>
                    <span>{k.charAt(0).toUpperCase() + k.slice(1)}</span>
                  </div>
                ))}
                <div className="amenity-item"><span>👥</span><span>Up to {venue.capacity} Guests</span></div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="venue-reviews-section">
              <div className="divider" style={{ margin: '40px 0' }} />
              <h3 style={{ marginBottom: '20px' }}>Reviews & Ratings</h3>
              
              <div className="reviews-grid">
                {/* Review Form */}
                <div className="review-form-card">
                  <h4>Write a Review</h4>
                  <form onSubmit={handleReviewSubmit}>
                    <div className="rating-select" style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Your Rating</label>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {[1, 2, 3, 4, 5].map(num => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: num })}
                            style={{ 
                              background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem',
                              filter: reviewForm.rating >= num ? 'none' : 'grayscale(100%) opacity(0.3)'
                            }}
                          >
                            ⭐
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <textarea
                        className="input"
                        placeholder="Share your experience..."
                        rows="3"
                        required
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        style={{ resize: 'none' }}
                      />
                    </div>
                    {reviewError && <p style={{ color: 'red', fontSize: '0.8rem' }}>{reviewError}</p>}
                    {reviewSuccess && <p style={{ color: 'green', fontSize: '0.8rem' }}>{reviewSuccess}</p>}
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      style={{ width: '100%', marginTop: '10px' }}
                      disabled={reviewLoading}
                    >
                      {reviewLoading ? 'Submitting...' : 'Post Review'}
                    </button>
                  </form>
                </div>

                {/* Review List */}
                <div className="review-list">
                  {venue.reviews?.length === 0 ? (
                    <div className="empty-reviews">
                      <p>No reviews yet. Be the first to share your experience!</p>
                    </div>
                  ) : (
                    venue.reviews?.map((r, idx) => (
                      <div key={idx} className="review-item">
                        <div className="review-user-row">
                          <div className="user-avatar">{r.name.charAt(0)}</div>
                          <div>
                            <strong>{r.name}</strong>
                            <div style={{ fontSize: '0.8rem', color: '#888' }}>{new Date(r.createdAt).toLocaleDateString()}</div>
                          </div>
                          <div className="user-rating" style={{ marginLeft: 'auto' }}>
                            <Stars count={r.rating} />
                          </div>
                        </div>
                        <p className="review-comment">{r.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Booking Panel */}
        <div className="venue-details-sidebar">
          <VenueAvailabilityCalendar venueId={id} />
          <div className="booking-panel card">
            <div className="booking-price-row">
              <span className="price">{formatPrice(venue.price)}</span>
              <span className="per-day">/ day</span>
            </div>
            
            <form onSubmit={handleBookingSubmit} className="booking-form">
              <div className="form-group">
                <label>Select Date</label>
                <input 
                  type="date" 
                  name="date" 
                  className="input" 
                  required 
                  value={bookingForm.date} 
                  onChange={handleBookingChange} 
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label>Total Guests</label>
                <input 
                  type="number" 
                  name="guestCount" 
                  className="input" 
                  placeholder={`Max ${venue.capacity}`} 
                  required 
                  min="1" 
                  max={venue.capacity}
                  value={bookingForm.guestCount} 
                  onChange={handleBookingChange} 
                />
              </div>

              {/* Smart Budgeter Breakdown */}
              {bookingForm.guestCount > 0 && (
                <div className="budgeter-wrap" style={{ 
                  marginTop: '20px', 
                  padding: '15px', 
                  background: 'var(--color-secondary)', 
                  borderRadius: '12px',
                  fontSize: '0.9rem'
                }}>
                  <h4 style={{ marginBottom: '10px', fontSize: '1rem' }}>💰 Smart Budgeter</h4>
                  <div className="budget-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span>Venue Base Price:</span>
                    <span>{formatPrice(venue.price)}</span>
                  </div>
                  <div className="budget-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span>Est. Catering (₹800/plate):</span>
                    <span>{formatPrice(bookingForm.guestCount * 800)}</span>
                  </div>
                  <div className="budget-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span>Taxes & GST (18%):</span>
                    <span>{formatPrice((venue.price + (bookingForm.guestCount * 800)) * 0.18)}</span>
                  </div>
                  <div className="divider" style={{ margin: '10px 0', borderTop: '1px dashed #ccc' }} />
                  <div className="budget-row" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '1.1rem', color: 'var(--color-accent-dark)' }}>
                    <span>Grand Total Est:</span>
                    <span>{formatPrice((venue.price + (bookingForm.guestCount * 800)) * 1.18)}</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '10px', textAlign: 'center' }}>
                    *Final quote may vary based on menu selection and extras.
                  </p>
                </div>
              )}


              {bookingStatus === 'success' && <div className="alert-box success">{bookingMsg}</div>}
              {bookingStatus === 'error' && <div className="alert-box error">{bookingMsg}</div>}

              <button 
                type="submit" 
                className="btn btn-primary auth-submit-btn"
                disabled={bookingStatus === 'loading'}
              >
                {bookingStatus === 'loading' ? 'Sending Request...' : 'Request to Book'}
              </button>
            </form>
            <p className="booking-note">You won't be charged yet. The venue owner will confirm availability first.</p>
          </div>

          <button 
            className="btn btn-outline" 
            style={{ width: '100%', marginTop: '20px', display: 'flex', gap: '8px', justifyContent: 'center' }}
            onClick={() => generateBrochure(venue)}
          >
            📄 Download PDF Brochure
          </button>

          <button 
            className="btn btn-outline" 
            style={{ 
              width: '100%', 
              marginTop: '10px', 
              display: 'flex', 
              gap: '8px', 
              justifyContent: 'center',
              borderColor: 'var(--color-accent)',
              color: 'var(--color-accent)'
            }}
            onClick={() => navigate(`/messages?user=${venue.createdBy}`)}
          >
            💬 Chat with Venue Owner
          </button>
        </div>


      </div>
      <Footer />
    </>
  )
}
