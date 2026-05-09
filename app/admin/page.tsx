'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/dashboard')
  }, [router])
  
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="spinner"></div>
    </div>
  )
}
