import { NextRequest, NextResponse } from 'next/server'

const mockShipments = [
  { id: '1', trackingNumber: 'FM-ORD-001', orderId: '1', status: 'DELIVERED', weightKg: 2.5 },
  { id: '2', trackingNumber: 'FM-ORD-002', orderId: '2', status: 'IN_TRANSIT', weightKg: 1.8 },
  { id: '3', trackingNumber: 'FM-ORD-003', orderId: '3', status: 'CREATED', weightKg: 3.2 }
]

export async function GET() {
  return NextResponse.json(mockShipments)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const newShipment = {
      id: (mockShipments.length + 1).toString(),
      trackingNumber: 'FM-' + Date.now().toString(36),
      ...body,
      createdAt: new Date().toISOString()
    }
    mockShipments.push(newShipment)
    return NextResponse.json(newShipment, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create shipment' }, { status: 500 })
  }
}
