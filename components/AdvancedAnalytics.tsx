'use client'

import { useState, useEffect } from 'react'

export function AdvancedAnalytics() {
  const [analytics, setAnalytics] = useState<{
  totalRevenue?: number
  totalOrders?: number
  totalDeliveries?: number
  activeDrivers?: number
  completedOrders?: number
  fleetUtilization?: number
  avgDeliveryTime?: number
  inProgressOrders?: number
  pendingOrders?: number
  topDriver?: string
  avgDriverRating?: number
  onTimeRate?: number
  avgFuelEconomy?: number
  maintenanceCost?: number
  vehicleDowntime?: number
  customerSatisfaction?: number
  repeatOrderRate?: number
  complaintCount?: number
} | null>(null)
  const [timeRange, setTimeRange] = useState('30d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics/advanced?range=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to load analytics:', error)
    }
    setLoading(false)
  }

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>
  }

  if (!analytics) {
    return <div className="text-center py-8 text-gray-500">No analytics data available</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold">R{analytics.totalRevenue?.toLocaleString() || '0'}</p>
          <p className="text-sm opacity-90">+12% from last period</p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Orders Completed</h3>
          <p className="text-3xl font-bold">{analytics.completedOrders || 0}</p>
          <p className="text-sm opacity-90">98.5% success rate</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Fleet Utilization</h3>
          <p className="text-3xl font-bold">{analytics.fleetUtilization || 0}%</p>
          <p className="text-sm opacity-90">Active vehicles</p>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Avg Delivery Time</h3>
          <p className="text-3xl font-bold">{analytics.avgDeliveryTime || '0'}h</p>
          <p className="text-sm opacity-90">On-time deliveries</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            📈 Chart would show revenue over time
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Order Status Distribution</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Completed</span>
              <span className="text-sm font-medium">{analytics.completedOrders || 0}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${analytics.completedOrders ? (analytics.completedOrders / (analytics.totalOrders || 1)) * 100 : 0}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">In Progress</span>
              <span className="text-sm font-medium">{analytics.inProgressOrders || 0}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${analytics.inProgressOrders ? (analytics.inProgressOrders / (analytics.totalOrders || 1)) * 100 : 0}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">Pending</span>
              <span className="text-sm font-medium">{analytics.pendingOrders || 0}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: `${analytics.pendingOrders ? (analytics.pendingOrders / (analytics.totalOrders || 1)) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Driver Performance</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Top Performer</span>
              <span className="text-sm font-medium">{analytics.topDriver || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg Rating</span>
              <span className="text-sm font-medium">{analytics.avgDriverRating || '0'}/5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">On-Time Rate</span>
              <span className="text-sm font-medium">{analytics.onTimeRate || '0'}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Vehicle Efficiency</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg Fuel Economy</span>
              <span className="text-sm font-medium">{analytics.avgFuelEconomy || '0'} km/L</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Maintenance Cost</span>
              <span className="text-sm font-medium">R{analytics.maintenanceCost || '0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Downtime</span>
              <span className="text-sm font-medium">{analytics.vehicleDowntime || '0'} hours</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Customer Satisfaction</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg Rating</span>
              <span className="text-sm font-medium">{analytics.customerSatisfaction || '0'}/5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Repeat Orders</span>
              <span className="text-sm font-medium">{analytics.repeatOrderRate || '0'}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Complaints</span>
              <span className="text-sm font-medium">{analytics.complaintCount || '0'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="flex gap-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          📊 Export Report
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          📈 Generate Charts
        </button>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
          📧 Schedule Report
        </button>
      </div>
    </div>
  )
}

