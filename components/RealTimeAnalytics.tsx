'use client'

import { useState, useEffect } from 'react'

export function RealTimeAnalytics() {
  const [analytics, setAnalytics] = useState({
    activeVehicles: 32,
    completedDeliveries: 428,
    onTimeRate: 94,
    avgResponseTime: 18,
    revenue: 38400,
    customerSatisfaction: 92
  })

  return (
    <div style={{ padding: '20px', background: 'white', borderRadius: '12px', marginTop: '20px' }}>
      <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>📊 Real-Time Analytics</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
        <div style={{ padding: '15px', background: '#667eea', borderRadius: '10px', color: 'white' }}>
          <div style={{ fontSize: '12px' }}>Active Vehicles</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{analytics.activeVehicles}</div>
        </div>
        <div style={{ padding: '15px', background: '#f5576c', borderRadius: '10px', color: 'white' }}>
          <div style={{ fontSize: '12px' }}>Deliveries</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{analytics.completedDeliveries}</div>
        </div>
        <div style={{ padding: '15px', background: '#4facfe', borderRadius: '10px', color: 'white' }}>
          <div style={{ fontSize: '12px' }}>On-Time Rate</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{analytics.onTimeRate}%</div>
        </div>
        <div style={{ padding: '15px', background: '#43e97b', borderRadius: '10px', color: 'white' }}>
          <div style={{ fontSize: '12px' }}>Response Time</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{analytics.avgResponseTime}min</div>
        </div>
        <div style={{ padding: '15px', background: '#fa709a', borderRadius: '10px', color: 'white' }}>
          <div style={{ fontSize: '12px' }}>Revenue</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}></div>
        </div>
        <div style={{ padding: '15px', background: '#a8edea', borderRadius: '10px', color: '#333' }}>
          <div style={{ fontSize: '12px' }}> Satisfaction</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{analytics.customerSatisfaction}%</div>
        </div>
      </div>
    </div>
  )
}
