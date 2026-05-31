"use client"
import { useState } from "react"

export function APIDocumentation() {
  const [open, setOpen] = useState("vehicles")

  const endpoints = [
    { id:"vehicles", method:"GET", path:"/api/vehicles", desc:"Get all vehicles with driver info", response:'[{ id, registration, make, model, status, latitude, longitude, driver }]' },
    { id:"vehicles-post", method:"POST", path:"/api/vehicles", desc:"Create a new vehicle", body:'{ registration, make, model, status?, latitude?, longitude? }' },
    { id:"vehicles-gps", method:"PATCH", path:"/api/vehicles/:id/location", desc:"Update vehicle GPS coordinates", body:'{ latitude, longitude, status? }' },
    { id:"drivers", method:"GET", path:"/api/drivers", desc:"Get all drivers with assigned vehicle", response:'[{ id, name, email, phone, status, vehicle }]' },
    { id:"drivers-post", method:"POST", path:"/api/drivers", desc:"Create driver and optionally assign/create vehicle", body:'{ name, email, phone?, vehicleId?, vehicleRegistration?, vehicleMake?, vehicleModel? }' },
    { id:"orders", method:"GET", path:"/api/orders", desc:"Get all orders with driver and vehicle info", response:'[{ id, orderNumber, customerName, status, priority, driver, vehicle }]' },
    { id:"orders-post", method:"POST", path:"/api/orders", desc:"Create a new order", body:'{ customerName, customerEmail, customerPhone, deliveryAddress, pickupAddress, priority?, driverId?, vehicleId? }' },
    { id:"orders-patch", method:"PATCH", path:"/api/orders/:id", desc:"Update order status or assign driver", body:'{ status?, driverId?, vehicleId? }' },
    { id:"analytics", method:"GET", path:"/api/analytics", desc:"Get fleet analytics summary", response:'{ totalRevenue, completionRate, pendingOrders, activeVehicles, ... }' },
  ]

  const methodColor = (m) => m==="GET"?"#10b981":m==="POST"?"#3b82f6":m==="PATCH"?"#f59e0b":"#ef4444"

  return (
    <div>
      <h2 style={{fontSize:22,fontWeight:"bold",marginBottom:8}}>📚 API Documentation</h2>
      <p style={{color:"#64748b",marginBottom:20}}>Base URL: <code style={{background:"#f1f5f9",padding:"2px 8px",borderRadius:4}}>http://localhost:3000</code></p>

      {endpoints.map(ep=>(
        <div key={ep.id} style={{background: "transparent",borderRadius:10,marginBottom:10,boxShadow:"0 1px 3px rgba(0,0,0,0.1)",overflow:"hidden"}}>
          <div onClick={()=>setOpen(open===ep.id?"":ep.id)} style={{padding:"14px 18px",cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
            <span style={{padding:"3px 10px",borderRadius:4,background:methodColor(ep.method),color:"white",fontSize:12,fontWeight:"bold",minWidth:50,textAlign:"center"}}>{ep.method}</span>
            <code style={{fontSize:14,fontWeight:"500",color:"#1e293b"}}>{ep.path}</code>
            <span style={{fontSize:13,color:"#64748b",marginLeft:"auto"}}>{ep.desc}</span>
            <span style={{color:"#94a3b8"}}>{open===ep.id?"▲":"▼"}</span>
          </div>
          {open===ep.id && (
            <div style={{padding:"0 18px 18px",borderTop:"1px solid #f1f5f9"}}>
              <p style={{color:"#64748b",marginBottom:10,marginTop:12}}>{ep.desc}</p>
              {ep.body && <div><strong style={{fontSize:13}}>Request Body:</strong><pre style={{background:"#1e293b",color:"#e2e8f0",padding:14,borderRadius:8,marginTop:6,fontSize:12,overflow:"auto"}}>{ep.body}</pre></div>}
              {ep.response && <div style={{marginTop:10}}><strong style={{fontSize:13}}>Response:</strong><pre style={{background:"#1e293b",color:"#e2e8f0",padding:14,borderRadius:8,marginTop:6,fontSize:12,overflow:"auto"}}>{ep.response}</pre></div>}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}