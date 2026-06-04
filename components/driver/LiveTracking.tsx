'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

type Location = {
  lat: number
  lng: number
}

type Stop = {
  id: string | number
  latitude: number
  longitude: number
  status: string
}

type Route = {
  stops?: Stop[]
}

interface LiveTrackingProps {
  driverId: string
  route?: Route
}

export default function LiveTracking({
  driverId,
  route,
}: LiveTrackingProps) {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null)
  const [eta, setEta] = useState<number | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) return

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const location: Location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }

        setCurrentLocation(location)
        updateDriverLocation(location)
        calculateETA(location)
      },
      (error) => console.error('Geolocation error:', error),
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
      }
    )

    return () => {
      navigator.geolocation.clearWatch(id)
    }
  }, [])

  const updateDriverLocation = async (location: Location) => {
    try {
      await fetch('/api/driver/update-location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          driverId,
          location,
          timestamp: Date.now(),
        }),
      })
    } catch (error) {
      console.error('Failed to update location:', error)
    }
  }

  const calculateETA = async (location: Location) => {
    if (!route?.stops?.length) return

    const nextStop = route.stops.find(
      (s: Stop) => s.status === 'PENDING'
    )

    if (!nextStop) return

    try {
      const distanceKm =
        Math.sqrt(
          Math.pow(location.lat - nextStop.latitude, 2) +
            Math.pow(location.lng - nextStop.longitude, 2)
        ) * 111

      const estimatedMinutes = Math.round((distanceKm / 40) * 60)

      setEta(estimatedMinutes)
    } catch (error) {
      console.error('ETA calculation failed:', error)
    }
  }

  const defaultCenter: [number, number] = [-33.9249, 18.4241]

  const mapCenter: [number, number] = currentLocation
    ? [currentLocation.lat, currentLocation.lng]
    : defaultCenter

  return (
    <div className="space-y-4">
      {currentLocation && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Live Location</h3>

          <p className="text-sm">
            Latitude: {currentLocation.lat.toFixed(6)}
          </p>

          <p className="text-sm">
            Longitude: {currentLocation.lng.toFixed(6)}
          </p>

          {eta && (
            <p className="text-sm font-semibold mt-2">
              ETA to next stop: {eta} minutes
            </p>
          )}
        </div>
      )}

      <div style={{ height: '400px', width: '100%' }}>
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{
            height: '100%',
            width: '100%',
          }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {currentLocation && (
            <Marker position={[currentLocation.lat, currentLocation.lng]}>
              <Popup>Your Current Location</Popup>
            </Marker>
          )}

          {route?.stops?.map((stop: Stop, idx: number) => (
            <Marker
              key={stop.id}
              position={[stop.latitude, stop.longitude]}
            >
              <Popup>
                Stop {idx + 1}
                <br />
                Status: {stop.status}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}