import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const shifts = await prisma.driverShift.findMany({ include: { driver: true }, orderBy: { startedAt: "desc" } })
    return NextResponse.json(shifts)
  } catch { return NextResponse.json([]) }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const shift = await prisma.driverShift.create({
      data: { driverId: body.driverId, startedAt: new Date(), startKm: body.startKm ? parseInt(body.startKm) : null },
      include: { driver: true }
    })
    return NextResponse.json(shift)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}