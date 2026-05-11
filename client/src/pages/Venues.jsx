import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import VenueCard, { VenueCardSkeleton } from '../components/VenueCard'
import { getVenues } from '../api/venues'

const CATEGORIES = ['Banquet Hall', 'Garden', 'Poolside', 'Resort', 'Farmhouse', 'Hotel']
const AMENITIES  = ['ac', 'parking', 'catering', 'indoor', 'outdoor', 'pool']

export default function Venues() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [filters, setFilters] = useState({
    city:     searchParams.get('city') || '',
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    capacity: '',
    ac:       false,
    parking:  false,
    catering: false,
    indoor:   false,
    outdoor:  false,
    pool:     false,
  })

  const [venues, setVenues]   = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage]       = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Fetch Venues
  const fetchVenues = async (pageNum = 1, append = false) => {
    setLoading(true)
    try {
      // Build query string
      const query = { page: pageNum, limit: 9 }
      if (filters.city) query.city = filters.city
      if (filters.category) query.category = filters.category
      if (filters.minPrice) query.minPrice = filters.minPrice
      if (filters.maxPrice) query.maxPrice = filters.maxPrice
      if (filters.capacity) query.capacity = filters.capacity

      const activeAmenities = AMENITIES.filter((a) => filters[a]).join(',')
      if (activeAmenities) query.amenities = activeAmenities

      const res = await getVenues(query)
      
      setVenues(prev => append ? [...prev, ...res.data.venues] : res.data.venues)
      setHasMore(res.data.pagination.page < res.data.pagination.pages)
    } catch (err) {
      console.error('Error fetching venues:', err.message)
    } finally {
      setLoading(false)
    }
  }

  // Effect to refetch when filters change
  useEffect(() => {
    setPage(1)
    fetchVenues(1, false)
    
    // Update URL to match main filters
    const newParams = new URLSearchParams()
    if (filters.city) newParams.set('city', filters.city)
    if (filters.category) newParams.set('category', filters.category)
    setSearchParams(newParams, { replace: true })
  }, [filters])

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleClearFilters = () => {
    setFilters({
      city: '', category: '', minPrice: '', maxPrice: '', capacity: '',
      ac: false, parking: false, catering: false, indoor: false, outdoor: false, pool: false,
    })
  }

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchVenues(nextPage, true)
  }

  return (
    <>
      <Navbar />
      
      {/* Mini header */}
      <div className="venues-header">
        <div className="container">
          <h1>Find Venues</h1>
          <p>Discover the perfect location for your special day</p>
        </div>
      </div>

      <div className="container venues-layout">
        
        {/* Mobile filter toggle */}
        <button 
          className="btn btn-outline mobile-filter-toggle"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          {showMobileFilters ? '✕ Close Filters' : '⧨ Show Filters'}
        </button>

        {/* Sidebar Filters */}
        <aside className={`venues-sidebar ${showMobileFilters ? 'open' : ''}`}>
          <div className="filter-panel card">
            <div className="filter-header">
              <h3>Filters</h3>
              <button className="clear-filters-btn" onClick={handleClearFilters}>Clear All</button>
            </div>



            <div className="filter-group">
              <label>City or Location</label>
              <input type="text" name="city" className="input" placeholder="e.g. Mumbai" value={filters.city} onChange={handleFilterChange} />
            </div>

            <div className="filter-group">
              <label>Category</label>
              <select name="category" className="input" value={filters.category} onChange={handleFilterChange}>
                <option value="">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="filter-divider" />

            <div className="filter-group">
              <label>Price Range (₹)</label>
              <div className="filter-row">
                <input type="number" name="minPrice" className="input" placeholder="Min" value={filters.minPrice} onChange={handleFilterChange} />
                <span>-</span>
                <input type="number" name="maxPrice" className="input" placeholder="Max" value={filters.maxPrice} onChange={handleFilterChange} />
              </div>
            </div>

            <div className="filter-group">
              <label>Minimum Guests</label>
              <input type="number" name="capacity" className="input" placeholder="e.g. 200" value={filters.capacity} onChange={handleFilterChange} />
            </div>

            <div className="filter-divider" />

            <div className="filter-group">
              <label>Amenities</label>
              <div className="checkbox-grid">
                {AMENITIES.map(a => (
                  <label key={a} className="checkbox-label">
                    <input type="checkbox" name={a} checked={filters[a]} onChange={handleFilterChange} />
                    <span className="checkbox-text">{a.charAt(0).toUpperCase() + a.slice(1)}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Mobile close button inside sidebar */}
            <button 
              className="btn btn-primary mobile-filter-close"
              onClick={() => setShowMobileFilters(false)}
            >
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Main Grid */}
        <main className="venues-main">
          
          {loading && page === 1 ? (
            <div className="venues-grid">
              {[1, 2, 3, 4, 5, 6].map(n => <VenueCardSkeleton key={n} />)}
            </div>
          ) : venues.length > 0 ? (
            <>
              <div className="venues-grid">
                {venues.map(v => <VenueCard key={v._id} venue={v} />)}
              </div>
              
              {hasMore && (
                <div className="load-more-wrap">
                  <button className="btn btn-outline" onClick={handleLoadMore} disabled={loading}>
                    {loading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state card">
              <p className="empty-state-icon">🔍</p>
              <h3>No venues found</h3>
              <p>Try adjusting your filters or search criteria to find what you're looking for.</p>
              <button className="btn btn-primary" onClick={handleClearFilters} style={{ marginTop: 16 }}>
                Clear Filters
              </button>
            </div>
          )}

        </main>
      </div>

      <Footer />
    </>
  )
}
