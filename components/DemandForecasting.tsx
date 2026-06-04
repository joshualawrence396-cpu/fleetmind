"use client"

import { useState, useEffect } from "react"

type ForecastItem = {
  day: string
  predicted: number
  urgent: number
  drivers: number
  revenue: number
}

export function DemandForecasting() {
  const [orders, setOrders] = useState<any[]>([])
  const [forecast, setForecast] = useState<ForecastItem[]>([])

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        const o = Array.isArray(data) ? data : []
        setOrders(o)
        generateForecast(o)
      })
  }, [])

  const generateForecast = (orders: any[]) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const base = [12, 18, 15, 20, 25, 8, 5]
    const urgent = [2, 3, 2, 4, 6, 1, 1]

    const generatedForecast: ForecastItem[] = days.map((day, i) => ({
      day,
      predicted: base[i] + Math.floor(Math.random() * 5),
      urgent: urgent[i],
      drivers: Math.ceil((base[i] + urgent[i]) / 4),
      revenue: (base[i] + urgent[i]) * 1500,
    }))

    setForecast(generatedForecast)
  }

  const maxVal =
    forecast.length > 0
      ? Math.max(...forecast.map((f) => f.predicted))
      : 1

  const totalRevenue = forecast.reduce(
    (sum, item) => sum + item.revenue,
    0
  )

  const totalOrders = forecast.reduce(
    (sum, item) => sum + item.predicted,
    0
  )

  const peakDay: ForecastItem =
    forecast.length > 0
      ? forecast.reduce((a, b) =>
          a.predicted > b.predicted ? a : b
        )
      : {
          day: "-",
          predicted: 0,
          urgent: 0,
          drivers: 0,
          revenue: 0,
        }

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        🔮 Demand Forecasting
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            background: "transparent",
            padding: 18,
            borderRadius: 12,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            borderLeft: "4px solid #667eea",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 28 }}>📦</div>
          <div style={{ fontSize: 22, fontWeight: "bold" }}>
            {totalOrders}
          </div>
          <div style={{ color: "#64748b", fontSize: 13 }}>
            Predicted Orders (7 days)
          </div>
        </div>

        <div
          style={{
            background: "transparent",
            padding: 18,
            borderRadius: 12,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            borderLeft: "4px solid #10b981",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 28 }}>💰</div>
          <div style={{ fontSize: 22, fontWeight: "bold" }}>
            R
            {totalRevenue
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </div>
          <div style={{ color: "#64748b", fontSize: 13 }}>
            Predicted Revenue
          </div>
        </div>

        <div
          style={{
            background: "transparent",
            padding: 18,
            borderRadius: 12,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            borderLeft: "4px solid #f59e0b",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 28 }}>📈</div>
          <div style={{ fontSize: 22, fontWeight: "bold" }}>
            {peakDay.day}
          </div>
          <div style={{ color: "#64748b", fontSize: 13 }}>
            Busiest Day ({peakDay.predicted} orders)
          </div>
        </div>
      </div>

      <div
        style={{
          background: "transparent",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          marginBottom: 20,
        }}
      >
        <h3 style={{ marginBottom: 20, fontWeight: "bold" }}>
          📊 7-Day Order Forecast
        </h3>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 12,
            height: 200,
          }}
        >
          {forecast.map((f) => (
            <div
              key={f.day}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  color: "#667eea",
                }}
              >
                {f.predicted}
              </div>

              <div
                style={{
                  width: "100%",
                  background: "#667eea",
                  borderRadius: "4px 4px 0 0",
                  height: (f.predicted / maxVal) * 160,
                  transition: "height 0.5s",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    background: "#ef4444",
                    height: `${(f.urgent / f.predicted) * 100}%`,
                    borderRadius: "4px 4px 0 0",
                  }}
                />
              </div>

              <div
                style={{
                  fontSize: 12,
                  fontWeight: "500",
                  color: "#1e293b",
                }}
              >
                {f.day}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}