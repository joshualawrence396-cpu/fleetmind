import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Mock data for drivers
const mockDrivers = [
  { id: '1', fullName: 'John Driver', phone: '+27721234567', status: 'AVAILABLE', rating: 4.8 },
  { id: '2', fullName: 'Mike Smith', phone: '+27729876543', status: 'ON_DUTY', rating: 4.9 },
  { id: '3', fullName: 'Sarah Johnson', phone: '+27721234987', status: 'OFF_DUTY', rating: 4.7 }
]

export async function GET() {
  try {
    // Try to get from database
    const drivers = await prisma.driver.findMany()
    return NextResponse.json(drivers.length > 0 ? drivers : mockDrivers)
  } catch (error) {
    console.log('Using mock drivers data')
    return NextResponse.json(mockDrivers)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const newDriver = {
      id: (mockDrivers.length + 1).toString(),
      ...body,
      rating: body.rating || 5.0
    }
    mockDrivers.push(newDriver)
    return NextResponse.json(newDriver, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create driver' }, { status: 500 })
  }
}
