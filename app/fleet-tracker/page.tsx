'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Vehicle = {
  id: string
  registration: string
  make: string
  model: string
  status: string
  latitude?: number
  longitude?: number
}

export default function FleetTracker() {
  const router = useRouter()

  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
    fetchVehicles()

    const interval = setInterval(fetchVehicles, 30000)

    return () => clearInterval(interval)
  }, [])

  const checkAuth = async () => {
    const res = await fetch('/api/me')
    const data = await res.json()

    if (data.error) {
      router.push('/auth/login')
    }
  }

  const fetchVehicles = async () => {
    try {
      const res = await fetch('/api/vehicles')
      const data = await res.json()

      setVehicles(Array.isArray(data) ? data : [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      setLoading(false)
    }
  }

  const openInMaps = (
    lat: number | undefined,
    lng: number | undefined
  ) => {
    if (lat !== undefined && lng !== undefined) {
      window.open(
        `https://www.google.com/maps?q=${lat},${lng}`,
        '_blank'
      )
    }
  }

  if (loading) {
    return (
      <div style={styles.loading}>
        Loading fleet data...
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Live Fleet Tracker</h1>

        <button
          onClick={() => router.push('/dashboard')}
          style={styles.backBtn}
        >
          Back to Dashboard
        </button>
      </div>

      <div style={styles.grid}>
        <div style={styles.mapSection}>
          <h2 style={styles.sectionTitle}>
            Vehicle Locations
          </h2>

          <div style={styles.mapContainer}>
            <iframe
              title="Fleet Map"
              width="100%"
              height="100%"
              frameBorder="0"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=18.35,-33.97,18.50,-33.88&layer=mapnik&marker=${
                selectedVehicle?.latitude ?? -33.9249
              },${
                selectedVehicle?.longitude ?? 18.4241
              }`}
            />
          </div>
        </div>

        <div style={styles.listSection}>
          <h2 style={styles.sectionTitle}>
            Active Fleet ({vehicles.length})
          </h2>

          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              onClick={() => setSelectedVehicle(vehicle)}
              style={{
                ...styles.vehicleCard,
                background:
                  selectedVehicle?.id === vehicle.id
                    ? '#eff6ff'
                    : 'white'
              }}
            >
              <div style={styles.vehicleHeader}>
                <strong>{vehicle.registration}</strong>

                <span
                  style={{
                    ...styles.statusBadge,
                    background:
                      vehicle.status === 'ON_ROUTE'
                        ? '#dbeafe'
                        : '#d1fae5',
                    color:
                      vehicle.status === 'ON_ROUTE'
                        ? '#1e40af'
                        : '#065f46'
                  }}
                >
                  {vehicle.status}
                </span>
              </div>

              <div style={styles.vehicleDetails}>
                {vehicle.make} {vehicle.model}
              </div>

              <div style={styles.vehicleLocation}>
                {vehicle.latitude !== undefined &&
                vehicle.longitude !== undefined
                  ? `${vehicle.latitude.toFixed(
                      4
                    )}, ${vehicle.longitude.toFixed(4)}`
                  : 'Location unavailable'}
              </div>

              {selectedVehicle?.id === vehicle.id && (
                <button
                  onClick={() =>
                    openInMaps(
                      vehicle.latitude,
                      vehicle.longitude
                    )
                  }
                  style={styles.mapBtn}
                >
                  Open in Google Maps
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f1f5f9',
    padding: '20px'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '20px',
    color: '#64748b'
  },
  header: {
    background: 'white',
    padding: '20px 30px',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1e293b'
  },
  backBtn: {
    padding: '8px 16px',
    background: '#64748b',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: '20px'
  },
  mapSection: {
    background: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  listSection: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    maxHeight: '600px',
    overflowY: 'auto' as const
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    padding: '16px 20px',
    margin: 0,
    borderBottom: '1px solid #e2e8f0'
  },
  mapContainer: {
    height: '500px',
    width: '100%'
  },
  vehicleCard: {
    padding: '15px',
    marginBottom: '10px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  vehicleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  vehicleDetails: {
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '5px'
  },
  vehicleLocation: {
    fontSize: '11px',
    color: '#94a3b8',
    marginTop: '5px'
  },
  statusBadge: {
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '11px'
  },
  mapBtn: {
    marginTop: '10px',
    padding: '6px 12px',
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    width: '100%'
  }
}
