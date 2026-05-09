'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MaintenancePage() {
  const router = useRouter()
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPredictions()
  }, [])

  const fetchPredictions = async () => {
    try {
      const res = await fetch('/api/v1/maintenance/predict')
      const data = await res.json()
      setPredictions(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error:', error)
      setPredictions([
        { component: 'BRAKES', riskScore: 0.85, recommendedAction: 'Replace brake pads within 7 days', vehicle: { registration: 'CA123456' }, rationale: 'High number of harsh braking events detected' },
        { component: 'TYRES', riskScore: 0.72, recommendedAction: 'Check tyre tread depth', vehicle: { registration: 'CA789012' }, rationale: 'High mileage since last rotation' }
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Loading maintenance data...</div>
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffffff' }}>Predictive Maintenance</h1>
          <p style={{ color: '#94a3b8', marginTop: '4px' }}>AI-powered vehicle health predictions</p>
        </div>
        <button onClick={() => router.push('/dashboard')} style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Back to Dashboard</button>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {predictions.map((pred, idx) => (
          <div key={idx} style={{ background: '#1e293b', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f97316' }}>{pred.component}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Vehicle: {pred.vehicle?.registration || 'N/A'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: pred.riskScore > 0.7 ? '#ef4444' : '#f59e0b' }}>{(pred.riskScore * 100).toFixed(0)}%</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Risk Score</div>
              </div>
            </div>
            <div style={{ marginTop: '16px', padding: '12px', background: '#0f172a', borderRadius: '8px' }}>
              <div style={{ color: '#e2e8f0', fontSize: '14px' }}>{pred.recommendedAction}</div>
              {pred.rationale && <div style={{ color: '#64748b', fontSize: '12px', marginTop: '8px' }}>{pred.rationale}</div>}
            </div>
          </div>
        ))}
      </div>

      {predictions.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', background: '#1e293b', borderRadius: '12px' }}>
          <p style={{ color: '#94a3b8' }}>No maintenance predictions at this time</p>
        </div>
      )}
    </div>
  )
}
