import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: { driver: true }
    })
    return NextResponse.json(vehicles)
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const vehicle = await prisma.vehicle.create({
      data: {
        registration: body.registration,
        make: body.make,
        model: body.model,
        status: body.status || "AVAILABLE",
        latitude: body.latitude ? parseFloat(body.latitude) : -33.9249,
        longitude: body.longitude ? parseFloat(body.longitude) : 18.4241,
      },
      include: { driver: true }
    })
    return NextResponse.json(vehicle)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}