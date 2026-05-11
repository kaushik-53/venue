import { useState, useEffect } from 'react'
import { OpenLocationCode } from 'open-location-code'
import { createVenue, updateVenue } from '../../api/venues'
import { uploadImage } from '../../api/upload'

export default function VenueFormModal({ venue, onClose, onSave }) {
  const isEdit = !!venue
  const [formData, setFormData] = useState({
    name: '', category: 'Banquet Hall', price: '', capacity: '', description: '',
    city: '', address: '', state: '', zipCode: '',
    ac: false, parking: false, catering: false, indoor: false, outdoor: false, pool: false, dj: false
  })
  
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEdit) {
      setFormData({
        name: venue.name || '',
        category: venue.category || 'Banquet Hall',
        price: venue.price || '',
        capacity: venue.capacity || '',
        description: venue.description || '',
        city: venue.location?.city || '',
        address: venue.location?.address || '',
        state: venue.location?.state || '',
        zipCode: venue.location?.zipCode || '',
        plusCode: venue.location?.plusCode || '',
        lat: venue.location?.coordinates?.lat || '',
        lng: venue.location?.coordinates?.lng || '',
        ac: venue.amenities?.ac || false,
        parking: venue.amenities?.parking || false,
        catering: venue.amenities?.catering || false,
        indoor: venue.amenities?.indoor || false,
        outdoor: venue.amenities?.outdoor || false,
        pool: venue.amenities?.pool || false,
        dj: venue.amenities?.dj || false,
      })
      setImages(venue.images || [])

      // Auto-generate Plus Code if missing but coordinates exist
      if (!venue.location?.plusCode && venue.location?.coordinates?.lat) {
        try {
          const olc = new OpenLocationCode()
          const code = olc.encode(venue.location.coordinates.lat, venue.location.coordinates.lng)
          setFormData(prev => ({ ...prev, plusCode: code }))
        } catch (err) {}
      }
    }
  }, [venue, isEdit])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    setFormData(prev => {
      let newFormData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }

      // Auto-decode Plus Code if entered
      if (name === 'plusCode' && value.length >= 10) {
        try {
          const olc = new OpenLocationCode()
          if (olc.isValid(value) && olc.isFull(value)) {
            const decoded = olc.decode(value)
            newFormData.lat = decoded.latitudeCenter
            newFormData.lng = decoded.longitudeCenter
          }
        } catch (err) {
          // Quietly fail if partial code
        }
      }
      return newFormData
    })
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)
    try {
      // Upload files sequentially to avoid hitting rate limits or overwhelming the connection
      for (const file of files) {
        const res = await uploadImage(file)
        setImages(prev => [...prev, { url: res.data.url }])
      }
    } catch (err) {
      console.error('Upload failed', err)
      alert('Failed to upload one or more images')
    } finally {
      setUploading(false)
      // Reset the input so the same files can be selected again if needed
      e.target.value = ''
    }
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      capacity: Number(formData.capacity),
      description: formData.description,
      location: {
        city: formData.city,
        address: formData.address,
        state: formData.state,
        zipCode: formData.zipCode,
        plusCode: formData.plusCode,
        coordinates: { 
          lat: Number(formData.lat) || 0, 
          lng: Number(formData.lng) || 0 
        }
      },
      amenities: {
        ac: formData.ac,
        parking: formData.parking,
        catering: formData.catering,
        indoor: formData.indoor,
        outdoor: formData.outdoor,
        pool: formData.pool,
        dj: formData.dj,
      },
      images: images,
    }

    try {
      if (isEdit) {
        await updateVenue(venue._id, payload)
      } else {
        await createVenue(payload)
      }
      onSave()
    } catch (err) {
      console.error('Save failed', err)
      alert(err.response?.data?.message || 'Failed to save venue')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
      <div className="modal-content card" style={{ background: '#fff', width: '100%', maxWidth: 800, maxHeight: '90vh', overflowY: 'auto', padding: 30, position: 'relative' }}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
        <h2 style={{ marginBottom: 20 }}>{isEdit ? 'Edit Venue' : 'Add New Venue'}</h2>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 20 }}>
          
          {/* Basic Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
            <div className="form-group">
              <label>Venue Name</label>
              <input type="text" className="input" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select className="input" name="category" value={formData.category} onChange={handleChange}>
                <option value="Banquet Hall">Banquet Hall</option>
                <option value="Farmhouse">Farmhouse</option>
                <option value="Hotel">Hotel</option>
                <option value="Resort">Resort</option>
              </select>
            </div>
            <div className="form-group">
              <label>Price (per day)</label>
              <input type="number" className="input" name="price" value={formData.price} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Capacity</label>
              <input type="number" className="input" name="capacity" value={formData.capacity} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea className="input" name="description" value={formData.description} onChange={handleChange} rows="3" required></textarea>
          </div>

          {/* Location */}
          <h3 style={{ fontSize: '1.1rem', marginTop: 10 }}>Location</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
            <div className="form-group">
              <label>Address</label>
              <input type="text" className="input" name="address" value={formData.address} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>City</label>
              <input type="text" className="input" name="city" value={formData.city} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>State</label>
              <input type="text" className="input" name="state" value={formData.state} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Zip Code</label>
              <input type="text" className="input" name="zipCode" value={formData.zipCode} onChange={handleChange} />
            </div>
          </div>

          {/* Plus Code Section */}
          <div className="form-group">
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600 }}>Plus Code (from Google Maps)</span>
              <a 
                href="https://plus.codes/map" 
                target="_blank" 
                rel="noreferrer" 
                style={{ 
                  fontSize: '0.8rem', 
                  color: '#8b6f47', 
                  fontWeight: 600,
                  textDecoration: 'underline'
                }}
              >
                Find Plus Code
              </a>
            </label>
            <input 
              type="text" 
              className="input" 
              name="plusCode" 
              value={formData.plusCode} 
              onChange={handleChange} 
              placeholder="Paste Plus Code here (e.g. 7JFJ8FVC+XG)" 
            />
            {formData.lat && formData.plusCode && (
              <p style={{ fontSize: '0.8rem', color: '#27ae60', marginTop: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ background: '#27ae60', color: 'white', borderRadius: '50%', width: 16, height: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>✓</span>
                Verified Location: {Number(formData.lat).toFixed(4)}, {Number(formData.lng).toFixed(4)}
              </p>
            )}
          </div>

          {/* Amenities */}
          <h3 style={{ fontSize: '1.1rem', marginTop: 10 }}>Amenities</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 15 }}>
            {['ac', 'parking', 'catering', 'indoor', 'outdoor', 'pool', 'dj'].map(am => (
              <label key={am} style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', textTransform: 'capitalize' }}>
                <input type="checkbox" name={am} checked={formData[am]} onChange={handleChange} />
                {am}
              </label>
            ))}
          </div>

          {/* Images */}
          <h3 style={{ fontSize: '1.1rem', marginTop: 10 }}>Images</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
            {images.map((img, idx) => (
              <div key={idx} style={{ position: 'relative' }}>
                <img src={img.url} alt="Venue" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }} />
                <button 
                  type="button" 
                  onClick={() => removeImage(idx)}
                  style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', fontSize: '10px' }}
                >
                  X
                </button>
              </div>
            ))}
          </div>
          <div className="form-group" style={{ marginTop: 10 }}>
            <label 
              className={`btn btn-outline ${uploading ? 'disabled' : ''}`} 
              style={{ cursor: uploading ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', border: '2px dashed var(--color-primary)', background: '#f8f9fa' }}
            >
              <span>{uploading ? '⏳ Uploading...' : '📁 Click to Upload Image'}</span>
              <input 
                type="file" 
                multiple
                accept="image/*" 
                onChange={handleImageUpload} 
                disabled={uploading}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 15, marginTop: 20 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
              {saving ? 'Saving...' : 'Save Venue'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
