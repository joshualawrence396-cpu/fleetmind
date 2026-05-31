import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { token } = await request.json()
    const secret = process.env.CLOUDFLARE_TURNSTILE_SECRET
    
    // If no secret configured, pass through (dev mode)
    if (!secret || secret.includes("your_")) {
      return NextResponse.json({ success: true, dev: true })
    }

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }).toString()
    })
    const data = await res.json()
    return NextResponse.json({ success: data.success, errors: data["error-codes"] })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message })
  }
}