import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCompare } from '../context/CompareContext'
import { toggleFavorite } from '../api/users'

export const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p)

export const Stars = ({ count = 5 }) => (
  <span className="stars">{'★'.repeat(Math.max(0, count))}{'☆'.repeat(Math.max(0, 5 - count))}</span>
)

export function VenueCardSkeleton() {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="skeleton" style={{ height: 220 }} />
      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="skeleton" style={{ height: 20, width: '70%', borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 14, width: '40%', borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 16, width: '55%', borderRadius: 6 }} />
        <div style={{ display: 'flex', gap: 6 }}>
          <div className="skeleton" style={{ height: 24, width: 60, borderRadius: 20 }} />
          <div className="skeleton" style={{ height: 24, width: 70, borderRadius: 20 }} />
        </div>
      </div>
    </div>
  )
}

export default function VenueCard({ venue }) {
  const [currentImgIdx, setCurrentImgIdx] = useState(0)
  const navigate = useNavigate()
  const amenityIcons = {
    ac: '❄️', parking: '🅿️', catering: '🍽️',
    indoor: '🏠', outdoor: '🌳', pool: '🏊', dj: '🎵',
  }
  const activeAmenities = Object.entries(venue.amenities || {})
    .filter(([, v]) => v)
    .slice(0, 3)

  const { user, updateFavorites } = useAuth()
  const { isInCompare, addToCompare, removeFromCompare } = useCompare()
  const fallbackImg = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80'

  useEffect(() => {
    if (venue.images && venue.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImgIdx(prev => (prev + 1) % venue.images.length)
      }, 4000 + Math.random() * 2000) // Randomize interval (4-6s) to prevent synchronized switching
      return () => clearInterval(interval)
    }
  }, [venue.images])

  const isFavorite = user?.favorites?.includes(venue._id)

  const handleFavoriteClick = async (e) => {
    e.stopPropagation() // prevent navigating to details
    if (!user) return navigate('/login')
    
    try {
      const res = await toggleFavorite(venue._id)
      updateFavorites(res.data.favorites)
    } catch (err) {
      console.error('Failed to toggle favorite', err)
    }
  }

  return (
    <div
      className="venue-card card"
      onClick={() => navigate(`/venues/${venue._id}`)}
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/venues/${venue._id}`)}
    >
      <div className="venue-card-img-wrap">
        <img
          key={currentImgIdx}
          src={venue.images?.[currentImgIdx]?.url || fallbackImg}
          alt={venue.name}
          className="venue-card-img gallery-image-animate"
          onError={(e) => { e.target.src = fallbackImg }}
        />
        <span className="venue-card-category">{venue.category}</span>
        <button 
          className="favorite-btn" 
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
        <button 
          className="compare-toggle-btn"
          onClick={(e) => {
            e.stopPropagation()
            isInCompare(venue._id) ? removeFromCompare(venue._id) : addToCompare(venue)
          }}
          aria-label={isInCompare(venue._id) ? 'Remove from comparison' : 'Add to comparison'}
          style={{
            position: 'absolute',
            top: '50px',
            left: '10px',
            background: 'rgba(255,255,255,0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 10,
            color: isInCompare(venue._id) ? 'var(--color-accent)' : '#888'
          }}
        >
          {isInCompare(venue._id) ? '📊' : '📈'}
        </button>
      </div>

      <div className="venue-card-body">
        <h3 className="venue-card-name">{venue.name}</h3>
        <p className="venue-card-location">📍 {venue.location?.city}</p>
        <div className="venue-card-meta">
          <span className="venue-card-price">
            {formatPrice(venue.price)}<span className="per-day">/day</span>
          </span>
          <span className="venue-card-rating">
            <Stars count={Math.round(venue.rating?.average || 0)} />
            <span>{venue.rating?.average?.toFixed(1) || '—'}</span>
          </span>
        </div>
        <div className="venue-card-amenities">
          {activeAmenities.map(([key]) => (
            <span key={key} className="amenity-tag">{amenityIcons[key]} {key}</span>
          ))}
          <span className="amenity-tag">👥 {venue.capacity}</span>
        </div>
      </div>
    </div>
  )
}
