import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const items = await prisma.inventoryItem.findMany({ include: { warehouse: true, movements: { take: 5, orderBy: { createdAt: "desc" } } }, orderBy: { createdAt: "desc" } })
    return NextResponse.json(items)
  } catch { return NextResponse.json([]) }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const item = await prisma.inventoryItem.create({
      data: { name: body.name, sku: body.sku, category: body.category, quantity: parseInt(body.quantity), unitPrice: parseFloat(body.unitPrice), warehouseId: body.warehouseId, minStock: body.minStock ? parseInt(body.minStock) : 0, maxStock: body.maxStock ? parseInt(body.maxStock) : 1000, weight: body.weight ? parseFloat(body.weight) : null, unitCost: body.unitCost ? parseFloat(body.unitCost) : null },
      include: { warehouse: true }
    })
    await prisma.inventoryMovement.create({ data: { itemId: item.id, type: "RECEIVE", quantity: item.quantity, reference: "Initial stock" } })
    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}