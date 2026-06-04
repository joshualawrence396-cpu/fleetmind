"use client"

import React, { useState } from "react"

type Platform = "takealot" | "shopify" | "woocommerce"

type Configs = {
  takealot: {
    apiKey: string
    sellerId: string
  }
  shopify: {
    apiKey: string
    storeUrl: string
  }
  woocommerce: {
    apiKey: string
    apiSecret: string
    storeUrl: string
  }
}

type LogEntry = {
  id: number
  platform: string
  action: string
  status: "success" | "failed"
  time: string
}

export function APIIntegrations() {
  const [connected, setConnected] = useState<Record<Platform, boolean>>({
    takealot: false,
    shopify: false,
    woocommerce: false,
  })

  const [configs, setConfigs] = useState<Configs>({
    takealot: {
      apiKey: "",
      sellerId: "",
    },
    shopify: {
      apiKey: "",
      storeUrl: "",
    },
    woocommerce: {
      apiKey: "",
      apiSecret: "",
      storeUrl: "",
    },
  })

  const [testing, setTesting] = useState<Platform | "">("")

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 1,
      platform: "System",
      action: "FleetMind API started",
      status: "success",
      time: "09:00:00",
    },
  ])

  const testConnection = async (platform: Platform) => {
    setTesting(platform)

    await new Promise<void>((resolve) => setTimeout(resolve, 1500))

    const success = Object.values(configs[platform]).every(
      (value) => String(value).trim().length > 0
    )

    const entry: LogEntry = {
      id: Date.now(),
      platform,
      action: "Connection test",
      status: success ? "success" : "failed",
      time: new Date().toLocaleTimeString(),
    }

    setLogs((prev) => [entry, ...prev])

    if (success) {
      setConnected((prev) => ({
        ...prev,
        [platform]: true,
      }))
    }

    setTesting("")
  }

  const integrations: {
    id: Platform
    name: string
    icon: string
    color: string
    desc: string
    fields: { key: string; label: string }[]
  }[] = [
    {
      id: "takealot",
      name: "Takealot",
      icon: "🛒",
      color: "#e31837",
      desc: "Auto-import Takealot marketplace orders",
      fields: [
        { key: "apiKey", label: "API Key" },
        { key: "sellerId", label: "Seller ID" },
      ],
    },
    {
      id: "shopify",
      name: "Shopify",
      icon: "🛍️",
      color: "#96bf48",
      desc: "Sync Shopify store orders automatically",
      fields: [
        { key: "apiKey", label: "API Key" },
        { key: "storeUrl", label: "Store URL" },
      ],
    },
    {
      id: "woocommerce",
      name: "WooCommerce",
      icon: "🔌",
      color: "#7f54b3",
      desc: "Connect your WordPress WooCommerce store",
      fields: [
        { key: "apiKey", label: "Consumer Key" },
        { key: "apiSecret", label: "Consumer Secret" },
        { key: "storeUrl", label: "Store URL" },
      ],
    },
  ]

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: "bold", marginBottom: 8 }}>
        🔌 API Integrations
      </h2>

      <p style={{ color: "#64748b", marginBottom: 20 }}>
        Connect your e-commerce platforms to auto-import orders into FleetMind.
      </p>

      {integrations.map((intg) => (
        <div
          key={intg.id}
          style={{
            background: "transparent",
            borderRadius: 12,
            padding: 20,
            marginBottom: 16,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: connected[intg.id]
              ? "2px solid #10b981"
              : "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: `${intg.color}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                }}
              >
                {intg.icon}
              </div>

              <div>
                <div style={{ fontWeight: "bold", fontSize: 16 }}>
                  {intg.name}
                </div>

                <div style={{ fontSize: 13, color: "#64748b" }}>
                  {intg.desc}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              {connected[intg.id] && (
                <span
                  style={{
                    padding: "4px 12px",
                    borderRadius: 20,
                    background: "#d1fae5",
                    color: "#065f46",
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  ✅ Connected
                </span>
              )}

              <button
                onClick={() => testConnection(intg.id)}
                disabled={testing === intg.id}
              >
                {testing === intg.id
                  ? "⏳ Testing..."
                  : connected[intg.id]
                  ? "🔄 Re-test"
                  : "Connect"}
              </button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${intg.fields.length},1fr)`,
              gap: 10,
            }}
          >
            {intg.fields.map((field) => (
              <div key={field.key}>
                <label>{field.label}</label>

                <input
                  value={
                    (configs[intg.id] as Record<string, string>)[field.key] || ""
                  }
                  onChange={(e) =>
                    setConfigs((prev) => ({
                      ...prev,
                      [intg.id]: {
                        ...prev[intg.id],
                        [field.key]: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div>
        <h3>📋 Integration Logs</h3>

        {logs.map((log) => (
          <div key={log.id}>
            <strong>{log.platform}</strong> — {log.action}
          </div>
        ))}
      </div>
    </div>
  )
}
