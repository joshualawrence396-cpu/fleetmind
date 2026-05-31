"use client"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { CheckCircle, Truck, Zap } from "lucide-react"

const PLANS = [
  { name: "Starter", price: 1499, vehicles: 5, color: "#10b981", features: ["Up to 5 vehicles","10 drivers","Live GPS","Orders","Customer portal","Email support"] },
  { name: "Growth", price: 1199, vehicles: 25, color: "#6366f1", popular: true, features: ["6–25 vehicles","Unlimited drivers","AI routing","Full WMS","6 couriers","WhatsApp SMS","Invoices","Driver PWA","Priority support"] },
  { name: "Enterprise", price: 0, vehicles: 999, color: "#ec4899", features: ["Unlimited fleet","White-label","Dedicated manager","Custom integrations","SLA guarantee","24/7 support"] },
]

export default function PricingPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState<string | null>(null)
  const [vehicles, setVehicles] = useState(10)

  const checkout = async (plan: string) => {
    if (plan === "Enterprise") { window.location.href = "mailto:sales@fleetmind.co.za?subject=Enterprise Inquiry"; return }
    setLoading(plan)
    const res = await fetch("/api/payfast/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, email: (session?.user as any)?.email || "", name: session?.user?.name || "", userId: (session?.user as any)?.id || "", vehicles })
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    setLoading(null)
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080d1a", fontFamily: "system-ui,sans-serif", color: "#e2e8f0" }}>
      <nav style={{ padding: "20px 60px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(99,102,241,0.1)" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}><Truck size={20} color="white"/></div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "white" }}>FleetMind</div>
        </a>
        <a href="/login" style={{ padding: "8px 18px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 8, color: "white", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>Get Started</a>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#6366f1", letterSpacing: "2px", marginBottom: 14 }}>SIMPLE PRICING</div>
          <h1 style={{ fontSize: 48, fontWeight: 900, color: "white", letterSpacing: "-2px", marginBottom: 14 }}>Pay per vehicle, not per feature</h1>
          <p style={{ fontSize: 16, color: "#64748b", marginBottom: 32 }}>14-day free trial. No credit card. Powered by PayFast — South Africa's trusted payment gateway.</p>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 16, background: "rgba(99,102,241,0.08)", borderRadius: 14, padding: "14px 24px", border: "1px solid rgba(99,102,241,0.15)" }}>
            <span style={{ fontSize: 14, color: "#94a3b8" }}>How many vehicles?</span>
            <input type="range" min={1} max={100} value={vehicles} onChange={e => setVehicles(parseInt(e.target.value))} style={{ width: 160, accentColor: "#6366f1" }}/>
            <span style={{ fontSize: 18, fontWeight: 800, color: "white", minWidth: 40 }}>{vehicles}</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, marginBottom: 48 }}>
          {PLANS.map(plan => {
            const monthly = plan.price === 0 ? "Custom" : "R" + (plan.price * Math.min(vehicles, plan.vehicles)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            return (
              <div key={plan.name} style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 22, padding: 32, border: plan.popular ? "2px solid "+plan.color : "1px solid rgba(99,102,241,0.12)", position: "relative", boxShadow: plan.popular ? "0 0 60px "+plan.color+"15" : "none", display: "flex", flexDirection: "column" }}>
                {plan.popular && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 20, padding: "4px 20px", fontSize: 11, fontWeight: 700, color: "white", whiteSpace: "nowrap" }}>MOST POPULAR</div>}
                <div style={{ fontSize: 11, color: "#475569", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>{plan.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                  <span style={{ fontSize: 40, fontWeight: 900, color: plan.color }}>{plan.price > 0 ? "R"+plan.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",") : "Custom"}</span>
                  {plan.price > 0 && <span style={{ fontSize: 13, color: "#475569" }}>/vehicle/mo</span>}
                </div>
                {plan.price > 0 && vehicles > 0 && (
                  <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 4 }}>= <strong style={{ color: "white" }}>{monthly}</strong>/month total</div>
                )}
                <div style={{ fontSize: 12, color: "#334155", marginBottom: 22 }}>Up to {plan.vehicles < 999 ? plan.vehicles + " vehicles" : "unlimited"}</div>

                <button onClick={() => checkout(plan.name)} disabled={loading === plan.name}
                  style={{ padding: "13px", background: plan.popular ? "linear-gradient(135deg,"+plan.color+","+plan.color+"cc)" : "rgba(255,255,255,0.04)", border: plan.popular ? "none" : "1px solid "+plan.color+"30", borderRadius: 12, color: plan.popular ? "white" : plan.color, cursor: "pointer", fontSize: 14, fontWeight: 700, marginBottom: 28, boxShadow: plan.popular ? "0 8px 25px "+plan.color+"30" : "none" }}>
                  {loading === plan.name ? "Redirecting to PayFast..." : plan.price === 0 ? "Talk to Sales →" : "Start Free Trial →"}
                </button>

                <div style={{ borderTop: "1px solid rgba(99,102,241,0.08)", paddingTop: 20, flex: 1 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
                      <CheckCircle size={13} color={plan.color} style={{ flexShrink: 0 }}/>
                      <span style={{ fontSize: 13, color: "#94a3b8" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14, padding: "8px", background: "rgba(255,255,255,0.02)", borderRadius: 8, fontSize: 11, color: "#334155", textAlign: "center" }}>+R1.50 per courier shipment</div>
              </div>
            )
          })}
        </div>

        <div style={{ textAlign: "center", padding: "24px", background: "rgba(99,102,241,0.05)", borderRadius: 16, border: "1px solid rgba(99,102,241,0.12)" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Zap size={16} color="#6366f1"/> Payments powered by PayFast — South Africa
          </div>
          <div style={{ fontSize: 13, color: "#475569" }}>Credit card • EFT • Instant EFT • SnapScan • Mobicred • All major SA banks</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 12 }}>
            {["PCI DSS Compliant","256-bit SSL","SA Rand (ZAR)","No USD conversions"].map(b => (
              <div key={b} style={{ fontSize: 11, color: "#6366f1", display: "flex", alignItems: "center", gap: 4 }}><CheckCircle size={10} color="#6366f1"/> {b}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}