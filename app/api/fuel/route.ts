import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const entries = await prisma.fuelEntry.findMany({ include: { vehicle: true }, orderBy: { createdAt: "desc" } })
    return NextResponse.json(entries)
  } catch { return NextResponse.json([]) }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const entry = await prisma.fuelEntry.create({
      data: { vehicleId: body.vehicleId, driverId: body.driverId || null, litres: parseFloat(body.litres), costPerLitre: body.costPerLitre ? parseFloat(body.costPerLitre) : null, totalCost: parseFloat(body.litres) * parseFloat(body.costPerLitre || 0), station: body.station || null, odometerKm: body.odometerKm ? parseInt(body.odometerKm) : null, date: body.date ? new Date(body.date) : new Date() },
      include: { vehicle: true }
    })
    return NextResponse.json(entry)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}