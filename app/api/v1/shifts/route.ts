import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { driverId, action, startKm, endKm } = await req.json()
    
    if (!driverId) {
      return NextResponse.json({ error: 'Driver ID is required' }, { status: 400 })
    }
    
    let result
    
    if (action === 'CLOCK_IN') {
      // Check if driver already has an active shift
      const activeShift = await prisma.driverShift.findFirst({
        where: { driverId, endedAt: null }
      })
      
      if (activeShift) {
        return NextResponse.json({ error: 'Driver already clocked in' }, { status: 400 })
      }
      
      result = await prisma.driverShift.create({
        data: {
          driverId,
          startedAt: new Date(),
          startKm: startKm || 0
        }
      })
      
      await prisma.driver.update({
        where: { id: driverId },
        data: { status: 'ON_DUTY' }
      })
      
      return NextResponse.json({ success: true, action: 'CLOCK_IN', shift: result })
      
    } else if (action === 'CLOCK_OUT') {
      const activeShift = await prisma.driverShift.findFirst({
        where: { driverId, endedAt: null }
      })
      
      if (!activeShift) {
        return NextResponse.json({ error: 'No active shift found' }, { status: 400 })
      }
      
      result = await prisma.driverShift.update({
        where: { id: activeShift.id },
        data: {
          endedAt: new Date(),
          endKm: endKm || activeShift.startKm
        }
      })
      
      await prisma.driver.update({
        where: { id: driverId },
        data: { status: 'OFF_DUTY' }
      })
      
      return NextResponse.json({ success: true, action: 'CLOCK_OUT', shift: result })
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    
  } catch (error) {
    console.error('Shift action error:', error)
    return NextResponse.json({ 
      error: 'Failed to process shift action',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const driverId = searchParams.get('driverId')
    const date = searchParams.get('date')
    
    const queryDate = date ? new Date(date) : new Date()
    queryDate.setHours(0, 0, 0, 0)
    const nextDate = new Date(queryDate)
    nextDate.setDate(nextDate.getDate() + 1)
    
    const shifts = await prisma.driverShift.findMany({
      where: {
        driverId: driverId || undefined,
        startedAt: {
          gte: queryDate,
          lt: nextDate
        }
      },
      include: { driver: true },
      orderBy: { startedAt: 'desc' }
    })
    
    return NextResponse.json(shifts)
  } catch (error) {
    console.error('Get shifts error:', error)
    return NextResponse.json({ error: 'Failed to fetch shifts' }, { status: 500 })
  }
}