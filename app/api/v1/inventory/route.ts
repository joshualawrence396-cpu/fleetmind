import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const items = await prisma.inventoryItem.findMany({
      include: {
        warehouse: true
      }
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching inventory:', error)

    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const item = await prisma.inventoryItem.create({
      data: {
        name: body.name || body.title || 'Unnamed Item',
        sku: body.sku,
        category: body.category || 'General',
        quantity: body.quantity || 0,
        unitPrice: body.unitPrice || 0,
        unitCost: body.unitCost ?? null,
        weight: body.weight ?? null,
        warehouseId: body.warehouseId,
        minStock: body.minStock || 0,
        maxStock: body.maxStock || 1000
      }
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Error creating inventory item:', error)

    return NextResponse.json(
      { error: 'Failed to create inventory item' },
      { status: 500 }
    )
  }
}