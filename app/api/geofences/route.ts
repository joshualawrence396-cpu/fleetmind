import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

export async function GET() {
  try {
    const geofences = await prisma.geofence.findMany({ where: { isActive: true } })
    return NextResponse.json(geofences)
  } catch { return NextResponse.json([]) }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (body.action === "check") {
      const { vehicleId, latitude, longitude } = body
      const geofences = await prisma.geofence.findMany({ where: { isActive: true } })
      const triggered = []
      for (const g of geofences) {
        const dist = distanceKm(g.centerLat, g.centerLng, latitude, longitude)
        if (dist <= g.radiusKm) {
          triggered.push({ geofence: g, distanceKm: dist })
          await prisma.geofenceEvent.create({ data: { geofenceId: g.id, vehicleId, type: "ENTER", latitude, longitude } }).catch(() => {})
          await prisma.telematicsAlert.create({ data: { vehicleId, type: "GEOFENCE_ENTER", severity: "LOW", message: `Vehicle entered geofence: ${g.name}`, payload: { geofenceId: g.id, dist } } }).catch(() => {})
        }
      }
      return NextResponse.json({ triggered, count: triggered.length })
    }
    const geofence = await prisma.geofence.create({
      data: { name: body.name, centerLat: parseFloat(body.centerLat), centerLng: parseFloat(body.centerLng), radiusKm: parseFloat(body.radiusKm || 1), type: body.type || "CIRCLE", alertOnEnter: body.alertOnEnter !== false, carrierId: body.carrierId || null }
    })
    return NextResponse.json(geofence)
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }) }
}