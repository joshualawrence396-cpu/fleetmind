import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getTenantFilter } from "../../../lib/tenant"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const filter = await getTenantFilter()
    const orders = await prisma.order.findMany({
      where: Object.keys(filter).length > 0 ? filter : undefined,
      include: { driver: true, vehicle: true },
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json(orders)
  } catch { return NextResponse.json([]) }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const filter = await getTenantFilter()
    const order = await prisma.order.create({
      data: {
        ...filter,
        orderNumber: "ORD-" + Date.now(),
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone,
        deliveryAddress: body.deliveryAddress,
        pickupAddress: body.pickupAddress,
        status: "PENDING",
        priority: body.priority || "NORMAL",
        driverId: body.driverId || null,
        vehicleId: body.vehicleId || null,
      },
      include: { driver: true, vehicle: true }
    })
    return NextResponse.json(order)
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }) }
}