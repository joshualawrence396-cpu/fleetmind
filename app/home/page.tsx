"use client"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
    if (status === "authenticated") router.push("/dashboard")
  }, [status, router])

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "white", fontSize: 18 }}>Loading FleetMind...</div>
    </div>
  )
}