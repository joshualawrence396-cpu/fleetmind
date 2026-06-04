"use client"

import { useState } from "react"

type Notification = {
  id: string
  type: "success" | "warning" | "error" | "info"
  message: string
  time: string
  read: boolean
}

export function NotificationSystem() {
  const [notifs, setNotifs] = useState<Notification[]>([
    {
      id: "1",
      type: "success",
      message: "Order ORD-001 completed successfully",
      time: "09:15",
      read: false,
    },
    {
      id: "2",
      type: "warning",
      message: "Vehicle CA123456 fuel level low",
      time: "08:42",
      read: false,
    },
    {
      id: "3",
      type: "info",
      message: "Driver Josh assigned to Order ORD-002",
      time: "08:30",
      read: true,
    },
    {
      id: "4",
      type: "error",
      message: "Vehicle CA789012 maintenance overdue",
      time: "Yesterday",
      read: true,
    },
  ])

  const [filter, setFilter] = useState<string>("all")

  const markRead = (id: string) => {
    setNotifs(notifs.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllRead = () => {
    setNotifs(notifs.map((n) => ({ ...n, read: true })))
  }

  const deleteNotif = (id: string) => {
    setNotifs(notifs.filter((n) => n.id !== id))
  }

  const typeIcon = (t: Notification["type"]) =>
    t === "success"
      ? "✅"
      : t === "warning"
      ? "⚠️"
      : t === "error"
      ? "❌"
      : "ℹ️"

  const typeBg = (t: Notification["type"]) =>
    t === "success"
      ? "#d1fae5"
      : t === "warning"
      ? "#fef3c7"
      : t === "error"
      ? "#fee2e2"
      : "#dbeafe"

  const typeColor = (t: Notification["type"]) =>
    t === "success"
      ? "#065f46"
      : t === "warning"
      ? "#92400e"
      : t === "error"
      ? "#dc2626"
      : "#1e40af"

  const filtered =
    filter === "all"
      ? notifs
      : filter === "unread"
      ? notifs.filter((n) => !n.read)
      : notifs.filter((n) => n.type === filter)

  const unread = notifs.filter((n) => !n.read).length

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2 style={{ fontSize: 22, fontWeight: "bold" }}>
          🔔 Notifications
        </h2>

        {unread > 0 && (
          <button
            onClick={markAllRead}
            style={{
              padding: "8px 16px",
              background: "#6366f1",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Mark All Read ({unread})
          </button>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        {["all", "unread", "success", "warning", "error", "info"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "6px 14px",
              background: filter === f ? "#1e293b" : "white",
              color: filter === f ? "white" : "#64748b",
              border: "1px solid #e2e8f0",
              borderRadius: 20,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: "500",
            }}
          >
            {f === "all"
              ? "All"
              : f === "unread"
              ? "Unread"
              : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div
          style={{
            background: "transparent",
            borderRadius: 12,
            padding: 40,
            textAlign: "center",
            color: "#666",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          No notifications in this category.
        </div>
      )}

      {filtered.map((n) => (
        <div
          key={n.id}
          style={{
            background: "transparent",
            borderRadius: 10,
            padding: 16,
            marginBottom: 10,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            borderLeft: "4px solid " + typeColor(n.type),
            opacity: n.read ? 0.7 : 1,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: typeBg(n.type),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                {typeIcon(n.type)}
              </div>

              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: n.read ? "400" : "600",
                    color: "#1e293b",
                  }}
                >
                  {n.message}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: "#94a3b8",
                    marginTop: 3,
                  }}
                >
                  {n.time}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 6 }}>
              {!n.read && (
                <button
                  onClick={() => markRead(n.id)}
                  style={{
                    padding: "4px 10px",
                    background: "#e2e8f0",
                    border: "none",
                    borderRadius: 5,
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                >
                  Mark Read
                </button>
              )}

              <button
                onClick={() => deleteNotif(n.id)}
                style={{
                  padding: "4px 8px",
                  background: "#fee2e2",
                  color: "#dc2626",
                  border: "none",
                  borderRadius: 5,
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}