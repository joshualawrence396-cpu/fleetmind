import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function PATCH(request, { params }) {
  try {
    const body = await request.json()
    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: body.status,
        driverId: body.driverId || undefined,
        vehicleId: body.vehicleId || undefined,
      },
      include: { driver: true, vehicle: true }
    })
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