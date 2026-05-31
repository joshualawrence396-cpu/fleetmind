const fs = require("fs");
const path = require("path");

function write(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
  console.log("Created:", filePath);
}

// ── 1. LIVE MAP (Uber-style) ─────────────────────────────────────────────────
write("components/LiveMap.tsx", `"use client"
import { useEffect, useRef, useState, useCallback } from "react"

interface Vehicle {
  id: string; registration: string; latitude: number; longitude: number
  status: string; driver?: { name: string; phone?: string } | null; make?: string; model?: string
}
interface Driver {
  id: string; name: string; latitude?: number; longitude?: number
  status: string; phone?: string; vehicle?: { registration: string } | null
}

export function LiveMap({ vehicles = [], drivers = [], height = "100%", onVehicleClick }: {
  vehicles?: Vehicle[]; drivers?: Driver[]; height?: string; onVehicleClick?: (v: Vehicle) => void
}) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<Map<string, any>>(new Map())
  const animFrameRef = useRef<any>(null)
  const [selected, setSelected] = useState<any>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined" || mapInstanceRef.current || !mapRef.current) return
    let mounted = true

    import("leaflet").then(L => {
      if (!mounted || !mapRef.current || mapInstanceRef.current) return

      delete (L.Icon.Default.prototype as any)._getIconUrl
      const map = L.map(mapRef.current, {
        center: [-29.0, 25.0], zoom: 6,
        zoomControl: false, attributionControl: false,
      })

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_matter/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd", maxZoom: 19
      }).addTo(map)

      L.control.zoom({ position: "bottomright" }).addTo(map)

      // SA city markers
      const cities = [
        [-33.9249, 18.4241, "Cape Town"], [-26.2041, 28.0473, "Johannesburg"],
        [-29.8587, 31.0218, "Durban"], [-25.7479, 28.2293, "Pretoria"],
        [-33.9608, 25.6022, "Gqeberha"], [-29.0852, 26.1596, "Bloemfontein"],
      ]
      cities.forEach(([lat, lng, name]) => {
        L.marker([lat as number, lng as number], {
          icon: L.divIcon({
            html: \`<div style="color:#4b5563;font-size:10px;font-family:system-ui;white-space:nowrap;background:rgba(17,24,39,0.7);padding:2px 6px;border-radius:3px;backdrop-filter:blur(4px)">\${name}</div>\`,
            className: "", iconAnchor: [30, 8]
          })
        }).addTo(map)
      })

      mapInstanceRef.current = map
      setInitialized(true)
    })

    return () => { mounted = false }
  }, [])

  // Animate vehicle to new position
  const animateMarker = useCallback((marker: any, fromLat: number, fromLng: number, toLat: number, toLng: number) => {
    const steps = 30
    let step = 0
    const tick = () => {
      step++
      const t = step / steps
      const ease = t < 0.5 ? 2*t*t : -1+(4-2*t)*t
      marker.setLatLng([fromLat + (toLat - fromLat) * ease, fromLng + (toLng - fromLng) * ease])
      if (step < steps) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    if (!initialized || !mapInstanceRef.current) return
    import("leaflet").then(L => {
      const map = mapInstanceRef.current!
      const allPoints: [number,number][] = []
      const newIds = new Set<string>()

      vehicles.forEach(v => {
        const lat = v.latitude ?? (-33.9249 + (Math.random()-0.5)*8)
        const lng = v.longitude ?? (18.4241 + (Math.random()-0.5)*10)
        allPoints.push([lat, lng])
        newIds.add("v_"+v.id)

        const col = v.status==="ON_ROUTE"?"#6366f1":v.status==="AVAILABLE"?"#10b981":"#f59e0b"
        const html = \`<div style="position:relative">
          <div style="width:46px;height:46px;border-radius:50%;background:linear-gradient(135deg,\${col},\${col}dd);border:3px solid rgba(255,255,255,0.9);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px \${col}88,0 0 0 6px \${col}22;cursor:pointer;transition:all 0.2s">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M18 6h-1V4a1 1 0 00-1-1H4a1 1 0 00-1 1v13h1a2.5 2.5 0 005 0h6a2.5 2.5 0 005 0h1v-5l-3-6zM7.5 18.5A1.5 1.5 0 016 17a1.5 1.5 0 011.5-1.5A1.5 1.5 0 019 17a1.5 1.5 0 01-1.5 1.5zm9 0A1.5 1.5 0 0115 17a1.5 1.5 0 011.5-1.5A1.5 1.5 0 0118 17a1.5 1.5 0 01-1.5 1.5zM15 11H5V5h10v6zm1 0V6.5l2.5 4.5H16z"/></svg>
          </div>
          <div style="position:absolute;top:-22px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.85);color:white;padding:2px 7px;border-radius:10px;font-size:9px;font-family:system-ui;white-space:nowrap;font-weight:700;border:1px solid \${col}66">\${v.registration}</div>
          \${v.status==="ON_ROUTE"?'<div style="position:absolute;inset:-6px;border-radius:50%;border:2px solid '+col+';opacity:0.4;animation:ping 1.5s ease infinite"></div>':''}
        </div>\`

        const icon = L.divIcon({ html, className:"", iconSize:[46,46], iconAnchor:[23,23] })
        const popup = L.popup({ className:"fleet-popup", closeButton:false, offset:[0,-26] }).setContent(\`
          <div style="background:#0f172a;color:#e2e8f0;padding:14px;border-radius:12px;min-width:200px;border:1px solid rgba(99,102,241,0.25);font-family:system-ui;box-shadow:0 20px 60px rgba(0,0,0,0.5)">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
              <div style="width:10px;height:10px;border-radius:50%;background:\${col};box-shadow:0 0 8px \${col}"></div>
              <span style="font-weight:800;font-size:15px">\${v.registration}</span>
            </div>
            <div style="font-size:11px;color:#6366f1;margin-bottom:8px;font-weight:600">\${v.make||""} \${v.model||""}</div>
            <div style="display:grid;gap:4px;font-size:12px">
              <div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">Status</span><span style="color:\${col};font-weight:600">\${v.status}</span></div>
              \${v.driver?'<div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">Driver</span><span style="color:white">'+(v.driver.name)+'</span></div>':""}
              <div style="display:flex;justify-content:space-between"><span style="color:#94a3b8">Location</span><span style="color:#64748b">\${lat.toFixed(3)}, \${lng.toFixed(3)}</span></div>
            </div>
          </div>\`)

        const key = "v_"+v.id
        if (markersRef.current.has(key)) {
          const existing = markersRef.current.get(key)
          const oldPos = existing.getLatLng()
          if (oldPos.lat !== lat || oldPos.lng !== lng) animateMarker(existing, oldPos.lat, oldPos.lng, lat, lng)
          existing.bindPopup(popup)
        } else {
          const marker = L.marker([lat,lng],{icon}).addTo(map).bindPopup(popup)
          marker.on("click", () => setSelected(v))
          markersRef.current.set(key, marker)
        }
      })

      // Driver markers (no vehicle)
      drivers.filter(d => !d.vehicle).forEach(d => {
        const lat = d.latitude ?? (-33.9249+(Math.random()-0.5)*8)
        const lng = d.longitude ?? (18.4241+(Math.random()-0.5)*10)
        allPoints.push([lat,lng])
        newIds.add("d_"+d.id)

        const html = \`<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#8b5cf6,#6366f1);border:3px solid rgba(255,255,255,0.8);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:white;box-shadow:0 4px 15px rgba(139,92,246,0.6);cursor:pointer">\${d.name[0]?.toUpperCase()}</div>\`

        const key = "d_"+d.id
        if (!markersRef.current.has(key)) {
          const marker = L.marker([lat,lng],{icon:L.divIcon({html,className:"",iconSize:[36,36],iconAnchor:[18,18]})})
            .addTo(map)
            .bindPopup(L.popup({className:"fleet-popup",closeButton:false}).setContent(
              \`<div style="background:#0f172a;color:#e2e8f0;padding:12px;border-radius:10px;font-family:system-ui;border:1px solid rgba(139,92,246,0.25)"><b>\${d.name}</b><br/><span style="color:#8b5cf6;font-size:11px">\${d.status} — Available</span></div>\`
            ))
          markersRef.current.set(key, marker)
        }
      })

      // Remove stale markers
      markersRef.current.forEach((marker, key) => {
        if (!newIds.has(key)) { marker.remove(); markersRef.current.delete(key) }
      })

      if (allPoints.length > 0 && markersRef.current.size <= allPoints.length) {
        try { map.fitBounds(allPoints, { padding: [50, 50], maxZoom: 11 }) } catch {}
      }
    })
  }, [vehicles, drivers, initialized])

  const onRoute = vehicles.filter(v => v.status === "ON_ROUTE").length
  const available = vehicles.filter(v => v.status === "AVAILABLE").length
  const maint = vehicles.filter(v => v.status === "MAINTENANCE").length

  return (
    <div style={{ position: "relative", height, borderRadius: 16, overflow: "hidden", border: "1px solid rgba(99,102,241,0.15)", background: "#080d1a" }}>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

      {/* Top overlay */}
      <div style={{ position: "absolute", top: 14, left: 14, display: "flex", gap: 8, zIndex: 1000, flexWrap: "wrap" }}>
        {[
          { col:"#6366f1", label:"On Route", n: onRoute },
          { col:"#10b981", label:"Available", n: available },
          { col:"#f59e0b", label:"Maintenance", n: maint },
        ].map(s => (
          <div key={s.label} style={{ background: "rgba(10,15,30,0.9)", backdropFilter: "blur(12px)", borderRadius: 20, padding: "5px 12px", border: "1px solid " + s.col + "40", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.col, boxShadow: "0 0 8px " + s.col }} />
            <span style={{ fontSize: 11, color: "white", fontWeight: 600 }}>{s.n} {s.label}</span>
          </div>
        ))}
      </div>

      {/* Bottom info panel */}
      {selected && (
        <div style={{ position: "absolute", bottom: 14, left: 14, right: 14, background: "rgba(10,15,30,0.95)", backdropFilter: "blur(16px)", borderRadius: 14, padding: "14px 18px", border: "1px solid rgba(99,102,241,0.2)", zIndex: 1000 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "white" }}>{selected.registration}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>{selected.make} {selected.model} · {selected.driver?.name || "No driver"}</div>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#94a3b8", cursor: "pointer", padding: "4px 10px", fontSize: 11 }}>✕</button>
          </div>
        </div>
      )}

      <style>{\`
        .fleet-popup .leaflet-popup-content-wrapper { background: transparent !important; border: none !important; box-shadow: none !important; padding: 0 !important; }
        .fleet-popup .leaflet-popup-tip-container { display: none; }
        .leaflet-popup-content { margin: 0 !important; }
        .leaflet-container { background: #080d1a !important; font-family: system-ui !important; }
        .leaflet-control-zoom a { background: rgba(13,21,38,0.9) !important; color: #a5b4fc !important; border-color: rgba(99,102,241,0.2) !important; }
        @keyframes ping { 0%,100%{transform:scale(1);opacity:0.4} 50%{transform:scale(1.4);opacity:0.1} }
      \`}</style>
    </div>
  )
}
`);

