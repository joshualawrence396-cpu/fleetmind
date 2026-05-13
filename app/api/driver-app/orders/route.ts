import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const driverId = searchParams.get("driverId")
    const orders = await prisma.order.findMany({
      where: driverId ? { driverId } : {},
      include: { driver: true, vehicle: true },
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}