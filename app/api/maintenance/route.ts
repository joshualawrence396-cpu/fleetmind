import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const records = await prisma.maintenanceRecord.findMany({
      include: {
        vehicle: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(records)
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const record = await prisma.maintenanceRecord.create({
      data: {
        vehicleId: body.vehicleId,
        type: body.type || "SERVICE",
        description: body.description,
        cost: body.cost ? parseFloat(body.cost) : null,
        performedAt: body.scheduledDate
          ? new Date(body.scheduledDate)
          : new Date(),
        performedBy: body.performedBy || null,
        status: body.status || "SCHEDULED",
        priority: body.priority || "NORMAL"
      },
      include: {
        vehicle: true
      }
    })

    if (body.status === "SCHEDULED") {
      await prisma.vehicle.update({
        where: {
          id: body.vehicleId
        },
        data: {
          status: "MAINTENANCE",
          nextServiceDate: body.scheduledDate
            ? new Date(body.scheduledDate)
            : null
        }
      })
    }

    return NextResponse.json(record)
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