// ── 2. i18n ──────────────────────────────────────────────────────────────────
write("lib/i18n.ts", `export const LANGS = [
  { code: "en", label: "English", flag: "🇿🇦" },
  { code: "af", label: "Afrikaans", flag: "🇿🇦" },
  { code: "zu", label: "isiZulu", flag: "🇿🇦" },
  { code: "xh", label: "isiXhosa", flag: "🇿🇦" },
]

export const translations: Record<string, Record<string, string>> = {
  en: {
    dashboard:"Dashboard", fleet:"Fleet Tracking", orders:"Orders", drivers:"Drivers", analytics:"Analytics",
    warehouses:"Warehouses", inventory:"Inventory", barcode:"Barcode Scanner", fuel:"Fuel", maintenance:"Maintenance",
    invoices:"Invoices", costanalysis:"Cost Analysis", hubs:"Hub Network", routeoptimizer:"Route Optimizer",
    geofences:"Geofencing", returns:"Returns", forecast:"Demand Forecast", mlmaintenance:"ML Maintenance",
    telematics:"Telematics/IoT", courierfederation:"Courier Federation", aiagents:"AI Agents",
    teamchat:"Team Chat", pod:"Proof of Delivery", notifications:"Notifications",
    apidocs:"API Docs", testing:"Testing", monitoring:"Monitoring", livemap:"Live Map", driverapp:"Driver App",
    newOrder:"+ New Order", signOut:"Sign Out", welcome:"Welcome back",
    totalVehicles:"Total Vehicles", activeDrivers:"Active Drivers", totalOrders:"Total Orders", successRate:"Success Rate",
    onRoute:"On Route", available:"Available", completed:"Completed", pending:"Pending",
    addDriver:"Add Driver", addVehicle:"Add Vehicle", save:"Save", cancel:"Cancel",
  },
  af: {
    dashboard:"Kontroleskerm", fleet:"Vloot Opsporing", orders:"Bestellings", drivers:"Bestuurders", analytics:"Analise",
    warehouses:"Pakhuise", inventory:"Voorraad", barcode:"Strepieskode", fuel:"Brandstof", maintenance:"Onderhoud",
    invoices:"Fakture", costanalysis:"Koste-analise", hubs:"Knooppunte", routeoptimizer:"Roete-optimeerder",
    geofences:"Geoheinings", returns:"Terugsendings", forecast:"Aanvraagvoorspelling", mlmaintenance:"ML Onderhoud",
    telematics:"Telematika", courierfederation:"Koeriersfederasie", aiagents:"KI Agente",
    teamchat:"Spangesels", pod:"Bewys van Aflewering", notifications:"Kennisgewings",
    apidocs:"API Dokumentasie", testing:"Toetsing", monitoring:"Monitering", livemap:"Lewendige Kaart", driverapp:"Bestuurder-app",
    newOrder:"+ Nuwe Bestelling", signOut:"Teken Uit", welcome:"Welkom terug",
    totalVehicles:"Totale Voertuie", activeDrivers:"Aktiewe Bestuurders", totalOrders:"Totale Bestellings", successRate:"Sukseskoers",
    onRoute:"Op Roete", available:"Beskikbaar", completed:"Voltooi", pending:"Hangende",
    addDriver:"Voeg Bestuurder By", addVehicle:"Voeg Voertuig By", save:"Stoor", cancel:"Kanselleer",
  },
  zu: {
    dashboard:"Ikhompiyutha", fleet:"Ukulandela Imoto", orders:"Izicelo", drivers:"Abashayeli", analytics:"Ukuhlaziya",
    warehouses:"Izindawo Zokugcina", inventory:"Impahla", barcode:"Isikeni", fuel:"Uphethiloli", maintenance:"Ukunakekela",
    invoices:"Izinwadi", costanalysis:"Ukuhlaziya Izindleko", hubs:"Amahhabu", routeoptimizer:"Ukusulela Indlela",
    geofences:"Izindawo Ezivaliwe", returns:"Izibuyiso", forecast:"Isifinyezo Sezicelo", mlmaintenance:"ML Ukunakekela",
    telematics:"Telematics", courierfederation:"Abahambisi", aiagents:"I-AI Agents",
    teamchat:"Ingxoxo Yeqembu", pod:"Ubufakazi Bokuhambisa", notifications:"Izaziso",
    apidocs:"Imibhalo ye-API", testing:"Ukuhlola", monitoring:"Ukuqapha", livemap:"Imapa Ephilayo", driverapp:"Uhlelo Lomshayeli",
    newOrder:"+ Isicelo Esisha", signOut:"Phuma", welcome:"Wamukelekile futhi",
    totalVehicles:"Izimoto Zonke", activeDrivers:"Abashayeli Abakhona", totalOrders:"Izicelo Zonke", successRate:"Izinga Lempumelelo",
    onRoute:"Endleleni", available:"Iyatholakala", completed:"Kuqediwe", pending:"Kulindile",
    addDriver:"Engeza Umshayeli", addVehicle:"Engeza Imoto", save:"Gcina", cancel:"Khansela",
  },
  xh: {
    dashboard:"Ibhodi Yokulawula", fleet:"Ukulandela Imoto", orders:"Imiyalelo", drivers:"Abaqhubi", analytics:"Uhlalutyo",
    warehouses:"Iindawo Zokugcina", inventory:"Impahla", barcode:"Isikena", fuel:"Uphethiloli", maintenance:"Unyango",
    invoices:"Iifaktura", costanalysis:"Uhlalutyo Lwezindleko", hubs:"Iihhabu", routeoptimizer:"Ukulungisa Indlela",
    geofences:"Iindawo Ezivaliwe", returns:"Izibuyiso", forecast:"Isalathiso Sezicelo", mlmaintenance:"ML Unyango",
    telematics:"Telematics", courierfederation:"Abathumeli", aiagents:"AI Agents",
    teamchat:"Ingxoxo Yeqela", pod:"Ubungqina Bokuhanjiswa", notifications:"Izaziso",
    apidocs:"Imibhalo ye-API", testing:"Uvavanyo", monitoring:"Ukulinda", livemap:"Mapa Ephilayo", driverapp:"Uhlelo Lomqhubi",
    newOrder:"+ Umyalelo Omtsha", signOut:"Phuma", welcome:"Wamkelekile kwakhona",
    totalVehicles:"Zonke Izithuthi", activeDrivers:"Abaqhubi Abakhona", totalOrders:"Yonke Imiyalelo", successRate:"Iqondo Lempumelelo",
    onRoute:"Endleleni", available:"Iyafumaneka", completed:"Igqityiwe", pending:"Ilindile",
    addDriver:"Yongeza Umqhubi", addVehicle:"Yongeza Isithuthi", save:"Gcina", cancel:"Rhoxisa",
  },
}

export function t(key: string, lang: string = "en"): string {
  const k = key.replace(/-/g,"").toLowerCase()
  return translations[lang]?.[k] || translations.en[k] || key
}
`);

