import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const bin = await prisma.warehouseBin.create({
      data: {
        zoneId: body.zoneId,
        code: body.code,
        type: body.type,
        capacity: body.capacity || {},
        isActive: true
      },
      include: {
        zone: {
          include: {
            warehouse: true
          }
        }
      }
    })
    
    return NextResponse.json(bin, { status: 201 })
  } catch (error) {
    console.error('Error creating bin:', error)
    return NextResponse.json({ error: 'Failed to create bin' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const zoneId = searchParams.get('zoneId')
  
  try {
    const bins = await prisma.warehouseBin.findMany({
      where: zoneId ? { zoneId } : {},
      include: {
        zone: true,
        inventoryHoldings: {
          include: {
            item: true
          }
        }
      }
    })
    return NextResponse.json(bins)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bins' }, { status: 500 })
  }
}