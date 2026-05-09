'use client'

import { useState, useEffect } from 'react'
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api'

const mapContainerStyle = {
  width: '100%',
  height: '400px'
}

export default function LiveTracking({ driverId, route }) {
  const [currentLocation, setCurrentLocation] = useState(null)
  const [watchId, setWatchId] = useState(null)
  const [eta, setEta] = useState(null)
  
  useEffect(() => {
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setCurrentLocation(location)
          updateDriverLocation(location)
          calculateETA(location)
        },
        (error) => console.error('Geolocation error:', error),
        { enableHighAccuracy: true, maximumAge: 30000 }
      )
      setWatchId(id)
      
      return () => {
        if (watchId) navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [])
  
  const updateDriverLocation = async (location) => {
    try {
      await fetch('/api/driver/update-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId, location, timestamp: Date.now() })
      })
    } catch (error) {
      console.error('Failed to update location:', error)
    }
  }
  
  const calculateETA = async (currentLocation) => {
    if (!route?.stops || route.stops.length === 0) return
    
    const nextStop = route.stops.find(s => s.status === 'PENDING')
    if (!nextStop) return
    
    try {
      const response = await fetch(/api/driver/eta?origin=,&destination=,)
      const data = await response.json()
      setEta(data.duration)
    } catch (error) {
      console.error('ETA calculation failed:', error)
    }
  }
  
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <div className="space-y-4">
        {currentLocation && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Live Location</h3>
            <p className="text-sm">Latitude: {currentLocation.lat.toFixed(6)}</p>
            <p className="text-sm">Longitude: {currentLocation.lng.toFixed(6)}</p>
            {eta && <p className="text-sm font-semibold mt-2">ETA to next stop: {Math.round(eta / 60)} minutes</p>}
          </div>
        )}
        
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={currentLocation || { lat: -33.9249, lng: 18.4241 }}
          zoom={13}
        >
          {currentLocation && <Marker position={currentLocation} label="You" />}
          {route?.stops?.map((stop, idx) => (
            <Marker 
              key={stop.id}
              position={{ lat: stop.latitude, lng: stop.longitude }}
              label={String(idx + 1)}
            />
          ))}
        </GoogleMap>
      </div>
    </LoadScript>
  )
}
