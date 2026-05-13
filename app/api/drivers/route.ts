import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const drivers = await prisma.driver.findMany({
      include: { vehicle: true },
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json(drivers)
  } catch { return NextResponse.json([]) }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const driver = await prisma.driver.create({
      data: { name: body.name, email: body.email, phone: body.phone || null, status: body.status || "ACTIVE", licenseNumber: body.licenseNumber || null }
    })
    if (body.vehicleId) {
      await prisma.vehicle.update({ where: { id: body.vehicleId }, data: { driverId: driver.id, status: "ON_ROUTE" } })
    } else if (body.vehicleRegistration && body.vehicleMake && body.vehicleModel) {
      await prisma.vehicle.create({
        data: { registration: body.vehicleRegistration.toUpperCase(), make: body.vehicleMake, model: body.vehicleModel, status: "ON_ROUTE", latitude: body.vehicleLatitude ? parseFloat(body.vehicleLatitude) : -33.9249, longitude: body.vehicleLongitude ? parseFloat(body.vehicleLongitude) : 18.4241, driverId: driver.id }
      })
    }
    const updated = await prisma.driver.findUnique({ where: { id: driver.id }, include: { vehicle: true } })
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}