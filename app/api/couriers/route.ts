import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const accounts = await prisma.courierAccount.findMany({
      include: { bookings: { take: 5, orderBy: { createdAt: "desc" } } },
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json(accounts)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const account = await prisma.courierAccount.create({
      data: {
        carrierId: body.carrierId || "default",
        provider: body.provider,
        name: body.name,
        apiKey: body.apiKey || null,
        apiSecret: body.apiSecret || null,
        accountNumber: body.accountNumber || null,
        serviceLevels: body.serviceLevels || [],
        isActive: true,
      }
    })
    return NextResponse.json(account)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}