import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const routes = await prisma.route.findMany({
      include: { vehicle: true, stops: { include: { order: true } } },
      orderBy: { createdAt: "desc" },
      take: 50
    })
    return NextResponse.json(routes)
  } catch { return NextResponse.json([]) }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // Create route with stops for each assigned order
    const route = await prisma.route.create({
      data: {
        carrierId: body.carrierId || null,
        vehicleId: body.vehicleId,
        driverId: body.driverId || null,
        date: body.date ? new Date(body.date) : new Date(),
        status: "PLANNED",
        totalDistanceKm: body.totalDistanceKm || null,
      }
    })
    // Create stops for orders
    if (body.orderIds?.length > 0) {
      const orders = await prisma.order.findMany({ where: { id: { in: body.orderIds } } })
      await Promise.all(orders.map((order, index) =>
        prisma.stop.create({
          data: {
            routeId: route.id,
            orderId: order.id,
            sequence: index + 1,
            type: "DELIVERY",
            address: order.deliveryAddress,
            status: "PENDING",
          }
        })
      ))
      // Update orders with route vehicle
      await prisma.order.updateMany({
        where: { id: { in: body.orderIds } },
        data: { vehicleId: body.vehicleId, status: "IN_PROGRESS" }
      })
    }
    const full = await prisma.route.findUnique({ where: { id: route.id }, include: { stops: true, vehicle: true } })
    return NextResponse.json(full)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}