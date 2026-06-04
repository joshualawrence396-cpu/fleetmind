import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const shifts = await prisma.driverShift.findMany({
      include: {
        driver: true
      },
      orderBy: {
        startedAt: "desc"
      }
    })

    return NextResponse.json(shifts)
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const shift = await prisma.driverShift.create({
      data: {
        driverId: body.driverId,
        startedAt: new Date(),
        startKm: body.startKm
          ? parseInt(body.startKm, 10)
          : null
      },
      include: {
        driver: true
      }
    })

    return NextResponse.json(shift)
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown error"
      },
      {
        status: 500
      }
    )
  }
}