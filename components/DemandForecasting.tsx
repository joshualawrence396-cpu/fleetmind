"use client"
import { useState, useEffect } from "react"

export function DemandForecasting() {
  const [orders, setOrders] = useState([])
  const [forecast, setForecast] = useState([])

  useEffect(() => {
    fetch("/api/orders").then(r=>r.json()).then(data => {
      const o = data || []
      setOrders(o)
      generateForecast(o)
    })
  }, [])

  const generateForecast = (orders) => {
    const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
    const base = [12,18,15,20,25,8,5]
    const urgent = [2,3,2,4,6,1,1]
    setForecast(days.map((day,i) => ({
      day,
      predicted: base[i] + Math.floor(Math.random()*5),
      urgent: urgent[i],
      drivers: Math.ceil((base[i]+urgent[i])/4),
      revenue: (base[i]+urgent[i]) * 1500
    })))
  }

  const maxVal = Math.max(...forecast.map(f=>f.predicted))
  const totalRevenue = forecast.reduce((s,f)=>s+f.revenue,0)
  const totalOrders = forecast.reduce((s,f)=>s+f.predicted,0)
  const peakDay = forecast.reduce((a,b)=>a.predicted>b.predicted?a:b, {predicted:0})

  return (
    <div>
      <h2 style={{fontSize:22,fontWeight:"bold",marginBottom:20}}>🔮 Demand Forecasting</h2>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:20}}>
        <div style={{background:"white",padding:18,borderRadius:12,boxShadow:"0 1px 3px rgba(0,0,0,0.1)",borderLeft:"4px solid #667eea",textAlign:"center"}}>
          <div style={{fontSize:28}}>📦</div>
          <div style={{fontSize:22,fontWeight:"bold"}}>{totalOrders}</div>
          <div style={{color:"#64748b",fontSize:13}}>Predicted Orders (7 days)</div>
        </div>
        <div style={{background:"white",padding:18,borderRadius:12,boxShadow:"0 1px 3px rgba(0,0,0,0.1)",borderLeft:"4px solid #10b981",textAlign:"center"}}>
          <div style={{fontSize:28}}>💰</div>
          <div style={{fontSize:22,fontWeight:"bold"}}>R{totalRevenue.toLocaleString()}</div>
          <div style={{color:"#64748b",fontSize:13}}>Predicted Revenue</div>
        </div>
        <div style={{background:"white",padding:18,borderRadius:12,boxShadow:"0 1px 3px rgba(0,0,0,0.1)",borderLeft:"4px solid #f59e0b",textAlign:"center"}}>
          <div style={{fontSize:28}}>📈</div>
          <div style={{fontSize:22,fontWeight:"bold"}}>{peakDay.day}</div>
          <div style={{color:"#64748b",fontSize:13}}>Busiest Day ({peakDay.predicted} orders)</div>
        </div>
      </div>

      <div style={{background:"white",borderRadius:12,padding:24,boxShadow:"0 1px 3px rgba(0,0,0,0.1)",marginBottom:20}}>
        <h3 style={{marginBottom:20,fontWeight:"bold"}}>📊 7-Day Order Forecast</h3>
        <div style={{display:"flex",alignItems:"flex-end",gap:12,height:200}}>
          {forecast.map((f,i)=>(
            <div key={f.day} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
              <div style={{fontSize:12,fontWeight:"bold",color:"#667eea"}}>{f.predicted}</div>
              <div style={{width:"100%",background:"#667eea",borderRadius:"4px 4px 0 0",height:(f.predicted/maxVal)*160,transition:"height 0.5s",position:"relative"}}>
                <div style={{position:"absolute",bottom:0,width:"100%",background:"#ef4444",height:(f.urgent/f.predicted)*100+"%",borderRadius:"4px 4px 0 0"}}></div>
              </div>
              <div style={{fontSize:12,fontWeight:"500",color:"#1e293b"}}>{f.day}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:20,marginTop:12,fontSize:12}}>
          <span><span style={{display:"inline-block",width:12,height:12,background:"#667eea",borderRadius:2,marginRight:4}}></span>Regular Orders</span>
          <span><span style={{display:"inline-block",width:12,height:12,background:"#ef4444",borderRadius:2,marginRight:4}}></span>Urgent Orders</span>
        </div>
      </div>

      <div style={{background:"white",borderRadius:12,padding:20,boxShadow:"0 1px 3px rgba(0,0,0,0.1)"}}>
        <h3 style={{marginBottom:15,fontWeight:"bold"}}>👥 Staffing Recommendations</h3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:8}}>
          {forecast.map(f=>(
            <div key={f.day} style={{textAlign:"center",padding:12,borderRadius:8,background:f.predicted===maxVal?"#f5f3ff":"#f8fafc",border:f.predicted===maxVal?"2px solid #667eea":"1px solid #e2e8f0"}}>
              <div style={{fontWeight:"bold",fontSize:13}}>{f.day}</div>
              <div style={{fontSize:22,margin:"6px 0"}}>👤</div>
              <div style={{fontSize:18,fontWeight:"bold",color:"#667eea"}}>{f.drivers}</div>
              <div style={{fontSize:10,color:"#64748b"}}>drivers needed</div>
              {f.predicted===maxVal && <div style={{fontSize:10,color:"#667eea",marginTop:4,fontWeight:"bold"}}>PEAK DAY</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}