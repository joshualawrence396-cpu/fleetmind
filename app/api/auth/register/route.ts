import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { name, email, password, company, plan, phone } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 })
    }

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) {
      return NextResponse.json({ error: "Email already registered. Please sign in." }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    const hash = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { name, email, password: hash, company: company || null, plan: plan || "Basic", phone: phone || null, role: "user" }
    })

    await prisma.auditLog.create({
      data: { actor: user.email, action: "REGISTER", resource: "User", resourceId: user.id, after: { name: user.name, email: user.email, plan: user.plan } }
    })

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name, plan: user.plan } })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}