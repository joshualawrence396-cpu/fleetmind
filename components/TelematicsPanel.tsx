"use client"
import { useState, useEffect } from "react"
import { Activity, AlertTriangle, CheckCircle, Zap, Wifi, TrendingUp } from "lucide-react"

export function TelematicsPanel() {
  const [events, setEvents] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(false)
  const [simForm, setSimForm] = useState({ vehicleId: "", latitude: "-33.9249", longitude: "18.4241", speedKmh: "60", ignition: true, fuelLevelPct: "75" })
  const [vehicles, setVehicles] = useState([])

  useEffect(() => {
    fetch("/api/vehicles").then(r => r.json()).then(v => setVehicles(v || []))
    loadData()
  }, [])

  const loadData = () => {
    fetch("/api/telematics/ingest").then(r => r.json()).then(e => setEvents(Array.isArray(e) ? e.slice(0, 20) : []))
    fetch("/api/telematics/alerts").then(r => r.json()).then(a => setAlerts(Array.isArray(a) ? a : []))
  }

  const simulatePing = async () => {
    if (!simForm.vehicleId) return
    setLoading(true)
    const res = await fetch("/api/telematics/ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...simForm, speedKmh: parseFloat(simForm.speedKmh), fuelLevelPct: parseFloat(simForm.fuelLevelPct), latitude: parseFloat(simForm.latitude), longitude: parseFloat(simForm.longitude) })
    })
    if (res.ok) { loadData() }
    setLoading(false)
  }

  const acknowledgeAlert = async (id: string) => {
    await fetch("/api/telematics/alerts", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
    loadData()
  }

  const inp: any = { width: "100%", padding: "9px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, fontSize: 13, color: "#e2e8f0", outline: "none", boxSizing: "border-box", marginBottom: 8 }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}><Activity size={20} color="#6366f1" /></div>
        <div><div style={{ fontSize: 18, fontWeight: "700", color: "white" }}>Telematics & IoT</div><div style={{ fontSize: 12, color: "#475569" }}>Real-time vehicle telemetry and alerts</div></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Events", value: events.length, icon: <Wifi size={18} color="#6366f1"/>, color: "#6366f1" },
          { label: "Active Alerts", value: alerts.length, icon: <AlertTriangle size={18} color="#ef4444"/>, color: "#ef4444" },
          { label: "Devices Online", value: vehicles.filter((v: any) => v.status === "ON_ROUTE").length, icon: <Activity size={18} color="#10b981"/>, color: "#10b981" },
        ].map(s => (
          <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 18, border: "1px solid rgba(99,102,241,0.1)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>{s.icon}</div>
            <div><div style={{ fontSize: 24, fontWeight: "700", color: s.color }}>{s.value}</div><div style={{ fontSize: 12, color: "#475569" }}>{s.label}</div></div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

        {/* Simulate GPS ping */}
        <div style={{ background: "rgba(99,102,241,0.05)", borderRadius: 14, padding: 20, border: "1px solid rgba(99,102,241,0.15)" }}>
          <div style={{ fontSize: 14, fontWeight: "600", color: "white", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}><Zap size={16} color="#6366f1"/> Simulate GPS Ping</div>
          <select value={simForm.vehicleId} onChange={e => setSimForm({...simForm, vehicleId: e.target.value})} style={inp}>
            <option value="">Select Vehicle</option>
            {vehicles.map((v: any) => <option key={v.id} value={v.id}>{v.registration} - {v.make}</option>)}
          </select>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <input type="number" step="any" placeholder="Latitude" value={simForm.latitude} onChange={e => setSimForm({...simForm, latitude: e.target.value})} style={inp}/>
            <input type="number" step="any" placeholder="Longitude" value={simForm.longitude} onChange={e => setSimForm({...simForm, longitude: e.target.value})} style={inp}/>
            <input type="number" placeholder="Speed km/h" value={simForm.speedKmh} onChange={e => setSimForm({...simForm, speedKmh: e.target.value})} style={inp}/>
            <input type="number" placeholder="Fuel %" value={simForm.fuelLevelPct} onChange={e => setSimForm({...simForm, fuelLevelPct: e.target.value})} style={inp}/>
          </div>
          <button onClick={simulatePing} disabled={loading || !simForm.vehicleId} style={{ width: "100%", padding: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontWeight: "600", fontSize: 13 }}>
            {loading ? "Sending..." : "Send GPS Ping"}
          </button>
          <div style={{ fontSize: 11, color: "#334155", marginTop: 8, textAlign: "center" }}>
            In production: GPS devices POST to /api/telematics/ingest
          </div>
        </div>

        {/* Active alerts */}
        <div style={{ background: "rgba(239,68,68,0.03)", borderRadius: 14, padding: 20, border: "1px solid rgba(239,68,68,0.1)" }}>
          <div style={{ fontSize: 14, fontWeight: "600", color: "white", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}><AlertTriangle size={16} color="#ef4444"/> Active Alerts ({alerts.length})</div>
          {alerts.length === 0 && <div style={{ color: "#334155", fontSize: 13, padding: 20, textAlign: "center" }}>No active alerts</div>}
          {alerts.slice(0, 5).map((a: any) => (
            <div key={a.id} style={{ padding: 12, borderRadius: 8, background: a.severity === "HIGH" ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)", border: "1px solid " + (a.severity === "HIGH" ? "rgba(239,68,68,0.2)" : "rgba(245,158,11,0.2)"), marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: "600", color: a.severity === "HIGH" ? "#f87171" : "#fbbf24" }}>{a.type} - {a.vehicle?.registration}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{a.message}</div>
              </div>
              <button onClick={() => acknowledgeAlert(a.id)} style={{ padding: "3px 8px", background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 6, color: "#34d399", cursor: "pointer", fontSize: 11 }}>ACK</button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent events */}
      <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(99,102,241,0.1)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr", padding: "10px 16px", borderBottom: "1px solid rgba(99,102,241,0.1)", fontSize: 11, fontWeight: "700", color: "#475569", letterSpacing: "0.5px" }}>
          <span>TIME</span><span>VEHICLE</span><span>LOCATION</span><span>SPEED</span><span>FUEL</span><span>IGNITION</span>
        </div>
        {events.length === 0 && <div style={{ padding: 30, textAlign: "center", color: "#334155", fontSize: 13 }}>No telemetry events yet. Send a GPS ping above.</div>}
        {events.map((e: any, i) => (
          <div key={e.id || i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr", padding: "10px 16px", borderBottom: "1px solid rgba(99,102,241,0.05)", fontSize: 12, alignItems: "center" }}>
            <span style={{ color: "#64748b" }}>{new Date(e.timestamp).toLocaleTimeString()}</span>
            <span style={{ color: "#a5b4fc", fontWeight: "500" }}>{e.vehicle?.registration || "-"}</span>
            <span style={{ color: "#e2e8f0" }}>{e.latitude?.toFixed(4)}, {e.longitude?.toFixed(4)}</span>
            <span style={{ color: e.speedKmh > 100 ? "#ef4444" : "#e2e8f0" }}>{e.speedKmh ? e.speedKmh + " km/h" : "-"}</span>
            <span style={{ color: e.fuelLevelPct < 20 ? "#f59e0b" : "#e2e8f0" }}>{e.fuelLevelPct ? e.fuelLevelPct + "%" : "-"}</span>
            <span style={{ color: e.ignition ? "#10b981" : "#ef4444" }}>{e.ignition ? "ON" : "OFF"}</span>
          </div>
        ))}
      </div>
    </div>
  )
}