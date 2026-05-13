import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function PATCH(request, { params }) {
  try {
    const body = await request.json()
    const data: any = {}
    if (body.status) { data.status = body.status; if (body.status === "COMPLETED") data.completedAt = new Date() }
    if (body.driverId !== undefined) data.driverId = body.driverId
    if (body.vehicleId !== undefined) data.vehicleId = body.vehicleId
    const order = await prisma.order.update({ where: { id: params.id }, data, include: { driver: true, vehicle: true } })
    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.order.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}