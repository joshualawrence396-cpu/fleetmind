import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { shipmentId, temperature, humidity, timestamp } = await req.json()
    
    // Store cold chain data
    await prisma.coldChainRecord.create({
      data: {
        shipmentId,
        temperature,
        humidity,
        timestamp: new Date(timestamp),
        isOutOfRange: temperature < -20 || temperature > -10 // Vaccine range
      }
    })
    
    // Alert if temperature out of range
    if (temperature < -20 || temperature > -10) {
      await prisma.alert.create({
        data: {
          type: 'COLD_CHAIN_BREACH',
          severity: 'HIGH',
          shipmentId,
          message: Temperature breach: °C (range: -20°C to -10°C)
        }
      })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record cold chain data' }, { status: 500 })
  }
}
