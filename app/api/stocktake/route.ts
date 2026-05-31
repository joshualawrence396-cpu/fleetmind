import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const stocktakes = await prisma.stocktake.findMany({
      include: { warehouse: true, counts: true },
      orderBy: { startedAt: "desc" },
      take: 20
    })
    return NextResponse.json(stocktakes)
  } catch { return NextResponse.json([]) }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (body.action === "start") {
      const items = await prisma.inventoryItem.findMany({ where: { warehouseId: body.warehouseId } })
      const stocktake = await prisma.stocktake.create({
        data: {
          warehouseId: body.warehouseId,
          status: "IN_PROGRESS",
          performedById: body.userId || null,
          counts: {
            create: items.map(item => ({ itemId: item.id, expected: item.quantity, counted: 0, variance: -item.quantity }))
          }
        },
        include: { counts: true }
      })
      return NextResponse.json(stocktake)
    }
    if (body.action === "count") {
      const count = await prisma.stocktakeCount.update({
        where: { id: body.countId },
        data: { counted: body.counted, variance: body.counted - body.expected }
      })
      return NextResponse.json(count)
    }
    if (body.action === "complete") {
      const stocktake = await prisma.stocktake.findUnique({ where: { id: body.stocktakeId }, include: { counts: true } })
      await Promise.all(stocktake!.counts.map(c =>
        prisma.inventoryItem.update({ where: { id: c.itemId }, data: { quantity: c.counted } })
      ))
      const updated = await prisma.stocktake.update({ where: { id: body.stocktakeId }, data: { status: "COMPLETED", completedAt: new Date() } })
      return NextResponse.json(updated)
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}