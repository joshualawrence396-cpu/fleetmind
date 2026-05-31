import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export async function GET() {
  try {
    const returns = await prisma.returnOrder.findMany({ orderBy: { createdAt: "desc" }, take: 50 })
    return NextResponse.json(returns)
  } catch { return NextResponse.json([]) }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const returnOrder = await prisma.returnOrder.create({
      data: {
        orderId: body.orderId,
        reason: body.reason,
        status: "REQUESTED",
        condition: body.condition || null,
        notes: body.notes || null,
        refundAmount: body.refundAmount ? parseFloat(body.refundAmount) : null,
      }
    })
    await prisma.order.update({ where: { id: body.orderId }, data: { status: "RETURNED", failureReason: body.reason } }).catch(() => {})
    await prisma.auditLog.create({ data: { actor: "system", action: "RETURN_REQUESTED", resource: "Order", resourceId: body.orderId, after: returnOrder } })
    return NextResponse.json(returnOrder)
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }) }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const returnOrder = await prisma.returnOrder.update({
      where: { id: body.id },
      data: { status: body.status, resolvedAt: body.status === "RESOLVED" ? new Date() : undefined }
    })
    return NextResponse.json(returnOrder)
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }) }
}