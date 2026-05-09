'use client'

import { useState, useEffect } from 'react'

export function PredictiveETA({ origin = 'Warehouse', destination = 'Customer' }) {
  const [eta, setEta] = useState(null)

  useEffect(() => {
    setTimeout(() => {
      setEta({
        duration: 45,
        distance: 28.5,
        arrivalTime: new Date(Date.now() + 45 * 60000).toISOString(),
        suggestion: 'Take the M5 highway to avoid traffic'
      })
    }, 1000)
  }, [])

  return (
    <div style={{ padding: '20px', background: 'white', borderRadius: '12px', marginTop: '20px' }}>
      <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>🚀 Predictive ETA</h3>
      
      {eta && (
        <>
          <div style={{ fontSize: '36px', fontWeight: 'bold', textAlign: 'center', margin: '20px 0' }}>
            {eta.duration} min
          </div>
          
          <div style={{ display: 'grid', gap: '8px' }}>
            <div>📏 Distance: {eta.distance} km</div>
            <div>⏰ Arrival: {new Date(eta.arrivalTime).toLocaleTimeString()}</div>
            <div style={{ padding: '10px', background: '#dbeafe', borderRadius: '8px', marginTop: '10px' }}>
              💡 {eta.suggestion}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
