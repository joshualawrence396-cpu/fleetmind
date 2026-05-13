"use client"
import { useState } from "react"

export function APIIntegrations() {
  const [connected, setConnected] = useState({ takealot:false, shopify:false, woocommerce:false })
  const [configs, setConfigs] = useState({ takealot:{apiKey:"",sellerId:""}, shopify:{apiKey:"",storeUrl:""}, woocommerce:{apiKey:"",apiSecret:"",storeUrl:""} })
  const [testing, setTesting] = useState("")
  const [logs, setLogs] = useState([
    { id:1, platform:"System", action:"FleetMind API started", status:"success", time:"09:00:00" },
  ])

  const testConnection = async (platform) => {
    setTesting(platform)
    await new Promise(r=>setTimeout(r,1500))
    const success = Object.values(configs[platform]).every(v=>v.trim().length>0)
    const entry = { id:Date.now(), platform, action:"Connection test", status:success?"success":"failed", time:new Date().toLocaleTimeString() }
    setLogs(prev=>[entry,...prev])
    if (success) setConnected({...connected,[platform]:true})
    setTesting("")
  }

  const integrations = [
    { id:"takealot", name:"Takealot", icon:"🛒", color:"#e31837", desc:"Auto-import Takealot marketplace orders", fields:[{key:"apiKey",label:"API Key"},{key:"sellerId",label:"Seller ID"}] },
    { id:"shopify", name:"Shopify", icon:"🛍️", color:"#96bf48", desc:"Sync Shopify store orders automatically", fields:[{key:"apiKey",label:"API Key"},{key:"storeUrl",label:"Store URL"}] },
    { id:"woocommerce", name:"WooCommerce", icon:"🔌", color:"#7f54b3", desc:"Connect your WordPress WooCommerce store", fields:[{key:"apiKey",label:"Consumer Key"},{key:"apiSecret",label:"Consumer Secret"},{key:"storeUrl",label:"Store URL"}] },
  ]

  return (
    <div>
      <h2 style={{fontSize:22,fontWeight:"bold",marginBottom:8}}>🔌 API Integrations</h2>
      <p style={{color:"#64748b",marginBottom:20}}>Connect your e-commerce platforms to auto-import orders into FleetMind.</p>

      {integrations.map(intg=>(
        <div key={intg.id} style={{background:"white",borderRadius:12,padding:20,marginBottom:16,boxShadow:"0 1px 3px rgba(0,0,0,0.1)",border:connected[intg.id]?"2px solid #10b981":"1px solid #e2e8f0"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:44,height:44,borderRadius:10,background:intg.color+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{intg.icon}</div>
              <div>
                <div style={{fontWeight:"bold",fontSize:16}}>{intg.name}</div>
                <div style={{fontSize:13,color:"#64748b"}}>{intg.desc}</div>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              {connected[intg.id] && <span style={{padding:"4px 12px",borderRadius:20,background:"#d1fae5",color:"#065f46",fontSize:12,fontWeight:"600"}}>✅ Connected</span>}
              <button onClick={()=>testConnection(intg.id)} disabled={testing===intg.id} style={{padding:"8px 16px",background:connected[intg.id]?"#10b981":intg.color,color:"white",border:"none",borderRadius:6,cursor:"pointer",fontSize:13,fontWeight:"500"}}>
                {testing===intg.id?"⏳ Testing...":connected[intg.id]?"🔄 Re-test":"Connect"}
              </button>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat("+intg.fields.length+",1fr)",gap:10}}>
            {intg.fields.map(f=>(
              <div key={f.key}>
                <label style={{display:"block",fontSize:12,fontWeight:"500",marginBottom:4,color:"#64748b"}}>{f.label}</label>
                <input type={f.key.toLowerCase().includes("secret")||f.key.toLowerCase().includes("key")?"password":"text"}
                  placeholder={"Enter "+f.label} value={configs[intg.id][f.key]||""}
                  onChange={e=>setConfigs({...configs,[intg.id]:{...configs[intg.id],[f.key]:e.target.value}})}
                  style={{width:"100%",padding:9,border:"1px solid #e2e8f0",borderRadius:6,fontSize:13,boxSizing:"border-box"}}/>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{background:"white",borderRadius:12,padding:20,boxShadow:"0 1px 3px rgba(0,0,0,0.1)"}}>
        <h3 style={{marginBottom:15,fontWeight:"bold"}}>📋 Integration Logs</h3>
        {logs.map(l=>(
          <div key={l.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #f1f5f9"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{padding:"2px 8px",borderRadius:10,fontSize:11,fontWeight:"600",background:l.status==="success"?"#d1fae5":"#fee2e2",color:l.status==="success"?"#065f46":"#dc2626"}}>{l.status.toUpperCase()}</span>
              <span style={{fontSize:13}}><strong>{l.platform}</strong> — {l.action}</span>
            </div>
            <span style={{fontSize:12,color:"#94a3b8"}}>{l.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}