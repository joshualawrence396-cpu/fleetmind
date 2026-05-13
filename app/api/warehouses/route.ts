import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const warehouses = await prisma.warehouse.findMany({ include: { items: true, zones: true }, orderBy: { createdAt: "desc" } })
    return NextResponse.json(warehouses)
  } catch { return NextResponse.json([]) }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const warehouse = await prisma.warehouse.create({
      data: { name: body.name, location: body.location, address: body.address, capacity: parseInt(body.capacity), manager: body.manager || null, phone: body.phone || null }
    })
    return NextResponse.json(warehouse)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}