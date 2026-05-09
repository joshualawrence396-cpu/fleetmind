import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { driverId } = await req.json()
    
    const shift = await prisma.driverShift.create({
      data: {
        driverId: driverId,
        startedAt: new Date(),
        startKm: 0
      }
    })
    
    await prisma.driver.update({
      where: { id: driverId },
      data: { status: 'ON_DUTY' }
    })
    
    return NextResponse.json({ success: true, shift })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clock in' }, { status: 500 })
  }
}
