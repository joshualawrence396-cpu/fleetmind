import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      // Send initial vehicle positions
      const vehicles = await prisma.vehicle.findMany({
        where: { latitude: { not: null } },
        include: { driver: { select: { name: true } } }
      })
      send({ type: "INIT", vehicles })

      // Poll every 5s for updates
      let running = true
      const interval = setInterval(async () => {
        if (!running) return
        try {
          const updated = await prisma.vehicle.findMany({
            where: { latitude: { not: null } },
            include: { driver: { select: { name: true } } }
          })
          send({ type: "UPDATE", vehicles: updated, timestamp: new Date() })
        } catch { running = false; clearInterval(interval) }
      }, 5000)

      // Cleanup after 5 minutes
      setTimeout(() => { running = false; clearInterval(interval); controller.close() }, 300000)
    }
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    }
  })
}