import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const driver = await prisma.driver.update({
      where: { id: params.id },
      data: {
        ...(body.latitude && { latitude: parseFloat(body.latitude) }),
        ...(body.longitude && { longitude: parseFloat(body.longitude) }),
        ...(body.status && { status: body.status }),
        ...(body.vehicleId !== undefined && { vehicleId: body.vehicleId || null }),
      },
      include: { vehicle: true }
    })
    return NextResponse.json(driver)
  } catch(e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.driver.delete({ where: { id: params.id } })
    return NextResponse.json({ deleted: true })
  } catch(e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
