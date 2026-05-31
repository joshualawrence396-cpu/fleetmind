import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const alerts = await prisma.telematicsAlert.findMany({
      where: { acknowledgedAt: null },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { vehicle: { select: { registration: true, make: true, model: true } } }
    })
    return NextResponse.json(alerts)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const alert = await prisma.telematicsAlert.update({
      where: { id: body.id },
      data: { acknowledgedAt: new Date(), acknowledgedById: body.userId || "admin" }
    })
    return NextResponse.json(alert)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}