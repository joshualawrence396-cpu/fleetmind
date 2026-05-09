import { NextRequest, NextResponse } from 'next/server'

const mockCouriers = [
  { id: '1', provider: 'BOB_GO', name: 'Bob Go Courier', isActive: true, createdAt: new Date().toISOString() },
  { id: '2', provider: 'ARAMEX', name: 'Aramex SA', isActive: true, createdAt: new Date().toISOString() },
  { id: '3', provider: 'DSV', name: 'DSV South Africa', isActive: true, createdAt: new Date().toISOString() },
  { id: '4', provider: 'COURIER_GUY', name: 'The Courier Guy', isActive: true, createdAt: new Date().toISOString() },
  { id: '5', provider: 'PUDO', name: 'PUDO Pickup Points', isActive: true, createdAt: new Date().toISOString() }
]

export async function GET() {
  return NextResponse.json(mockCouriers)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const newCourier = {
      id: (mockCouriers.length + 1).toString(),
      ...body,
      isActive: true,
      createdAt: new Date().toISOString()
    }
    mockCouriers.push(newCourier)
    return NextResponse.json(newCourier, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create courier' }, { status: 500 })
  }
}
