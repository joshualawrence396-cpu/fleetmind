import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const zone = await prisma.warehouseZone.create({
      data: {
        warehouseId: body.warehouseId,
        code: body.code,
        name: body.name,
        type: body.type,
        isActive: true
      },
      include: {
        warehouse: true
      }
    })
    
    return NextResponse.json(zone, { status: 201 })
  } catch (error) {
    console.error('Error creating zone:', error)
    return NextResponse.json({ error: 'Failed to create zone' }, { status: 500 })
  }
}