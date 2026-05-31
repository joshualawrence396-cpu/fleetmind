import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log("[EMAIL DEMO - add RESEND_API_KEY to .env]", to, subject)
    return { simulated: true }
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `FleetMind <${process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"}>`,
      to: [to],
      subject,
      html,
    })
  })
  const data = await res.json()
  if (data.error) console.error("Resend error:", data.error)
  return data
}

function emailTemplate(orderNumber: string, type: string, driverName?: string) {
  const config: Record<string, { subject: string; heading: string; color: string; body: string }> = {
    ORDER_CREATED: {
      subject: `Order ${orderNumber} confirmed`,
      heading: "Order Confirmed ✅",
      color: "#6366f1",
      body: `Your order <strong>${orderNumber}</strong> has been received and is being processed.`,
    },
    ORDER_DISPATCHED: {
      subject: `Order ${orderNumber} is on its way`,
      heading: "Out for Delivery 🚛",
      color: "#f59e0b",
      body: `Your order <strong>${orderNumber}</strong> has been dispatched.${driverName ? ` Driver: <strong>${driverName}</strong>.` : ""} Estimated delivery: 2-4 hours.`,
    },
    ORDER_ARRIVING: {
      subject: `Order ${orderNumber} arriving soon`,
      heading: "Arriving Soon 📍",
      color: "#8b5cf6",
      body: `Your delivery for order <strong>${orderNumber}</strong> is arriving in approximately 30 minutes. Please be available.`,
    },
    ORDER_COMPLETED: {
      subject: `Order ${orderNumber} delivered`,
      heading: "Delivered Successfully ✅",
      color: "#10b981",
      body: `Your order <strong>${orderNumber}</strong> has been delivered successfully. Thank you for choosing FleetMind!`,
    },
    ORDER_FAILED: {
      subject: `Order ${orderNumber} delivery attempt failed`,
      heading: "Delivery Failed ❌",
      color: "#ef4444",
      body: `We were unable to deliver order <strong>${orderNumber}</strong>. We will attempt redelivery. Please contact us if you have questions.`,
    },
  }
  const c = config[type] || { subject: "FleetMind Update", heading: "Update", color: "#6366f1", body: "" }
  return {
    subject: c.subject,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width"/></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:system-ui,-apple-system,sans-serif">
  <div style="max-width:580px;margin:40px auto;background:#0a0f1e;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.2)">
    <div style="background:linear-gradient(135deg,${c.color},${c.color}cc);padding:28px 32px">
      <div style="font-size:22px;font-weight:900;color:white;letter-spacing:-0.5px">🚛 FleetMind</div>
      <div style="font-size:12px;color:rgba(255,255,255,0.7);margin-top:4px;letter-spacing:1px">SA LOGISTICS OS</div>
    </div>
    <div style="padding:32px">
      <h2 style="color:white;font-size:20px;margin:0 0 16px;font-weight:800">${c.heading}</h2>
      <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin:0 0 24px">${c.body}</p>
      <div style="background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.2);border-radius:10px;padding:16px;margin-bottom:24px">
        <div style="font-size:12px;color:#475569;margin-bottom:4px">Order Reference</div>
        <div style="font-size:22px;font-weight:800;color:${c.color}">${orderNumber}</div>
      </div>
      <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/track/${orderNumber}"
        style="display:block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;text-decoration:none;text-align:center;padding:14px;border-radius:10px;font-weight:700;font-size:14px">
        Track Your Order →
      </a>
    </div>
    <div style="padding:16px 32px;border-top:1px solid rgba(255,255,255,0.05);text-align:center">
      <div style="font-size:12px;color:#334155">FleetMind SA 2026 — Built in Cape Town 🇿🇦</div>
    </div>
  </div>
</body>
</html>`
  }
}

export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    })
    return NextResponse.json(notifications)
  } catch { return NextResponse.json([]) }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, orderId, customMessage, recipient } = body

    let order: any = null
    if (orderId) {
      order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { driver: true },
      })
    }

    const email = recipient || order?.customerEmail
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email address required" }, { status: 400 })
    }

    let subject = "FleetMind Notification"
    let html = `<p>${customMessage || "Update from FleetMind"}</p>`

    if (type && type !== "CUSTOM" && order?.orderNumber) {
      const tmpl = emailTemplate(order.orderNumber, type, order.driver?.name)
      subject = tmpl.subject
      html = tmpl.html
    } else if (customMessage) {
      subject = "FleetMind — Message"
      html = `
        <div style="font-family:system-ui;max-width:580px;margin:0 auto;background:#0a0f1e;border-radius:16px;padding:32px;color:#e2e8f0">
          <div style="font-size:20px;font-weight:900;color:white;margin-bottom:16px">🚛 FleetMind</div>
          <p style="color:#94a3b8;font-size:15px;line-height:1.7">${customMessage}</p>
        </div>`
    }

    const result = await sendEmail(email, subject, html)

    const notification = await prisma.notification.create({
      data: {
        orderId: orderId || null,
        type: type || "CUSTOM",
        channel: "EMAIL",
        recipient: email,
        subject,
        message: customMessage || type || "Email sent",
        status: result?.error ? "FAILED" : "SENT",
        sentAt: new Date(),
      }
    })

    return NextResponse.json({
      success: !result?.error,
      notification,
      simulated: result?.simulated || false,
      message: result?.simulated
        ? "Demo mode — add RESEND_API_KEY to .env to send real emails"
        : result?.error
        ? "Email failed: " + result.error
        : "Email sent to " + email,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}