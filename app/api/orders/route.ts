import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { driver: true, vehicle: true },
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json(orders)
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const orderNumber = "ORD-" + Date.now()
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone,
        deliveryAddress: body.deliveryAddress,
        pickupAddress: body.pickupAddress,
        status: body.status || "PENDING",
        priority: body.priority || "NORMAL",
        driverId: body.driverId || null,
        vehicleId: body.vehicleId || null,
      },
      include: { driver: true, vehicle: true }
    })
    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}