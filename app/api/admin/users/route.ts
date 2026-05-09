import { NextRequest, NextResponse } from 'next/server'

const mockUsers = [
  { id: '1', email: 'admin@fleetmind.com', fullName: 'Admin User', role: 'SUPER_ADMIN', phone: '+27721234567', company: { id: '1', name: 'Demo Logistics', slug: 'demo' }, isActive: true },
  { id: '2', email: 'john@demo.com', fullName: 'John Driver', role: 'DRIVER', phone: '+27729876543', company: { id: '1', name: 'Demo Logistics', slug: 'demo' }, isActive: true },
  { id: '3', email: 'jane@demo.com', fullName: 'Jane Dispatcher', role: 'DISPATCHER', phone: '+27721234987', company: { id: '1', name: 'Demo Logistics', slug: 'demo' }, isActive: true }
]

export async function GET() {
  return NextResponse.json(mockUsers)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      ...body,
      isActive: true
    }
    mockUsers.push(newUser)
    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
