import { NextRequest, NextResponse } from 'next/server'

const mockCompanies = [
  { id: '1', name: 'Demo Logistics', slug: 'demo', subscription: 'PRO', status: 'ACTIVE', _count: { users: 3 }, createdAt: new Date().toISOString() },
  { id: '2', name: 'Cape Logistics', slug: 'cape-logistics', subscription: 'BASIC', status: 'ACTIVE', _count: { users: 2 }, createdAt: new Date().toISOString() },
  { id: '3', name: 'Joburg Express', slug: 'joburg-express', subscription: 'ENTERPRISE', status: 'ACTIVE', _count: { users: 5 }, createdAt: new Date().toISOString() }
]

export async function GET() {
  return NextResponse.json(mockCompanies)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const newCompany = {
      id: (mockCompanies.length + 1).toString(),
      ...body,
      subscription: 'TRIAL',
      status: 'ACTIVE',
      _count: { users: 0 },
      createdAt: new Date().toISOString()
    }
    mockCompanies.push(newCompany)
    return NextResponse.json(newCompany, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 })
  }
}
