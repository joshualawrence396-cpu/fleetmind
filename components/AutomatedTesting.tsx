"use client"
import { useState } from "react"
import { FlaskConical, CheckCircle, XCircle, Clock, Play } from "lucide-react"

const TESTS = [
  { id: "vehicles", name: "GET /api/vehicles", desc: "Fetch all vehicles", method: "GET", url: "/api/vehicles" },
  { id: "drivers", name: "GET /api/drivers", desc: "Fetch all drivers", method: "GET", url: "/api/drivers" },
  { id: "orders", name: "GET /api/orders", desc: "Fetch all orders", method: "GET", url: "/api/orders" },
  { id: "warehouses", name: "GET /api/warehouses", desc: "Fetch all warehouses", method: "GET", url: "/api/warehouses" },
  { id: "inventory", name: "GET /api/inventory", desc: "Fetch inventory items", method: "GET", url: "/api/inventory" },
  { id: "analytics", name: "GET /api/analytics", desc: "Fetch analytics data", method: "GET", url: "/api/analytics" },
  { id: "me", name: "GET /api/me", desc: "Check auth session", method: "GET", url: "/api/me" },
]

export function AutomatedTesting() {
  const [results, setResults] = useState<Record<string, any>>({})
  const [running, setRunning] = useState(false)

  const runTest = async (test: any) => {
    setResults(prev => ({ ...prev, [test.id]: { status: "running", time: 0 } }))
    const start = Date.now()
    try {
      const res = await fetch(test.url)
      const time = Date.now() - start
      const data = await res.json()
      setResults(prev => ({ ...prev, [test.id]: { status: res.ok ? "pass" : "fail", time, statusCode: res.status, data: Array.isArray(data) ? `${data.length} items` : typeof data === "object" ? "OK" : data } }))
    } catch (e: any) {
      setResults(prev => ({ ...prev, [test.id]: { status: "fail", time: Date.now() - start, error: e.message } }))
    }
  }

  const runAll = async () => {
    setRunning(true)
    for (const test of TESTS) { await runTest(test) }
    setRunning(false)
  }

  const passed = Object.values(results).filter((r: any) => r.status === "pass").length
  const failed = Object.values(results).filter((r: any) => r.status === "fail").length

  const card: any = { background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 12, padding: "14px 18px", border: "1px solid rgba(99,102,241,0.1)", marginBottom: 8 }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <FlaskConical size={20} color="#6366f1"/>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "white" }}>API Testing</div>
            <div style={{ fontSize: 12, color: "#475569" }}>Test suite for all FleetMind APIs</div>
          </div>
        </div>
        <button onClick={runAll} disabled={running}
          style={{ padding: "10px 20px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 10, color: "white", cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, opacity: running ? 0.7 : 1 }}>
          <Play size={14}/> {running ? "Running..." : "Run All Tests"}
        </button>
      </div>

      {Object.keys(results).length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
          {[
            { l: "Passed", v: passed, c: "#10b981", icon: <CheckCircle size={16} color="#10b981"/> },
            { l: "Failed", v: failed, c: "#ef4444", icon: <XCircle size={16} color="#ef4444"/> },
            { l: "Total", v: TESTS.length, c: "#6366f1", icon: <FlaskConical size={16} color="#6366f1"/> },
          ].map(s => (
            <div key={s.l} style={{ ...card, display: "flex", alignItems: "center", gap: 12 }}>
              {s.icon}
              <div><div style={{ fontSize: 22, fontWeight: 800, color: s.c }}>{s.v}</div><div style={{ fontSize: 11, color: "#475569" }}>{s.l}</div></div>
            </div>
          ))}
        </div>
      )}

      <div>
        {TESTS.map(test => {
          const r = results[test.id]
          return (
            <div key={test.id} style={{ ...card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", background: "rgba(99,102,241,0.15)", color: "#6366f1", borderRadius: 6 }}>{test.method}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#a5b4fc" }}>{test.name}</div>
                  <div style={{ fontSize: 11, color: "#475569" }}>{test.desc}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {r?.time > 0 && <span style={{ fontSize: 11, color: "#475569" }}>{r.time}ms</span>}
                {!r && <span style={{ fontSize: 11, fontWeight: 600, color: "#334155", background: "rgba(255,255,255,0.04)", padding: "4px 10px", borderRadius: 8 }}>PENDING</span>}
                {r?.status === "running" && <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#f59e0b" }}><Clock size={12}/> Running</div>}
                {r?.status === "pass" && <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#10b981", fontWeight: 600 }}><CheckCircle size={12}/> PASS {r.data && <span style={{ color: "#475569" }}>({r.data})</span>}</div>}
                {r?.status === "fail" && <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#ef4444", fontWeight: 600 }}><XCircle size={12}/> FAIL</div>}
                <button onClick={() => runTest(test)} style={{ padding: "5px 12px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, color: "#6366f1", cursor: "pointer", fontSize: 11 }}>Run</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}