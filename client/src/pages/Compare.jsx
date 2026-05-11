import { useCompare } from '../context/CompareContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { formatPrice, Stars } from '../components/VenueCard'
import { Link } from 'react-router-dom'

export default function Compare() {
  const { compareList, removeFromCompare, clearCompare } = useCompare()

  return (
    <>
      <Navbar />
      <div className="compare-page page-header-spacing">
        <div className="container">
          <div className="compare-header">
            <div>
              <h1>Venue Comparison</h1>
              <p>Compare your favorite venues side-by-side to make the best choice.</p>
            </div>
            {compareList.length > 0 && (
              <button className="btn btn-outline" onClick={clearCompare}>Clear All</button>
            )}
          </div>

          {compareList.length === 0 ? (
            <div className="empty-compare">
              <div className="empty-icon">📊</div>
              <h2>No venues to compare</h2>
              <p>Browse venues and click "Add to Compare" to see them here.</p>
              <Link to="/venues" className="btn btn-primary">Browse Venues</Link>
            </div>
          ) : (
            <div className="compare-table-container">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th className="sticky-col">Feature</th>
                    {compareList.map(venue => (
                      <th key={venue._id}>
                        <div className="compare-venue-card">
                          <button className="remove-btn" onClick={() => removeFromCompare(venue._id)}>✕</button>
                          <img src={venue.images?.[0]?.url} alt={venue.name} />
                          <h3>{venue.name}</h3>
                          <Link to={`/venues/${venue._id}`} className="view-link">View Details</Link>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="sticky-col">Price (per day)</td>
                    {compareList.map(venue => (
                      <td key={venue._id} className="price-cell">{formatPrice(venue.price)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="sticky-col">Capacity</td>
                    {compareList.map(venue => (
                      <td key={venue._id}>{venue.capacity} Guests</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="sticky-col">Category</td>
                    {compareList.map(venue => (
                      <td key={venue._id}>{venue.category}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="sticky-col">Rating</td>
                    {compareList.map(venue => (
                      <td key={venue._id}>
                        <Stars count={Math.round(venue.rating?.average || 0)} />
                        <span className="rating-count">({venue.rating?.count})</span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="sticky-col">AC / Cooling</td>
                    {compareList.map(venue => (
                      <td key={venue._id}>{venue.amenities?.ac ? '✅' : '❌'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="sticky-col">Parking</td>
                    {compareList.map(venue => (
                      <td key={venue._id}>{venue.amenities?.parking ? '✅' : '❌'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="sticky-col">Catering</td>
                    {compareList.map(venue => (
                      <td key={venue._id}>{venue.amenities?.catering ? '✅' : '❌'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="sticky-col">Indoor/Outdoor</td>
                    {compareList.map(venue => (
                      <td key={venue._id}>
                        {venue.amenities?.indoor && '🏠 Indoor'}
                        {venue.amenities?.indoor && venue.amenities?.outdoor && ' / '}
                        {venue.amenities?.outdoor && '🌳 Outdoor'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
