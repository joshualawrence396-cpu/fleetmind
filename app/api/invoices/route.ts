import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      where: { status: "COMPLETED" },
      include: { driver: true, vehicle: true },
      orderBy: { completedAt: "desc" }
    })
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}