import { NextRequest, NextResponse } from 'next/server'

const orders = []

export async function GET() {
  return NextResponse.json(orders)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const newOrder = {
      id: (orders.length + 1).toString(),
      trackingNumber: 'FM-' + Date.now().toString(36),
      ...body,
      status: 'CREATED',
      createdAt: new Date().toISOString()
    }
    orders.push(newOrder)
    return NextResponse.json({ success: true, order: newOrder, shipment: { trackingNumber: newOrder.trackingNumber } }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
