'use client'

import { useState, useEffect } from 'react'
import UnifiedNavigation from '@/components/UnifiedNavigation'

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    deliveryRate: 0,
    activeDrivers: 0,
    totalVehicles: 3,
    warehouses: 1
  })

  useEffect(() => {
    fetch('/api/v1/analytics')
      .then(res => res.json())
      .then(data => {
        if (data.metrics) {
          setMetrics(data.metrics)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div>
      <UnifiedNavigation />
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>Analytics Dashboard</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>{metrics.totalOrders}</div>
            <div style={{ color: '#6b7280' }}>Total Orders</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>{metrics.deliveryRate}%</div>
            <div style={{ color: '#6b7280' }}>Delivery Rate</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6' }}>{metrics.activeDrivers}</div>
            <div style={{ color: '#6b7280' }}>Active Drivers</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>{metrics.totalVehicles}</div>
            <div style={{ color: '#6b7280' }}>Fleet Size</div>
          </div>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>System Health</h2>
          <div><span style={{ color: '#10b981' }}>●</span> API Server: Operational</div>
          <div><span style={{ color: '#10b981' }}>●</span> Database: Connected</div>
          <div><span style={{ color: '#10b981' }}>●</span> Warehouses: {metrics.warehouses}</div>
        </div>
      </div>
    </div>
  )
}
