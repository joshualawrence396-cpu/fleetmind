'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (response.ok) {
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false
        })
        
        if (!result?.error) {
          router.push('/fleet-tracker')
        } else {
          router.push('/auth/login')
        }
      } else {
        setError(data.message || 'Signup failed')
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>🚛</div>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join FleetMind today</p>
        </div>

        <form onSubmit={handleSignup}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          {error && <div style={styles.errorMessage}>{error}</div>}

          <button type="submit" disabled={loading} style={loading ? styles.buttonDisabled : styles.button}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Already have an account?{' '}
            <Link href="/auth/login" style={styles.link}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  header: { textAlign: 'center', marginBottom: '30px' },
  logo: { fontSize: '50px', marginBottom: '10px' },
  title: { fontSize: '28px', fontWeight: 'bold', color: '#1e293b' },
  subtitle: { color: '#64748b', marginTop: '8px' },
  inputGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '8px', color: '#334155', fontWeight: '500' },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '16px',
    outline: 'none'
  },
  errorMessage: {
    background: '#fee2e2',
    color: '#dc2626',
    padding: '12px',
    borderRadius: '10px',
    marginBottom: '20px',
    fontSize: '14px'
  },
  button: {
    width: '100%',
    padding: '14px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  buttonDisabled: {
    width: '100%',
    padding: '14px',
    background: '#94a3b8',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'not-allowed'
  },
  footer: { marginTop: '20px', textAlign: 'center' },
  footerText: { color: '#64748b' },
  link: { color: '#667eea', textDecoration: 'none', fontWeight: '500' }
}
