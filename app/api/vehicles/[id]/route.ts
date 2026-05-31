import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const vehicle = await prisma.vehicle.update({
      where: { id: params.id },
      data: {
        ...(body.status && { status: body.status }),
        ...(body.latitude && { latitude: parseFloat(body.latitude) }),
        ...(body.longitude && { longitude: parseFloat(body.longitude) }),
        ...(body.odometerKm && { odometerKm: parseFloat(body.odometerKm) }),
        ...(body.fuelLevel !== undefined && { fuelLevel: parseFloat(body.fuelLevel) }),
        ...(body.driverId !== undefined && { driverId: body.driverId }),
      },
      include: { driver: true }
    })
    return NextResponse.json(vehicle)
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.vehicle.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}