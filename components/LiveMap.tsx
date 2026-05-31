"use client"
import { useEffect, useRef, useState } from "react"

interface Vehicle {
  id: string
  registration: string
  latitude: number
  longitude: number
  status: string
  driver?: { name: string } | null
  speed?: number
}

export function LiveMap({ vehicles = [] }: { vehicles: Vehicle[] }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [mapLoaded, setMapLoaded] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const init = async () => {
      try {
        const L = (await import("leaflet")).default
        await import("leaflet/dist/leaflet.css")

        // Fix default icon paths
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        })

        const map = L.map(mapRef.current!, {
          center: [-29.0, 25.0], // Center of SA
          zoom: 6,
          zoomControl: true,
        })

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap",
          maxZoom: 19,
        }).addTo(map)

        // Add SA city markers
        const cities = [
          { name: "Cape Town", lat: -33.9249, lng: 18.4241 },
          { name: "Johannesburg", lat: -26.2041, lng: 28.0473 },
          { name: "Durban", lat: -29.8587, lng: 31.0218 },
          { name: "Pretoria", lat: -25.7479, lng: 28.2293 },
          { name: "Port Elizabeth", lat: -33.9608, lng: 25.6022 },
          { name: "Bloemfontein", lat: -29.0852, lng: 26.1596 },
        ]

        cities.forEach(city => {
          L.circleMarker([city.lat, city.lng], {
            radius: 5, fillColor: "#6366f1", color: "#a5b4fc", weight: 2, fillOpacity: 0.8
          }).addTo(map).bindTooltip(city.name, { permanent: false })
        })

        mapInstanceRef.current = map
        setMapLoaded(true)
      } catch (e: any) {
        setError("Map failed to load: " + e.message)
      }
    }

    init()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Update vehicle markers
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return
    const L = require("leaflet")

    // Remove old markers
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    vehicles.forEach(v => {
      if (!v.latitude || !v.longitude) return
      const color = v.status === "ON_ROUTE" ? "#10b981" : v.status === "AVAILABLE" ? "#6366f1" : "#f59e0b"
      const icon = L.divIcon({
        className: "",
        html: `<div style="width:36px;height:36px;border-radius:50%;background:${color};border:3px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 0 12px ${color}88;font-size:16px;">🚛</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      })
      const marker = L.marker([v.latitude, v.longitude], { icon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div style="font-family:system-ui;min-width:160px">
            <div style="font-weight:700;font-size:14px;color:#1e293b;margin-bottom:6px">${v.registration}</div>
            <div style="font-size:12px;color:#64748b">Driver: ${v.driver?.name || "Unassigned"}</div>
            <div style="font-size:12px;color:#64748b">Status: <strong style="color:${color}">${v.status}</strong></div>
            <div style="font-size:12px;color:#64748b">GPS: ${v.latitude.toFixed(4)}, ${v.longitude.toFixed(4)}</div>
          </div>
        `)
      markersRef.current.push(marker)
    })

    // Fit bounds if we have vehicles
    if (vehicles.length > 0 && vehicles.some(v => v.latitude && v.longitude)) {
      const bounds = vehicles.filter(v => v.latitude && v.longitude).map(v => [v.latitude, v.longitude] as [number, number])
      if (bounds.length > 0) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 12 })
      }
    }
  }, [vehicles, mapLoaded])

  if (error) return (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444", fontSize: 13 }}>
      {error}
    </div>
  )

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%", borderRadius: 12 }} />
      {!mapLoaded && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(13,21,38,0.8)", borderRadius: 12 }}>
          <div style={{ color: "#6366f1", fontSize: 14 }}>Loading map...</div>
        </div>
      )}
      {/* Legend */}
      {mapLoaded && (
        <div style={{ position: "absolute", bottom: 16, right: 16, background: "rgba(13,21,38,0.92)", borderRadius: 10, padding: "10px 14px", border: "1px solid rgba(99,102,241,0.2)", zIndex: 1000 }}>
          {[["#10b981","On Route"],["#6366f1","Available"],["#f59e0b","Maintenance"]].map(([c,l])=>(
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, fontSize: 11 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: c }}></div>
              <span style={{ color: "#94a3b8" }}>{l}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}