import { NextResponse } from "next/server"

const PLANS: Record<string, { name: string; price: number; priceId: string }> = {
  Basic: { name: "FleetMind Basic", price: 99900, priceId: process.env.STRIPE_BASIC_PRICE_ID || "price_basic" },
  Pro: { name: "FleetMind Pro", price: 249900, priceId: process.env.STRIPE_PRO_PRICE_ID || "price_pro" },
  Enterprise: { name: "FleetMind Enterprise", price: 0, priceId: process.env.STRIPE_ENT_PRICE_ID || "price_ent" },
}

export async function POST(request: Request) {
  try {
    const { plan, email, userId } = await request.json()
    const planData = PLANS[plan]
    if (!planData) return NextResponse.json({ error: "Invalid plan" }, { status: 400 })

    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes("your_")) {
      // Demo mode - return fake session
      return NextResponse.json({
        url: `/pricing?demo=true&plan=${plan}`,
        sessionId: "demo_" + Date.now(),
        demo: true
      })
    }

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "payment_method_types[0]": "card",
        "mode": "subscription",
        "line_items[0][price]": planData.priceId,
        "line_items[0][quantity]": "1",
        "customer_email": email || "",
        "metadata[userId]": userId || "",
        "metadata[plan]": plan,
        "success_url": `${process.env.NEXTAUTH_URL}/dashboard?upgraded=true&plan=${plan}`,
        "cancel_url": `${process.env.NEXTAUTH_URL}/pricing?cancelled=true`,
      }).toString()
    })

    const session = await res.json()
    if (session.error) return NextResponse.json({ error: session.error.message }, { status: 400 })
    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}