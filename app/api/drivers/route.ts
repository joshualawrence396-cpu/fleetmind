import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const drivers = await prisma.driver.findMany({
      include: { vehicle: true }
    })
    return NextResponse.json(drivers)
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(request) {
  try {
    const body = await request.json()

    // Create the driver first
    const driver = await prisma.driver.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        status: body.status || "ACTIVE",
      }
    })

    // If existing vehicle selected, assign it
    if (body.vehicleId) {
      await prisma.vehicle.update({
        where: { id: body.vehicleId },
        data: { driverId: driver.id, status: "ON_ROUTE" }
      })
    }
    // If new vehicle details provided, create and assign it
    else if (body.vehicleRegistration && body.vehicleMake && body.vehicleModel) {
      await prisma.vehicle.create({
        data: {
          registration: body.vehicleRegistration.toUpperCase(),
          make: body.vehicleMake,
          model: body.vehicleModel,
          status: "ON_ROUTE",
          latitude: body.vehicleLatitude ? parseFloat(body.vehicleLatitude) : -33.9249,
          longitude: body.vehicleLongitude ? parseFloat(body.vehicleLongitude) : 18.4241,
          driverId: driver.id
        }
      })
    }

    const updatedDriver = await prisma.driver.findUnique({
      where: { id: driver.id },
      include: { vehicle: true }
    })

    return NextResponse.json(updatedDriver)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}