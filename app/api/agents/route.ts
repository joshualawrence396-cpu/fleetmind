import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function cfAI(prompt: string, system: string): Promise<string> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const token = process.env.CLOUDFLARE_API_TOKEN
  if (!accountId || !token) return JSON.stringify({ error: "No Cloudflare credentials" })
  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-3-8b-instruct`,
      {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: system },
            { role: "user", content: prompt }
          ],
          max_tokens: 800,
        })
      }
    )
    const data = await res.json()
    return data.result?.response || "No response"
  } catch (e: any) { return JSON.stringify({ error: e.message }) }
}

export async function POST(request: Request) {
  try {
    const { agent, payload } = await request.json()
    const start = Date.now()
    let result: any = {}
    const steps: any[] = []

    if (agent === "dispatcher") {
      steps.push({ step: 1, action: "Fetching order details" })
      const order = await prisma.order.findUnique({ where: { id: payload.orderId }, include: { driver: true, vehicle: true } })
      const drivers = await prisma.driver.findMany({ where: { status: "ACTIVE" }, include: { vehicle: true } })
      steps.push({ step: 2, action: "Running Cloudflare AI dispatcher" })
      const system = `You are FleetMind's dispatcher AI for South African logistics. Respond ONLY in JSON: { "action": string, "reason": string, "reassignTo": string|null, "customerMessage": string, "priority": "LOW"|"MEDIUM"|"HIGH"|"URGENT" }`
      const prompt = `Order ${order?.orderNumber || "unknown"} issue: "${payload.issue}". Customer: ${order?.customerName}. Address: ${order?.deliveryAddress}. Available drivers: ${drivers.map(d => d.name + "(" + d.vehicle?.registration + ")").join(", ")}`
      const response = await cfAI(prompt, system)
      try { result = JSON.parse(response) } catch { result = { action: response, reason: "AI response", customerMessage: "We are handling your query.", priority: "MEDIUM" } }
      steps.push({ step: 3, action: "Decision made: " + (result.action || "processed") })
    }

    else if (agent === "demand") {
      steps.push({ step: 1, action: "Fetching order history" })
      const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 100, select: { createdAt: true, status: true } })
      const byDay: Record<string, number> = {}
      orders.forEach(o => { const d = o.createdAt.toISOString().split("T")[0]; byDay[d] = (byDay[d]||0)+1 })
      steps.push({ step: 2, action: "Running Cloudflare AI forecast" })
      const system = `You are a demand forecasting AI for SA logistics. Respond ONLY in JSON: { "forecast": [{ "date": "YYYY-MM-DD", "expected": number, "confidence": "LOW"|"MEDIUM"|"HIGH" }], "insights": string[], "recommendations": string[] }`
      const response = await cfAI(`Historical orders: ${JSON.stringify(byDay)}. Forecast next 7 days starting tomorrow.`, system)
      try { result = JSON.parse(response) } catch {
        const avg = Math.max(1, orders.length / 30)
        result = {
          forecast: Array.from({length:7},(_,i) => { const d=new Date(); d.setDate(d.getDate()+i+1); return {date:d.toISOString().split("T")[0],expected:Math.round(avg*(0.8+Math.random()*0.4)),confidence:"MEDIUM"} }),
          insights: ["Based on "+orders.length+" historical orders","Average: "+Math.round(avg)+"/day"],
          recommendations: ["Ensure driver availability for peak days","Pre-position vehicles in demand areas"]
        }
      }
    }

    else if (agent === "maintenance") {
      steps.push({ step: 1, action: "Fetching vehicle data" })
      const vehicles = await prisma.vehicle.findMany({ include: { maintenanceRecords: { take: 3, orderBy: { createdAt: "desc" } }, fuelEntries: { take: 5, orderBy: { createdAt: "desc" } } } })
      steps.push({ step: 2, action: "Running Cloudflare AI analysis" })
      const system = `You are a predictive maintenance AI for SA fleet. Respond ONLY in JSON: { "predictions": [{ "vehicleId": string, "registration": string, "riskLevel": "LOW"|"MEDIUM"|"HIGH"|"CRITICAL", "component": string, "daysUntilService": number, "recommendation": string }], "summary": string }`
      const summary = vehicles.map(v => ({ id: v.id, reg: v.registration, make: v.make+" "+v.model, km: v.odometerKm, lastService: v.maintenanceRecords[0]?.performedAt }))
      const response = await cfAI(JSON.stringify(summary), system)
      try { result = JSON.parse(response) } catch {
        result = {
          predictions: vehicles.map(v => ({ vehicleId: v.id, registration: v.registration, riskLevel: (v.odometerKm||0)>80000?"HIGH":"LOW", component:"General Service", daysUntilService:30, recommendation:"Schedule routine service" })),
          summary: "Analysis complete for "+vehicles.length+" vehicles"
        }
      }
    }

    else if (agent === "support") {
      steps.push({ step: 1, action: "Processing customer query" })
      const order = payload.orderNumber ? await prisma.order.findUnique({ where: { orderNumber: payload.orderNumber }, include: { driver: true } }) : null
      const system = `You are FleetMind customer support AI for South African logistics. Be helpful and empathetic. Respond in JSON: { "response": string, "suggestedActions": string[], "escalate": boolean, "sentiment": "POSITIVE"|"NEUTRAL"|"NEGATIVE" }`
      const prompt = `Customer: "${payload.customerMessage}". ${order ? "Order: "+order.orderNumber+", Status: "+order.status+", Driver: "+(order.driver?.name||"unassigned") : "No order found."}`
      const response = await cfAI(prompt, system)
      try { result = JSON.parse(response) } catch { result = { response, suggestedActions:["Track at /track"], escalate:false, sentiment:"NEUTRAL" } }
      steps.push({ step: 2, action: "Response generated" })
    }

    else if (agent === "route") {
      steps.push({ step: 1, action: "Fetching pending orders and vehicles" })
      const [pendingOrders, availableVehicles] = await Promise.all([
        prisma.order.findMany({ where: { status: "PENDING" }, take: 20 }),
        prisma.vehicle.findMany({ where: { status: "AVAILABLE" }, include: { driver: true } })
      ])
      steps.push({ step: 2, action: "Running AI route optimizer" })
      const system = `You are a route optimizer for SA delivery fleet. Respond ONLY in JSON: { "assignments": [{ "vehicleId": string, "registration": string, "orders": string[], "estimatedKm": number }], "unassigned": string[], "summary": string }`
      const prompt = `Orders(${pendingOrders.length}): ${pendingOrders.map(o=>o.orderNumber+"→"+o.deliveryAddress).join("; ")}. Vehicles: ${availableVehicles.map(v=>v.registration+" driver:"+(v.driver?.name||"none")).join("; ")}`
      const response = await cfAI(prompt, system)
      try { result = JSON.parse(response) } catch {
        const perV = Math.ceil(pendingOrders.length / Math.max(1, availableVehicles.length))
        result = {
          assignments: availableVehicles.map((v,i) => ({ vehicleId:v.id, registration:v.registration, orders:pendingOrders.slice(i*perV,(i+1)*perV).map(o=>o.orderNumber), estimatedKm:perV*8.5 })).filter(a=>a.orders.length>0),
          unassigned: [], summary: "Assigned "+pendingOrders.length+" orders to "+availableVehicles.length+" vehicles"
        }
      }
      steps.push({ step: 3, action: result.summary || "Routes optimized" })
    }

    const agentRun = await prisma.agentRun.create({
      data: { agentName: agent, trigger: payload?.trigger||"manual", inputPayload: payload, status: "COMPLETED", steps, outputPayload: result, durationMs: Date.now()-start, endedAt: new Date() }
    })

    return NextResponse.json({ success: true, agentRunId: agentRun.id, result, provider: "cloudflare", durationMs: Date.now()-start })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const runs = await prisma.agentRun.findMany({ orderBy: { startedAt: "desc" }, take: 20 })
    return NextResponse.json(runs)
  } catch { return NextResponse.json([]) }
}