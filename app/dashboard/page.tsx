"use client"
import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Truck, Users, Package, BarChart2, MapPin, Zap, Globe, Bell, RefreshCw, TrendingUp, Cpu, Activity, CheckCircle, XCircle, FlaskConical, Play, LogOut, Plus, Warehouse, Map, DollarSign, FileText, Wifi, BarChart, Wrench, Fuel, Box, ScanLine, Route } from "lucide-react"
import { ChatBot } from "../../components/ChatBot"
import dynamic from "next/dynamic"
import { t } from "../../lib/i18n"
const LiveMap = dynamic(() => import("../../components/LiveMap").then(m => ({ default: m.LiveMap })), { ssr: false, loading: () => <div style={{height:"500px",background:"#0a0f1e",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",color:"#475569"}}>Loading map...</div> })

const NAV = [
  { label: "OVERVIEW", items: [{ id: "dashboard", label: "Dashboard", icon: "BarChart2" }, { id: "analytics", label: "Analytics", icon: "BarChart" }, { id: "live-map", label: "Live Map", icon: "MapPin" }] },
  { label: "OPERATIONS", items: [{ id: "fleet", label: "Fleet Tracking", icon: "Truck" }, { id: "drivers", label: "Drivers", icon: "Users" }, { id: "orders", label: "Orders", icon: "Package" }] },
  { label: "WAREHOUSE", items: [{ id: "warehouses", label: "Warehouses", icon: "Warehouse" }, { id: "inventory", label: "Inventory", icon: "Box" }, { id: "barcode", label: "Barcode Scanner", icon: "ScanLine" }] },
  { label: "VEHICLE", items: [{ id: "fuel", label: "Fuel", icon: "Fuel" }, { id: "maintenance", label: "Maintenance", icon: "Wrench" }] },
  { label: "BUSINESS", items: [{ id: "invoices", label: "Invoices", icon: "FileText" }, { id: "cost-analysis", label: "Cost Analysis", icon: "DollarSign" }] },
  { label: "NETWORK", items: [{ id: "hubs", label: "Hub Network", icon: "Warehouse" }, { id: "route-optimizer", label: "Route Optimizer", icon: "Map" }, { id: "geofences", label: "Geofencing", icon: "MapPin" }] },
  { label: "LOGISTICS", items: [{ id: "returns", label: "Returns", icon: "RefreshCw" }, { id: "forecast", label: "Demand Forecast", icon: "TrendingUp" }, { id: "ml-maintenance", label: "ML Maintenance", icon: "Cpu" }] },
  { label: "IoT & AI", items: [{ id: "telematics", label: "Telematics/IoT", icon: "Wifi" }, { id: "courier-federation", label: "Courier Federation", icon: "Globe" }, { id: "ai-agents", label: "AI Agents", icon: "Zap" }] },
  { label: "COMMS", items: [{ id: "pod", label: "Proof of Delivery", icon: "CheckCircle" }, { id: "notifications", label: "Notifications", icon: "Bell" }] },
  { label: "DEV", items: [{ id: "api-docs", label: "API Docs", icon: "FileText" }, { id: "testing", label: "Testing", icon: "FlaskConical" }, { id: "monitoring", label: "Monitoring", icon: "Activity" }] },
]

function card(color = "#6366f1") {
  return { background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 12, padding: 16, border: `1px solid ${color}20` }
}
const INP: any = { width: "100%", padding: "9px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, fontSize: 13, color: "#e2e8f0", outline: "none", boxSizing: "border-box", marginBottom: 10, fontFamily: "system-ui" }
const FORM_WRAP: any = { background: "rgba(99,102,241,0.05)", borderRadius: 14, padding: 20, border: "1px solid rgba(99,102,241,0.15)" }

// ── GEOFENCING ────────────────────────────────────────────────
function GeofencingPanel() {
  const [geofences, setGeofences] = useState([])
  const [form, setForm] = useState({ name: "", centerLat: "-33.9249", centerLng: "18.4241", radiusKm: "1" })
  const [loading, setLoading] = useState(false)
  useEffect(() => { fetch("/api/geofences").then(r => r.json()).then(d => setGeofences(Array.isArray(d) ? d : [])) }, [])
  const create = async () => {
    setLoading(true)
    const res = await fetch("/api/geofences", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    if (res.ok) { const g = await res.json(); setGeofences([g, ...geofences]); setForm({ name: "", centerLat: "-33.9249", centerLng: "18.4241", radiusKm: "1" }) }
    setLoading(false)
  }
  return (
    <div style={{ padding: 24 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}><MapPin size={20} color="#6366f1" /> Geofencing</div>
      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 20 }}>
        <div style={FORM_WRAP}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 14 }}>Create Geofence</div>
          <input placeholder="Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={INP} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <input placeholder="Latitude" value={form.centerLat} onChange={e => setForm({ ...form, centerLat: e.target.value })} style={INP} />
            <input placeholder="Longitude" value={form.centerLng} onChange={e => setForm({ ...form, centerLng: e.target.value })} style={INP} />
          </div>
          <input placeholder="Radius (km)" value={form.radiusKm} onChange={e => setForm({ ...form, radiusKm: e.target.value })} style={INP} />
          <button onClick={create} disabled={loading || !form.name} style={{ width: "100%", padding: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>{loading ? "Creating..." : "Create Geofence"}</button>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "white", marginBottom: 10 }}>Active ({geofences.length})</div>
          {geofences.map((g: any) => (
            <div key={g.id} style={{ ...card(), padding: "12px 14px", marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "white" }}>{g.name}</div>
              <div style={{ fontSize: 11, color: "#475569" }}>{parseFloat(g.centerLat).toFixed(4)}, {parseFloat(g.centerLng).toFixed(4)} · r={g.radiusKm}km</div>
            </div>
          ))}
          {geofences.length === 0 && <div style={{ color: "#334155", fontSize: 13, padding: 20, textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: 10 }}>No geofences yet</div>}
        </div>
      </div>
    </div>
  )
}

// ── RETURNS ───────────────────────────────────────────────────
function ReturnsPanel() {
  const [returns, setReturns] = useState([])
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState({ orderId: "", reason: "FAILED_DELIVERY", condition: "GOOD", notes: "", refundAmount: "" })
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    fetch("/api/returns").then(r => r.json()).then(d => setReturns(Array.isArray(d) ? d : []))
    fetch("/api/orders").then(r => r.json()).then(d => setOrders(Array.isArray(d) ? d : []))
  }, [])
  const create = async () => {
    if (!form.orderId) return
    setLoading(true)
    const res = await fetch("/api/returns", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    if (res.ok) { const r = await res.json(); setReturns([r, ...returns]) }
    setLoading(false)
  }
  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/returns", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) })
    setReturns(returns.map((r: any) => r.id === id ? { ...r, status } : r))
  }
  const sc = (s: string) => s === "RESOLVED" ? "#10b981" : s === "IN_TRANSIT" ? "#6366f1" : "#f59e0b"
  return (
    <div style={{ padding: 24 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}><RefreshCw size={20} color="#6366f1" /> Returns</div>
      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 20 }}>
        <div style={FORM_WRAP}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 14 }}>Create Return</div>
          <select value={form.orderId} onChange={e => setForm({ ...form, orderId: e.target.value })} style={INP}>
            <option value="">Select Order *</option>
            {orders.map((o: any) => <option key={o.id} value={o.id}>{o.orderNumber} — {o.customerName}</option>)}
          </select>
          <select value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} style={INP}>
            <option value="FAILED_DELIVERY">Failed Delivery</option>
            <option value="CUSTOMER_REFUSED">Customer Refused</option>
            <option value="DAMAGED">Damaged</option>
            <option value="WRONG_ITEM">Wrong Item</option>
          </select>
          <input placeholder="Refund (R)" type="number" value={form.refundAmount} onChange={e => setForm({ ...form, refundAmount: e.target.value })} style={INP} />
          <input placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={INP} />
          <button onClick={create} disabled={loading || !form.orderId} style={{ width: "100%", padding: 10, background: "linear-gradient(135deg,#ef4444,#dc2626)", border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontWeight: 600 }}>{loading ? "Creating..." : "Create Return"}</button>
        </div>
        <div>
          {returns.map((r: any) => (
            <div key={r.id} style={{ ...card(), padding: "12px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "white" }}>{r.reason?.replace(/_/g, " ")}</div>
                <div style={{ fontSize: 11, color: "#475569" }}>{r.notes} {r.refundAmount && `· R${r.refundAmount}`}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ padding: "2px 8px", borderRadius: 8, fontSize: 10, fontWeight: 700, background: sc(r.status) + "20", color: sc(r.status) }}>{r.status}</span>
                {r.status === "REQUESTED" && <button onClick={() => updateStatus(r.id, "RESOLVED")} style={{ padding: "3px 10px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 6, color: "#34d399", cursor: "pointer", fontSize: 11 }}>Resolve</button>}
              </div>
            </div>
          ))}
          {returns.length === 0 && <div style={{ color: "#334155", textAlign: "center", padding: 40, fontSize: 13, background: "rgba(255,255,255,0.02)", borderRadius: 10 }}>No returns yet</div>}
        </div>
      </div>
    </div>
  )
}

// ── FORECAST ──────────────────────────────────────────────────
function ForecastPanel() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => { load() }, [])
  const load = async () => { setLoading(true); try { const r = await fetch("/api/forecast"); if (r.ok) setData(await r.json()) } catch {} setLoading(false) }
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "white", display: "flex", alignItems: "center", gap: 8 }}><TrendingUp size={20} color="#6366f1" /> Demand Forecasting</div>
        <div style={{ display: "flex", gap: 10 }}>
          <span style={{ fontSize: 11, padding: "3px 10px", background: "rgba(99,102,241,0.1)", borderRadius: 10, color: "#a5b4fc" }}>{(data as any)?.model === "prophet" ? "Prophet ML" : "Simple Avg"}</span>
          <button onClick={load} style={{ padding: "8px 16px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, color: "#6366f1", cursor: "pointer", fontSize: 13 }}>Refresh</button>
        </div>
      </div>
      {loading && <div style={{ textAlign: "center", padding: 40, color: "#475569" }}>Running forecast...</div>}
      {(data as any)?.forecast && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 10, marginBottom: 20 }}>
            {(data as any).forecast.map((f: any) => (
              <div key={f.date} style={{ ...card("#6366f1"), textAlign: "center", padding: "14px 10px" }}>
                <div style={{ fontSize: 10, color: "#475569", marginBottom: 6 }}>{new Date(f.date).toLocaleDateString("en-ZA", { weekday: "short" })}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#6366f1" }}>{f.expected}</div>
                <div style={{ fontSize: 10, color: "#334155", marginTop: 4 }}>orders</div>
                <div style={{ fontSize: 9, color: f.confidence === "HIGH" ? "#10b981" : f.confidence === "MEDIUM" ? "#f59e0b" : "#ef4444", marginTop: 4, fontWeight: 700 }}>{f.confidence}</div>
              </div>
            ))}
          </div>
          {(data as any).insights?.length > 0 && (
            <div style={{ ...card(), padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "white", marginBottom: 8 }}>Insights</div>
              {(data as any).insights.map((i: string, idx: number) => <div key={idx} style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>• {i}</div>)}
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ── ML MAINTENANCE ────────────────────────────────────────────
function MLMaintenancePanel() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => { load() }, [])
  const load = async () => { setLoading(true); try { const r = await fetch("/api/maintenance/predict"); if (r.ok) setData(await r.json()) } catch {} setLoading(false) }
  const rc = (r: string) => r === "CRITICAL" ? "#ef4444" : r === "HIGH" ? "#f59e0b" : r === "MEDIUM" ? "#6366f1" : "#10b981"
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "white", display: "flex", alignItems: "center", gap: 8 }}><Cpu size={20} color="#6366f1" /> ML Predictive Maintenance</div>
        <div style={{ display: "flex", gap: 10 }}>
          <span style={{ fontSize: 11, padding: "3px 10px", background: "rgba(99,102,241,0.1)", borderRadius: 10, color: "#a5b4fc" }}>{(data as any)?.model || "loading"}</span>
          <button onClick={load} style={{ padding: "8px 16px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, color: "#6366f1", cursor: "pointer", fontSize: 13 }}>Refresh</button>
        </div>
      </div>
      {loading && <div style={{ textAlign: "center", padding: 40, color: "#475569" }}>Analyzing...</div>}
      {(data as any)?.predictions && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 20 }}>
            {["CRITICAL", "HIGH", "MEDIUM", "LOW"].map(level => (
              <div key={level} style={{ ...card(rc(level)), textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: rc(level) }}>{(data as any).predictions.filter((p: any) => p.riskLevel === level).length}</div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>{level}</div>
              </div>
            ))}
          </div>
          {(data as any).summary && <div style={{ fontSize: 13, color: "#64748b", marginBottom: 16, padding: "10px 14px", background: "rgba(99,102,241,0.05)", borderRadius: 8 }}>{(data as any).summary}</div>}
          <div style={{ display: "grid", gap: 10 }}>
            {(data as any).predictions.map((p: any) => (
              <div key={p.vehicleId} style={{ ...card(rc(p.riskLevel)), padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "white" }}>{p.registration}</div>
                  <div style={{ fontSize: 12, color: "#475569" }}>{p.component} · {p.daysUntilService} days</div>
                  <div style={{ fontSize: 11, color: rc(p.riskLevel) }}>{p.recommendation}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ padding: "4px 12px", borderRadius: 10, background: rc(p.riskLevel) + "20", color: rc(p.riskLevel), fontSize: 12, fontWeight: 700 }}>{p.riskLevel}</div>
                  <div style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>Risk: {Math.round((p.riskScore || 0) * 100)}%</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── WAREHOUSES ────────────────────────────────────────────────
function WarehousesPanel() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ name: "", address: "", city: "", capacity: "" })
  const [loading, setLoading] = useState(false)
  useEffect(() => { fetch("/api/warehouses").then(r => r.json()).then(d => setItems(Array.isArray(d) ? d : [])) }, [])
  const create = async () => {
    setLoading(true)
    const res = await fetch("/api/warehouses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    if (res.ok) { const w = await res.json(); setItems([w, ...items]); setForm({ name: "", address: "", city: "", capacity: "" }) }
    setLoading(false)
  }
  return (
    <div style={{ padding: 24 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}><Warehouse size={20} color="#6366f1" /> Warehouses ({items.length})</div>
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20 }}>
        <div style={FORM_WRAP}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 14 }}>Add Warehouse</div>
          <input placeholder="Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={INP} />
          <input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={INP} />
          <input placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={INP} />
          <input placeholder="Capacity (sqm)" type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} style={INP} />
          <button onClick={create} disabled={loading || !form.name} style={{ width: "100%", padding: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>{loading ? "Adding..." : "Add Warehouse"}</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {items.map((w: any) => (
            <div key={w.id} style={card()}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 6 }}>{w.name}</div>
              <div style={{ fontSize: 12, color: "#475569" }}>{w.address}, {w.city}</div>
              {w.capacity && <div style={{ fontSize: 12, color: "#10b981", marginTop: 6 }}>{w.capacity} sqm</div>}
            </div>
          ))}
          {items.length === 0 && <div style={{ gridColumn: "1/-1", color: "#334155", textAlign: "center", padding: 40, fontSize: 13 }}>No warehouses yet.</div>}
        </div>
      </div>
    </div>
  )
}

