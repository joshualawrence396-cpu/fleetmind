import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const warehouses = await prisma.warehouse.findMany()
    return NextResponse.json(warehouses)
  } catch (error) {
    console.error('Error fetching warehouses:', error)
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const carrier = await prisma.carrier.findFirst()
    const warehouse = await prisma.warehouse.create({
      data: {
        carrierId: carrier?.id || '',
        code: body.code,
        name: body.name,
        latitude: body.latitude,
        longitude: body.longitude,
        isActive: true
      }
    })
    return NextResponse.json(warehouse, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create warehouse' }, { status: 500 })
  }
}
