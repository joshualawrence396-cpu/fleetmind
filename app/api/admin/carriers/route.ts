import { NextRequest, NextResponse } from 'next/server'

const mockCarriers = [
  { id: '1', name: 'Demo Logistics', slug: 'demo', isActive: true, createdAt: new Date().toISOString() },
  { id: '2', name: 'Aramex SA', slug: 'aramex-sa', isActive: true, createdAt: new Date().toISOString() },
  { id: '3', name: 'DSV South Africa', slug: 'dsv-sa', isActive: true, createdAt: new Date().toISOString() },
  { id: '4', name: 'Imperial Logistics', slug: 'imperial', isActive: true, createdAt: new Date().toISOString() }
]

export async function GET() {
  return NextResponse.json(mockCarriers)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const newCarrier = {
      id: (mockCarriers.length + 1).toString(),
      ...body,
      isActive: true,
      createdAt: new Date().toISOString()
    }
    mockCarriers.push(newCarrier)
    return NextResponse.json(newCarrier, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create carrier' }, { status: 500 })
  }
}
