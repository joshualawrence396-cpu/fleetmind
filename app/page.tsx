"use client"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Truck, Users, Package, BarChart2, MapPin, Zap, Shield, Globe, CheckCircle, Star, ArrowRight, Play, TrendingUp, Cpu, Wifi } from "lucide-react"
import { ChatBot } from "../components/ChatBot"

const TRUCK_IMAGES = [
  "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1920&q=80&auto=format",
  "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1920&q=80&auto=format",
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80&auto=format",
  "https://images.unsplash.com/photo-1570071677470-c04398af73ca?w=1920&q=80&auto=format",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80&auto=format",
]

export default function HomePage() {
  const { status } = useSession()
  const router = useRouter()
  const [scrollY, setScrollY] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [imgIdx, setImgIdx] = useState(0)
  const [fading, setFading] = useState(false)
  const [counts, setCounts] = useState({ fleets: 0, deliveries: 0, saving: 0, rating: 0 })
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => { if (mounted && status === "authenticated") { const t = setTimeout(() => router.push("/dashboard"), 2000); return () => clearTimeout(t) } }, [mounted, status])
  useEffect(() => { const h = () => setScrollY(window.scrollY); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h) }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setFading(true)
      setTimeout(() => { setImgIdx(i => (i + 1) % TRUCK_IMAGES.length); setFading(false) }, 600)
    }, 4500)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const targets = { fleets: 500, deliveries: 50, saving: 35, rating: 49 }
    let step = 0
    const timer = setInterval(() => {
      step++
      const p = 1 - Math.pow(1 - step / 80, 3)
      setCounts({ fleets: Math.round(targets.fleets * p), deliveries: Math.round(targets.deliveries * p), saving: Math.round(targets.saving * p), rating: Math.round(targets.rating * p) })
      if (step >= 80) clearInterval(timer)
    }, 25)
    return () => clearInterval(timer)
  }, [])

  const features = [
    { icon: <Truck size={26} color="#6366f1"/>, title: "Live GPS Fleet Tracking", desc: "Every truck on a live map. Speed alerts, geofencing, route history. Updates every 5 seconds.", color: "#6366f1", badge: "5s refresh" },
    { icon: <Zap size={26} color="#10b981"/>, title: "AI Route Optimization", desc: "OR-Tools VRP assigns 50+ deliveries across your fleet in under 30 seconds. Cut empty km by 35%.", color: "#10b981", badge: "OR-Tools" },
    { icon: <Globe size={26} color="#ec4899"/>, title: "6-Courier Rate Shopping", desc: "Bob Go, Aramex, The Courier Guy, DSV, PUDO, PostNet — get quotes from all and book cheapest in one click.", color: "#ec4899", badge: "R8 saved/parcel" },
    { icon: <Package size={26} color="#f59e0b"/>, title: "Full Warehouse Management", desc: "Zones, bins, stocktakes, inventory movements and barcode scanning. No SAP required.", color: "#f59e0b", badge: "Full WMS" },
    { icon: <Users size={26} color="#8b5cf6"/>, title: "Driver Mobile PWA", desc: "Offline-capable driver app. Pre-trip inspection, POD capture with camera, digital signatures.", color: "#8b5cf6", badge: "Offline" },
    { icon: <Cpu size={26} color="#14b8a6"/>, title: "AI Agents", desc: "Dispatcher, demand forecaster, maintenance predictor, route optimizer and customer support — powered by Cloudflare AI.", color: "#14b8a6", badge: "CF AI" },
  ]

  const plans = [
    { name: "Starter", price: "R1,499", sub: "/vehicle/month", color: "#10b981", features: ["Up to 5 vehicles", "10 drivers", "GPS tracking", "Order management", "Customer portal", "Email support"] },
    { name: "Growth", price: "R1,199", sub: "/vehicle/month", color: "#6366f1", popular: true, features: ["6-25 vehicles", "Unlimited drivers", "AI route optimizer", "Full WMS", "6-courier shopping", "WhatsApp notifications", "Invoice generation", "Driver PWA", "Priority support"] },
    { name: "Enterprise", price: "Custom", sub: "contact us", color: "#ec4899", features: ["Unlimited fleet", "White-label", "Dedicated manager", "Custom integrations", "SLA guarantee", "24/7 support"] },
  ]

  const testimonials = [
    { name: "Sipho Nkosi", role: "Fleet Manager", co: "Cape Town Logistics", init: "SN", color: "#6366f1", text: "FleetMind replaced our WhatsApp dispatching overnight. The AI route optimizer saved us R45,000 in fuel in the first month." },
    { name: "Priya Naidoo", role: "Operations Director", co: "Durban Express Freight", init: "PN", color: "#10b981", text: "The courier rate shopping alone pays for the subscription. We save about R8 per parcel. For 500 parcels a day that adds up fast." },
    { name: "Johan van der Berg", role: "Owner", co: "JHB Fast Freight", init: "JV", color: "#f59e0b", text: "Driver app works offline in areas with bad signal. Our customers love the email delivery updates. POD disputes dropped to zero." },
    { name: "Nomsa Dlamini", role: "Logistics Manager", co: "Makro Distribution", init: "ND", color: "#ec4899", text: "Managing 4 warehouses from one dashboard. The stocktake feature found R120k in inventory variance we never knew about." },
  ]

  const navScrolled = scrollY > 50

  return (
    <div style={{ minHeight: "100vh", background: "#080d1a", fontFamily: "system-ui,-apple-system,sans-serif", color: "#e2e8f0", overflowX: "hidden" }}>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, height: 68, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 60px", background: navScrolled ? "rgba(8,13,26,0.97)" : "transparent", backdropFilter: navScrolled ? "blur(20px)" : "none", borderBottom: navScrolled ? "1px solid rgba(99,102,241,0.1)" : "none", transition: "all 0.3s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 24px rgba(99,102,241,0.45)" }}>
            <Truck size={23} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 19, fontWeight: 900, color: "white", letterSpacing: "-0.5px" }}>FleetMind</div>
            <div style={{ fontSize: 9, color: "#6366f1", fontWeight: 700, letterSpacing: "2px" }}>SA LOGISTICS OS</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {[["Features","#features"],["Pricing","#pricing"],["How it works","#how"],["Testimonials","#testimonials"]].map(([l,h]) => (
            <a key={l} href={h} style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14, fontWeight: 500 }}
              onMouseOver={e => e.currentTarget.style.color="white"} onMouseOut={e => e.currentTarget.style.color="#94a3b8"}>{l}</a>
          ))}
          <a href="/login" style={{ padding: "8px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 8, color: "#a5b4fc", textDecoration: "none", fontSize: 13, fontWeight: 500 }}>Sign In</a>
          <a href="/login" style={{ padding: "9px 22px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 9, color: "white", textDecoration: "none", fontSize: 13, fontWeight: 700, boxShadow: "0 4px 15px rgba(99,102,241,0.4)" }}>Get Started Free</a>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <img src={TRUCK_IMAGES[imgIdx]} alt="Fleet trucks"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: fading ? 0 : 1, transition: "opacity 0.6s ease" }}
          onError={(e: any) => e.currentTarget.style.display = "none"}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(8,13,26,0.92) 0%, rgba(8,13,26,0.65) 60%, rgba(8,13,26,0.97) 100%)" }}></div>
        <div style={{ position: "absolute", top: "20%", left: "5%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 65%)" }}></div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "130px 60px 80px", width: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "55% 45%", gap: 60, alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 20, padding: "6px 16px", fontSize: 12, fontWeight: 700, color: "#a5b4fc", marginBottom: 28 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }}></div>
                New: AI Route Optimizer — 35% fuel savings
                <ArrowRight size={11} />
              </div>
              <h1 style={{ fontSize: 60, fontWeight: 900, color: "white", letterSpacing: "-3px", lineHeight: 1.05, marginBottom: 20 }}>
                Stop Running<br/>Your Fleet on<br/>
                <span style={{ background: "linear-gradient(135deg,#6366f1 0%,#a855f7 40%,#ec4899 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>WhatsApp.</span>
              </h1>
              <p style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.75, marginBottom: 38, maxWidth: 520 }}>
                FleetMind is South Africa's AI-native logistics platform. Live GPS, AI routing, 6-courier rate shopping, full WMS — under R1,200/vehicle/month.
              </p>
              <div style={{ display: "flex", gap: 14, marginBottom: 48 }}>
                <a href="/login" style={{ padding: "15px 34px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 12, color: "white", textDecoration: "none", fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", gap: 9, boxShadow: "0 8px 30px rgba(99,102,241,0.45)" }}>
                  Start Free — 14 Days <ArrowRight size={16} />
                </a>
                <a href="#features" style={{ padding: "15px 28px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, color: "white", textDecoration: "none", fontSize: 15, fontWeight: 500, display: "flex", alignItems: "center", gap: 9 }}>
                  <Play size={15} fill="white" /> See Features
                </a>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={15} color="#f59e0b" fill="#f59e0b"/>)}
                <span style={{ fontSize: 13, color: "#64748b", marginLeft: 8 }}>Trusted by 500+ SA fleet managers</span>
              </div>
            </div>

            {/* Dashboard preview card */}
            <div style={{ position: "relative" }}>
              <div style={{ background: "linear-gradient(135deg,rgba(13,21,38,0.98),rgba(17,24,39,0.98))", borderRadius: 20, padding: 24, border: "1px solid rgba(99,102,241,0.2)", boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(99,102,241,0.08)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "white", display: "flex", alignItems: "center", gap: 8 }}><Truck size={14} color="#6366f1"/> Live Dashboard</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#10b981" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 6px #10b981" }}></div> LIVE
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
                  {[
                    { l: "Vehicles", v: "12", c: "#6366f1", s: "8 on route" },
                    { l: "Drivers", v: "18", c: "#10b981", s: "Active" },
                    { l: "Orders", v: "47", c: "#f59e0b", s: "Today" },
                    { l: "Revenue", v: "R68k", c: "#ec4899", s: "This week" },
                  ].map(s => (
                    <div key={s.l} style={{ background: "rgba(99,102,241,0.07)", borderRadius: 10, padding: "12px 10px", border: "1px solid rgba(99,102,241,0.1)" }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: s.c, letterSpacing: "-0.5px" }}>{s.v}</div>
                      <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{s.l}</div>
                      <div style={{ fontSize: 9, color: "#334155", marginTop: 1 }}>{s.s}</div>
                    </div>
                  ))}
                </div>
                <div style={{ borderRadius: 10, overflow: "hidden", marginBottom: 12, height: 100, position: "relative", background: "#0d1526" }}>
                  <img src={TRUCK_IMAGES[(imgIdx + 1) % TRUCK_IMAGES.length]} alt="fleet" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }} onError={(e: any) => e.currentTarget.style.display="none"}/>
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(8,13,26,0.9) 100%)" }}></div>
                  <div style={{ position: "absolute", bottom: 10, left: 12, display: "flex", alignItems: "center", gap: 6 }}>
                    {[1,2,3,4].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: ["#6366f1","#10b981","#6366f1","#f59e0b"][i-1], border: "2px solid white", boxShadow: `0 0 8px ${["#6366f1","#10b981","#6366f1","#f59e0b"][i-1]}` }}></div>)}
                    <span style={{ fontSize: 10, color: "white", fontWeight: 600 }}>4 trucks tracked live</span>
                  </div>
                </div>
                {[
                  { text: "CA 234-456 completed delivery — Somerset West", time: "2m ago", c: "#10b981" },
                  { text: "ORD-1847 assigned to Sipho — en route", time: "5m ago", c: "#6366f1" },
                  { text: "Fuel alert: CA 890-123 at 12% remaining", time: "9m ago", c: "#f59e0b" },
                ].map((item,i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: i<2 ? "1px solid rgba(99,102,241,0.06)" : "none" }}>
                    <div style={{ fontSize: 11, color: "#94a3b8", display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: item.c, flexShrink: 0 }}></div>
                      {item.text}
                    </div>
                    <div style={{ fontSize: 10, color: "#334155", whiteSpace: "nowrap", marginLeft: 8 }}>{item.time}</div>
                  </div>
                ))}
              </div>
              <div style={{ position: "absolute", top: -14, right: -14, background: "linear-gradient(135deg,#10b981,#059669)", borderRadius: 12, padding: "8px 14px", fontSize: 12, fontWeight: 700, color: "white", boxShadow: "0 8px 20px rgba(16,185,129,0.4)" }}>R45k saved/month</div>
              <div style={{ position: "absolute", bottom: -14, left: -14, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 12, padding: "8px 14px", fontSize: 12, fontWeight: 700, color: "white", boxShadow: "0 8px 20px rgba(99,102,241,0.4)" }}>47 deliveries today</div>

              {/* Image dots */}
              <div style={{ display: "flex", gap: 5, justifyContent: "center", marginTop: 28 }}>
                {TRUCK_IMAGES.map((_,i) => (
                  <div key={i} onClick={() => setImgIdx(i)} style={{ width: i===imgIdx ? 20 : 6, height: 6, borderRadius: 3, background: i===imgIdx ? "#6366f1" : "rgba(255,255,255,0.2)", transition: "all 0.3s", cursor: "pointer" }}></div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", marginTop: 60, background: "rgba(99,102,241,0.07)", borderRadius: 18, border: "1px solid rgba(99,102,241,0.12)", overflow: "hidden" }}>
            {[
              { v: counts.fleets+"+", l: "Fleets Managed", i: <Truck size={18} color="#6366f1"/> },
              { v: counts.deliveries+"k+", l: "Daily Deliveries", i: <Package size={18} color="#10b981"/> },
              { v: counts.saving+"%", l: "Avg Fuel Saving", i: <TrendingUp size={18} color="#f59e0b"/> },
              { v: (counts.rating/10).toFixed(1)+"/5", l: "Customer Rating", i: <Star size={18} color="#ec4899" fill="#ec4899"/> },
            ].map((s,i) => (
              <div key={s.l} style={{ padding: "28px 20px", textAlign: "center", borderRight: i<3 ? "1px solid rgba(99,102,241,0.1)" : "none" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>{s.i}</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: "white", letterSpacing: "-1.5px", lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: 12, color: "#475569", marginTop: 6 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div id="features" style={{ padding: "100px 60px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#6366f1", letterSpacing: "2px", marginBottom: 14 }}>PLATFORM CAPABILITIES</div>
          <h2 style={{ fontSize: 44, fontWeight: 900, color: "white", letterSpacing: "-2px", marginBottom: 14 }}>WMS + TMS + AI in one platform</h2>
          <p style={{ fontSize: 16, color: "#64748b", maxWidth: 520, margin: "0 auto" }}>Everything a South African logistics business needs. One dashboard, zero integration headaches.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}>
          {features.map((f,i) => (
            <div key={f.title} onClick={() => setActiveFeature(i)}
              style={{ background: activeFeature===i ? "linear-gradient(135deg,"+f.color+"12,"+f.color+"04)" : "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 18, padding: 28, border: activeFeature===i ? "1px solid "+f.color+"40" : "1px solid rgba(99,102,241,0.1)", cursor: "pointer", transition: "all 0.25s", transform: activeFeature===i ? "translateY(-4px)" : "none", boxShadow: activeFeature===i ? "0 20px 50px "+f.color+"12" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: f.color+"15", display: "flex", alignItems: "center", justifyContent: "center" }}>{f.icon}</div>
                <div style={{ padding: "4px 12px", borderRadius: 20, background: f.color+"15", fontSize: 11, fontWeight: 700, color: f.color }}>{f.badge}</div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 10 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div id="how" style={{ padding: "80px 60px", background: "rgba(99,102,241,0.03)", borderTop: "1px solid rgba(99,102,241,0.08)", borderBottom: "1px solid rgba(99,102,241,0.08)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#6366f1", letterSpacing: "2px", marginBottom: 14 }}>QUICK START</div>
            <h2 style={{ fontSize: 40, fontWeight: 900, color: "white", letterSpacing: "-2px" }}>Live in 10 minutes. No IT team needed.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 28, position: "relative" }}>
            {[
              { n: "01", t: "Create account", d: "Email signup. No credit card. 14-day free trial starts immediately.", icon: "👤" },
              { n: "02", t: "Add your fleet", d: "Add vehicles and drivers with GPS coordinates. Import from CSV or manually.", icon: "🚛" },
              { n: "03", t: "Create orders", d: "Add deliveries or connect your Shopify/WooCommerce store via API.", icon: "📦" },
              { n: "04", t: "Let AI do the rest", d: "Route optimizer assigns drivers. Email updates fire automatically.", icon: "🤖" },
            ].map((s,i) => (
              <div key={s.n} style={{ textAlign: "center", position: "relative" }}>
                {i<3 && <div style={{ position: "absolute", top: 60, left: "65%", right: "-40%", height: 2, background: "linear-gradient(90deg,rgba(99,102,241,0.4),transparent)" }}></div>}
                <div style={{ fontSize: 36, marginBottom: 14 }}>{s.icon}</div>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: 15, fontWeight: 900, color: "white", position: "relative", zIndex: 1, boxShadow: "0 0 24px rgba(99,102,241,0.35)" }}>{s.n}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 10 }}>{s.t}</div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div id="pricing" style={{ padding: "100px 60px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#6366f1", letterSpacing: "2px", marginBottom: 14 }}>TRANSPARENT PRICING</div>
          <h2 style={{ fontSize: 44, fontWeight: 900, color: "white", letterSpacing: "-2px", marginBottom: 14 }}>Pay per vehicle. Not per feature.</h2>
          <p style={{ fontSize: 16, color: "#64748b" }}>14-day free trial. No credit card. Cancel anytime.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, alignItems: "stretch" }}>
          {plans.map(plan => (
            <div key={plan.name} style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 22, padding: 34, border: (plan as any).popular ? "2px solid "+plan.color : "1px solid rgba(99,102,241,0.12)", position: "relative", boxShadow: (plan as any).popular ? "0 0 80px "+plan.color+"18" : "none", display: "flex", flexDirection: "column" }}>
              {(plan as any).popular && <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 20, padding: "4px 22px", fontSize: 11, fontWeight: 700, color: "white", whiteSpace: "nowrap" }}>MOST POPULAR</div>}
              <div style={{ fontSize: 11, color: "#475569", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 }}>{plan.name}</div>
              <div style={{ fontSize: 40, fontWeight: 900, color: plan.color, letterSpacing: "-1px", marginBottom: 4 }}>{plan.price}</div>
              <div style={{ fontSize: 13, color: "#475569", marginBottom: 24 }}>{plan.sub}</div>
              <a href="/login" style={{ display: "block", padding: "13px", background: (plan as any).popular ? "linear-gradient(135deg,"+plan.color+","+plan.color+"dd)" : "rgba(255,255,255,0.04)", border: (plan as any).popular ? "none" : "1px solid "+plan.color+"30", borderRadius: 12, color: (plan as any).popular ? "white" : plan.color, textDecoration: "none", fontSize: 14, fontWeight: 700, textAlign: "center", marginBottom: 28 }}>
                {plan.price === "Custom" ? "Contact Sales →" : "Start Free Trial →"}
              </a>
              <div style={{ borderTop: "1px solid rgba(99,102,241,0.08)", paddingTop: 22, flex: 1 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <CheckCircle size={13} color={plan.color} style={{ flexShrink: 0 }}/>
                    <span style={{ fontSize: 13, color: "#94a3b8" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div id="testimonials" style={{ padding: "80px 60px", background: "rgba(99,102,241,0.03)", borderTop: "1px solid rgba(99,102,241,0.08)", borderBottom: "1px solid rgba(99,102,241,0.08)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#6366f1", letterSpacing: "2px", marginBottom: 14 }}>CUSTOMER STORIES</div>
            <h2 style={{ fontSize: 40, fontWeight: 900, color: "white", letterSpacing: "-2px" }}>Real results from SA fleet managers</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20 }}>
            {testimonials.map(t => (
              <div key={t.name} style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 18, padding: 28, border: "1px solid rgba(99,102,241,0.1)" }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} color="#f59e0b" fill="#f59e0b"/>)}
                </div>
                <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.8, marginBottom: 24, fontStyle: "italic" }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,"+t.color+","+t.color+"88)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "white" }}>{t.init}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "white" }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "#475569" }}>{t.role} — {t.co}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: "100px 60px", maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
        <div style={{ position: "relative", borderRadius: 28, overflow: "hidden" }}>
          <img src={TRUCK_IMAGES[imgIdx]} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.12 }} onError={(e: any) => e.currentTarget.style.display="none"}/>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#1e1b4b,#312e81 30%,#4f46e5 60%,#7c3aed 80%,#be185d 100%)", opacity: 0.95 }}></div>
          <div style={{ position: "relative", zIndex: 1, padding: "72px 60px" }}>
            <h2 style={{ fontSize: 50, fontWeight: 900, color: "white", letterSpacing: "-2.5px", marginBottom: 18, lineHeight: 1.1 }}>Ready to run a world-class fleet?</h2>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,0.72)", maxWidth: 500, margin: "0 auto 40px", lineHeight: 1.7 }}>Join 500+ South African fleet managers who replaced spreadsheets with FleetMind.</p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", marginBottom: 28 }}>
              <a href="/login" style={{ padding: "16px 42px", background: "white", borderRadius: 14, color: "#4f46e5", textDecoration: "none", fontSize: 16, fontWeight: 800, display: "flex", alignItems: "center", gap: 10 }}>
                Start Free Trial <ArrowRight size={18}/>
              </a>
              <a href="mailto:sales@fleetmind.co.za" style={{ padding: "16px 36px", background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.25)", borderRadius: 14, color: "white", textDecoration: "none", fontSize: 16, fontWeight: 600 }}>
                Talk to Sales
              </a>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap" }}>
              {["No credit card","14-day free trial","Cancel anytime","SA data hosting"].map(t => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
                  <CheckCircle size={12} color="rgba(255,255,255,0.55)"/> {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: "1px solid rgba(99,102,241,0.1)", padding: "48px 60px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}><Truck size={20} color="white"/></div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "white" }}>FleetMind</div>
              </div>
              <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.7, maxWidth: 280, marginBottom: 16 }}>The AI-native logistics OS for South African fleet operators.</p>
              <div style={{ display: "flex", gap: 8 }}>
                {["Proudly SA","POPIA Compliant","SOC 2"].map(b => (
                  <div key={b} style={{ padding: "4px 10px", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 6, fontSize: 10, color: "#6366f1", fontWeight: 600 }}>{b}</div>
                ))}
              </div>
            </div>
            {[
              { t: "Product", l: [["Features","#features"],["Pricing","#pricing"],["Track Order","/track"],["Sign In","/login"]] },
              { t: "Company", l: [["About","#"],["Careers","#"],["Contact","mailto:hello@fleetmind.co.za"],["Blog","#"]] },
              { t: "Legal", l: [["Privacy","#"],["Terms","#"],["POPIA","#"],["Security","#"]] },
            ].map(col => (
              <div key={col.t}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#334155", letterSpacing: "1.5px", marginBottom: 14 }}>{col.t.toUpperCase()}</div>
                {col.l.map(([label,href]) => (
                  <a key={label} href={href} style={{ display: "block", color: "#334155", textDecoration: "none", fontSize: 13, marginBottom: 10 }}
                    onMouseOver={e => e.currentTarget.style.color="#a5b4fc"} onMouseOut={e => e.currentTarget.style.color="#334155"}>{label}</a>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(99,102,241,0.08)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <div style={{ fontSize: 12, color: "#1e293b" }}>2026 FleetMind (Pty) Ltd. Registered in South Africa.</div>
            <div style={{ fontSize: 12, color: "#1e293b" }}>Built with love in Cape Town</div>
          </div>
        </div>
      </div>

      <ChatBot context="sales" />
    </div>
  )
}
