'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify({ name: email.split('@')[0], email }))
      router.push('/dashboard')
      setLoading(false)
    }, 500)
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f5f7fa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ 
        background: 'white', 
        padding: '48px',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '28px', fontWeight: '600', color: '#1a1a2e' }}>FleetMind</div>
          <p style={{ color: '#666', marginTop: '8px', fontSize: '14px' }}>Logistics Management</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#1a1a2e',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '24px', color: '#999', fontSize: '12px' }}>
          Demo: any email / any password
        </p>
      </div>
    </div>
  )
}
