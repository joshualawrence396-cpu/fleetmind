import { Inngest } from "inngest"

export const inngest = new Inngest({ id: "fleetmind", name: "FleetMind" })

// Background job: send email notification when order status changes
export const onOrderStatusChange = inngest.createFunction(
  { id: "order-status-notification", name: "Order Status Notification" },
  { event: "order/status.changed" },
  async ({ event, step }) => {
    const { orderId, status, customerEmail, orderNumber } = event.data

    await step.sleep("wait-before-notify", "2s")

    if (!customerEmail || !process.env.RESEND_API_KEY) {
      return { skipped: true, reason: "No email or Resend key" }
    }

    const result = await step.run("send-email", async () => {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: `FleetMind <${process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"}>`,
          to: [customerEmail],
          subject: `Order ${orderNumber} — ${status}`,
          html: `<div style="font-family:sans-serif;padding:24px"><h2>Order Update</h2><p>Your order <strong>${orderNumber}</strong> is now <strong>${status}</strong></p><a href="${process.env.NEXTAUTH_URL}/track/${orderNumber}">Track Order →</a></div>`
        })
      })
      return res.json()
    })

    return { sent: true, result }
  }
)

// Background job: daily demand forecast
export const dailyDemandForecast = inngest.createFunction(
  { id: "daily-demand-forecast", name: "Daily Demand Forecast" },
  { cron: "0 6 * * *" }, // 6am every day
  async ({ step }) => {
    const result = await step.run("run-forecast", async () => {
      const res = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/agents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent: "demand", payload: { trigger: "scheduled" } })
      })
      return res.json()
    })
    return { forecasted: true, result }
  }
)

// Background job: maintenance check
export const maintenanceCheck = inngest.createFunction(
  { id: "maintenance-check", name: "Vehicle Maintenance Check" },
  { cron: "0 8 * * 1" }, // 8am every Monday
  async ({ step }) => {
    const result = await step.run("run-maintenance-ai", async () => {
      const res = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/agents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent: "maintenance", payload: { trigger: "scheduled" } })
      })
      return res.json()
    })
    return { checked: true, result }
  }
)

// Background job: route optimization at start of day
export const morningRouteOptimize = inngest.createFunction(
  { id: "morning-route-optimize", name: "Morning Route Optimization" },
  { cron: "0 7 * * 1-5" }, // 7am weekdays
  async ({ step }) => {
    const result = await step.run("optimize-routes", async () => {
      const res = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/routes/optimize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: new Date().toISOString().split("T")[0], trigger: "scheduled" })
      })
      return res.json()
    })
    return { optimized: true, result }
  }
)

export const functions = [onOrderStatusChange, dailyDemandForecast, maintenanceCheck, morningRouteOptimize]