'use client'

import { useState } from 'react'
import UnifiedNavigation from '@/components/UnifiedNavigation'

export default function OptimizePage() {
  const [hubId, setHubId] = useState('')
  const [routeDate, setRouteDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleOptimize = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/v1/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hubId, routeDate })
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Optimization failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <UnifiedNavigation />
      <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>Route Optimization Engine</h1>
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Hub ID</label>
            <input type="text" value={hubId} onChange={(e) => setHubId(e.target.value)} placeholder="Enter hub ID" style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Route Date</label>
            <input type="date" value={routeDate} onChange={(e) => setRouteDate(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
          </div>
          <button onClick={handleOptimize} disabled={loading} style={{ width: '100%', padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            {loading ? 'Optimizing...' : 'Optimize Routes'}
          </button>
          {result && result.success && (
            <div style={{ marginTop: '20px', padding: '16px', background: '#d1fae5', borderRadius: '8px' }}>
              <p>? Routes optimized successfully!</p>
              <p>Total distance: {result.totalDistance} km</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
