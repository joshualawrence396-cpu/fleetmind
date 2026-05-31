import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { orderId, provider, courierAccountId, service } = body

    const order = await prisma.order.findUnique({ where: { id: orderId }, include: { driver: true } })
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })

    // Generate consignment number (in prod this calls the real courier API)
    const consignmentNo = provider.substring(0, 3).toUpperCase() + "-" + Date.now()
    const trackingUrl = `https://track.${provider.toLowerCase().replace("_", "")}.co.za/${consignmentNo}`

    // Find or use first active account for this provider
    let accountId = courierAccountId
    if (!accountId) {
      const account = await prisma.courierAccount.findFirst({ where: { provider, isActive: true } })
      if (!account) {
        // Create a demo account
        const newAccount = await prisma.courierAccount.create({
          data: { carrierId: "default", provider, name: provider.replace("_", " "), isActive: true, serviceLevels: [service || "STANDARD"] }
        })
        accountId = newAccount.id
      } else {
        accountId = account.id
      }
    }

    const booking = await prisma.courierBooking.create({
      data: {
        courierAccountId: accountId,
        orderId,
        consignmentNo,
        trackingUrl,
        provider,
        status: "BOOKED",
        cost: body.price || null,
        rawResponse: { provider, service, consignmentNo, bookedAt: new Date() }
      }
    })

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "IN_PROGRESS" }
    })

    await prisma.auditLog.create({
      data: { actor: "system", action: "COURIER_BOOK", resource: "Order", resourceId: orderId, after: { provider, consignmentNo } }
    })

    return NextResponse.json({ success: true, booking, consignmentNo, trackingUrl })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}