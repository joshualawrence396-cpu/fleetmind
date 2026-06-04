import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Rate shopping - get rates from multiple couriers
export async function POST(req: NextRequest) {
  try {
    const { weight } = await req.json()

    const courierAccounts = await prisma.courierAccount.findMany({
      where: { isActive: true }
    })

    const rates = courierAccounts.map((account) => {
      let rate = 0
      let eta = ''

      switch (account.provider) {
        case 'BOB_GO':
          rate = 50 + weight * 10
          eta = '1-2 days'
          break

        case 'ARAMEX':
          rate = 80 + weight * 15
          eta = '2-3 days'
          break

        case 'DSV':
          rate = 100 + weight * 12
          eta = '1-3 days'
          break

        default:
          rate = 60 + weight * 8
          eta = '2-4 days'
      }

      return {
        provider: account.provider,
        name: account.name,
        rate,
        currency: 'ZAR',
        eta,
        serviceLevels: account.serviceLevels
      }
    })

    const sortedByPrice = [...rates].sort(
      (a, b) => a.rate - b.rate
    )

    return NextResponse.json({
      success: true,
      rates: sortedByPrice,
      cheapest: sortedByPrice[0],
      fastest: sortedByPrice[0]
    })
  } catch (error) {
    console.error('Rate shopping error:', error)

    return NextResponse.json(
      { error: 'Failed to get rates' },
      { status: 500 }
    )
  }
}

// Book courier for an order
export async function PUT(req: NextRequest) {
  try {
    const {
      orderId,
      provider,
      rate
    } = await req.json()

    const courierAccount =
      await prisma.courierAccount.findFirst({
        where: { provider }
      })

    if (!courierAccount) {
      return NextResponse.json(
        { error: 'Courier account not found' },
        { status: 404 }
      )
    }

    const consignmentNo =
      `${provider}-${Date.now()}`

    const booking =
      await prisma.courierBooking.create({
        data: {
          courierAccountId: courierAccount.id,
          orderId,
          consignmentNo,
          status: 'BOOKED',
          cost: Number(rate),
          provider
        }
      })

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'PENDING'
      }
    })

    return NextResponse.json({
      success: true,
      booking,
      trackingUrl:
        `https://track.${provider.toLowerCase()}.com/${consignmentNo}`
    })
  } catch (error) {
    console.error('Booking error:', error)

    return NextResponse.json(
      { error: 'Failed to book courier' },
      { status: 500 }
    )
  }
}

// Get active courier accounts
export async function GET() {
  try {
    const accounts =
      await prisma.courierAccount.findMany({
        where: { isActive: true }
      })

    return NextResponse.json(accounts)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: 'Failed to fetch courier accounts' },
      { status: 500 }
    )
  }
}