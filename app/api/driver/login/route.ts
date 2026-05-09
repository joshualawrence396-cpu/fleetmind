import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { driverId, phoneNumber } = await req.json()
    
    let driver
    if (driverId) {
      driver = await prisma.driver.findUnique({
        where: { id: driverId }
      })
    } else if (phoneNumber) {
      driver = await prisma.driver.findFirst({
        where: { phone: phoneNumber }
      })
    }
    
    if (!driver) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 })
    }
    
    return NextResponse.json({
      id: driver.id,
      name: driver.fullName,
      phone: driver.phone
    })
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
