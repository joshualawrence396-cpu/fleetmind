"use client"
import { useState, useEffect } from "react"
import { Sparkles, Zap, TrendingUp, Wrench, Users, Map, Clock, CheckCircle } from "lucide-react"

export function AIAgents() {
  const [runs, setRuns] = useState<any[]>([])
  const [loading, setLoading] = useState<string | null>(null)
  const [results, setResults] = useState<any>({})
  const [orders, setOrders] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState("")
  const [issue, setIssue] = useState("")
  const [customerMsg, setCustomerMsg] = useState("")

  useEffect(() => {
    fetch("/api/agents").then(r => r.json()).then(d => setRuns(Array.isArray(d) ? d.slice(0, 10) : []))
    fetch("/api/orders").then(r => r.json()).then(o => setOrders(Array.isArray(o) ? o : []))
  }, [])

  const runAgent = async (agent: string, payload: any) => {
    setLoading(agent)
    try {
      const res = await fetch("/api/agents", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent, payload })
      })
      const data = await res.json()
      setResults((prev: any) => ({ ...prev, [agent]: data.result }))
      fetch("/api/agents").then(r => r.json()).then(d => setRuns(Array.isArray(d) ? d.slice(0, 10) : []))
    } catch (e) { console.error(e) }
    setLoading(null)
  }

  const agents = [
    { id: "dispatcher", name: "Dispatcher Agent", icon: <Map size={20} color="#6366f1"/>, color: "#6366f1", desc: "Handle delivery exceptions and auto-reassign orders", action: () => runAgent("dispatcher", { orderId: selectedOrder, issue: issue || "Driver unreachable" }) },
    { id: "demand", name: "Demand Forecaster", icon: <TrendingUp size={20} color="#10b981"/>, color: "#10b981", desc: "Predict order volumes for next 7 days using AI", action: () => runAgent("demand", { trigger: "manual" }) },
    { id: "maintenance", name: "Maintenance Predictor", icon: <Wrench size={20} color="#f59e0b"/>, color: "#f59e0b", desc: "Predict vehicle maintenance needs before they fail", action: () => runAgent("maintenance", { trigger: "manual" }) },
    { id: "support", name: "Customer Support Agent", icon: <Users size={20} color="#ec4899"/>, color: "#ec4899", desc: "AI-powered customer query resolution", action: () => runAgent("support", { customerMessage: customerMsg || "Where is my order?", orderNumber: orders[0]?.orderNumber }) },
    { id: "route", name: "Route Optimizer", icon: <Map size={20} color="#8b5cf6"/>, color: "#8b5cf6", desc: "Auto-assign pending orders to available vehicles", action: () => runAgent("route", { trigger: "manual" }) },
  ]

  const inp: any = { width: "100%", padding: "9px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, fontSize: 13, color: "#e2e8f0", outline: "none", boxSizing: "border-box", marginBottom: 8 }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}><Sparkles size={20} color="#6366f1"/></div>
        <div><div style={{ fontSize: 18, fontWeight: "700", color: "white" }}>AI Agents</div><div style={{ fontSize: 12, color: "#475569" }}>Powered by Powered by Cloudflare AI — autonomous logistics intelligence</div></div>
      </div>

      {/* Dispatcher inputs */}
      <div style={{ background: "rgba(99,102,241,0.05)", borderRadius: 14, padding: 16, marginBottom: 20, border: "1px solid rgba(99,102,241,0.15)" }}>
        <div style={{ fontSize: 13, fontWeight: "600", color: "#a5b4fc", marginBottom: 10 }}>Dispatcher Agent Inputs</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <select value={selectedOrder} onChange={e => setSelectedOrder(e.target.value)} style={inp}>
            <option value="">Select Order for Dispatcher</option>
            {orders.map((o: any) => <option key={o.id} value={o.id}>{o.orderNumber} - {o.customerName}</option>)}
          </select>
          <input placeholder="Issue description (e.g. Driver unreachable)" value={issue} onChange={e => setIssue(e.target.value)} style={inp}/>
          <input placeholder="Customer message for Support Agent" value={customerMsg} onChange={e => setCustomerMsg(e.target.value)} style={inp}/>
        </div>
      </div>

      {/* Agent cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 16, marginBottom: 24 }}>
        {agents.map(a => (
          <div key={a.id} style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 14, padding: 20, border: "1px solid rgba(99,102,241,0.1)", textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: a.color + "15", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>{a.icon}</div>
            <div style={{ fontSize: 13, fontWeight: "700", color: "white", marginBottom: 6 }}>{a.name}</div>
            <div style={{ fontSize: 11, color: "#475569", marginBottom: 14, lineHeight: 1.5 }}>{a.desc}</div>
            <button onClick={a.action} disabled={loading === a.id} style={{ width: "100%", padding: "8px", background: loading === a.id ? "rgba(99,102,241,0.2)" : "linear-gradient(135deg," + a.color + "," + a.color + "cc)", border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontSize: 12, fontWeight: "600" }}>
              {loading === a.id ? "Running..." : "Run Agent"}
            </button>
          </div>
        ))}
      </div>

      {/* Results */}
      {Object.keys(results).length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 15, fontWeight: "700", color: "white", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}><CheckCircle size={16} color="#10b981"/> Agent Results</div>
          <div style={{ display: "grid", gap: 12 }}>
            {Object.entries(results).map(([agent, result]: any) => (
              <div key={agent} style={{ background: "rgba(16,185,129,0.05)", borderRadius: 12, padding: 16, border: "1px solid rgba(16,185,129,0.15)" }}>
                <div style={{ fontSize: 13, fontWeight: "600", color: "#10b981", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>{agent} Agent Result</div>

                {agent === "demand" && result?.forecast && (
                  <div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, marginBottom: 12 }}>
                      {result.forecast.map((f: any) => (
                        <div key={f.date} style={{ background: "rgba(99,102,241,0.1)", borderRadius: 8, padding: 8, textAlign: "center" }}>
                          <div style={{ fontSize: 10, color: "#475569" }}>{new Date(f.date).toLocaleDateString("en-ZA", { weekday: "short" })}</div>
                          <div style={{ fontSize: 18, fontWeight: "700", color: "#6366f1" }}>{f.expectedOrders}</div>
                          <div style={{ fontSize: 9, color: f.confidence === "HIGH" ? "#10b981" : "#f59e0b" }}>{f.confidence}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{result.insights?.join(" | ")}</div>
                  </div>
                )}

                {agent === "maintenance" && result?.predictions && (
                  <div style={{ display: "grid", gap: 8 }}>
                    {result.predictions.map((p: any) => (
                      <div key={p.vehicleId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(255,255,255,0.02)", borderRadius: 8 }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: "600", color: "white" }}>{p.registration} - {p.component}</div>
                          <div style={{ fontSize: 11, color: "#475569" }}>{p.recommendation}</div>
                        </div>
                        <div style={{ padding: "3px 10px", borderRadius: 10, fontSize: 11, fontWeight: "700", background: p.riskLevel === "HIGH" || p.riskLevel === "CRITICAL" ? "rgba(239,68,68,0.15)" : "rgba(16,185,129,0.15)", color: p.riskLevel === "HIGH" || p.riskLevel === "CRITICAL" ? "#f87171" : "#34d399" }}>{p.riskLevel}</div>
                      </div>
                    ))}
                  </div>
                )}

                {agent === "dispatcher" && result?.aiDecision && (
                  <div style={{ padding: 12, background: "rgba(99,102,241,0.05)", borderRadius: 8 }}>
                    <div style={{ fontSize: 13, color: "#a5b4fc", fontWeight: "600" }}>Action: {result.aiDecision.action}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{result.aiDecision.reason}</div>
                    <div style={{ fontSize: 12, color: "#e2e8f0", marginTop: 8, padding: "8px", background: "rgba(255,255,255,0.03)", borderRadius: 6 }}>Customer message: "{result.aiDecision.customerMessage}"</div>
                    {result.aiDecision.executed && <div style={{ fontSize: 11, color: "#10b981", marginTop: 6 }}>Executed: {result.aiDecision.executed}</div>}
                  </div>
                )}

                {agent === "support" && result?.response && (
                  <div style={{ padding: 12, background: "rgba(99,102,241,0.05)", borderRadius: 8 }}>
                    <div style={{ fontSize: 13, color: "#e2e8f0" }}>{result.response}</div>
                    {result.suggestedActions?.length > 0 && (
                      <div style={{ marginTop: 8 }}>
                        {result.suggestedActions.map((a: string, i: number) => <div key={i} style={{ fontSize: 11, color: "#6366f1", marginTop: 4 }}>• {a}</div>)}
                      </div>
                    )}
                  </div>
                )}

                {agent === "route" && result?.assignments && (
                  <div style={{ display: "grid", gap: 6 }}>
                    {result.assignments.map((a: any, i: number) => (
                      <div key={i} style={{ padding: "8px 12px", background: "rgba(255,255,255,0.02)", borderRadius: 8, display: "flex", justifyContent: "space-between" }}>
                        <div style={{ fontSize: 12, color: "white" }}>{a.registration}</div>
                        <div style={{ fontSize: 11, color: "#6366f1" }}>{a.orders?.length || 0} orders | ~{a.estimatedKm}km</div>
                      </div>
                    ))}
                    <div style={{ fontSize: 11, color: "#64748b" }}>{result.summary}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agent run history */}
      <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(99,102,241,0.1)" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(99,102,241,0.1)", fontSize: 13, fontWeight: "600", color: "white", display: "flex", alignItems: "center", gap: 8 }}>
          <Clock size={14} color="#6366f1"/> Agent Run History ({runs.length})
        </div>
        {runs.length === 0 && <div style={{ padding: 30, textAlign: "center", color: "#334155", fontSize: 13 }}>No agent runs yet. Run an agent above.</div>}
        {runs.map((r: any) => (
          <div key={r.id} style={{ padding: "12px 16px", borderBottom: "1px solid rgba(99,102,241,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: "600", color: "white", textTransform: "capitalize" }}>{r.agentName} Agent</div>
              <div style={{ fontSize: 11, color: "#475569" }}>{new Date(r.startedAt).toLocaleString()}</div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {r.durationMs && <div style={{ fontSize: 11, color: "#475569" }}>{(r.durationMs / 1000).toFixed(1)}s</div>}
              <div style={{ padding: "3px 10px", borderRadius: 10, fontSize: 11, fontWeight: "600", background: r.status === "COMPLETED" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)", color: r.status === "COMPLETED" ? "#34d399" : "#fbbf24" }}>{r.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
