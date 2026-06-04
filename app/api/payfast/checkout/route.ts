import { NextResponse } from "next/server"
import crypto from "crypto"

const PLANS: Record<string, { name: string; amount: number; description: string }> = {
  Starter: { name: "FleetMind Starter", amount: 1499, description: "Up to 5 vehicles, 10 drivers, GPS tracking" },
  Growth:  { name: "FleetMind Growth",  amount: 1199, description: "Up to 25 vehicles, all features, AI routing" },
  Enterprise: { name: "FleetMind Enterprise", amount: 0, description: "Unlimited fleet, white-label, 24/7 support" },
}

export async function POST(request: Request) {
  try {
    const { plan, email, name, userId, vehicles = 1 } = await request.json()
    if (!plan) return NextResponse.json({ error: "Plan required" }, { status: 400 })
    if (plan === "Enterprise") return NextResponse.json({ url: `mailto:sales@fleetmind.co.za?subject=Enterprise Inquiry from ${email}` })

    const planData = PLANS[plan]
    if (!planData) return NextResponse.json({ error: "Invalid plan" }, { status: 400 })

    const merchantId   = process.env.PAYFAST_MERCHANT_ID  || "10000100"
    const merchantKey  = process.env.PAYFAST_MERCHANT_KEY || "46f0cd694581a"
    const passphrase   = process.env.PAYFAST_PASSPHRASE   || ""

    console.log("PAYFAST_MERCHANT_ID:", merchantId)
    console.log("PAYFAST_MERCHANT_KEY:", merchantKey)
    console.log("PAYFAST_MERCHANT_KEY_LENGTH:", merchantKey.length)
    console.log("PAYFAST_PASSPHRASE:", passphrase)
    const isSandbox    = (process.env.NEXT_PUBLIC_PAYFAST_ENV || "sandbox") !== "production"
    const baseUrl      = process.env.NEXTAUTH_URL || "http://localhost:3000"
    const amount       = (planData.amount * Math.max(1, vehicles)).toFixed(2)

    const data: Record<string, string> = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      amount,
      item_name: planData.name,
    }

    const filteredData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== ""))
    const paramStr = Object.entries(filteredData)
      .map(([k, v]) => `${k}=${encodeURIComponent(String(v).trim()).replace(/%20/g, "+")}`)
      .join("&")
    const sigStr = paramStr
    filteredData.signature = crypto.createHash("md5").update(sigStr).digest("hex")

    const basePayFast = isSandbox ? "https://sandbox.payfast.co.za/eng/process" : "https://www.payfast.co.za/eng/process"
    const qs = Object.entries(filteredData).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&")
    const url = `${basePayFast}?${qs}`

console.log("PAYFAST_URL:", url)

    console.log("PAYFAST_SIGNATURE:", filteredData.signature)

return NextResponse.json({
  url,
  amount,
  plan,
  sandbox: isSandbox
})
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}








