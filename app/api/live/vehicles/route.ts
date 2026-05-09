import { NextRequest } from 'next/server'
import { redis, STREAMS } from '@/lib/redis'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const vehicleId = searchParams.get('vehicleId')
  
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode('data: connected\n\n'))
      
      const subscribeToStream = async () => {
        let lastId = '0'
        while (true) {
          try {
            const results = await redis.xread('BLOCK', 5000, 'STREAMS', 
              STREAMS.VEHICLE_LOCATIONS, lastId)
            
            if (results) {
              for (const [streamName, messages] of results) {
                for (const [id, fields] of messages) {
                  const data = JSON.parse(fields[1])
                  
                  if (!vehicleId || data.vehicleId === vehicleId) {
                    controller.enqueue(encoder.encode(data: \n\n))
                  }
                  lastId = id
                }
              }
            }
          } catch (error) {
            console.error('SSE error:', error)
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        }
      }
      
      subscribeToStream()
      
      req.signal.addEventListener('abort', () => {
        controller.close()
      })
    }
  })
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
