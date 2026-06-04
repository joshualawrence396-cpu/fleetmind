'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MasterLayout from '@/components/MasterLayout'

interface Vehicle {
  id?: string
  registration?: string
  make?: string
  model?: string
  type?: string
  status?: string
  [key: string]: any
}

export default function VehiclesPage() {
  const router = useRouter()

  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [showForm, setShowForm] = useState(false)

  const [newVehicle, setNewVehicle] = useState({
    registration: '',
    make: '',
    model: '',
    type: 'VAN_LARGE'
  })

  useEffect(() => {
    fetch('/api/v1/vehicles')
      .then((res) => res.json())
      .then((data) => setVehicles(Array.isArray(data) ? data : []))
      .catch(() => setVehicles([]))
  }, [])

  const addVehicle = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    const res = await fetch('/api/v1/vehicles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newVehicle)
    })

    if (res.ok) {
      const vehicle: Vehicle = await res.json()

      setVehicles((prev) => [...prev, vehicle])

      setShowForm(false)

      setNewVehicle({
        registration: '',
        make: '',
        model: '',
        type: 'VAN_LARGE'
      })
    }
  }

  return (
    <MasterLayout>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}
      >
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 'bold'
          }}
        >
          Vehicles
        </h1>

        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: '8px 16px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          + Add Vehicle
        </button>
      </div>

      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}
        >
          <thead
            style={{
              background: '#f8fafc',
              borderBottom: '1px solid #e2e8f0'
            }}
          >
            <tr>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#64748b' }}>
                Registration
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#64748b' }}>
                Make/Model
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#64748b' }}>
                Status
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#64748b' }}>
                Type
              </th>
            </tr>
          </thead>

          <tbody>
            {vehicles.map((v, i) => (
              <tr
                key={v.id ?? i}
                style={{
                  borderBottom:
                    i < vehicles.length - 1
                      ? '1px solid #e2e8f0'
                      : 'none'
                }}
              >
                <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                  {v.registration}
                </td>

                <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                  {v.make} {v.model}
                </td>

                <td style={{ padding: '12px 16px' }}>
                  <span
                    style={{
                      padding: '2px 8px',
                      background: '#d1fae5',
                      color: '#065f46',
                      borderRadius: '12px',
                      fontSize: '11px'
                    }}
                  >
                    {v.status ?? 'Active'}
                  </span>
                </td>

                <td
                  style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#64748b'
                  }}
                >
                  {v.type?.replace('_', ' ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {vehicles.length === 0 && (
          <div
            style={{
              padding: '40px',
              textAlign: 'center',
              color: '#999'
            }}
          >
            No vehicles yet
          </div>
        )}
      </div>

      {/* Keep the rest of your modal code unchanged */}
    </MasterLayout>
  )
}