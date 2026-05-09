import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Mock alerts - in real app, check monitoring thresholds
    const alerts = [
      {
        id: '1',
        title: 'High Memory Usage',
        message: 'Memory usage has exceeded 80% for the last 5 minutes',
        severity: 'warning',
        timestamp: new Date().toLocaleString(),
        acknowledged: false
      },
      {
        id: '2',
        title: 'Slow API Response',
        message: 'Average API response time is above 500ms',
        severity: 'warning',
        timestamp: new Date(Date.now() - 300000).toLocaleString(), // 5 minutes ago
        acknowledged: false
      }
    ]

    return NextResponse.json(alerts)
  } catch (error) {
    console.error('Performance alerts error:', error)
    return NextResponse.json({ error: 'Failed to load alerts' }, { status: 500 })
  }
}