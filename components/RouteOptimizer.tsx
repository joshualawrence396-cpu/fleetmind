'use client'

import { useState } from 'react'

export function RouteOptimizer() {
  const [optimizing, setOptimizing] = useState(false)
  const [routes, setRoutes] = useState(null)

  const optimizeRoutes = () => {
    setOptimizing(true)
    setTimeout(() => {
      setRoutes([
        { vehicle: 'V001', distance: 45, stops: ['Warehouse', 'Customer A', 'Customer B'] },
        { vehicle: 'V002', distance: 38, stops: ['Warehouse', 'Customer C', 'Customer D'] }
      ])
      setOptimizing(false)
    }, 1500)
  }

  return (
    <div style={{ padding: '20px', background: 'white', borderRadius: '12px', marginTop: '20px' }}>
      <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>🤖 AI Route Optimization</h3>
      <button onClick={optimizeRoutes} disabled={optimizing} style={{ padding: '10px 20px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        {optimizing ? 'Optimizing...' : '✨ Optimize Routes'}
      </button>
      {routes && routes.map((r, i) => (
        <div key={i} style={{ marginTop: '15px', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
          <strong>Vehicle {r.vehicle}</strong>: {r.distance}km - {r.stops.join(' → ')}
        </div>
      ))}
    </div>
  )
}
