'use client'

import { useState, useEffect } from 'react'

interface PerformanceMetric {
  name: string
  value: number
  unit: string
  status: 'good' | 'warning' | 'critical'
  trend: 'up' | 'down' | 'stable'
}

interface SystemHealth {
  cpu: number
  memory: number
  disk: number
  network: number
  uptime: string
}

export function PerformanceMonitoring() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null)
  const [alerts, setAlerts] = useState<any[]>([])
  const [timeRange, setTimeRange] = useState('1h')

  useEffect(() => {
    loadPerformanceData()
    const interval = setInterval(loadPerformanceData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [timeRange])

  const loadPerformanceData = async () => {
    try {
      // Load system health
      const healthResponse = await fetch('/api/health')
      if (healthResponse.ok) {
        const healthData = await healthResponse.json()
        setSystemHealth(healthData)
      }

      // Load performance metrics
      const metricsResponse = await fetch(`/api/performance/metrics?range=${timeRange}`)
      if (metricsResponse.ok) {
        const metricsData = await metricsResponse.json()
        setMetrics(metricsData)
      }

      // Load alerts
      const alertsResponse = await fetch('/api/performance/alerts')
      if (alertsResponse.ok) {
        const alertsData = await alertsResponse.json()
        setAlerts(alertsData)
      }
    } catch (error) {
      console.error('Failed to load performance data:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'critical': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈'
      case 'down': return '📉'
      case 'stable': return '➡️'
      default: return '❓'
    }
  }

  const getHealthColor = (value: number, type: string) => {
    if (type === 'cpu' || type === 'memory') {
      if (value > 90) return 'text-red-600'
      if (value > 70) return 'text-yellow-600'
      return 'text-green-600'
    }
    if (type === 'disk') {
      if (value > 95) return 'text-red-600'
      if (value > 85) return 'text-yellow-600'
      return 'text-green-600'
    }
    return 'text-green-600'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Performance Monitoring</h2>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="5m">Last 5 minutes</option>
            <option value="1h">Last hour</option>
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
          </select>
          <button
            onClick={loadPerformanceData}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* System Health Overview */}
      {systemHealth && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">CPU Usage</span>
              <span className={`text-lg font-bold ${getHealthColor(systemHealth.cpu, 'cpu')}`}>
                {systemHealth.cpu}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${systemHealth.cpu}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Memory Usage</span>
              <span className={`text-lg font-bold ${getHealthColor(systemHealth.memory, 'memory')}`}>
                {systemHealth.memory}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${systemHealth.memory}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Disk Usage</span>
              <span className={`text-lg font-bold ${getHealthColor(systemHealth.disk, 'disk')}`}>
                {systemHealth.disk}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${systemHealth.disk}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Network I/O</span>
              <span className="text-lg font-bold text-indigo-600">
                {systemHealth.network} MB/s
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Uptime: {systemHealth.uptime}
            </div>
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Application Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700">{metric.name}</h4>
                <span className="text-lg">{getTrendIcon(metric.trend)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">
                  {metric.value}{metric.unit}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                  {metric.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Alerts */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Active Alerts</h3>
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-2xl mb-2">✅</div>
            <p>No active alerts</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div key={index} className="border border-red-200 bg-red-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-red-600">🚨</span>
                    <div>
                      <h4 className="font-medium text-red-900">{alert.title}</h4>
                      <p className="text-sm text-red-700">{alert.message}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-red-600">{alert.timestamp}</span>
                    <button className="ml-2 text-red-600 hover:text-red-800">
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Response Time Trend</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            📊 Response time chart would be displayed here
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Error Rate</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            📈 Error rate chart would be displayed here
          </div>
        </div>
      </div>

      {/* Monitoring Configuration */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Monitoring Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alert Thresholds
            </label>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">CPU Usage Warning</span>
                <input
                  type="number"
                  defaultValue="70"
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <span className="text-sm">%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Memory Usage Critical</span>
                <input
                  type="number"
                  defaultValue="90"
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <span className="text-sm">%</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notification Settings
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                <span className="text-sm">Email alerts</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                <span className="text-sm">SMS alerts</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">Slack notifications</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}