"use client"
import { useState, useEffect } from "react"

interface Driver {
  id: string
  name: string
  [key: string]: any
}

interface FuelLog {
  driverName: string
  totalCost: number
  liters: number
  [key: string]: any
}

interface Order {
  id: string
  status: string
  driverId?: string
  [key: string]: any
}

export function CostAnalysis() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    fetch("/api/drivers")
      .then((r) => r.json())
      .then((d) => setDrivers(Array.isArray(d) ? d : []))

    fetch("/api/orders")
      .then((r) => r.json())
      .then((o) => setOrders(Array.isArray(o) ? o : []))

    const saved = localStorage.getItem("fuelLogs")
    if (saved) {
      try {
        setFuelLogs(JSON.parse(saved))
      } catch {
        setFuelLogs([])
      }
    }
  }, [])

  const completedOrders = orders.filter(
    (o: Order) => o.status === "COMPLETED"
  )

  const totalRevenue = completedOrders.length * 1500

  const totalFuelCost = fuelLogs.reduce(
    (s: number, l: FuelLog) => s + l.totalCost,
    0
  )

  const totalFuelLiters = fuelLogs.reduce(
    (s: number, l: FuelLog) => s + l.liters,
    0
  )

  const netProfit = totalRevenue - totalFuelCost

  const margin =
    totalRevenue > 0
      ? ((netProfit / totalRevenue) * 100).toFixed(1)
      : "0"

  const driverStats = drivers.map((d: Driver) => {
    const driverOrders = completedOrders.filter(
      (o: Order) => o.driverId === d.id
    )

    const driverFuel = fuelLogs.filter(
      (l: FuelLog) => l.driverName === d.name
    )

    const revenue = driverOrders.length * 1500

    const fuel = driverFuel.reduce(
      (s: number, l: FuelLog) => s + l.totalCost,
      0
    )

    return {
      ...d,
      orders: driverOrders.length,
      revenue,
      fuel,
      profit: revenue - fuel,
    }
  })

  const s = {
    card: {
      background: "transparent",
      borderRadius: 12,
      padding: 20,
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      marginBottom: 16,
    },
    stat: {
      background: "transparent",
      padding: 18,
      borderRadius: 12,
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      textAlign: "center" as const,
    },
  }

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        💡 Cost Analysis
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div style={{ ...s.stat, borderLeft: "4px solid #10b981" }}>
          <div style={{ fontSize: 28 }}>💰</div>
          <div
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#10b981",
            }}
          >
            R
            {totalRevenue
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </div>
          <div style={{ color: "#64748b", fontSize: 13 }}>
            Total Revenue
          </div>
        </div>

        <div style={{ ...s.stat, borderLeft: "4px solid #ef4444" }}>
          <div style={{ fontSize: 28 }}>⛽</div>
          <div
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#ef4444",
            }}
          >
            R{totalFuelCost.toFixed(2)}
          </div>
          <div style={{ color: "#64748b", fontSize: 13 }}>
            Fuel Costs
          </div>
        </div>

        <div style={{ ...s.stat, borderLeft: "4px solid #667eea" }}>
          <div style={{ fontSize: 28 }}>📈</div>
          <div
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#667eea",
            }}
          >
            R{netProfit.toFixed(2)}
          </div>
          <div style={{ color: "#64748b", fontSize: 13 }}>
            Net Profit
          </div>
        </div>

        <div style={{ ...s.stat, borderLeft: "4px solid #f59e0b" }}>
          <div style={{ fontSize: 28 }}>🎯</div>
          <div
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#f59e0b",
            }}
          >
            {margin}%
          </div>
          <div style={{ color: "#64748b", fontSize: 13 }}>
            Profit Margin
          </div>
        </div>
      </div>

      {/* Rest of your JSX remains unchanged */}
    </div>
  )
}