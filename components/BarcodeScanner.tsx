"use client"

import { useState, useRef, KeyboardEvent, ChangeEvent } from "react"

type ScanResult = {
  order?: {
    orderNumber: string
    customerName: string
    deliveryAddress: string
    status: string
  }
  item?: {
    name: string
    sku: string
    quantity: number
    unitPrice: number
    warehouse?: {
      name: string
    }
  }
  error?: string
}

type HistoryEntry = {
  id: number
  code: string
  action: string
  time: string
  found: boolean
  data: ScanResult
}

export function BarcodeScanner() {
  const [code, setCode] = useState<string>("")
  const [result, setResult] = useState<ScanResult | null>(null)
  const [scanning, setScanning] = useState<boolean>(false)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [action, setAction] = useState<string>("SCAN_IN")

  const inputRef = useRef<HTMLInputElement | null>(null)

  const scan = async (scanCode?: string): Promise<void> => {
    const c = scanCode || code

    if (!c.trim()) return

    setScanning(true)

    try {
      const res = await fetch(
        "/api/barcode?code=" + encodeURIComponent(c.trim())
      )

      const data: ScanResult = await res.json()

      setResult(data)

      const entry: HistoryEntry = {
        id: Date.now(),
        code: c.trim(),
        action,
        time: new Date().toLocaleTimeString(),
        found: Boolean(data.order || data.item),
        data,
      }

      setHistory((prev) => [entry, ...prev].slice(0, 20))
    } catch {
      setResult({ error: "Scan failed" })
    }

    setScanning(false)
    setCode("")

    inputRef.current?.focus()
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      scan()
    }
  }

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        📦 Barcode Scanner
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
      >
        <div>
          <div
            style={{
              background: "transparent",
              borderRadius: 12,
              padding: 20,
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              marginBottom: 16,
            }}
          >
            <h3 style={{ marginBottom: 15, fontWeight: "bold" }}>
              Scan Barcode
            </h3>

            <select
              value={action}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setAction(e.target.value)
              }
              style={{
                width: "100%",
                padding: 10,
                marginBottom: 12,
                border: "1px solid #e2e8f0",
                borderRadius: 6,
                fontSize: 14,
              }}
            >
              <option value="SCAN_IN">📥 Scan In (Receiving)</option>
              <option value="SCAN_OUT">📤 Scan Out (Dispatch)</option>
              <option value="VERIFY">🔍 Verify / Lookup</option>
            </select>

            <div style={{ display: "flex", gap: 10 }}>
              <input
                ref={inputRef}
                value={code}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setCode(e.target.value)
                }
                onKeyDown={handleKey}
                placeholder="Scan or type barcode / order number / SKU..."
                style={{
                  flex: 1,
                  padding: 12,
                  border: "2px solid #667eea",
                  borderRadius: 8,
                  fontSize: 14,
                  outline: "none",
                }}
                autoFocus
              />

              <button
                onClick={() => scan()}
                disabled={scanning}
                style={{
                  padding: "12px 20px",
                  background: "#667eea",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                {scanning ? "..." : "Scan"}
              </button>
            </div>

            <div
              style={{
                fontSize: 12,
                color: "#94a3b8",
                marginTop: 8,
              }}
            >
              💡 Press Enter to scan. Works with physical barcode scanners too.
            </div>
          </div>

          {result && (
            <div
              style={{
                background: "transparent",
                borderRadius: 12,
                padding: 20,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ marginBottom: 15, fontWeight: "bold" }}>
                Scan Result
              </h3>

              {result.order && (
                <div
                  style={{
                    background: "#f0fdf4",
                    borderRadius: 8,
                    padding: 14,
                    marginBottom: 10,
                    border: "1px solid #bbf7d0",
                  }}
                >
                  <div style={{ fontWeight: "bold", marginBottom: 6 }}>
                    📦 Order Found
                  </div>

                  <div>
                    <strong>{result.order.orderNumber}</strong>
                  </div>

                  <div style={{ fontSize: 13, color: "#64748b" }}>
                    {result.order.customerName}
                  </div>

                  <div style={{ fontSize: 13 }}>
                    {result.order.deliveryAddress}
                  </div>

                  <div style={{ fontSize: 12, marginTop: 6 }}>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: 10,
                        background: "#dbeafe",
                        color: "#1e40af",
                        fontSize: 11,
                      }}
                    >
                      {result.order.status}
                    </span>
                  </div>
                </div>
              )}

              {result.item && (
                <div
                  style={{
                    background: "#f0fdf4",
                    borderRadius: 8,
                    padding: 14,
                    border: "1px solid #bbf7d0",
                  }}
                >
                  <div style={{ fontWeight: "bold", marginBottom: 6 }}>
                    📋 Inventory Item Found
                  </div>

                  <div>
                    <strong>{result.item.name}</strong>
                  </div>

                  <div style={{ fontSize: 13, color: "#64748b" }}>
                    SKU: {result.item.sku}
                  </div>

                  <div style={{ fontSize: 13 }}>
                    Stock: {result.item.quantity} | Price: R
                    {result.item.unitPrice}
                  </div>

                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    Warehouse: {result.item.warehouse?.name}
                  </div>
                </div>
              )}

              {!result.order && !result.item && (
                <div
                  style={{
                    background: "#fee2e2",
                    borderRadius: 8,
                    padding: 14,
                    color: "#dc2626",
                  }}
                >
                  ❌ No order or item found for this barcode.
                </div>
              )}
            </div>
          )}
        </div>

        <div
          style={{
            background: "transparent",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h3 style={{ marginBottom: 15, fontWeight: "bold" }}>
            📋 Scan History ({history.length})
          </h3>

          {history.length === 0 && (
            <div style={{ color: "#666", fontSize: 13 }}>
              No scans yet. Start scanning to see history.
            </div>
          )}

          {history.map((h) => (
            <div
              key={h.id}
              style={{
                padding: "10px 0",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: "500", fontSize: 13 }}>
                  {h.code}
                </div>

                <div style={{ fontSize: 11, color: "#94a3b8" }}>
                  {h.time} • {h.action}
                </div>
              </div>

              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: 10,
                  fontSize: 11,
                  fontWeight: "600",
                  background: h.found ? "#d1fae5" : "#fee2e2",
                  color: h.found ? "#065f46" : "#dc2626",
                }}
              >
                {h.found ? "FOUND" : "NOT FOUND"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}