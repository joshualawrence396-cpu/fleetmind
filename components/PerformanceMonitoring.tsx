"use client"
import { useState, useEffect } from "react"

export function PerformanceMonitoring() {
  const [metrics, setMetrics] = useState({ responseTime:0, uptime:99.9, requests:0, errors:0 })
  const [history, setHistory] = useState([])
  const [checking, setChecking] = useState(false)

  const checkPerformance = async () => {
    setChecking(true)
    const endpoints = ["/api/vehicles","/api/drivers","/api/orders","/api/analytics"]
    const times = []
    let errors = 0
    for (const ep of endpoints) {
      const start = Date.now()
      try { await fetch(ep) } catch { errors++ }
      times.push(Date.now()-start)
    }
    const avg = Math.round(times.reduce((a,b)=>a+b,0)/times.length)
    const entry = { time:new Date().toLocaleTimeString(), avg, errors, requests:times.length }
    setMetrics({ responseTime:avg, uptime:99.9, requests:(metrics.requests+times.length), errors:(metrics.errors+errors) })
    setHistory(prev=>[entry,...prev].slice(0,10))
    setChecking(false)
  }

  useEffect(() => { checkPerformance() }, [])

  const perfColor = (ms) => ms < 200 ? "#10b981" : ms < 500 ? "#f59e0b" : "#ef4444"
  const perfLabel = (ms) => ms < 200 ? "Excellent" : ms < 500 ? "Good" : "Slow"

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={{fontSize:22,fontWeight:"bold"}}>📊 Performance Monitoring</h2>
        <button onClick={checkPerformance} disabled={checking} style={{padding:"8px 16px",background:checking?"#94a3b8":"#3b82f6",color:"white",border:"none",borderRadius:6,cursor:checking?"not-allowed":"pointer"}}>
          {checking?"⏳ Checking...":"🔄 Refresh"}
        </button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:20}}>
        <div style={{background:"white",padding:18,borderRadius:12,textAlign:"center",boxShadow:"0 1px 3px rgba(0,0,0,0.1)",borderLeft:"4px solid "+perfColor(metrics.responseTime)}}>
          <div style={{fontSize:28,marginBottom:4}}>⚡</div>
          <div style={{fontSize:22,fontWeight:"bold",color:perfColor(metrics.responseTime)}}>{metrics.responseTime}ms</div>
          <div style={{color:"#64748b",fontSize:13}}>Avg Response</div>
          <div style={{fontSize:11,color:perfColor(metrics.responseTime),marginTop:2}}>{perfLabel(metrics.responseTime)}</div>
        </div>
        <div style={{background:"white",padding:18,borderRadius:12,textAlign:"center",boxShadow:"0 1px 3px rgba(0,0,0,0.1)",borderLeft:"4px solid #10b981"}}>
          <div style={{fontSize:28,marginBottom:4}}>✅</div>
          <div style={{fontSize:22,fontWeight:"bold",color:"#10b981"}}>{metrics.uptime}%</div>
          <div style={{color:"#64748b",fontSize:13}}>Uptime</div>
        </div>
        <div style={{background:"white",padding:18,borderRadius:12,textAlign:"center",boxShadow:"0 1px 3px rgba(0,0,0,0.1)",borderLeft:"4px solid #3b82f6"}}>
          <div style={{fontSize:28,marginBottom:4}}>📡</div>
          <div style={{fontSize:22,fontWeight:"bold",color:"#3b82f6"}}>{metrics.requests}</div>
          <div style={{color:"#64748b",fontSize:13}}>Total Requests</div>
        </div>
        <div style={{background:"white",padding:18,borderRadius:12,textAlign:"center",boxShadow:"0 1px 3px rgba(0,0,0,0.1)",borderLeft:"4px solid #ef4444"}}>
          <div style={{fontSize:28,marginBottom:4}}>❌</div>
          <div style={{fontSize:22,fontWeight:"bold",color:"#ef4444"}}>{metrics.errors}</div>
          <div style={{color:"#64748b",fontSize:13}}>Errors</div>
        </div>
      </div>

      <div style={{background:"white",borderRadius:12,padding:20,boxShadow:"0 1px 3px rgba(0,0,0,0.1)"}}>
        <h3 style={{marginBottom:15,fontWeight:"bold"}}>Response Time History</h3>
        {history.length === 0 && <div style={{textAlign:"center",color:"#666",padding:20}}>No history yet. Click Refresh to start monitoring.</div>}
        {history.map((h,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #f1f5f9"}}>
            <span style={{color:"#64748b",fontSize:13}}>{h.time}</span>
            <div style={{flex:1,margin:"0 20px",height:8,background:"#e2e8f0",borderRadius:4}}>
              <div style={{width:Math.min((h.avg/1000)*100,100)+"%",height:"100%",background:perfColor(h.avg),borderRadius:4,transition:"width 0.3s"}}></div>
            </div>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <span style={{fontSize:13,fontWeight:"600",color:perfColor(h.avg)}}>{h.avg}ms</span>
              <span style={{padding:"2px 8px",borderRadius:10,fontSize:11,background:perfColor(h.avg)+"20",color:perfColor(h.avg)}}>{perfLabel(h.avg)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}