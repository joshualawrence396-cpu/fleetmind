import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function PATCH(request, { params }) {
  try {
    const body = await request.json()
    const vehicle = await prisma.vehicle.update({
      where: { id: params.id },
      data: { latitude: parseFloat(body.latitude), longitude: parseFloat(body.longitude), status: body.status || "ON_ROUTE" },
      include: { driver: true }
    })
    await prisma.telematicsEvent.create({
      data: { vehicleId: params.id, latitude: parseFloat(body.latitude), longitude: parseFloat(body.longitude) }
    })
    return NextResponse.json(vehicle)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}