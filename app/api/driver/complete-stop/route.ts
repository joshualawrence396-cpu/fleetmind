import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { stopId, data } = await req.json()
    
    const stop = await prisma.stop.update({
      where: { id: stopId },
      data: {
  status: 'COMPLETED',
  actualArrival: new Date(),
  notes: data.notes,
  signatureUrl: data.signature,
  podPhotoUrl: data.photo
}
    })
    /*
    if (stop.shipmentId) {
      await prisma.shipment.update({
        where: { id: stop.shipmentId },
        data: { status: 'DELIVERED', actualDeliveryAt: new Date() }
      })
      
      await prisma.shipmentEvent.create({
        data: {
          shipmentId: stop.shipmentId,
          type: 'DELIVERED',
          description: 'Package delivered by driver',
          actor: 'DRIVER'
        }
      })
    }
    */
    return NextResponse.json({ success: true, stop })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to complete stop' }, { status: 500 })
  }
}
