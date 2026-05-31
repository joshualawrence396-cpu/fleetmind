import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// POST /api/telematics/ingest
// Called by GPS devices or telematics adapters (Cartrack, Geotab, etc)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { deviceId, vehicleId, latitude, longitude, speedKmh, heading, ignition, fuelLevelPct, odometerKm, engineRpm, timestamp } = body

    // Find vehicle by deviceId or vehicleId
    let vehicle = null
    if (vehicleId) {
      vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } })
    } else if (deviceId) {
      vehicle = await prisma.vehicle.findFirst({ where: { telematicsDeviceId: deviceId } })
    }

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }

    // Store event
    const event = await prisma.telematicsEvent.create({
      data: {
        vehicleId: vehicle.id,
        deviceId: deviceId || null,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        speedKmh: speedKmh ? parseFloat(speedKmh) : null,
        heading: heading ? parseFloat(heading) : null,
        ignition: ignition !== undefined ? Boolean(ignition) : null,
        fuelLevelPct: fuelLevelPct ? parseFloat(fuelLevelPct) : null,
        odometerKm: odometerKm ? parseFloat(odometerKm) : null,
        engineRpm: engineRpm ? parseInt(engineRpm) : null,
        rawData: body,
      }
    })

    // Update vehicle location
    await prisma.vehicle.update({
      where: { id: vehicle.id },
      data: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        status: ignition === false ? "AVAILABLE" : "ON_ROUTE",
        odometerKm: odometerKm ? parseInt(odometerKm) : vehicle.odometerKm,
      }
    })

    // Check for alerts
    const alerts: any[] = []
    if (speedKmh && parseFloat(speedKmh) > 120) {
      alerts.push({ type: "SPEEDING", severity: "HIGH", message: `Vehicle ${vehicle.registration} speeding at ${speedKmh}km/h` })
    }
    if (fuelLevelPct && parseFloat(fuelLevelPct) < 15) {
      alerts.push({ type: "LOW_FUEL", severity: "MEDIUM", message: `Vehicle ${vehicle.registration} fuel low at ${fuelLevelPct}%` })
    }

    if (alerts.length > 0) {
      await Promise.all(alerts.map(alert =>
        prisma.telematicsAlert.create({
          data: { vehicleId: vehicle!.id, type: alert.type, severity: alert.severity, message: alert.message, payload: body }
        })
      ))
    }

    return NextResponse.json({ success: true, eventId: event.id, alerts: alerts.length })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// GET /api/telematics/ingest?vehicleId=xxx - get latest events
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get("vehicleId")
    const limit = parseInt(searchParams.get("limit") || "50")

    const events = await prisma.telematicsEvent.findMany({
      where: vehicleId ? { vehicleId } : {},
      orderBy: { timestamp: "desc" },
      take: limit,
      include: { vehicle: { select: { registration: true, make: true, model: true } } }
    })

    return NextResponse.json(events)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}