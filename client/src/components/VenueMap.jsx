import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

// Component to handle map view reset when coordinates change
function ChangeView({ center }) {
  const map = useMap()
  map.setView(center, map.getZoom())
  return null
}

export default function VenueMap({ venue }) {
  const { coordinates, city, address } = venue.location || {}
  
  // Default coordinates (India center) if none provided
  const center = [coordinates?.lat || 20.5937, coordinates?.lng || 78.9629]
  const zoom = coordinates?.lat ? 15 : 5

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${center[0]},${center[1]}`

  return (
    <div className="venue-map-container" style={{ marginBottom: '40px' }}>
      <div className="venue-map-card">
        <MapContainer 
          center={center} 
          zoom={zoom} 
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={center}>
            <Popup>
              <div style={{ padding: '5px' }}>
                <strong style={{ display: 'block', marginBottom: '4px' }}>{venue.name}</strong>
                <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{address || city}</p>
              </div>
            </Popup>
          </Marker>
          <ChangeView center={center} />
        </MapContainer>

        {/* Floating "Get Directions" Button Overlay */}
        <div style={{ 
          position: 'absolute', 
          bottom: '20px', 
          right: '20px', 
          zIndex: 1000 
        }}>
          <a 
            href={googleMapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ 
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              textDecoration: 'none'
            }}
          >
            📍 Get Directions
          </a>
        </div>
      </div>
      
      {!coordinates?.lat && (
        <p style={{ 
          fontSize: '0.85rem', 
          color: '#888', 
          marginTop: '12px', 
          textAlign: 'center',
          fontStyle: 'italic'
        }}>
          Note: Showing general city location. Exact pin location coming soon.
        </p>
      )}
    </div>
  )
}
