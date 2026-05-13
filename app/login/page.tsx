"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Truck, Mail, Lock, User, Building, Phone, Eye, EyeOff, CheckCircle, ArrowRight, Chrome } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState("signin")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [step, setStep] = useState(1)

  const [signInForm, setSignInForm] = useState({ email: "", password: "" })
  const [signUpForm, setSignUpForm] = useState({ name: "", email: "", password: "", confirmPassword: "", company: "", phone: "", plan: "Pro", agreeTerms: false })

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true); setError("")
    try {
      const result = await signIn("credentials", {
        email: signInForm.email,
        password: signInForm.password,
        redirect: false
      })
      if (result?.error) {
        setError("Invalid email or password. Please try again.")
      } else {
        router.push("/")
        router.refresh()
      }
    } catch { setError("Network error. Please try again.") }
    setLoading(false)
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    if (step === 1) { setStep(2); return }
    setLoading(true); setError("")
    if (signUpForm.password !== signUpForm.confirmPassword) {
      setError("Passwords do not match"); setLoading(false); return
    }
    if (!signUpForm.agreeTerms) {
      setError("Please agree to the terms"); setLoading(false); return
    }
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: signUpForm.name, email: signUpForm.email, password: signUpForm.password, company: signUpForm.company, plan: signUpForm.plan, phone: signUpForm.phone })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); setLoading(false); return }
      const result = await signIn("credentials", { email: signUpForm.email, password: signUpForm.password, redirect: false })
      if (result?.ok) { router.push("/"); router.refresh() }
      else setSuccess("Account created! Please sign in.")
    } catch { setError("Registration failed. Please try again.") }
    setLoading(false)
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    await signIn("google", { callbackUrl: "/" })
  }

  const inp = (icon, placeholder, type, value, onChange, extra?: any) => (
    <div style={{ position: "relative", marginBottom: 14 }}>
      <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#475569", zIndex: 1 }}>{icon}</div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ width: "100%", padding: "12px 14px 12px 44px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 10, fontSize: 14, color: "#e2e8f0", outline: "none", boxSizing: "border-box", fontFamily: "system-ui,sans-serif", transition: "border 0.2s" }}
        onFocus={e => e.target.style.border = "1px solid rgba(99,102,241,0.6)"}
        onBlur={e => e.target.style.border = "1px solid rgba(99,102,241,0.25)"}
        {...extra}
      />
    </div>
  )

  const plans = [
    { id: "Basic", price: "R999", color: "#10b981", features: ["5 vehicles", "10 drivers", "Basic tracking"] },
    { id: "Pro", price: "R2,499", color: "#6366f1", features: ["25 vehicles", "Unlimited drivers", "Full features"], popular: true },
    { id: "Enterprise", price: "Custom", color: "#ec4899", features: ["Unlimited all", "White label", "Dedicated support"] },
  ]

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "system-ui,-apple-system,sans-serif", position: "relative", overflow: "hidden", background: "#0a0f1e" }}>

      {/* LEFT SIDE - Truck Background */}
      <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 80px", overflow: "hidden" }}>
        <img src="/login-bg.svg" alt="Fleet" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center bottom" }}/>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,15,30,0.3) 0%, rgba(10,15,30,0.7) 100%)" }}></div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 60 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 30px rgba(99,102,241,0.5)" }}>
              <Truck size={28} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: "900", color: "white", letterSpacing: "-0.5px" }}>FleetMind</div>
              <div style={{ fontSize: 11, color: "#6366f1", fontWeight: "700", letterSpacing: "2px" }}>PRO EDITION</div>
            </div>
          </div>

          <h1 style={{ fontSize: 48, fontWeight: "900", color: "white", letterSpacing: "-2px", lineHeight: 1.1, marginBottom: 20 }}>
            Manage Your<br/>
            <span style={{ background: "linear-gradient(135deg,#6366f1,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Fleet Smarter</span>
          </h1>
          <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 400, lineHeight: 1.7, marginBottom: 48 }}>
            South Africa's most powerful fleet management platform. Track vehicles, manage drivers, and grow your business.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 420 }}>
            {[
              { icon: "🚛", title: "Live GPS Tracking", desc: "Real-time vehicle locations" },
              { icon: "👤", title: "Driver Management", desc: "Assign and monitor drivers" },
              { icon: "📦", title: "Order Dispatch", desc: "Smart order assignment" },
              { icon: "📊", title: "Analytics", desc: "Revenue and cost insights" },
            ].map(f => (
              <div key={f.title} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "14px 16px", border: "1px solid rgba(99,102,241,0.15)", backdropFilter: "blur(10px)" }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{f.icon}</div>
                <div style={{ fontSize: 13, fontWeight: "600", color: "white" }}>{f.title}</div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Auth Form */}
      <div style={{ width: 480, background: "rgba(13,21,38,0.95)", borderLeft: "1px solid rgba(99,102,241,0.15)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 48px", overflowY: "auto", backdropFilter: "blur(20px)" }}>

        {/* Tab switcher */}
        <div style={{ display: "flex", background: "rgba(99,102,241,0.08)", borderRadius: 12, padding: 4, marginBottom: 32, border: "1px solid rgba(99,102,241,0.15)" }}>
          {[{id:"signin",label:"Sign In"},{id:"signup",label:"Create Account"}].map(t => (
            <button key={t.id} onClick={() => { setMode(t.id); setStep(1); setError(""); setSuccess("") }} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14, fontWeight: "600", background: mode === t.id ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "none", color: mode === t.id ? "white" : "#64748b", transition: "all 0.2s" }}>
              {t.label}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", padding: "12px 16px", borderRadius: 10, marginBottom: 20, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
            <span>!</span> {error}
          </div>
        )}

        {success && (
          <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399", padding: "12px 16px", borderRadius: 10, marginBottom: 20, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircle size={14} /> {success}
          </div>
        )}

        {/* SIGN IN */}
        {mode === "signin" && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 26, fontWeight: "800", color: "white", marginBottom: 6 }}>Welcome back</h2>
              <p style={{ color: "#475569", fontSize: 14 }}>Sign in to your FleetMind account</p>
            </div>

            <button onClick={handleGoogle} disabled={googleLoading} style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "white", cursor: "pointer", fontSize: 14, fontWeight: "500", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 20, transition: "all 0.2s" }}
              onMouseOver={e => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
              onMouseOut={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}>
              <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"/><path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z"/></svg>
              {googleLoading ? "Redirecting..." : "Continue with Google"}
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: "rgba(99,102,241,0.15)" }}></div>
              <span style={{ color: "#334155", fontSize: 12 }}>or sign in with email</span>
              <div style={{ flex: 1, height: 1, background: "rgba(99,102,241,0.15)" }}></div>
            </div>

            <form onSubmit={handleSignIn}>
              {inp(<Mail size={16}/>, "Email address", "email", signInForm.email, e => setSignInForm({...signInForm, email: e.target.value}), { required: true })}
              <div style={{ position: "relative", marginBottom: 20 }}>
                <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#475569" }}><Lock size={16}/></div>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  value={signInForm.password}
                  onChange={e => setSignInForm({...signInForm, password: e.target.value})}
                  style={{ width: "100%", padding: "12px 44px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: 10, fontSize: 14, color: "#e2e8f0", outline: "none", boxSizing: "border-box" }}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#475569", cursor: "pointer" }}>
                  {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
              <button type="submit" disabled={loading} style={{ width: "100%", padding: 14, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 10, color: "white", fontSize: 15, fontWeight: "700", cursor: "pointer", boxShadow: "0 8px 30px rgba(99,102,241,0.4)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {loading ? "Signing in..." : <><span>Sign In</span><ArrowRight size={16}/></>}
              </button>
            </form>

            <div style={{ marginTop: 24, padding: "12px 16px", background: "rgba(99,102,241,0.06)", borderRadius: 10, border: "1px solid rgba(99,102,241,0.12)", textAlign: "center" }}>
              <div style={{ fontSize: 12, color: "#475569" }}>Demo account</div>
              <div style={{ fontSize: 13, color: "#a5b4fc", fontWeight: "500" }}>admin@fleetmind.com / admin123</div>
            </div>
          </div>
        )}

        {/* SIGN UP */}
        {mode === "signup" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <h2 style={{ fontSize: 24, fontWeight: "800", color: "white" }}>{step === 1 ? "Create account" : "Choose your plan"}</h2>
              </div>
              <p style={{ color: "#475569", fontSize: 14 }}>{step === 1 ? "Join thousands of SA fleet managers" : "14-day free trial on all plans"}</p>
              <div style={{ display: "flex", gap: 4, marginTop: 16 }}>
                {[1,2].map(s => (
                  <div key={s} style={{ flex: 1, height: 3, borderRadius: 3, background: s <= step ? "linear-gradient(90deg,#6366f1,#8b5cf6)" : "rgba(99,102,241,0.15)", transition: "all 0.3s" }}></div>
                ))}
              </div>
            </div>

            {step === 1 && (
              <>
                <button onClick={handleGoogle} style={{ width: "100%", padding: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "white", cursor: "pointer", fontSize: 14, fontWeight: "500", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 20 }}>
                  <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"/><path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z"/></svg>
                  Sign up with Google
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ flex: 1, height: 1, background: "rgba(99,102,241,0.15)" }}></div>
                  <span style={{ color: "#334155", fontSize: 12 }}>or fill in details</span>
                  <div style={{ flex: 1, height: 1, background: "rgba(99,102,241,0.15)" }}></div>
                </div>
                <form onSubmit={handleSignUp}>
                  {inp(<User size={16}/>, "Full Name *", "text", signUpForm.name, e => setSignUpForm({...signUpForm,name:e.target.value}), {required:true})}
                  {inp(<Mail size={16}/>, "Email Address *", "email", signUpForm.email, e => setSignUpForm({...signUpForm,email:e.target.value}), {required:true})}
                  {inp(<Building size={16}/>, "Company Name", "text", signUpForm.company, e => setSignUpForm({...signUpForm,company:e.target.value}))}
                  {inp(<Phone size={16}/>, "Phone Number", "tel", signUpForm.phone, e => setSignUpForm({...signUpForm,phone:e.target.value}))}
                  <div style={{ position: "relative", marginBottom: 14 }}>
                    <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#475569" }}><Lock size={16}/></div>
                    <input type={showPass?"text":"password"} placeholder="Password (min 8 chars) *" value={signUpForm.password} onChange={e=>setSignUpForm({...signUpForm,password:e.target.value})} style={{ width:"100%",padding:"12px 44px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(99,102,241,0.25)",borderRadius:10,fontSize:14,color:"#e2e8f0",outline:"none",boxSizing:"border-box" as const }} required/>
                    <button type="button" onClick={()=>setShowPass(!showPass)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#475569",cursor:"pointer"}}>{showPass?<EyeOff size={16}/>:<Eye size={16}/>}</button>
                  </div>
                  {inp(<Lock size={16}/>, "Confirm Password *", showPass?"text":"password", signUpForm.confirmPassword, e=>setSignUpForm({...signUpForm,confirmPassword:e.target.value}), {required:true})}
                  <button type="submit" style={{ width:"100%",padding:13,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",border:"none",borderRadius:10,color:"white",fontSize:14,fontWeight:"700",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:"0 8px 30px rgba(99,102,241,0.3)" }}>
                    Next: Choose Plan <ArrowRight size={16}/>
                  </button>
                </form>
              </>
            )}

            {step === 2 && (
              <form onSubmit={handleSignUp}>
                <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
                  {plans.map(p => (
                    <div key={p.id} onClick={() => setSignUpForm({...signUpForm,plan:p.id})} style={{ padding: 16, borderRadius: 12, border: signUpForm.plan===p.id ? "2px solid "+p.color : "1px solid rgba(99,102,241,0.15)", cursor: "pointer", background: signUpForm.plan===p.id ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.02)", position: "relative", transition: "all 0.2s" }}>
                      {p.popular && <div style={{ position:"absolute",top:-10,right:16,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",borderRadius:20,padding:"3px 12px",fontSize:10,fontWeight:"700",color:"white" }}>POPULAR</div>}
                      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
                        <div style={{ fontSize:16,fontWeight:"700",color:"white" }}>{p.id}</div>
                        <div style={{ fontSize:18,fontWeight:"800",color:p.color }}>{p.price}<span style={{ fontSize:11,color:"#475569" }}>/mo</span></div>
                      </div>
                      <div style={{ display:"flex",gap:12,flexWrap:"wrap" }}>
                        {p.features.map(f => <span key={f} style={{ fontSize:11,color:"#64748b",display:"flex",alignItems:"center",gap:4 }}><CheckCircle size={10} color={p.color}/> {f}</span>)}
                      </div>
                      {signUpForm.plan===p.id && <div style={{ position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",width:20,height:20,borderRadius:"50%",background:p.color,display:"flex",alignItems:"center",justifyContent:"center" }}><CheckCircle size={12} color="white"/></div>}
                    </div>
                  ))}
                </div>
                <label style={{ display:"flex",alignItems:"flex-start",gap:10,marginBottom:20,cursor:"pointer" }}>
                  <input type="checkbox" checked={signUpForm.agreeTerms} onChange={e=>setSignUpForm({...signUpForm,agreeTerms:e.target.checked})} style={{ marginTop:2,accentColor:"#6366f1" }}/>
                  <span style={{ fontSize:12,color:"#64748b",lineHeight:1.5 }}>I agree to the <a href="/terms" style={{ color:"#6366f1" }}>Terms of Service</a> and <a href="/privacy" style={{ color:"#6366f1" }}>Privacy Policy</a>. Start 14-day free trial.</span>
                </label>
                <div style={{ display:"flex",gap:10 }}>
                  <button type="button" onClick={()=>setStep(1)} style={{ flex:1,padding:12,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,color:"#94a3b8",cursor:"pointer",fontSize:14 }}>Back</button>
                  <button type="submit" disabled={loading} style={{ flex:2,padding:12,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",border:"none",borderRadius:10,color:"white",fontSize:14,fontWeight:"700",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:"0 8px 30px rgba(99,102,241,0.3)" }}>
                    {loading ? "Creating account..." : <><span>Create Account</span><ArrowRight size={16}/></>}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <div style={{ marginTop: 32, textAlign: "center", fontSize: 12, color: "#1e293b" }}>
          <a href="/pricing" style={{ color: "#6366f1" }}>View Pricing</a>
          {" "} | {" "}
          <a href="/track" style={{ color: "#6366f1" }}>Track Order</a>
          {" "} | {" "}
          <span style={{ color: "#334155" }}>South Africa</span>
        </div>
      </div>
    </div>
  )
}