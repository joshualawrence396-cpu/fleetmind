import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: { driver: true, maintenanceRecords: { take: 1, orderBy: { createdAt: "desc" } }, fuelEntries: { take: 1, orderBy: { createdAt: "desc" } } },
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json(vehicles)
  } catch { return NextResponse.json([]) }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const vehicle = await prisma.vehicle.create({
      data: {
        registration: body.registration,
        make: body.make,
        model: body.model,
        year: body.year ? parseInt(body.year) : null,
        type: body.type || "VAN_SMALL",
        fuelType: body.fuelType || "DIESEL",
        status: body.status || "AVAILABLE",
        latitude: body.latitude ? parseFloat(body.latitude) : -33.9249,
        longitude: body.longitude ? parseFloat(body.longitude) : 18.4241,
        capacityKg: body.capacityKg ? parseFloat(body.capacityKg) : null,
        odometerKm: body.odometerKm ? parseInt(body.odometerKm) : null,
      },
      include: { driver: true }
    })
    return NextResponse.json(vehicle)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}