import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET(request, { params }) {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: params.orderNumber },
      include: { driver: true, vehicle: true }
    })
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })
    return NextResponse.json({
      orderNumber: order.orderNumber, status: order.status,
      customerName: order.customerName, deliveryAddress: order.deliveryAddress,
      priority: order.priority, completedAt: order.completedAt,
      driver: order.driver ? { name: order.driver.name, phone: order.driver.phone } : null,
      vehicle: order.vehicle ? { registration: order.vehicle.registration } : null,
      createdAt: order.createdAt, updatedAt: order.updatedAt
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}