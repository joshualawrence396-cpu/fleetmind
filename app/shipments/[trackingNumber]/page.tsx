import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function TrackingPage({
  params
}: {
  params: Promise<{ trackingNumber: string }>
}) {
  // In Next.js 15+, params must be awaited
  const { trackingNumber } = await params
  
  const shipment = await prisma.shipment.findUnique({
    where: { trackingNumber: trackingNumber },
    include: {
      events: {
        orderBy: { createdAt: 'desc' }
      },
      order: true
    }
  })
  
  if (!shipment) {
    notFound()
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">Track Your Shipment</h1>
          <p className="text-gray-600">Tracking Number: <span className="font-mono font-semibold">{shipment.trackingNumber}</span></p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="font-semibold">Status: {shipment.status}</p>
            {shipment.estimatedDeliveryAt && (
              <p className="text-sm mt-1">Estimated: {new Date(shipment.estimatedDeliveryAt).toLocaleDateString()}</p>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Tracking Timeline</h2>
          <div className="space-y-4">
            {shipment.events.length === 0 ? (
              <p className="text-gray-500">No tracking events yet.</p>
            ) : (
              shipment.events.map((event: any, idx: number) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                  <div>
                    <p className="font-medium">{event.description}</p>
                    <p className="text-sm text-gray-500">{new Date(event.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}