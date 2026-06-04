"use client"

import { useState, useEffect } from "react"

interface Driver {
  name?: string
}

interface Vehicle {
  registration?: string
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  deliveryAddress: string
  pickupAddress: string
  priority: string
  driver?: Driver
  vehicle?: Vehicle
}

export function InvoiceGeneration() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selected, setSelected] = useState<Order | null>(null)
  const [preview, setPreview] = useState(false)

  useEffect(() => {
    fetch("/api/invoices")
      .then((r) => r.json())
      .then((d: Order[]) => setOrders(d || []))
  }, [])

  const generateInvoice = (order: Order) => {
    setSelected(order)
    setPreview(true)
  }

  const printInvoice = () => window.print()

  const invoiceNum = (order: Order) =>
    "INV-" + order.orderNumber.replace("ORD-", "")

  const rate = 1500

  const tax = (amt: number) => amt * 0.15

  const total = (amt: number) => amt + tax(amt)

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        💳 Invoice Generation
      </h2>

      {preview && selected ? (
        <div>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <button
              onClick={() => setPreview(false)}
              style={{
                padding: "8px 16px",
                background: "#e2e8f0",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              ← Back
            </button>

            <button
              onClick={printInvoice}
              style={{
                padding: "8px 16px",
                background: "#10b981",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              🖨️ Print / Save PDF
            </button>
          </div>

          <div
            id="invoice"
            style={{
              borderRadius: 12,
              padding: 40,
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              maxWidth: 700,
              margin: "0 auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 30,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: "bold",
                    color: "#1e293b",
                  }}
                >
                  🚛 FleetMind
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    color: "#667eea",
                  }}
                >
                  INVOICE
                </div>

                <div>{invoiceNum(selected)}</div>
              </div>
            </div>

            {/* rest of your JSX stays exactly the same */}
          </div>
        </div>
      ) : (
        <div>
          <div
            style={{
              borderRadius: 12,
              padding: 20,
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ marginBottom: 15, fontWeight: "bold" }}>
              Completed Orders — Ready for Invoice
            </h3>

            {orders.length === 0 && (
              <div
                style={{
                  padding: 20,
                  textAlign: "center",
                  color: "#666",
                }}
              >
                No completed orders yet.
              </div>
            )}

            {orders.map((o) => (
              <div
                key={o.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 0",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                <div>
                  <strong>{o.orderNumber}</strong>

                  <div
                    style={{
                      fontSize: 13,
                      color: "#64748b",
                    }}
                  >
                    {o.customerName}
                  </div>
                </div>

                <button
                  onClick={() => generateInvoice(o)}
                  style={{
                    padding: "6px 14px",
                    background: "#667eea",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  💳 Generate
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}