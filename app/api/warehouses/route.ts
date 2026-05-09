import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const items = await prisma.warehouse.findMany()
    return NextResponse.json(items)
  } catch {
    return NextResponse.json([])
  }
}
