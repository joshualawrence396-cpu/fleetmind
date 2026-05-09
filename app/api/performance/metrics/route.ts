import { NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '1h'

    // Mock performance metrics - in real app, collect from application monitoring
    const metrics = [
      {
        name: 'API Response Time',
        value: Math.floor(Math.random() * 200) + 100, // 100-300ms
        unit: 'ms',
        status: 'good' as const,
        trend: 'stable' as const
      },
      {
        name: 'Database Query Time',
        value: Math.floor(Math.random() * 50) + 20, // 20-70ms
        unit: 'ms',
        status: 'good' as const,
        trend: 'down' as const
      },
      {
        name: 'Error Rate',
        value: Math.floor(Math.random() * 2), // 0-2%
        unit: '%',
        status: 'good' as const,
        trend: 'stable' as const
      },
      {
        name: 'Active Users',
        value: Math.floor(Math.random() * 50) + 20, // 20-70 users
        unit: '',
        status: 'good' as const,
        trend: 'up' as const
      },
      {
        name: 'Memory Usage',
        value: Math.floor(Math.random() * 30) + 40, // 40-70%
        unit: '%',
        status: 'warning' as const,
        trend: 'up' as const
      },
      {
        name: 'Cache Hit Rate',
        value: Math.floor(Math.random() * 20) + 80, // 80-100%
        unit: '%',
        status: 'good' as const,
        trend: 'stable' as const
      }
    ]

    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Performance metrics error:', error)
    return NextResponse.json({ error: 'Failed to load metrics' }, { status: 500 })
  }
}