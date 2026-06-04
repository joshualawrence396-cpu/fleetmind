"use client"

import { useState } from "react"

type Driver = {
  name: string
  phone?: string
}

type Vehicle = {
  registration?: string
}

type Order = {
  orderNumber: string
  customerName: string
  deliveryAddress: string
  status: string
  updatedAt: string
  driver?: Driver
  vehicle?: Vehicle
}

export default function TrackPage() {
  const [orderNumber, setOrderNumber] = useState<string>("")
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  const track = async () => {
    if (!orderNumber.trim()) return

    setLoading(true)
    setError("")
    setOrder(null)

    try {
      const res = await fetch(
        "/api/track/" + orderNumber.trim().toUpperCase()
      )

      const data = await res.json()

      if (data.error) {
        setError("Order not found. Check your order number and try again.")
      } else {
        setOrder(data)
      }
    } catch {
      setError("Network error. Please try again.")
    }

    setLoading(false)
  }

  const steps = ["PENDING", "IN_PROGRESS", "COMPLETED"]

  const stepLabels = [
    "Order Placed",
    "In Progress",
    "Delivered"
  ]

  const stepIcons = ["📦", "🚛", "✅"]

  const currentStep = order
    ? steps.indexOf(order.status)
    : -1

  const statusColor = (s: string) =>
    s === "COMPLETED"
      ? "#10b981"
      : s === "IN_PROGRESS"
      ? "#3b82f6"
      : "#f59e0b"

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20
      }}
    >
      <div style={{ width: "100%", maxWidth: 600 }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: 30,
            color: "white"
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 10 }}>
            🚛
          </div>

          <h1
            style={{
              fontSize: 32,
              fontWeight: "bold",
              margin: 0
            }}
          >
            FleetMind
          </h1>

          <p
            style={{
              opacity: 0.8,
              marginTop: 8
            }}
          >
            Track your delivery in real time
          </p>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: 30,
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
          }}
        >
          <h2
            style={{
              marginBottom: 20,
              fontWeight: "bold",
              fontSize: 20
            }}
          >
            📦 Track Your Order
          </h2>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 20
            }}
          >
            <input
              value={orderNumber}
              onChange={(e) =>
                setOrderNumber(e.target.value)
              }
              onKeyDown={(e) =>
                e.key === "Enter" && track()
              }
              placeholder="Enter order number (e.g. ORD-1234567890)"
              style={{
                flex: 1,
                padding: 12,
                border: "2px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 15,
                outline: "none"
              }}
            />

            <button
              onClick={track}
              disabled={loading}
              style={{
                padding: "12px 24px",
                background: "#667eea",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: 15
              }}
            >
              {loading ? "..." : "Track"}
            </button>
          </div>

          {error && (
            <div
              style={{
                background: "#fee2e2",
                color: "#dc2626",
                padding: 12,
                borderRadius: 8,
                marginBottom: 16
              }}
            >
              {error}
            </div>
          )}

          {order && (
            <div>
              <div
                style={{
                  background: "#f8fafc",
                  borderRadius: 12,
                  padding: 20,
                  marginBottom: 20
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: "bold",
                        fontSize: 18
                      }}
                    >
                      {order.orderNumber}
                    </div>

                    <div
                      style={{
                        color: "#64748b",
                        fontSize: 14
                      }}
                    >
                      {order.customerName}
                    </div>
                  </div>

                  <span
                    style={{
                      padding: "6px 16px",
                      borderRadius: 20,
                      background:
                        statusColor(order.status) + "20",
                      color: statusColor(order.status),
                      fontWeight: "bold",
                      fontSize: 13
                    }}
                  >
                    {order.status}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: 13,
                    color: "#64748b"
                  }}
                >
                  📍 Delivering to:{" "}
                  {order.deliveryAddress}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 24,
                  position: "relative"
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 20,
                    left: "10%",
                    right: "10%",
                    height: 3,
                    background: "#e2e8f0",
                    zIndex: 0
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    top: 20,
                    left: "10%",
                    height: 3,
                    background: "#667eea",
                    zIndex: 1,
                    width:
                      currentStep <= 0
                        ? "0%"
                        : currentStep === 1
                        ? "50%"
                        : "100%",
                    transition: "width 0.5s"
                  }}
                />

                {steps.map((s, i) => (
                  <div
                    key={s}
                    style={{
                      textAlign: "center",
                      zIndex: 2,
                      flex: 1
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background:
                          i <= currentStep
                            ? "#667eea"
                            : "#e2e8f0",
                        color:
                          i <= currentStep
                            ? "white"
                            : "#94a3b8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 20,
                        margin: "0 auto 8px",
                        transition: "background 0.3s"
                      }}
                    >
                      {stepIcons[i]}
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        fontWeight:
                          i <= currentStep
                            ? "600"
                            : "400",
                        color:
                          i <= currentStep
                            ? "#1e293b"
                            : "#94a3b8"
                      }}
                    >
                      {stepLabels[i]}
                    </div>
                  </div>
                ))}
              </div>

              {order.driver && (
                <div
                  style={{
                    background: "#f0fdf4",
                    borderRadius: 10,
                    padding: 14,
                    marginBottom: 12,
                    border: "1px solid #bbf7d0"
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      marginBottom: 4
                    }}
                  >
                    👤 Your Driver
                  </div>

                  <div style={{ fontSize: 14 }}>
                    {order.driver.name}
                  </div>

                  {order.driver.phone && (
                    <div
                      style={{
                        fontSize: 13,
                        color: "#10b981"
                      }}
                    >
                      📞 {order.driver.phone}
                    </div>
                  )}

                  {order.vehicle && (
                    <div
                      style={{
                        fontSize: 13,
                        color: "#64748b"
                      }}
                    >
                      🚛 {order.vehicle.registration}
                    </div>
                  )}
                </div>
              )}

              <div
                style={{
                  fontSize: 12,
                  color: "#94a3b8",
                  textAlign: "center"
                }}
              >
                Last updated:{" "}
                {new Date(order.updatedAt).toLocaleString()}
              </div>
            </div>
          )}

          <div
            style={{
              marginTop: 20,
              paddingTop: 20,
              borderTop: "1px solid #e2e8f0",
              textAlign: "center",
              fontSize: 12,
              color: "#94a3b8"
            }}
          >
            Powered by FleetMind •{" "}
            <a
              href="/"
              style={{ color: "#667eea" }}
            >
              Admin Login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}