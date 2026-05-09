'use client'

import { useState } from 'react'

export function AutomatedInvoicing() {
  const [invoices, setInvoices] = useState([
    { id: 'INV-001', amount: 12500, period: 'May 2024', status: 'paid' },
    { id: 'INV-002', amount: 14200, period: 'April 2024', status: 'pending' }
  ])

  const generateInvoice = () => {
    const newInvoice = { id: 'INV-00' + (invoices.length + 1), amount: 13800, period: 'June 2024', status: 'pending' }
    setInvoices([newInvoice, ...invoices])
    alert('✅ Invoice generated!')
  }

  return (
    <div style={{ padding: '20px', background: 'white', borderRadius: '12px', marginTop: '20px' }}>
      <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>💰 Automated Invoicing</h3>
      <button onClick={generateInvoice} style={{ padding: '10px 20px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '8px', marginBottom: '20px', width: '100%' }}>Generate Invoice</button>
      {invoices.map((inv) => (
        <div key={inv.id} style={{ padding: '12px', border: '1px solid #e2e8f0', marginBottom: '10px', borderRadius: '8px' }}>
          <strong>{inv.id}</strong> - {inv.period} -  - <span style={{ color: inv.status === 'paid' ? '#10b981' : '#f59e0b' }}>{inv.status}</span>
        </div>
      ))}
    </div>
  )
}
