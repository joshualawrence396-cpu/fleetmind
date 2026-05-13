"use client"
import { useState, useEffect } from "react"

export function DriverMobileApp() {
  const [drivers, setDrivers] = useState([])
  const [selected, setSelected] = useState(null)
  const [orders, setOrders] = useState([])
  const [view, setView] = useState("select")

  useEffect(() => {
    fetch("/api/drivers").then(r=>r.json()).then(d=>setDrivers(d||[]))
  }, [])

  const loadDriverOrders = async (driver) => {
    setSelected(driver)
    const res = await fetch("/api/driver-app/orders?driverId="+driver.id)
    const data = await res.json()
    setOrders(data||[])
    setView("app")
  }

  const updateStatus = async (orderId, status) => {
    await fetch("/api/orders/"+orderId, { method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify({status}) })
    setOrders(orders.map(o=>o.id===orderId?{...o,status}:o))
  }

  const statusColor = (s) => s==="COMPLETED"?"#10b981":s==="IN_PROGRESS"?"#3b82f6":"#f59e0b"

  if (view==="app" && selected) {
    return (
      <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <h2 style={{fontSize:22,fontWeight:"bold"}}>📱 Driver App Preview</h2>
          <button onClick={()=>setView("select")} style={{padding:"8px 16px",background:"#e2e8f0",border:"none",borderRadius:6,cursor:"pointer"}}>← Back</button>
        </div>
        <div style={{display:"flex",justifyContent:"center"}}>
          <div style={{width:375,border:"8px solid #1e293b",borderRadius:40,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
            <div style={{background:"#1e293b",padding:"12px 20px",display:"flex",justifyContent:"space-between",color:"white",fontSize:12}}>
              <span>9:41</span><span>📶 🔋</span>
            </div>
            <div style={{background:"#f1f5f9",minHeight:600,overflowY:"auto"}}>
              <div style={{background:"#667eea",padding:"20px 16px",color:"white"}}>
                <div style={{fontSize:12,opacity:0.8}}>Good morning,</div>
                <div style={{fontSize:20,fontWeight:"bold"}}>{selected.name} 👋</div>
                <div style={{fontSize:12,opacity:0.8,marginTop:4}}>{selected.vehicle?.registration||"No vehicle"}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginTop:16}}>
                  <div style={{background:"rgba(255,255,255,0.2)",padding:10,borderRadius:10,textAlign:"center"}}>
                    <div style={{fontSize:20,fontWeight:"bold"}}>{orders.length}</div>
                    <div style={{fontSize:10}}>Total</div>
                  </div>
                  <div style={{background:"rgba(255,255,255,0.2)",padding:10,borderRadius:10,textAlign:"center"}}>
                    <div style={{fontSize:20,fontWeight:"bold"}}>{orders.filter(o=>o.status==="IN_PROGRESS").length}</div>
                    <div style={{fontSize:10}}>Active</div>
                  </div>
                  <div style={{background:"rgba(255,255,255,0.2)",padding:10,borderRadius:10,textAlign:"center"}}>
                    <div style={{fontSize:20,fontWeight:"bold"}}>{orders.filter(o=>o.status==="COMPLETED").length}</div>
                    <div style={{fontSize:10}}>Done</div>
                  </div>
                </div>
              </div>
              <div style={{padding:12}}>
                <div style={{fontWeight:"bold",fontSize:14,marginBottom:10,color:"#1e293b"}}>My Deliveries</div>
                {orders.length===0 && <div style={{textAlign:"center",padding:30,color:"#94a3b8",fontSize:13}}>No orders assigned yet</div>}
                {orders.map(o=>(
                  <div key={o.id} style={{background:"white",borderRadius:12,padding:14,marginBottom:10,boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <span style={{fontWeight:"bold",fontSize:13}}>{o.orderNumber}</span>
                      <span style={{padding:"2px 8px",borderRadius:10,fontSize:10,fontWeight:"600",background:statusColor(o.status)+"20",color:statusColor(o.status)}}>{o.status}</span>
                    </div>
                    <div style={{fontSize:12,color:"#64748b",marginBottom:4}}>👤 {o.customerName}</div>
                    <div style={{fontSize:11,color:"#94a3b8",marginBottom:10}}>📍 {o.deliveryAddress}</div>
                    <div style={{display:"flex",gap:6}}>
                      {o.status==="PENDING" && <button onClick={()=>updateStatus(o.id,"IN_PROGRESS")} style={{flex:1,padding:"8px",background:"#3b82f6",color:"white",border:"none",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:"500"}}>▶ Start</button>}
                      {o.status==="IN_PROGRESS" && <button onClick={()=>updateStatus(o.id,"COMPLETED")} style={{flex:1,padding:"8px",background:"#10b981",color:"white",border:"none",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:"500"}}>✅ Delivered</button>}
                      {o.status==="COMPLETED" && <div style={{flex:1,padding:"8px",background:"#f0fdf4",color:"#10b981",borderRadius:8,fontSize:12,fontWeight:"500",textAlign:"center"}}>✅ Complete</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 style={{fontSize:22,fontWeight:"bold",marginBottom:8}}>📱 Driver Mobile App</h2>
      <p style={{color:"#64748b",marginBottom:20}}>Preview the driver app experience. Select a driver to see their orders.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
        {drivers.map(d=>(
          <div key={d.id} onClick={()=>loadDriverOrders(d)} style={{background:"white",borderRadius:12,padding:20,boxShadow:"0 1px 3px rgba(0,0,0,0.1)",cursor:"pointer",border:"2px solid transparent",transition:"all 0.2s"}}
            onMouseOver={e=>(e.currentTarget.style.borderColor="#667eea")} onMouseOut={e=>(e.currentTarget.style.borderColor="transparent")}>
            <div style={{width:50,height:50,borderRadius:"50%",background:"#f5f3ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,marginBottom:12}}>👤</div>
            <div style={{fontWeight:"bold"}}>{d.name}</div>
            <div style={{fontSize:13,color:"#64748b"}}>{d.email}</div>
            <div style={{fontSize:12,color:"#667eea",marginTop:4}}>{d.vehicle?.registration||"No vehicle"}</div>
            <div style={{marginTop:10,padding:"6px 0",borderTop:"1px solid #f1f5f9",fontSize:12,color:"#94a3b8"}}>Tap to preview app →</div>
          </div>
        ))}
        {drivers.length===0 && <div style={{gridColumn:"1/-1",textAlign:"center",padding:40,color:"#94a3b8"}}>No drivers yet. Add drivers first.</div>}
      </div>
    </div>
  )
}