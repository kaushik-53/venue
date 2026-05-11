import ReactPannellum from 'react-pannellum'

export default function Venue360Viewer({ url, title }) {
  if (!url) return null

  const config = {
    autoRotate: -2,
    showZoomCtrl: true,
    showFullscreenCtrl: true,
    autoLoad: true,
  }

  return (
    <div className="venue-360-container" style={{ marginTop: '40px' }}>
      <h3 style={{ marginBottom: '15px' }}>Immersive 360° View</h3>
      <div className="card" style={{ 
        height: '450px', 
        overflow: 'hidden', 
        borderRadius: '24px', 
        border: '1px solid var(--color-border)',
        position: 'relative'
      }}>
        <ReactPannellum
          id="venue-360-viewer"
          sceneId="firstScene"
          imageSource={url}
          config={config}
          style={{ width: '100%', height: '100%' }}
        />
        
        <div style={{ 
          position: 'absolute', 
          bottom: '20px', 
          left: '20px', 
          background: 'rgba(0,0,0,0.6)', 
          color: 'white', 
          padding: '8px 16px', 
          borderRadius: '20px',
          fontSize: '0.85rem',
          backdropFilter: 'blur(4px)',
          zIndex: 1000
        }}>
          🖱️ Click and drag to explore
        </div>
      </div>
    </div>
  )
}
