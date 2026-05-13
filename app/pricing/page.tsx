"use client"
import { useState } from "react"
import { t, languages } from "../../lib/i18n"

export default function PricingPage() {
  const [billing, setBilling] = useState("monthly")
  const [lang, setLang] = useState("en")
  const T = t[lang]

  const plans = [
    {
      name: "Basic", nameAf: "Basiese", nameZu: "Eyisiseko", nameXh: "Eyisiseko",
      price: { monthly: 999, yearly: 799 },
      color: "#10b981", glow: "rgba(16,185,129,0.3)",
      icon: "🚛",
      description: "Perfect for small fleets getting started",
      descAf: "Perfek vir klein vlote wat begin",
      descZu: "Kulungele izimoto ezincane eziqala",
      descXh: "Ilungele ifliti encinci eqalayo",
      features: [
        "Up to 5 vehicles", "Up to 10 drivers", "Basic fleet tracking",
        "Order management", "Email support", "1 warehouse",
        "Basic analytics", "Customer portal"
      ],
      featuresAf: [
        "Tot 5 voertuie", "Tot 10 bestuurders", "Basiese vlootopsporing",
        "Bestellingbestuur", "E-posondersteuning", "1 pakhuis",
        "Basiese analise", "Kliënteportaal"
      ],
      cta: "Start Free Trial", notPopular: true
    },
    {
      name: "Pro", nameAf: "Pro", nameZu: "Eyichwepheshe", nameXh: "Eyichwepheshe",
      price: { monthly: 2499, yearly: 1999 },
      color: "#6366f1", glow: "rgba(99,102,241,0.4)",
      icon: "⚡",
      description: "For growing businesses with serious needs",
      descAf: "Vir groeiende besighede met ernstige behoeftes",
      descZu: "Yamabhizinisi akhula nezidingo ezibalulekile",
      descXh: "Yamashishini akhulayo anesidingo esibalulekileyo",
      popular: true,
      features: [
        "Up to 25 vehicles", "Unlimited drivers", "Live GPS tracking",
        "Route optimization", "Invoice generation", "Proof of delivery",
        "5 warehouses", "Advanced analytics", "Demand forecasting",
        "API integrations", "Priority support", "Driver mobile app",
        "Barcode scanning", "Fuel management", "Maintenance scheduling"
      ],
      featuresAf: [
        "Tot 25 voertuie", "Onbeperkte bestuurders", "Lewendige GPS-opsporing",
        "Roete-optimering", "Faktuurgenerering", "Afleweringsbewyse",
        "5 pakhuise", "Gevorderde analise", "Aanvraagskatting",
        "API-integrasies", "Prioriteitsondersteuning", "Bestuurder-toepassing",
        "Strepieskodeskandeer", "Brandstofbestuur", "Onderhoudskedulering"
      ],
      cta: "Start Free Trial"
    },
    {
      name: "Enterprise", nameAf: "Onderneming", nameZu: "Enkampani", nameXh: "Enkampani",
      price: { monthly: 7999, yearly: 6399 },
      color: "#ec4899", glow: "rgba(236,72,153,0.3)",
      icon: "🏆",
      description: "For large operations requiring full control",
      descAf: "Vir groot bedrywighede wat volle beheer vereis",
      descZu: "Yemisebenzi emikhulu edinga ukulawula okuphelele",
      descXh: "Yemisebenzi emikhulu edinga ukulawula okupheleleyo",
      features: [
        "Unlimited vehicles", "Unlimited drivers", "White-label branding",
        "Custom API access", "Dedicated account manager", "SLA guarantee",
        "Unlimited warehouses", "AI-powered dispatch", "Custom integrations",
        "On-premise option", "24/7 phone support", "Staff training",
        "Multi-city support", "Custom reports", "Data export"
      ],
      featuresAf: [
        "Onbeperkte voertuie", "Onbeperkte bestuurders", "Wit-etiket handelsmerke",
        "Pasgemaakte API-toegang", "Toegewyde rekeningbestuurder", "SLA-waarborg",
        "Onbeperkte pakhuise", "KI-aangedrewe versending", "Pasgemaakte integrasies",
        "Op-perseel opsie", "24/7 telefoonondersteuning", "Personeellopleiding",
        "Multi-stad ondersteuning", "Pasgemaakte verslae", "Data-uitvoer"
      ],
      cta: "Contact Sales"
    }
  ]

  const getPlanName = (p) => lang==="af"?p.nameAf:lang==="zu"?p.nameZu:lang==="xh"?p.nameXh:p.name
  const getPlanDesc = (p) => lang==="af"?p.descAf:lang==="zu"?p.descZu:lang==="xh"?p.descXh:p.description
  const getPlanFeatures = (p) => lang==="af"?p.featuresAf:p.features

  const handleCheckout = async (plan) => {
    if (plan.name === "Enterprise") {
      window.location.href = "mailto:sales@fleetmind.co.za?subject=Enterprise Enquiry"
      return
    }
    alert("Stripe checkout coming soon! Plan: " + plan.name + " - R" + plan.price[billing] + "/" + billing)
  }

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0a0f1e 0%,#0d1526 100%)",fontFamily:"'Inter',sans-serif",color:"#e2e8f0"}}>

      {/* NAV */}
      <nav style={{padding:"20px 60px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid rgba(99,102,241,0.1)"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:12,textDecoration:"none"}}>
          <div style={{width:40,height:40,borderRadius:12,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🚛</div>
          <div>
            <div style={{fontSize:18,fontWeight:"800",color:"white"}}>FleetMind</div>
            <div style={{fontSize:10,color:"#6366f1",letterSpacing:"1px",fontWeight:"600"}}>PRO EDITION</div>
          </div>
        </a>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <select value={lang} onChange={e=>setLang(e.target.value)} style={{background:"rgba(99,102,241,0.1)",border:"1px solid rgba(99,102,241,0.2)",borderRadius:8,color:"#a5b4fc",padding:"6px 12px",fontSize:13,cursor:"pointer"}}>
            {Object.entries(languages).map(([code,l])=>(
              <option key={code} value={code}>{l.flag} {l.name}</option>
            ))}
          </select>
          <a href="/login" style={{padding:"8px 20px",background:"rgba(99,102,241,0.1)",border:"1px solid rgba(99,102,241,0.3)",borderRadius:8,color:"#a5b4fc",textDecoration:"none",fontSize:13,fontWeight:"500"}}>Login</a>
          <a href="/track" style={{padding:"8px 20px",background:"linear-gradient(135deg,#6366f1,#8b5cf6)",borderRadius:8,color:"white",textDecoration:"none",fontSize:13,fontWeight:"600"}}>Track Order</a>
        </div>
      </nav>

      {/* HERO */}
      <div style={{textAlign:"center",padding:"80px 20px 60px",position:"relative"}}>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:600,height:300,borderRadius:"50%",background:"rgba(99,102,241,0.05)",filter:"blur(80px)"}}></div>
        <div style={{display:"inline-block",padding:"6px 20px",borderRadius:20,background:"rgba(99,102,241,0.1)",border:"1px solid rgba(99,102,241,0.3)",fontSize:12,fontWeight:"600",color:"#a5b4fc",letterSpacing:"1px",marginBottom:24}}>SIMPLE, TRANSPARENT PRICING</div>
        <h1 style={{fontSize:56,fontWeight:"900",color:"white",letterSpacing:"-2px",marginBottom:16,lineHeight:1.1}}>
          Fleet Management<br/>
          <span style={{background:"linear-gradient(135deg,#6366f1,#ec4899)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>That Pays For Itself</span>
        </h1>
        <p style={{fontSize:18,color:"#64748b",maxWidth:500,margin:"0 auto 40px"}}>
          {lang==="af"?"Kies die plan wat by u besigheid pas":""}
          {lang==="zu"?"Khetha uhlelo olufanele ibhizinisi lakho":""}
          {lang==="xh"?"Khetha icwangciso elilungele ishishini lakho":""}
          {lang==="en"?"Choose the plan that fits your fleet. No hidden fees, no surprises.":""}
        </p>

        {/* BILLING TOGGLE */}
        <div style={{display:"inline-flex",background:"rgba(99,102,241,0.1)",borderRadius:50,padding:4,border:"1px solid rgba(99,102,241,0.2)",marginBottom:16}}>
          {["monthly","yearly"].map(b=>(
            <button key={b} onClick={()=>setBilling(b)} style={{padding:"8px 24px",borderRadius:50,border:"none",cursor:"pointer",fontSize:13,fontWeight:"600",background:billing===b?"linear-gradient(135deg,#6366f1,#8b5cf6)":"none",color:billing===b?"white":"#64748b",transition:"all 0.2s"}}>
              {b==="monthly"?lang==="af"?"Maandeliks":lang==="zu"?"Ngenyanga":lang==="xh"?"Ngenyanga":"Monthly":lang==="af"?"Jaarliks":lang==="zu"?"Ngonyaka":lang==="xh"?"Ngonyaka":"Yearly"}
            </button>
          ))}
        </div>
        {billing==="yearly"&&<div style={{fontSize:13,color:"#10b981",fontWeight:"600"}}>Save 20% with annual billing!</div>}
      </div>

      {/* PLANS */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24,maxWidth:1100,margin:"0 auto",padding:"0 30px 80px"}}>
        {plans.map(plan=>(
          <div key={plan.name} style={{background:"linear-gradient(135deg,#0d1526,#111827)",borderRadius:24,padding:32,border:plan.popular?`2px solid ${plan.color}`:"1px solid rgba(99,102,241,0.15)",position:"relative",boxShadow:plan.popular?`0 0 60px ${plan.glow}`:"none",transition:"transform 0.3s"}}>
            {plan.popular&&<div style={{position:"absolute",top:-14,left:"50%",transform:"translateX(-50%)",background:`linear-gradient(135deg,#6366f1,#8b5cf6)`,borderRadius:20,padding:"4px 20px",fontSize:11,fontWeight:"700",color:"white",letterSpacing:"1px",whiteSpace:"nowrap"}}>MOST POPULAR</div>}
            <div style={{fontSize:40,marginBottom:16}}>{plan.icon}</div>
            <div style={{fontSize:22,fontWeight:"800",color:"white",marginBottom:8}}>{getPlanName(plan)}</div>
            <div style={{fontSize:13,color:"#475569",marginBottom:24}}>{getPlanDesc(plan)}</div>
            <div style={{marginBottom:28}}>
              <span style={{fontSize:44,fontWeight:"900",color:"white"}}>R{plan.price[billing].toLocaleString()}</span>
              <span style={{fontSize:14,color:"#475569",marginLeft:4}}>/{billing==="monthly"?"mo":"mo, billed yearly"}</span>
              {billing==="yearly"&&<div style={{fontSize:12,color:"#10b981",marginTop:4}}>Save R{((plan.price.monthly-plan.price.yearly)*12).toLocaleString()}/year</div>}
            </div>
            <button onClick={()=>handleCheckout(plan)} style={{width:"100%",padding:"14px",background:plan.popular?`linear-gradient(135deg,${plan.color},${plan.color}cc)`:`rgba(${plan.color==="#10b981"?"16,185,129":plan.color==="#ec4899"?"236,72,153":"99,102,241"},0.1)`,border:plan.popular?"none":`1px solid ${plan.color}40`,borderRadius:12,color:plan.popular?"white":plan.color,cursor:"pointer",fontSize:14,fontWeight:"700",marginBottom:28,boxShadow:plan.popular?`0 8px 30px ${plan.glow}`:"none"}}>
              {plan.cta} →
            </button>
            <div style={{borderTop:"1px solid rgba(99,102,241,0.1)",paddingTop:24}}>
              <div style={{fontSize:11,fontWeight:"700",color:"#475569",letterSpacing:"1px",marginBottom:14}}>INCLUDES</div>
              {getPlanFeatures(plan).map((f,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,fontSize:13,color:"#94a3b8"}}>
                  <span style={{color:plan.color,fontSize:14,flexShrink:0}}>✓</span>{f}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* FAQ / TRUST */}
      <div style={{maxWidth:800,margin:"0 auto",padding:"0 30px 80px",textAlign:"center"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20,marginBottom:60}}>
          {[
            {icon:"🔒",title:"Secure",desc:"Bank-level encryption"},
            {icon:"🇿🇦",title:"South Africa",desc:"Built for SA fleets"},
            {icon:"📱",title:"Mobile Ready",desc:"Works on any device"},
            {icon:"🔄",title:"24/7 Uptime",desc:"99.9% SLA guaranteed"},
          ].map(f=>(
            <div key={f.title} style={{background:"rgba(99,102,241,0.05)",borderRadius:16,padding:20,border:"1px solid rgba(99,102,241,0.1)"}}>
              <div style={{fontSize:28,marginBottom:8}}>{f.icon}</div>
              <div style={{fontWeight:"700",color:"white",fontSize:14}}>{f.title}</div>
              <div style={{fontSize:12,color:"#475569",marginTop:4}}>{f.desc}</div>
            </div>
          ))}
        </div>
        <div style={{color:"#475569",fontSize:13}}>
          All plans include a 14-day free trial. No credit card required. Cancel anytime.
          <br/>Need a custom plan? <a href="mailto:sales@fleetmind.co.za" style={{color:"#6366f1"}}>Contact us</a>
        </div>
      </div>
    </div>
  )
}