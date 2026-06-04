import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        role: true
      }
    })

    return NextResponse.json({
      success: true,
      users,
      count: users.length
    })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error'
      },
      {
        status: 500
      }
    )
  }
}