// ── INVENTORY ─────────────────────────────────────────────────
function InventoryPanel() {
  const [items, setItems] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [form, setForm] = useState({ name: "", sku: "", quantity: "", unitPrice: "", minStock: "", warehouseId: "" })
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    fetch("/api/inventory").then(r => r.json()).then(d => setItems(Array.isArray(d) ? d : []))
    fetch("/api/warehouses").then(r => r.json()).then(d => setWarehouses(Array.isArray(d) ? d : []))
  }, [])
  const create = async () => {
    setLoading(true)
    const res = await fetch("/api/inventory", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, quantity: parseInt(form.quantity) || 0, unitPrice: parseFloat(form.unitPrice) || 0, minStock: parseInt(form.minStock) || 5 }) })
    if (res.ok) { const i = await res.json(); setItems([i, ...items]); setForm({ name: "", sku: "", quantity: "", unitPrice: "", minStock: "", warehouseId: "" }) }
    setLoading(false)
  }
  const low = items.filter((i: any) => i.quantity <= i.minStock)
  return (
    <div style={{ padding: 24 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}><Box size={20} color="#6366f1" /> Inventory ({items.length})</div>
      {low.length > 0 && <div style={{ padding: "10px 16px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, marginBottom: 16, fontSize: 13, color: "#f87171" }}>⚠️ {low.length} items low stock: {low.map((i: any) => i.name).join(", ")}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20 }}>
        <div style={FORM_WRAP}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 14 }}>Add Item</div>
          <input placeholder="Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={INP} />
          <input placeholder="SKU" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} style={INP} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <input placeholder="Qty *" type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} style={INP} />
            <input placeholder="Min Stock" type="number" value={form.minStock} onChange={e => setForm({ ...form, minStock: e.target.value })} style={INP} />
          </div>
          <input placeholder="Unit Price (R)" type="number" value={form.unitPrice} onChange={e => setForm({ ...form, unitPrice: e.target.value })} style={INP} />
          <select value={form.warehouseId} onChange={e => setForm({ ...form, warehouseId: e.target.value })} style={INP}>
            <option value="">Warehouse</option>
            {warehouses.map((w: any) => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
          <button onClick={create} disabled={loading || !form.name} style={{ width: "100%", padding: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>{loading ? "Adding..." : "Add Item"}</button>
        </div>
        <div style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(99,102,241,0.1)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "10px 16px", borderBottom: "1px solid rgba(99,102,241,0.1)", fontSize: 11, fontWeight: 700, color: "#475569" }}><span>ITEM</span><span>SKU</span><span>QTY</span><span>PRICE</span><span>STATUS</span></div>
          {items.map((i: any) => (
            <div key={i.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "10px 16px", borderBottom: "1px solid rgba(99,102,241,0.05)", alignItems: "center", fontSize: 12 }}>
              <span style={{ color: "white" }}>{i.name}</span>
              <span style={{ color: "#475569" }}>{i.sku || "—"}</span>
              <span style={{ color: i.quantity <= i.minStock ? "#ef4444" : "#10b981", fontWeight: 600 }}>{i.quantity}</span>
              <span style={{ color: "#94a3b8" }}>R{i.unitPrice || 0}</span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: i.quantity <= i.minStock ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)", color: i.quantity <= i.minStock ? "#f87171" : "#34d399" }}>{i.quantity <= i.minStock ? "LOW" : "OK"}</span>
            </div>
          ))}
          {items.length === 0 && <div style={{ padding: 30, textAlign: "center", color: "#334155", fontSize: 13 }}>No items yet.</div>}
        </div>
      </div>
    </div>
  )
}

