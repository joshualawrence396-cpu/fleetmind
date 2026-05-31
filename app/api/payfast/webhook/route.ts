import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import crypto from "crypto"
const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const data: Record<string, string> = {}
    formData.forEach((v, k) => { data[k] = v.toString() })

    if (data.payment_status === "COMPLETE") {
      const userId = data.custom_str1
      const plan   = data.custom_str2
      if (userId && plan) {
        await prisma.user.update({ where: { id: userId }, data: { plan } }).catch(() => {})
      }
    }
    return NextResponse.json({ received: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}