'use client'

import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    L: any
    markers: any[]
  }
}

type Vehicle = {
  id?: string | number
  registration?: string
  driverName?: string
  status?: string
  latitude?: number
  longitude?: number
}

type IntegratedMapProps = {
  vehicles: Vehicle[]
  center?: [number, number]
  onVehicleClick?: (vehicle: Vehicle) => void
}

export default function IntegratedMap({
  vehicles,
  center,
  onVehicleClick,
}: IntegratedMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const [map, setMap] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (isLoaded) return

    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    if (!window.L) {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = () => setIsLoaded(true)
      document.head.appendChild(script)
    } else {
      setIsLoaded(true)
    }
  }, [isLoaded])

  useEffect(() => {
    if (!isLoaded || !window.L || !mapRef.current || map) return

    const newMap = window.L.map(mapRef.current).setView(
      center || [-33.9249, 18.4241],
      12
    )

    window.L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }
    ).addTo(newMap)

    setMap(newMap)

    return () => {
      newMap.remove()
    }
  }, [isLoaded, center, map])

  useEffect(() => {
    if (!map || !window.L || !isLoaded) return

    if (window.markers) {
      window.markers.forEach((marker) => marker.remove())
    }

    const newMarkers: any[] = []

    vehicles.forEach((vehicle) => {
      if (
        vehicle.latitude != null &&
        vehicle.longitude != null
      ) {
        const color =
          vehicle.status === 'ON_ROUTE'
            ? '#3b82f6'
            : '#10b981'

        const icon = window.L.divIcon({
          html: `<div style="background:${color}; width:12px; height:12px; border-radius:50%; border:2px solid white;"></div>`,
          iconSize: [12, 12],
          className: 'custom-marker',
        })

        const marker = window.L
          .marker(
            [vehicle.latitude, vehicle.longitude],
            { icon }
          )
          .addTo(map)
          .bindPopup(`
            <div style="padding:8px">
              <strong>${vehicle.registration || 'Vehicle'}</strong><br/>
              ${vehicle.driverName || ''}<br/>
              Status: ${vehicle.status || 'Unknown'}
            </div>
          `)

        if (onVehicleClick) {
          marker.on('click', () => onVehicleClick(vehicle))
        }

        newMarkers.push(marker)
      }
    })

    window.markers = newMarkers
  }, [vehicles, map, isLoaded, onVehicleClick])

  return (
    <div
      ref={mapRef}
      style={{
        height: '500px',
        width: '100%',
        borderRadius: '12px',
        background: '#f0f2f5',
      }}
    />
  )
}


