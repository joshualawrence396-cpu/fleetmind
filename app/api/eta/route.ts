import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

function estimateETA(vehicleLat: number, vehicleLng: number, destLat: number, destLng: number): number {
  const R = 6371
  const dLat = (destLat - vehicleLat) * Math.PI / 180
  const dLng = (destLng - vehicleLng) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(vehicleLat * Math.PI / 180) * Math.cos(destLat * Math.PI / 180) * Math.sin(dLng/2) * Math.sin(dLng/2)
  const distKm = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const avgSpeedKmh = 35 // SA urban average
  return Math.round((distKm / avgSpeedKmh) * 60) // minutes
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")
    if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 })

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { vehicle: true, driver: true }
    })
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })

    let etaMinutes = null
    let etaTime = null
    if (order.vehicle?.latitude && order.vehicle?.longitude) {
      // Simple geocode estimate for SA cities
      const destCoords: Record<string, [number, number]> = {
        "cape town": [-33.9249, 18.4241], "johannesburg": [-26.2041, 28.0473],
        "durban": [-29.8587, 31.0218], "pretoria": [-25.7479, 28.2293],
        "bellville": [-33.9001, 18.6301], "sandton": [-26.1071, 28.0571],
      }
      const addrLower = order.deliveryAddress.toLowerCase()
      let destLat = -33.9249, destLng = 18.4241
      for (const [city, coords] of Object.entries(destCoords)) {
        if (addrLower.includes(city)) { destLat = coords[0]; destLng = coords[1]; break }
      }
      etaMinutes = estimateETA(order.vehicle.latitude, order.vehicle.longitude, destLat, destLng)
      const eta = new Date(); eta.setMinutes(eta.getMinutes() + etaMinutes)
      etaTime = eta.toISOString()
    }

    return NextResponse.json({ orderId, orderNumber: order.orderNumber, status: order.status, etaMinutes, etaTime, vehicleLat: order.vehicle?.latitude, vehicleLng: order.vehicle?.longitude, driverName: order.driver?.name })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}