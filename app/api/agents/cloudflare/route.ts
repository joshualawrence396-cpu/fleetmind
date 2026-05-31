import { NextResponse } from "next/server"
import { cloudflareAI } from "../../../../lib/cloudflare-ai"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { agent, payload } = await request.json()
    const start = Date.now()
    let result: any = {}

    if (agent === "dispatcher") {
      const order = payload.orderId ? await prisma.order.findUnique({
        where: { id: payload.orderId }, include: { driver: true, vehicle: true }
      }) : null
      const drivers = await prisma.driver.findMany({ where: { status: "ACTIVE" }, include: { vehicle: true } })

      const systemPrompt = `You are FleetMind's dispatcher AI for a South African logistics company. 
Respond ONLY in valid JSON: { "action": string, "reason": string, "reassignTo": string|null, "customerMessage": string, "priority": "LOW"|"MEDIUM"|"HIGH"|"URGENT" }`

      const prompt = order
        ? `Order ${order.orderNumber} issue: "${payload.issue}". Customer: ${order.customerName}. Address: ${order.deliveryAddress}. Available drivers: ${drivers.map(d => d.name + " (" + d.vehicle?.registration + ")").join(", ")}. What action?`
        : `Issue: "${payload.issue}". Available drivers: ${drivers.map(d => d.name).join(", ")}. What action?`

      const response = await cloudflareAI(prompt, systemPrompt)
      try { result = JSON.parse(response) } catch { result = { action: response, reason: "AI response", customerMessage: "We are handling your query.", priority: "MEDIUM" } }
    }

    else if (agent === "support") {
      const systemPrompt = `You are FleetMind customer support AI for South African logistics. Be helpful and empathetic. Respond in JSON: { "response": string, "suggestedActions": string[], "escalate": boolean, "sentiment": "POSITIVE"|"NEUTRAL"|"NEGATIVE" }`
      const response = await cloudflareAI(payload.message || "Where is my order?", systemPrompt)
      try { result = JSON.parse(response) } catch { result = { response, suggestedActions: ["Track your order at fleetmind.co.za/track"], escalate: false, sentiment: "NEUTRAL" } }
    }

    else if (agent === "demand") {
      const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 100, select: { createdAt: true, status: true } })
      const byDay: Record<string, number> = {}
      orders.forEach(o => { const d = o.createdAt.toISOString().split("T")[0]; byDay[d] = (byDay[d]||0)+1 })

      const systemPrompt = `You are a demand forecasting AI for SA logistics. Respond ONLY in JSON: { "forecast": [{ "date": "YYYY-MM-DD", "expected": number, "confidence": "LOW"|"MEDIUM"|"HIGH" }], "insights": string[] }`
      const prompt = `Historical orders: ${JSON.stringify(byDay)}. Forecast next 7 days.`
      const response = await cloudflareAI(prompt, systemPrompt)
      try { result = JSON.parse(response) } catch {
        const avg = orders.length / 30
        result = {
          forecast: Array.from({length:7}, (_,i) => { const d=new Date(); d.setDate(d.getDate()+i+1); return {date:d.toISOString().split("T")[0],expected:Math.round(avg*(0.8+Math.random()*0.4)),confidence:"MEDIUM"} }),
          insights: ["Based on "+orders.length+" orders", "Average: "+Math.round(avg)+"/day"]
        }
      }
    }

    await prisma.agentRun.create({
      data: { agentName: "cf_"+agent, trigger: payload?.trigger||"manual", inputPayload: payload, status: "COMPLETED", steps: [], outputPayload: result, durationMs: Date.now()-start, endedAt: new Date() }
    })

    return NextResponse.json({ success: true, result, provider: "cloudflare", durationMs: Date.now()-start })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}