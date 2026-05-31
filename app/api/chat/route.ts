import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function getRealFleetData() {
  try {
    const [vehicles, drivers, orders, inventory, fuel, maintenance] = await Promise.all([
      prisma.vehicle.findMany({ include: { driver: true }, take: 50 }),
      prisma.driver.findMany({ take: 50 }),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 100, include: { driver: true, vehicle: true } }),
      prisma.inventoryItem.findMany({ take: 30 }),
      prisma.fuelEntry.findMany({ orderBy: { createdAt: "desc" }, take: 20, include: { vehicle: true } }),
      prisma.maintenanceRecord.findMany({ orderBy: { createdAt: "desc" }, take: 10, include: { vehicle: true } }),
    ])

    const onRoute = vehicles.filter(v => v.status === "ON_ROUTE").length
    const available = vehicles.filter(v => v.status === "AVAILABLE").length
    const maintenance_v = vehicles.filter(v => v.status === "MAINTENANCE").length
    const pending = orders.filter(o => o.status === "PENDING").length
    const inProgress = orders.filter(o => o.status === "IN_PROGRESS").length
    const completed = orders.filter(o => o.status === "COMPLETED").length
    const failed = orders.filter(o => o.status === "FAILED").length
    const totalRevenue = completed * 1500
    const totalFuelCost = fuel.reduce((s, f) => s + (f.totalCost || 0), 0)
    const lowStock = inventory.filter(i => i.quantity <= i.minStock)
    const activeDrivers = drivers.filter(d => d.status === "ACTIVE").length

    return `
LIVE FLEET DATA (as of ${new Date().toLocaleString("en-ZA")}):

VEHICLES: ${vehicles.length} total | ${onRoute} on route | ${available} available | ${maintenance_v} in maintenance
DRIVERS: ${drivers.length} total | ${activeDrivers} active
ORDERS: ${orders.length} total | ${pending} pending | ${inProgress} in progress | ${completed} completed | ${failed} failed
REVENUE: R${totalRevenue.toLocaleString()} (from completed orders)
FUEL COSTS: R${totalFuelCost.toFixed(2)} total recorded
LOW STOCK ITEMS: ${lowStock.length} items (${lowStock.map(i => i.name).join(", ") || "none"})

RECENT ORDERS (last 5):
${orders.slice(0, 5).map(o => `- ${o.orderNumber}: ${o.customerName} → ${o.deliveryAddress?.substring(0, 40)} [${o.status}] Driver: ${o.driver?.name || "unassigned"}`).join("\n")}

VEHICLES ON ROUTE:
${vehicles.filter(v => v.status === "ON_ROUTE").map(v => `- ${v.registration} (${v.make} ${v.model}) Driver: ${v.driver?.name || "none"}`).join("\n") || "None currently on route"}

RECENT FUEL ENTRIES:
${fuel.slice(0, 3).map(f => `- ${f.vehicle?.registration}: ${f.litres}L = R${f.totalCost}`).join("\n") || "No recent fuel entries"}

MAINTENANCE ALERTS:
${maintenance.slice(0, 3).map(m => `- ${m.vehicle?.registration}: ${m.type} - ${m.description}`).join("\n") || "No recent maintenance records"}
`
  } catch (e) {
    return "Fleet data temporarily unavailable."
  }
}

