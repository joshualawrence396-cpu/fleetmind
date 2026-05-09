import { NextRequest, NextResponse } from 'next/server'
import { redis, STREAMS, publishToStream } from '@/lib/redis'
import { telematicsAdapters } from '@/lib/telematics/adapters'
import { prisma } from '@/lib/prisma'

// Ingestion endpoint for telematics devices
export async function POST(req: NextRequest) {
  try {
    const { provider, data } = await req.json()
    const adapter = telematicsAdapters[provider.toLowerCase()]
    
    if (!adapter) {
      return NextResponse.json({ error: 'Unknown telematics provider' }, { status: 400 })
    }
    
    const event = adapter.parseEvent(data)
    const alerts = adapter.checkAlerts(event)
    
    // Store in TimescaleDB
    await prisma.
      INSERT INTO "TelematicsEvent" (
        id, "vehicleId", timestamp, latitude, longitude,
        speed, heading, ignition, "fuelLevelPct", "odometerKm",
        "engineRpm", "rawData", location
      ) VALUES (
        gen_random_uuid(), , , 
        , , ,
        , , ,
        , ,
        ::jsonb,
        ST_SetSRID(ST_MakePoint(, ), 4326)
      )
    
    
    // Publish to Redis stream for real-time
    await publishToStream(STREAMS.VEHICLE_LOCATIONS, event)
    
    // Process alerts
    for (const alert of alerts) {
      await prisma.telematicsAlert.create({
        data: {
          vehicleId: event.vehicleId,
          type: alert.type,
          severity: alert.severity,
          payload: alert,
          createdAt: alert.timestamp
        }
      })
      
      await publishToStream(STREAMS.ALERTS, alert)
    }
    
    // Update vehicle's last location
    await prisma.
      UPDATE "Vehicle" 
      SET last_location = ST_SetSRID(ST_MakePoint(, ), 4326)::geography,
          "odometerKm" = 
      WHERE id = 
    
    
    return NextResponse.json({ 
      success: true, 
      alerts: alerts.length,
      timestamp: event.timestamp 
    })
    
  } catch (error) {
    console.error('Telematics ingestion error:', error)
    return NextResponse.json({ error: 'Failed to ingest telematics data' }, { status: 500 })
  }
}

// Get telemetry data for a vehicle
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const vehicleId = searchParams.get('vehicleId')
    const hours = parseInt(searchParams.get('hours') || '24')
    
    const startTime = new Date()
    startTime.setHours(startTime.getHours() - hours)
    
    const events = await prisma.
      SELECT * FROM "TelematicsEvent"
      WHERE "vehicleId" = 
        AND timestamp >= 
      ORDER BY timestamp DESC
      LIMIT 1000
    
    
    return NextResponse.json(events)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch telemetry' }, { status: 500 })
  }
}
