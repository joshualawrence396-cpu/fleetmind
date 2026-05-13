"use client"
import { useState } from "react"

export function AutomatedTesting() {
  const [results, setResults] = useState([])
  const [running, setRunning] = useState(false)

  const tests = [
    { id:"t1", name:"GET /api/vehicles", desc:"Fetch all vehicles" },
    { id:"t2", name:"GET /api/drivers", desc:"Fetch all drivers" },
    { id:"t3", name:"GET /api/orders", desc:"Fetch all orders" },
    { id:"t4", name:"GET /api/warehouses", desc:"Fetch all warehouses" },
    { id:"t5", name:"GET /api/inventory", desc:"Fetch inventory items" },
    { id:"t6", name:"GET /api/analytics", desc:"Fetch analytics data" },
    { id:"t7", name:"GET /api/me", desc:"Check auth session" },
  ]

  const runTests = async () => {
    setRunning(true)
    setResults([])
    const endpoints = [
      { id:"t1", url:"/api/vehicles" },
      { id:"t2", url:"/api/drivers" },
      { id:"t3", url:"/api/orders" },
      { id:"t4", url:"/api/warehouses" },
      { id:"t5", url:"/api/inventory" },
      { id:"t6", url:"/api/analytics" },
      { id:"t7", url:"/api/me" },
    ]
    const res = []
    for (const ep of endpoints) {
      const start = Date.now()
      try {
        const r = await fetch(ep.url)
        const ms = Date.now()-start
        res.push({ id:ep.id, status:r.ok?"PASS":"FAIL", code:r.status, ms })
      } catch {
        res.push({ id:ep.id, status:"FAIL", code:0, ms:Date.now()-start })
      }
      setResults([...res])
    }
    setRunning(false)
  }

  const passed = results.filter(r=>r.status==="PASS").length
  const failed = results.filter(r=>r.status==="FAIL").length

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={{fontSize:22,fontWeight:"bold"}}>🧪 API Testing</h2>
        <button onClick={runTests} disabled={running} style={{padding:"8px 20px",background:running?"#94a3b8":"#3b82f6",color:"white",border:"none",borderRadius:6,cursor:running?"not-allowed":"pointer",fontWeight:"500"}}>
          {running?"⏳ Running...":"▶ Run All Tests"}
        </button>
      </div>

      {results.length > 0 && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:20}}>
          <div style={{background:"white",padding:18,borderRadius:12,textAlign:"center",borderLeft:"4px solid #10b981",boxShadow:"0 1px 3px rgba(0,0,0,0.1)"}}><div style={{fontSize:26,fontWeight:"bold",color:"#10b981"}}>{passed}</div><div style={{color:"#64748b"}}>Passed</div></div>
          <div style={{background:"white",padding:18,borderRadius:12,textAlign:"center",borderLeft:"4px solid #ef4444",boxShadow:"0 1px 3px rgba(0,0,0,0.1)"}}><div style={{fontSize:26,fontWeight:"bold",color:"#ef4444"}}>{failed}</div><div style={{color:"#64748b"}}>Failed</div></div>
          <div style={{background:"white",padding:18,borderRadius:12,textAlign:"center",borderLeft:"4px solid #3b82f6",boxShadow:"0 1px 3px rgba(0,0,0,0.1)"}}><div style={{fontSize:26,fontWeight:"bold",color:"#3b82f6"}}>{results.length}/{tests.length}</div><div style={{color:"#64748b"}}>Complete</div></div>
        </div>
      )}

      <div style={{background:"white",borderRadius:12,padding:20,boxShadow:"0 1px 3px rgba(0,0,0,0.1)"}}>
        <h3 style={{marginBottom:15,fontWeight:"bold"}}>Test Suite</h3>
        {tests.map(t=>{
          const r = results.find(x=>x.id===t.id)
          return (
            <div key={t.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:"1px solid #f1f5f9"}}>
              <div>
                <div style={{fontWeight:"500",fontSize:14}}>{t.name}</div>
                <div style={{fontSize:12,color:"#64748b"}}>{t.desc}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                {r && <span style={{fontSize:12,color:"#94a3b8"}}>{r.ms}ms</span>}
                {r && <span style={{fontSize:12,color:"#64748b"}}>HTTP {r.code}</span>}
                {running && !r && <span style={{fontSize:12,color:"#f59e0b"}}>⏳ Waiting</span>}
                {r ? (
                  <span style={{padding:"3px 12px",borderRadius:20,fontSize:12,fontWeight:"600",background:r.status==="PASS"?"#d1fae5":"#fee2e2",color:r.status==="PASS"?"#065f46":"#dc2626"}}>{r.status}</span>
                ) : (
                  <span style={{padding:"3px 12px",borderRadius:20,fontSize:12,background:"#f1f5f9",color:"#64748b"}}>PENDING</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}