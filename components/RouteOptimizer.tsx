"use client"
import { useState, useEffect } from "react"
import { Map, Zap, CheckCircle, Clock, Truck, Package } from "lucide-react"

export function RouteOptimizer() {
  const [routes, setRoutes] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [form, setForm] = useState({ vehicleId: "", orderIds: [] as string[], date: new Date().toISOString().split("T")[0] })

  useEffect(() => {
    fetch("/api/routes").then(r => r.json()).then(d => setRoutes(Array.isArray(d) ? d : []))
    fetch("/api/vehicles").then(r => r.json()).then(d => setVehicles(Array.isArray(d) ? d : []))
    fetch("/api/orders").then(r => r.json()).then(d => setOrders(Array.isArray(d) ? d.filter((o: any) => o.status === "PENDING") : []))
  }, [])

  const autoOptimize = async () => {
    setLoading(true); setResult(null)
    const res = await fetch("/api/routes/optimize", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ date: form.date, maxOrders: 100 }) })
    const data = await res.json()
    setResult(data)
    fetch("/api/routes").then(r => r.json()).then(d => setRoutes(Array.isArray(d) ? d : []))
    fetch("/api/orders").then(r => r.json()).then(d => setOrders(Array.isArray(d) ? d.filter((o: any) => o.status === "PENDING") : []))
    setLoading(false)
  }

  const inp: any = { width: "100%", padding: "9px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, fontSize: 13, color: "#e2e8f0", outline: "none", boxSizing: "border-box", marginBottom: 8 }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}><Map size={20} color="#6366f1"/></div>
          <div><div style={{ fontSize: 18, fontWeight: "700", color: "white" }}>Route Optimizer</div><div style={{ fontSize: 12, color: "#475569" }}>Auto-assign orders to vehicles for optimal routes</div></div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} style={{ padding: "8px 12px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, color: "#a5b4fc", fontSize: 13 }}/>
          <button onClick={autoOptimize} disabled={loading || orders.length === 0} style={{ padding: "9px 18px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 10, color: "white", cursor: "pointer", fontSize: 13, fontWeight: "600", display: "flex", alignItems: "center", gap: 6 }}>
            <Zap size={14}/> {loading ? "Optimizing..." : "Auto-Optimize All"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Pending Orders", value: orders.length, color: "#f59e0b", icon: <Package size={18} color="#f59e0b"/> },
          { label: "Available Vehicles", value: vehicles.filter((v: any) => v.status === "AVAILABLE").length, color: "#10b981", icon: <Truck size={18} color="#10b981"/> },
          { label: "Active Routes", value: routes.filter((r: any) => r.status === "IN_PROGRESS" || r.status === "OPTIMIZED").length, color: "#6366f1", icon: <Map size={18} color="#6366f1"/> },
          { label: "Completed Today", value: routes.filter((r: any) => r.status === "COMPLETED").length, color: "#ec4899", icon: <CheckCircle size={18} color="#ec4899"/> },
        ].map(s => (
          <div key={s.label} style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 12, padding: 18, border: "1px solid rgba(99,102,241,0.1)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>{s.icon}</div>
            <div><div style={{ fontSize: 24, fontWeight: "700", color: s.color }}>{s.value}</div><div style={{ fontSize: 12, color: "#475569" }}>{s.label}</div></div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div style={{ background: "rgba(16,185,129,0.05)", borderRadius: 14, padding: 24, border: "1px solid rgba(16,185,129,0.15)", marginBottom: 20, textAlign: "center" }}>
          <CheckCircle size={32} color="#10b981" style={{ margin: "0 auto 10px" }}/>
          <div style={{ fontSize: 15, fontWeight: "600", color: "#10b981" }}>All orders assigned!</div>
          <div style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>No pending orders left to optimize.</div>
        </div>
      )}

      {result && (
        <div style={{ background: "rgba(99,102,241,0.05)", borderRadius: 14, padding: 20, border: "1px solid rgba(99,102,241,0.2)", marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: "700", color: "#a5b4fc", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><Zap size={16} color="#6366f1"/> Optimization Complete</div>
          <div style={{ fontSize: 13, color: "#10b981", marginBottom: 12 }}>{result.message}</div>
          <div style={{ display: "grid", gap: 8 }}>
            {result.routes?.map((r: any, i: number) => (
              <div key={i} style={{ padding: "10px 14px", background: "rgba(255,255,255,0.02)", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: "600", color: "white" }}>{r.vehicle} {r.driver && <span style={{ color: "#10b981" }}>— {r.driver}</span>}</div>
                  <div style={{ fontSize: 11, color: "#475569" }}>{r.stops} stops | ~{r.estimatedKm?.toFixed(0)}km</div>
                </div>
                <span style={{ padding: "3px 10px", borderRadius: 10, fontSize: 11, background: "rgba(99,102,241,0.15)", color: "#a5b4fc" }}>OPTIMIZED</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(99,102,241,0.1)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", padding: "10px 16px", borderBottom: "1px solid rgba(99,102,241,0.1)", fontSize: 11, fontWeight: "700", color: "#475569", letterSpacing: "0.5px" }}>
          <span>DATE</span><span>VEHICLE</span><span>STOPS</span><span>DISTANCE</span><span>STATUS</span>
        </div>
        {routes.length === 0 && <div style={{ padding: 30, textAlign: "center", color: "#334155", fontSize: 13 }}>No routes yet. Click Auto-Optimize to create routes.</div>}
        {routes.map((r: any) => (
          <div key={r.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", padding: "12px 16px", borderBottom: "1px solid rgba(99,102,241,0.05)", fontSize: 13, alignItems: "center" }}>
            <span style={{ color: "#94a3b8" }}>{new Date(r.date).toLocaleDateString()}</span>
            <span style={{ color: "#a5b4fc" }}>{r.vehicle?.registration || "—"}</span>
            <span style={{ color: "#e2e8f0" }}>{r.stops?.length || 0}</span>
            <span style={{ color: "#e2e8f0" }}>{r.totalDistanceKm ? r.totalDistanceKm.toFixed(0) + " km" : "—"}</span>
            <span style={{ padding: "3px 10px", borderRadius: 10, fontSize: 11, fontWeight: "600", display: "inline-block", background: r.status === "COMPLETED" ? "rgba(16,185,129,0.15)" : r.status === "IN_PROGRESS" ? "rgba(99,102,241,0.15)" : "rgba(245,158,11,0.15)", color: r.status === "COMPLETED" ? "#34d399" : r.status === "IN_PROGRESS" ? "#a5b4fc" : "#fbbf24" }}>{r.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}