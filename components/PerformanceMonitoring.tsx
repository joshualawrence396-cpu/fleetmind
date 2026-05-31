"use client"
import { useState, useEffect } from "react"
import { Activity, Zap, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react"

export function PerformanceMonitoring() {
  const [metrics, setMetrics] = useState({ avgResponse: 0, uptime: 99.9, requests: 0, errors: 0 })
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const check = async () => {
    setLoading(true)
    const start = Date.now()
    try {
      await fetch("/api/analytics")
      const time = Date.now() - start
      const entry = { time: new Date().toLocaleTimeString(), ms: time, status: time < 500 ? "Good" : time < 1000 ? "Slow" : "Critical" }
      setHistory(prev => [entry, ...prev].slice(0, 10))
      setMetrics(prev => ({ ...prev, avgResponse: Math.round((prev.avgResponse + time) / 2) || time, requests: prev.requests + 1 }))
    } catch { setMetrics(prev => ({ ...prev, errors: prev.errors + 1 })) }
    setLoading(false)
  }

  useEffect(() => { check(); const t = setInterval(check, 30000); return () => clearInterval(t) }, [])

  const statusColor = (ms: number) => ms < 500 ? "#10b981" : ms < 1000 ? "#f59e0b" : "#ef4444"
  const card: any = { background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 14, padding: 20, border: "1px solid rgba(99,102,241,0.1)" }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Activity size={20} color="#6366f1"/>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "white" }}>Performance Monitoring</div>
            <div style={{ fontSize: 12, color: "#475569" }}>Real-time API health metrics</div>
          </div>
        </div>
        <button onClick={check} disabled={loading}
          style={{ padding: "9px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 10, color: "#6366f1", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
          <RefreshCw size={14} style={{ animation: loading ? "spin 0.8s linear infinite" : "none" }}/> Refresh
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { l: "Avg Response", v: metrics.avgResponse+"ms", icon: <Zap size={20} color="#f59e0b"/>, color: "#f59e0b", sub: metrics.avgResponse < 500 ? "Good" : "Slow" },
          { l: "Uptime", v: metrics.uptime+"%", icon: <CheckCircle size={20} color="#10b981"/>, color: "#10b981", sub: "Last 30 days" },
          { l: "Total Requests", v: metrics.requests, icon: <Activity size={20} color="#6366f1"/>, color: "#6366f1", sub: "This session" },
          { l: "Errors", v: metrics.errors, icon: <AlertTriangle size={20} color="#ef4444"/>, color: "#ef4444", sub: metrics.errors === 0 ? "All clear" : "Check logs" },
        ].map(s => (
          <div key={s.l} style={{ ...card, textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, letterSpacing: "-1px" }}>{s.v}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{s.l}</div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={card}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 16 }}>Response Time History</div>
        {history.length === 0 && <div style={{ color: "#334155", textAlign: "center", padding: 20, fontSize: 13 }}>Checking API health...</div>}
        {history.map((h, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: "#475569", minWidth: 80 }}>{h.time}</span>
            <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: Math.min(100, (h.ms / 2000) * 100)+"%", background: `linear-gradient(90deg,${statusColor(h.ms)},${statusColor(h.ms)}aa)`, borderRadius: 4, transition: "width 0.5s" }}></div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: statusColor(h.ms), minWidth: 50 }}>{h.ms}ms</span>
            <span style={{ fontSize: 11, color: statusColor(h.ms), minWidth: 50 }}>{h.status}</span>
          </div>
        ))}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}