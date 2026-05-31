import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      where: { status: { in: ["PENDING", "IN_PROGRESS", "COMPLETED"] } },
      include: { driver: true, vehicle: true },
      orderBy: { createdAt: "desc" },
      take: 30,
    })
    return NextResponse.json(orders)
  } catch { return NextResponse.json([]) }
}