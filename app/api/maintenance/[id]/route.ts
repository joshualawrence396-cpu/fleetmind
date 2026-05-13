import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function PATCH(request, { params }) {
  try {
    const body = await request.json()
    const record = await prisma.maintenanceRecord.update({ where: { id: params.id }, data: { status: body.status }, include: { vehicle: true } })
    if (body.status === "COMPLETED") {
      await prisma.vehicle.update({ where: { id: record.vehicleId }, data: { status: "AVAILABLE" } })
    }
    return NextResponse.json(record)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}