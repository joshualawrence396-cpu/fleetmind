import { NextRequest, NextResponse } from 'next/server'

const mockShippers = [
  { id: '1', legalName: 'Demo Shipper', email: 'demo@shipper.com', contactName: 'John Smith', isActive: true },
  { id: '2', legalName: 'Cape Logistics', email: 'info@capelogistics.co.za', contactName: 'Jane Doe', isActive: true },
  { id: '3', legalName: 'Joburg Express', email: 'dispatch@joburgexpress.co.za', contactName: 'Mike Johnson', isActive: true }
]

export async function GET() {
  return NextResponse.json(mockShippers)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const newShipper = {
      id: (mockShippers.length + 1).toString(),
      ...body,
      isActive: true
    }
    mockShippers.push(newShipper)
    return NextResponse.json(newShipper, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create shipper' }, { status: 500 })
  }
}
