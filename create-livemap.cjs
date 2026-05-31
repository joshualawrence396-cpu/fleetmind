const fs = require("fs");
const path = require("path");

const dir = "components";
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const content = `"use client"
import { useEffect, useRef, useState } from "react"

interface MapVehicle {
  id: string
  registration: string
  latitude: number
  longitude: number
  status: string
  driver?: { name: string } | null
  make?: string
  model?: string
}

interface MapDriver {
  id: string
  name: string
  latitude?: number
  longitude?: number
  status: string
  vehicle?: { registration: string } | null
}

export function LiveMap({ vehicles = [], drivers = [], height = "500px" }: { vehicles?: MapVehicle[], drivers?: MapDriver[], height?: string }) {
  const mapRef = useRef<any>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (mapInstanceRef.current) return

    import("leaflet").then(L => {
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })

      if (!mapRef.current || mapInstanceRef.current) return

      const map = L.map(mapRef.current, {
        center: [-29.0, 25.0],
        zoom: 6,
        zoomControl: true,
        attributionControl: false,
      })

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: "CARTO",
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map)

      mapInstanceRef.current = map

      const cities = [
        { name: "Cape Town", lat: -33.9249, lng: 18.4241 },
        { name: "Johannesburg", lat: -26.2041, lng: 28.0473 },
        { name: "Durban", lat: -29.8587, lng: 31.0218 },
        { name: "Pretoria", lat: -25.7479, lng: 28.2293 },
        { name: "Port Elizabeth", lat: -33.9608, lng: 25.6022 },
        { name: "Bloemfontein", lat: -29.0852, lng: 26.1596 },
      ]

      cities.forEach(city => {
        const icon = L.divIcon({
          html: \`<div style="background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.4);color:#a5b4fc;padding:2px 6px;border-radius:4px;font-size:10px;font-family:system-ui;white-space:nowrap">\${city.name}</div>\`,
          className: "",
          iconAnchor: [30, 10],
        })
        L.marker([city.lat, city.lng], { icon }).addTo(map)
      })
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current) return

    import("leaflet").then(L => {
      markersRef.current.forEach(m => m.remove())
      markersRef.current = []

      const allPoints: [number, number][] = []

      vehicles.forEach(v => {
        const lat = v.latitude || (-33.9249 + (Math.random() - 0.5) * 8)
        const lng = v.longitude || (18.4241 + (Math.random() - 0.5) * 10)
        allPoints.push([lat, lng])

        const color = v.status === "ON_ROUTE" ? "#6366f1" : v.status === "AVAILABLE" ? "#10b981" : "#f59e0b"

        const icon = L.divIcon({
          html: \`<div style="position:relative;width:40px;height:50px">
            <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,\${color},\${color}cc);border:2px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 15px \${color}66;cursor:pointer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            </div>
            <div style="position:absolute;bottom:-2px;left:50%;transform:translateX(-50%);background:rgba(10,15,30,0.9);color:white;padding:1px 5px;border-radius:3px;font-size:9px;white-space:nowrap;border:1px solid rgba(99,102,241,0.3)">\${v.registration}</div>
          </div>\`,
          className: "",
          iconSize: [40, 52],
          iconAnchor: [20, 20],
        })

        const marker = L.marker([lat, lng], { icon })
          .addTo(mapInstanceRef.current!)
          .bindPopup(\`<div style="background:#0d1526;color:#e2e8f0;padding:12px;border-radius:10px;min-width:180px;border:1px solid rgba(99,102,241,0.2);font-family:system-ui">
            <div style="font-weight:700;font-size:14px;margin-bottom:4px">\${v.registration}</div>
            <div style="font-size:11px;color:#6366f1;margin-bottom:6px">\${v.make || ""} \${v.model || ""}</div>
            <div style="font-size:11px;color:#94a3b8">Status: <span style="color:\${color};font-weight:600">\${v.status}</span></div>
            \${v.driver ? \`<div style="font-size:11px;color:#94a3b8">Driver: <span style="color:white">\${v.driver.name}</span></div>\` : ""}
            <div style="font-size:10px;color:#475569;margin-top:4px">\${lat.toFixed(4)}, \${lng.toFixed(4)}</div>
          </div>\`, { className: "dark-popup" })

        markersRef.current.push(marker)
      })

      drivers.filter(d => !d.vehicle).forEach(d => {
        const lat = d.latitude || (-33.9249 + (Math.random() - 0.5) * 8)
        const lng = d.longitude || (18.4241 + (Math.random() - 0.5) * 10)
        allPoints.push([lat, lng])

        const icon = L.divIcon({
          html: \`<div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#8b5cf6,#6366f1);border:2px solid white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:white;box-shadow:0 4px 12px rgba(139,92,246,0.5)">\${d.name[0]?.toUpperCase()}</div>\`,
          className: "",
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        })

        const marker = L.marker([lat, lng], { icon })
          .addTo(mapInstanceRef.current!)
          .bindPopup(\`<div style="background:#0d1526;color:#e2e8f0;padding:10px;border-radius:8px;font-family:system-ui"><b>\${d.name}</b><br/><span style="color:#8b5cf6;font-size:11px">\${d.status}</span></div>\`, { className: "dark-popup" })

        markersRef.current.push(marker)
      })

      if (allPoints.length > 0) {
        try {
          mapInstanceRef.current!.fitBounds(allPoints, { padding: [40, 40], maxZoom: 10 })
        } catch {}
      }
    })
  }, [vehicles, drivers])

  const statusCounts = {
    onRoute: vehicles.filter(v => v.status === "ON_ROUTE").length,
    available: vehicles.filter(v => v.status === "AVAILABLE").length,
    maintenance: vehicles.filter(v => v.status === "MAINTENANCE").length,
  }

  return (
    <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(99,102,241,0.15)" }}>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} style={{ width: "100%", height, background: "#0a0f1e" }} />
      <div style={{ position: "absolute", bottom: 16, left: 16, background: "rgba(10,15,30,0.92)", backdropFilter: "blur(10px)", borderRadius: 12, padding: "10px 14px", border: "1px solid rgba(99,102,241,0.2)", zIndex: 1000 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: "1px", marginBottom: 8 }}>FLEET STATUS</div>
        {[
          { color: "#6366f1", label: "On Route", count: statusCounts.onRoute },
          { color: "#10b981", label: "Available", count: statusCounts.available },
          { color: "#f59e0b", label: "Maintenance", count: statusCounts.maintenance },
        ].map(s => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, boxShadow: \`0 0 6px \${s.color}\` }} />
            <span style={{ fontSize: 11, color: "#94a3b8" }}>{s.label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "white", marginLeft: "auto" }}>{s.count}</span>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 16, right: 16, background: "rgba(10,15,30,0.92)", backdropFilter: "blur(10px)", borderRadius: 12, padding: "10px 14px", border: "1px solid rgba(99,102,241,0.2)", zIndex: 1000 }}>
        <div style={{ fontSize: 11, color: "#475569", marginBottom: 2 }}>Total Tracked</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "white" }}>{vehicles.length} vehicles</div>
        <div style={{ fontSize: 11, color: "#475569" }}>{drivers.length} drivers</div>
      </div>
      <style>{\`
        .dark-popup .leaflet-popup-content-wrapper { background:transparent!important;border:none!important;box-shadow:none!important;padding:0!important }
        .dark-popup .leaflet-popup-tip { background:#0d1526!important }
        .leaflet-popup-content { margin:0!important }
        .leaflet-container { background:#080d1a!important }
      \`}</style>
    </div>
  )
}
`;

fs.writeFileSync(path.join(dir, "LiveMap.tsx"), content, "utf8");
console.log("LiveMap.tsx created!");
