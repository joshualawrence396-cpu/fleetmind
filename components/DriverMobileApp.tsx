"use client"

import { useState, useEffect } from "react"

interface Driver {
  id: string
  name: string
  email?: string
  vehicle?: {
    registration?: string
  }
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  deliveryAddress: string
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED"
}

export function DriverMobileApp() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [selected, setSelected] = useState<Driver | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [view, setView] = useState<"select" | "app">("select")

  useEffect(() => {
    fetch("/api/drivers")
      .then((r) => r.json())
      .then((d: Driver[]) => setDrivers(d || []))
  }, [])

  const loadDriverOrders = async (driver: Driver) => {
    setSelected(driver)

    const res = await fetch(
      "/api/driver-app/orders?driverId=" + driver.id
    )

    const data: Order[] = await res.json()

    setOrders(data || [])
    setView("app")
  }

  const updateStatus = async (
    orderId: string,
    status: Order["status"]
  ) => {
    await fetch("/api/orders/" + orderId, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status } : o
      )
    )
  }

  const statusColor = (s: Order["status"]) =>
    s === "COMPLETED"
      ? "#10b981"
      : s === "IN_PROGRESS"
      ? "#3b82f6"
      : "#f59e0b"

  // ---- keep the rest of your JSX exactly the same ----

  return (
    <div>
      {/* existing JSX */}
    </div>
  )
}