import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getVenues, getVenueStats } from '../api/venues'
import VenueCard, { VenueCardSkeleton, Stars } from '../components/VenueCard'

/* ── Static content (UI copy — not data) ── */
const CATEGORIES = [
  { name: 'Banquet Hall', icon: '🏛️', desc: 'Grand indoor celebrations' },
  { name: 'Garden',       icon: '🌿', desc: 'Lush outdoor settings' },
  { name: 'Poolside',     icon: '🏊', desc: 'Glamorous pool venues' },
  { name: 'Resort',       icon: '🏨', desc: 'All-inclusive retreats' },
  { name: 'Farmhouse',    icon: '🌾', desc: 'Rustic countryside charm' },
  { name: 'Hotel',        icon: '✨', desc: 'Luxury hotel ballrooms' },
]

const FEATURES = [
  { icon: '🔍', title: 'Easy Search',      desc: 'Filter by city, price, capacity and amenities to find your perfect match instantly.' },
  { icon: '📸', title: 'Real Photos',      desc: 'Browse actual venue photos uploaded by owners — no misleading stock images.' },
  { icon: '📅', title: 'Simple Booking',   desc: 'Send a booking request directly from the venue page. No phone calls needed.' },
  { icon: '⭐', title: 'Verified Reviews', desc: "Read honest reviews from real couples who've celebrated at the venue." },
]

const TESTIMONIALS = [
  { id: 1, name: 'Priya & Arjun Sharma',   text: 'RoyalAisle made our dream wedding a reality. We found the perfect garden venue within our budget in just a few clicks. Absolutely seamless!', rating: 5, location: 'Mumbai', avatar: 'PS' },
  { id: 2, name: 'Neha & Rohan Kapoor',    text: 'The booking process was so smooth. The venue details and photos were accurate, and the team was very helpful. Highly recommend!',              rating: 5, location: 'Delhi',  avatar: 'NK' },
  { id: 3, name: 'Ananya & Vikram Mehta',  text: "We were overwhelmed by choices initially, but RoyalAisle's filters helped us narrow it down perfectly. Our poolside wedding was magical!", rating: 5, location: 'Goa',    avatar: 'AM' },
]


/* ── Main Home Page ── */
export default function Home() {
  const navigate = useNavigate()
  const [searchCity, setSearchCity] = useState('')

  // API state
  const [featuredVenues, setFeaturedVenues] = useState([])
  const [loadingVenues,  setLoadingVenues]  = useState(true)
  const [stats, setStats] = useState({ totalVenues: null, totalCities: null })

  useEffect(() => {
    // Fetch featured venues and live stats in parallel
    Promise.all([
      getVenues({ featured: true, limit: 6 }),
      getVenueStats(),
    ])
      .then(([venuesRes, statsRes]) => {
        setFeaturedVenues(venuesRes.data.venues)
        setStats(statsRes.data)
      })
      .catch((err) => {
        console.error('Home fetch error:', err.message)
        // Keep empty arrays — UI handles gracefully
      })
      .finally(() => setLoadingVenues(false))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const q = searchCity.trim()
    navigate(q ? `/venues?city=${encodeURIComponent(q)}` : '/venues')
  }

  return (
    <>
      <Navbar />
      <main>

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-overlay" />
          <div className="hero-content">
            <span className="hero-badge">✨ Find Your Dream Wedding Venue</span>
            <h1 className="hero-title">
              Where Every Love Story<br />Finds Its Perfect Stage
            </h1>
            <p className="hero-subtitle">
              Discover stunning venues across India. Compare, explore, and book — all in one place.
            </p>
            <form className="hero-search" onSubmit={handleSearch}>
              <div className="hero-search-inner">
                <span className="search-icon">📍</span>
                <input
                  id="hero-city-search"
                  type="text"
                  placeholder="Search by city — Mumbai, Delhi, Goa..."
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="hero-search-input"
                />
                <button id="hero-search-btn" type="submit" className="btn btn-primary hero-search-btn">
                  Search Venues
                </button>
              </div>
            </form>
            <div className="hero-stats">
              <div className="hero-stat">
                <strong>{stats.totalVenues !== null ? `${stats.totalVenues}+` : '—'}</strong>
                <span>Venues</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <strong>{stats.totalCities !== null ? `${stats.totalCities}+` : '—'}</strong>
                <span>Cities</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat"><strong>10k+</strong><span>Happy Couples</span></div>
            </div>
          </div>
        </section>

        {/* ── FEATURED VENUES ── */}
        <section className="section">
          <div className="container">
            <div className="section-header">
              <p className="section-label">Handpicked For You</p>
              <h2 className="section-title">Featured Venues</h2>
              <div className="divider" />
            </div>

            {loadingVenues ? (
              /* Loading skeletons */
              <div className="venues-grid">
                {[1, 2, 3].map((n) => <VenueCardSkeleton key={n} />)}
              </div>
            ) : featuredVenues.length > 0 ? (
              /* Real data from API */
              <div className="venues-grid">
                {featuredVenues.map((v) => <VenueCard key={v._id} venue={v} />)}
              </div>
            ) : (
              /* Empty state */
              <div className="empty-state">
                <p className="empty-state-icon">🏛️</p>
                <h3>No featured venues yet</h3>
                <p>New venues are being added. Check back soon or browse all venues.</p>
                <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/venues')}>
                  Browse All Venues
                </button>
              </div>
            )}

            {!loadingVenues && featuredVenues.length > 0 && (
              <div className="section-cta">
                <button className="btn btn-outline" onClick={() => navigate('/venues')}>
                  View All Venues →
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── CATEGORIES ── */}
        <section className="section section-alt">
          <div className="container">
            <div className="section-header">
              <p className="section-label">Browse By Type</p>
              <h2 className="section-title">Venue Categories</h2>
              <div className="divider" />
            </div>
            <div className="categories-grid">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.name}
                  className="category-card"
                  onClick={() => navigate(`/venues?category=${encodeURIComponent(cat.name)}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/venues?category=${encodeURIComponent(cat.name)}`)}
                >
                  <div className="category-icon">{cat.icon}</div>
                  <h3 className="category-name">{cat.name}</h3>
                  <p className="category-desc">{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY US ── */}
        <section className="section">
          <div className="container">
            <div className="section-header">
              <p className="section-label">Why Choose Us</p>
              <h2 className="section-title">Planning Made Simple</h2>
              <div className="divider" />
            </div>
            <div className="features-grid">
              {FEATURES.map((f) => (
                <div key={f.title} className="feature-card">
                  <div className="feature-icon">{f.icon}</div>
                  <h3 className="feature-title">{f.title}</h3>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="section section-alt">
          <div className="container">
            <div className="section-header">
              <p className="section-label">Love Stories</p>
              <h2 className="section-title">Happy Couples</h2>
              <div className="divider" />
            </div>
            <div className="testimonials-grid">
              {TESTIMONIALS.map((t) => (
                <div key={t.id} className="testimonial-card">
                  <div className="testimonial-stars"><Stars count={t.rating} /></div>
                  <p className="testimonial-text">"{t.text}"</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">{t.avatar}</div>
                    <div>
                      <p className="testimonial-name">{t.name}</p>
                      <p className="testimonial-location">📍 {t.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section className="cta-banner">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Find Your Dream Venue?</h2>
              <p>Join thousands of couples who found their perfect wedding venue on RoyalAisle.</p>
              <div className="cta-buttons">
                <button className="btn btn-primary" onClick={() => navigate('/venues')}>
                  Explore Venues
                </button>
                <button className="btn btn-outline cta-outline" onClick={() => navigate('/register')}>
                  Create Free Account
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
