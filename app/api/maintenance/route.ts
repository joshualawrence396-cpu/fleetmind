import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/maintenance - Get all maintenance records
export async function GET() {
  try {
    const maintenance = await prisma.maintenance.findMany({
      include: {
        vehicle: {
          select: { registration: true, make: true, model: true }
        }
      },
      orderBy: { dueDate: 'asc' }
    })

    return NextResponse.json(maintenance)
  } catch (error) {
    console.error('Maintenance fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch maintenance records' }, { status: 500 })
  }
}

// POST /api/maintenance - Create new maintenance record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { vehicleId, type, description, dueDate, dueKm, priority, cost, notes } = body

    if (!vehicleId || !type || !description || !dueDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const maintenance = await prisma.maintenance.create({
      data: {
        vehicleId,
        type,
        description,
        dueDate: new Date(dueDate),
        dueKm: dueKm ? parseInt(dueKm) : null,
        priority: priority || 'NORMAL',
        cost: cost ? parseFloat(cost) : null,
        notes
      },
      include: {
        vehicle: {
          select: { registration: true, make: true, model: true }
        }
      }
    })

    return NextResponse.json(maintenance, { status: 201 })
  } catch (error) {
    console.error('Maintenance creation error:', error)
    return NextResponse.json({ error: 'Failed to create maintenance record' }, { status: 500 })
  }
}

// PUT /api/maintenance/[id] - Update maintenance record
export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()

    if (!id) {
      return NextResponse.json({ error: 'Maintenance ID required' }, { status: 400 })
    }

    const body = await request.json()
    const { status, cost, notes, completedAt } = body

    const updateData: any = {}
    if (status) updateData.status = status
    if (cost !== undefined) updateData.cost = parseFloat(cost)
    if (notes !== undefined) updateData.notes = notes
    if (completedAt) updateData.completedAt = new Date(completedAt)

    const maintenance = await prisma.maintenance.update({
      where: { id },
      data: updateData,
      include: {
        vehicle: {
          select: { registration: true, make: true, model: true }
        }
      }
    })

    return NextResponse.json(maintenance)
  } catch (error) {
    console.error('Maintenance update error:', error)
    return NextResponse.json({ error: 'Failed to update maintenance record' }, { status: 500 })
  }
}