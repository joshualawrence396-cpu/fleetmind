import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { name, email, password, company, plan, phone, turnstileToken } = await request.json()

    if (!name || !email || !password) return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 })
    if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    if (!email.includes("@")) return NextResponse.json({ error: "Invalid email address" }, { status: 400 })

    // Verify Turnstile if configured
    if (process.env.CLOUDFLARE_TURNSTILE_SECRET && !process.env.CLOUDFLARE_TURNSTILE_SECRET.includes("your_") && turnstileToken) {
      const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret: process.env.CLOUDFLARE_TURNSTILE_SECRET, response: turnstileToken }).toString()
      })
      const verify = await verifyRes.json()
      if (!verify.success) return NextResponse.json({ error: "Human verification failed. Please try again." }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })
    if (existing) return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })

    const hashed = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashed,
        company: company?.trim() || null,
        phone: phone?.trim() || null,
        plan: plan || "Starter",
        role: "user",
        emailVerified: new Date(),
      }
    })

    await prisma.auditLog.create({
      data: { actor: user.id, action: "USER_REGISTER", resource: "User", resourceId: user.id, after: { email: user.email, plan: user.plan } }
    }).catch(() => {})

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name, plan: user.plan } })
  } catch (e: any) {
    console.error("Register error:", e)
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 })
  }
}