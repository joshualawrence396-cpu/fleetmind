'use client'

import { useState } from 'react'

type RangeType = 'week' | 'month'

interface CarbonData {
  co2: number
  trees: number
}

export function CarbonFootprintTracker() {
  const [range, setRange] = useState<RangeType>('week')

  const data: Record<RangeType, CarbonData> = {
    week: {
      co2: 1250,
      trees: 18,
    },
    month: {
      co2: 4850,
      trees: 72,
    },
  }

  return (
    <div
      style={{
        padding: '20px',
        background: 'white',
        borderRadius: '12px',
        marginTop: '20px',
      }}
    >
      <h3
        style={{
          fontSize: '18px',
          marginBottom: '15px',
        }}
      >
        🌍 Carbon Footprint
      </h3>

      <select
        value={range}
        onChange={(e) =>
          setRange(e.target.value as RangeType)
        }
        style={{
          padding: '8px',
          marginBottom: '15px',
          width: '100%',
        }}
      >
        <option value="week">This Week</option>
        <option value="month">This Month</option>
      </select>

      <div
        style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#22c55e',
          textAlign: 'center',
        }}
      >
        {data[range].co2} kg
      </div>

      <div style={{ textAlign: 'center' }}>
        CO₂ Emissions
      </div>

      <div
        style={{
          marginTop: '15px',
          padding: '10px',
          background: '#f0fdf4',
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        🌳 {data[range].trees} trees needed to offset
      </div>
    </div>
  )
}