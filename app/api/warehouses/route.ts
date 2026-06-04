import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const warehouses = await prisma.warehouse.findMany({
      include: {
        items: true,
        zones: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(warehouses)
  } catch (error) {
    console.error(
      'Warehouse fetch error:',
      error
    )

    return NextResponse.json([])
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json()

    const warehouse =
      await prisma.warehouse.create({
        data: {
          name: body.name,
          location:
            body.location || '',
          address:
            body.address || '',
          capacity:
            Number(body.capacity) || 0,
          manager:
            body.manager || null,
          phone:
            body.phone || null
        }
      })

    return NextResponse.json(
      warehouse
    )
  } catch (error) {
    console.error(
      'Warehouse create error:',
      error
    )

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create warehouse'
      },
      {
        status: 500
      }
    )
  }
}