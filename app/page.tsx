"use client"

import { useState, useEffect } from "react"
import { Truck, Users, Package, CheckCircle, BarChart2, TrendingUp, Warehouse, ClipboardList, Fuel, Wrench, Bell, MessageCircle, CreditCard, Camera, Sparkles, Lightbulb, Plug, Smartphone, BookOpen, FlaskConical, DollarSign, Clock, MapPin, RefreshCw, Trophy, Zap, Target, Map, Search, ShoppingCart, Printer, Lock, AlertTriangle, LogOut, Menu, X, ChevronRight, Activity, Settings } from "lucide-react"
import { FuelManagement } from "../components/FuelManagement"
import { MaintenanceScheduling } from "../components/MaintenanceScheduling"
import { NotificationSystem } from "../components/NotificationSystem"
import { RealTimeChat } from "../components/RealTimeChat"
import { APIDocumentation } from "../components/APIDocumentation"
import { AutomatedTesting } from "../components/AutomatedTesting"
import { PerformanceMonitoring } from "../components/PerformanceMonitoring"
import { InvoiceGeneration } from "../components/InvoiceGeneration"
import { ProofOfDelivery } from "../components/ProofOfDelivery"
import { DemandForecasting } from "../components/DemandForecasting"
import { CostAnalysis } from "../components/CostAnalysis"
import { BarcodeScanner } from "../components/BarcodeScanner"
import { APIIntegrations } from "../components/APIIntegrations"
import { DriverMobileApp } from "../components/DriverMobileApp"
import { t, languages } from "../lib/i18n"

