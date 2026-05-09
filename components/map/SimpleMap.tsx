'use client'

export default function SimpleMap({ vehicles, onVehicleSelect }) {
  // Static map image from OpenStreetMap (static mode)
  const mapUrl = https://staticmap.openstreetmap.de/staticmap.php?center=-33.9249,18.4241&zoom=11&size=800x500&maptype=mapnik&markers=-33.9249,18.4241,red

  return (
    <div style={{ position: 'relative', height: '500px', width: '100%' }}>
      <img 
        src={mapUrl} 
        alt="Map"
        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
      />
      <div style={{ 
        position: 'absolute', 
        bottom: '10px', 
        left: '10px', 
        background: 'white', 
        padding: '4px 8px', 
        borderRadius: '4px',
        fontSize: '11px',
        color: '#666'
      }}>
        📍 Click on vehicles in the list to view location
      </div>
    </div>
  )
}
