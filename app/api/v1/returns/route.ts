import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { shipmentId, reason, notes, items } = await req.json()
    
    // Create return request
    const returnRequest = await prisma.returnRequest.create({
      data: {
        shipmentId,
        reason,
        notes,
        status: 'PENDING',
        items: items || []
      }
    })
    
    // Update shipment status
    await prisma.shipment.update({
      where: { id: shipmentId },
      data: { status: 'RETURNING' }
    })
    
    // Create return shipment
    const returnShipment = await prisma.shipment.create({
      data: {
        carrierId: (await prisma.carrier.findFirst()).id,
        orderId: (await prisma.shipment.findUnique({ where: { id: shipmentId } })).orderId,
        trackingNumber: RET-,
        serviceLevel: 'STANDARD',
        weightKg: 0,
        status: 'CREATED'
      }
    })
    
    return NextResponse.json({ 
      success: true, 
      returnRequest,
      returnShipment 
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create return' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const shipmentId = searchParams.get('shipmentId')
  
  const returns = await prisma.returnRequest.findMany({
    where: shipmentId ? { shipmentId } : {},
    include: { shipment: true },
    orderBy: { createdAt: 'desc' }
  })
  
  return NextResponse.json(returns)
}
