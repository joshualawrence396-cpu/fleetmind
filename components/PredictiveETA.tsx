'use client'

import { useState, useEffect } from 'react'

type ETAData = {
  duration: number
  distance: number
  arrivalTime: string
  suggestion: string
}

type PredictiveETAProps = {
  origin?: string
  destination?: string
}

export function PredictiveETA({
  origin = 'Warehouse',
  destination = 'Customer',
}: PredictiveETAProps) {
  const [eta, setEta] = useState<ETAData | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setEta({
        duration: 45,
        distance: 28.5,
        arrivalTime: new Date(Date.now() + 45 * 60000).toISOString(),
        suggestion: 'Take the M5 highway to avoid traffic',
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      style={{
        padding: '20px',
        background: 'white',
        borderRadius: '12px',
        marginTop: '20px',
      }}
    >
      <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>
        🚀 Predictive ETA
      </h3>

      <div
        style={{
          fontSize: '13px',
          color: '#64748b',
          marginBottom: '12px',
        }}
      >
        {origin} → {destination}
      </div>

      {eta ? (
        <>
          <div
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              textAlign: 'center',
              margin: '20px 0',
            }}
          >
            {eta.duration} min
          </div>

          <div style={{ display: 'grid', gap: '8px' }}>
            <div>📏 Distance: {eta.distance} km</div>
            <div>
              ⏰ Arrival:{' '}
              {new Date(eta.arrivalTime).toLocaleTimeString()}
            </div>
            <div
              style={{
                padding: '10px',
                background: '#dbeafe',
                borderRadius: '8px',
                marginTop: '10px',
              }}
            >
              💡 {eta.suggestion}
            </div>
          </div>
        </>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '20px',
            color: '#64748b',
          }}
        >
          Calculating ETA...
        </div>
      )}
    </div>
  )
}
