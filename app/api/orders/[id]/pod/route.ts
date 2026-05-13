import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function POST(request, { params }) {
  try {
    const body = await request.json()
    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status: "COMPLETED", completedAt: new Date(), podNote: body.note || null, podPhotoUrl: body.photo || null },
      include: { driver: true, vehicle: true }
    })
    return NextResponse.json({ success: true, order })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}