import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    const body = await request.json()
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: { name: body.name, company: body.company, phone: body.phone },
      select: { id: true, name: true, email: true, role: true, plan: true, company: true, phone: true }
    })
    return NextResponse.json(user)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}