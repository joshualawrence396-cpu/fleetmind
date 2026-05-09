'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MasterLayout from '@/components/MasterLayout'

export default function DriversPage() {
  const router = useRouter()
  const [drivers] = useState([
    { id: 1, name: 'John Driver', phone: '+27721234567', status: 'Available', rating: 4.8 },
    { id: 2, name: 'Mike Smith', phone: '+27729876543', status: 'On Duty', rating: 4.9 },
    { id: 3, name: 'Sarah Johnson', phone: '+27721234987', status: 'Off Duty', rating: 4.7 }
  ])

  return (
    <MasterLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Drivers</h1>
        <button style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>+ Add Driver</button>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#64748b' }}>Name</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#64748b' }}>Phone</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#64748b' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', color: '#64748b' }}>Rating</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((d, i) => (
              <tr key={d.id} style={{ borderBottom: i < drivers.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                <td style={{ padding: '12px 16px', fontSize: '14px' }}>{d.name}</td>
                <td style={{ padding: '12px 16px', fontSize: '14px' }}>{d.phone}</td>
                <td style={{ padding: '12px 16px' }}><span style={{ padding: '2px 8px', background: '#d1fae5', color: '#065f46', borderRadius: '12px', fontSize: '11px' }}>{d.status}</span></td>
                <td style={{ padding: '12px 16px', fontSize: '14px' }}>⭐ {d.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MasterLayout>
  )
}
