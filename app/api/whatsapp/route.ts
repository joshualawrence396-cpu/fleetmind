import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function sendWhatsApp(phone: string, message: string) {
  // Wassenger free tier - 50 msgs/month
  if (!process.env.WHATSAPP_API_TOKEN || process.env.WHATSAPP_API_TOKEN.includes("your_")) {
    console.log(`[WhatsApp DEMO] To: ${phone} | Message: ${message}`)
    return { simulated: true, phone, message }
  }

  try {
    const res = await fetch(`${process.env.WHATSAPP_API_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Token": process.env.WHATSAPP_API_TOKEN!
      },
      body: JSON.stringify({
        phone: phone.replace(/\s/g, ""),
        message,
      })
    })
    return await res.json()
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { orderId, phone, type, customMessage } = body

    let order: any = null
    if (orderId) {
      order = await prisma.order.findUnique({ where: { id: orderId }, include: { driver: true } })
    }

    const messages: Record<string, string> = {
      ORDER_CONFIRMED: `*FleetMind* ✅\nYour order *${order?.orderNumber}* has been confirmed!\nTrack: fleetmind.co.za/track/${order?.orderNumber}`,
      ORDER_DISPATCHED: `*FleetMind* 🚛\nYour order *${order?.orderNumber}* is on its way!\nDriver: ${order?.driver?.name || "Assigned"}\nEstimated: 2-3 hours`,
      ORDER_ARRIVING: `*FleetMind* 📍\nYour delivery is arriving soon!\nOrder: *${order?.orderNumber}*\nPlease be available.`,
      ORDER_DELIVERED: `*FleetMind* ✅\nOrder *${order?.orderNumber}* delivered successfully!\nThank you for choosing FleetMind.`,
      ORDER_FAILED: `*FleetMind* ❌\nWe couldn't deliver order *${order?.orderNumber}*.\nWe'll retry tomorrow. Apologies for the inconvenience.`,
      CUSTOM: customMessage || "FleetMind notification",
    }

    const message = messages[type] || customMessage
    const recipient = phone || order?.customerPhone

    if (!recipient) return NextResponse.json({ error: "No phone number" }, { status: 400 })

    const result = await sendWhatsApp(recipient, message)

    // Log notification
    await prisma.notification.create({
      data: {
        orderId: orderId || null,
        type,
        channel: "WHATSAPP",
        recipient,
        message,
        status: result.error ? "FAILED" : "SENT",
        sentAt: new Date(),
      }
    })

    return NextResponse.json({ success: !result.error, result })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}