import { useState, useEffect } from 'react'
import { getVenues, deleteVenue } from '../../api/venues'
import VenueFormModal from './VenueFormModal'

export default function VenueManager() {
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingVenue, setEditingVenue] = useState(null)

  useEffect(() => {
    fetchVenues()
  }, [])

  const fetchVenues = async () => {
    try {
      const res = await getVenues({ limit: 100 }) // fetch more for admin view
      setVenues(res.data.venues)
    } catch (err) {
      console.error('Failed to fetch venues', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this venue?')) return
    try {
      await deleteVenue(id)
      setVenues(prev => prev.filter(v => v._id !== id))
    } catch (err) {
      console.error('Delete failed', err)
      alert('Failed to delete venue')
    }
  }

  const handleEdit = (venue) => {
    setEditingVenue(venue)
    setModalOpen(true)
  }

  const handleAddNew = () => {
    setEditingVenue(null)
    setModalOpen(true)
  }

  const handleSaveSuccess = () => {
    setModalOpen(false)
    fetchVenues()
  }

  if (loading) return <div>Loading venues...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Manage Venues</h2>
        <button className="btn btn-primary" onClick={handleAddNew}>
          + Add New Venue
        </button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>City</th>
              <th>Price (₹)</th>
              <th>Capacity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {venues.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: '#888' }}>
                  No venues found.
                </td>
              </tr>
            ) : (
              venues.map(venue => (
                <tr key={venue._id}>
                  <td>
                    <img 
                      src={venue.images?.[0]?.url || 'https://via.placeholder.com/50'} 
                      alt={venue.name}
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                    />
                  </td>
                  <td style={{ fontWeight: 500 }}>{venue.name}</td>
                  <td>{venue.location?.city}</td>
                  <td>{venue.price}</td>
                  <td>{venue.capacity}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button 
                        className="btn btn-outline btn-sm" 
                        onClick={() => handleEdit(venue)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-outline btn-sm" 
                        style={{ borderColor: 'red', color: 'red' }}
                        onClick={() => handleDelete(venue._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <VenueFormModal 
          venue={editingVenue} 
          onClose={() => setModalOpen(false)} 
          onSave={handleSaveSuccess} 
        />
      )}
    </div>
  )
}
