import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getTenantFilter } from "../../../lib/tenant"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const filter = await getTenantFilter()
    const vehicles = await prisma.vehicle.findMany({
      where: Object.keys(filter).length > 0 ? filter : undefined,
      include: { driver: true },
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json(vehicles)
  } catch { return NextResponse.json([]) }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const filter = await getTenantFilter()
    const vehicle = await prisma.vehicle.create({
      data: {
        ...filter,
        registration: body.registration?.toUpperCase(),
        make: body.make,
        model: body.model,
        year: body.year ? parseInt(body.year) : null,
        type: body.type || "VAN_SMALL",
        fuelType: body.fuelType || "DIESEL",
        status: body.status || "AVAILABLE",
        latitude: body.latitude ? parseFloat(body.latitude) : -33.9249,
        longitude: body.longitude ? parseFloat(body.longitude) : 18.4241,
      },
      include: { driver: true }
    })
    return NextResponse.json(vehicle)
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }) }
}