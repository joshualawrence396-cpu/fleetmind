'use client'

import { useState, useEffect } from 'react'

export function DriverSafetyScore({ driverId }) {
  const [safetyData, setSafetyData] = useState(null)

  useEffect(() => {
    setSafetyData({
      currentScore: 85,
      rating: 'Good',
      harshBraking: 3,
      rapidAcceleration: 5,
      phoneUsage: 1,
      speedingEvents: 2,
      recommendations: ['Reduce rapid acceleration', 'Maintain steady speed']
    })
  }, [driverId])

  const getScoreColor = (score) => {
    if (score >= 90) return '#10b981'
    if (score >= 70) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div style={{ padding: '20px', background: 'white', borderRadius: '12px', marginTop: '20px' }}>
      <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>⭐ Driver Safety Score</h3>
      
      {safetyData && (
        <>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: getScoreColor(safetyData.currentScore) }}>
              {safetyData.currentScore}
            </div>
            <div>Safety Rating: {safetyData.rating}</div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            <div style={{ padding: '8px', background: '#f1f5f9', borderRadius: '6px', textAlign: 'center' }}>
              <div>🚦 Harsh Braking</div>
              <div style={{ fontWeight: 'bold' }}>{safetyData.harshBraking}</div>
            </div>
            <div style={{ padding: '8px', background: '#f1f5f9', borderRadius: '6px', textAlign: 'center' }}>
              <div>⚡ Rapid Accel.</div>
              <div style={{ fontWeight: 'bold' }}>{safetyData.rapidAcceleration}</div>
            </div>
            <div style={{ padding: '8px', background: '#f1f5f9', borderRadius: '6px', textAlign: 'center' }}>
              <div>📱 Phone Usage</div>
              <div style={{ fontWeight: 'bold' }}>{safetyData.phoneUsage}</div>
            </div>
            <div style={{ padding: '8px', background: '#f1f5f9', borderRadius: '6px', textAlign: 'center' }}>
              <div>⏱️ Speeding</div>
              <div style={{ fontWeight: 'bold' }}>{safetyData.speedingEvents}</div>
            </div>
          </div>
          
          <div style={{ padding: '10px', background: '#fef3c7', borderRadius: '8px' }}>
            <strong>💡 Recommendations:</strong>
            <ul style={{ marginTop: '8px', marginLeft: '20px' }}>
              {safetyData.recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
