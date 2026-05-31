"use client"
import { Truck } from "lucide-react"

export default function OfflinePage() {
  return (
    <div style={{ minHeight: "100vh", background: "#080d1a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui", color: "white", flexDirection: "column", gap: 20, textAlign: "center", padding: 40 }}>
      <div style={{ width: 80, height: 80, borderRadius: 20, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 40px rgba(99,102,241,0.4)" }}>
        <Truck size={40} color="white" />
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 900, color: "white", letterSpacing: "-1px" }}>You are offline</h1>
      <p style={{ color: "#475569", fontSize: 16, maxWidth: 400, lineHeight: 1.7 }}>FleetMind is running in offline mode. Your data is cached and will sync when you reconnect.</p>
      <button onClick={() => window.location.reload()} style={{ padding: "12px 28px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 10, color: "white", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Try Again</button>
    </div>
  )
}