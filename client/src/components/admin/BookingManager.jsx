import { useState, useEffect } from 'react'
import { getAllBookings, updateBookingStatus } from '../../api/bookings'

export default function BookingManager() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const res = await getAllBookings()
      setBookings(res.data)
    } catch (err) {
      console.error('Failed to fetch bookings', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      const res = await updateBookingStatus(id, status)
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: res.data.status } : b))
    } catch (err) {
      console.error('Failed to update status', err)
      alert('Failed to update status')
    }
  }

  if (loading) return <div>Loading bookings...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Manage Bookings</h2>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>User</th>
              <th>Venue</th>
              <th>Guests</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: '#888' }}>
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map(booking => (
                <tr key={booking._id}>
                  <td>{new Date(booking.date).toLocaleDateString()}</td>
                  <td>
                    <div>{booking.user?.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{booking.user?.email}</div>
                  </td>
                  <td>{booking.venue?.name}</td>
                  <td>{booking.guestCount}</td>
                  <td>
                    <span className={`status-badge status-${booking.status}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    {booking.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button 
                          className="btn btn-outline btn-sm" 
                          style={{ borderColor: 'green', color: 'green' }}
                          onClick={() => handleStatusChange(booking._id, 'approved')}
                        >
                          Approve
                        </button>
                        <button 
                          className="btn btn-outline btn-sm" 
                          style={{ borderColor: 'red', color: 'red' }}
                          onClick={() => handleStatusChange(booking._id, 'rejected')}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: '#aaa', fontSize: '0.9rem' }}>No actions</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
