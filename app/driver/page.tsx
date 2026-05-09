'use client'

import { useState } from 'react'
import UnifiedNavigation from '@/components/UnifiedNavigation'

export default function DriverApp() {
  const [driverId, setDriverId] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)

  const handleLogin = () => {
    if (driverId) {
      setLoggedIn(true)
    }
  }

  if (loggedIn) {
    return (
      <div>
        <UnifiedNavigation />
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
            <h2>Welcome Driver!</h2>
            <p>Your today's route will appear here.</p>
            <button onClick={() => setLoggedIn(false)} style={{ marginTop: '20px', padding: '10px 20px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Logout</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <UnifiedNavigation />
      <div style={{ padding: '24px', maxWidth: '400px', margin: '0 auto' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>FleetMind Driver</h1>
          <input type="text" placeholder="Driver ID or Phone Number" value={driverId} onChange={(e) => setDriverId(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '16px' }} />
          <button onClick={handleLogin} style={{ width: '100%', padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Login</button>
        </div>
      </div>
    </div>
  )
}
