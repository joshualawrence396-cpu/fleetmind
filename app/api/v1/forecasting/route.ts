import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { hubId, days = 30 } = await req.json()
    
    // Get historical order data
    const historicalOrders = await prisma.order.findMany({
      where: hubId ? { shipments: { originHubId: hubId } } : {},
      include: { shipments: true },
      orderBy: { createdAt: 'asc' }
    })
    
    // Group by date
    const dailyVolumes = {}
    historicalOrders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0]
      dailyVolumes[date] = (dailyVolumes[date] || 0) + 1
    })
    
    // Simple moving average forecasting
    const dates = Object.keys(dailyVolumes).sort()
    const volumes = dates.map(d => dailyVolumes[d])
    
    // Calculate 7-day moving average
    const forecast = []
    const last7Days = volumes.slice(-7)
    const avgVolume = last7Days.reduce((a, b) => a + b, 0) / last7Days.length
    
    // Generate forecast for next N days
    const today = new Date()
    for (let i = 1; i <= days; i++) {
      const forecastDate = new Date(today)
      forecastDate.setDate(today.getDate() + i)
      
      // Add some seasonality (higher on weekdays, lower on weekends)
      const dayOfWeek = forecastDate.getDay()
      const multiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1.2
      
      const expected = Math.round(avgVolume * multiplier)
      forecast.push({
        date: forecastDate.toISOString().split('T')[0],
        expected,
        p10: Math.round(expected * 0.8),
        p90: Math.round(expected * 1.2),
        dayOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek]
      })
    }
    
    // Save forecast
    const savedForecast = await prisma.demandForecast.create({
      data: {
        carrierId: (await prisma.carrier.findFirst())?.id || '',
        hubId: hubId,
        forecastDate: new Date(),
        horizonDays: days,
        granularity: 'DAY',
        predictedVolume: forecast,
        modelVersion: 'moving-average-v1'
      }
    })
    
    return NextResponse.json({
      success: true,
      forecast,
      historicalAvg: avgVolume,
      totalHistoricalOrders: historicalOrders.length
    })
    
  } catch (error) {
    console.error('Forecasting error:', error)
    return NextResponse.json({ error: 'Failed to generate forecast' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const hubId = searchParams.get('hubId')
  
  const forecasts = await prisma.demandForecast.findMany({
    where: hubId ? { hubId } : {},
    orderBy: { createdAt: 'desc' },
    take: 10
  })
  
  return NextResponse.json(forecasts)
}
