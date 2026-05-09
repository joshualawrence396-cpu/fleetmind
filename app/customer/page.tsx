'use client'

import { useState } from 'react'

export default function CustomerPortal() {
  const [orderNumber, setOrderNumber] = useState('')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const trackOrder = async () => {
    if (!orderNumber.trim()) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/orders/track/${orderNumber}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      } else {
        setError('Order not found')
        setOrder(null)
      }
    } catch (err) {
      setError('Failed to track order')
      setOrder(null)
    }

    setLoading(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600 bg-green-100'
      case 'IN_PROGRESS': return 'text-blue-600 bg-blue-100'
      case 'PENDING': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">FleetMind</h1>
          <p className="text-gray-600">Track Your Delivery</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Order Number
            </label>
            <input
              type="text"
              id="orderNumber"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your order number"
            />
          </div>

          <button
            onClick={trackOrder}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Tracking...' : 'Track Order'}
          </button>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
        </div>

        {order && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-medium">{order.orderNumber}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status.replace('_', ' ')}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span className="font-medium">{order.customerName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Pickup:</span>
                <span className="font-medium text-sm">{order.pickupAddress}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Delivery:</span>
                <span className="font-medium text-sm">{order.deliveryAddress}</span>
              </div>

              {order.driverName && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Driver:</span>
                  <span className="font-medium">{order.driverName}</span>
                </div>
              )}

              {order.scheduledDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Scheduled:</span>
                  <span className="font-medium">
                    {new Date(order.scheduledDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Delivery Timeline</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Order Created</span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {order.status === 'IN_PROGRESS' && (
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Out for Delivery</span>
                  </div>
                )}

                {order.status === 'COMPLETED' && (
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Delivered</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}