"use client"
import { useState, useEffect } from "react"
import { Truck, MapPin, Package, CheckCircle, Phone, Camera, AlertTriangle, Clock, Navigation, Fuel, Star } from "lucide-react"

export default function DriverApp() {
  const [tab, setTab] = useState("dashboard")
  const [orders, setOrders] = useState<any[]>([])
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [driverName, setDriverName] = useState("Driver")
  const [updating, setUpdating] = useState("")
  const [checklist, setChecklist] = useState({ tyres: false, lights: false, fuel: false, brakes: false, mirrors: false, license: false })

  useEffect(() => {
    fetch("/api/driver-app/orders").then(r => r.json()).then(d => setOrders(Array.isArray(d) ? d : []))
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(pos => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      }, null, { enableHighAccuracy: true })
    }
    const n = localStorage.getItem("driverName")
    if (n) setDriverName(n)
  }, [])

  const updateStatus = async (orderId: string, status: string) => {
    setUpdating(orderId)
    await fetch(`/api/orders/${orderId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) })
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o))
    setUpdating("")
  }

  const statusColor = (s: string) => s === "COMPLETED" ? "#10b981" : s === "IN_PROGRESS" ? "#6366f1" : "#f59e0b"
  const allChecked = Object.values(checklist).every(Boolean)
  const pending = orders.filter(o => o.status === "PENDING" || o.status === "IN_PROGRESS")
  const completed = orders.filter(o => o.status === "COMPLETED")

  return (
    <div style={{ maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: "#080d1a", fontFamily: "system-ui,-apple-system,sans-serif", color: "#e2e8f0", paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", padding: "20px 20px 16px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Truck size={20} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "white" }}>FleetMind Driver</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Welcome, {driverName}</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "rgba(255,255,255,0.8)" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: position ? "#10b981" : "#ef4444", boxShadow: position ? "0 0 6px #10b981" : "none" }}></div>
              {position ? `GPS: ${position.lat.toFixed(4)}` : "No GPS"}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{pending.length} active · {completed.length} done</div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "rgba(99,102,241,0.1)", margin: "0 0 16px" }}>
        {[
          { l: "Active", v: pending.length, c: "#6366f1" },
          { l: "Done Today", v: completed.length, c: "#10b981" },
          { l: "Total", v: orders.length, c: "#f59e0b" },
        ].map(s => (
          <div key={s.l} style={{ padding: "12px 0", textAlign: "center", background: "#0d1526" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: 10, color: "#475569" }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Tab nav */}
      <div style={{ display: "flex", padding: "0 16px", gap: 8, marginBottom: 16, overflowX: "auto" }}>
        {[
          { id: "dashboard", label: "📋 Orders" },
          { id: "pretrip", label: "✅ Pre-Trip" },
          { id: "map", label: "🗺️ Navigate" },
          { id: "pod", label: "📷 POD" },
          { id: "fuel", label: "⛽ Fuel" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", background: tab === t.id ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(255,255,255,0.06)", color: "white", flexShrink: 0 }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "0 16px" }}>

        {/* ORDERS TAB */}
        {tab === "dashboard" && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 12 }}>Today's Deliveries</div>
            {pending.length === 0 && (
              <div style={{ textAlign: "center", padding: 40, color: "#334155", fontSize: 14 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
                All deliveries complete!
              </div>
            )}
            {pending.map(o => (
              <div key={o.id} style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 14, padding: 16, marginBottom: 12, border: "1px solid rgba(99,102,241,0.1)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#a5b4fc" }}>{o.orderNumber}</div>
                    <div style={{ fontSize: 13, color: "white", fontWeight: 600, marginTop: 2 }}>{o.customerName}</div>
                  </div>
                  <span style={{ padding: "3px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, background: statusColor(o.status) + "20", color: statusColor(o.status) }}>{o.status}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b", marginBottom: 6 }}>
                  <MapPin size={12} color="#6366f1" /> {o.deliveryAddress}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b", marginBottom: 12 }}>
                  <Phone size={12} color="#10b981" /> {o.customerPhone || "No phone"}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {o.status === "PENDING" && (
                    <button onClick={() => updateStatus(o.id, "IN_PROGRESS")} disabled={updating === o.id}
                      style={{ flex: 1, padding: "9px 0", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
                      🚛 Start Delivery
                    </button>
                  )}
                  {o.status === "IN_PROGRESS" && (
                    <>
                      <button onClick={() => updateStatus(o.id, "COMPLETED")} disabled={updating === o.id}
                        style={{ flex: 2, padding: "9px 0", background: "linear-gradient(135deg,#10b981,#059669)", border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
                        ✅ Mark Delivered
                      </button>
                      <button onClick={() => updateStatus(o.id, "FAILED")} disabled={updating === o.id}
                        style={{ flex: 1, padding: "9px 0", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, color: "#f87171", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                        ❌ Failed
                      </button>
                    </>
                  )}
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(o.deliveryAddress)}`} target="_blank" rel="noreferrer"
                    style={{ padding: "9px 12px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, color: "#6366f1", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                    🗺️ Nav
                  </a>
                </div>
              </div>
            ))}
            {completed.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 8 }}>Completed ({completed.length})</div>
                {completed.map(o => (
                  <div key={o.id} style={{ padding: "10px 14px", background: "rgba(16,185,129,0.05)", borderRadius: 10, marginBottom: 6, border: "1px solid rgba(16,185,129,0.1)", display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#34d399" }}>{o.orderNumber}</div>
                      <div style={{ fontSize: 11, color: "#475569" }}>{o.customerName}</div>
                    </div>
                    <CheckCircle size={16} color="#10b981" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PRE-TRIP INSPECTION */}
        {tab === "pretrip" && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 6 }}>Pre-Trip Inspection</div>
            <div style={{ fontSize: 12, color: "#475569", marginBottom: 16 }}>Complete before starting your shift</div>
            {[
              { key: "tyres", label: "Tyres & Pressure", icon: "🔘" },
              { key: "lights", label: "Lights & Indicators", icon: "💡" },
              { key: "fuel", label: "Fuel Level OK", icon: "⛽" },
              { key: "brakes", label: "Brakes Functional", icon: "🛑" },
              { key: "mirrors", label: "Mirrors Adjusted", icon: "🔍" },
              { key: "license", label: "License in Vehicle", icon: "📋" },
            ].map(item => (
              <div key={item.key} onClick={() => setChecklist({ ...checklist, [item.key]: !checklist[item.key as keyof typeof checklist] })}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: checklist[item.key as keyof typeof checklist] ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.03)", borderRadius: 12, marginBottom: 8, border: "1px solid " + (checklist[item.key as keyof typeof checklist] ? "rgba(16,185,129,0.25)" : "rgba(99,102,241,0.1)"), cursor: "pointer", transition: "all 0.2s" }}>
                <div style={{ fontSize: 22 }}>{item.icon}</div>
                <div style={{ flex: 1, fontSize: 14, color: "white" }}>{item.label}</div>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: checklist[item.key as keyof typeof checklist] ? "#10b981" : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                  {checklist[item.key as keyof typeof checklist] && <CheckCircle size={14} color="white" />}
                </div>
              </div>
            ))}
            <div style={{ marginTop: 20, padding: 16, background: allChecked ? "rgba(16,185,129,0.08)" : "rgba(245,158,11,0.08)", borderRadius: 14, border: "1px solid " + (allChecked ? "rgba(16,185,129,0.25)" : "rgba(245,158,11,0.25)") }}>
              {allChecked ? (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>✅</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#34d399" }}>Vehicle Cleared for Duty</div>
                  <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>All checks passed. Safe driving!</div>
                </div>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 14, color: "#fbbf24" }}>{Object.values(checklist).filter(Boolean).length}/6 checks complete</div>
                  <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>Complete all checks before starting</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* NAVIGATE */}
        {tab === "map" && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 12 }}>Navigation</div>
            {position && (
              <div style={{ padding: "10px 14px", background: "rgba(16,185,129,0.08)", borderRadius: 10, marginBottom: 12, border: "1px solid rgba(16,185,129,0.2)", fontSize: 12, color: "#34d399", display: "flex", alignItems: "center", gap: 6 }}>
                <Navigation size={14} /> GPS Active: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
              </div>
            )}
            {pending.map(o => (
              <div key={o.id} style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 12, padding: 14, marginBottom: 10, border: "1px solid rgba(99,102,241,0.1)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#a5b4fc", marginBottom: 4 }}>{o.orderNumber}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 10 }}>{o.deliveryAddress}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(o.deliveryAddress)}`} target="_blank" rel="noreferrer"
                    style={{ flex: 1, padding: "9px 0", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 8, color: "white", textDecoration: "none", fontSize: 12, fontWeight: 700, textAlign: "center" }}>
                    🗺️ Google Maps
                  </a>
                  <a href={`https://waze.com/ul?q=${encodeURIComponent(o.deliveryAddress)}`} target="_blank" rel="noreferrer"
                    style={{ flex: 1, padding: "9px 0", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, color: "#a5b4fc", textDecoration: "none", fontSize: 12, fontWeight: 600, textAlign: "center" }}>
                    🚗 Waze
                  </a>
                </div>
              </div>
            ))}
            {pending.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#334155", fontSize: 13 }}>No active deliveries to navigate to.</div>}
          </div>
        )}

        {/* POD */}
        {tab === "pod" && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 12 }}>Proof of Delivery</div>
            {pending.filter(o => o.status === "IN_PROGRESS").map(o => (
              <div key={o.id} style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 14, padding: 16, marginBottom: 12, border: "1px solid rgba(99,102,241,0.1)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#a5b4fc", marginBottom: 4 }}>{o.orderNumber}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>{o.customerName} · {o.deliveryAddress}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                  <label style={{ padding: "10px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12, color: "#a5b4fc", cursor: "pointer" }}>
                    <Camera size={14} /> Take Photo
                    <input type="file" accept="image/*" capture="environment" style={{ display: "none" }} />
                  </label>
                  <label style={{ padding: "10px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12, color: "#34d399", cursor: "pointer" }}>
                    ✍️ Signature
                    <input type="file" accept="image/*" style={{ display: "none" }} />
                  </label>
                </div>
                <button onClick={() => updateStatus(o.id, "COMPLETED")}
                  style={{ width: "100%", padding: "11px", background: "linear-gradient(135deg,#10b981,#059669)", border: "none", borderRadius: 10, color: "white", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
                  ✅ Confirm Delivery
                </button>
              </div>
            ))}
            {pending.filter(o => o.status === "IN_PROGRESS").length === 0 && (
              <div style={{ textAlign: "center", padding: 40, color: "#334155", fontSize: 13 }}>No in-progress orders. Start a delivery first.</div>
            )}
          </div>
        )}

        {/* FUEL */}
        {tab === "fuel" && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 12 }}>Log Fuel Stop</div>
            <FuelLogForm />
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "rgba(13,21,38,0.97)", borderTop: "1px solid rgba(99,102,241,0.15)", display: "flex", backdropFilter: "blur(20px)" }}>
        {[
          { id: "dashboard", icon: "📋", label: "Orders" },
          { id: "pretrip", icon: "✅", label: "Pre-Trip" },
          { id: "map", icon: "🗺️", label: "Navigate" },
          { id: "pod", icon: "📷", label: "POD" },
          { id: "fuel", icon: "⛽", label: "Fuel" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex: 1, padding: "10px 0", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>
            <span style={{ fontSize: 10, color: tab === t.id ? "#a5b4fc" : "#334155", fontWeight: tab === t.id ? 700 : 400 }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function FuelLogForm() {
  const [form, setForm] = useState({ litres: "", totalCost: "", station: "", odometer: "" })
  const [saved, setSaved] = useState(false)
  const [vehicles, setVehicles] = useState<any[]>([])
  const [vehicleId, setVehicleId] = useState("")
  useEffect(() => { fetch("/api/vehicles").then(r => r.json()).then(d => setVehicles(Array.isArray(d) ? d : [])) }, [])
  const save = async () => {
    await fetch("/api/fuel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ vehicleId, litres: parseFloat(form.litres), totalCost: parseFloat(form.totalCost), station: form.station, odometerKm: parseFloat(form.odometer) }) })
    setSaved(true); setForm({ litres: "", totalCost: "", station: "", odometer: "" })
    setTimeout(() => setSaved(false), 3000)
  }
  const inp: any = { width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 10, fontSize: 14, color: "#e2e8f0", outline: "none", boxSizing: "border-box" as const, marginBottom: 12, fontFamily: "system-ui" }
  if (saved) return <div style={{ textAlign: "center", padding: 40 }}><div style={{ fontSize: 40 }}>✅</div><div style={{ color: "#34d399", fontWeight: 700, fontSize: 15, marginTop: 10 }}>Fuel logged!</div></div>
  return (
    <div>
      <select value={vehicleId} onChange={e => setVehicleId(e.target.value)} style={inp}>
        <option value="">Select Vehicle *</option>
        {vehicles.map((v: any) => <option key={v.id} value={v.id}>{v.registration}</option>)}
      </select>
      <input placeholder="Litres filled *" type="number" value={form.litres} onChange={e => setForm({ ...form, litres: e.target.value })} style={inp} />
      <input placeholder="Total cost (R) *" type="number" value={form.totalCost} onChange={e => setForm({ ...form, totalCost: e.target.value })} style={inp} />
      <input placeholder="Station name" value={form.station} onChange={e => setForm({ ...form, station: e.target.value })} style={inp} />
      <input placeholder="Current odometer (km)" type="number" value={form.odometer} onChange={e => setForm({ ...form, odometer: e.target.value })} style={inp} />
      <button onClick={save} disabled={!vehicleId || !form.litres || !form.totalCost}
        style={{ width: "100%", padding: 14, background: "linear-gradient(135deg,#f59e0b,#d97706)", border: "none", borderRadius: 10, color: "white", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
        ⛽ Log Fuel Stop
      </button>
    </div>
  )
}