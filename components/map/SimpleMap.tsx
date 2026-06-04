'use client'

interface Vehicle {
  id: string | number
  registration?: string
  driverName?: string
  status?: string
  latitude?: number
  longitude?: number
}

interface SimpleMapProps {
  vehicles: Vehicle[]
  onVehicleSelect?: (vehicle: Vehicle) => void
}

export default function SimpleMap({
  vehicles,
  onVehicleSelect,
}: SimpleMapProps) {
  const mapUrl =
    'https://staticmap.openstreetmap.de/staticmap.php?center=-33.9249,18.4241&zoom=10&size=1200x500'

  return (
    <div>
      <div
        style={{
          overflow: 'hidden',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
        }}
      >
        <img
          src={mapUrl}
          alt="Fleet Map"
          style={{
            width: '100%',
            height: '500px',
            objectFit: 'cover',
          }}
        />
      </div>

      <div
        style={{
          marginTop: '16px',
          display: 'grid',
          gap: '12px',
        }}
      >
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            onClick={() => onVehicleSelect?.(vehicle)}
            style={{
              padding: '12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            <strong>
              {vehicle.registration || 'Unknown Vehicle'}
            </strong>

            <div>
              Driver: {vehicle.driverName || 'Unassigned'}
            </div>

            <div>
              Status: {vehicle.status || 'Unknown'}
            </div>

            {vehicle.latitude && vehicle.longitude && (
              <div>
                Location: {vehicle.latitude}, {vehicle.longitude}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

