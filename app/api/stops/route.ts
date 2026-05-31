import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const driverId = searchParams.get("driverId")
    const routeId = searchParams.get("routeId")
    const stops = await prisma.stop.findMany({
      where: { ...(driverId && { driverId }), ...(routeId && { routeId }) },
      include: { order: true, route: { include: { vehicle: true } } },
      orderBy: { sequence: "asc" }
    })
    return NextResponse.json(stops)
  } catch { return NextResponse.json([]) }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const stop = await prisma.stop.update({
      where: { id: body.id },
      data: {
        status: body.status,
        actualArrival: body.status === "ARRIVED" ? new Date() : undefined,
        podPhotoUrl: body.podPhotoUrl || undefined,
        signatureUrl: body.signatureUrl || undefined,
        failureReason: body.failureReason || undefined,
        notes: body.notes || undefined,
      },
      include: { order: true }
    })
    if (body.status === "COMPLETED" && stop.orderId) {
      await prisma.order.update({ where: { id: stop.orderId }, data: { status: "COMPLETED", completedAt: new Date() } })
    }
    if (body.status === "FAILED" && stop.orderId) {
      await prisma.order.update({ where: { id: stop.orderId }, data: { status: "PENDING", failureReason: body.failureReason } })
    }
    return NextResponse.json(stop)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}