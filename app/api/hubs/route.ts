import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const hubs = await prisma.hub.findMany({ orderBy: { createdAt: "desc" } })
    return NextResponse.json(hubs)
  } catch { return NextResponse.json([]) }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const hub = await prisma.hub.create({
      data: {
        carrierId: body.carrierId || "default",
        code: body.code || "HUB-" + Date.now(),
        name: body.name,
        type: body.type || "DEPOT",
        address: body.address,
        latitude: parseFloat(body.latitude) || -33.9249,
        longitude: parseFloat(body.longitude) || 18.4241,
        isActive: true,
      }
    })
    return NextResponse.json(hub)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}