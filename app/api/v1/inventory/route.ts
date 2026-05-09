import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const items = await prisma.inventoryItem.findMany()
    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const item = await prisma.inventoryItem.create({
      data: {
        sku: body.sku,
        title: body.title,
        quantity: body.quantity || 0,
        weight: body.weight
      }
    })
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create inventory item' }, { status: 500 })
  }
}
