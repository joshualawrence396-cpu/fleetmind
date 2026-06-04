import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const order = await prisma.order.update({
      where: { id },
      data: {
        ...(body.status && { status: body.status }),
        ...(body.driverId !== undefined && { driverId: body.driverId }),
        ...(body.vehicleId !== undefined && { vehicleId: body.vehicleId }),
        ...(body.status === "COMPLETED" && {
          completedAt: new Date(),
        }),
        ...(body.podNotes && { podNotes: body.podNotes }),
      },
      include: {
        driver: true,
        vehicle: true,
      },
    })

    return NextResponse.json(order)
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.order.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 500 }
    )
  }
}