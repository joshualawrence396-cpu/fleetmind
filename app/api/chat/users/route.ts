import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get all drivers and admins for chat
    const [drivers, admins] = await Promise.all([
      prisma.driver.findMany({
        select: {
          id: true,
          name: true,
          status: true
        }
      }),
      prisma.user.findMany({
        where: {
          role: 'ADMIN'
        },
        select: {
          id: true,
          name: true,
          role: true
        }
      })
    ])

    // Transform to chat user format
    const chatUsers = [
      ...drivers.map(driver => ({
        id: driver.id,
        name: driver.name,
        role: 'Driver',
        online: driver.status === 'AVAILABLE' // Mock online status
      })),
      ...admins.map(admin => ({
        id: admin.id,
        name: admin.name,
        role: 'Admin',
        online: true // Admins are always online for demo
      }))
    ]

    return NextResponse.json(chatUsers)

  } catch (error) {
    console.error('Chat users error:', error)
    return NextResponse.json({ error: 'Failed to load users' }, { status: 500 })
  }
}