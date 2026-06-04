import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const warehouses = await prisma.warehouse.findMany()

    return NextResponse.json(warehouses)
  } catch (error) {
    console.error(
      'Error fetching warehouses:',
      error
    )

    return NextResponse.json([])
  }
}

export async function POST(
  req: NextRequest
) {
  try {
    const body = await req.json()

    const carrier =
      await prisma.carrier.findFirst()

    const warehouse =
      await prisma.warehouse.create({
        data: {
          carrierId: carrier?.id ?? null,

          name:
            body.name ??
            'New Warehouse',

          location:
            body.location ?? '',

          address:
            body.address ?? '',

          capacity:
            Number(body.capacity) || 0,

          currentStock: 0,

          manager:
            body.manager ?? null,

          phone:
            body.phone ?? null,

          latitude:
            body.latitude ?? null,

          longitude:
            body.longitude ?? null,

          hasColdChain:
            body.hasColdChain ??
            false,

          hasHazmat:
            body.hasHazmat ??
            false
        }
      })

    return NextResponse.json(
      warehouse,
      {
        status: 201
      }
    )
  } catch (error) {
    console.error(
      'Warehouse creation error:',
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