// ── 3. Add Driver API ─────────────────────────────────────────────────────────
const driversApi = `import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getTenantFilter } from "../../../lib/tenant"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const drivers = await prisma.driver.findMany({
      include: { vehicle: true },
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json(drivers)
  } catch { return NextResponse.json([]) }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const filter = await getTenantFilter()
    const driver = await prisma.driver.create({
      data: {
        ...filter,
        name: body.name,
        phone: body.phone || null,
        email: body.email || null,
        licenseNumber: body.licenseNumber || "DL-" + Date.now(),
        licenseType: body.licenseType || "CODE_10",
        status: "ACTIVE",
        latitude: body.latitude ? parseFloat(body.latitude) : -33.9249 + (Math.random()-0.5)*8,
        longitude: body.longitude ? parseFloat(body.longitude) : 18.4241 + (Math.random()-0.5)*10,
        vehicleId: body.vehicleId || null,
      },
      include: { vehicle: true }
    })
    return NextResponse.json(driver)
  } catch(e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
`;
write("app/api/drivers/route.ts", driversApi);

// ── 4. Driver App page ────────────────────────────────────────────────────────
write("app/driver/page.tsx", `"use client"
import { useState, useEffect } from "react"
import { Truck, MapPin, Package, CheckCircle, Phone, Navigation, Battery, Wifi, LogOut, User, BarChart2, AlertTriangle, Clock } from "lucide-react"

export default function DriverApp() {
  const [tab, setTab] = useState("home")
  const [driverCode, setDriverCode] = useState("")
  const [driver, setDriver] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState<{lat:number,lng:number}>({ lat: -33.9249, lng: 18.4241 })
  const [completing, setCompleting] = useState("")
  const [time, setTime] = useState(new Date())
  const [gpsActive, setGpsActive] = useState(false)

  useEffect(() => { const i = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(i) }, [])

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.watchPosition(p => {
      setLocation({ lat: p.coords.latitude, lng: p.coords.longitude })
      setGpsActive(true)
    }, () => setGpsActive(false), { enableHighAccuracy: true, timeout: 10000 })
  }, [])

  const login = async () => {
    if (!driverCode.trim()) return
    setLoading(true)
    try {
      const res = await fetch("/api/drivers")
      const data = await res.json()
      const found = Array.isArray(data) ? data.find((d: any) =>
        d.name.toLowerCase().includes(driverCode.toLowerCase()) ||
        d.licenseNumber?.toLowerCase() === driverCode.toLowerCase() ||
        d.phone === driverCode
      ) : null
      if (found) {
        setDriver(found)
        loadOrders(found.id)
      } else {
        alert("Driver not found. Try your full name, license number or phone.")
      }
    } catch { alert("Connection error. Please try again.") }
    setLoading(false)
  }

  const loadOrders = async (driverId: string) => {
    const res = await fetch("/api/orders")
    const data = await res.json()
    setOrders(Array.isArray(data) ? data.filter((o: any) =>
      o.driverId === driverId || o.status === "IN_PROGRESS"
    ) : [])
  }

  const completeDelivery = async (orderId: string) => {
    setCompleting(orderId)
    await fetch("/api/orders/" + orderId, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "COMPLETED", podAt: new Date().toISOString() })
    })
    setOrders(p => p.map(o => o.id === orderId ? { ...o, status: "COMPLETED" } : o))
    setCompleting("")
  }

  // Auto-update GPS position
  useEffect(() => {
    if (!driver) return
    const sync = async () => {
      if (driver.vehicleId) {
        await fetch("/api/vehicles/" + driver.vehicleId + "/location", {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ latitude: location.lat, longitude: location.lng })
        }).catch(() => {})
      }
      // Update driver location too
      await fetch("/api/drivers/" + driver.id, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: location.lat, longitude: location.lng })
      }).catch(() => {})
    }
    sync()
    const i = setInterval(sync, 10000)
    return () => clearInterval(i)
  }, [driver, location])

  const pending = orders.filter(o => ["PENDING","IN_PROGRESS"].includes(o.status))
  const completed = orders.filter(o => o.status === "COMPLETED")

  // ── LOGIN ──
  if (!driver) return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#080d1a 0%,#0f172a 50%,#1e1b4b 100%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"system-ui" }}>
      <div style={{ width:"100%", maxWidth:380 }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ width:80, height:80, borderRadius:22, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px", boxShadow:"0 0 50px rgba(99,102,241,0.5), 0 20px 40px rgba(0,0,0,0.3)" }}>
            <Truck size={40} color="white"/>
          </div>
          <div style={{ fontSize:28, fontWeight:900, color:"white", letterSpacing:"-0.5px" }}>FleetMind Driver</div>
          <div style={{ fontSize:13, color:"#475569", marginTop:6 }}>Powered by Cloudflare AI · South Africa</div>
        </div>
        <div style={{ background:"rgba(99,102,241,0.07)", borderRadius:20, padding:28, border:"1px solid rgba(99,102,241,0.18)", backdropFilter:"blur(20px)" }}>
          <div style={{ fontSize:16, fontWeight:700, color:"white", marginBottom:6 }}>Sign In</div>
          <div style={{ fontSize:12, color:"#475569", marginBottom:18 }}>Enter your name, license number or phone</div>
          <input value={driverCode} onChange={e => setDriverCode(e.target.value)}
            onKeyDown={e => e.key==="Enter" && login()}
            placeholder="e.g. Sipho Nkosi or 0821234567"
            style={{ width:"100%", padding:"14px 16px", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(99,102,241,0.3)", borderRadius:12, fontSize:15, color:"white", outline:"none", boxSizing:"border-box", marginBottom:14, fontFamily:"system-ui" }}/>
          <button onClick={login} disabled={loading || !driverCode.trim()}
            style={{ width:"100%", padding:14, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"none", borderRadius:12, color:"white", fontSize:15, fontWeight:700, cursor:"pointer", boxShadow:"0 8px 30px rgba(99,102,241,0.45)", opacity: loading||!driverCode.trim() ? 0.7 : 1 }}>
            {loading ? "Finding your profile..." : "Sign In →"}
          </button>
        </div>
        <div style={{ textAlign:"center", marginTop:20 }}>
          <a href="/" style={{ color:"#6366f1", fontSize:13, textDecoration:"none" }}>← Back to FleetMind</a>
        </div>
      </div>
    </div>
  )

  // ── MAIN APP ──
  return (
    <div style={{ minHeight:"100vh", background:"#080d1a", fontFamily:"system-ui", color:"#e2e8f0", display:"flex", flexDirection:"column", maxWidth:480, margin:"0 auto", position:"relative" }}>

      {/* Status bar */}
      <div style={{ background:"rgba(99,102,241,0.08)", padding:"7px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:11, borderBottom:"1px solid rgba(99,102,241,0.1)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background: gpsActive?"#10b981":"#f59e0b", boxShadow:"0 0 6px "+(gpsActive?"#10b981":"#f59e0b") }}/>
          <span style={{ color: gpsActive?"#10b981":"#f59e0b", fontWeight:600 }}>{gpsActive?"GPS Active":"GPS Searching"}</span>
          {gpsActive && <span style={{ color:"#334155" }}>{location.lat.toFixed(3)}, {location.lng.toFixed(3)}</span>}
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center", color:"#475569" }}>
          <span style={{ color:"#94a3b8" }}>{time.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span>
          <Wifi size={11}/><Battery size={11}/>
        </div>
      </div>

      {/* Header */}
      <div style={{ padding:"14px 18px", background:"linear-gradient(135deg,#0d1526,#111827)", borderBottom:"1px solid rgba(99,102,241,0.08)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:11 }}>
          <div style={{ width:44, height:44, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, fontWeight:800, color:"white", boxShadow:"0 4px 15px rgba(99,102,241,0.4)" }}>
            {driver.name[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:"white" }}>{driver.name}</div>
            <div style={{ fontSize:11, color:"#475569" }}>
              {driver.vehicle?.registration || "No vehicle"} · {driver.licenseType}
            </div>
          </div>
        </div>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          <div style={{ padding:"4px 10px", background:"rgba(16,185,129,0.1)", border:"1px solid rgba(16,185,129,0.25)", borderRadius:20, fontSize:10, color:"#10b981", fontWeight:700, letterSpacing:"0.5px" }}>ON DUTY</div>
          <button onClick={() => setDriver(null)} style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:8, padding:"6px 8px", cursor:"pointer", color:"#ef4444", display:"flex" }}>
            <LogOut size={14}/>
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:"auto", paddingBottom:84 }}>

        {/* HOME */}
        {tab === "home" && (
          <div style={{ padding:16 }}>
            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:18 }}>
              {[
                { l:"Pending", v: pending.length, c:"#f59e0b", bg:"rgba(245,158,11,0.1)" },
                { l:"Completed", v: completed.length, c:"#10b981", bg:"rgba(16,185,129,0.1)" },
                { l:"Total", v: orders.length, c:"#6366f1", bg:"rgba(99,102,241,0.1)" },
              ].map(s => (
                <div key={s.l} style={{ background:"linear-gradient(135deg,#0d1526,#111827)", borderRadius:14, padding:"14px 10px", border:"1px solid rgba(99,102,241,0.1)", textAlign:"center" }}>
                  <div style={{ fontSize:26, fontWeight:800, color:s.c, letterSpacing:"-0.5px" }}>{s.v}</div>
                  <div style={{ fontSize:10, color:"#475569", marginTop:3, fontWeight:600 }}>{s.l.toUpperCase()}</div>
                </div>
              ))}
            </div>

            {/* Deliveries header */}
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
              <Navigation size={15} color="#6366f1"/>
              <span style={{ fontSize:14, fontWeight:700, color:"white" }}>Today's Deliveries</span>
              {pending.length > 0 && <span style={{ marginLeft:"auto", padding:"2px 9px", background:"rgba(99,102,241,0.15)", borderRadius:10, fontSize:11, color:"#a5b4fc", fontWeight:600 }}>{pending.length} remaining</span>}
            </div>

            {pending.length === 0 && completed.length > 0 && (
              <div style={{ background:"linear-gradient(135deg,rgba(16,185,129,0.08),rgba(16,185,129,0.04))", borderRadius:16, padding:28, border:"1px solid rgba(16,185,129,0.2)", textAlign:"center" }}>
                <div style={{ fontSize:40, marginBottom:10 }}>🎉</div>
                <div style={{ fontSize:16, fontWeight:800, color:"white", marginBottom:6 }}>All Done!</div>
                <div style={{ fontSize:13, color:"#475569" }}>You completed {completed.length} deliveries today</div>
              </div>
            )}

            {pending.length === 0 && completed.length === 0 && (
              <div style={{ background:"rgba(99,102,241,0.05)", borderRadius:16, padding:28, border:"1px solid rgba(99,102,241,0.1)", textAlign:"center" }}>
                <Package size={32} color="#334155" style={{ display:"block", margin:"0 auto 10px" }}/>
                <div style={{ fontSize:14, fontWeight:600, color:"#94a3b8" }}>No deliveries assigned yet</div>
                <div style={{ fontSize:12, color:"#334155", marginTop:4 }}>Check back soon</div>
              </div>
            )}

            {pending.map((order, i) => (
              <div key={order.id} style={{ background:"linear-gradient(135deg,#0d1526,#111827)", borderRadius:16, padding:18, marginBottom:12, border: i===0 ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(99,102,241,0.1)", position:"relative" }}>
                {i === 0 && <div style={{ position:"absolute", top:-10, left:16, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius:20, padding:"3px 12px", fontSize:10, fontWeight:700, color:"white", letterSpacing:"0.5px", boxShadow:"0 4px 12px rgba(99,102,241,0.4)" }}>NEXT STOP #{i+1}</div>}
                {i > 0 && <div style={{ position:"absolute", top:-10, left:16, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:20, padding:"3px 12px", fontSize:10, fontWeight:700, color:"#64748b" }}>STOP #{i+1}</div>}

                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10, marginTop:6 }}>
                  <div>
                    <div style={{ fontSize:15, fontWeight:800, color:i===0?"#a5b4fc":"white", letterSpacing:"-0.3px" }}>{order.orderNumber}</div>
                    <div style={{ fontSize:13, color:"#94a3b8", marginTop:2, fontWeight:500 }}>{order.customerName}</div>
                  </div>
                  <span style={{ padding:"3px 10px", borderRadius:20, fontSize:10, fontWeight:700, background: order.priority==="URGENT"?"rgba(239,68,68,0.15)":"rgba(99,102,241,0.15)", color: order.priority==="URGENT"?"#ef4444":"#a5b4fc" }}>{order.priority||"NORMAL"}</span>
                </div>

                <div style={{ display:"flex", alignItems:"flex-start", gap:7, marginBottom:14, background:"rgba(99,102,241,0.05)", borderRadius:10, padding:"10px 12px", border:"1px solid rgba(99,102,241,0.08)" }}>
                  <MapPin size={14} color="#6366f1" style={{ flexShrink:0, marginTop:1 }}/>
                  <div>
                    <div style={{ fontSize:11, color:"#475569", marginBottom:2, fontWeight:600 }}>DELIVERY ADDRESS</div>
                    <div style={{ fontSize:13, color:"#e2e8f0", lineHeight:1.4 }}>{order.deliveryAddress}</div>
                  </div>
                </div>

                <div style={{ display:"grid", gridTemplateColumns:order.customerPhone?"1fr 1fr":"1fr", gap:8, marginBottom:10 }}>
                  {order.customerPhone && (
                    <a href={"tel:"+order.customerPhone}
                      style={{ padding:"10px", background:"rgba(16,185,129,0.08)", border:"1px solid rgba(16,185,129,0.2)", borderRadius:10, color:"#10b981", textDecoration:"none", fontSize:12, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                      <Phone size={13}/> Call Customer
                    </a>
                  )}
                  <a href={"https://www.google.com/maps/dir/?api=1&destination="+encodeURIComponent(order.deliveryAddress)} target="_blank"
                    style={{ padding:"10px", background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.2)", borderRadius:10, color:"#a5b4fc", textDecoration:"none", fontSize:12, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                    <Navigation size={13}/> Navigate
                  </a>
                </div>

                <button onClick={() => completeDelivery(order.id)} disabled={completing===order.id}
                  style={{ width:"100%", padding:13, background: completing===order.id?"rgba(16,185,129,0.3)":"linear-gradient(135deg,#10b981,#059669)", border:"none", borderRadius:12, color:"white", fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, boxShadow: completing===order.id?"none":"0 4px 20px rgba(16,185,129,0.3)" }}>
                  <CheckCircle size={17}/>
                  {completing===order.id ? "Confirming delivery..." : "Confirm Delivered"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* HISTORY */}
        {tab === "history" && (
          <div style={{ padding:16 }}>
            <div style={{ fontSize:15, fontWeight:700, color:"white", marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
              <Clock size={16} color="#6366f1"/> Completed Today
              <span style={{ marginLeft:"auto", padding:"2px 9px", background:"rgba(16,185,129,0.15)", borderRadius:10, fontSize:12, color:"#10b981", fontWeight:600 }}>{completed.length}</span>
            </div>
            {completed.map(o => (
              <div key={o.id} style={{ background:"linear-gradient(135deg,#0d1526,#111827)", borderRadius:14, padding:16, marginBottom:10, border:"1px solid rgba(16,185,129,0.15)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#a5b4fc" }}>{o.orderNumber}</div>
                  <div style={{ fontSize:12, color:"#94a3b8", marginTop:2 }}>{o.customerName}</div>
                  <div style={{ fontSize:11, color:"#334155", marginTop:2 }}>{o.deliveryAddress?.substring(0,36)}...</div>
                </div>
                <div style={{ width:36, height:36, borderRadius:"50%", background:"rgba(16,185,129,0.12)", border:"1px solid rgba(16,185,129,0.25)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <CheckCircle size={18} color="#10b981"/>
                </div>
              </div>
            ))}
            {completed.length===0 && <div style={{ color:"#334155", textAlign:"center", padding:48, fontSize:13 }}>No completed deliveries yet</div>}
          </div>
        )}

        {/* PROFILE */}
        {tab === "profile" && (
          <div style={{ padding:16 }}>
            <div style={{ background:"linear-gradient(135deg,#0d1526,#111827)", borderRadius:18, padding:28, border:"1px solid rgba(99,102,241,0.15)", marginBottom:14, textAlign:"center" }}>
              <div style={{ width:72, height:72, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:28, fontWeight:800, color:"white", boxShadow:"0 8px 25px rgba(99,102,241,0.4)" }}>
                {driver.name[0]?.toUpperCase()}
              </div>
              <div style={{ fontSize:20, fontWeight:800, color:"white", letterSpacing:"-0.3px" }}>{driver.name}</div>
              <div style={{ fontSize:13, color:"#6366f1", marginTop:4, fontWeight:500 }}>{driver.licenseType} License</div>
              <div style={{ fontSize:12, color:"#475569", marginTop:2 }}>{driver.licenseNumber}</div>
              {driver.phone && <div style={{ fontSize:13, color:"#94a3b8", marginTop:4 }}>{driver.phone}</div>}
            </div>

            {driver.vehicle && (
              <div style={{ background:"linear-gradient(135deg,#0d1526,#111827)", borderRadius:14, padding:18, border:"1px solid rgba(99,102,241,0.1)", marginBottom:14 }}>
                <div style={{ fontSize:13, fontWeight:600, color:"white", marginBottom:12, display:"flex", alignItems:"center", gap:6 }}><Truck size={14} color="#6366f1"/> Assigned Vehicle</div>
                {[["Registration",driver.vehicle.registration],["Make/Model",driver.vehicle.make+" "+driver.vehicle.model],["Type",driver.vehicle.type],["Fuel",driver.vehicle.fuelType]].map(([l,v])=>(
                  <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:"1px solid rgba(99,102,241,0.05)" }}>
                    <span style={{ fontSize:12, color:"#475569" }}>{l}</span>
                    <span style={{ fontSize:12, color:"white", fontWeight:500 }}>{v||"—"}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ background:"linear-gradient(135deg,#0d1526,#111827)", borderRadius:14, padding:18, border:"1px solid rgba(99,102,241,0.1)" }}>
              <div style={{ fontSize:13, fontWeight:600, color:"white", marginBottom:12 }}>Today's Performance</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {[
                  { l:"Orders",v:orders.length,c:"#6366f1" },
                  { l:"Completed",v:completed.length,c:"#10b981" },
                  { l:"Pending",v:pending.length,c:"#f59e0b" },
                  { l:"Success",v:orders.length>0?Math.round(completed.length/orders.length*100)+"%":"—",c:"#ec4899" }
                ].map(s=>(
                  <div key={s.l} style={{ padding:14, background:"rgba(255,255,255,0.02)", borderRadius:12, textAlign:"center", border:"1px solid rgba(99,102,241,0.06)" }}>
                    <div style={{ fontSize:22, fontWeight:800, color:s.c }}>{s.v}</div>
                    <div style={{ fontSize:11, color:"#475569", marginTop:3 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop:14, padding:"12px 16px", background:"rgba(99,102,241,0.05)", borderRadius:12, border:"1px solid rgba(99,102,241,0.1)", display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background: gpsActive?"#10b981":"#f59e0b" }}/>
              <div style={{ fontSize:12, color:"#64748b" }}>GPS {gpsActive?"syncing every 10s":"not active"}</div>
              {gpsActive && <div style={{ marginLeft:"auto", fontSize:11, color:"#334155" }}>{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</div>}
            </div>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:480, background:"rgba(8,13,26,0.97)", backdropFilter:"blur(20px)", borderTop:"1px solid rgba(99,102,241,0.12)", display:"grid", gridTemplateColumns:"1fr 1fr 1fr", padding:"10px 0 18px", zIndex:100 }}>
        {[
          { id:"home", label:"Deliveries", icon: Truck },
          { id:"history", label:"History", icon: Clock },
          { id:"profile", label:"Profile", icon: User },
        ].map(item => (
          <button key={item.id} onClick={() => setTab(item.id)}
            style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5, background:"none", border:"none", cursor:"pointer", color: tab===item.id?"#6366f1":"#334155", fontSize:10, fontWeight: tab===item.id?700:400, padding:0, transition:"color 0.2s" }}>
            <item.icon size={21}/>
            {item.label}
            {tab===item.id && <div style={{ width:20, height:3, borderRadius:2, background:"#6366f1", marginTop:-2 }}/>}
          </button>
        ))}
      </div>
    </div>
  )
}
`);

console.log("\\n✅ All files created successfully!");