const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const icons = { Truck, Users, Package, CheckCircle, BarChart2, TrendingUp, Warehouse, ClipboardList, Fuel, Wrench, Bell, MessageCircle, CreditCard, Camera, Sparkles, Lightbulb, Plug, Smartphone, BookOpen, FlaskConical, DollarSign, Clock, MapPin, RefreshCw, Trophy, Zap, Target, Map, Search, ShoppingCart, Printer, Lock, AlertTriangle, LogOut, Menu, X, ChevronRight, Activity, Settings }
  const C = icons[name]
  if (!C) return <span style={{fontSize:size}}>{name}</span>
  return <C size={size} color={color} />
}

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [lang, setLang] = useState("en")
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

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
           .forEach(order => addNotification("Order " + order.orderNumber + " completed!", "success"))
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
  const postData = async (url, data) => fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })

  const createVehicle = async (data) => { const res = await postData("/api/vehicles", data); if (res.ok) { showToast("Vehicle added!"); loadData(); setShowModal(false); setFormData({}) } else showToast("Failed", "error") }
  const createDriver = async (data) => { const res = await postData("/api/drivers", data); if (res.ok) { showToast("Driver added!"); loadData(); setShowModal(false); setFormData({}) } else showToast("Failed", "error") }
  const createOrder = async (data) => { const res = await postData("/api/orders", data); if (res.ok) { showToast("Order created!"); loadData(); setShowModal(false); setFormData({}) } else showToast("Failed", "error") }
  const createWarehouse = async (data) => { const res = await postData("/api/warehouses", data); if (res.ok) { showToast("Warehouse added!"); loadData(); setShowModal(false); setFormData({}) } else showToast("Failed", "error") }
  const createInventory = async (data) => { const res = await postData("/api/inventory", data); if (res.ok) { showToast("Item added!"); loadData(); setShowModal(false); setFormData({}) } else showToast("Failed", "error") }

  const updateOrderStatus = async (orderId, status) => {
    const res = await fetch("/api/orders/" + orderId, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) })
    if (res.ok) { if (status === "COMPLETED") addNotification("Order completed!", "success"); loadData() }
  }

  const assignOrderToDriver = async (orderId, driverId, vehicleId) => {
    const res = await fetch("/api/orders/" + orderId, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "IN_PROGRESS", driverId, vehicleId }) })
    if (res.ok) { showToast("Order assigned!"); loadData(); setSelectedOrder(null) }
  }

  const updateGPS = async () => {
    if (!selectedVehicle || !gpsData.latitude || !gpsData.longitude) return
    const res = await fetch("/api/vehicles/" + selectedVehicle.id + "/location", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ latitude: gpsData.latitude, longitude: gpsData.longitude }) })
    if (res.ok) { showToast("GPS updated!"); loadData(); setShowGpsModal(false) }
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
  const sidebarW = sidebarCollapsed ? 70 : 260

  const navSections = [
    { label: "OVERVIEW", items: [
      { id: "dashboard", label: "Dashboard", icon: "BarChart2" },
      { id: "analytics", label: "Analytics", icon: "TrendingUp" },
    ]},
    { label: "OPERATIONS", items: [
      { id: "fleet", label: "Fleet Tracking", icon: "Truck" },
      { id: "drivers", label: "Drivers", icon: "Users" },
      { id: "orders", label: "Orders", icon: "Package" },
    ]},
    { label: "WAREHOUSE", items: [
      { id: "warehouses", label: "Warehouses", icon: "Warehouse" },
      { id: "inventory", label: "Inventory", icon: "ClipboardList" },
      { id: "barcode", label: "Barcode Scanner", icon: "Search" },
    ]},
    { label: "VEHICLE MGMT", items: [
      { id: "fuel", label: "Fuel", icon: "Fuel" },
      { id: "maintenance", label: "Maintenance", icon: "Wrench" },
    ]},
    { label: "BUSINESS", items: [
      { id: "invoices", label: "Invoices", icon: "CreditCard" },
      { id: "costs", label: "Cost Analysis", icon: "Lightbulb" },
      { id: "forecasting", label: "Forecasting", icon: "Sparkles" },
    ]},
    { label: "COMMS", items: [
      { id: "notifications", label: "Notifications", icon: "Bell" },
      { id: "chat", label: "Team Chat", icon: "MessageCircle" },
      { id: "pod", label: "Proof of Delivery", icon: "Camera" },
    ]},
    { label: "INTEGRATIONS", items: [
      { id: "integrations", label: "API Integrations", icon: "Plug" },
      { id: "driver-app", label: "Driver App", icon: "Smartphone" },
    ]},
    { label: "DEVELOPER", items: [
      { id: "api-docs", label: "API Docs", icon: "BookOpen" },
      { id: "testing", label: "Testing", icon: "FlaskConical" },
      { id: "monitoring", label: "Monitoring", icon: "Activity" },
    ]},
  ]

  const getStatusStyle = (status) => {
    if (status === "COMPLETED" || status === "ACTIVE" || status === "AVAILABLE") return { background: "rgba(16,185,129,0.15)", color: "#34d399" }
    if (status === "IN_PROGRESS" || status === "ON_ROUTE") return { background: "rgba(99,102,241,0.15)", color: "#a5b4fc" }
    if (status === "MAINTENANCE") return { background: "rgba(245,158,11,0.15)", color: "#fbbf24" }
    if (status === "PENDING") return { background: "rgba(245,158,11,0.1)", color: "#f59e0b" }
    return { background: "rgba(255,255,255,0.05)", color: "#94a3b8" }
  }

  const darkInput = { width: "100%", padding: "11px 14px", marginBottom: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 10, fontSize: 14, color: "#e2e8f0", outline: "none", boxSizing: "border-box" as const, fontFamily: "system-ui,sans-serif" }
  const modalOverlay = { position: "fixed" as const, top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(10px)" }
  const modalBox = { background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 20, padding: 32, width: "90%", maxWidth: 480, maxHeight: "85vh", overflowY: "auto" as const, border: "1px solid rgba(99,102,241,0.2)", boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }
  const componentWrapper = { background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 16, padding: 24, border: "1px solid rgba(99,102,241,0.15)", color: "#e2e8f0" }

  if (isLoggedIn && user) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", background: "#0a0f1e", fontFamily: "system-ui,-apple-system,sans-serif" }}>

        {/* TOAST */}
        {notification.show && (
          <div style={{ position: "fixed", top: 24, right: 24, padding: "14px 22px", borderRadius: 12, color: "white", zIndex: 9999, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", background: notification.type === "error" ? "linear-gradient(135deg,#ef4444,#dc2626)" : notification.type === "warning" ? "linear-gradient(135deg,#f59e0b,#d97706)" : "linear-gradient(135deg,#10b981,#059669)", display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: "500" }}>
            <Icon name={notification.type === "error" ? "X" : notification.type === "warning" ? "AlertTriangle" : "CheckCircle"} size={16} />
            {notification.message}
          </div>
        )}

        {/* SIDEBAR */}
        <div style={{ width: sidebarW, background: "linear-gradient(180deg,#0d1526 0%,#0a0f1e 100%)", borderRight: "1px solid rgba(99,102,241,0.15)", display: "flex", flexDirection: "column", position: "fixed", height: "100vh", zIndex: 100, transition: "width 0.3s ease", overflow: "hidden" }}>
          <div style={{ padding: "20px 16px", borderBottom: "1px solid rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 72 }}>
            {!sidebarCollapsed && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(99,102,241,0.4)" }}>
                  <Truck size={20} color="white" />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: "800", color: "white", letterSpacing: "-0.5px" }}>FleetMind</div>
                  <div style={{ fontSize: 10, color: "#6366f1", fontWeight: "600", letterSpacing: "1px" }}>PRO EDITION</div>
                </div>
              </div>
            )}
            {sidebarCollapsed && (
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
                <Truck size={20} color="white" />
              </div>
            )}
            {!sidebarCollapsed && <button onClick={() => setSidebarCollapsed(true)} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", padding: 4 }}><X size={16} /></button>}
            {sidebarCollapsed && <button onClick={() => setSidebarCollapsed(false)} style={{ position: "absolute", right: -12, top: 20, background: "#1e293b", border: "1px solid rgba(99,102,241,0.3)", color: "#6366f1", cursor: "pointer", fontSize: 12, padding: "4px 6px", borderRadius: 6 }}><ChevronRight size={12} /></button>}
          </div>

          <nav style={{ flex: 1, overflowY: "auto", padding: "12px 0" }}>
            {navSections.map(section => (
              <div key={section.label}>
                {!sidebarCollapsed && <div style={{ padding: "12px 16px 4px", fontSize: 10, fontWeight: "700", color: "#334155", letterSpacing: "1.5px" }}>{section.label}</div>}
                {section.items.map(item => (
                  <button key={item.id} onClick={() => setActiveTab(item.id)} style={{ width: "100%", padding: sidebarCollapsed ? "12px" : "10px 16px", textAlign: "left", background: activeTab === item.id ? "linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.1))" : "none", border: "none", borderLeft: activeTab === item.id ? "3px solid #6366f1" : "3px solid transparent", color: activeTab === item.id ? "#a5b4fc" : "#64748b", cursor: "pointer", fontSize: 13, fontWeight: activeTab === item.id ? "600" : "400", display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s", justifyContent: sidebarCollapsed ? "center" : "flex-start" }}>
                    <Icon name={item.icon} size={16} color={activeTab === item.id ? "#a5b4fc" : "#64748b"} />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                    {!sidebarCollapsed && activeTab === item.id && <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#6366f1" }}></span>}
                  </button>
                ))}
              </div>
            ))}
          </nav>

          <div style={{ padding: "16px", borderTop: "1px solid rgba(99,102,241,0.15)" }}>
            {!sidebarCollapsed && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: "bold", color: "white" }}>{user.name?.charAt(0) || "A"}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: "600", color: "#e2e8f0" }}>{user.name}</div>
                    <div style={{ fontSize: 11, color: "#475569" }}>{user.email}</div>
                  </div>
                </div>
                <button onClick={() => setShowNotifPanel(!showNotifPanel)} style={{ width: "100%", padding: "8px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, color: "#a5b4fc", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 8 }}>
                  <Bell size={14} /> Notifications {notifications.length > 0 && <span style={{ background: "#ef4444", color: "white", borderRadius: 10, padding: "1px 6px", fontSize: 10 }}>{notifications.length}</span>}
                </button>
                <button onClick={handleLogout} style={{ width: "100%", padding: "8px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, color: "#f87171", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* NOTIFICATIONS PANEL */}
        {showNotifPanel && (
          <div style={{ position: "fixed", top: 0, right: 0, width: 340, height: "100vh", background: "#0d1526", borderLeft: "1px solid rgba(99,102,241,0.2)", zIndex: 200, padding: 24, overflowY: "auto", boxShadow: "-10px 0 40px rgba(0,0,0,0.5)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <div style={{ fontWeight: "700", fontSize: 16, color: "white" }}>Notifications</div>
                <div style={{ fontSize: 12, color: "#475569" }}>{notifications.length} alerts</div>
              </div>
              <button onClick={() => { setNotifications([]); setShowNotifPanel(false) }} style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, color: "#6366f1", cursor: "pointer", padding: "6px 12px", fontSize: 12 }}>Clear All</button>
            </div>
            {notifications.length === 0 && <div style={{ color: "#334155", textAlign: "center", padding: 40, fontSize: 14 }}>No notifications yet</div>}
            {notifications.map(n => (
              <div key={n.id} style={{ padding: 14, borderRadius: 10, marginBottom: 10, background: n.type === "success" ? "rgba(16,185,129,0.1)" : n.type === "error" ? "rgba(239,68,68,0.1)" : "rgba(99,102,241,0.1)", border: "1px solid " + (n.type === "success" ? "rgba(16,185,129,0.2)" : n.type === "error" ? "rgba(239,68,68,0.2)" : "rgba(99,102,241,0.2)") }}>
                <div style={{ fontSize: 13, color: "#e2e8f0" }}>{n.message}</div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>{n.time}</div>
              </div>
            ))}
          </div>
        )}

        {/* MAIN */}
        <div style={{ flex: 1, marginLeft: sidebarW, transition: "margin-left 0.3s ease", minHeight: "100vh" }}>

          {/* TOP BAR */}
          <div style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,15,30,0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(99,102,241,0.1)", padding: "14px 30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: "800", color: "white", letterSpacing: "-0.5px" }}>{activeTab.toUpperCase().replace(/-/g, " ")}</h1>
              <div style={{ fontSize: 12, color: "#475569", marginTop: 1 }}>Welcome back, {user.name} - {time.toLocaleTimeString()}</div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <select value={lang} onChange={e => setLang(e.target.value)} style={{ padding: "8px 12px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 10, color: "#a5b4fc", fontSize: 13, cursor: "pointer" }}>
                {Object.entries(languages).map(([c, l]: [string, any]) => <option key={c} value={c}>{l.flag} {l.name}</option>)}
              </select>
              <button onClick={() => openModal("order")} style={{ padding: "9px 18px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 10, color: "white", cursor: "pointer", fontSize: 13, fontWeight: "600", boxShadow: "0 4px 15px rgba(99,102,241,0.3)", display: "flex", alignItems: "center", gap: 6 }}>
                <Package size={14} /> New Order
              </button>
              <button onClick={() => openModal("driver")} style={{ padding: "9px 18px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 10, color: "#a5b4fc", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                <Users size={14} /> Add Driver
              </button>
              <button onClick={loadData} style={{ padding: "9px 14px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 10, color: "#6366f1", cursor: "pointer" }}>
                <RefreshCw size={16} />
              </button>
            </div>
          </div>

          <div style={{ padding: 30 }}>

            {/* DASHBOARD */}
            {activeTab === "dashboard" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 24 }}>
                  {[
                    { label: "Total Vehicles", value: vehicles.length, sub: vehicles.filter(v => v.status === "ON_ROUTE").length + " on route", icon: "Truck", grad: "linear-gradient(135deg,#6366f1,#8b5cf6)", glow: "rgba(99,102,241,0.3)" },
                    { label: "Active Drivers", value: drivers.length, sub: drivers.filter(d => d.vehicle).length + " assigned", icon: "Users", grad: "linear-gradient(135deg,#10b981,#059669)", glow: "rgba(16,185,129,0.3)" },
                    { label: "Total Orders", value: orders.length, sub: orders.filter(o => o.status === "PENDING").length + " pending", icon: "Package", grad: "linear-gradient(135deg,#f59e0b,#d97706)", glow: "rgba(245,158,11,0.3)" },
                    { label: "Completed", value: orders.filter(o => o.status === "COMPLETED").length, sub: (analytics?.completionRate || 0) + "% rate", icon: "CheckCircle", grad: "linear-gradient(135deg,#ec4899,#db2777)", glow: "rgba(236,72,153,0.3)" },
                  ].map((s, i) => (
                    <div key={i} style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 16, padding: 24, border: "1px solid rgba(99,102,241,0.15)", position: "relative", overflow: "hidden", boxShadow: "0 0 30px " + s.glow }}>
                      <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: s.grad, opacity: 0.15 }}></div>
                      <div style={{ position: "absolute", top: 0, right: 0, width: 3, height: "100%", background: s.grad, borderRadius: "0 16px 16px 0" }}></div>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: s.grad, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, boxShadow: "0 4px 15px " + s.glow }}>
                        <Icon name={s.icon} size={22} color="white" />
                      </div>
                      <div style={{ fontSize: 36, fontWeight: "800", color: "white", letterSpacing: "-1px", lineHeight: 1 }}>{s.value}</div>
                      <div style={{ fontSize: 13, fontWeight: "600", color: "#94a3b8", marginTop: 6 }}>{s.label}</div>
                      <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>{s.sub}</div>
                      <div style={{ position: "absolute", bottom: 16, right: 16, padding: "4px 10px", borderRadius: 20, background: s.grad, fontSize: 10, fontWeight: "700", color: "white", opacity: 0.9 }}>LIVE</div>
                    </div>
                  ))}
                </div>

                {/* REVENUE BANNER */}
                <div style={{ background: "linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#ec4899 100%)", borderRadius: 20, padding: "28px 32px", marginBottom: 24, position: "relative", overflow: "hidden", boxShadow: "0 20px 60px rgba(99,102,241,0.3)" }}>
                  <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }}></div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: "600", color: "rgba(255,255,255,0.7)", letterSpacing: "2px", marginBottom: 8 }}>ESTIMATED REVENUE</div>
                      <div style={{ fontSize: 48, fontWeight: "900", color: "white", letterSpacing: "-2px", lineHeight: 1 }}>R{((analytics?.totalRevenue) || 0).toLocaleString()}</div>
                      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginTop: 8 }}>Based on {orders.filter(o => o.status === "COMPLETED").length} completed deliveries at R1,500/order</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <DollarSign size={52} color="rgba(255,255,255,0.3)" />
                      <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 12, padding: "10px 20px", backdropFilter: "blur(10px)", marginTop: 8 }}>
                        <div style={{ fontSize: 24, fontWeight: "800", color: "white" }}>{analytics?.completionRate || 0}%</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>Success Rate</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 24 }}>
                  <div style={{ gridColumn: "span 2", background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 16, padding: 24, border: "1px solid rgba(99,102,241,0.15)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: "700", color: "white", display: "flex", alignItems: "center", gap: 8 }}><Package size={18} color="#6366f1" /> Recent Orders</div>
                        <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>Latest delivery activity</div>
                      </div>
                      <button onClick={() => setActiveTab("orders")} style={{ padding: "6px 14px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, color: "#6366f1", cursor: "pointer", fontSize: 12 }}>View All</button>
                    </div>
                    {orders.length === 0 && <div style={{ textAlign: "center", padding: 30, color: "#334155", fontSize: 14 }}>No orders yet. Create your first order!</div>}
                    {orders.slice(0, 6).map(o => (
                      <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(99,102,241,0.08)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: o.status === "COMPLETED" ? "rgba(16,185,129,0.1)" : o.status === "IN_PROGRESS" ? "rgba(99,102,241,0.1)" : "rgba(245,158,11,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Package size={16} color={o.status === "COMPLETED" ? "#10b981" : o.status === "IN_PROGRESS" ? "#6366f1" : "#f59e0b"} />
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: "600", color: "#e2e8f0" }}>{o.orderNumber}</div>
                            <div style={{ fontSize: 11, color: "#475569" }}>{o.customerName}</div>
                          </div>
                        </div>
                        <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: "600", ...getStatusStyle(o.status) }}>{o.status}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 16, padding: 24, border: "1px solid rgba(99,102,241,0.15)" }}>
                    <div style={{ fontSize: 16, fontWeight: "700", color: "white", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}><Truck size={18} color="#6366f1" /> Fleet Status</div>
                    <div style={{ fontSize: 12, color: "#475569", marginBottom: 20 }}>Real-time overview</div>
                    {[
                      { label: "On Route", count: vehicles.filter(v => v.status === "ON_ROUTE").length, total: vehicles.length, color: "#6366f1" },
                      { label: "Available", count: vehicles.filter(v => v.status === "AVAILABLE").length, total: vehicles.length, color: "#10b981" },
                      { label: "Maintenance", count: vehicles.filter(v => v.status === "MAINTENANCE").length, total: vehicles.length, color: "#f59e0b" },
                    ].map(s => (
                      <div key={s.label} style={{ marginBottom: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontSize: 12, color: "#94a3b8" }}>{s.label}</span>
                          <span style={{ fontSize: 12, fontWeight: "700", color: "white" }}>{s.count}/{s.total}</span>
                        </div>
                        <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: (s.total > 0 ? (s.count / s.total) * 100 : 0) + "%", background: s.color, borderRadius: 3, boxShadow: "0 0 8px " + s.color }}></div>
                        </div>
                      </div>
                    ))}
                    <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(99,102,241,0.1)" }}>
                      <div style={{ fontSize: 12, color: "#475569", marginBottom: 10 }}>Active Vehicles</div>
                      {vehicles.slice(0, 3).map(v => (
                        <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: v.status === "ON_ROUTE" ? "#6366f1" : v.status === "AVAILABLE" ? "#10b981" : "#f59e0b", boxShadow: "0 0 6px " + (v.status === "ON_ROUTE" ? "#6366f1" : v.status === "AVAILABLE" ? "#10b981" : "#f59e0b") }}></div>
                          <span style={{ fontSize: 12, color: "#94a3b8", flex: 1 }}>{v.registration}</span>
                          <span style={{ fontSize: 11, color: "#475569" }}>{v.driver?.name || "Unassigned"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* QUICK ACTIONS */}
                <div style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 16, padding: 24, border: "1px solid rgba(99,102,241,0.15)" }}>
                  <div style={{ fontSize: 16, fontWeight: "700", color: "white", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}><Zap size={18} color="#6366f1" /> Quick Actions</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12 }}>
                    {[
                      { label: "New Order", icon: "Package", action: () => openModal("order"), color: "#6366f1" },
                      { label: "Add Driver", icon: "Users", action: () => openModal("driver"), color: "#10b981" },
                      { label: "Add Vehicle", icon: "Truck", action: () => openModal("vehicle"), color: "#8b5cf6" },
                      { label: "Fleet Map", icon: "Map", action: () => setActiveTab("fleet"), color: "#f59e0b" },
                      { label: "Analytics", icon: "TrendingUp", action: () => setActiveTab("analytics"), color: "#ec4899" },
                      { label: "Invoices", icon: "CreditCard", action: () => setActiveTab("invoices"), color: "#14b8a6" },
                    ].map(a => (
                      <button key={a.label} onClick={a.action} style={{ padding: "16px 8px", background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.1)", borderRadius: 12, cursor: "pointer", textAlign: "center", color: a.color, transition: "all 0.2s", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                        <Icon name={a.icon} size={24} color={a.color} />
                        <div style={{ fontSize: 11, fontWeight: "600" }}>{a.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "analytics" && analytics && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 24 }}>
                  {[
                    { label: "Est. Revenue", value: "R" + (analytics.totalRevenue || 0).toLocaleString(), icon: "DollarSign", color: "#10b981" },
                    { label: "Completion Rate", value: (analytics.completionRate || 0) + "%", icon: "TrendingUp", color: "#6366f1" },
                    { label: "Pending Orders", value: analytics.pendingOrders || 0, icon: "Clock", color: "#f59e0b" },
                    { label: "Inventory Value", value: "R" + (analytics.totalInventoryValue || 0).toLocaleString(), icon: "Package", color: "#ec4899" },
                  ].map((s, i) => (
                    <div key={i} style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 16, padding: 24, border: "1px solid rgba(99,102,241,0.15)", boxShadow: "0 0 20px " + s.color + "20" }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: s.color + "20", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                        <Icon name={s.icon} size={22} color={s.color} />
                      </div>
                      <div style={{ fontSize: 28, fontWeight: "800", color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  {[
                    { title: "Vehicle Breakdown", items: [["On Route", analytics.activeVehicles, "#6366f1"], ["Available", analytics.availableVehicles, "#10b981"], ["Maintenance", analytics.maintenanceVehicles, "#f59e0b"]], total: analytics.totalVehicles },
                    { title: "Order Breakdown", items: [["Completed", analytics.completedOrders, "#10b981"], ["In Progress", analytics.inProgressOrders, "#6366f1"], ["Pending", analytics.pendingOrders, "#f59e0b"]], total: analytics.totalOrders },
                  ].map(card => (
                    <div key={card.title} style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 16, padding: 24, border: "1px solid rgba(99,102,241,0.15)" }}>
                      <div style={{ fontSize: 15, fontWeight: "700", color: "white", marginBottom: 20 }}>{card.title}</div>
                      {card.items.map(([label, count, color]) => (
                        <div key={label} style={{ marginBottom: 16 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                            <span style={{ fontSize: 13, color: "#94a3b8" }}>{label}</span>
                            <span style={{ fontSize: 13, fontWeight: "700", color: "white" }}>{count}</span>
                          </div>
                          <div style={{ height: 8, background: "rgba(255,255,255,0.05)", borderRadius: 4 }}>
                            <div style={{ height: "100%", width: (card.total > 0 ? (count as number / card.total) * 100 : 0) + "%", background: "linear-gradient(90deg," + color + "," + color + "aa)", borderRadius: 4, boxShadow: "0 0 10px " + color + "60" }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "fleet" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div style={{ fontSize: 14, color: "#475569" }}>{vehiclesWithCoords.length} vehicles tracked live</div>
                  <button onClick={() => openModal("vehicle")} style={{ padding: "10px 20px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 10, color: "white", cursor: "pointer", fontSize: 13, fontWeight: "600", display: "flex", alignItems: "center", gap: 6 }}>
                    <Truck size={14} /> Add Vehicle
                  </button>
                </div>
                <div style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 16, marginBottom: 20, overflow: "hidden", border: "1px solid rgba(99,102,241,0.15)" }}>
                  <div style={{ padding: "14px 20px", background: "rgba(99,102,241,0.05)", borderBottom: "1px solid rgba(99,102,241,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 20 }}>
                      {[["On Route", "#6366f1"], ["Available", "#10b981"], ["Maintenance", "#f59e0b"]].map(([label, color]) => (
                        <span key={label} style={{ fontSize: 13, color: "#94a3b8", display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, display: "inline-block", boxShadow: "0 0 8px " + color }}></span>{label}
                        </span>
                      ))}
                    </div>
                    <span style={{ fontSize: 11, color: "#6366f1", background: "rgba(99,102,241,0.1)", padding: "4px 10px", borderRadius: 20 }}>Live 15s refresh</span>
                  </div>
                  <div style={{ height: 500 }}>
                    <iframe
                      key={JSON.stringify(vehiclesWithCoords.map(v => ({ id: v.id, lat: v.latitude, lng: v.longitude, status: v.status })))}
                      title="Fleet Map" width="100%" height="100%" frameBorder="0"
                      srcDoc={"<!DOCTYPE html><html><head><link rel='stylesheet' href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'/><script src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'></script><style>body{margin:0}#map{height:100vh;width:100vw}</style></head><body><div id='map'></div><script>var map=L.map('map').setView([-33.9249,18.4241],11);L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{attribution:'OSM',subdomains:'abcd',maxZoom:19}).addTo(map);var bounds=L.latLngBounds([]);" + vehiclesWithCoords.map(v => { const c = v.status === "ON_ROUTE" ? "#6366f1" : v.status === "AVAILABLE" ? "#10b981" : "#f59e0b"; return "var m=L.marker([" + v.latitude + "," + v.longitude + "],{icon:L.divIcon({html:'<div style=\"background:" + c + ";width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;border:3px solid white;box-shadow:0 0 20px " + c + ";\">&#128667;</div>',iconSize:[44,44],className:''})}).addTo(map);m.bindPopup('<strong>" + v.registration + "</strong><br/>" + v.make + " " + v.model + "<br/><span style=\"color:" + c + ";\">" + v.status + "</span>" + (v.driver ? "<br/>Driver: " + v.driver.name : "") + "');bounds.extend([" + v.latitude + "," + v.longitude + "]);"; }).join("") + "if(bounds.isValid())map.fitBounds(bounds.pad(0.1));</script></body></html>"}
                      style={{ border: 0, width: "100%", height: "100%" }}
                    />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
                  {vehicles.map(v => (
                    <div key={v.id} style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 14, padding: 18, border: "1px solid rgba(99,102,241,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: v.status === "ON_ROUTE" ? "rgba(99,102,241,0.15)" : v.status === "AVAILABLE" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Truck size={22} color={v.status === "ON_ROUTE" ? "#6366f1" : v.status === "AVAILABLE" ? "#10b981" : "#f59e0b"} />
                        </div>
                        <div>
                          <div style={{ fontWeight: "700", color: "white", fontSize: 14 }}>{v.registration}</div>
                          <div style={{ fontSize: 12, color: "#475569" }}>{v.make} {v.model}</div>
                          {v.latitude && v.longitude ? <div style={{ fontSize: 11, color: "#6366f1", marginTop: 2 }}>{v.latitude.toFixed(4)}, {v.longitude.toFixed(4)}</div> : <div style={{ fontSize: 11, color: "#f59e0b", marginTop: 2 }}>No coordinates</div>}
                          {v.driver && <div style={{ fontSize: 11, color: "#10b981", marginTop: 2 }}>{v.driver.name}</div>}
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                        <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: "700", ...getStatusStyle(v.status) }}>{v.status}</span>
                        <button onClick={() => { setSelectedVehicle(v); setGpsData({ latitude: v.latitude || "", longitude: v.longitude || "" }); setShowGpsModal(true) }} style={{ padding: "5px 12px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, color: "#6366f1", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
                          <MapPin size={10} /> GPS
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "drivers" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div style={{ fontSize: 14, color: "#475569" }}>{drivers.length} total drivers</div>
                  <button onClick={() => openModal("driver")} style={{ padding: "10px 20px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 10, color: "white", cursor: "pointer", fontSize: 13, fontWeight: "600", display: "flex", alignItems: "center", gap: 6 }}>
                    <Users size={14} /> Add Driver
                  </button>
                </div>
                <div style={{ marginBottom: 8, fontSize: 13, fontWeight: "600", color: "#10b981", display: "flex", alignItems: "center", gap: 6 }}><CheckCircle size={14} color="#10b981" /> Assigned Drivers</div>
                {drivers.filter(d => d.vehicle).map(d => (
                  <div key={d.id} style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 14, padding: 18, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid rgba(16,185,129,0.15)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: "bold", color: "white" }}>{d.name.charAt(0)}</div>
                      <div>
                        <div style={{ fontWeight: "700", color: "white" }}>{d.name}</div>
                        <div style={{ fontSize: 12, color: "#475569" }}>{d.email} | {d.phone}</div>
                        <div style={{ fontSize: 11, color: "#6366f1", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}><Truck size={10} /> {d.vehicle?.registration} - {d.vehicle?.make} {d.vehicle?.model}</div>
                      </div>
                    </div>
                    <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: "700", ...getStatusStyle(d.status) }}>{d.status}</span>
                  </div>
                ))}
                {drivers.filter(d => !d.vehicle).length > 0 && (
                  <>
                    <div style={{ marginTop: 20, marginBottom: 12, fontSize: 13, fontWeight: "600", color: "#f59e0b", display: "flex", alignItems: "center", gap: 6 }}><AlertTriangle size={14} color="#f59e0b" /> Unassigned Drivers</div>
                    {drivers.filter(d => !d.vehicle).map(d => (
                      <div key={d.id} style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 14, padding: 18, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid rgba(245,158,11,0.1)", opacity: 0.7 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: "bold", color: "#f59e0b" }}>{d.name.charAt(0)}</div>
                          <div>
                            <div style={{ fontWeight: "700", color: "white" }}>{d.name}</div>
                            <div style={{ fontSize: 12, color: "#475569" }}>{d.email} | {d.phone}</div>
                            <div style={{ fontSize: 11, color: "#f59e0b", marginTop: 2 }}>No vehicle assigned</div>
                          </div>
                        </div>
                        <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: "700", ...getStatusStyle(d.status) }}>{d.status}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div style={{ fontSize: 14, color: "#475569" }}>{orders.length} total orders</div>
                  <button onClick={() => openModal("order")} style={{ padding: "10px 20px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 10, color: "white", cursor: "pointer", fontSize: 13, fontWeight: "600", display: "flex", alignItems: "center", gap: 6 }}>
                    <Package size={14} /> Create Order
                  </button>
                </div>
                {orders.map(o => (
                  <div key={o.id} style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 14, padding: 18, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid rgba(99,102,241,0.1)" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                        <span style={{ fontWeight: "700", color: "white", fontSize: 14 }}>{o.orderNumber}</span>
                        <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: "600", ...getStatusStyle(o.status) }}>{o.status}</span>
                        <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, background: "rgba(99,102,241,0.1)", color: "#6366f1", fontWeight: "600" }}>{o.priority}</span>
                      </div>
                      <div style={{ fontSize: 13, color: "#94a3b8" }}>{o.customerName} | {o.customerPhone}</div>
                      <div style={{ fontSize: 12, color: "#475569", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}><MapPin size={10} /> {o.deliveryAddress}</div>
                      {o.driver && <div style={{ fontSize: 11, color: "#10b981", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}><Users size={10} /> {o.driver.name}{o.vehicle ? " | " + o.vehicle.registration : ""}</div>}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 120 }}>
                      {o.status === "PENDING" && <button onClick={() => setSelectedOrder(o)} style={{ padding: "7px 14px", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 8, color: "#a5b4fc", cursor: "pointer", fontSize: 12 }}>Assign Driver</button>}
                      {o.status === "PENDING" && <button onClick={() => updateOrderStatus(o.id, "IN_PROGRESS")} style={{ padding: "7px 14px", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 8, color: "#fbbf24", cursor: "pointer", fontSize: 12 }}>Start</button>}
                      {o.status === "IN_PROGRESS" && <button onClick={() => updateOrderStatus(o.id, "COMPLETED")} style={{ padding: "7px 14px", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, color: "#34d399", cursor: "pointer", fontSize: 12 }}>Complete</button>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "warehouses" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div style={{ fontSize: 14, color: "#475569" }}>{warehouses.length} warehouses</div>
                  <button onClick={() => openModal("warehouse")} style={{ padding: "10px 20px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 10, color: "white", cursor: "pointer", fontSize: 13, fontWeight: "600" }}>+ Add Warehouse</button>
                </div>
                <div style={{ display: "grid", gap: 16 }}>
                  {warehouses.map(w => (
                    <div key={w.id} style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 14, padding: 20, border: "1px solid rgba(99,102,241,0.1)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Warehouse size={22} color="#6366f1" />
                          </div>
                          <div>
                            <div style={{ fontSize: 16, fontWeight: "700", color: "white" }}>{w.name}</div>
                            <div style={{ fontSize: 13, color: "#475569" }}>{w.location} | {w.address}</div>
                            <div style={{ fontSize: 12, color: "#64748b" }}>Manager: {w.manager || "N/A"}</div>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 12, color: "#475569" }}>Capacity</div>
                          <div style={{ fontSize: 18, fontWeight: "700", color: "#6366f1" }}>{w.currentStock || 0}/{w.capacity}</div>
                          <div style={{ width: 80, height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, marginTop: 6 }}>
                            <div style={{ height: "100%", width: (w.capacity ? (w.currentStock || 0) / w.capacity * 100 : 0) + "%", background: "linear-gradient(90deg,#6366f1,#8b5cf6)", borderRadius: 3 }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "inventory" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div style={{ fontSize: 14, color: "#475569" }}>{inventory.length} items</div>
                  <button onClick={() => openModal("inventory")} style={{ padding: "10px 20px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 10, color: "white", cursor: "pointer", fontSize: 13, fontWeight: "600" }}>+ Add Item</button>
                </div>
                {inventory.map(i => (
                  <div key={i.id} style={{ background: "linear-gradient(135deg,#0d1526,#111827)", borderRadius: 14, padding: 18, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid rgba(99,102,241,0.1)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: i.quantity <= i.minStock ? "rgba(239,68,68,0.1)" : "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Package size={18} color={i.quantity <= i.minStock ? "#ef4444" : "#6366f1"} />
                      </div>
                      <div>
                        <div style={{ fontWeight: "700", color: "white" }}>{i.name}</div>
                        <div style={{ fontSize: 12, color: "#475569" }}>SKU: {i.sku} | {i.category}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: "700", color: "#10b981", fontSize: 16 }}>R{i.unitPrice}</div>
                      <div style={{ fontSize: 12, color: "#475569" }}>Stock: {i.quantity}</div>
                      {i.quantity <= i.minStock && <div style={{ fontSize: 11, color: "#ef4444", fontWeight: "600" }}>LOW STOCK</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "fuel" && <div style={componentWrapper}><FuelManagement /></div>}
            {activeTab === "maintenance" && <div style={componentWrapper}><MaintenanceScheduling /></div>}
            {activeTab === "notifications" && <div style={componentWrapper}><NotificationSystem /></div>}
            {activeTab === "chat" && <div style={componentWrapper}><RealTimeChat /></div>}
            {activeTab === "invoices" && <div style={componentWrapper}><InvoiceGeneration /></div>}
            {activeTab === "pod" && <div style={componentWrapper}><ProofOfDelivery /></div>}
            {activeTab === "forecasting" && <div style={componentWrapper}><DemandForecasting /></div>}
            {activeTab === "costs" && <div style={componentWrapper}><CostAnalysis /></div>}
            {activeTab === "barcode" && <div style={componentWrapper}><BarcodeScanner /></div>}
            {activeTab === "integrations" && <div style={componentWrapper}><APIIntegrations /></div>}
            {activeTab === "driver-app" && <div style={componentWrapper}><DriverMobileApp /></div>}
            {activeTab === "api-docs" && <div style={componentWrapper}><APIDocumentation /></div>}
            {activeTab === "testing" && <div style={componentWrapper}><AutomatedTesting /></div>}
            {activeTab === "monitoring" && <div style={componentWrapper}><PerformanceMonitoring /></div>}

          </div>
        </div>

        {/* ASSIGN DRIVER MODAL */}
        {selectedOrder && (
          <div style={modalOverlay} onClick={() => setSelectedOrder(null)}>
            <div style={modalBox} onClick={e => e.stopPropagation()}>
              <h2 style={{ fontSize: 18, fontWeight: "700", color: "white", marginBottom: 6 }}>Assign Driver</h2>
              <p style={{ color: "#475569", marginBottom: 20, fontSize: 13 }}>Order: {selectedOrder.orderNumber} | {selectedOrder.customerName}</p>
              {drivers.filter(d => d.vehicle).map(d => (
                <div key={d.id} style={{ padding: 14, borderRadius: 10, marginBottom: 10, border: "1px solid rgba(99,102,241,0.2)", cursor: "pointer", background: "rgba(99,102,241,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }} onClick={() => assignOrderToDriver(selectedOrder.id, d.id, d.vehicle?.id)}>
                  <div>
                    <div style={{ fontWeight: "600", color: "white" }}>{d.name}</div>
                    <div style={{ fontSize: 12, color: "#475569" }}>{d.email}</div>
                    <div style={{ fontSize: 11, color: "#6366f1", marginTop: 2 }}>{d.vehicle?.registration}</div>
                  </div>
                  <button style={{ padding: "6px 14px", background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 8, color: "#a5b4fc", cursor: "pointer", fontSize: 12 }}>Assign</button>
                </div>
              ))}
              {drivers.filter(d => d.vehicle).length === 0 && <p style={{ color: "#f59e0b", fontSize: 13 }}>No drivers with vehicles available.</p>}
              <button onClick={() => setSelectedOrder(null)} style={{ width: "100%", padding: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#94a3b8", cursor: "pointer", marginTop: 10 }}>Cancel</button>
            </div>
          </div>
        )}

        {/* GPS MODAL */}
        {showGpsModal && selectedVehicle && (
          <div style={modalOverlay} onClick={() => setShowGpsModal(false)}>
            <div style={modalBox} onClick={e => e.stopPropagation()}>
              <h2 style={{ fontSize: 18, fontWeight: "700", color: "white", marginBottom: 6 }}>Update GPS - {selectedVehicle.registration}</h2>
              <input type="number" step="any" placeholder="Latitude (e.g. -33.9249)" value={gpsData.latitude} onChange={e => setGpsData({ ...gpsData, latitude: e.target.value })} style={darkInput} />
              <input type="number" step="any" placeholder="Longitude (e.g. 18.4241)" value={gpsData.longitude} onChange={e => setGpsData({ ...gpsData, longitude: e.target.value })} style={darkInput} />
              <div style={{ fontSize: 12, color: "#475569", marginBottom: 16 }}>Right-click on Google Maps to copy coordinates.</div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setShowGpsModal(false)} style={{ flex: 1, padding: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#94a3b8", cursor: "pointer" }}>Cancel</button>
                <button onClick={updateGPS} style={{ flex: 1, padding: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 8, color: "white", cursor: "pointer", fontWeight: "600" }}>Update Location</button>
              </div>
            </div>
          </div>
        )}

        {/* CREATE MODAL */}
        {showModal && (
          <div style={modalOverlay} onClick={() => setShowModal(false)}>
            <div style={{ ...modalBox, maxWidth: 520 }} onClick={e => e.stopPropagation()}>
              <h2 style={{ fontSize: 18, fontWeight: "700", color: "white", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                {modalType === "vehicle" && <><Truck size={20} color="#6366f1" /> Add Vehicle</>}
                {modalType === "driver" && <><Users size={20} color="#6366f1" /> Add Driver</>}
                {modalType === "order" && <><Package size={20} color="#6366f1" /> Create Order</>}
                {modalType === "warehouse" && <><Warehouse size={20} color="#6366f1" /> Add Warehouse</>}
                {modalType === "inventory" && <><ClipboardList size={20} color="#6366f1" /> Add Item</>}
              </h2>
              <form onSubmit={handleSubmit}>
                {modalType === "vehicle" && (<>
                  <input type="text" placeholder="Registration (e.g. CA123456)" onChange={e => setFormData({ ...formData, registration: e.target.value.toUpperCase() })} style={darkInput} required />
                  <input type="text" placeholder="Make (e.g. Toyota)" onChange={e => setFormData({ ...formData, make: e.target.value })} style={darkInput} required />
                  <input type="text" placeholder="Model (e.g. Hilux)" onChange={e => setFormData({ ...formData, model: e.target.value })} style={darkInput} required />
                  <input type="number" step="any" placeholder="Latitude (blank = Cape Town)" onChange={e => setFormData({ ...formData, latitude: e.target.value })} style={darkInput} />
                  <input type="number" step="any" placeholder="Longitude (blank = Cape Town)" onChange={e => setFormData({ ...formData, longitude: e.target.value })} style={darkInput} />
                  <select onChange={e => setFormData({ ...formData, status: e.target.value })} style={darkInput}>
                    <option value="AVAILABLE">Available</option><option value="ON_ROUTE">On Route</option><option value="MAINTENANCE">Maintenance</option>
                  </select>
                </>)}
                {modalType === "driver" && (<>
                  <input type="text" placeholder="Full Name" onChange={e => setFormData({ ...formData, name: e.target.value })} style={darkInput} required />
                  <input type="email" placeholder="Email Address" onChange={e => setFormData({ ...formData, email: e.target.value })} style={darkInput} required />
                  <input type="tel" placeholder="Phone Number" onChange={e => setFormData({ ...formData, phone: e.target.value })} style={darkInput} />
                  <div style={{ fontSize: 12, fontWeight: "600", color: "#6366f1", margin: "8px 0 4px" }}>Assign Existing Vehicle</div>
                  <select onChange={e => setFormData({ ...formData, vehicleId: e.target.value || null })} style={darkInput}>
                    <option value="">-- Select vehicle --</option>
                    {vehicles.filter(v => !v.driverId).map(v => <option key={v.id} value={v.id}>{v.registration} - {v.make} {v.model}</option>)}
                  </select>
                  <div style={{ fontSize: 12, fontWeight: "600", color: "#6366f1", margin: "8px 0 4px" }}>Or Create New Vehicle</div>
                  <input type="text" placeholder="Registration" onChange={e => setFormData({ ...formData, vehicleRegistration: e.target.value })} style={darkInput} />
                  <input type="text" placeholder="Make" onChange={e => setFormData({ ...formData, vehicleMake: e.target.value })} style={darkInput} />
                  <input type="text" placeholder="Model" onChange={e => setFormData({ ...formData, vehicleModel: e.target.value })} style={darkInput} />
                  <input type="number" step="any" placeholder="Latitude (blank = Cape Town)" onChange={e => setFormData({ ...formData, vehicleLatitude: e.target.value })} style={darkInput} />
                  <input type="number" step="any" placeholder="Longitude (blank = Cape Town)" onChange={e => setFormData({ ...formData, vehicleLongitude: e.target.value })} style={darkInput} />
                </>)}
                {modalType === "order" && (<>
                  <input type="text" placeholder="Customer Name" onChange={e => setFormData({ ...formData, customerName: e.target.value })} style={darkInput} required />
                  <input type="email" placeholder="Customer Email" onChange={e => setFormData({ ...formData, customerEmail: e.target.value })} style={darkInput} required />
                  <input type="tel" placeholder="Customer Phone" onChange={e => setFormData({ ...formData, customerPhone: e.target.value })} style={darkInput} required />
                  <textarea placeholder="Delivery Address" onChange={e => setFormData({ ...formData, deliveryAddress: e.target.value })} style={{ ...darkInput, minHeight: 70 }} required />
                  <textarea placeholder="Pickup Address" onChange={e => setFormData({ ...formData, pickupAddress: e.target.value })} style={{ ...darkInput, minHeight: 70 }} required />
                  <select onChange={e => setFormData({ ...formData, priority: e.target.value })} style={darkInput}>
                    <option value="NORMAL">Normal Priority</option><option value="HIGH">High Priority</option><option value="URGENT">Urgent</option>
                  </select>
                  <div style={{ fontSize: 12, fontWeight: "600", color: "#6366f1", margin: "8px 0 4px" }}>Assign Driver (Optional)</div>
                  <select onChange={e => { const d = drivers.find(x => x.id === e.target.value); setFormData({ ...formData, driverId: e.target.value || null, vehicleId: d?.vehicle?.id || null }) }} style={darkInput}>
                    <option value="">-- Select Driver --</option>
                    {drivers.filter(d => d.vehicle).map(d => <option key={d.id} value={d.id}>{d.name} - {d.vehicle?.registration}</option>)}
                  </select>
                </>)}
                {modalType === "warehouse" && (<>
                  <input type="text" placeholder="Warehouse Name" onChange={e => setFormData({ ...formData, name: e.target.value })} style={darkInput} required />
                  <input type="text" placeholder="Location (City)" onChange={e => setFormData({ ...formData, location: e.target.value })} style={darkInput} required />
                  <textarea placeholder="Full Address" onChange={e => setFormData({ ...formData, address: e.target.value })} style={{ ...darkInput, minHeight: 70 }} required />
                  <input type="number" placeholder="Capacity" onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })} style={darkInput} required />
                  <input type="text" placeholder="Manager Name" onChange={e => setFormData({ ...formData, manager: e.target.value })} style={darkInput} />
                  <input type="tel" placeholder="Phone" onChange={e => setFormData({ ...formData, phone: e.target.value })} style={darkInput} />
                </>)}
                {modalType === "inventory" && (<>
                  <input type="text" placeholder="Item Name" onChange={e => setFormData({ ...formData, name: e.target.value })} style={darkInput} required />
                  <input type="text" placeholder="SKU" onChange={e => setFormData({ ...formData, sku: e.target.value.toUpperCase() })} style={darkInput} required />
                  <input type="text" placeholder="Category" onChange={e => setFormData({ ...formData, category: e.target.value })} style={darkInput} required />
                  <input type="number" placeholder="Quantity" onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })} style={darkInput} required />
                  <input type="number" step="0.01" placeholder="Unit Price (R)" onChange={e => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) })} style={darkInput} required />
                  <select onChange={e => setFormData({ ...formData, warehouseId: e.target.value })} style={darkInput} required>
                    <option value="">Select Warehouse</option>
                    {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                  <input type="number" placeholder="Min Stock Level" onChange={e => setFormData({ ...formData, minStock: parseInt(e.target.value) })} style={darkInput} />
                  <input type="number" placeholder="Max Stock Level" onChange={e => setFormData({ ...formData, maxStock: parseInt(e.target.value) })} style={darkInput} />
                </>)}
                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                  <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#94a3b8", cursor: "pointer" }}>Cancel</button>
                  <button type="submit" style={{ flex: 1, padding: 12, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 10, color: "white", cursor: "pointer", fontWeight: "700", boxShadow: "0 4px 15px rgba(99,102,241,0.4)" }}>Create</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="login-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui,-apple-system,sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(10,15,30,0.5) 0%,rgba(13,21,38,0.3) 50%,rgba(10,15,30,0.5) 100%)" }}></div>

      <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 0 40px rgba(99,102,241,0.5)" }}>
            <Truck size={36} color="white" />
          </div>
          <div style={{ fontSize: 36, fontWeight: "900", color: "white", letterSpacing: "-1px" }}>FleetMind</div>
          <div style={{ fontSize: 13, color: "#475569", marginTop: 6, letterSpacing: "2px", fontWeight: "600" }}>PRO FLEET MANAGEMENT</div>
        </div>

        <div style={{ background: "rgba(13,21,38,0.8)", borderRadius: 24, padding: 36, border: "1px solid rgba(99,102,241,0.2)", backdropFilter: "blur(20px)", boxShadow: "0 40px 80px rgba(0,0,0,0.5)" }}>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: "600", color: "#475569", marginBottom: 6, letterSpacing: "0.5px" }}>EMAIL ADDRESS</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@fleetmind.com" style={{ ...darkInput, marginBottom: 0 }} required />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: "600", color: "#475569", marginBottom: 6, letterSpacing: "0.5px" }}>PASSWORD</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" style={{ ...darkInput, marginBottom: 0 }} required />
            </div>
            {error && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", padding: 12, borderRadius: 10, marginBottom: 16, fontSize: 13 }}>{error}</div>}
            <button type="submit" disabled={loading} style={{ width: "100%", padding: 14, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 12, color: "white", fontSize: 15, fontWeight: "700", cursor: "pointer", boxShadow: "0 8px 30px rgba(99,102,241,0.4)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {loading ? "Signing in..." : <><Lock size={16} /> Sign In</>}
            </button>
          </form>
          <div style={{ marginTop: 20, textAlign: "center", fontSize: 12, color: "#334155", background: "rgba(99,102,241,0.05)", padding: 10, borderRadius: 8, border: "1px solid rgba(99,102,241,0.1)" }}>
            admin@fleetmind.com / admin123
          </div>
        </div>
      </div>
    </div>
  )
}