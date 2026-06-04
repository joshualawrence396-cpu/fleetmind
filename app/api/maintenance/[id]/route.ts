import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()

    const { id } = await params

    const record = await prisma.maintenanceRecord.update({
      where: {
        id
      },
      data: body
    })

    return NextResponse.json(record)
  } catch (error) {
    console.error('Maintenance update error:', error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to update maintenance record'
      },
      { status: 500 }
    )
  }
}