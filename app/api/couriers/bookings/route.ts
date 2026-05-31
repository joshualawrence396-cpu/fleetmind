import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const bookings = await prisma.courierBooking.findMany({
      include: {
        order: { select: { orderNumber: true, customerName: true, deliveryAddress: true, status: true } },
        courierAccount: { select: { name: true, provider: true } }
      },
      orderBy: { createdAt: "desc" },
      take: 100
    })
    return NextResponse.json(bookings)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}