import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/fuel - Get all fuel logs
export async function GET() {
  try {
    const fuelLogs = await prisma.fuelLog.findMany({
      include: {
        vehicle: {
          select: { registration: true, make: true, model: true }
        },
        driver: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(fuelLogs)
  } catch (error) {
    console.error('Fuel logs fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch fuel logs' }, { status: 500 })
  }
}

// POST /api/fuel - Create new fuel log
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vehicleId, liters, cost, odometer, fuelType, station, driverId } = body

    if (!vehicleId || !liters || !cost) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const fuelLog = await prisma.fuelLog.create({
      data: {
        vehicleId,
        liters: parseFloat(liters),
        cost: parseFloat(cost),
        odometer: odometer ? parseInt(odometer) : null,
        fuelType: fuelType || 'DIESEL',
        station,
        driverId
      },
      include: {
        vehicle: {
          select: { registration: true, make: true, model: true }
        },
        driver: {
          select: { name: true }
        }
      }
    })

    return NextResponse.json(fuelLog, { status: 201 })
  } catch (error) {
    console.error('Fuel log creation error:', error)
    return NextResponse.json({ error: 'Failed to create fuel log' }, { status: 500 })
  }
}