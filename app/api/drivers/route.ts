import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const drivers = await prisma.driver.findMany({ include: { vehicle: true }, orderBy: { createdAt: "desc" } })
    return NextResponse.json(drivers)
  } catch { return NextResponse.json([]) }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const driver = await prisma.driver.create({
      data: {
        name: body.name,
        phone: body.phone,
        email: body.email || null,
        licenseNumber: body.licenseNumber || "TMP-" + Date.now(),
        licenseType: body.licenseType || "CODE10",
        status: "ACTIVE",
      },
      include: { vehicle: true }
    })
    return NextResponse.json(driver)
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }) }
}