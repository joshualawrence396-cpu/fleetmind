"use client"
import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Truck, Mail, Lock, User, Building, Phone, Eye, EyeOff, CheckCircle, ArrowRight, Shield, Zap, Globe } from "lucide-react"

const TRUCK_IMAGES = [
  "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1400&q=80&auto=format",
  "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1400&q=80&auto=format",
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1400&q=80&auto=format",
  "https://images.unsplash.com/photo-1570071677470-c04398af73ca?w=1400&q=80&auto=format",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80&auto=format",
  "https://images.unsplash.com/photo-1496144300411-8dd31ce145ba?w=1400&q=80&auto=format",
]

const COURIERS = [
  { name: "Bob Go", color: "#6366f1", desc: "Multi-courier aggregator" },
  { name: "Aramex", color: "#f97316", desc: "International express" },
  { name: "The Courier Guy", color: "#10b981", desc: "SA nationwide delivery" },
  { name: "DSV", color: "#3b82f6", desc: "Global logistics" },
  { name: "PUDO Lockers", color: "#8b5cf6", desc: "Locker network SA" },
  { name: "PostNet", color: "#ec4899", desc: "SA counter network" },
]

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState("signin")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [step, setStep] = useState(1)
  const [imgIdx, setImgIdx] = useState(0)
  const [fading, setFading] = useState(false)
  const [signInForm, setSignInForm] = useState({ email: "", password: "" })
  const [signUpForm, setSignUpForm] = useState({ name: "", email: "", password: "", confirmPassword: "", company: "", phone: "", plan: "Growth", agreeTerms: false })

  // Slideshow
  useEffect(() => {
    const t = setInterval(() => {
      setFading(true)
      setTimeout(() => { setImgIdx(i => (i + 1) % TRUCK_IMAGES.length); setFading(false) }, 600)
    }, 4000)
    return () => clearInterval(t)
  }, [])

  const handleSignIn = async (e: any) => {
    e.preventDefault()
    setLoading(true); setError("")
    const result = await signIn("credentials", { email: signInForm.email, password: signInForm.password, redirect: false })
    if (result?.error) { setError("Invalid email or password"); setLoading(false) }
    else router.push("/dashboard")
  }

  const handleSignUp = async (e: any) => {
    e.preventDefault()
    if (step === 1) { setStep(2); return }
    if (signUpForm.password !== signUpForm.confirmPassword) { setError("Passwords do not match"); return }
    if (!signUpForm.agreeTerms) { setError("Please agree to the terms"); return }
    if (signUpForm.password.length < 8) { setError("Password must be at least 8 characters"); return }
    setLoading(true); setError("")
    const res = await fetch("/api/auth/register", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: signUpForm.name, email: signUpForm.email, password: signUpForm.password, company: signUpForm.company, plan: signUpForm.plan, phone: signUpForm.phone })
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || "Registration failed"); setLoading(false); return }
    const result = await signIn("credentials", { email: signUpForm.email, password: signUpForm.password, redirect: false })
    if (result?.ok) {
      if (signUpForm.plan !== "Starter" || true) {
        // Redirect to PayFast for all paid plans
        const pfRes = await fetch("/api/payfast/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan: signUpForm.plan, email: signUpForm.email, name: signUpForm.name, userId: data.user?.id || "" }) })
        const pfData = await pfRes.json()
        if (pfData.url) { window.location.href = pfData.url; return }
      }
      router.push("/dashboard")
    } else { setSuccess("Account created! Please sign in."); setMode("signin"); setLoading(false) }
  }

  const inp = (icon: any, placeholder: string, type: string, value: string, onChange: any, extra: any = {}) => (
    <div style={{ position: "relative", marginBottom: 12 }}>
      <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#6366f1", zIndex: 1 }}>{icon}</div>
      <input type={type} placeholder={placeholder} value={value} onChange={onChange}
        style={{ width: "100%", padding: "13px 14px 13px 44px", background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 12, fontSize: 14, color: "#e2e8f0", outline: "none", boxSizing: "border-box" as const, fontFamily: "system-ui", transition: "all 0.2s" }}
        onFocus={(e: any) => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.background = "rgba(99,102,241,0.1)" }}
        onBlur={(e: any) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)"; e.currentTarget.style.background = "rgba(99,102,241,0.06)" }}
        {...extra} />
    </div>
  )

  const plans = [
    { id: "Starter", price: "R1,499", color: "#10b981", features: ["5 vehicles", "10 drivers", "GPS tracking"] },
    { id: "Growth", price: "R1,199", color: "#6366f1", features: ["25 vehicles", "All features", "AI routing"], popular: true },
    { id: "Enterprise", price: "Custom", color: "#ec4899", features: ["Unlimited", "White-label", "24/7 support"] },
  ]

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "system-ui,-apple-system,sans-serif", background: "#080d1a" }}>

      {/* LEFT - Truck slideshow */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>

        {/* Background images slideshow */}
        <img
          key={imgIdx}
          src={TRUCK_IMAGES[imgIdx]}
          alt="Fleet"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: fading ? 0 : 1, transition: "opacity 0.6s ease" }}
          onError={(e: any) => e.currentTarget.style.display = "none"}
        />

        {/* Dark overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(8,13,26,0.85) 0%, rgba(8,13,26,0.5) 50%, rgba(8,13,26,0.9) 100%)" }}></div>

        {/* Purple glow */}
        <div style={{ position: "absolute", bottom: "20%", left: "10%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)" }}></div>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%", padding: "48px 56px" }}>

          {/* Logo */}
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", marginBottom: "auto" }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 30px rgba(99,102,241,0.5)" }}>
              <Truck size={26} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "white", letterSpacing: "-0.5px" }}>FleetMind</div>
              <div style={{ fontSize: 10, color: "#6366f1", fontWeight: 700, letterSpacing: "2px" }}>SA LOGISTICS OS</div>
            </div>
          </a>

          {/* Main text */}
          <div style={{ marginBottom: 40 }}>
            <h1 style={{ fontSize: 52, fontWeight: 900, color: "white", letterSpacing: "-2.5px", lineHeight: 1.05, marginBottom: 16 }}>
              Your Fleet.<br/>
              <span style={{ background: "linear-gradient(135deg,#6366f1,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Your Control.</span>
            </h1>
            <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 400, lineHeight: 1.75 }}>
              South Africa's AI-native logistics platform. Live GPS, AI routing, and full WMS — all under R1,200/vehicle/month.
            </p>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 32, marginBottom: 36 }}>
            {[
              { icon: <Truck size={16} color="#6366f1"/>, v: "500+", l: "Fleets" },
              { icon: <Zap size={16} color="#10b981"/>, v: "35%", l: "Fuel saved" },
              { icon: <Globe size={16} color="#f59e0b"/>, v: "6", l: "Couriers" },
              { icon: <Shield size={16} color="#ec4899"/>, v: "99.9%", l: "Uptime" },
            ].map(s => (
              <div key={s.l} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "white", lineHeight: 1 }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: "#475569" }}>{s.l}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Courier partners */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#334155", letterSpacing: "1.5px", marginBottom: 12 }}>COURIER PARTNERS</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {COURIERS.map(c => (
                <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "5px 12px", backdropFilter: "blur(10px)" }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: c.color, boxShadow: `0 0 6px ${c.color}` }}></div>
                  <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image dots */}
          <div style={{ display: "flex", gap: 6, marginTop: 24 }}>
            {TRUCK_IMAGES.map((_,i) => (
              <div key={i} onClick={() => setImgIdx(i)}
                style={{ width: i === imgIdx ? 24 : 6, height: 6, borderRadius: 3, background: i === imgIdx ? "#6366f1" : "rgba(255,255,255,0.2)", transition: "all 0.3s", cursor: "pointer" }}></div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT - Auth form */}
      <div style={{ width: 460, background: "linear-gradient(180deg,#0d1526 0%,#080d1a 100%)", borderLeft: "1px solid rgba(99,102,241,0.12)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 44px", overflowY: "auto" }}>

        {/* Mode tabs */}
        <div style={{ display: "flex", background: "rgba(99,102,241,0.07)", borderRadius: 14, padding: 4, marginBottom: 32, border: "1px solid rgba(99,102,241,0.15)" }}>
          {[{ id: "signin", label: "Sign In" }, { id: "signup", label: "Create Account" }].map(t => (
            <button key={t.id} type="button" onClick={() => { setMode(t.id); setStep(1); setError(""); setSuccess("") }}
              style={{ flex: 1, padding: "11px", borderRadius: 11, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, background: mode === t.id ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "transparent", color: mode === t.id ? "white" : "#475569", transition: "all 0.25s", boxShadow: mode === t.id ? "0 4px 15px rgba(99,102,241,0.35)" : "none" }}>
              {t.label}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", padding: "12px 16px", borderRadius: 12, marginBottom: 20, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399", padding: "12px 16px", borderRadius: 12, marginBottom: 20, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircle size={14}/> {success}
          </div>
        )}

        {/* SIGN IN */}
        {mode === "signin" && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 26, fontWeight: 900, color: "white", marginBottom: 6, letterSpacing: "-0.5px" }}>Welcome back</h2>
              <p style={{ color: "#475569", fontSize: 14 }}>Sign in to your FleetMind account</p>
            </div>
            <form onSubmit={handleSignIn}>
              {inp(<Mail size={16}/>, "Email address", "email", signInForm.email, (e: any) => setSignInForm({...signInForm, email: e.target.value}), { required: true, autoComplete: "email" })}
              <div style={{ position: "relative", marginBottom: 24 }}>
                <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#6366f1" }}><Lock size={16}/></div>
                <input type={showPass ? "text" : "password"} placeholder="Password" value={signInForm.password}
                  onChange={(e: any) => setSignInForm({...signInForm, password: e.target.value})}
                  autoComplete="current-password"
                  style={{ width: "100%", padding: "13px 48px 13px 44px", background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 12, fontSize: 14, color: "#e2e8f0", outline: "none", boxSizing: "border-box" as const, transition: "all 0.2s" }}
                  onFocus={(e: any) => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.background = "rgba(99,102,241,0.1)" }}
                  onBlur={(e: any) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)"; e.currentTarget.style.background = "rgba(99,102,241,0.06)" }}
                  required/>
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#475569", cursor: "pointer", padding: 4 }}>
                  {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
              <button type="submit" disabled={loading}
                style={{ width: "100%", padding: 14, background: loading ? "rgba(99,102,241,0.5)" : "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 12, color: "white", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 8px 25px rgba(99,102,241,0.35)", transition: "all 0.2s" }}>
                {loading ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></div> Signing in...</> : <><span>Sign In</span><ArrowRight size={16}/></>}
              </button>
            </form>
            <div style={{ marginTop: 20, textAlign: "center", fontSize: 13, color: "#334155" }}>
              Don't have an account?{" "}
              <button type="button" onClick={() => { setMode("signup"); setError("") }}
                style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontSize: 13, fontWeight: 600, padding: 0 }}>
                Create one free →
              </button>
            </div>
          </div>
        )}

        {/* SIGN UP */}
        {mode === "signup" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: "white", marginBottom: 6, letterSpacing: "-0.5px" }}>
                {step === 1 ? "Create your account" : "Choose your plan"}
              </h2>
              <p style={{ color: "#475569", fontSize: 13 }}>
                {step === 1 ? "Join 500+ SA fleet managers on FleetMind" : "14-day free trial — no credit card needed"}
              </p>
              <div style={{ display: "flex", gap: 4, marginTop: 14 }}>
                {[1,2].map(s => (
                  <div key={s} style={{ flex: 1, height: 3, borderRadius: 3, background: s <= step ? "linear-gradient(90deg,#6366f1,#8b5cf6)" : "rgba(99,102,241,0.12)", transition: "all 0.3s" }}></div>
                ))}
              </div>
            </div>

            {step === 1 && (
              <form onSubmit={handleSignUp}>
                {inp(<User size={16}/>, "Full Name *", "text", signUpForm.name, (e: any) => setSignUpForm({...signUpForm, name: e.target.value}), { required: true, autoComplete: "name" })}
                {inp(<Mail size={16}/>, "Email Address *", "email", signUpForm.email, (e: any) => setSignUpForm({...signUpForm, email: e.target.value}), { required: true, autoComplete: "email" })}
                {inp(<Building size={16}/>, "Company Name", "text", signUpForm.company, (e: any) => setSignUpForm({...signUpForm, company: e.target.value}))}
                {inp(<Phone size={16}/>, "Phone Number", "tel", signUpForm.phone, (e: any) => setSignUpForm({...signUpForm, phone: e.target.value}))}
                <div style={{ position: "relative", marginBottom: 12 }}>
                  <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#6366f1" }}><Lock size={16}/></div>
                  <input type={showPass ? "text" : "password"} placeholder="Password (min 8 chars) *"
                    value={signUpForm.password} onChange={(e: any) => setSignUpForm({...signUpForm, password: e.target.value})}
                    autoComplete="new-password"
                    style={{ width: "100%", padding: "13px 48px 13px 44px", background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 12, fontSize: 14, color: "#e2e8f0", outline: "none", boxSizing: "border-box" as const }} required/>
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#475569", cursor: "pointer", padding: 4 }}>
                    {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
                {inp(<Lock size={16}/>, "Confirm Password *", showPass ? "text" : "password", signUpForm.confirmPassword, (e: any) => setSignUpForm({...signUpForm, confirmPassword: e.target.value}), { required: true, autoComplete: "new-password" })}
                <button type="submit"
                  style={{ width: "100%", padding: 14, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 12, color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 8px 25px rgba(99,102,241,0.35)" }}>
                  Next: Choose Plan <ArrowRight size={16}/>
                </button>
                <div style={{ marginTop: 16, textAlign: "center", fontSize: 13, color: "#334155" }}>
                  Already have an account?{" "}
                  <button type="button" onClick={() => { setMode("signin"); setError("") }}
                    style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontSize: 13, fontWeight: 600, padding: 0 }}>
                    Sign in →
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleSignUp}>
                <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
                  {plans.map(p => (
                    <div key={p.id} onClick={() => setSignUpForm({...signUpForm, plan: p.id})}
                      style={{ padding: 16, borderRadius: 14, border: signUpForm.plan === p.id ? "2px solid "+p.color : "1px solid rgba(99,102,241,0.12)", cursor: "pointer", background: signUpForm.plan === p.id ? p.color+"10" : "rgba(255,255,255,0.02)", position: "relative", transition: "all 0.2s" }}>
                      {(p as any).popular && <div style={{ position: "absolute", top: -10, right: 14, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 20, padding: "3px 12px", fontSize: 10, fontWeight: 700, color: "white" }}>POPULAR</div>}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "white" }}>{p.id}</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: p.color }}>{p.price}<span style={{ fontSize: 11, color: "#475569" }}>/vehicle</span></div>
                      </div>
                      <div style={{ display: "flex", gap: 12 }}>
                        {p.features.map(f => (
                          <span key={f} style={{ fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}>
                            <CheckCircle size={9} color={p.color}/> {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20, cursor: "pointer" }}>
                  <input type="checkbox" checked={signUpForm.agreeTerms}
                    onChange={(e: any) => setSignUpForm({...signUpForm, agreeTerms: e.target.checked})}
                    style={{ marginTop: 3, accentColor: "#6366f1", width: 16, height: 16 }}/>
                  <span style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
                    I agree to the <a href="/terms" style={{ color: "#6366f1" }}>Terms of Service</a> and <a href="/privacy" style={{ color: "#6366f1" }}>Privacy Policy</a>. 14-day free trial, cancel anytime.
                  </span>
                </label>

                <div style={{ display: "flex", gap: 10 }}>
                  <button type="button" onClick={() => setStep(1)}
                    style={{ flex: 1, padding: 13, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#94a3b8", cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
                    ← Back
                  </button>
                  <button type="submit" disabled={loading}
                    style={{ flex: 2, padding: 13, background: loading ? "rgba(99,102,241,0.5)" : "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 12, color: "white", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    {loading ? "Creating account..." : <><span>Create Account</span><ArrowRight size={15}/></>}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(99,102,241,0.08)", display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
          {[["Pricing", "/pricing"], ["Track Order", "/track"], ["Home", "/"]].map(([l, h]) => (
            <a key={l} href={h} style={{ color: "#334155", textDecoration: "none", fontSize: 12, transition: "color 0.2s" }}
              onMouseOver={(e: any) => e.currentTarget.style.color = "#6366f1"}
              onMouseOut={(e: any) => e.currentTarget.style.color = "#334155"}>
              {l}
            </a>
          ))}
        </div>
        <div style={{ marginTop: 12, textAlign: "center", fontSize: 11, color: "#1e293b" }}>
          FleetMind SA 2026 — Built in Cape Town 🇿🇦
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}