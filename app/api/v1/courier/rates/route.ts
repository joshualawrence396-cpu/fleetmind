import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Rate shopping - get rates from multiple couriers
export async function POST(req: NextRequest) {
  try {
    const { origin, destination, weight, dimensions } = await req.json()
    
    // Get active courier accounts
    const courierAccounts = await prisma.courierAccount.findMany({
      where: { isActive: true }
    })
    
    // Mock rate calculations for different couriers
    const rates = courierAccounts.map(account => {
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
        rate: rate,
        currency: 'ZAR',
        eta: eta,
        serviceLevels: account.serviceLevels
      }
    })
    
    // Sort by price
    rates.sort((a, b) => a.rate - b.rate)
    
    return NextResponse.json({
      success: true,
      rates: rates,
      cheapest: rates[0],
      fastest: rates.sort((a, b) => a.eta.localeCompare(b.eta))[0]
    })
    
  } catch (error) {
    console.error('Rate shopping error:', error)
    return NextResponse.json({ error: 'Failed to get rates' }, { status: 500 })
  }
}

// Book shipment with chosen courier
export async function PUT(req: NextRequest) {
  try {
    const { shipmentId, provider, rate } = await req.json()
    
    const courierAccount = await prisma.courierAccount.findFirst({
      where: { provider: provider }
    })
    
    if (!courierAccount) {
      return NextResponse.json({ error: 'Courier account not found' }, { status: 404 })
    }
    
    // Generate consignment number correctly
    const timestamp = Date.now()
    const consignmentNo = provider + '-' + timestamp
    
    // Create booking
    const booking = await prisma.courierBooking.create({
      data: {
        courierAccountId: courierAccount.id,
        shipmentId: shipmentId,
        externalConsignmentNo: consignmentNo,
        status: 'BOOKED',
        cost: rate
      }
    })
    
    // Update shipment with external carrier info
    await prisma.shipment.update({
      where: { id: shipmentId },
      data: {
        externalCarrier: provider,
        status: 'AT_ORIGIN'
      }
    })
    
    return NextResponse.json({
      success: true,
      booking: booking,
      trackingUrl: 'https://track.' + provider.toLowerCase() + '.com/' + booking.externalConsignmentNo
    })
    
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json({ error: 'Failed to book shipment' }, { status: 500 })
  }
}

// Get all courier accounts
export async function GET() {
  try {
    const accounts = await prisma.courierAccount.findMany({
      where: { isActive: true }
    })
    return NextResponse.json(accounts)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch courier accounts' }, { status: 500 })
  }
}