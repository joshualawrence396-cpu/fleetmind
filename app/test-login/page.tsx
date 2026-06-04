'use client'

import { useState } from 'react'

type ResultData = {
  type: string
  data?: any
  status?: number
  meData?: any
  error?: string
}

export default function TestLogin() {
  const [email, setEmail] = useState('admin@fleetmind.com')
  const [password, setPassword] = useState('admin123')
  const [result, setResult] = useState<ResultData | null>(null)
  const [loading, setLoading] = useState(false)

  const testDatabase = async () => {
    setLoading(true)

    try {
      const res = await fetch('/api/test-db')
      const data = await res.json()

      setResult({
        type: 'db',
        data
      })
    } catch (error) {
      setResult({
        type: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    setLoading(false)
  }

  const testLogin = async () => {
    setLoading(true)

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      const data = await res.json()

      setResult({
        type: 'login',
        data,
        status: res.status
      })

      if (res.ok) {
        const meRes = await fetch('/api/me')
        const meData = await meRes.json()

        setResult(prev => ({
          ...(prev ?? { type: 'login' }),
          meData
        }))
      }
    } catch (error) {
      setResult({
        type: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1
        style={{
          fontSize: '28px',
          fontWeight: 'bold',
          marginBottom: '20px'
        }}
      >
        Debug Login
      </h1>

      <div
        style={{
          marginBottom: '20px',
          padding: '20px',
          background: '#f8fafc',
          borderRadius: '8px'
        }}
      >
        <h2>Test Database Connection</h2>

        <button
          onClick={testDatabase}
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Test Database
        </button>
      </div>

      <div
        style={{
          marginBottom: '20px',
          padding: '20px',
          background: '#f8fafc',
          borderRadius: '8px'
        }}
      >
        <h2>Test Login</h2>

        <div style={{ marginBottom: '10px' }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            style={{
              padding: '8px',
              marginRight: '10px',
              width: '250px'
            }}
          />

          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            style={{
              padding: '8px',
              width: '150px'
            }}
          />
        </div>

        <button
          onClick={testLogin}
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: '#22c55e',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Test Login
        </button>
      </div>

      {result && (
        <div
          style={{
            padding: '20px',
            background: '#1e293b',
            color: '#e2e8f0',
            borderRadius: '8px',
            overflow: 'auto'
          }}
        >
          <h3
            style={{
              color: '#60a5fa',
              marginBottom: '10px'
            }}
          >
            Result:
          </h3>

          <pre style={{ fontSize: '12px' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {loading && <div>Loading...</div>}
    </div>
  )
}
