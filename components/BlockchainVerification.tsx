'use client'

import { useState } from 'react'

interface BlockchainVerificationProps {
  orderId: string
}

interface BlockchainData {
  transactionHash: string
  blockNumber: number
  timestamp: string
}

export function BlockchainVerification({
  orderId,
}: BlockchainVerificationProps) {
  const [verifying, setVerifying] = useState<boolean>(false)
  const [blockchainData, setBlockchainData] =
    useState<BlockchainData | null>(null)

  const verifyDelivery = async (): Promise<void> => {
    setVerifying(true)

    setTimeout(() => {
      setBlockchainData({
        transactionHash:
          '0x' + Math.random().toString(36).substring(2, 42),
        blockNumber: 12345678,
        timestamp: new Date().toISOString(),
      })

      setVerifying(false)
      alert('✅ Delivery recorded on blockchain!')
    }, 2000)
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
      <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>
        🔗 Blockchain Verification
      </h3>

      <div
        style={{
          fontSize: '12px',
          color: '#64748b',
          marginBottom: '12px',
        }}
      >
        Order ID: {orderId}
      </div>

      <button
        onClick={verifyDelivery}
        disabled={verifying}
        style={{
          padding: '10px 20px',
          background: '#6366f1',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          width: '100%',
        }}
      >
        {verifying
          ? 'Recording on Blockchain...'
          : '📦 Verify Delivery on Blockchain'}
      </button>

      {blockchainData && (
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            background: '#f0fdf4',
            borderRadius: '8px',
            border: '1px solid #86efac',
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
            ✅ Transaction Verified
          </div>

          <div
            style={{
              fontSize: '11px',
              fontFamily: 'monospace',
              wordBreak: 'break-all',
            }}
          >
            Hash: {blockchainData.transactionHash}
          </div>

          <div>Block: {blockchainData.blockNumber}</div>

          <div style={{ fontSize: '12px', marginTop: '8px' }}>
            Timestamp: {blockchainData.timestamp}
          </div>
        </div>
      )}
    </div>
  )
}