"use client"
import { useState, useEffect } from "react"

export function CostAnalysis() {
  const [drivers, setDrivers] = useState([])
  const [fuelLogs, setFuelLogs] = useState([])
  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetch("/api/drivers").then(r=>r.json()).then(d=>setDrivers(d||[]))
    fetch("/api/orders").then(r=>r.json()).then(o=>setOrders(o||[]))
    const saved = localStorage.getItem("fuelLogs")
    if (saved) setFuelLogs(JSON.parse(saved))
  }, [])

  const completedOrders = orders.filter(o=>o.status==="COMPLETED")
  const totalRevenue = completedOrders.length * 1500
  const totalFuelCost = fuelLogs.reduce((s,l)=>s+l.totalCost,0)
  const totalFuelLiters = fuelLogs.reduce((s,l)=>s+l.liters,0)
  const netProfit = totalRevenue - totalFuelCost
  const margin = totalRevenue > 0 ? ((netProfit/totalRevenue)*100).toFixed(1) : 0

  const driverStats = drivers.map(d => {
    const driverOrders = completedOrders.filter(o=>o.driverId===d.id)
    const driverFuel = fuelLogs.filter(l=>l.driverName===d.name)
    const revenue = driverOrders.length * 1500
    const fuel = driverFuel.reduce((s,l)=>s+l.totalCost,0)
    return { ...d, orders: driverOrders.length, revenue, fuel, profit: revenue-fuel }
  })

  const s = {
    card:{background:"white",borderRadius:12,padding:20,boxShadow:"0 1px 3px rgba(0,0,0,0.1)",marginBottom:16},
    stat:{background:"white",padding:18,borderRadius:12,boxShadow:"0 1px 3px rgba(0,0,0,0.1)",textAlign:"center" as const},
  }

  return (
    <div>
      <h2 style={{fontSize:22,fontWeight:"bold",marginBottom:20}}>💡 Cost Analysis</h2>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:20}}>
        <div style={{...s.stat,borderLeft:"4px solid #10b981"}}><div style={{fontSize:28}}>💰</div><div style={{fontSize:20,fontWeight:"bold",color:"#10b981"}}>R{totalRevenue.toLocaleString()}</div><div style={{color:"#64748b",fontSize:13}}>Total Revenue</div></div>
        <div style={{...s.stat,borderLeft:"4px solid #ef4444"}}><div style={{fontSize:28}}>⛽</div><div style={{fontSize:20,fontWeight:"bold",color:"#ef4444"}}>R{totalFuelCost.toFixed(2)}</div><div style={{color:"#64748b",fontSize:13}}>Fuel Costs</div></div>
        <div style={{...s.stat,borderLeft:"4px solid #667eea"}}><div style={{fontSize:28}}>📈</div><div style={{fontSize:20,fontWeight:"bold",color:"#667eea"}}>R{netProfit.toFixed(2)}</div><div style={{color:"#64748b",fontSize:13}}>Net Profit</div></div>
        <div style={{...s.stat,borderLeft:"4px solid #f59e0b"}}><div style={{fontSize:28}}>🎯</div><div style={{fontSize:20,fontWeight:"bold",color:"#f59e0b"}}>{margin}%</div><div style={{color:"#64748b",fontSize:13}}>Profit Margin</div></div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div style={s.card}>
          <h3 style={{marginBottom:15,fontWeight:"bold"}}>⛽ Fuel Summary</h3>
          <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #f1f5f9"}}><span>Total Liters</span><strong>{totalFuelLiters.toFixed(1)}L</strong></div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #f1f5f9"}}><span>Total Cost</span><strong style={{color:"#ef4444"}}>R{totalFuelCost.toFixed(2)}</strong></div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #f1f5f9"}}><span>Avg per Liter</span><strong>R{totalFuelLiters>0?(totalFuelCost/totalFuelLiters).toFixed(2):"0.00"}</strong></div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0"}}><span>Cost per Order</span><strong>R{completedOrders.length>0?(totalFuelCost/completedOrders.length).toFixed(2):"0.00"}</strong></div>
        </div>
        <div style={s.card}>
          <h3 style={{marginBottom:15,fontWeight:"bold"}}>📦 Order Summary</h3>
          <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #f1f5f9"}}><span>Total Orders</span><strong>{orders.length}</strong></div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #f1f5f9"}}><span>Completed</span><strong style={{color:"#10b981"}}>{completedOrders.length}</strong></div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #f1f5f9"}}><span>Revenue per Order</span><strong>R1,500.00</strong></div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0"}}><span>Total Revenue</span><strong style={{color:"#10b981"}}>R{totalRevenue.toLocaleString()}</strong></div>
        </div>
      </div>

      <div style={s.card}>
        <h3 style={{marginBottom:15,fontWeight:"bold"}}>👤 Driver Performance & Cost</h3>
        {driverStats.length===0 && <div style={{color:"#666",textAlign:"center",padding:20}}>No drivers yet.</div>}
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,padding:"8px 0",borderBottom:"2px solid #e2e8f0",fontWeight:"bold",fontSize:12,color:"#64748b"}}>
          <span>Driver</span><span style={{textAlign:"center"}}>Orders</span><span style={{textAlign:"center"}}>Revenue</span><span style={{textAlign:"center"}}>Fuel Cost</span><span style={{textAlign:"center"}}>Profit</span>
        </div>
        {driverStats.map(d=>(
          <div key={d.id} style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,padding:"12px 0",borderBottom:"1px solid #f1f5f9",alignItems:"center"}}>
            <span style={{fontWeight:"500"}}>{d.name}</span>
            <span style={{textAlign:"center"}}>{d.orders}</span>
            <span style={{textAlign:"center",color:"#10b981",fontWeight:"500"}}>R{d.revenue.toLocaleString()}</span>
            <span style={{textAlign:"center",color:"#ef4444",fontWeight:"500"}}>R{d.fuel.toFixed(2)}</span>
            <span style={{textAlign:"center",fontWeight:"bold",color:d.profit>=0?"#10b981":"#ef4444"}}>R{d.profit.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}