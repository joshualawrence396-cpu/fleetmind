import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    if (!code) return NextResponse.json({ error: "No code" }, { status: 400 })
    const [order, item] = await Promise.all([
      prisma.order.findFirst({ where: { orderNumber: { contains: code.toUpperCase() } }, include: { driver: true, vehicle: true } }),
      prisma.inventoryItem.findFirst({ where: { sku: { contains: code.toUpperCase() } }, include: { warehouse: true } })
    ])
    return NextResponse.json({ order: order || null, item: item || null })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}