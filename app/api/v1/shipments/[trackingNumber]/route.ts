import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trackingNumber: string }> }
) {
  try {
    const { trackingNumber } = await params
    
    if (!trackingNumber) {
      return NextResponse.json({ error: 'Tracking number is required' }, { status: 400 })
    }
    
    const shipment = await prisma.shipment.findUnique({
      where: { trackingNumber: trackingNumber }
    })
    
    if (!shipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 })
    }
    
    return NextResponse.json(shipment)
    
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch shipment',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}