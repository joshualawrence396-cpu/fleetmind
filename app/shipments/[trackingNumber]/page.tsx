import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

export default async function TrackingPage({
  params
}: {
  params: Promise<{ trackingNumber: string }>
}) {
  const { trackingNumber } = await params

  const shipment = await prisma.shipment.findUnique({
    where: {
      trackingNumber
    }
  })

  if (!shipment) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">
            Track Your Shipment
          </h1>

          <p className="text-gray-600">
            Tracking Number:{' '}
            <span className="font-mono font-semibold">
              {shipment.trackingNumber}
            </span>
          </p>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="font-semibold">
              Status: {shipment.status}
            </p>

            {shipment.estimatedDeliveryAt && (
              <p className="text-sm mt-1">
                Estimated:{' '}
                {new Date(
                  shipment.estimatedDeliveryAt
                ).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Shipment Information
          </h2>

          <div className="space-y-2">
            <p>
              <strong>Service Level:</strong>{' '}
              {shipment.serviceLevel || 'N/A'}
            </p>

            <p>
              <strong>Weight:</strong>{' '}
              {shipment.weightKg ?? 'N/A'} kg
            </p>

            <p>
              <strong>Parcel Count:</strong>{' '}
              {shipment.parcelCount ?? 1}
            </p>

            <p>
              <strong>Carrier:</strong>{' '}
              {shipment.externalCarrier || 'N/A'}
            </p>

            <p>
              <strong>Created:</strong>{' '}
              {new Date(
                shipment.createdAt
              ).toLocaleString()}
            </p>

            {shipment.actualDeliveryAt && (
              <p>
                <strong>Delivered:</strong>{' '}
                {new Date(
                  shipment.actualDeliveryAt
                ).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}