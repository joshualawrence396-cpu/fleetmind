import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        maintenanceRecords: { orderBy: { createdAt: "desc" }, take: 3 },
        fuelEntries: { orderBy: { createdAt: "desc" }, take: 10 },
        telematicsEvents: { orderBy: { timestamp: "desc" }, take: 20 }
      }
    })

    const vehicleData = vehicles.map(v => {
      const lastService = v.maintenanceRecords[0]?.performedAt
      const daysSince = lastService ? Math.round((Date.now() - new Date(lastService).getTime()) / 86400000) : 90
      const avgSpeed = v.telematicsEvents.length > 0 ? v.telematicsEvents.reduce((s,e) => s+(e.speedKmh||0), 0)/v.telematicsEvents.length : 60
      const fuelTrend = v.fuelEntries.length > 1 ? v.fuelEntries[0].litres - v.fuelEntries[1].litres : 0
      return { id: v.id, registration: v.registration, odometerKm: v.odometerKm || 0, daysSinceService: daysSince, avgSpeedKmh: Math.round(avgSpeed), fuelTrend }
    })

    const mlUrl = process.env.ML_SERVICE_URL || "http://localhost:8000"
    try {
      const res = await fetch(`${mlUrl}/maintenance/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicles: vehicleData }),
        signal: AbortSignal.timeout(10000)
      })
      if (res.ok) return NextResponse.json(await res.json())
    } catch { console.log("ML service not available") }

    // Fallback predictions
    const predictions = vehicleData.map(v => {
      const risk = Math.min(1, (v.odometerKm/150000)*0.4 + (v.daysSinceService/180)*0.35 + 0.25)
      const level = risk > 0.75 ? "CRITICAL" : risk > 0.5 ? "HIGH" : risk > 0.25 ? "MEDIUM" : "LOW"
      return { vehicleId: v.id, registration: v.registration, riskLevel: level, riskScore: round2(risk), component: risk>0.75 ? "Engine/Transmission" : risk>0.5 ? "Brakes/Tyres" : "Oil/Filters", daysUntilService: Math.round((1-risk)*90), recommendation: `Schedule service within ${Math.round((1-risk)*90)} days` }
    })
    return NextResponse.json({ success: true, predictions, summary: `${vehicles.length} vehicles analyzed`, model: "rule-based" })
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }) }
}

function round2(n: number) { return Math.round(n*100)/100 }