// ── BARCODE ───────────────────────────────────────────────────
function BarcodePanel() {
  const [scanned, setScanned] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const lookup = async () => {
    if (!scanned.trim()) return
    setLoading(true)
    const res = await fetch(`/api/barcode?code=${encodeURIComponent(scanned)}`)
    setResult(res.ok ? await res.json() : { error: "Not found" })
    setLoading(false)
  }
  return (
    <div style={{ padding: 24 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}><ScanLine size={20} color="#6366f1" /> Barcode Scanner</div>
      <div style={{ maxWidth: 480 }}>
        <div style={FORM_WRAP}>
          <div style={{ fontSize: 13, color: "#475569", marginBottom: 12 }}>Enter barcode or SKU to look up inventory</div>
          <div style={{ display: "flex", gap: 10 }}>
            <input placeholder="Scan or type barcode..." value={scanned} onChange={e => setScanned(e.target.value)} onKeyDown={e => e.key === "Enter" && lookup()} style={{ flex: 1, padding: "10px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, fontSize: 14, color: "#e2e8f0", outline: "none", fontFamily: "system-ui" }} />
            <button onClick={lookup} disabled={loading} style={{ padding: "10px 20px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>{loading ? "..." : "Scan"}</button>
          </div>
        </div>
        {result && (
          <div style={{ ...card(), marginTop: 16 }}>
            {(result as any).error ? <div style={{ color: "#f87171" }}>{(result as any).error}</div> : (
              <>
                <div style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 12 }}>{(result as any).name}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[["SKU", (result as any).sku], ["Qty", (result as any).quantity], ["Price", `R${(result as any).unitPrice || 0}`], ["Status", (result as any).quantity <= (result as any).minStock ? "LOW STOCK" : "In Stock"]].map(([l, v]) => (
                    <div key={l as string} style={{ padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
                      <div style={{ fontSize: 10, color: "#475569" }}>{l}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "white" }}>{v}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── FUEL ──────────────────────────────────────────────────────
function FuelPanel() {
  const [entries, setEntries] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState({ vehicleId: "", litres: "", totalCost: "", odometer: "", station: "" })
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    fetch("/api/fuel").then(r => r.json()).then(d => setEntries(Array.isArray(d) ? d : []))
    fetch("/api/vehicles").then(r => r.json()).then(d => setVehicles(Array.isArray(d) ? d : []))
  }, [])
  const add = async () => {
    setLoading(true)
    const res = await fetch("/api/fuel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, litres: parseFloat(form.litres) || 0, totalCost: parseFloat(form.totalCost) || 0, odometerKm: parseFloat(form.odometer) || 0 }) })
    if (res.ok) { const e = await res.json(); setEntries([e, ...entries]); setForm({ vehicleId: "", litres: "", totalCost: "", odometer: "", station: "" }) }
    setLoading(false)
  }
  const total = entries.reduce((s: number, e: any) => s + (e.totalCost || 0), 0)
  return (
    <div style={{ padding: 24 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}><Fuel size={20} color="#6366f1" /> Fuel Management</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        {[{ l: "Total Spent", v: `R${total.toFixed(0)}`, c: "#ef4444" }, { l: "Total Litres", v: `${entries.reduce((s: number, e: any) => s + (e.litres || 0), 0).toFixed(0)}L`, c: "#f59e0b" }, { l: "Entries", v: entries.length, c: "#6366f1" }].map(s => (
          <div key={s.l} style={{ ...card(s.c), textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20 }}>
        <div style={FORM_WRAP}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 14 }}>Log Fuel</div>
          <select value={form.vehicleId} onChange={e => setForm({ ...form, vehicleId: e.target.value })} style={INP}>
            <option value="">Vehicle *</option>
            {vehicles.map((v: any) => <option key={v.id} value={v.id}>{v.registration}</option>)}
          </select>
          <input placeholder="Litres *" type="number" value={form.litres} onChange={e => setForm({ ...form, litres: e.target.value })} style={INP} />
          <input placeholder="Cost (R) *" type="number" value={form.totalCost} onChange={e => setForm({ ...form, totalCost: e.target.value })} style={INP} />
          <input placeholder="Odometer (km)" type="number" value={form.odometer} onChange={e => setForm({ ...form, odometer: e.target.value })} style={INP} />
          <input placeholder="Station" value={form.station} onChange={e => setForm({ ...form, station: e.target.value })} style={INP} />
          <button onClick={add} disabled={loading || !form.vehicleId || !form.litres} style={{ width: "100%", padding: 10, background: "linear-gradient(135deg,#f59e0b,#d97706)", border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>{loading ? "Saving..." : "Log Fuel"}</button>
        </div>
        <div style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(99,102,241,0.1)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", padding: "10px 16px", borderBottom: "1px solid rgba(99,102,241,0.1)", fontSize: 11, fontWeight: 700, color: "#475569" }}><span>VEHICLE</span><span>LITRES</span><span>COST</span><span>STATION</span><span>DATE</span></div>
          {entries.map((e: any) => (
            <div key={e.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", padding: "10px 16px", borderBottom: "1px solid rgba(99,102,241,0.05)", alignItems: "center", fontSize: 12 }}>
              <span style={{ color: "#a5b4fc", fontWeight: 600 }}>{e.vehicle?.registration || "—"}</span>
              <span style={{ color: "#e2e8f0" }}>{e.litres}L</span>
              <span style={{ color: "#10b981", fontWeight: 600 }}>R{e.totalCost}</span>
              <span style={{ color: "#475569" }}>{e.station || "—"}</span>
              <span style={{ color: "#334155" }}>{new Date(e.createdAt).toLocaleDateString("en-ZA")}</span>
            </div>
          ))}
          {entries.length === 0 && <div style={{ padding: 30, textAlign: "center", color: "#334155", fontSize: 13 }}>No fuel entries yet.</div>}
        </div>
      </div>
    </div>
  )
}

// ── MAINTENANCE ───────────────────────────────────────────────
function MaintenancePanel() {
  const [records, setRecords] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState({ vehicleId: "", type: "SERVICE", description: "", cost: "", performedBy: "" })
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    fetch("/api/maintenance").then(r => r.json()).then(d => setRecords(Array.isArray(d) ? d : []))
    fetch("/api/vehicles").then(r => r.json()).then(d => setVehicles(Array.isArray(d) ? d : []))
  }, [])
  const add = async () => {
    setLoading(true)
    const res = await fetch("/api/maintenance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, cost: parseFloat(form.cost) || 0, performedAt: new Date().toISOString() }) })
    if (res.ok) { const r = await res.json(); setRecords([r, ...records]); setForm({ vehicleId: "", type: "SERVICE", description: "", cost: "", performedBy: "" }) }
    setLoading(false)
  }
  const tc = (t: string) => t === "REPAIR" ? "#ef4444" : t === "SERVICE" ? "#10b981" : t === "INSPECTION" ? "#6366f1" : "#f59e0b"
  return (
    <div style={{ padding: 24 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}><Wrench size={20} color="#6366f1" /> Maintenance</div>
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20 }}>
        <div style={FORM_WRAP}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 14 }}>Log Maintenance</div>
          <select value={form.vehicleId} onChange={e => setForm({ ...form, vehicleId: e.target.value })} style={INP}>
            <option value="">Vehicle *</option>
            {vehicles.map((v: any) => <option key={v.id} value={v.id}>{v.registration}</option>)}
          </select>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={INP}>
            <option value="SERVICE">Service</option><option value="REPAIR">Repair</option><option value="INSPECTION">Inspection</option><option value="TYRE">Tyre</option>
          </select>
          <input placeholder="Description *" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={INP} />
          <input placeholder="Cost (R)" type="number" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} style={INP} />
          <input placeholder="Performed by" value={form.performedBy} onChange={e => setForm({ ...form, performedBy: e.target.value })} style={INP} />
          <button onClick={add} disabled={loading || !form.vehicleId || !form.description} style={{ width: "100%", padding: 10, background: "linear-gradient(135deg,#10b981,#059669)", border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>{loading ? "Saving..." : "Log Maintenance"}</button>
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          {records.map((r: any) => (
            <div key={r.id} style={{ ...card(tc(r.type)), padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: tc(r.type) + "20", color: tc(r.type) }}>{r.type}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "white" }}>{r.vehicle?.registration}</span>
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{r.description}</div>
              </div>
              {r.cost > 0 && <div style={{ fontSize: 15, fontWeight: 700, color: "#ef4444" }}>R{r.cost}</div>}
            </div>
          ))}
          {records.length === 0 && <div style={{ color: "#334155", textAlign: "center", padding: 40, fontSize: 13, background: "rgba(255,255,255,0.02)", borderRadius: 12 }}>No records yet.</div>}
        </div>
      </div>
    </div>
  )
}

// ── INVOICES ──────────────────────────────────────────────────
function InvoicesPanel() {
  const [orders, setOrders] = useState([])
  useEffect(() => { fetch("/api/orders").then(r => r.json()).then(d => setOrders(Array.isArray(d) ? d.filter((o: any) => o.status === "COMPLETED") : [])) }, [])
  const total = orders.reduce((s: number, o: any) => s + (o.totalAmount || 1500), 0)
  const print = (o: any) => {
    const w = window.open("", "_blank"); if (!w) return
    w.document.write(`<html><body style="font-family:sans-serif;padding:40px"><h1>FleetMind Invoice</h1><p>Order: ${o.orderNumber}</p><p>Customer: ${o.customerName}</p><p>Address: ${o.deliveryAddress}</p><p>Amount: R${o.totalAmount || 1500}</p><p>Date: ${new Date(o.createdAt).toLocaleDateString("en-ZA")}</p><hr/><p>FleetMind SA</p></body></html>`); w.print()
  }
  return (
    <div style={{ padding: 24 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}><FileText size={20} color="#6366f1" /> Invoices</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        {[{ l: "Invoices", v: orders.length, c: "#6366f1" }, { l: "Revenue", v: `R${total.toLocaleString()}`, c: "#10b981" }, { l: "Avg", v: `R${orders.length > 0 ? (total / orders.length).toFixed(0) : 0}`, c: "#f59e0b" }].map(s => (
          <div key={s.l} style={{ ...card(s.c), textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(99,102,241,0.1)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1.5fr 1fr 1fr", padding: "10px 16px", borderBottom: "1px solid rgba(99,102,241,0.1)", fontSize: 11, fontWeight: 700, color: "#475569" }}><span>INVOICE</span><span>CUSTOMER</span><span>ADDRESS</span><span>AMOUNT</span><span>ACTION</span></div>
        {orders.map((o: any) => (
          <div key={o.id} style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1.5fr 1fr 1fr", padding: "12px 16px", borderBottom: "1px solid rgba(99,102,241,0.05)", alignItems: "center", fontSize: 12 }}>
            <span style={{ color: "#a5b4fc", fontWeight: 600 }}>{o.orderNumber}</span>
            <span style={{ color: "#e2e8f0" }}>{o.customerName}</span>
            <span style={{ color: "#475569" }}>{o.deliveryAddress?.substring(0, 22)}...</span>
            <span style={{ color: "#10b981", fontWeight: 700 }}>R{o.totalAmount || 1500}</span>
            <button onClick={() => print(o)} style={{ padding: "5px 12px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 6, color: "#a5b4fc", cursor: "pointer", fontSize: 11 }}>Print</button>
          </div>
        ))}
        {orders.length === 0 && <div style={{ padding: 30, textAlign: "center", color: "#334155", fontSize: 13 }}>No completed orders.</div>}
      </div>
    </div>
  )
}

// ── COST ANALYSIS ─────────────────────────────────────────────
function CostAnalysisPanel() {
  const [data, setData] = useState(null)
  useEffect(() => {
    Promise.all([fetch("/api/fuel").then(r => r.json()), fetch("/api/maintenance").then(r => r.json()), fetch("/api/orders").then(r => r.json())]).then(([fuel, maint, orders]) => {
      const fuelCost = (Array.isArray(fuel) ? fuel : []).reduce((s: number, f: any) => s + (f.totalCost || 0), 0)
      const maintCost = (Array.isArray(maint) ? maint : []).reduce((s: number, m: any) => s + (m.cost || 0), 0)
      const completed = (Array.isArray(orders) ? orders : []).filter((o: any) => o.status === "COMPLETED").length
      const revenue = completed * 1500
      setData({ fuelCost, maintCost, revenue, profit: revenue - fuelCost - maintCost, completed } as any)
    })
  }, [])
  return (
    <div style={{ padding: 24 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}><DollarSign size={20} color="#6366f1" /> Cost Analysis</div>
      {data && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
            {[{ l: "Revenue", v: `R${(data as any).revenue.toLocaleString()}`, c: "#10b981" }, { l: "Fuel Costs", v: `R${(data as any).fuelCost.toFixed(0)}`, c: "#ef4444" }, { l: "Maintenance", v: `R${(data as any).maintCost.toFixed(0)}`, c: "#f59e0b" }, { l: "Net Profit", v: `R${(data as any).profit.toFixed(0)}`, c: (data as any).profit >= 0 ? "#10b981" : "#ef4444" }].map(s => (
              <div key={s.l} style={{ ...card(s.c), textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.c }}>{s.v}</div>
                <div style={{ fontSize: 12, color: "#475569", marginTop: 6 }}>{s.l}</div>
              </div>
            ))}
          </div>
          <div style={{ ...card(), padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 16 }}>Breakdown</div>
            {[["Fuel", (data as any).fuelCost, "#ef4444"], ["Maintenance", (data as any).maintCost, "#f59e0b"], ["Revenue", (data as any).revenue, "#10b981"]].map(([l, v, c]) => (
              <div key={l as string} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 13, color: "#94a3b8" }}>{l}</span><span style={{ fontSize: 13, fontWeight: 600, color: c as string }}>R{(v as number).toFixed(0)}</span></div>
                <div style={{ height: 8, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: Math.min(100, (data as any).revenue > 0 ? ((v as number) / (data as any).revenue * 100) : 0) + "%", background: `linear-gradient(90deg,${c},${c}aa)`, borderRadius: 4 }}></div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── HUBS ──────────────────────────────────────────────────────
function HubsPanel() {
  const [hubs, setHubs] = useState([])
  const [form, setForm] = useState({ name: "", address: "", city: "", latitude: "-33.9249", longitude: "18.4241", type: "DEPOT" })
  const [loading, setLoading] = useState(false)
  useEffect(() => { fetch("/api/hubs").then(r => r.json()).then(d => setHubs(Array.isArray(d) ? d : [])) }, [])
  const create = async () => {
    setLoading(true)
    const res = await fetch("/api/hubs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, latitude: parseFloat(form.latitude), longitude: parseFloat(form.longitude) }) })
    if (res.ok) { const h = await res.json(); setHubs([h, ...hubs]); setForm({ name: "", address: "", city: "", latitude: "-33.9249", longitude: "18.4241", type: "DEPOT" }) }
    setLoading(false)
  }
  return (
    <div style={{ padding: 24 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}><Warehouse size={20} color="#6366f1" /> Hub Network ({hubs.length})</div>
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20 }}>
        <div style={FORM_WRAP}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 14 }}>Add Hub</div>
          <input placeholder="Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={INP} />
          <input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={INP} />
          <input placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={INP} />
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={INP}><option value="DEPOT">Depot</option><option value="SORTING">Sorting Center</option><option value="PICKUP">Pickup Point</option></select>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <input placeholder="Lat" value={form.latitude} onChange={e => setForm({ ...form, latitude: e.target.value })} style={INP} />
            <input placeholder="Lng" value={form.longitude} onChange={e => setForm({ ...form, longitude: e.target.value })} style={INP} />
          </div>
          <button onClick={create} disabled={loading || !form.name} style={{ width: "100%", padding: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>{loading ? "Adding..." : "Add Hub"}</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {hubs.map((h: any) => (
            <div key={h.id} style={card()}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "white" }}>{h.name}</div>
                <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: "rgba(99,102,241,0.15)", color: "#a5b4fc" }}>{h.type}</span>
              </div>
              <div style={{ fontSize: 12, color: "#475569" }}>{h.address}, {h.city}</div>
            </div>
          ))}
          {hubs.length === 0 && <div style={{ gridColumn: "1/-1", color: "#334155", textAlign: "center", padding: 40, fontSize: 13 }}>No hubs yet.</div>}
        </div>
      </div>
    </div>
  )
}

// ── ROUTE OPTIMIZER ───────────────────────────────────────────
function RouteOptimizerPanel({ optimizeRoutes, optimizing, optimizeResult }: { optimizeRoutes: any, optimizing: boolean, optimizeResult: any }) {
  const [routes, setRoutes] = useState([])
  const [orders, setOrders] = useState([])
  const [vehicles, setVehicles] = useState([])
  useEffect(() => {
    fetch("/api/routes").then(r => r.json()).then(d => setRoutes(Array.isArray(d) ? d : []))
    fetch("/api/orders").then(r => r.json()).then(d => setOrders(Array.isArray(d) ? d : []))
    fetch("/api/vehicles").then(r => r.json()).then(d => setVehicles(Array.isArray(d) ? d : []))
  }, [optimizeResult])
  const pending = orders.filter((o: any) => o.status === "PENDING").length
  const available = vehicles.filter((v: any) => v.status === "AVAILABLE").length
  return (
    <div style={{ padding: 24 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}><Map size={20} color="#6366f1" /> Route Optimizer</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        {[{ l: "Pending", v: pending, c: "#f59e0b" }, { l: "Available Vehicles", v: available, c: "#10b981" }, { l: "Routes", v: routes.length, c: "#6366f1" }].map(s => (
          <div key={s.l} style={{ ...card(s.c), textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ ...FORM_WRAP, marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 8 }}>OR-Tools VRP Optimizer</div>
        <div style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>Assign {pending} pending orders to {available} vehicles. Falls back to greedy if ML service offline.</div>
        <button onClick={optimizeRoutes} disabled={optimizing || pending === 0 || available === 0} style={{ padding: "11px 24px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 10, color: "white", cursor: "pointer", fontWeight: 700, fontSize: 14, opacity: optimizing || pending === 0 || available === 0 ? 0.6 : 1 }}>
          {optimizing ? "Optimizing..." : "Run Optimization"}
        </button>
        {optimizeResult && <div style={{ marginTop: 12, padding: "10px 14px", background: optimizeResult.success ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)", borderRadius: 8, fontSize: 13, color: optimizeResult.success ? "#34d399" : "#f87171" }}>{optimizeResult.message} · {optimizeResult.solver}</div>}
      </div>
      {routes.slice(0, 5).map((r: any) => (
        <div key={r.id} style={{ ...card(), padding: "12px 16px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><div style={{ fontSize: 13, fontWeight: 600, color: "white" }}>Route {r.id?.substring(0, 8)}</div><div style={{ fontSize: 11, color: "#475569" }}>{r.totalDistanceKm || 0}km · {new Date(r.date || r.createdAt).toLocaleDateString("en-ZA")}</div></div>
          <span style={{ padding: "3px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600, background: "rgba(99,102,241,0.15)", color: "#a5b4fc" }}>{r.status}</span>
        </div>
      ))}
    </div>
  )
}

// ── TELEMATICS ────────────────────────────────────────────────
function TelematicsPanel() {
  const [alerts, setAlerts] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [simulating, setSimulating] = useState(false)
  useEffect(() => {
    fetch("/api/telematics/alerts").then(r => r.json()).then(d => setAlerts(Array.isArray(d) ? d : []))
    fetch("/api/vehicles").then(r => r.json()).then(d => setVehicles(Array.isArray(d) ? d : []))
  }, [])
  const simulate = async () => {
    setSimulating(true)
    for (const v of vehicles.slice(0, 3)) {
      await fetch("/api/telematics/ingest", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ vehicleId: v.id, latitude: -33.9249 + (Math.random() - 0.5) * 0.5, longitude: 18.4241 + (Math.random() - 0.5) * 0.5, speedKmh: Math.round(Math.random() * 120), fuelLevel: Math.round(Math.random() * 100), engineTemp: Math.round(70 + Math.random() * 50) }) })
    }
    fetch("/api/telematics/alerts").then(r => r.json()).then(d => setAlerts(Array.isArray(d) ? d : []))
    setSimulating(false)
  }
  const sc = (s: string) => s === "CRITICAL" ? "#ef4444" : s === "HIGH" ? "#f59e0b" : "#6366f1"
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "white", display: "flex", alignItems: "center", gap: 8 }}><Wifi size={20} color="#6366f1" /> Telematics & IoT</div>
        <button onClick={simulate} disabled={simulating || vehicles.length === 0} style={{ padding: "8px 16px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>{simulating ? "Simulating..." : "Simulate GPS Ping"}</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        {[{ l: "Vehicles", v: vehicles.length, c: "#6366f1" }, { l: "Active Alerts", v: alerts.filter((a: any) => !a.resolved).length, c: "#ef4444" }, { l: "Total Alerts", v: alerts.length, c: "#10b981" }].map(s => (
          <div key={s.l} style={{ ...card(s.c), textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>{s.l}</div>
          </div>
        ))}
      </div>
      {alerts.slice(0, 8).map((a: any) => (
        <div key={a.id} style={{ ...card(sc(a.severity)), padding: "12px 16px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><div style={{ fontSize: 13, fontWeight: 600, color: "white" }}>{a.type?.replace(/_/g, " ")}</div><div style={{ fontSize: 11, color: "#475569" }}>{a.message}</div></div>
          <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: sc(a.severity) + "20", color: sc(a.severity) }}>{a.severity}</span>
        </div>
      ))}
      {alerts.length === 0 && <div style={{ color: "#334155", textAlign: "center", padding: 20, fontSize: 13, background: "rgba(255,255,255,0.02)", borderRadius: 10 }}>No alerts. Click Simulate to generate data.</div>}
    </div>
  )
}

// ── COURIER ───────────────────────────────────────────────────
function CourierPanel() {
  const [rates, setRates] = useState([])
  const [bookings, setBookings] = useState([])
  const [form, setForm] = useState({ fromCity: "Cape Town", toCity: "Johannesburg", weightKg: "5" })
  const [loading, setLoading] = useState(false)
  useEffect(() => { fetch("/api/couriers/bookings").then(r => r.json()).then(d => setBookings(Array.isArray(d) ? d : [])) }, [])
  const getRates = async () => {
    setLoading(true)
    const res = await fetch("/api/couriers/rates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    if (res.ok) setRates(await res.json())
    setLoading(false)
  }
  const book = async (r: any) => {
    await fetch("/api/couriers/book", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, ...r }) })
    fetch("/api/couriers/bookings").then(r => r.json()).then(d => setBookings(Array.isArray(d) ? d : []))
  }
  return (
    <div style={{ padding: 24 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}><Globe size={20} color="#6366f1" /> Courier Federation</div>
      <div style={{ ...FORM_WRAP, marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 14 }}>Rate Shopping — 6 Couriers</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 120px", gap: 10 }}>
          <input placeholder="From City" value={form.fromCity} onChange={e => setForm({ ...form, fromCity: e.target.value })} style={{ ...INP, marginBottom: 0 }} />
          <input placeholder="To City" value={form.toCity} onChange={e => setForm({ ...form, toCity: e.target.value })} style={{ ...INP, marginBottom: 0 }} />
          <input placeholder="Weight (kg)" type="number" value={form.weightKg} onChange={e => setForm({ ...form, weightKg: e.target.value })} style={{ ...INP, marginBottom: 0 }} />
          <button onClick={getRates} disabled={loading} style={{ padding: "9px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontWeight: 600, fontSize: 13, height: "fit-content" }}>{loading ? "..." : "Get Rates"}</button>
        </div>
      </div>
      {rates.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
          {rates.map((r: any, i: number) => (
            <div key={i} style={card()}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 4 }}>{r.courier}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#10b981" }}>R{r.price}</div>
              <div style={{ fontSize: 11, color: "#475569", marginBottom: 10 }}>{r.estimatedDays} days · {r.service}</div>
              <button onClick={() => book(r)} style={{ width: "100%", padding: "6px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 6, color: "#34d399", cursor: "pointer", fontSize: 12 }}>Book</button>
            </div>
          ))}
        </div>
      )}
      <div style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 12 }}>Bookings ({bookings.length})</div>
      {bookings.slice(0, 5).map((b: any) => (
        <div key={b.id} style={{ ...card(), padding: "12px 16px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
          <div><div style={{ color: "white", fontWeight: 600 }}>{b.courier} — {b.trackingNumber}</div><div style={{ color: "#475569" }}>{b.fromCity} → {b.toCity}</div></div>
          <span style={{ color: "#10b981", fontWeight: 700 }}>R{b.price}</span>
        </div>
      ))}
      {bookings.length === 0 && <div style={{ color: "#334155", textAlign: "center", padding: 20, fontSize: 13 }}>No bookings yet.</div>}
    </div>
  )
}

// ── AI AGENTS ─────────────────────────────────────────────────
function AIAgentsPanel() {
  const [runs, setRuns] = useState([])
  const [running, setRunning] = useState(null)
  const [result, setResult] = useState(null)
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState("")
  const [issue, setIssue] = useState("")
  useEffect(() => {
    fetch("/api/agents").then(r => r.json()).then(d => setRuns(Array.isArray(d) ? d : []))
    fetch("/api/orders").then(r => r.json()).then(d => setOrders(Array.isArray(d) ? d : []))
  }, [])
  const run = async (agent: string, payload: any = {}) => {
    setRunning(agent as any); setResult(null)
    const res = await fetch("/api/agents", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ agent, payload }) })
    const data = await res.json()
    setResult({ agent, ...data } as any)
    fetch("/api/agents").then(r => r.json()).then(d => setRuns(Array.isArray(d) ? d : []))
    setRunning(null)
  }
  const agents = [
    { id: "dispatcher", label: "Dispatcher", desc: "Handle delivery exceptions", color: "#6366f1", icon: "🚛" },
    { id: "demand", label: "Demand Forecaster", desc: "Predict order volumes", color: "#10b981", icon: "📈" },
    { id: "maintenance", label: "Maintenance AI", desc: "Predict vehicle failures", color: "#f59e0b", icon: "🔧" },
    { id: "support", label: "Customer Support", desc: "AI query resolution", color: "#ec4899", icon: "💬" },
    { id: "route", label: "Route Optimizer", desc: "Auto-assign orders", color: "#8b5cf6", icon: "🗺️" },
  ]
  return (
    <div style={{ padding: 24 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}><Zap size={20} color="#6366f1" /> AI Agents</div>
      <div style={{ fontSize: 13, color: "#475569", marginBottom: 20 }}>Powered by Cloudflare AI — autonomous logistics intelligence</div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" as const }}>
        <select value={selectedOrder} onChange={e => setSelectedOrder(e.target.value)} style={{ ...INP, marginBottom: 0, width: "auto", flex: 1 }}>
          <option value="">Select Order for Dispatcher</option>
          {orders.map((o: any) => <option key={o.id} value={o.id}>{o.orderNumber} — {o.customerName}</option>)}
        </select>
        <input placeholder="Issue description..." value={issue} onChange={e => setIssue(e.target.value)} style={{ ...INP, marginBottom: 0, flex: 2 }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 24 }}>
        {agents.map(a => (
          <div key={a.id} style={{ ...card(a.color), textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>{a.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "white", marginBottom: 4 }}>{a.label}</div>
            <div style={{ fontSize: 10, color: "#475569", marginBottom: 12, lineHeight: 1.5 }}>{a.desc}</div>
            <button onClick={() => run(a.id, a.id === "dispatcher" ? { orderId: selectedOrder, issue } : { trigger: "manual" })} disabled={running === a.id as any}
              style={{ width: "100%", padding: "7px", background: `linear-gradient(135deg,${a.color},${a.color}cc)`, border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontSize: 11, fontWeight: 700, opacity: running === a.id as any ? 0.7 : 1 }}>
              {running === a.id as any ? "Running..." : "Run Agent"}
            </button>
          </div>
        ))}
      </div>
      {result && (
        <div style={{ ...FORM_WRAP, marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "white", marginBottom: 8 }}>Result: {(result as any).agent}</div>
          <pre style={{ fontSize: 11, color: "#94a3b8", overflow: "auto", maxHeight: 180, margin: 0, whiteSpace: "pre-wrap" as const }}>{JSON.stringify((result as any).result, null, 2)}</pre>
          {(result as any).durationMs && <div style={{ fontSize: 11, color: "#334155", marginTop: 6 }}>{(result as any).durationMs}ms · {(result as any).provider}</div>}
        </div>
      )}
      <div style={{ fontSize: 13, fontWeight: 600, color: "white", marginBottom: 10 }}>Run History ({runs.length})</div>
      {runs.slice(0, 5).map((r: any) => (
        <div key={r.id} style={{ ...card(), padding: "10px 14px", marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
          <div><div style={{ color: "white", fontWeight: 600 }}>{r.agentName}</div><div style={{ color: "#475569" }}>{new Date(r.startedAt).toLocaleString("en-ZA")}</div></div>
          <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: r.status === "COMPLETED" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: r.status === "COMPLETED" ? "#34d399" : "#f87171" }}>{r.status}</span>
        </div>
      ))}
    </div>
  )
}

// ── NOTIFICATIONS ─────────────────────────────────────────────
function NotificationsPanel() {
  const [notifications, setNotifications] = useState([])
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState({ orderId: "", type: "ORDER_DISPATCHED", recipient: "" })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  useEffect(() => {
    fetch("/api/notifications").then(r => r.json()).then(d => setNotifications(Array.isArray(d) ? d : []))
    fetch("/api/orders").then(r => r.json()).then(d => setOrders(Array.isArray(d) ? d : []))
  }, [])
  const send = async () => {
    setLoading(true); setResult(null)
    const res = await fetch("/api/notifications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    const data = await res.json(); setResult(data as any)
    if (data.success) fetch("/api/notifications").then(r => r.json()).then(d => setNotifications(Array.isArray(d) ? d : []))
    setLoading(false)
  }
  return (
    <div style={{ padding: 24 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}><Bell size={20} color="#6366f1" /> Email Notifications — Powered by Resend</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={FORM_WRAP}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 14 }}>Send Email</div>
          <select value={form.orderId} onChange={e => setForm({ ...form, orderId: e.target.value })} style={INP}>
            <option value="">Select Order (Optional)</option>
            {orders.map((o: any) => <option key={o.id} value={o.id}>{o.orderNumber} — {o.customerName}</option>)}
          </select>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={INP}>
            <option value="ORDER_CREATED">Order Confirmed</option>
            <option value="ORDER_DISPATCHED">Out for Delivery</option>
            <option value="ORDER_ARRIVING">Arriving Soon</option>
            <option value="ORDER_COMPLETED">Delivered</option>
            <option value="ORDER_FAILED">Delivery Failed</option>
          </select>
          <input placeholder="Recipient email" type="email" value={form.recipient} onChange={e => setForm({ ...form, recipient: e.target.value })} style={INP} />
          <button onClick={send} disabled={loading || (!form.orderId && !form.recipient)} style={{ width: "100%", padding: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>{loading ? "Sending..." : "Send Email"}</button>
          {result && <div style={{ marginTop: 10, padding: "8px 12px", background: (result as any).success ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", borderRadius: 8, fontSize: 12, color: (result as any).success ? "#34d399" : "#f87171" }}>{(result as any).message || (result as any).error}</div>}
        </div>
        <div>
          {notifications.slice(0, 8).map((n: any) => (
            <div key={n.id} style={{ ...card(), padding: "10px 12px", marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontSize: 12, color: "white" }}>{n.type?.replace("ORDER_", "")}</div><div style={{ fontSize: 11, color: "#475569" }}>{n.recipient}</div></div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: n.status === "SENT" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: n.status === "SENT" ? "#34d399" : "#f87171" }}>{n.status}</span>
            </div>
          ))}
          {notifications.length === 0 && <div style={{ color: "#334155", textAlign: "center", padding: 40, fontSize: 13 }}>No emails sent yet.</div>}
        </div>
      </div>
    </div>
  )
}

// ── API DOCS ──────────────────────────────────────────────────
function APIDocsPanel() {
  const endpoints = [
    { m: "GET", p: "/api/vehicles", d: "List all vehicles" }, { m: "POST", p: "/api/vehicles", d: "Create vehicle" },
    { m: "GET", p: "/api/drivers", d: "List all drivers" }, { m: "POST", p: "/api/orders", d: "Create order" },
    { m: "GET", p: "/api/orders", d: "List all orders" }, { m: "PATCH", p: "/api/orders/[id]", d: "Update order status" },
    { m: "GET", p: "/api/warehouses", d: "List warehouses" }, { m: "GET", p: "/api/inventory", d: "List inventory" },
    { m: "GET", p: "/api/fuel", d: "Fuel entries" }, { m: "GET", p: "/api/maintenance", d: "Maintenance records" },
    { m: "GET", p: "/api/analytics", d: "Analytics summary" }, { m: "GET", p: "/api/forecast", d: "Prophet ML forecast" },
    { m: "GET", p: "/api/maintenance/predict", d: "ML maintenance prediction" }, { m: "POST", p: "/api/routes/optimize", d: "OR-Tools VRP" },
    { m: "POST", p: "/api/couriers/rates", d: "Get courier rates" }, { m: "POST", p: "/api/agents", d: "Run AI agent" },
    { m: "POST", p: "/api/chat", d: "AI chat (Cloudflare)" }, { m: "POST", p: "/api/notifications", d: "Send email (Resend)" },
    { m: "POST", p: "/api/telematics/ingest", d: "Ingest GPS event" }, { m: "GET", p: "/api/geofences", d: "List geofences" },
    { m: "GET", p: "/api/returns", d: "List returns" }, { m: "GET", p: "/api/hubs", d: "List hubs" },
    { m: "GET", p: "/api/track/[orderNumber]", d: "Customer tracking" }, { m: "POST", p: "/api/payfast/checkout", d: "PayFast billing" },
  ]
  const mc = (m: string) => m === "GET" ? "#10b981" : m === "POST" ? "#6366f1" : "#f59e0b"
  return (
    <div style={{ padding: 24 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}><FileText size={20} color="#6366f1" /> API Documentation</div>
      <div style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(99,102,241,0.1)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "80px 1.5fr 2fr", padding: "10px 16px", borderBottom: "1px solid rgba(99,102,241,0.1)", fontSize: 11, fontWeight: 700, color: "#475569" }}><span>METHOD</span><span>PATH</span><span>DESCRIPTION</span></div>
        {endpoints.map((e, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "80px 1.5fr 2fr", padding: "10px 16px", borderBottom: "1px solid rgba(99,102,241,0.04)", alignItems: "center", fontSize: 12 }}>
            <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: mc(e.m) + "20", color: mc(e.m), display: "inline-block" }}>{e.m}</span>
            <span style={{ color: "#a5b4fc", fontFamily: "monospace" }}>{e.p}</span>
            <span style={{ color: "#475569" }}>{e.d}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── TESTING ───────────────────────────────────────────────────
function TestingPanel() {
  const tests = [
    { id: "vehicles", name: "GET /api/vehicles", url: "/api/vehicles" }, { id: "drivers", name: "GET /api/drivers", url: "/api/drivers" },
    { id: "orders", name: "GET /api/orders", url: "/api/orders" }, { id: "warehouses", name: "GET /api/warehouses", url: "/api/warehouses" },
    { id: "inventory", name: "GET /api/inventory", url: "/api/inventory" }, { id: "analytics", name: "GET /api/analytics", url: "/api/analytics" },
    { id: "forecast", name: "GET /api/forecast", url: "/api/forecast" }, { id: "predict", name: "GET /api/maintenance/predict", url: "/api/maintenance/predict" },
    { id: "me", name: "GET /api/me", url: "/api/me" }, { id: "chat", name: "GET /api/chat", url: "/api/chat" },
  ]
  const [results, setResults] = useState({})
  const [running, setRunning] = useState(false)
  const runTest = async (t: any) => {
    setResults(p => ({ ...p, [t.id]: { status: "running" } }))
    const start = Date.now()
    try {
      const res = await fetch(t.url); const time = Date.now() - start; const data = await res.json()
      setResults(p => ({ ...p, [t.id]: { status: res.ok ? "pass" : "fail", time, data: Array.isArray(data) ? data.length + " items" : "OK" } }))
    } catch (e: any) { setResults(p => ({ ...p, [t.id]: { status: "fail", error: e.message } })) }
  }
  const runAll = async () => { setRunning(true); for (const t of tests) await runTest(t); setRunning(false) }
  const passed = Object.values(results).filter((r: any) => r.status === "pass").length
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "white", display: "flex", alignItems: "center", gap: 8 }}><FlaskConical size={20} color="#6366f1" /> API Testing</div>
        <button onClick={runAll} disabled={running} style={{ padding: "10px 20px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 10, color: "white", cursor: "pointer", fontSize: 13, fontWeight: 600, opacity: running ? 0.7 : 1 }}>
          <Play size={13} style={{ display: "inline", marginRight: 6 }} />{running ? "Running..." : "Run All Tests"}
        </button>
      </div>
      {Object.keys(results).length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
          {[{ l: "Passed", v: passed, c: "#10b981" }, { l: "Failed", v: Object.values(results).filter((r: any) => r.status === "fail").length, c: "#ef4444" }, { l: "Total", v: tests.length, c: "#6366f1" }].map(s => (
            <div key={s.l} style={{ ...card(s.c), textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.c }}>{s.v}</div>
              <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      )}
      {tests.map(t => {
        const r = (results as any)[t.id]
        return (
          <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", ...card(), marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", background: "rgba(16,185,129,0.15)", color: "#34d399", borderRadius: 4 }}>GET</span>
              <span style={{ fontSize: 13, color: "#a5b4fc" }}>{t.name}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {r?.time && <span style={{ fontSize: 11, color: "#334155" }}>{r.time}ms</span>}
              {!r && <span style={{ fontSize: 11, color: "#334155", padding: "3px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 6 }}>PENDING</span>}
              {r?.status === "running" && <span style={{ fontSize: 11, color: "#f59e0b" }}>Running...</span>}
              {r?.status === "pass" && <span style={{ fontSize: 11, color: "#10b981", fontWeight: 700 }}>✓ PASS {r.data && `(${r.data})`}</span>}
              {r?.status === "fail" && <span style={{ fontSize: 11, color: "#ef4444", fontWeight: 700 }}>✗ FAIL</span>}
              <button onClick={() => runTest(t)} style={{ padding: "4px 12px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 6, color: "#6366f1", cursor: "pointer", fontSize: 11 }}>Run</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── MONITORING ────────────────────────────────────────────────
function MonitoringPanel() {
  const [history, setHistory] = useState([])
  const [avg, setAvg] = useState(0)
  const [loading, setLoading] = useState(false)
  const check = async () => {
    setLoading(true); const start = Date.now()
    try { await fetch("/api/analytics"); const t = Date.now() - start; setHistory(p => [{ time: new Date().toLocaleTimeString(), ms: t, status: t < 500 ? "Good" : t < 1000 ? "Slow" : "Critical" }, ...p].slice(0, 10) as any); setAvg(p => Math.round(p === 0 ? t : (p + t) / 2)) } catch {}
    setLoading(false)
  }
  useEffect(() => { check(); const t = setInterval(check, 30000); return () => clearInterval(t) }, [])
  const sc = (ms: number) => ms < 500 ? "#10b981" : ms < 1000 ? "#f59e0b" : "#ef4444"
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "white", display: "flex", alignItems: "center", gap: 8 }}><Activity size={20} color="#6366f1" /> Performance Monitoring</div>
        <button onClick={check} disabled={loading} style={{ padding: "8px 16px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, color: "#6366f1", cursor: "pointer", fontSize: 13 }}>Refresh</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {[{ l: "Avg Response", v: avg + "ms", c: "#f59e0b" }, { l: "Uptime", v: "99.9%", c: "#10b981" }, { l: "Checks", v: history.length, c: "#6366f1" }, { l: "Critical", v: history.filter((h: any) => h.status === "Critical").length, c: "#ef4444" }].map(s => (
          <div key={s.l} style={{ ...card(s.c), textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ ...card(), padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 14 }}>Response Time History</div>
        {history.map((h: any, i: number) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <span style={{ fontSize: 11, color: "#475569", minWidth: 80 }}>{h.time}</span>
            <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: Math.min(100, (h.ms / 2000) * 100) + "%", background: `linear-gradient(90deg,${sc(h.ms)},${sc(h.ms)}aa)`, borderRadius: 4 }}></div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: sc(h.ms), minWidth: 50 }}>{h.ms}ms</span>
            <span style={{ fontSize: 11, color: sc(h.ms) }}>{h.status}</span>
          </div>
        ))}
        {history.length === 0 && <div style={{ color: "#334155", textAlign: "center", padding: 20, fontSize: 13 }}>Checking APIs...</div>}
      </div>
    </div>
  )
}

// ── POD ───────────────────────────────────────────────────────
function PODPanel() {
  const [orders, setOrders] = useState([])
  const [selected, setSelected] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(0)
  useEffect(() => { fetch("/api/orders").then(r => r.json()).then(d => setOrders(Array.isArray(d) ? d.filter((o: any) => o.status === "IN_PROGRESS") : [])) }, [])
  const submit = async () => {
    if (!selected) return; setLoading(true)
    await fetch(`/api/orders/${selected}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "COMPLETED" }) })
    setDone(p => p + 1); setSelected(""); setNotes(""); setLoading(false)
    fetch("/api/orders").then(r => r.json()).then(d => setOrders(Array.isArray(d) ? d.filter((o: any) => o.status === "IN_PROGRESS") : []))
  }
  return (
    <div style={{ padding: 24 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}><CheckCircle size={20} color="#6366f1" /> Proof of Delivery</div>
      {done > 0 && <div style={{ padding: "10px 16px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 10, marginBottom: 16, fontSize: 13, color: "#34d399" }}>✅ {done} deliveries confirmed</div>}
      <div style={{ maxWidth: 500 }}>
        <div style={FORM_WRAP}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 14 }}>Confirm Delivery</div>
          <select value={selected} onChange={e => setSelected(e.target.value)} style={INP}>
            <option value="">Select In-Progress Order *</option>
            {orders.map((o: any) => <option key={o.id} value={o.id}>{o.orderNumber} — {o.customerName}</option>)}
          </select>
          <textarea placeholder="Delivery notes..." value={notes} onChange={e => setNotes(e.target.value)} style={{ ...INP, minHeight: 80, resize: "vertical" as const }} />
          <button onClick={submit} disabled={loading || !selected} style={{ width: "100%", padding: 12, background: "linear-gradient(135deg,#10b981,#059669)", border: "none", borderRadius: 10, color: "white", cursor: "pointer", fontWeight: 700, fontSize: 14, opacity: loading || !selected ? 0.6 : 1 }}>{loading ? "Confirming..." : "✅ Confirm Delivery"}</button>
        </div>
        {orders.length === 0 && <div style={{ marginTop: 14, color: "#334155", textAlign: "center", fontSize: 13 }}>No in-progress orders.</div>}
      </div>
    </div>
  )
}

// ── MAIN DASHBOARD ────────────────────────────────────────────

function LiveMapPanel({ vehicles, drivers }: { vehicles: any[], drivers: any[] }) {
  const [selected, setSelected] = useState<any>(null)
  const [simLat, setSimLat] = useState(-33.9249)
  const [simLng, setSimLng] = useState(18.4241)
  const [pinging, setPinging] = useState(false)

  const ping = async (vehicleId: string) => {
    setPinging(true)
    const lat = -33.9249 + (Math.random() - 0.5) * 0.8
    const lng = 18.4241 + (Math.random() - 0.5) * 0.8
    await fetch(`/api/vehicles/${vehicleId}/location`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ latitude: lat, longitude: lng, speedKmh: Math.round(Math.random() * 120), status: "ON_ROUTE" })
    }).catch(() => {})
    await fetch("/api/telematics/ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vehicleId, latitude: lat, longitude: lng, speedKmh: Math.round(Math.random() * 120), fuelLevel: Math.round(20 + Math.random() * 80) })
    }).catch(() => {})
    setPinging(false)
  }

  const statusColor = (s: string) => s === "ON_ROUTE" ? "#6366f1" : s === "AVAILABLE" ? "#10b981" : "#f59e0b"

  return (
    <div style={{ padding: 24 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
        <MapPin size={20} color="#6366f1" /> Live Fleet Map
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
        {/* Map placeholder - install Leaflet for real map */}
        <div style={{ background: "linear-gradient(135deg,#0d1526,#0a0f1e)", borderRadius: 14, border: "1px solid rgba(99,102,241,0.15)", overflow: "hidden", minHeight: 400, position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
            {/* Simulated map with vehicle dots */}
            <svg width="100%" height="100%" viewBox="0 0 600 400" style={{ position: "absolute", inset: 0 }}>
              {/* Grid lines */}
              {[0,1,2,3,4,5].map(i => <line key={"h"+i} x1="0" y1={i*80} x2="600" y2={i*80} stroke="rgba(99,102,241,0.06)" strokeWidth="1"/>)}
              {[0,1,2,3,4,5,6,7].map(i => <line key={"v"+i} x1={i*100} y1="0" x2={i*100} y2="400" stroke="rgba(99,102,241,0.06)" strokeWidth="1"/>)}
              {/* Vehicle dots */}
              {vehicles.map((v, i) => {
                const x = 80 + (i * 120) % 440
                const y = 80 + (i * 90) % 240
                return (
                  <g key={v.id} onClick={() => setSelected(v)} style={{ cursor: "pointer" }}>
                    <circle cx={x} cy={y} r="14" fill={statusColor(v.status) + "30"} stroke={statusColor(v.status)} strokeWidth="2"/>
                    <circle cx={x} cy={y} r="5" fill={statusColor(v.status)}/>
                    <text x={x} y={y + 26} textAnchor="middle" fill="#94a3b8" fontSize="10">{v.registration}</text>
                  </g>
                )
              })}
              {/* SA cities labels */}
              {[["Cape Town",-33.9249,18.4241,300,200],["Johannesburg",-26.2041,28.0473,400,80],["Durban",-29.8587,31.0218,480,150]].map(([city,,,cx,cy])=>(
                <text key={city as string} x={cx as number} y={cy as number} fill="rgba(99,102,241,0.3)" fontSize="11" fontWeight="500">{city as string}</text>
              ))}
            </svg>
            {vehicles.length === 0 && (
              <div style={{ position: "relative", zIndex: 1, textAlign: "center", color: "#334155" }}>
                <MapPin size={32} color="#334155" style={{ margin: "0 auto 8px" }}/>
                <div style={{ fontSize: 13 }}>Add vehicles to see them on the map</div>
              </div>
            )}
          </div>
          <div style={{ position: "absolute", top: 12, left: 12, fontSize: 11, color: "#6366f1", background: "rgba(99,102,241,0.1)", padding: "4px 10px", borderRadius: 6, fontWeight: 600 }}>
            LIVE · {vehicles.filter(v => v.status === "ON_ROUTE").length} active
          </div>
        </div>

        {/* Vehicle list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "white", marginBottom: 4 }}>Vehicles ({vehicles.length})</div>
          <div style={{ overflowY: "auto", maxHeight: 380, display: "flex", flexDirection: "column", gap: 8 }}>
            {vehicles.map(v => (
              <div key={v.id} onClick={() => setSelected(selected?.id === v.id ? null : v)}
                style={{ padding: "12px 14px", background: selected?.id === v.id ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.02)", borderRadius: 10, border: "1px solid " + (selected?.id === v.id ? "rgba(99,102,241,0.3)" : "rgba(99,102,241,0.08)"), cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{v.registration}</div>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor(v.status), boxShadow: `0 0 6px ${statusColor(v.status)}` }}></div>
                </div>
                <div style={{ fontSize: 11, color: "#475569" }}>{v.make} {v.model}</div>
                {v.driver && <div style={{ fontSize: 11, color: "#10b981", marginTop: 2 }}>{v.driver.name}</div>}
                <div style={{ fontSize: 10, color: "#334155", marginTop: 2 }}>{v.latitude?.toFixed(4)}, {v.longitude?.toFixed(4)}</div>
                <button onClick={e => { e.stopPropagation(); ping(v.id) }} disabled={pinging}
                  style={{ marginTop: 8, width: "100%", padding: "4px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 6, color: "#a5b4fc", cursor: "pointer", fontSize: 10 }}>
                  {pinging ? "Pinging..." : "Simulate GPS Ping"}
                </button>
              </div>
            ))}
          </div>
          {selected && (
            <div style={{ padding: "12px 14px", background: "rgba(99,102,241,0.08)", borderRadius: 10, border: "1px solid rgba(99,102,241,0.2)", fontSize: 12 }}>
              <div style={{ fontWeight: 700, color: "white", marginBottom: 6 }}>{selected.registration}</div>
              <div style={{ color: "#94a3b8" }}>Status: {selected.status}</div>
              <div style={{ color: "#94a3b8" }}>Type: {selected.type}</div>
              {selected.odometerKm && <div style={{ color: "#94a3b8" }}>Odometer: {selected.odometerKm.toLocaleString()}km</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DriverAppPanel() {
  const [drivers, setDrivers] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [selectedDriver, setSelectedDriver] = useState<any>(null)
  const [form, setForm] = useState({ name: "", phone: "", licenseNumber: "", licenseType: "C1", vehicleId: "" })
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("/api/drivers").then(r => r.json()).then(d => setDrivers(Array.isArray(d) ? d : []))
    fetch("/api/vehicles").then(r => r.json()).then(d => setVehicles(Array.isArray(d) ? d : []))
    fetch("/api/orders").then(r => r.json()).then(d => setOrders(Array.isArray(d) ? d : []))
  }, [])

  const addDriver = async () => {
    setLoading(true)
    const res = await fetch("/api/drivers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    if (res.ok) {
      const d = await res.json()
      setDrivers([d, ...drivers])
      setForm({ name: "", phone: "", licenseNumber: "", licenseType: "C1", vehicleId: "" })
    }
    setLoading(false)
  }

  const inp: any = { width: "100%", padding: "9px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, fontSize: 13, color: "#e2e8f0", outline: "none", boxSizing: "border-box" as const, marginBottom: 10, fontFamily: "system-ui" }

  const driverOrders = selectedDriver ? orders.filter((o: any) => o.driverId === selectedDriver.id) : []

  return (
    <div style={{ padding: 24 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
        <Users size={20} color="#6366f1" /> Driver Management & Mobile App
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20 }}>
        <div>
          <div style={{ background: "rgba(99,102,241,0.05)", borderRadius: 14, padding: 20, border: "1px solid rgba(99,102,241,0.15)", marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 14 }}>Add Driver</div>
            <input placeholder="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inp} />
            <input placeholder="Phone *" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inp} />
            <input placeholder="License Number" value={form.licenseNumber} onChange={e => setForm({ ...form, licenseNumber: e.target.value })} style={inp} />
            <select value={form.licenseType} onChange={e => setForm({ ...form, licenseType: e.target.value })} style={inp}>
              <option value="B">B — Light Motor</option>
              <option value="C1">C1 — Medium Truck</option>
              <option value="C">C — Heavy Truck</option>
              <option value="EC">EC — Extra Heavy</option>
            </select>
            <select value={form.vehicleId} onChange={e => setForm({ ...form, vehicleId: e.target.value })} style={inp}>
              <option value="">Assign Vehicle (optional)</option>
              {vehicles.map((v: any) => <option key={v.id} value={v.id}>{v.registration}</option>)}
            </select>
            <button onClick={addDriver} disabled={loading || !form.name || !form.phone}
              style={{ width: "100%", padding: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
              {loading ? "Adding..." : "Add Driver"}
            </button>
          </div>

          {/* PWA Info */}
          <div style={{ background: "rgba(16,185,129,0.05)", borderRadius: 12, padding: 16, border: "1px solid rgba(16,185,129,0.15)" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#10b981", marginBottom: 8 }}>📱 Driver PWA App</div>
            <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.7 }}>
              Drivers can install FleetMind as a PWA on their phones:<br />
              1. Open <span style={{ color: "#6366f1" }}>fleetmind.co.za/login</span> on phone<br />
              2. Tap "Add to Home Screen"<br />
              3. Works offline with GPS sync<br />
              4. Features: Orders, POD camera, GPS, signatures
            </div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "white", marginBottom: 12 }}>All Drivers ({drivers.length})</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {drivers.map(d => (
              <div key={d.id} onClick={() => setSelectedDriver(selectedDriver?.id === d.id ? null : d)}
                style={{ padding: "14px 16px", background: selectedDriver?.id === d.id ? "rgba(99,102,241,0.1)" : "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 12, border: "1px solid " + (selectedDriver?.id === d.id ? "rgba(99,102,241,0.3)" : "rgba(99,102,241,0.1)"), cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "white", flexShrink: 0 }}>
                    {d.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{d.name}</div>
                    <div style={{ fontSize: 11, color: "#475569" }}>{d.phone}</div>
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "#475569" }}>License: {d.licenseType} · {d.licenseNumber}</div>
                {d.vehicle && <div style={{ fontSize: 11, color: "#6366f1", marginTop: 4 }}>{d.vehicle.registration}</div>}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                  <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700, background: d.status === "ACTIVE" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)", color: d.status === "ACTIVE" ? "#34d399" : "#fbbf24" }}>{d.status}</span>
                  {d.rating && <span style={{ fontSize: 11, color: "#f59e0b" }}>★ {d.rating}</span>}
                </div>
              </div>
            ))}
          </div>
          {selectedDriver && (
            <div style={{ marginTop: 14, background: "rgba(99,102,241,0.05)", borderRadius: 12, padding: 16, border: "1px solid rgba(99,102,241,0.15)" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "white", marginBottom: 8 }}>{selectedDriver.name}'s Orders ({driverOrders.length})</div>
              {driverOrders.slice(0, 5).map((o: any) => (
                <div key={o.id} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(99,102,241,0.06)", fontSize: 12 }}>
                  <span style={{ color: "#a5b4fc" }}>{o.orderNumber}</span>
                  <span style={{ color: "#475569" }}>{o.deliveryAddress?.substring(0, 25)}</span>
                  <span style={{ color: o.status === "COMPLETED" ? "#34d399" : "#fbbf24", fontWeight: 600 }}>{o.status}</span>
                </div>
              ))}
              {driverOrders.length === 0 && <div style={{ color: "#334155", fontSize: 12 }}>No orders assigned to this driver.</div>}
            </div>
          )}
          {drivers.length === 0 && <div style={{ color: "#334155", textAlign: "center", padding: 40, fontSize: 13 }}>No drivers yet.</div>}
        </div>
      </div>
    </div>
  )
}
export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [stats, setStats] = useState({ vehicles: 0, drivers: 0, orders: 0, completed: 0, revenue: 0, rate: 0 })
  const [vehicles, setVehicles] = useState([])
  const [orders, setOrders] = useState([])
  const [drivers, setDrivers] = useState([])
  const [time, setTime] = useState(new Date())
  const [lang, setLang] = useState<Lang>("en")
  const [loading, setLoading] = useState(true)
  const [showNewOrder, setShowNewOrder] = useState(false)
  const [orderForm, setOrderForm] = useState({ customerName: "", customerEmail: "", customerPhone: "", deliveryAddress: "", pickupAddress: "", priority: "NORMAL" })
  const [optimizing, setOptimizing] = useState(false)
  const [showAddDriver, setShowAddDriver] = useState(false)
  const [driverForm, setDriverForm] = useState({ name: "", email: "", phone: "", licenseNumber: "", licenseType: "CODE10" })
  const [optimizeResult, setOptimizeResult] = useState(null)
  const user = session?.user as any
  const inp: any = { width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 10, fontSize: 14, color: "#e2e8f0", outline: "none", boxSizing: "border-box" as const, marginBottom: 12, fontFamily: "system-ui" }

  useEffect(() => { if (status === "unauthenticated") router.push("/login") }, [status])
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t) }, [])
  useEffect(() => { if (status === "authenticated") loadData() }, [status])

  const loadData = async () => {
    setLoading(true)
    try {
      const [v, d, o] = await Promise.all([fetch("/api/vehicles").then(r => r.json()), fetch("/api/drivers").then(r => r.json()), fetch("/api/orders").then(r => r.json())])
      const vA = Array.isArray(v) ? v : [], dA = Array.isArray(d) ? d : [], oA = Array.isArray(o) ? o : []
      setVehicles(vA); setDrivers(dA); setOrders(oA)
      const comp = oA.filter((x: any) => x.status === "COMPLETED").length
      setStats({ vehicles: vA.length, drivers: dA.length, orders: oA.length, completed: comp, revenue: comp * 1500, rate: oA.length > 0 ? Math.round((comp / oA.length) * 100) : 0 })
    } catch {}
    setLoading(false)
  }

  const createDriver = async (e: any) => {
    e.preventDefault()
    const res = await fetch("/api/drivers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(driverForm) })
    if (res.ok) { loadData(); setShowAddDriver(false); setDriverForm({ name: "", email: "", phone: "", licenseNumber: "", licenseType: "CODE10" }) }
  }

  const createOrder = async (e: any) => {
    e.preventDefault()
    const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(orderForm) })
    if (res.ok) { loadData(); setShowNewOrder(false); setOrderForm({ customerName: "", customerEmail: "", customerPhone: "", deliveryAddress: "", pickupAddress: "", priority: "NORMAL" }) }
  }

  const optimizeRoutes = async () => {
    setOptimizing(true)
    try { const res = await fetch("/api/routes/optimize", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) }); setOptimizeResult(await res.json()); loadData() } catch {}
    setOptimizing(false)
  }

  const iconMap: any = { BarChart2, BarChart, Truck, Users, Package, Warehouse, Box, ScanLine, Fuel, Wrench, FileText, DollarSign, Map, MapPin, RefreshCw, TrendingUp, Cpu, Wifi, Globe, Zap, CheckCircle, Bell, FlaskConical, Activity }

  if (status === "loading") return (
    <div style={{ minHeight: "100vh", background: "#080d1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#6366f1", fontSize: 16, display: "flex", alignItems: "center", gap: 12 }}><Truck size={24} color="#6366f1" /> Loading FleetMind...</div>
    </div>
  )

  const INP2: any = { width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 10, fontSize: 14, color: "#e2e8f0", outline: "none", boxSizing: "border-box", marginBottom: 12, fontFamily: "system-ui" }

  return (
    <div style={{ minHeight: "100vh", background: "#080d1a", fontFamily: "system-ui,-apple-system,sans-serif", display: "flex", color: "#e2e8f0" }}>

      {/* SIDEBAR */}
      <div style={{ width: sidebarOpen ? 240 : 0, background: "linear-gradient(180deg,#0d1526 0%,#080d1a 100%)", borderRight: "1px solid rgba(99,102,241,0.1)", display: "flex", flexDirection: "column", transition: "width 0.3s", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ padding: "20px 18px", borderBottom: "1px solid rgba(99,102,241,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Truck size={20} color="white" /></div>
            <div><div style={{ fontSize: 16, fontWeight: 900, color: "white" }}>FleetMind</div><div style={{ fontSize: 9, color: "#6366f1", fontWeight: 700, letterSpacing: "1.5px" }}>PRO EDITION</div></div>
            <button onClick={() => setSidebarOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: "#334155", cursor: "pointer", fontSize: 18 }}>×</button>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 10px" }}>
          {NAV.map(section => (
            <div key={section.label} style={{ marginBottom: 4 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "#1e293b", letterSpacing: "1.5px", padding: "5px 8px 3px" }}>{section.label}</div>
              {section.items.map(item => {
                const Icon = iconMap[item.icon] || Package; const active = activeTab === item.id
                return (
                  <button key={item.id} onClick={() => setActiveTab(item.id)}
                    style={{ width: "100%", padding: "9px 10px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 13, fontWeight: active ? 600 : 400, background: active ? "linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.1))" : "transparent", color: active ? "#a5b4fc" : "#475569", display: "flex", alignItems: "center", gap: 9, textAlign: "left", transition: "all 0.15s", marginBottom: 1 }}>
                    <Icon size={14} /><span style={{ whiteSpace: "nowrap" }}>{item.label}</span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
        <div style={{ padding: "14px 12px", borderTop: "1px solid rgba(99,102,241,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "white", flexShrink: 0 }}>{user?.name?.[0]?.toUpperCase() || "U"}</div>
            <div style={{ overflow: "hidden" }}><div style={{ fontSize: 13, fontWeight: 600, color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name || "User"}</div><div style={{ fontSize: 11, color: "#334155" }}>{user?.plan || "Basic"} Plan</div></div>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/login" })} style={{ width: "100%", padding: "8px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 8, color: "#ef4444", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <LogOut size={12} /> Sign Out
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <div style={{ height: 60, background: "rgba(13,21,38,0.95)", borderBottom: "1px solid rgba(99,102,241,0.08)", display: "flex", alignItems: "center", padding: "0 24px", gap: 16, flexShrink: 0 }}>
          {!sidebarOpen && <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontSize: 22 }}>☰</button>}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "white", letterSpacing: "-0.5px" }}>{activeTab.replace(/-/g, " ")}</div>
            <div style={{ fontSize: 12, color: "#475569" }}>{t("welcome", lang)}, {user?.name} — {time.toLocaleTimeString()}</div>
          </div>
          <select value={lang} onChange={e => setLang(e.target.value)} style={{ padding: "6px 12px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, color: "#a5b4fc", fontSize: 12, cursor: "pointer", outline: "none" }}>
            <option value="en">🇿🇦 English</option><option value="af">🇿🇦 Afrikaans</option><option value="zu">🇿🇦 Zulu</option><option value="xh">🇿🇦 Xhosa</option>
          </select>
          <button onClick={() => setShowAddDriver(true)} style={{ padding: "8px 16px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 9, color: "#34d399", cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, marginRight: -8 }}>
            <span>+ Driver</span>
          </button>
          <button onClick={() => setShowNewOrder(true)} style={{ padding: "8px 16px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 9, color: "white", cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}><Plus size={14} /> {t("newOrder", lang)}</button>
          <button onClick={loadData} style={{ width: 36, height: 36, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 9, color: "#6366f1", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><RefreshCw size={14} /></button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>


          {/* ADD DRIVER MODAL */}
          {showAddDriver && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
              <div style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 20, padding: 32, width: 480, border: "1px solid rgba(99,102,241,0.2)", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 6 }}>Add Driver</div>
                <div style={{ fontSize: 12, color: "#475569", marginBottom: 20 }}>Driver will appear on Live Map automatically</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <input placeholder="Full Name *" value={driverForm.name} onChange={e => setDriverForm({...driverForm, name: e.target.value})} style={inp}/>
                  <input placeholder="Phone Number" value={driverForm.phone} onChange={e => setDriverForm({...driverForm, phone: e.target.value})} style={inp}/>
                  <input placeholder="Email" type="email" value={driverForm.email} onChange={e => setDriverForm({...driverForm, email: e.target.value})} style={inp}/>
                  <input placeholder="License Number" value={driverForm.licenseNumber} onChange={e => setDriverForm({...driverForm, licenseNumber: e.target.value})} style={inp}/>
                  <select value={driverForm.licenseType} onChange={e => setDriverForm({...driverForm, licenseType: e.target.value})} style={inp}>
                    <option value="CODE_8">Code 8 (Light)</option>
                    <option value="CODE_10">Code 10 (Heavy)</option>
                    <option value="CODE_14">Code 14 (Extra Heavy)</option>
                    <option value="MOTORCYCLE">Motorcycle</option>
                  </select>
                  <select value={driverForm.vehicleId} onChange={e => setDriverForm({...driverForm, vehicleId: e.target.value})} style={inp}>
                    <option value="">Assign Vehicle (Optional)</option>
                    {vehicles.filter(v => !v.driver).map((v: any) => <option key={v.id} value={v.id}>{v.registration} — {v.make} {v.model}</option>)}
                  </select>
                </div>
                <div style={{ padding: "10px 14px", background: "rgba(99,102,241,0.06)", borderRadius: 10, border: "1px solid rgba(99,102,241,0.12)", fontSize: 12, color: "#64748b", marginTop: 4, marginBottom: 18 }}>
                  📍 Driver location will be auto-assigned in South Africa and appear on Live Map immediately
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button type="button" onClick={() => setShowAddDriver(false)} style={{ flex: 1, padding: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#94a3b8", cursor: "pointer", fontSize: 14 }}>{t("cancel", lang)}</button>
                  <button type="button" disabled={!driverForm.name} onClick={async () => {
                    const res = await fetch("/api/drivers", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(driverForm) })
                    if (res.ok) {
                      setShowAddDriver(false)
                      setDriverForm({ name:"", phone:"", email:"", licenseNumber:"", licenseType:"CODE_10", vehicleId:"" })
                      loadData()
                      if (activeTab !== "live-map") setActiveTab("live-map")
                    }
                  }} style={{ flex: 2, padding: 12, background: "linear-gradient(135deg,#10b981,#059669)", border: "none", borderRadius: 10, color: "white", cursor: "pointer", fontSize: 14, fontWeight: 600, opacity: !driverForm.name ? 0.6 : 1 }}>
                    Add Driver → View on Map
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* New Order Modal */}
          {showNewOrder && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 20, padding: 32, width: 480, border: "1px solid rgba(99,102,241,0.2)", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 20 }}>New Order</div>
                <form onSubmit={createOrder}>
                  <input placeholder="Customer Name *" value={orderForm.customerName} onChange={e => setOrderForm({ ...orderForm, customerName: e.target.value })} style={INP2} required />
                  <input placeholder="Customer Email *" type="email" value={orderForm.customerEmail} onChange={e => setOrderForm({ ...orderForm, customerEmail: e.target.value })} style={INP2} required />
                  <input placeholder="Customer Phone" value={orderForm.customerPhone} onChange={e => setOrderForm({ ...orderForm, customerPhone: e.target.value })} style={INP2} />
                  <input placeholder="Pickup Address *" value={orderForm.pickupAddress} onChange={e => setOrderForm({ ...orderForm, pickupAddress: e.target.value })} style={INP2} required />
                  <input placeholder="Delivery Address *" value={orderForm.deliveryAddress} onChange={e => setOrderForm({ ...orderForm, deliveryAddress: e.target.value })} style={INP2} required />
                  <select value={orderForm.priority} onChange={e => setOrderForm({ ...orderForm, priority: e.target.value })} style={INP2}>
                    <option value="LOW">Low Priority</option><option value="NORMAL">Normal</option><option value="HIGH">High</option><option value="URGENT">Urgent</option>
                  </select>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button type="button" onClick={() => setShowNewOrder(false)} style={{ flex: 1, padding: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#94a3b8", cursor: "pointer", fontSize: 14 }}>Cancel</button>
                    <button type="submit" style={{ flex: 2, padding: 12, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 10, color: "white", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Create Order</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
                {[
                  { label: t("totalVehicles", lang), value: stats.vehicles, sub: vehicles.filter((v: any) => v.status === "ON_ROUTE").length + " on route", color: "#6366f1", icon: <Truck size={20} color="#6366f1" /> },
                  { label: t("activeDrivers", lang), value: stats.drivers, sub: "Available now", color: "#10b981", icon: <Users size={20} color="#10b981" /> },
                  { label: t("totalOrders", lang), value: stats.orders, sub: stats.completed + " completed", color: "#f59e0b", icon: <Package size={20} color="#f59e0b" /> },
                  { label: t("successRate", lang), value: stats.rate + "%", sub: "R" + stats.revenue.toLocaleString() + " revenue", color: "#ec4899", icon: <BarChart2 size={20} color="#ec4899" /> },
                ].map(s => (
                  <div key={s.label} style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 16, padding: 20, border: "1px solid rgba(99,102,241,0.1)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>{s.icon}</div>
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 800, color: s.color, letterSpacing: "-1px" }}>{loading ? "—" : s.value}</div>
                    <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: "#334155", marginTop: 2 }}>{s.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 16, padding: 20, border: "1px solid rgba(99,102,241,0.1)", marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "white", display: "flex", alignItems: "center", gap: 8 }}><Route size={16} color="#6366f1" /> Route Optimizer</div>
                  <button onClick={optimizeRoutes} disabled={optimizing} style={{ padding: "8px 16px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontSize: 12, fontWeight: 600, opacity: optimizing ? 0.7 : 1 }}>{optimizing ? "Optimizing..." : "Optimize Routes"}</button>
                </div>
                {optimizeResult ? <div style={{ padding: "10px 14px", background: (optimizeResult as any).success ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)", borderRadius: 8, fontSize: 13, color: (optimizeResult as any).success ? "#34d399" : "#f87171" }}>{(optimizeResult as any).message} · {(optimizeResult as any).solver}</div>
                  : <div style={{ fontSize: 13, color: "#334155" }}>{orders.filter((o: any) => o.status === "PENDING").length} pending orders · {vehicles.filter((v: any) => v.status === "AVAILABLE").length} available vehicles</div>}
              </div>
              <div style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 16, padding: 20, border: "1px solid rgba(99,102,241,0.1)" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 16 }}>Recent Orders</div>
                {orders.slice(0, 8).map((o: any) => (
                  <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(99,102,241,0.05)" }}>
                    <div><div style={{ fontSize: 13, fontWeight: 600, color: "#a5b4fc" }}>{o.orderNumber}</div><div style={{ fontSize: 11, color: "#475569" }}>{o.customerName} → {o.deliveryAddress?.substring(0, 30)}</div></div>
                    <span style={{ padding: "3px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600, background: o.status === "COMPLETED" ? "rgba(16,185,129,0.15)" : o.status === "IN_PROGRESS" ? "rgba(99,102,241,0.15)" : "rgba(245,158,11,0.15)", color: o.status === "COMPLETED" ? "#34d399" : o.status === "IN_PROGRESS" ? "#a5b4fc" : "#fbbf24" }}>{o.status}</span>
                  </div>
                ))}
                {orders.length === 0 && !loading && <div style={{ color: "#334155", textAlign: "center", padding: 20, fontSize: 13 }}>No orders yet. Create your first order above.</div>}
              </div>
            </div>
          )}

          {/* FLEET */}
          {activeTab === "fleet" && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 20 }}>Fleet Tracking ({vehicles.length} vehicles)</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                {vehicles.map((v: any) => (
                  <div key={v.id} style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 14, padding: 18, border: "1px solid rgba(99,102,241,0.1)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "white" }}>{v.registration}</div>
                      <span style={{ padding: "3px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600, background: v.status === "ON_ROUTE" ? "rgba(99,102,241,0.15)" : v.status === "AVAILABLE" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)", color: v.status === "ON_ROUTE" ? "#a5b4fc" : v.status === "AVAILABLE" ? "#34d399" : "#fbbf24" }}>{v.status}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#475569" }}>{v.make} {v.model} · {v.type}</div>
                    {v.driver && <div style={{ fontSize: 12, color: "#10b981", marginTop: 4 }}>Driver: {v.driver.name}</div>}
                    <div style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>{v.latitude?.toFixed(4)}, {v.longitude?.toFixed(4)}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                      {["AVAILABLE", "ON_ROUTE", "MAINTENANCE"].map(s => (
                        <button key={s} onClick={async () => { await fetch(`/api/vehicles/${v.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: s }) }); loadData() }}
                          style={{ flex: 1, padding: "4px 0", background: v.status === s ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.03)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 6, color: v.status === s ? "#a5b4fc" : "#334155", cursor: "pointer", fontSize: 9 }}>{s.split("_")[0]}</button>
                      ))}
                    </div>
                  </div>
                ))}
                {vehicles.length === 0 && <div style={{ gridColumn: "1/-1", color: "#334155", textAlign: "center", padding: 40, fontSize: 13 }}>No vehicles yet.</div>}
              </div>
            </div>
          )}

          {/* DRIVERS */}
          {activeTab === "drivers" && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 20 }}>Drivers ({drivers.length})</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                {drivers.map((d: any) => (
                  <div key={d.id} style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 14, padding: 18, border: "1px solid rgba(99,102,241,0.1)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "white" }}>{d.name?.[0]}</div>
                      <div><div style={{ fontSize: 14, fontWeight: 700, color: "white" }}>{d.name}</div><div style={{ fontSize: 11, color: "#475569" }}>{d.phone}</div></div>
                    </div>
                    <div style={{ fontSize: 11, color: "#475569" }}>{d.licenseNumber} · {d.licenseType}</div>
                    {d.vehicle && <div style={{ fontSize: 12, color: "#6366f1", marginTop: 4 }}>Vehicle: {d.vehicle.registration}</div>}
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                      <span style={{ padding: "3px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600, background: d.status === "ACTIVE" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)", color: d.status === "ACTIVE" ? "#34d399" : "#fbbf24" }}>{d.status}</span>
                      {d.rating && <span style={{ fontSize: 12, color: "#f59e0b" }}>★ {d.rating}</span>}
                    </div>
                  </div>
                ))}
                {drivers.length === 0 && (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 40 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>👤</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 6 }}>No drivers yet</div>
                <div style={{ fontSize: 13, color: "#475569", marginBottom: 16 }}>Click the + Driver button to add your first driver</div>
                <button onClick={() => setShowAddDriver(true)} style={{ padding: "10px 24px", background: "linear-gradient(135deg,#10b981,#059669)", border: "none", borderRadius: 10, color: "white", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>+ Add First Driver</button>
              </div>
            )}
              </div>
            </div>
          )}

          {/* ORDERS */}
          {activeTab === "orders" && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 20 }}>All Orders ({orders.length})</div>
              <div style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 14, overflow: "hidden", border: "1px solid rgba(99,102,241,0.1)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1.5fr 1fr 1fr", padding: "12px 18px", borderBottom: "1px solid rgba(99,102,241,0.1)", fontSize: 11, fontWeight: 700, color: "#475569" }}><span>ORDER</span><span>CUSTOMER</span><span>ADDRESS</span><span>STATUS</span><span>UPDATE</span></div>
                {orders.map((o: any) => (
                  <div key={o.id} style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1.5fr 1fr 1fr", padding: "12px 18px", borderBottom: "1px solid rgba(99,102,241,0.05)", alignItems: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#a5b4fc" }}>{o.orderNumber}</span>
                    <span style={{ fontSize: 12, color: "#e2e8f0" }}>{o.customerName}</span>
                    <span style={{ fontSize: 11, color: "#475569" }}>{o.deliveryAddress?.substring(0, 22)}...</span>
                    <span style={{ padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: o.status === "COMPLETED" ? "rgba(16,185,129,0.15)" : o.status === "IN_PROGRESS" ? "rgba(99,102,241,0.15)" : "rgba(245,158,11,0.15)", color: o.status === "COMPLETED" ? "#34d399" : o.status === "IN_PROGRESS" ? "#a5b4fc" : "#fbbf24", display: "inline-block" }}>{o.status}</span>
                    <select onChange={async e => { await fetch(`/api/orders/${o.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: e.target.value }) }); loadData() }} value={o.status} style={{ padding: "4px 8px", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 6, color: "#a5b4fc", fontSize: 11, cursor: "pointer" }}>
                      <option value="PENDING">Pending</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option><option value="FAILED">Failed</option>
                    </select>
                  </div>
                ))}
                {orders.length === 0 && <div style={{ padding: 30, textAlign: "center", color: "#334155", fontSize: 13 }}>No orders yet.</div>}
              </div>
            </div>
          )}

          {/* ANALYTICS */}
          {activeTab === "analytics" && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 20 }}>Analytics</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                {[
                  { l: "Completion Rate", v: stats.rate + "%", c: "#10b981" }, { l: "Total Revenue", v: "R" + stats.revenue.toLocaleString(), c: "#6366f1" },
                  { l: "Active Fleet", v: vehicles.filter((v: any) => v.status !== "MAINTENANCE").length + "/" + stats.vehicles, c: "#f59e0b" },
                  { l: "Pending Orders", v: orders.filter((o: any) => o.status === "PENDING").length, c: "#ec4899" },
                  { l: "In Progress", v: orders.filter((o: any) => o.status === "IN_PROGRESS").length, c: "#6366f1" },
                  { l: "Completed", v: orders.filter((o: any) => o.status === "COMPLETED").length, c: "#10b981" },
                ].map(s => (
                  <div key={s.l} style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 14, padding: 20, border: "1px solid rgba(99,102,241,0.1)", textAlign: "center" }}>
                    <div style={{ fontSize: 34, fontWeight: 800, color: s.c }}>{s.v}</div>
                    <div style={{ fontSize: 13, color: "#475569", marginTop: 6 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PANEL TABS */}
          {activeTab === "geofences" && <GeofencingPanel />}
          {activeTab === "returns" && <ReturnsPanel />}
          {activeTab === "forecast" && <ForecastPanel />}
          {activeTab === "ml-maintenance" && <MLMaintenancePanel />}
          {activeTab === "warehouses" && <WarehousesPanel />}
          {activeTab === "inventory" && <InventoryPanel />}
          {activeTab === "barcode" && <BarcodePanel />}
          {activeTab === "fuel" && <FuelPanel />}
          {activeTab === "maintenance" && <MaintenancePanel />}
          {activeTab === "invoices" && <InvoicesPanel />}
          {activeTab === "cost-analysis" && <CostAnalysisPanel />}
          {activeTab === "hubs" && <HubsPanel />}
          {activeTab === "route-optimizer" && <RouteOptimizerPanel optimizeRoutes={optimizeRoutes} optimizing={optimizing} optimizeResult={optimizeResult} />}
          {activeTab === "telematics" && <TelematicsPanel />}
          {activeTab === "courier-federation" && <CourierPanel />}
          {activeTab === "ai-agents" && <AIAgentsPanel />}
          {activeTab === "notifications" && <NotificationsPanel />}
          {activeTab === "api-docs" && <APIDocsPanel />}
          {activeTab === "testing" && <TestingPanel />}
          {activeTab === "monitoring" && <MonitoringPanel />}
          {activeTab === "pod" && <PODPanel />}
          {activeTab === "live-map" && <LiveMapPanel vehicles={vehicles} drivers={drivers} />}
          {activeTab === "driver-app" && <DriverAppPanel />}
        </div>
      </div>

      <ChatBot context="dashboard" />
    </div>
  )
}
