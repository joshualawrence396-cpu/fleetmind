import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const sig = request.headers.get("stripe-signature")

    let event: any
    try {
      // In production verify with stripe.webhooks.constructEvent
      event = JSON.parse(body)
    } catch {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object
      const userId = session.metadata?.userId
      const plan = session.metadata?.plan

      if (userId && plan) {
        await prisma.user.update({
          where: { id: userId },
          data: { plan }
        })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}