async function callCloudflareAI(messages: any[]): Promise<string> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const token = process.env.CLOUDFLARE_API_TOKEN
  if (!accountId || !token || accountId.includes("your_")) {
    return "Cloudflare AI not configured. Add CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN to .env"
  }
  const models = [
    "@cf/meta/llama-3-8b-instruct",
    "@cf/mistral/mistral-7b-instruct-v0.1",
  ]
  for (const model of models) {
    try {
      const res = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`,
        {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ messages, max_tokens: 400, temperature: 0.3 })
        }
      )
      if (!res.ok) continue
      const data = await res.json()
      const response = data?.result?.response || data?.result?.text
      if (response) return response.trim()
    } catch { continue }
  }
  throw new Error("All Cloudflare AI models failed")
}

export async function POST(request: Request) {
  try {
    const { message, history = [], context = "sales" } = await request.json()
    if (!message?.trim()) return NextResponse.json({ error: "Message required" }, { status: 400 })

    let systemPrompt = ""
    if (context === "dashboard") {
      const realData = await getRealFleetData()
      systemPrompt = `You are FleetMind AI assistant for a South African logistics company. You have access to LIVE real-time fleet data below. Answer questions accurately using this data. Be concise (2-4 sentences). Use ZAR currency. If asked about specific numbers, use the exact data provided.

${realData}

Answer based on this real data only. Do not make up numbers.`
    } else {
      systemPrompt = `You are FleetMind's sales AI assistant for South African logistics businesses. Be friendly and helpful.
FleetMind features: Live GPS tracking (5s updates), AI route optimization (35% fuel saving), 6-courier rate shopping (Bob Go, Aramex, The Courier Guy, DSV, PUDO, PostNet), Full WMS, Driver PWA app, Email notifications.
Pricing: Starter R1,499/vehicle/month (up to 5 vehicles), Growth R1,199/vehicle/month (6-25 vehicles), Enterprise custom pricing.
14-day free trial, no credit card. Built in Cape Town. PayFast payments (EFT, credit card, SnapScan).
Be concise - 2-3 sentences max. Use South African context.`
    }

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.slice(-4).map((h: any) => ({ role: h.role, content: h.content })),
      { role: "user", content: message.trim() }
    ]

    try {
      const response = await callCloudflareAI(messages)
      return NextResponse.json({ response, provider: "cloudflare", realData: context === "dashboard" })
    } catch (aiError) {
      // Smart fallback using real data
      if (context === "dashboard") {
        const realData = await getRealFleetData()
        const msg = message.toLowerCase()
        let response = ""
        if (msg.includes("pending") || msg.includes("order")) {
          const lines = realData.split("\n")
          const ordersLine = lines.find(l => l.includes("ORDERS:")) || ""
          response = `Based on live data: ${ordersLine.replace("ORDERS:", "").trim()}. Check the Orders tab for full details.`
        } else if (msg.includes("vehicle") || msg.includes("truck") || msg.includes("fleet")) {
          const lines = realData.split("\n")
          const vLine = lines.find(l => l.includes("VEHICLES:")) || ""
          response = `Fleet status: ${vLine.replace("VEHICLES:", "").trim()}.`
        } else if (msg.includes("revenue") || msg.includes("money") || msg.includes("cost")) {
          const lines = realData.split("\n")
          const rLine = lines.find(l => l.includes("REVENUE:")) || ""
          response = `Financial: ${rLine.replace("REVENUE:", "").trim()}.`
        } else if (msg.includes("driver")) {
          const lines = realData.split("\n")
          const dLine = lines.find(l => l.includes("DRIVERS:")) || ""
          response = `Driver status: ${dLine.replace("DRIVERS:", "").trim()}.`
        } else {
          response = "I have live access to your fleet data. Ask me about orders, vehicles, drivers, revenue, or fuel costs."
        }
        return NextResponse.json({ response, provider: "fallback", realData: true })
      }
      return NextResponse.json({ response: "I can help you learn about FleetMind! We offer fleet management from R1,199/vehicle/month with a 14-day free trial. What would you like to know?", provider: "fallback" })
    }
  } catch (error: any) {
    return NextResponse.json({ response: "Sorry, I had a technical issue. Please try again.", error: error.message })
  }
}

export async function GET() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const token = process.env.CLOUDFLARE_API_TOKEN
  return NextResponse.json({
    configured: !!(accountId && token && !accountId.includes("your_")),
    accountIdPreview: accountId ? accountId.substring(0, 8) + "..." : "not set",
  })
}