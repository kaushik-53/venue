import { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { getVenueBookings } from '../api/bookings'

export default function VenueAvailabilityCalendar({ venueId }) {
  const [bookedDates, setBookedDates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (venueId) {
      fetchBookings()
    }
  }, [venueId])

  const fetchBookings = async () => {
    try {
      const res = await getVenueBookings(venueId)
      // Normalize dates to YYYY-MM-DD for easy comparison
      const dates = res.data.map(d => new Date(d).toDateString())
      setBookedDates(dates)
    } catch (err) {
      console.error('Failed to fetch availability', err)
    } finally {
      setLoading(false)
    }
  }

  const isBooked = ({ date, view }) => {
    if (view === 'month') {
      return bookedDates.includes(date.toDateString())
    }
    return false
  }

  const tileClassName = ({ date, view }) => {
    if (view === 'month' && isBooked({ date, view })) {
      return 'booked-date'
    }
    return null
  }

  return (
    <div className="availability-calendar-wrap">
      <h3 className="section-subtitle" style={{ marginBottom: '15px', fontSize: '1.1rem' }}>
        📅 Check Availability
      </h3>
      
      <div className="calendar-container">
        {loading ? (
          <div className="skeleton" style={{ height: '300px', borderRadius: '12px' }}></div>
        ) : (
          <Calendar 
            tileClassName={tileClassName}
            tileDisabled={isBooked}
            minDate={new Date()}
            view="month"
          />
        )}
      </div>
      
      <div className="calendar-legend" style={{ marginTop: '12px', display: 'flex', gap: '15px', fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '12px', height: '12px', background: '#f8f5f2', border: '1px solid #ddd' }}></span>
          <span>Available</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '12px', height: '12px', background: '#ffebee', border: '1px solid #ffcdd2' }}></span>
          <span>Booked</span>
        </div>
      </div>
    </div>
  )
}
