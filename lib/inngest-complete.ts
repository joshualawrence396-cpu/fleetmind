import { Inngest } from 'inngest'
import { prisma } from '@/lib/prisma'
import { sendDeliveryNotification } from '@/lib/notifications/twilio'

export const inngest = new Inngest({
  id: 'fleetmind',
  name: 'FleetMind Workflows',
  retryFunction: (attempt) => ({
    delay: Math.pow(2, attempt) * 1000,
    maxAttempts: 5,
  }),
})

// Order workflow
export const orderWorkflow = inngest.createFunction(
  { id: 'order-workflow' },
  { event: 'order/created' },
  async ({ event, step }) => {
    const { orderId } = event.data
    
    const order = await step.run('get-order', async () => {
      return await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true }
      })
    })
    
    const shipment = await step.run('create-shipment', async () => {
      const trackingNumber = FM--
      return await prisma.shipment.create({
        data: {
          orderId,
          trackingNumber,
          carrierId: order?.carrierId,
          status: 'CREATED',
          weightKg: order?.items.reduce((sum, i) => sum + (i.unitWeight || 0), 0)
        }
      })
    })
    
    await step.run('notify-customer', async () => {
      await sendDeliveryNotification(
        order?.recipientPhone || '',
        shipment.trackingNumber,
        'CREATED'
      )
    })
    
    return { shipmentId: shipment.id, trackingNumber: shipment.trackingNumber }
  }
)

// Auto-dispatch marketplace workflow
export const dispatchWorkflow = inngest.createFunction(
  { id: 'auto-dispatch' },
  { event: 'route/dispatch' },
  async ({ event, step }) => {
    const { shipmentId, origin, destination, weight } = event.data
    
    // Get available internal vehicles
    const internalVehicles = await step.run('get-internal-fleet', async () => {
      return await prisma.vehicle.findMany({
        where: { status: 'AVAILABLE' }
      })
    })
    
    // If internal fleet is full, auto-bid to courier marketplace
    if (internalVehicles.length === 0) {
      const courierQuotes = await step.run('get-courier-quotes', async () => {
        const response = await fetch('http://localhost:3000/api/v1/courier/rates', {
          method: 'POST',
          body: JSON.stringify({ origin, destination, weight }),
          headers: { 'Content-Type': 'application/json' }
        })
        return await response.json()
      })
      
      const bestCourier = courierQuotes.rates?.[0]
      if (bestCourier) {
        await step.run('book-courier', async () => {
          const response = await fetch('http://localhost:3000/api/v1/courier/book', {
            method: 'POST',
            body: JSON.stringify({
              shipmentId,
              provider: bestCourier.provider,
              rate: bestCourier.rate
            }),
            headers: { 'Content-Type': 'application/json' }
          })
          return await response.json()
        })
      }
    }
    
    return { assigned: internalVehicles.length > 0 ? 'internal' : 'courier' }
  }
)

// Predictive maintenance workflow
export const maintenanceWorkflow = inngest.createFunction(
  { id: 'predictive-maintenance' },
  { event: 'maintenance/check' },
  async ({ event, step }) => {
    const vehicles = await step.run('get-vehicles', async () => {
      return await prisma.vehicle.findMany({
        include: { telematicsEvents: { take: 1000, orderBy: { timestamp: 'desc' } } }
      })
    })
    
    const predictions = []
    for (const vehicle of vehicles) {
      const harshBrakes = vehicle.telematicsEvents.filter(e => 
        e.speedKmh && e.speedKmh > 50 && e.speedKmh < 100
      ).length
      
      const brakeRisk = Math.min(harshBrakes / 50, 1)
      
      if (brakeRisk > 0.7) {
        predictions.push({
          vehicleId: vehicle.id,
          component: 'BRAKES',
          riskScore: brakeRisk,
          recommendedAction: 'Schedule brake inspection'
        })
        
        await step.run(create-maintenance-ticket-, async () => {
          await prisma.maintenanceRecord.create({
            data: {
              vehicleId: vehicle.id,
              type: 'SERVICE',
              description: Auto-generated: Brake wear detected (risk: %),
              performedBy: 'AI Agent'
            }
          })
        })
      }
    }
    
    return { predictions: predictions.length }
  }
)

// Demand forecasting workflow
export const demandForecastWorkflow = inngest.createFunction(
  { id: 'demand-forecast', schedule: '0 1 * * *' }, // Run at 1 AM daily
  { event: 'cron/scheduled' },
  async ({ step }) => {
    const last30Days = await step.run('get-historical-orders', async () => {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      return await prisma.order.groupBy({
        by: ['createdAt'],
        where: { createdAt: { gte: thirtyDaysAgo } },
        _count: true
      })
    })
    
    // Simple moving average forecast
    const dailyVolumes = {}
    last30Days.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0]
      dailyVolumes[date] = (dailyVolumes[date] || 0) + order._count
    })
    
    const volumes = Object.values(dailyVolumes)
    const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length
    
    const forecast = []
    for (let i = 1; i <= 14; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      forecast.push({
        date: date.toISOString().split('T')[0],
        expected: Math.round(avgVolume),
        p10: Math.round(avgVolume * 0.8),
        p90: Math.round(avgVolume * 1.2)
      })
    }
    
    await step.run('save-forecast', async () => {
      await prisma.demandForecast.create({
        data: {
          carrierId: 'default',
          forecastDate: new Date(),
          horizonDays: 14,
          granularity: 'day',
          predictedVolume: forecast,
          modelVersion: 'moving-average-v2'
        }
      })
    })
    
    return { forecastDays: forecast.length, avgDailyVolume: avgVolume }
  }
)
