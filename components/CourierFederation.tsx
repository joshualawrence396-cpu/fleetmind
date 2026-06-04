"use client"
import React, { useState, useEffect } from "react"
import { Truck, DollarSign, CheckCircle, Package, Globe } from "lucide-react"

const PROVIDERS = [
  { id: "BOB_GO", name: "Bob Go", color: "#6366f1", logo: "BG", desc: "SA multi-courier aggregator" },
  { id: "ARAMEX", name: "Aramex", color: "#f97316", logo: "AX", desc: "International express" },
  { id: "COURIER_GUY", name: "The Courier Guy", color: "#10b981", logo: "CG", desc: "SA national courier" },
  { id: "DSV", name: "DSV", color: "#3b82f6", logo: "DV", desc: "Global logistics" },
  { id: "PUDO", name: "PUDO Lockers", color: "#8b5cf6", logo: "PU", desc: "Locker network SA" },
  { id: "POSTNET", name: "PostNet", color: "#ec4899", logo: "PN", desc: "SA counter network" },
]

export function CourierFederation() {
  const [accounts, setAccounts] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [rates, setRates] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [quoteForm, setQuoteForm] = useState({ orderId: "", weightKg: "1", distanceKm: "50", serviceLevel: "STANDARD" })
  const [bookForm, setBookForm] = useState({ orderId: "", provider: "", price: "" })
  const [showAddAccount, setShowAddAccount] = useState(false)
  const [accountForm, setAccountForm] = useState({ provider: "BOB_GO", name: "", apiKey: "", accountNumber: "" })

  useEffect(() => {
    fetch("/api/orders").then(r => r.json()).then(o => setOrders(Array.isArray(o) ? o.filter((x: any) => x.status === "PENDING") : []))
    fetch("/api/couriers").then(r => r.json()).then(a => setAccounts(Array.isArray(a) ? a : []))
    fetch("/api/couriers/bookings").then(r => r.json()).then(b => setBookings(Array.isArray(b) ? b : []))
  }, [])

  const getQuotes = async () => {
    setLoading(true)
    const res = await fetch("/api/couriers/rates", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: quoteForm.orderId || null, weightKg: parseFloat(quoteForm.weightKg), distanceKm: parseFloat(quoteForm.distanceKm), serviceLevel: quoteForm.serviceLevel })
    })
    const data = await res.json()
    setRates(data.quotes || [])
    setLoading(false)
  }

  const bookCourier = async () => {
    if (!bookForm.orderId || !bookForm.provider) return
    setLoading(true)
    const res = await fetch("/api/couriers/book", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookForm)
    })
    if (res.ok) {
      fetch("/api/couriers/bookings").then(r => r.json()).then(b => setBookings(Array.isArray(b) ? b : []))
      setBookForm({ orderId: "", provider: "", price: "" })
    }
    setLoading(false)
  }

  const addAccount = async () => {
    const res = await fetch("/api/couriers", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(accountForm)
    })
    if (res.ok) {
      fetch("/api/couriers").then(r => r.json()).then(a => setAccounts(Array.isArray(a) ? a : []))
      setShowAddAccount(false)
    }
  }

  const inp: any = { width: "100%", padding: "9px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, fontSize: 13, color: "#e2e8f0", outline: "none", boxSizing: "border-box", marginBottom: 8 }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}><Globe size={20} color="#6366f1" /></div>
          <div><div style={{ fontSize: 18, fontWeight: "700", color: "white" }}>Courier Federation</div><div style={{ fontSize: 12, color: "#475569" }}>Multi-courier rate shopping and booking</div></div>
        </div>
        <button onClick={() => setShowAddAccount(!showAddAccount)} style={{ padding: "8px 16px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontSize: 13, fontWeight: "600" }}>+ Add Courier Account</button>
      </div>

      {/* Add account form */}
      {showAddAccount && (
        <div style={{ background: "rgba(99,102,241,0.05)", borderRadius: 14, padding: 20, border: "1px solid rgba(99,102,241,0.2)", marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: "600", color: "white", marginBottom: 14 }}>Connect Courier Account</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
            <select value={accountForm.provider} onChange={e => setAccountForm({...accountForm, provider: e.target.value})} style={inp}>
              {PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input placeholder="Account Name" value={accountForm.name} onChange={e => setAccountForm({...accountForm, name: e.target.value})} style={inp}/>
            <input placeholder="API Key" value={accountForm.apiKey} onChange={e => setAccountForm({...accountForm, apiKey: e.target.value})} style={inp}/>
            <input placeholder="Account Number" value={accountForm.accountNumber} onChange={e => setAccountForm({...accountForm, accountNumber: e.target.value})} style={inp}/>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setShowAddAccount(false)} style={{ flex: 1, padding: 9, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#94a3b8", cursor: "pointer" }}>Cancel</button>
            <button onClick={addAccount} style={{ flex: 1, padding: 9, background: "linear-gradient(135deg,#10b981,#059669)", border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontWeight: "600" }}>Connect</button>
          </div>
        </div>
      )}

      {/* Provider cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12, marginBottom: 24 }}>
        {PROVIDERS.map(p => {
          const connected = accounts.some((a: any) => a.provider === p.id)
          return (
            <div key={p.id} style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 12, padding: 16, border: connected ? "1px solid " + p.color + "40" : "1px solid rgba(99,102,241,0.1)", textAlign: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: p.color + "20", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", fontSize: 14, fontWeight: "800", color: p.color }}>{p.logo}</div>
              <div style={{ fontSize: 12, fontWeight: "600", color: "white" }}>{p.name}</div>
              <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>{p.desc}</div>
              <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, color: connected ? "#10b981" : "#334155", background: connected ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.03)", padding: "3px 8px", borderRadius: 10 }}>
                {connected ? <><CheckCircle size={8}/> Connected</> : "Not connected"}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

        {/* Rate shopping */}
        <div style={{ background: "rgba(99,102,241,0.05)", borderRadius: 14, padding: 20, border: "1px solid rgba(99,102,241,0.15)" }}>
          <div style={{ fontSize: 14, fontWeight: "600", color: "white", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}><DollarSign size={16} color="#6366f1"/> Rate Shopping</div>
          <select value={quoteForm.orderId} onChange={e => setQuoteForm({...quoteForm, orderId: e.target.value})} style={inp}>
            <option value="">Select Order (Optional)</option>
            {orders.map((o: any) => <option key={o.id} value={o.id}>{o.orderNumber} - {o.customerName}</option>)}
          </select>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <input type="number" placeholder="Weight (kg)" value={quoteForm.weightKg} onChange={e => setQuoteForm({...quoteForm, weightKg: e.target.value})} style={inp}/>
            <input type="number" placeholder="Distance (km)" value={quoteForm.distanceKm} onChange={e => setQuoteForm({...quoteForm, distanceKm: e.target.value})} style={inp}/>
          </div>
          <select value={quoteForm.serviceLevel} onChange={e => setQuoteForm({...quoteForm, serviceLevel: e.target.value})} style={inp}>
            <option value="ECONOMY">Economy</option>
            <option value="STANDARD">Standard</option>
            <option value="EXPRESS">Express</option>
          </select>
          <button onClick={getQuotes} disabled={loading} style={{ width: "100%", padding: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontWeight: "600" }}>
            {loading ? "Getting quotes..." : "Get Quotes from All Couriers"}
          </button>
          {rates.length > 0 && (
            <div style={{ marginTop: 12 }}>
              {rates.map((r: any) => (
                <div key={r.provider} style={{ padding: "10px 12px", borderRadius: 8, background: r.recommended ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.02)", border: "1px solid " + (r.recommended ? "rgba(16,185,129,0.25)" : "rgba(99,102,241,0.08)"), marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: "600", color: "white" }}>{r.provider.replace("_", " ")} {r.recommended && <span style={{ fontSize: 10, color: "#10b981", marginLeft: 6 }}>BEST PRICE</span>}</div>
                    <div style={{ fontSize: 11, color: "#475569" }}>{r.service} | ETA: {r.eta}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 16, fontWeight: "700", color: r.recommended ? "#10b981" : "#e2e8f0" }}>R{r.price}</div>
                    <button onClick={() => setBookForm({...bookForm, provider: r.provider, price: r.price})} style={{ fontSize: 10, color: "#6366f1", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Book this</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Book courier */}
        <div style={{ background: "rgba(16,185,129,0.03)", borderRadius: 14, padding: 20, border: "1px solid rgba(16,185,129,0.1)" }}>
          <div style={{ fontSize: 14, fontWeight: "600", color: "white", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}><Package size={16} color="#10b981"/> Book Courier</div>
          <select value={bookForm.orderId} onChange={e => setBookForm({...bookForm, orderId: e.target.value})} style={inp}>
            <option value="">Select Order *</option>
            {orders.map((o: any) => <option key={o.id} value={o.id}>{o.orderNumber} - {o.customerName}</option>)}
          </select>
          <select value={bookForm.provider} onChange={e => setBookForm({...bookForm, provider: e.target.value})} style={inp}>
            <option value="">Select Courier *</option>
            {PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input type="number" placeholder="Price (R)" value={bookForm.price} onChange={e => setBookForm({...bookForm, price: e.target.value})} style={inp}/>
          <button onClick={bookCourier} disabled={loading || !bookForm.orderId || !bookForm.provider} style={{ width: "100%", padding: 10, background: "linear-gradient(135deg,#10b981,#059669)", border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontWeight: "600" }}>
            {loading ? "Booking..." : "Confirm Booking"}
          </button>

          <div style={{ marginTop: 16, fontSize: 13, fontWeight: "600", color: "white", marginBottom: 10 }}>Recent Bookings ({bookings.length})</div>
          {bookings.slice(0, 5).map((b: any) => (
            <div key={b.id} style={{ padding: "8px 10px", borderRadius: 8, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(99,102,241,0.08)", marginBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontSize: 12, fontWeight: "600", color: "white" }}>{b.order?.orderNumber}</div>
                <div style={{ fontSize: 11, color: "#10b981" }}>{b.provider}</div>
              </div>
              <div style={{ fontSize: 11, color: "#475569" }}>{b.consignmentNo} | {b.status}</div>
              {b.trackingUrl && <a href={b.trackingUrl} target="_blank" style={{ fontSize: 10, color: "#6366f1" }}>Track package</a>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
