import { NextResponse } from "next/server"

export async function GET() {
  const key = process.env.RESEND_API_KEY
  if (!key) return NextResponse.json({ error: "No RESEND_API_KEY in .env" })

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: ["delivered@resend.dev"],
        subject: "FleetMind Email Test",
        html: "<h1>FleetMind email test works!</h1><p>Your Resend integration is working correctly.</p>"
      })
    })
    const data = await res.json()
    return NextResponse.json({
      success: res.ok,
      status: res.status,
      data,
      keyPreview: key.substring(0, 12) + "...",
      note: "If id is returned, Resend is working. To send to real emails, verify your domain at resend.com/domains"
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message })
  }
}