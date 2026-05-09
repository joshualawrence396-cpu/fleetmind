import Redis from 'ioredis'

const getRedisUrl = () => {
  if (process.env.UPSTASH_REDIS_REST_URL) {
    return process.env.UPSTASH_REDIS_REST_URL
  }
  return 'redis://localhost:6379'
}

export const redis = new Redis(getRedisUrl())

export const STREAMS = {
  VEHICLE_LOCATIONS: 'stream:vehicle:locations',
  SHIPMENT_UPDATES: 'stream:shipment:updates',
  DRIVER_STATUS: 'stream:driver:status',
  ALERTS: 'stream:alerts'
}

// Publish event to stream
export async function publishToStream(stream: string, data: any) {
  try {
    await redis.xadd(stream, '*', 'data', JSON.stringify(data))
  } catch (error) {
    console.error('Failed to publish to stream:', error)
  }
}

// Subscribe to stream (for consumers)
export async function consumeStream(
  stream: string, 
  callback: (data: any) => Promise<void>
) {
  let lastId = '0'
  
  while (true) {
    try {
      const results = await redis.xread('BLOCK', 5000, 'STREAMS', stream, lastId)
      if (results) {
        for (const [streamName, messages] of results) {
          for (const [id, fields] of messages) {
            const data = JSON.parse(fields[1])
            await callback(data)
            lastId = id
          }
        }
      }
    } catch (error) {
      console.error('Stream consumption error:', error)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
}
