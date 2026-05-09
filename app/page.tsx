"use client"

import { useState, useEffect } from "react"
import { FuelManagement } from "../components/FuelManagement"
import { MaintenanceScheduling } from "../components/MaintenanceScheduling"
import { NotificationSystem } from "../components/NotificationSystem"
import { RealTimeChat } from "../components/RealTimeChat"
import { APIDocumentation } from "../components/APIDocumentation"
import { AutomatedTesting } from "../components/AutomatedTesting"
import { PerformanceMonitoring } from "../components/PerformanceMonitoring"

export default function HomePage() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState("admin@fleetmind.com")
  const [password, setPassword] = useState("admin123")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])
  const [orders, setOrders] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [inventory, setInventory] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("")
  const [formData, setFormData] = useState({})
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })
  const [notifications, setNotifications] = useState([])
  const [showNotifPanel, setShowNotifPanel] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showGpsModal, setShowGpsModal] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [gpsData, setGpsData] = useState({ latitude: "", longitude: "" })

  useEffect(() => {
    fetch("/api/me").then(res => res.json()).then(data => {
      if (!data.error) { setUser(data); setIsLoggedIn(true); loadData() }
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      const interval = setInterval(loadData, 15000)
      return () => clearInterval(interval)
    }
  }, [isLoggedIn])

  const loadData = async () => {
    try {
      const [v, d, o, w, i, a] = await Promise.all([
        fetch("/api/vehicles").then(r => r.json()),
        fetch("/api/drivers").then(r => r.json()),
        fetch("/api/orders").then(r => r.json()),
        fetch("/api/warehouses").then(r => r.json()),
        fetch("/api/inventory").then(r => r.json()),
        fetch("/api/analytics").then(r => r.json())
      ])
      setVehicles(v || [])
      setDrivers(d || [])
      setOrders(prev => {
        if (prev.length > 0 && o) {
          o.filter(n => n.status === "COMPLETED" && prev.find(p => p.id === n.id && p.status !== "COMPLETED"))
           .forEach(order => addNotification("Order " + order.orderNumber + " completed for " + order.customerName + "!", "success"))
        }
        return o || []
      })
      setWarehouses(w || [])
      setInventory(i || [])
      setAnalytics(a || null)
    } catch (err) { console.error(err) }
  }

  const addNotification = (message, type) => {
    const notif = { id: Date.now(), message, type: type || "info", time: new Date().toLocaleTimeString() }
    setNotifications(prev => [notif, ...prev].slice(0, 20))
    showToast(message, type)
  }

  const showToast = (message, type) => {
    setNotification({ show: true, message, type: type || "success" })
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 4000)
  }

  const handleLogin = async (e) => {
    e.preventDefault(); setLoading(true); setError("")
    try {
      const res = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) })
      const data = await res.json()
      if (res.ok && data.success) { setUser(data.user); setIsLoggedIn(true); loadData() }
      else setError("Invalid credentials")
    } catch { setError("Network error") }
    setLoading(false)
  }

  const handleLogout = async () => { await fetch("/api/logout", { method: "POST" }); setIsLoggedIn(false); setUser(null) }

  const postData = async (url, data) => {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
    return res
  }

  const createVehicle = async (data) => {
    const res = await postData("/api/vehicles", data)
    if (res.ok) { showToast("Vehicle added! Appearing on map."); loadData(); setShowModal(false); setFormData({}) }
    else showToast("Failed to add vehicle", "error")
  }

  const createDriver = async (data) => {
    const res = await postData("/api/drivers", data)
    if (res.ok) { showToast("Driver " + data.name + " added!" + (data.vehicleRegistration ? " Vehicle created!" : "")); loadData(); setShowModal(false); setFormData({}) }
    else showToast("Failed to add driver", "error")
  }

  const createOrder = async (data) => {
    const res = await postData("/api/orders", data)
    if (res.ok) { showToast("Order created!"); loadData(); setShowModal(false); setFormData({}) }
    else showToast("Failed to create order", "error")
  }

  const createWarehouse = async (data) => {
    const res = await postData("/api/warehouses", data)
    if (res.ok) { showToast("Warehouse added!"); loadData(); setShowModal(false); setFormData({}) }
    else showToast("Failed", "error")
  }

  const createInventory = async (data) => {
    const res = await postData("/api/inventory", data)
    if (res.ok) { showToast("Item added!"); loadData(); setShowModal(false); setFormData({}) }
    else showToast("Failed", "error")
  }

  const updateOrderStatus = async (orderId, status) => {
    const res = await fetch("/api/orders/" + orderId, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) })
    if (res.ok) { if (status === "COMPLETED") addNotification("Order marked as completed!", "success"); loadData() }
  }

  const assignOrderToDriver = async (orderId, driverId, vehicleId) => {
    const res = await fetch("/api/orders/" + orderId, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "IN_PROGRESS", driverId, vehicleId }) })
    if (res.ok) { showToast("Order assigned!"); loadData(); setSelectedOrder(null) }
  }

  const updateGPS = async () => {
    if (!selectedVehicle || !gpsData.latitude || !gpsData.longitude) return
    const res = await fetch("/api/vehicles/" + selectedVehicle.id + "/location", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ latitude: gpsData.latitude, longitude: gpsData.longitude }) })
    if (res.ok) { showToast("GPS updated for " + selectedVehicle.registration + "!"); loadData(); setShowGpsModal(false) }
  }

  const openModal = (type) => { setModalType(type); setFormData({}); setShowModal(true) }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (modalType === "vehicle") createVehicle(formData)
    else if (modalType === "driver") createDriver(formData)
    else if (modalType === "order") createOrder(formData)
    else if (modalType === "warehouse") createWarehouse(formData)
    else if (modalType === "inventory") createInventory(formData)
  }

  const vehiclesWithCoords = vehicles.filter(v => v.latitude && v.longitude)

  if (isLoggedIn && user) {
    return (
      <div style={styles.app}>
        {notification.show && (
          <div style={{...styles.toast, background: notification.type === "error" ? "#ef4444" : notification.type === "warning" ? "#f59e0b" : "#10b981"}}>
            {notification.message}
          </div>
        )}
        <div style={styles.sidebar}>
          <div style={styles.logo}>🚛 FleetMind</div>
          <nav style={styles.nav}>
            {["dashboard","analytics","fleet","drivers","orders","warehouses","inventory","fuel","maintenance","notifications","chat","api-docs","testing","monitoring"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{...styles.navItem,...(activeTab===tab?styles.navActive:{})}}>
                {tab==="dashboard"&&"📊 Dashboard"}{tab==="analytics"&&"📈 Analytics"}{tab==="fleet"&&"🚛 Fleet"}
                {tab==="drivers"&&"👤 Drivers"}{tab==="orders"&&"📦 Orders"}{tab==="warehouses"&&"🏭 Warehouses"}{tab==="inventory"&&"📦 Inventory"}
                {tab==="fuel"&&"⛽ Fuel"}{tab==="maintenance"&&"🔧 Maintenance"}{tab==="notifications"&&"🔔 Notifications"}
                {tab==="chat"&&"💬 Chat"}{tab==="api-docs"&&"📚 API Docs"}{tab==="testing"&&"🧪 Testing"}{tab==="monitoring"&&"📊 Monitoring"}
              </button>
            ))}
          </nav>
          <div style={styles.userInfo}>
            <div style={{marginBottom:6}}>{user.name}</div>
            <div style={{fontSize:12,color:"#94a3b8",marginBottom:10}}>{user.email}</div>
            <button onClick={() => setShowNotifPanel(!showNotifPanel)} style={styles.notifBtn}>
              🔔 Notifications {notifications.length > 0 && <span style={styles.badge2}>{notifications.length}</span>}
            </button>
            <button onClick={handleLogout} style={styles.logoutBtn}>Sign Out</button>
          </div>
        </div>

        {showNotifPanel && (
          <div style={styles.notifPanel}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:15}}>
              <strong>🔔 Notifications</strong>
              <button onClick={() => {setNotifications([]);setShowNotifPanel(false)}} style={{background:"none",border:"none",cursor:"pointer"}}>Clear ✕</button>
            </div>
            {notifications.length === 0 && <div style={{color:"#666",fontSize:13}}>No notifications yet</div>}
            {notifications.map(n => (
              <div key={n.id} style={{padding:10,borderRadius:8,marginBottom:8,background:n.type==="success"?"#d1fae5":n.type==="error"?"#fee2e2":"#dbeafe",fontSize:13}}>
                <div>{n.message}</div><div style={{fontSize:11,color:"#666",marginTop:3}}>{n.time}</div>
              </div>
            ))}
          </div>
        )}

        <div style={styles.main}>
          <div style={styles.header}>
            <h1 style={styles.headerTitle}>{activeTab.toUpperCase()}</h1>
            <p>Welcome back, {user.name}</p>
          </div>

          {activeTab==="dashboard" && (
            <div>
              <div style={styles.statsGrid}>
                <div style={{...styles.statCard,borderLeft:"4px solid #3b82f6"}}><div style={styles.statIcon}>🚛</div><div style={styles.statNum}>{vehicles.length}</div><div style={styles.statLabel}>Vehicles</div><div style={styles.statSub}>{vehicles.filter(v=>v.status==="ON_ROUTE").length} on route</div></div>
                <div style={{...styles.statCard,borderLeft:"4px solid #10b981"}}><div style={styles.statIcon}>👤</div><div style={styles.statNum}>{drivers.length}</div><div style={styles.statLabel}>Drivers</div><div style={styles.statSub}>{drivers.filter(d=>d.vehicle).length} assigned</div></div>
                <div style={{...styles.statCard,borderLeft:"4px solid #f59e0b"}}><div style={styles.statIcon}>📦</div><div style={styles.statNum}>{orders.length}</div><div style={styles.statLabel}>Orders</div><div style={styles.statSub}>{orders.filter(o=>o.status==="PENDING").length} pending</div></div>
                <div style={{...styles.statCard,borderLeft:"4px solid #8b5cf6"}}><div style={styles.statIcon}>✅</div><div style={styles.statNum}>{orders.filter(o=>o.status==="COMPLETED").length}</div><div style={styles.statLabel}>Completed</div><div style={styles.statSub}>{analytics?.completionRate||0}% rate</div></div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>📦 Recent Orders</h3>
                  {orders.slice(0,6).map(o=>(
                    <div key={o.id} style={styles.listItem}>
                      <div><strong>{o.orderNumber}</strong><div style={{fontSize:12,color:"#666"}}>{o.customerName}</div></div>
                      <span style={{...styles.statusBadge,...getStatusStyle(o.status)}}>{o.status}</span>
                    </div>
                  ))}
                </div>
                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>🚛 Fleet Status</h3>
                  {vehicles.map(v=>(
                    <div key={v.id} style={styles.listItem}>
                      <div><strong>{v.registration}</strong><div style={{fontSize:12,color:"#666"}}>{v.make} {v.model}</div>{v.driver&&<div style={{fontSize:11,color:"#10b981"}}>👤 {v.driver.name}</div>}</div>
                      <span style={{...styles.statusBadge,...getStatusStyle(v.status)}}>{v.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab==="analytics" && analytics && (
            <div>
              <div style={styles.statsGrid}>
                <div style={{...styles.statCard,borderLeft:"4px solid #10b981"}}><div style={styles.statIcon}>💰</div><div style={styles.statNum}>R{analytics.totalRevenue.toLocaleString()}</div><div style={styles.statLabel}>Est. Revenue</div></div>
                <div style={{...styles.statCard,borderLeft:"4px solid #3b82f6"}}><div style={styles.statIcon}>📈</div><div style={styles.statNum}>{analytics.completionRate}%</div><div style={styles.statLabel}>Completion Rate</div></div>
                <div style={{...styles.statCard,borderLeft:"4px solid #f59e0b"}}><div style={styles.statIcon}>⏳</div><div style={styles.statNum}>{analytics.pendingOrders}</div><div style={styles.statLabel}>Pending Orders</div></div>
                <div style={{...styles.statCard,borderLeft:"4px solid #8b5cf6"}}><div style={styles.statIcon}>📦</div><div style={styles.statNum}>R{analytics.totalInventoryValue.toLocaleString()}</div><div style={styles.statLabel}>Inventory Value</div></div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>🚛 Vehicle Breakdown</h3>
                  {[["🔵 On Route",analytics.activeVehicles,"#3b82f6"],["🟢 Available",analytics.availableVehicles,"#10b981"],["🟡 Maintenance",analytics.maintenanceVehicles,"#f59e0b"]].map(([label,count,color])=>(
                    <div key={label} style={styles.analyticsRow}>
                      <span>{label}</span>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:100,height:8,background:"#e2e8f0",borderRadius:4}}>
                          <div style={{width:(analytics.totalVehicles?(count/analytics.totalVehicles)*100:0)+"%",height:"100%",background:color,borderRadius:4}}></div>
                        </div>
                        <strong>{count}</strong>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>📦 Order Breakdown</h3>
                  {[["✅ Completed",analytics.completedOrders,"#10b981"],["🔄 In Progress",analytics.inProgressOrders,"#3b82f6"],["⏳ Pending",analytics.pendingOrders,"#f59e0b"]].map(([label,count,color])=>(
                    <div key={label} style={styles.analyticsRow}>
                      <span>{label}</span>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:100,height:8,background:"#e2e8f0",borderRadius:4}}>
                          <div style={{width:(analytics.totalOrders?(count/analytics.totalOrders)*100:0)+"%",height:"100%",background:color,borderRadius:4}}></div>
                        </div>
                        <strong>{count}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab==="fleet" && (
            <div>
              <div style={styles.cardHeader}>
                <h3>📍 Live Fleet ({vehiclesWithCoords.length} on map)</h3>
                <button onClick={()=>openModal("vehicle")} style={styles.addBtn}>+ Add Vehicle</button>
              </div>
              <div style={styles.mapCard}>
                <div style={styles.mapHeader}>
                  <div style={{display:"flex",gap:20}}>
                    <span><span style={{...styles.dot,background:"#3b82f6"}}></span>On Route</span>
                    <span><span style={{...styles.dot,background:"#10b981"}}></span>Available</span>
                    <span><span style={{...styles.dot,background:"#f59e0b"}}></span>Maintenance</span>
                  </div>
                  <span style={styles.updateBadge}>🔄 Auto-Refresh 15s</span>
                </div>
                <div style={styles.mapContainer}>
                  <iframe key={JSON.stringify(vehiclesWithCoords.map(v=>({id:v.id,lat:v.latitude,lng:v.longitude,status:v.status})))}
                    title="Fleet Map" width="100%" height="100%" frameBorder="0"
                    srcDoc={"<!DOCTYPE html><html><head><link rel='stylesheet' href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'/><script src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'></script><style>body{margin:0}#map{height:100vh;width:100vw}</style></head><body><div id='map'></div><script>var map=L.map('map').setView([-33.9249,18.4241],11);L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{attribution:'OSM',subdomains:'abcd',maxZoom:19}).addTo(map);var bounds=L.latLngBounds([]);" + vehiclesWithCoords.map(v=>{const c=v.status==="ON_ROUTE"?"#3b82f6":v.status==="AVAILABLE"?"#10b981":"#f59e0b";return "var m=L.marker(["+v.latitude+","+v.longitude+"],{icon:L.divIcon({html:'<div style=\"background:"+c+";width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);\">🚛</div>',iconSize:[44,44],className:''})}).addTo(map);m.bindPopup('<strong>🚛 "+v.registration+"</strong><br/>"+v.make+" "+v.model+"<br/><span style=\"color:"+c+";font-weight:bold;\">"+v.status+"</span>"+(v.driver?"<br/>👤 "+v.driver.name:"")+"');bounds.extend(["+v.latitude+","+v.longitude+"]);";}).join("")+"if(bounds.isValid())map.fitBounds(bounds.pad(0.1));</script></body></html>"}
                    style={{border:0,width:"100%",height:"100%"}}/>
                </div>
                <div style={styles.mapFooter}>
                  <span>📍 {vehiclesWithCoords.length} vehicles</span><span>🔄 15s refresh</span><span>💡 Click markers</span>
                </div>
              </div>
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>🚛 All Vehicles</h3>
                <div style={styles.vehicleGrid}>
                  {vehicles.map(v=>(
                    <div key={v.id} style={styles.vehicleCard}>
                      <div>
                        <strong>{v.registration}</strong>
                        <div style={{fontSize:13}}>{v.make} {v.model}</div>
                        {v.latitude&&v.longitude?<div style={{fontSize:11,color:"#3b82f6"}}>📍 {v.latitude.toFixed(4)}, {v.longitude.toFixed(4)}</div>:<div style={{fontSize:11,color:"#f59e0b"}}>⚠️ No coordinates</div>}
                        {v.driver&&<div style={{fontSize:11,color:"#10b981"}}>👤 {v.driver.name}</div>}
                      </div>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
                        <span style={{...styles.statusBadge,...getStatusStyle(v.status)}}>{v.status}</span>
                        <button onClick={()=>{setSelectedVehicle(v);setGpsData({latitude:v.latitude||"",longitude:v.longitude||""});setShowGpsModal(true)}} style={styles.smallBtn}>📍 GPS</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab==="drivers" && (
            <div>
              <div style={styles.cardHeader}>
                <h3>👤 Drivers ({drivers.length})</h3>
                <button onClick={()=>openModal("driver")} style={styles.addBtn}>+ Add Driver</button>
              </div>
              <h4 style={{color:"#10b981",margin:"10px 0"}}>✅ Assigned</h4>
              {drivers.filter(d=>d.vehicle).map(d=>(
                <div key={d.id} style={styles.driverCard}>
                  <div><strong>{d.name}</strong><div style={{fontSize:12,color:"#666"}}>{d.email} | {d.phone}</div><div style={{fontSize:11,color:"#3b82f6",marginTop:3}}>🚛 {d.vehicle?.registration} - {d.vehicle?.make} {d.vehicle?.model}</div></div>
                  <span style={{...styles.statusBadge,...getStatusStyle(d.status)}}>{d.status}</span>
                </div>
              ))}
              {drivers.filter(d=>!d.vehicle).length>0&&(<>
                <h4 style={{color:"#f59e0b",margin:"20px 0 10px"}}>⚠️ Unassigned</h4>
                {drivers.filter(d=>!d.vehicle).map(d=>(
                  <div key={d.id} style={{...styles.driverCard,opacity:0.7}}>
                    <div><strong>{d.name}</strong><div style={{fontSize:12,color:"#666"}}>{d.email} | {d.phone}</div></div>
                    <span style={{...styles.statusBadge,...getStatusStyle(d.status)}}>{d.status}</span>
                  </div>
                ))}
              </>)}
            </div>
          )}

          {activeTab==="orders" && (
            <div>
              <div style={styles.cardHeader}>
                <h3>📦 Orders ({orders.length})</h3>
                <button onClick={()=>openModal("order")} style={styles.addBtn}>+ Create Order</button>
              </div>
              {orders.map(o=>(
                <div key={o.id} style={styles.orderCard}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                      <strong>{o.orderNumber}</strong>
                      <span style={{...styles.statusBadge,...getStatusStyle(o.status)}}>{o.status}</span>
                      <span style={{...styles.statusBadge,background:"#f3f4f6",color:"#374151"}}>{o.priority}</span>
                    </div>
                    <div style={{fontSize:13,marginTop:3}}>{o.customerName} | {o.customerPhone}</div>
                    <div style={{fontSize:12,color:"#666"}}>📍 {o.deliveryAddress}</div>
                    {o.driver&&<div style={{fontSize:11,color:"#10b981",marginTop:3}}>👤 {o.driver.name}{o.vehicle?" | 🚛 "+o.vehicle.registration:""}</div>}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:6,minWidth:110}}>
                    {o.status==="PENDING"&&<button onClick={()=>setSelectedOrder(o)} style={styles.assignBtn}>👤 Assign</button>}
                    {o.status==="PENDING"&&<button onClick={()=>updateOrderStatus(o.id,"IN_PROGRESS")} style={styles.progressBtn}>▶ Start</button>}
                    {o.status==="IN_PROGRESS"&&<button onClick={()=>updateOrderStatus(o.id,"COMPLETED")} style={styles.completeBtn}>✅ Complete</button>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab==="warehouses" && (
            <div>
              <div style={styles.cardHeader}>
                <h3>🏭 Warehouses ({warehouses.length})</h3>
                <button onClick={()=>openModal("warehouse")} style={styles.addBtn}>+ Add</button>
              </div>
              <div style={{display:"grid",gap:15}}>
                {warehouses.map(w=><div key={w.id} style={{padding:15,border:"1px solid #e2e8f0",borderRadius:8,background:"white"}}><strong>{w.name}</strong><div>{w.location}</div><div>{w.address}</div><div>📊 {w.currentStock||0}/{w.capacity} | 👔 {w.manager||"N/A"}</div></div>)}
              </div>
            </div>
          )}

          {activeTab==="inventory" && (
            <div>
              <div style={styles.cardHeader}>
                <h3>📦 Inventory ({inventory.length})</h3>
                <button onClick={()=>openModal("inventory")} style={styles.addBtn}>+ Add Item</button>
              </div>
              {inventory.map(i=>(
                <div key={i.id} style={styles.inventoryCard}>
                  <div><strong>{i.name}</strong><div style={{fontSize:12,color:"#666"}}>SKU: {i.sku} | {i.category}</div></div>
                  <div style={{textAlign:"right"}}><div style={{fontWeight:"bold",color:"#10b981"}}>R{i.unitPrice}</div><div style={{fontSize:12}}>Stock: {i.quantity}</div>{i.quantity<=i.minStock&&<div style={{fontSize:11,color:"#ef4444"}}>⚠️ Low!</div>}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab==="fuel" && (
            <div>
              <FuelManagement />
            </div>
          )}

          {activeTab==="maintenance" && (
            <div>
              <MaintenanceScheduling />
            </div>
          )}

          {activeTab==="notifications" && (
            <div>
              <NotificationSystem />
            </div>
          )}

          {activeTab==="chat" && (
            <div>
              <RealTimeChat />
            </div>
          )}

          {activeTab==="api-docs" && (
            <div>
              <APIDocumentation />
            </div>
          )}

          {activeTab==="testing" && (
            <div>
              <AutomatedTesting />
            </div>
          )}

          {activeTab==="monitoring" && (
            <div>
              <PerformanceMonitoring />
            </div>
          )}
        </div>

        {selectedOrder&&(
          <div style={styles.modalOverlay} onClick={()=>setSelectedOrder(null)}>
            <div style={styles.modal} onClick={e=>e.stopPropagation()}>
              <h2 style={styles.modalTitle}>👤 Assign Driver to {selectedOrder.orderNumber}</h2>
              <p style={{color:"#666",marginBottom:15}}>Customer: {selectedOrder.customerName}</p>
              {drivers.filter(d=>d.vehicle).map(d=>(
                <div key={d.id} style={{...styles.driverCard,cursor:"pointer",marginBottom:10}} onClick={()=>assignOrderToDriver(selectedOrder.id,d.id,d.vehicle?.id)}>
                  <div><strong>{d.name}</strong><div style={{fontSize:12,color:"#666"}}>{d.email}</div><div style={{fontSize:11,color:"#3b82f6"}}>🚛 {d.vehicle?.registration}</div></div>
                  <button style={styles.assignBtn}>Assign →</button>
                </div>
              ))}
              {drivers.filter(d=>d.vehicle).length===0&&<p style={{color:"#f59e0b"}}>⚠️ No drivers with vehicles available.</p>}
              <button onClick={()=>setSelectedOrder(null)} style={{...styles.modalCancel,marginTop:15,width:"100%"}}>Cancel</button>
            </div>
          </div>
        )}

        {showGpsModal&&selectedVehicle&&(
          <div style={styles.modalOverlay} onClick={()=>setShowGpsModal(false)}>
            <div style={styles.modal} onClick={e=>e.stopPropagation()}>
              <h2 style={styles.modalTitle}>📍 Update GPS - {selectedVehicle.registration}</h2>
              <input type="number" step="any" placeholder="Latitude (e.g. -33.9249)" value={gpsData.latitude} onChange={e=>setGpsData({...gpsData,latitude:e.target.value})} style={styles.modalInput}/>
              <input type="number" step="any" placeholder="Longitude (e.g. 18.4241)" value={gpsData.longitude} onChange={e=>setGpsData({...gpsData,longitude:e.target.value})} style={styles.modalInput}/>
              <div style={{fontSize:12,color:"#666",marginBottom:15}}>💡 Right-click on Google Maps to copy coordinates.</div>
              <div style={styles.modalButtons}>
                <button onClick={()=>setShowGpsModal(false)} style={styles.modalCancel}>Cancel</button>
                <button onClick={updateGPS} style={styles.modalSubmit}>📍 Update</button>
              </div>
            </div>
          </div>
        )}

        {showModal&&(
          <div style={styles.modalOverlay} onClick={()=>setShowModal(false)}>
            <div style={styles.modal} onClick={e=>e.stopPropagation()}>
              <h2 style={styles.modalTitle}>
                {modalType==="vehicle"&&"➕ Add Vehicle"}{modalType==="driver"&&"➕ Add Driver"}
                {modalType==="order"&&"📦 Create Order"}{modalType==="warehouse"&&"🏭 Add Warehouse"}{modalType==="inventory"&&"📦 Add Item"}
              </h2>
              <form onSubmit={handleSubmit}>
                {modalType==="vehicle"&&(<>
                  <input type="text" placeholder="Registration (e.g. CA123456)" onChange={e=>setFormData({...formData,registration:e.target.value.toUpperCase()})} style={styles.modalInput} required/>
                  <input type="text" placeholder="Make" onChange={e=>setFormData({...formData,make:e.target.value})} style={styles.modalInput} required/>
                  <input type="text" placeholder="Model" onChange={e=>setFormData({...formData,model:e.target.value})} style={styles.modalInput} required/>
                  <input type="number" step="any" placeholder="Latitude (blank = Cape Town)" onChange={e=>setFormData({...formData,latitude:e.target.value})} style={styles.modalInput}/>
                  <input type="number" step="any" placeholder="Longitude (blank = Cape Town)" onChange={e=>setFormData({...formData,longitude:e.target.value})} style={styles.modalInput}/>
                  <select onChange={e=>setFormData({...formData,status:e.target.value})} style={styles.modalInput}>
                    <option value="AVAILABLE">Available</option><option value="ON_ROUTE">On Route</option><option value="MAINTENANCE">Maintenance</option>
                  </select>
                </>)}
                {modalType==="driver"&&(<>
                  <input type="text" placeholder="Driver Name" onChange={e=>setFormData({...formData,name:e.target.value})} style={styles.modalInput} required/>
                  <input type="email" placeholder="Email" onChange={e=>setFormData({...formData,email:e.target.value})} style={styles.modalInput} required/>
                  <input type="tel" placeholder="Phone" onChange={e=>setFormData({...formData,phone:e.target.value})} style={styles.modalInput}/>
                  <div style={{fontWeight:"bold",margin:"8px 0 4px"}}>🚛 Assign Existing Vehicle</div>
                  <select onChange={e=>setFormData({...formData,vehicleId:e.target.value||null})} style={styles.modalInput}>
                    <option value="">-- Select existing vehicle --</option>
                    {vehicles.filter(v=>!v.driverId).map(v=><option key={v.id} value={v.id}>{v.registration} - {v.make} {v.model}</option>)}
                  </select>
                  <div style={{fontWeight:"bold",margin:"8px 0 4px"}}>➕ Or Create New Vehicle</div>
                  <input type="text" placeholder="Registration" onChange={e=>setFormData({...formData,vehicleRegistration:e.target.value})} style={styles.modalInput}/>
                  <input type="text" placeholder="Make" onChange={e=>setFormData({...formData,vehicleMake:e.target.value})} style={styles.modalInput}/>
                  <input type="text" placeholder="Model" onChange={e=>setFormData({...formData,vehicleModel:e.target.value})} style={styles.modalInput}/>
                  <input type="number" step="any" placeholder="Latitude (blank = Cape Town)" onChange={e=>setFormData({...formData,vehicleLatitude:e.target.value})} style={styles.modalInput}/>
                  <input type="number" step="any" placeholder="Longitude (blank = Cape Town)" onChange={e=>setFormData({...formData,vehicleLongitude:e.target.value})} style={styles.modalInput}/>
                </>)}
                {modalType==="order"&&(<>
                  <input type="text" placeholder="Customer Name" onChange={e=>setFormData({...formData,customerName:e.target.value})} style={styles.modalInput} required/>
                  <input type="email" placeholder="Customer Email" onChange={e=>setFormData({...formData,customerEmail:e.target.value})} style={styles.modalInput} required/>
                  <input type="tel" placeholder="Customer Phone" onChange={e=>setFormData({...formData,customerPhone:e.target.value})} style={styles.modalInput} required/>
                  <textarea placeholder="Delivery Address" onChange={e=>setFormData({...formData,deliveryAddress:e.target.value})} style={styles.modalTextarea} required/>
                  <textarea placeholder="Pickup Address" onChange={e=>setFormData({...formData,pickupAddress:e.target.value})} style={styles.modalTextarea} required/>
                  <select onChange={e=>setFormData({...formData,priority:e.target.value})} style={styles.modalInput}>
                    <option value="NORMAL">Normal</option><option value="HIGH">High</option><option value="URGENT">Urgent</option>
                  </select>
                  <div style={{fontWeight:"bold",margin:"8px 0 4px"}}>👤 Assign Driver (Optional)</div>
                  <select onChange={e=>{const d=drivers.find(x=>x.id===e.target.value);setFormData({...formData,driverId:e.target.value||null,vehicleId:d?.vehicle?.id||null})}} style={styles.modalInput}>
                    <option value="">-- Select Driver --</option>
                    {drivers.filter(d=>d.vehicle).map(d=><option key={d.id} value={d.id}>{d.name} - 🚛 {d.vehicle?.registration}</option>)}
                  </select>
                </>)}
                {modalType==="warehouse"&&(<>
                  <input type="text" placeholder="Name" onChange={e=>setFormData({...formData,name:e.target.value})} style={styles.modalInput} required/>
                  <input type="text" placeholder="Location" onChange={e=>setFormData({...formData,location:e.target.value})} style={styles.modalInput} required/>
                  <textarea placeholder="Address" onChange={e=>setFormData({...formData,address:e.target.value})} style={styles.modalTextarea} required/>
                  <input type="number" placeholder="Capacity" onChange={e=>setFormData({...formData,capacity:parseInt(e.target.value)})} style={styles.modalInput} required/>
                  <input type="text" placeholder="Manager" onChange={e=>setFormData({...formData,manager:e.target.value})} style={styles.modalInput}/>
                  <input type="tel" placeholder="Phone" onChange={e=>setFormData({...formData,phone:e.target.value})} style={styles.modalInput}/>
                </>)}
                {modalType==="inventory"&&(<>
                  <input type="text" placeholder="Item Name" onChange={e=>setFormData({...formData,name:e.target.value})} style={styles.modalInput} required/>
                  <input type="text" placeholder="SKU" onChange={e=>setFormData({...formData,sku:e.target.value.toUpperCase()})} style={styles.modalInput} required/>
                  <input type="text" placeholder="Category" onChange={e=>setFormData({...formData,category:e.target.value})} style={styles.modalInput} required/>
                  <input type="number" placeholder="Quantity" onChange={e=>setFormData({...formData,quantity:parseInt(e.target.value)})} style={styles.modalInput} required/>
                  <input type="number" step="0.01" placeholder="Unit Price" onChange={e=>setFormData({...formData,unitPrice:parseFloat(e.target.value)})} style={styles.modalInput} required/>
                  <select onChange={e=>setFormData({...formData,warehouseId:e.target.value})} style={styles.modalInput} required>
                    <option value="">Select Warehouse</option>
                    {warehouses.map(w=><option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                  <input type="number" placeholder="Min Stock" onChange={e=>setFormData({...formData,minStock:parseInt(e.target.value)})} style={styles.modalInput}/>
                  <input type="number" placeholder="Max Stock" onChange={e=>setFormData({...formData,maxStock:parseInt(e.target.value)})} style={styles.modalInput}/>
                </>)}
                <div style={styles.modalButtons}>
                  <button type="button" onClick={()=>setShowModal(false)} style={styles.modalCancel}>Cancel</button>
                  <button type="submit" style={styles.modalSubmit}>Create</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={styles.loginContainer}>
      <div style={styles.loginCard}>
        <div style={styles.loginHeader}>🚛 FleetMind</div>
        <form onSubmit={handleLogin}>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={styles.loginInput} required/>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" style={styles.loginInput} required/>
          {error&&<div style={styles.loginError}>{error}</div>}
          <button type="submit" disabled={loading} style={styles.loginButton}>{loading?"Signing in...":"Sign In"}</button>
        </form>
        <div style={styles.demoInfo}>admin@fleetmind.com / admin123</div>
      </div>
    </div>
  )
}

const getStatusStyle = (status) => {
  if (status==="COMPLETED"||status==="ACTIVE"||status==="AVAILABLE") return {background:"#d1fae5",color:"#065f46"}
  if (status==="IN_PROGRESS"||status==="ON_ROUTE") return {background:"#dbeafe",color:"#1e40af"}
  if (status==="MAINTENANCE") return {background:"#fed7aa",color:"#92400e"}
  if (status==="PENDING") return {background:"#fef3c7",color:"#92400e"}
  return {background:"#f3f4f6",color:"#374151"}
}

const styles = {
  app:{display:"flex",minHeight:"100vh",background:"#f1f5f9"},
  sidebar:{width:260,background:"#1e293b",color:"white",display:"flex",flexDirection:"column",position:"fixed",height:"100vh",zIndex:100},
  logo:{padding:"24px 20px",fontSize:20,fontWeight:"bold",borderBottom:"1px solid #334155"},
  nav:{flex:1,padding:"20px 0",overflowY:"auto"},
  navItem:{width:"100%",padding:"12px 20px",textAlign:"left",background:"none",border:"none",color:"#cbd5e1",cursor:"pointer",fontSize:14},
  navActive:{background:"#334155",color:"white"},
  userInfo:{padding:"16px",borderTop:"1px solid #334155",fontSize:14},
  logoutBtn:{marginTop:6,padding:"6px 12px",background:"#ef4444",border:"none",borderRadius:6,color:"white",cursor:"pointer",width:"100%"},
  notifBtn:{padding:"6px 12px",background:"#334155",border:"none",borderRadius:6,color:"white",cursor:"pointer",width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginBottom:6},
  badge2:{background:"#ef4444",color:"white",borderRadius:10,padding:"1px 6px",fontSize:11},
  notifPanel:{position:"fixed",top:0,right:0,width:320,height:"100vh",background:"white",boxShadow:"-2px 0 10px rgba(0,0,0,0.1)",zIndex:200,padding:20,overflowY:"auto"},
  main:{flex:1,marginLeft:260,padding:30},
  header:{marginBottom:25},
  headerTitle:{fontSize:26,fontWeight:"bold",marginBottom:4},
  statsGrid:{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24},
  statCard:{background:"white",padding:18,borderRadius:12,boxShadow:"0 1px 3px rgba(0,0,0,0.1)"},
  statIcon:{fontSize:28,marginBottom:6},
  statNum:{fontSize:26,fontWeight:"bold",color:"#1e293b"},
  statLabel:{fontSize:13,color:"#64748b",marginTop:2},
  statSub:{fontSize:11,color:"#94a3b8",marginTop:2},
  card:{background:"white",borderRadius:12,padding:20,marginBottom:20,boxShadow:"0 1px 3px rgba(0,0,0,0.1)"},
  cardTitle:{fontSize:16,fontWeight:"bold",marginBottom:15,color:"#1e293b"},
  cardHeader:{background:"white",borderRadius:12,padding:20,marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"},
  addBtn:{padding:"8px 16px",background:"#3b82f6",color:"white",border:"none",borderRadius:6,cursor:"pointer",fontWeight:"500"},
  listItem:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #f1f5f9"},
  statusBadge:{padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:"600"},
  vehicleGrid:{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12},
  vehicleCard:{background:"#f8fafc",padding:14,borderRadius:8,display:"flex",justifyContent:"space-between",alignItems:"center",border:"1px solid #e2e8f0"},
  driverCard:{background:"#f8fafc",padding:14,borderRadius:8,marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center",border:"1px solid #e2e8f0"},
  orderCard:{background:"white",padding:14,borderRadius:8,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center",border:"1px solid #e2e8f0",gap:10},
  inventoryCard:{background:"white",padding:14,borderRadius:8,marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center",border:"1px solid #e2e8f0"},
  analyticsRow:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #f1f5f9"},
  assignBtn:{padding:"5px 10px",background:"#3b82f6",color:"white",border:"none",borderRadius:5,cursor:"pointer",fontSize:12},
  completeBtn:{padding:"5px 10px",background:"#10b981",color:"white",border:"none",borderRadius:5,cursor:"pointer",fontSize:12},
  progressBtn:{padding:"5px 10px",background:"#f59e0b",color:"white",border:"none",borderRadius:5,cursor:"pointer",fontSize:12},
  smallBtn:{padding:"4px 8px",background:"#6366f1",color:"white",border:"none",borderRadius:5,cursor:"pointer",fontSize:11},
  mapCard:{background:"white",borderRadius:12,marginBottom:16,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.1)"},
  mapHeader:{padding:"14px 18px",background:"#f8fafc",borderBottom:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center"},
  mapContainer:{height:500,width:"100%"},
  mapFooter:{padding:"10px 18px",background:"#f8fafc",borderTop:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",fontSize:12,color:"#666"},
  updateBadge:{fontSize:11,color:"#3b82f6",background:"#dbeafe",padding:"3px 8px",borderRadius:4},
  dot:{display:"inline-block",width:10,height:10,borderRadius:"50%",marginRight:5},
  toast:{position:"fixed",top:20,right:20,padding:"12px 20px",borderRadius:8,color:"white",zIndex:9999,boxShadow:"0 4px 12px rgba(0,0,0,0.15)",maxWidth:350},
  modalOverlay:{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000},
  modal:{background:"white",borderRadius:12,padding:28,width:"90%",maxWidth:500,maxHeight:"85vh",overflowY:"auto"},
  modalTitle:{fontSize:18,fontWeight:"bold",marginBottom:16},
  modalInput:{width:"100%",padding:10,marginBottom:10,border:"1px solid #e2e8f0",borderRadius:6,fontSize:14,boxSizing:"border-box"},
  modalTextarea:{width:"100%",padding:10,marginBottom:10,border:"1px solid #e2e8f0",borderRadius:6,fontSize:14,minHeight:70,boxSizing:"border-box"},
  modalButtons:{display:"flex",gap:10,marginTop:16},
  modalCancel:{flex:1,padding:10,background:"#e2e8f0",border:"none",borderRadius:6,cursor:"pointer"},
  modalSubmit:{flex:1,padding:10,background:"#3b82f6",color:"white",border:"none",borderRadius:6,cursor:"pointer"},
  loginContainer:{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg, #667eea 0%, #764ba2 100%)"},
  loginCard:{background:"white",borderRadius:20,padding:40,width:"100%",maxWidth:400,textAlign:"center"},
  loginHeader:{fontSize:32,fontWeight:"bold",marginBottom:28},
  loginInput:{width:"100%",padding:12,marginBottom:14,border:"1px solid #ddd",borderRadius:8,fontSize:16,boxSizing:"border-box"},
  loginButton:{width:"100%",padding:12,background:"#667eea",color:"white",border:"none",borderRadius:8,fontSize:16,cursor:"pointer"},
  loginError:{background:"#fee2e2",color:"#dc2626",padding:10,borderRadius:8,marginBottom:14,fontSize:14},
  demoInfo:{marginTop:18,fontSize:12,color:"#666"}
}