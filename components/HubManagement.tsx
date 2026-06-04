"use client"
import { useState, useEffect } from "react"
import { MapPin, Plus, Truck, Building } from "lucide-react"

const HUB_TYPES = ["DEPOT", "CROSS_DOCK", "SORTATION", "FULFILLMENT_CENTER", "MICRO_FULFILLMENT", "LOCKER"]

export function HubManagement() {
  const [hubs, setHubs] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: "", code: "", type: "DEPOT", address: "", latitude: "-33.9249", longitude: "18.4241" })
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetch("/api/hubs").then(r => r.json()).then(h => setHubs(Array.isArray(h) ? h : [])) }, [])

  const createHub = async () => {
    setLoading(true)
    const res = await fetch("/api/hubs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    if (res.ok) { const h = await res.json(); setHubs((prev:any[]) => [h, ...prev]); setShowForm(false); setForm({ name: "", code: "", type: "DEPOT", address: "", latitude: "-33.9249", longitude: "18.4241" }) }
    setLoading(false)
  }

  const inp: any = { width: "100%", padding: "9px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, fontSize: 13, color: "#e2e8f0", outline: "none", boxSizing: "border-box", marginBottom: 8 }

  const typeColors: any = { DEPOT: "#6366f1", CROSS_DOCK: "#10b981", SORTATION: "#f59e0b", FULFILLMENT_CENTER: "#ec4899", MICRO_FULFILLMENT: "#8b5cf6", LOCKER: "#14b8a6" }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}><Building size={20} color="#6366f1"/></div>
          <div><div style={{ fontSize: 18, fontWeight: "700", color: "white" }}>Hub Network</div><div style={{ fontSize: 12, color: "#475569" }}>Depots, cross-docks and fulfillment centers</div></div>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: "9px 18px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 10, color: "white", cursor: "pointer", fontSize: 13, fontWeight: "600", display: "flex", alignItems: "center", gap: 6 }}><Plus size={14}/> Add Hub</button>
      </div>

      {showForm && (
        <div style={{ background: "rgba(99,102,241,0.05)", borderRadius: 14, padding: 20, marginBottom: 20, border: "1px solid rgba(99,102,241,0.2)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <input placeholder="Hub Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inp}/>
            <input placeholder="Code (e.g. CPT-1)" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} style={inp}/>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} style={inp}>
              {HUB_TYPES.map(t => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
            </select>
            <input placeholder="Full Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} style={{...inp, gridColumn: "span 1"}}/>
            <input type="number" step="any" placeholder="Latitude" value={form.latitude} onChange={e => setForm({...form, latitude: e.target.value})} style={inp}/>
            <input type="number" step="any" placeholder="Longitude" value={form.longitude} onChange={e => setForm({...form, longitude: e.target.value})} style={inp}/>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#94a3b8", cursor: "pointer" }}>Cancel</button>
            <button onClick={createHub} disabled={loading || !form.name} style={{ flex: 1, padding: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontWeight: "600" }}>{loading ? "Creating..." : "Create Hub"}</button>
          </div>
        </div>
      )}

      {/* Hub map */}
      {hubs.length > 0 && (
        <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 20, border: "1px solid rgba(99,102,241,0.15)" }}>
          <iframe title="Hub Map" width="100%" height="350" frameBorder={0}
            srcDoc={`<!DOCTYPE html><html><head><link rel='stylesheet' href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'/><script src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'></script><style>body{margin:0}#map{height:100vh}</style></head><body><div id='map'></div><script>var map=L.map('map').setView([-33.9249,18.4241],10);L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{subdomains:'abcd'}).addTo(map);${hubs.map((h: any) => `L.marker([${h.latitude},${h.longitude}],{icon:L.divIcon({html:'<div style="background:#6366f1;color:white;padding:4px 8px;border-radius:6px;font-size:11px;font-weight:700;white-space:nowrap">${h.type.replace("_"," ")}<br/>${h.name}</div>',className:''})}).addTo(map).bindPopup('<b>${h.name}</b><br/>${h.type}<br/>${h.address}');`).join("")}</script></body></html>`}
            style={{ border: 0, width: "100%", height: 350 }}
          />
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {hubs.length === 0 && <div style={{ gridColumn: "span 3", padding: 40, textAlign: "center", color: "#334155", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(99,102,241,0.1)" }}>No hubs yet. Add your first hub above.</div>}
        {hubs.map((h: any) => (
          <div key={h.id} style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 14, padding: 20, border: "1px solid rgba(99,102,241,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: (typeColors[h.type] || "#6366f1") + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Building size={20} color={typeColors[h.type] || "#6366f1"}/>
              </div>
              <span style={{ padding: "3px 10px", borderRadius: 10, fontSize: 10, fontWeight: "700", background: (typeColors[h.type] || "#6366f1") + "20", color: typeColors[h.type] || "#6366f1" }}>{h.type.replace("_", " ")}</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: "700", color: "white", marginBottom: 4 }}>{h.name}</div>
            <div style={{ fontSize: 11, color: "#6366f1", marginBottom: 4, fontWeight: "600" }}>{h.code}</div>
            <div style={{ fontSize: 12, color: "#475569", display: "flex", alignItems: "center", gap: 4 }}><MapPin size={10}/> {h.address}</div>
            <div style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>{h.latitude?.toFixed(4)}, {h.longitude?.toFixed(4)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
