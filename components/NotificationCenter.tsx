"use client"
import { useState, useEffect } from "react"
import { Bell, Send, CheckCircle, Mail, AlertCircle } from "lucide-react"

export function NotificationCenter() {
  const [notifications, setNotifications] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ orderId: "", type: "ORDER_DISPATCHED", customMessage: "", recipient: "" })
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    fetch("/api/notifications").then(r => r.json()).then(n => setNotifications(Array.isArray(n) ? n : []))
    fetch("/api/orders").then(r => r.json()).then(o => setOrders(Array.isArray(o) ? o : []))
  }, [])

  const send = async () => {
    setLoading(true); setResult(null)
    const res = await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
    const data = await res.json()
    setResult(data)
    if (data.success) {
      fetch("/api/notifications").then(r => r.json()).then(n => setNotifications(Array.isArray(n) ? n : []))
    }
    setLoading(false)
  }

  const bulkSend = async (type: string) => {
    setLoading(true)
    const targets = orders.filter((o: any) => {
      if (type === "ORDER_DISPATCHED") return o.status === "IN_PROGRESS" && o.customerEmail
      if (type === "ORDER_COMPLETED") return o.status === "COMPLETED" && o.customerEmail
      if (type === "ORDER_CREATED") return o.status === "PENDING" && o.customerEmail
      return false
    })
    let sent = 0
    for (const o of targets) {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: o.id, type })
      })
      if ((await res.json()).success) sent++
    }
    setResult({ success: true, message: `Sent ${sent} emails` })
    fetch("/api/notifications").then(r => r.json()).then(n => setNotifications(Array.isArray(n) ? n : []))
    setLoading(false)
  }

  const inp: any = { width: "100%", padding: "9px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, fontSize: 13, color: "#e2e8f0", outline: "none", boxSizing: "border-box", marginBottom: 10 }
  const sent = notifications.filter((n: any) => n.status === "SENT").length
  const failed = notifications.filter((n: any) => n.status === "FAILED").length
  const hasResend = typeof window !== "undefined"

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Mail size={20} color="#6366f1"/>
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "white" }}>Email Notifications</div>
          <div style={{ fontSize: 12, color: "#475569" }}>Powered by Resend — automated customer emails</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Emails Sent", value: sent, color: "#10b981", icon: <CheckCircle size={18} color="#10b981"/> },
          { label: "Failed", value: failed, color: "#ef4444", icon: <AlertCircle size={18} color="#ef4444"/> },
          { label: "Total", value: notifications.length, color: "#6366f1", icon: <Mail size={18} color="#6366f1"/> },
        ].map(s => (
          <div key={s.label} style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 12, padding: 18, border: "1px solid rgba(99,102,241,0.1)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color+"15", display: "flex", alignItems: "center", justifyContent: "center" }}>{s.icon}</div>
            <div><div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div><div style={{ fontSize: 12, color: "#475569" }}>{s.label}</div></div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

        {/* Send form */}
        <div style={{ background: "rgba(99,102,241,0.05)", borderRadius: 14, padding: 20, border: "1px solid rgba(99,102,241,0.15)" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <Send size={15} color="#6366f1"/> Send Email
          </div>

          <select value={form.orderId} onChange={e => setForm({...form, orderId: e.target.value})} style={inp}>
            <option value="">Select Order (Optional)</option>
            {orders.map((o: any) => <option key={o.id} value={o.id}>{o.orderNumber} — {o.customerName} ({o.customerEmail})</option>)}
          </select>

          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} style={inp}>
            <option value="ORDER_CREATED">Order Confirmed</option>
            <option value="ORDER_DISPATCHED">Out for Delivery</option>
            <option value="ORDER_ARRIVING">Arriving Soon</option>
            <option value="ORDER_COMPLETED">Delivered</option>
            <option value="ORDER_FAILED">Delivery Failed</option>
            <option value="CUSTOM">Custom Message</option>
          </select>

          <input
            placeholder="Recipient email (or uses order email)"
            value={form.recipient}
            onChange={e => setForm({...form, recipient: e.target.value})}
            type="email"
            style={inp}
          />

          {form.type === "CUSTOM" && (
            <textarea
              placeholder="Custom message..."
              value={form.customMessage}
              onChange={e => setForm({...form, customMessage: e.target.value})}
              style={{ ...inp, minHeight: 80, resize: "vertical" }}
            />
          )}

          <button onClick={send} disabled={loading || (!form.orderId && !form.recipient)}
            style={{ width: "100%", padding: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontWeight: 600, fontSize: 13, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Sending..." : "Send Email"}
          </button>

          {result && (
            <div style={{ marginTop: 10, padding: "10px 12px", background: result.success ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", border: "1px solid " + (result.success ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"), borderRadius: 8, fontSize: 12, color: result.success ? "#34d399" : "#f87171" }}>
              {result.message || (result.success ? "Sent!" : result.error)}
            </div>
          )}
        </div>

        {/* Bulk send */}
        <div style={{ background: "rgba(16,185,129,0.03)", borderRadius: 14, padding: 20, border: "1px solid rgba(16,185,129,0.1)" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 6 }}>Bulk Emails</div>
          <div style={{ fontSize: 12, color: "#475569", marginBottom: 16 }}>Send to all matching orders at once</div>

          {[
            { type: "ORDER_DISPATCHED", label: "Notify IN PROGRESS orders", color: "#6366f1", count: orders.filter((o: any) => o.status === "IN_PROGRESS" && o.customerEmail).length },
            { type: "ORDER_COMPLETED", label: "Notify COMPLETED orders", color: "#10b981", count: orders.filter((o: any) => o.status === "COMPLETED" && o.customerEmail).length },
            { type: "ORDER_CREATED", label: "Notify PENDING orders", color: "#f59e0b", count: orders.filter((o: any) => o.status === "PENDING" && o.customerEmail).length },
          ].map(b => (
            <div key={b.type} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "rgba(255,255,255,0.02)", borderRadius: 10, marginBottom: 10, border: "1px solid rgba(99,102,241,0.08)" }}>
              <div>
                <div style={{ fontSize: 13, color: "white" }}>{b.label}</div>
                <div style={{ fontSize: 11, color: "#475569" }}>{b.count} orders with email</div>
              </div>
              <button onClick={() => bulkSend(b.type)} disabled={loading || b.count === 0}
                style={{ padding: "6px 14px", background: b.color+"20", border: "1px solid "+b.color+"40", borderRadius: 8, color: b.color, cursor: b.count === 0 ? "not-allowed" : "pointer", fontSize: 12, fontWeight: 600, opacity: b.count === 0 ? 0.5 : 1 }}>
                Send
              </button>
            </div>
          ))}

          <div style={{ marginTop: 12, padding: "12px 14px", background: "rgba(99,102,241,0.06)", borderRadius: 10, border: "1px solid rgba(99,102,241,0.12)", fontSize: 12 }}>
            <div style={{ color: "#6366f1", fontWeight: 600, marginBottom: 4 }}>📧 Resend Setup</div>
            <div style={{ color: "#475569", lineHeight: 1.6 }}>
              1. Get free key at <a href="https://resend.com" target="_blank" style={{ color: "#6366f1" }}>resend.com</a><br/>
              2. Add to .env: <code style={{ color: "#a5b4fc" }}>RESEND_API_KEY=re_...</code><br/>
              3. Free tier: 100 emails/day<br/>
              4. Use <code style={{ color: "#a5b4fc" }}>onboarding@resend.dev</code> as from address for testing
            </div>
          </div>
        </div>
      </div>

      {/* History */}
      <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(99,102,241,0.1)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr 1fr", padding: "10px 16px", borderBottom: "1px solid rgba(99,102,241,0.1)", fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.5px" }}>
          <span>TIME</span><span>TYPE</span><span>RECIPIENT</span><span>STATUS</span>
        </div>
        {notifications.length === 0 && (
          <div style={{ padding: 30, textAlign: "center", color: "#334155", fontSize: 13 }}>No emails sent yet.</div>
        )}
        {notifications.map((n: any) => (
          <div key={n.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr 1fr", padding: "10px 16px", borderBottom: "1px solid rgba(99,102,241,0.05)", fontSize: 12, alignItems: "center" }}>
            <span style={{ color: "#64748b" }}>{new Date(n.createdAt).toLocaleTimeString()}</span>
            <span style={{ color: "#e2e8f0" }}>{n.type?.replace("ORDER_","")}</span>
            <span style={{ color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.recipient}</span>
            <span style={{ padding: "2px 8px", borderRadius: 8, fontSize: 11, fontWeight: 600, display: "inline-block", background: n.status === "SENT" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: n.status === "SENT" ? "#34d399" : "#f87171" }}>
              {n.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}